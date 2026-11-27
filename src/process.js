import { spawn } from 'node:child_process'
import { access, stat } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'

async function executable(tool, cwd) {
  const name = process.platform === 'win32' ? tool + '.exe' : tool
  for (const entry of (process.env.PATH ?? '').split(path.delimiter)) {
    if (!entry) continue
    const file = path.resolve(cwd, entry.replace(/^"(.*)"$/, '$1'), name)
    try {
      await access(file, constants.X_OK)
      if ((await stat(file)).isFile()) return file
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR', 'EACCES'].includes(error.code)) throw error
    }
  }
  throw new Error('PATH 中找不到可执行文件 ' + name)
}

export async function run(tool, args, cwd, input, signal) {
  const program = await executable(tool, cwd)
  signal?.throwIfAborted()
  return new Promise((resolve, reject) => {
    const child = spawn(program, args, { cwd, shell: false, windowsHide: true })
    const stdout = [], stderr = []
    let bytes = 0, failure
    const stop = (error) => {
      if (failure) return
      failure = error
      child.kill('SIGKILL')
    }
    const abort = () => stop(signal.reason)
    signal?.addEventListener('abort', abort, { once: true })
    const timer = setTimeout(() => stop(new Error(tool + ' 超过 60 秒')), 60_000)
    function capture(stream, target) {
      stream.on('data', chunk => {
        bytes += chunk.length
        if (bytes > 4 * 1024 * 1024) stop(new Error(tool + ' 输出超过 4 MiB'))
        else target.push(chunk)
      })
    }
    capture(child.stdout, stdout)
    capture(child.stderr, stderr)
    child.on('error', error => { failure ??= error })
    child.stdin.on('error', error => {
      if (!['EPIPE', 'ECONNRESET', 'EOF'].includes(error.code)) stop(error)
    })
    child.on('close', (code, termination) => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', abort)
      if (failure) return reject(failure)
      resolve({
        ok: code === 0, exitCode: code,
        stdout: Buffer.concat(stdout).toString('utf8').trimEnd(),
        stderr: Buffer.concat(stderr).toString('utf8').trimEnd() || (termination ?? ''),
      })
    })
    child.stdin.end(input)
  })
}
