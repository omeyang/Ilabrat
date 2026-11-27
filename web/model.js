export const initial = { address: '', method: '', data: '{}', plaintext: false, name: '', pointer: '', expected: '', maxMs: '', metadata: '{}' }

export function fromCase(request) {
  return { ...initial, name: request.name || '', address: request.address, method: request.method,
    data: request.data, plaintext: request.plaintext, pointer: request.check?.pointer ?? '',
    expected: Object.hasOwn(request.check ?? {}, 'equals') ? JSON.stringify(request.check.equals) : '',
    maxMs: String(request.check?.maxMs ?? ''), metadata: JSON.stringify(Object.fromEntries((request.metadataKeys ?? []).map(k => [k, ''])), null, 2) }
}

export function params(form) {
  if (!form.address.trim() || !form.method.trim()) throw new Error('请填写地址并选择或输入方法')
  JSON.parse(form.data)
  const metadata = JSON.parse(form.metadata || '{}')
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata) || Object.values(metadata).some(v => typeof v !== 'string' || !v.trim())) {
    throw new Error('Metadata 需要非空字符串键值，回放时请重新填写凭据')
  }
  const check = {}
  if (form.maxMs) check.maxMs = Number(form.maxMs)
  if (form.pointer && !form.expected.trim()) throw new Error('请填写字段的 JSON 期望值')
  if (form.expected.trim()) { check.pointer = form.pointer; check.equals = JSON.parse(form.expected) }
  return { address: form.address.trim(), method: form.method.trim(), data: form.data, name: form.name.trim(), plaintext: form.plaintext, metadata, check }
}

export function readPreference(key, fallback) {
  try { return JSON.parse(localStorage.getItem('ilabrat.' + key)) ?? fallback }
  catch { return fallback }
}

export async function api(id, command, args = {}) {
  const response = await fetch(new URL('api/ilabrat', document.baseURI), {
    method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id, command, args }),
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.stderr || 'DSH 请求失败 ' + response.status)
  return result
}
