const known = {
  '.google.protobuf.Timestamp': '2000-01-01T00:00:00Z', '.google.protobuf.Duration': '0s',
  '.google.protobuf.FieldMask': '', '.google.protobuf.Struct': {}, '.google.protobuf.Value': null,
  '.google.protobuf.ListValue': [], '.google.protobuf.Any': {}, '.google.protobuf.Empty': {},
  '.google.protobuf.StringValue': '', '.google.protobuf.BytesValue': '',
  '.google.protobuf.Int64Value': '0', '.google.protobuf.UInt64Value': '0',
  '.google.protobuf.BoolValue': false, '.google.protobuf.Int32Value': 0, '.google.protobuf.UInt32Value': 0,
  '.google.protobuf.FloatValue': 0, '.google.protobuf.DoubleValue': 0,
}

export function describe(files) {
  const types = Object.create(null)
  function index(scope, prefix) {
    for (const e of scope.enumType ?? []) types[prefix+e.name] = { choices:(e.value || []).map(v=>v.name) }
    for (const m of scope.messageType ?? scope.nestedType ?? []) {
      const name = prefix+m.name
      types[name] = { map:!!m.options?.mapEntry, fields:(m.field || []).map(f=>({
        key:f.jsonName ?? f.name, type:f.typeName || f.type.slice(5).toLowerCase(),
        repeated:f.label==='LABEL_REPEATED', oneof:f.proto3Optional ? undefined : m.oneofDecl?.[f.oneofIndex]?.name,
      })) }
      index(m,name+'.')
    }
  }
  for (const f of files) index(f,f.package ? '.'+f.package+'.' : '.')
  return types
}

export function seed(type,types,ancestors=[],budget={left:80}) {
  if (Object.hasOwn(known,type)) return structuredClone(known[type])
  const entry = types[type]
  if (entry?.choices) return entry.choices[0] ?? 0
  if (!entry) {
    if (type==='string' || type==='bytes') return ''
    if (type==='bool') return false
    return type.endsWith('64') ? '0' : 0
  }
  const value = Object.create(null)
  if (ancestors.includes(type) || ancestors.length>8) return value
  const groups = new Set()
  for (const field of entry.fields) {
    if (field.oneof && groups.has(field.oneof)) continue
    if (--budget.left<0) break
    groups.add(field.oneof)
    value[field.key] = field.repeated ? (types[field.type]?.map ? {} : []) : seed(field.type,types,[...ancestors,type],budget)
  }
  return value
}

export const isSpecial = type => Object.hasOwn(known,type)
