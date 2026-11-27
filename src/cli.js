#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { execute } from './workspace.js'

const usage = [
  'ilabrat buf <lint|build|schema> [--dir DIR]',
  'ilabrat grpcurl HOST:PORT PACKAGE.SERVICE/METHOD [--data JSON | --data @] [--plaintext] [--save] [--dir DIR]',
  'ilabrat grpcurl --case UUID [--dir DIR] [--metadata JSON] [--save]',
  'ilabrat grpcurl --history [--dir DIR]',
  'Use --proto FILE for a single proto and --source UUID for a saved SSH source.',
  'New calls also accept --name TEXT, --metadata JSON and --check JSON.',
  'Use --data @ to read UTF-8 JSON from stdin. TLS is the default.',
].join('\n')

async function main([command, ...args]) {
  if (!command || command === '--help' || args.includes('--help')) {
    console.log(usage)
    return
  }
  const options = { dir: { type: 'string' }, proto: { type: 'string' }, source: { type: 'string' } }
  if (command === 'grpcurl') Object.assign(options, {
    metadata: { type: 'string' }, check: { type: 'string' }, name: { type: 'string' }, history: { type: 'boolean' },
    data: { type: 'string' }, plaintext: { type: 'boolean' }, save: { type: 'boolean' }, case: { type: 'string' },
  })
  const { values, positionals } = parseArgs({ args, options, allowPositionals: true })
  if (values.source) { values.sourceId = values.source; delete values.source }
  let params
  if (command === 'buf' && positionals.length === 1) {
    params = { ...values, action: positionals[0] }
  } else if (command === 'grpcurl' && values.history && !positionals.length && Object.keys(values).every(k => ['dir', 'proto', 'sourceId', 'history'].includes(k))) {
    params = { ...values, action: 'history' }
  } else if (command === 'grpcurl' && !values.history && positionals.length === (values.case === undefined ? 2 : 0)) {
    const { case: caseId, ...other } = values
    params = { ...other, address: positionals[0], method: positionals[1], caseId }
    for (const key of ['metadata', 'check']) {
      if (params[key] !== undefined) params[key] = JSON.parse(params[key])
    }
    if (params.data === '@') {
      process.stdin.setEncoding('utf8')
      let json = ''
      for await (const chunk of process.stdin) json += chunk
      params.data = json.replace(/^\uFEFF/, '')
    }
  } else {
    throw new Error(usage)
  }
  const result = await execute(command, params, process.cwd())
  console.log(JSON.stringify(result, null, 2))
  if (!result.ok || result.historyError) process.exitCode = 1
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.message)
  process.exitCode = 2
})
