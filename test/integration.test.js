import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { once } from 'node:events'
import { createServer } from 'node:http2'
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execute } from '../src/workspace.js'
import { apply } from '../src/plugin.js'

const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url))
const exec = promisify(execFile)

test('真实 Buf 工作区与关闭反射的 gRPC 服务', async t => {
  const dir = await mkdtemp(path.join(tmpdir(), 'ilabrat 测试 '))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const proto = path.join(dir, 'proto', 'echo', 'v1')
  await mkdir(proto, { recursive: true })
  await writeFile(path.join(dir, 'buf.yaml'), 'version: v2\nmodules:\n  - path: proto\n')
  await writeFile(path.join(proto, 'data.proto'), 'syntax="proto3"; package echo.v1; message Payload { string text = 1; }')
  const schema = path.join(proto, 'service.proto')
  const source = [
    'syntax="proto3"; package echo.v1; import "echo/v1/data.proto";',
    'service EchoService { rpc Echo(EchoRequest) returns (EchoResponse); }',
    'message EchoRequest { Payload payload = 1; } message EchoResponse { Payload payload = 1; }',
  ].join('\n')
  await writeFile(schema, source)
  let calls = 0, receivedMetadata
  const server = createServer()
  server.on('stream', (stream, headers) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => {
      assert.equal(headers[':path'], '/echo.v1.EchoService/Echo')
      receivedMetadata = headers['x-test-case']
      calls++
      stream.respond({ ':status': 200, 'content-type': 'application/grpc' }, { waitForTrailers: true })
      stream.on('wantTrailers', () => stream.sendTrailers({ 'grpc-status': '0' }))
      stream.end(Buffer.concat(chunks))
    })
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(() => new Promise(resolve => server.close(resolve)))
  const address = '127.0.0.1:' + server.address().port
  const method = 'echo.v1.EchoService/Echo'
  const payload = { payload: { text: '引号 " 空格 & $HOME' } }
  const data = JSON.stringify(payload)
  const args = { address, method, data, plaintext: true }
  async function callCli(argv, cwd = dir) {
    return JSON.parse((await exec(process.execPath, [cli, ...argv], { cwd })).stdout)
  }

  await t.test('CLI 从当前目录 lint，用指定目录构建描述符', async () => {
    assert.equal((await callCli(['buf', 'lint'])).ok, true)
    const built = await callCli(['buf', 'build', '--dir', dir], tmpdir())
    assert.ok((await stat(built.descriptor)).size > 0)
  })
  await t.test('CLI 通过本地 schema 调用、保存再回放', async () => {
    const result = await callCli(['grpcurl', address, method, '--data', data, '--plaintext', '--save'])
    assert.deepEqual(result.response, payload)
    assert.ok(result.elapsedMs >= result.rpcMs && result.exitCode === 0)
    const record = JSON.parse(await readFile(path.join(dir, '.ilabrat', 'history', result.caseId + '.json')))
    assert.equal(record.request.data, data)
    assert.deepEqual((await callCli(['grpcurl', '--case', result.caseId])).response, payload)
    assert.equal(calls, 2)
  })
  await t.test('插件使用 DSH 当前会话目录，注册两个工具', async () => {
    const tools = new Map()
    apply({ inject() {}, tools: { register: tool => tools.set(tool.name, tool) }, workingDirectory: { ensure: () => dir } })
    assert.deepEqual([...tools.keys()], ['ilabrat_buf', 'ilabrat_grpcurl'])
    const result = await tools.get('ilabrat_grpcurl').execute(args, { agent: {}, signal: new AbortController().signal })
    assert.deepEqual(result.response, payload)
  })
  await t.test('方法发现和嵌套 JSON 模板', async () => {
    const result = await callCli(['buf', 'schema'])
    assert.equal(result.methods[0].name, method)
    assert.deepEqual(result.methods[0].template, { payload: { text: '' } })
  })
  await t.test('元数据、字段断言、用例索引和回放', async () => {
    const check = { pointer: '/payload/text', equals: payload.payload.text, maxMs: 60000 }
    const metadata = { 'x-test-case': 'local-verification' }
    const result = await execute('grpcurl', { ...args, name: '回归', metadata, check, save: true }, dir)
    assert.equal(result.ok, true)
    assert.equal(receivedMetadata, metadata['x-test-case'])
    assert.deepEqual(result.checks.map(check => check.passed), [true, true, true])
    const loaded = await execute('grpcurl', { action: 'load', caseId: result.caseId }, dir)
    assert.deepEqual(loaded.request.metadataKeys, ['x-test-case'])
    assert.equal(Object.hasOwn(loaded.request, 'metadata'), false)
    assert.equal((await callCli(['grpcurl', '--history'])).cases[0].name, '回归')
    assert.equal((await execute('grpcurl', { caseId: result.caseId }, dir)).ok, false)
    const replay = await callCli(['grpcurl', '--case', result.caseId, '--metadata', JSON.stringify(metadata)])
    assert.equal(replay.ok, true)
    const failed = await execute('grpcurl', { ...args, check: { ...check, equals: 'different' } }, dir)
    assert.equal(failed.ok, false)
    assert.equal(failed.exitCode, 0)
    assert.equal(failed.checks.at(-1).passed, false)
  })
  await t.test('非法 JSON、未知方法和编译失败返回对应诊断', async () => {
    const invalid = await execute('grpcurl', { ...args, data: '{' }, dir)
    assert.equal(invalid.ok, false)
    assert.ok(invalid.stderr && invalid.elapsedMs >= 0)
    const unknown = await execute('grpcurl', { ...args, method: 'echo.v1.EchoService/Missing' }, dir)
    assert.equal(unknown.ok, false)
    assert.ok(unknown.stderr && unknown.exitCode > 0)
    await writeFile(schema, source + '\nbroken')
    const broken = await execute('grpcurl', args, dir)
    assert.equal(broken.stage, 'buf build')
    assert.equal(broken.ok, false)
    assert.equal(calls, 6)
    await assert.rejects(callCli(['buf', 'build']), error => JSON.parse(error.stdout).ok === false)
  })
})
