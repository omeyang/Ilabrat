import { mountPanel } from './panel.js'
import { execute } from './workspace.js'

export const name = 'ilabrat'
export const inject = ['tools', 'workingDirectory']

const dir = { type: 'string', description: 'Directory containing buf.yaml, relative to the session working directory or absolute. Defaults to the session working directory.' }
const definitions = {
  buf: {
    description: 'Lint the Buf workspace or compile it into a FileDescriptorSet.',
    parameters: {
      type: 'object', additionalProperties: false, required: ['action'],
      properties: { dir, action: { type: 'string', enum: ['lint', 'build', 'schema'] } },
    },
  },
  grpcurl: {
    description: 'Call a gRPC method using the current Buf schema, or replay a saved case. Returns response, diagnostics and timing.',
    parameters: {
      type: 'object', additionalProperties: false,
      properties: {
        dir,
        address: { type: 'string', description: 'host:port, required for a new call' },
        method: { type: 'string', description: 'package.Service/Method, required for a new call' },
        data: { type: 'string', description: 'One JSON request as text. Defaults to {}.' },
        plaintext: { type: 'boolean', description: 'Use unencrypted HTTP/2. Defaults to TLS.' },
        save: { type: 'boolean', description: 'Save the request and result in workspace history and return its caseId.' },
        action: { type: 'string', enum: ['send', 'history', 'load'], description: 'Send, list stored cases, or load one editable request.' },
        name: { type: 'string', description: 'Name for a saved case.' },
        metadata: { type: 'object', additionalProperties: true, description: 'gRPC metadata as string pairs. Saved cases keep keys only.' },
        check: { type: 'object', additionalProperties: true, description: 'Optional response assertions: maxMs, or JSON Pointer pointer and expected JSON equals.' },
        caseId: { type: 'string', description: 'Replay a saved request from this workspace using its UUID.' },
      },
    },
  },
}

export function apply(ctx) {
  ctx.inject(['connection'], mountPanel)
  for (const [command, definition] of Object.entries(definitions)) {
    ctx.tools.register({
      name: 'ilabrat_' + command,
      ...definition,
      output: {
        schema: { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'], additionalProperties: true },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
      },
      async execute(args, exec) {
        const cwd = exec.agent ? await ctx.workingDirectory.ensure(exec.agent, exec.signal) : process.cwd()
        return execute(command, args, cwd, exec.signal)
      },
    })
  }
}
