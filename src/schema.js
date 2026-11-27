import { describe, seed } from './descriptor.js'

export async function discover({ io, root, input, file }, signal) {
  const result = await io.run('buf', ['build', input, '--as-file-descriptor-set', '--exclude-source-info', '-o', '-#format=json'], root, undefined, signal)
  if (!result.ok) return { ...result, stage: 'buf build' }
  const files = JSON.parse(result.stdout).file ?? []
  const types = describe(files), methods = []
  const absolute = file?.split(io.path.sep).join('/')
  const selected = absolute && files.filter(f => absolute.endsWith('/' + f.name)).sort((a,b) => b.name.length - a.name.length)[0]
  for (const f of files) {
    if (file && f !== selected) continue
    for (const service of f.service ?? []) {
      for (const m of service.method ?? []) {
        const name = [f.package, service.name].filter(Boolean).join('.') + '/' + m.name
        methods.push({ name, package: f.package || '', service: service.name, rpc: m.name, input: m.inputType.slice(1), output: m.outputType.slice(1),
          clientStreaming: !!m.clientStreaming, serverStreaming: !!m.serverStreaming, template: seed(m.inputType, types) })
      }
    }
  }
  return { ok: true, stage: 'schema', root, file, types, methods: methods.sort((a, b) => a.name.localeCompare(b.name)) }
}
