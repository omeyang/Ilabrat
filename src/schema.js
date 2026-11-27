import { run } from './process.js'

const known = {
  '.google.protobuf.Timestamp': '2000-01-01T00:00:00Z',
  '.google.protobuf.Duration': '0s',
  '.google.protobuf.FieldMask': '',
  '.google.protobuf.Struct': {}, '.google.protobuf.ListValue': [], '.google.protobuf.Value': null,
  '.google.protobuf.StringValue': '', '.google.protobuf.BytesValue': '',
  '.google.protobuf.BoolValue': false, '.google.protobuf.Int64Value': '0', '.google.protobuf.UInt64Value': '0',
  '.google.protobuf.Int32Value': 0, '.google.protobuf.UInt32Value': 0,
  '.google.protobuf.FloatValue': 0, '.google.protobuf.DoubleValue': 0,
}

export async function discover(root, signal) {
  const result = await run('buf', ['build', '.', '--as-file-descriptor-set', '--exclude-source-info', '-o', '-#format=json'], root, undefined, signal)
  if (!result.ok) return { ...result, stage: 'buf build' }
  const files = JSON.parse(result.stdout).file ?? []
  const messages = new Map(), enums = new Map(), methods = []
  function index(owner, prefix) {
    for (const type of owner.enumType ?? []) enums.set(prefix + '.' + type.name, type.value?.[0]?.name)
    for (const type of owner.messageType ?? owner.nestedType ?? []) {
      const key = prefix + '.' + type.name
      messages.set(key, type)
      index(type, key)
    }
  }
  for (const f of files) index(f, f.package ? '.' + f.package : '')
  function template(name, ancestors, budget) {
    if (Object.hasOwn(known, name)) return known[name]
    const value = Object.create(null)
    if (ancestors.includes(name) || ancestors.length > 8 || budget.left <= 0) return value
    const unions = new Set()
    for (const field of messages.get(name)?.field ?? []) {
      if (field.oneofIndex !== undefined && unions.has(field.oneofIndex)) continue
      unions.add(field.oneofIndex)
      if (--budget.left < 0) break
      const key = field.jsonName ?? field.name
      if (messages.get(field.typeName)?.options?.mapEntry) value[key] = {}
      else if (field.label === 'LABEL_REPEATED') value[key] = []
      else if (field.type === 'TYPE_MESSAGE') value[key] = template(field.typeName, [...ancestors, name], budget)
      else if (field.type === 'TYPE_ENUM') value[key] = enums.get(field.typeName) ?? 0
      else if (field.type === 'TYPE_BOOL') value[key] = false
      else if (['TYPE_STRING', 'TYPE_BYTES'].includes(field.type)) value[key] = ''
      else value[key] = field.type.endsWith('64') ? '0' : 0
    }
    return value
  }
  for (const f of files) {
    for (const service of f.service ?? []) {
      for (const m of service.method ?? []) {
        const name = [f.package, service.name].filter(Boolean).join('.') + '/' + m.name
        methods.push({ name, input: m.inputType.slice(1), output: m.outputType.slice(1),
          clientStreaming: !!m.clientStreaming, serverStreaming: !!m.serverStreaming,
          template: template(m.inputType, [], { left: 80 }) })
      }
    }
  }
  return { ok: true, stage: 'schema', root, methods: methods.sort((a, b) => a.name.localeCompare(b.name)) }
}
