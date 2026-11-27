import ssh2 from 'ssh2'
import { createHash, randomUUID } from 'node:crypto'
import * as fs from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { credentials, endpoint } from './profiles.js'
import { run } from './process.js'

const fingerprint = key => 'SHA256:' + createHash('sha256').update(key).digest('base64').replace(/=+$/, '')
const quote = s => "'" + s.replaceAll("'", "'\\''") + "'"

function handshake(config, verify, signal) {
  signal?.throwIfAborted()
  const client = new ssh2.Client()
  const abort = () => client.destroy()
  signal?.addEventListener('abort', abort, { once: true })
  client.once('close', () => signal?.removeEventListener('abort', abort))
  return new Promise((resolve, reject) => {
    client.on('error', reject)
    client.once('close', () => reject(signal?.reason || new Error('SSH 连接已断开')))
    client.once('ready', () => { signal?.removeEventListener('abort', abort); resolve(client) })
    client.connect({ ...config, readyTimeout: 12000, hostVerifier: verify })
  })
}

export async function probe(input, signal) {
  let observed
  try { await handshake({ ...endpoint(input), username: 'ilabrat-probe' }, key => { observed = fingerprint(key); return false }, signal) }
  catch (error) { if (!observed) throw error }
  return observed
}

function remoteRun(client, tool, args, cwd, input, signal) {
  signal?.throwIfAborted()
  const cmd = 'cd ' + quote(cwd) + ' && exec timeout -k 2 60 ' + [tool,...args].map(quote).join(' ')
  return new Promise((resolve, reject) => {
    let channel
    const abort = () => {
      // Keep SFTP available for the caller's temporary descriptor cleanup.
      if (channel) {
        channel.signal('KILL', () => {})
        channel.close()
      }
      finish(signal.reason || new Error('操作已取消'))
    }
    const timer = setTimeout(() => {
      if (channel) channel.close()
      finish(new Error(tool + ' 超时'))
    }, 65000)
    const finish = (error, value) => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      client.removeListener('close', disconnected)
      if (error) reject(error)
      else resolve(value)
    }
    const disconnected = () => finish(signal?.reason || new Error('SSH 连接已断开'))
    client.once('close', disconnected)
    signal?.addEventListener('abort', abort, {once:true})
    client.exec(cmd, (error, stream) => {
      if (error) return finish(error)
      channel = stream
      if (signal?.aborted) return abort()
      const stdout = [], stderr = []
      let bytes = 0
      function capture(target, chunk) {
        bytes += chunk.length
        if (bytes > 4 * 1024 * 1024) { stream.close(); finish(new Error(tool + ' 输出超过 4 MiB')) }
        else target.push(chunk)
      }
      stream.on('data', b => capture(stdout,b))
      stream.stderr.on('data', b => capture(stderr,b))
      stream.on('error', e => finish(e))
      stream.on('exit', (code, termination) => { stream.ilabratExit = { code, termination } })
      stream.on('close', (status, reason) => {
        const { code, termination } = stream.ilabratExit || { code: status, termination: reason }
        finish(null, { ok: code === 0, exitCode: code ?? null, stdout: Buffer.concat(stdout).toString().trimEnd(),
          stderr: Buffer.concat(stderr).toString().trimEnd() || (code === 124 ? tool + ' 超过 60 秒' : termination || '') })
      })
      stream.end(input)
    })
  })
}

const local = {
  path, stat: fs.stat, mkdir: fs.mkdir, rename: fs.rename, run, temp: tmpdir(),
  resolve: (cwd, name) => path.resolve(cwd,name),
  async entries(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true })
    return Promise.all(files.map(async f => {
      let type = f
      if (f.isSymbolicLink()) { try { type = await fs.stat(path.join(dir, f.name)) } catch { /* broken link */ } }
      return { name: f.name, directory: type.isDirectory(), regular: type.isFile() }
    }))
  },
  temporary: parent => fs.mkdtemp(path.join(parent, 'ilabrat-')),
  cleanup: dir => fs.rm(dir, { recursive: true, force: true })
}

export async function withSource(id, cwd, signal, action) {
  if (!id || id === 'local') return action(local, cwd)
  const profile = await credentials(id)
  let mismatch = false
  let client
  try {
    client = await handshake(profile, key => {
      mismatch = fingerprint(key) !== profile.fingerprint
      return !mismatch
    }, signal)
  } catch (error) {
    if (mismatch) throw new Error('SSH 主机指纹已变化，请重新核实该来源')
    throw error
  }
  try {
    // A stalled SFTP server must not leave navigation waiting indefinitely.
    const deadline = setTimeout(() => client.destroy(), 150_000)
    client.once('close', () => clearTimeout(deadline))
    const interruptBrowse = () => client.destroy()
    signal?.addEventListener('abort', interruptBrowse, {once:true})
    client.once('close', () => signal?.removeEventListener('abort', interruptBrowse))
    signal?.throwIfAborted()
    const sftp = await promisify(client.sftp).call(client)
    const call = (name, ...args) => promisify(sftp[name]).call(sftp, ...args)
    const home = await call('realpath', '.')
    const p = path.posix
    const remote = {
      path: p, temp: '/tmp', stat: file => call('stat', file),
      resolve: (base, input) => p.resolve(base, input === '~' ? home : input.startsWith('~/') ? p.join(home,input.slice(2)) : input),
      run: async (...args) => {
        signal?.removeEventListener('abort', interruptBrowse)
        return remoteRun(client, ...args)
      },
      async entries(dir) {
        const files = await call('readdir',dir)
        const result = []
        for (const { filename,attrs } of files) {
          let type = attrs
          if (attrs.isSymbolicLink()) { try { type = await call('stat',p.join(dir,filename)) } catch { continue } }
          result.push({ name: filename, directory: type.isDirectory(), regular: type.isFile() })
        }
        return result
      },
      async mkdir(dir) {
        try { await call('mkdir',dir,{mode:0o700}) }
        catch (e) { if (!(await call('stat',dir)).isDirectory()) throw e }
      },
      async temporary(parent) {
        const dir = p.join(parent,'ilabrat-' + randomUUID())
        await call('mkdir',dir,{mode:0o700})
        return dir
      },
      async cleanup(dir) {
        try { await call('unlink',p.join(dir,'schema.binpb')) } catch (e) { if (e.code !== 2) throw e }
        await call('rmdir',dir)
      },
      rename: (a,b) => call('ext_openssh_rename',a,b)
    }
    return await action(remote, home)
  } finally { client.end() }
}

export async function browse(io, cwd, input = '.') {
  const dir = io.resolve(cwd, input || '.')
  const entries = (await io.entries(dir))
    .filter(e => e.directory || (e.regular && (e.name.endsWith('.proto') || e.name === 'buf.yaml')))
    .sort((a,b) => Number(b.directory) - Number(a.directory) || a.name.localeCompare(b.name))
    .map(e => ({ name: e.name, path: io.path.join(dir,e.name), directory: e.directory }))
  const roots = []
  if (io === local && process.platform === 'win32') {
    const drives = Array.from({ length:26 }, (_,i) => String.fromCharCode(65+i) + ':\\')
    await Promise.all(drives.map(async drive => {
      try { if ((await fs.stat(drive)).isDirectory()) roots.push(drive) } catch { /* unavailable drive */ }
    }))
    roots.sort()
  }
  return { ok: true, dir, parent: io.path.dirname(dir), roots, entries }
}
