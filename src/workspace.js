import { mkdir, mkdtemp, rename, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { discover } from './schema.js'
import { evaluate, validateCheck } from './checks.js'
import { listCases, loadCase, saveCase } from './history.js'
import { run } from './process.js'

async function workspace(cwd, dir = '.') {
  if (typeof dir !== 'string' || !dir.trim()) throw new Error('dir 应为工作区目录')
  const root = path.resolve(cwd, dir)
  const config = path.join(root, 'buf.yaml')
  if (!(await stat(config)).isFile()) throw new Error('需要配置文件 ' + config)
  return root
}

function checkRequest({ address, method, data = '{}', plaintext = false, name = '', check = {} }) {
  if (typeof address !== 'string' || !/^(?:\[[0-9a-f:.%a-z_-]+\]|[\w.-]+):[0-9]+$/i.test(address)
      || address.startsWith('-') || +address.split(':').at(-1) > 65535 || +address.split(':').at(-1) < 1) {
    throw new Error('address 应为 host:port 或 [IPv6]:port')
  }
  if (typeof method !== 'string' || !/^\/?(?:[a-z_]\w*\.)*[a-z_]\w*\/[a-z_]\w*$/i.test(method)) {
    throw new Error('method 应为 package.Service/Method')
  }
  if (typeof plaintext !== 'boolean') throw new Error('plaintext 应为布尔值')
  if (typeof data !== 'string') throw new Error('data 应为 JSON 文本')
  JSON.parse(data)
  validateCheck(check)
  if (typeof name !== 'string' || name.length > 160) throw new Error('用例名称最长 160 字符')
  return { name, check, address, method: method.replace(/^\//, ''), data, plaintext }
}

async function build(root, file, signal) {
  return run('buf', ['build', '.', '--as-file-descriptor-set', '-o', file], root, undefined, signal)
}

async function buf(args, root, signal) {
  if (args.action === 'lint') return { stage: 'buf lint', ...await run('buf', ['lint', '.'], root, undefined, signal) }
  if (args.action !== 'build') throw new Error('buf action 应为 lint 或 build')
  const out = path.join(root, '.ilabrat')
  await mkdir(out, { recursive: true })
  const temp = await mkdtemp(path.join(out, 'build-'))
  try {
    const staged = path.join(temp, 'schema.binpb')
    const result = { stage: 'buf build', ...await build(root, staged, signal) }
    if (result.ok) {
      result.descriptor = path.join(out, 'schema.binpb')
      await rename(staged, result.descriptor)
    }
    return result
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

async function invoke(request, headers, root, signal) {
  const temp = await mkdtemp(path.join(tmpdir(), 'ilabrat-'))
  try {
    const descriptor = path.join(temp, 'schema.binpb')
    const compiled = await build(root, descriptor, signal)
    if (!compiled.ok) return { stage: 'buf build', ...compiled }
    const flags = ['-use-reflection=false', '-protoset', descriptor, '-format', 'json', '-d', '@']
    for (const [key, value] of Object.entries(headers)) flags.push('-rpc-header', key + ': ' + value)
    if (request.plaintext) flags.push('-plaintext')
    const started = performance.now()
    const { stdout, ...status } = await run('grpcurl', [...flags, request.address, request.method], root, request.data, signal)
    let response = stdout || null
    if (stdout) {
      try { response = JSON.parse(stdout) } catch { /* Server streams contain consecutive JSON messages. */ }
    }
    return { stage: 'grpcurl', ...status, response, rpcMs: Math.round(performance.now() - started) }
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}

export async function execute(command, args, cwd, signal) {
  const started = performance.now()
  const elapsed = () => Math.round(performance.now() - started)
  try {
    signal?.throwIfAborted()
    const root = await workspace(cwd, args.dir)
    if (command === 'buf' && args.action === 'schema') return { ...await discover(root, signal), elapsedMs: elapsed() }
    if (command === 'grpcurl' && args.action === 'history') return { ok: true, cases: await listCases(root), elapsedMs: elapsed() }
    if (command === 'grpcurl' && args.action === 'load') return { ok: true, request: await loadCase(root, args.caseId), elapsedMs: elapsed() }
    if (command === 'grpcurl' && args.action !== undefined && args.action !== 'send') throw new Error('未知 grpcurl action')
    if (command === 'buf') return { ...await buf(args, root, signal), elapsedMs: elapsed() }
    if (command !== 'grpcurl') throw new Error('未知命令 ' + command)
    if (args.save !== undefined && typeof args.save !== 'boolean') throw new Error('save 应为布尔值')
    if (args.caseId !== undefined && ['address', 'method', 'data', 'plaintext', 'name', 'check'].some(k => args[k] !== undefined)) {
      throw new Error('回放用例时可指定 caseId、dir、metadata 和 save')
    }
    const source = args.caseId === undefined ? args : await loadCase(root, args.caseId)
    const request = checkRequest(source)
    const headers = args.metadata ?? {}
    if (!headers || typeof headers !== 'object' || Array.isArray(headers)) throw new Error('metadata 应为键值对象')
    for (const [key, value] of Object.entries(headers)) {
      if (!/^[a-z0-9][a-z0-9._-]*$/.test(key) || typeof value !== 'string' || /[\r\n\x00]/.test(value)) throw new Error('无效的 gRPC metadata')
    }
    for (const key of source.metadataKeys ?? []) {
      if (!Object.hasOwn(headers, key)) throw new Error('回放前请填写 metadata 字段 ' + key)
    }
    request.metadataKeys = Object.keys(headers)
    const result = { ...await invoke(request, headers, root, signal), elapsedMs: elapsed() }
    result.checks = evaluate(request.check, result)
    result.ok = result.checks.every(check => check.passed)
    if (args.save) {
      try { result.caseId = await saveCase(root, request, result) }
      catch (error) { result.historyError = error.message }
    }
    return result
  } catch (error) {
    signal?.throwIfAborted()
    return { ok: false, stage: command, stderr: error.message, exitCode: null, elapsedMs: elapsed() }
  }
}
