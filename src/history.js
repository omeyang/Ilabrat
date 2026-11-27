import { mkdir, readdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'

export async function saveCase(root, request, result) {
  const directory = path.join(root, '.ilabrat', 'history')
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const id = randomUUID()
  const pending = path.join(directory, id + '.tmp')
  try {
    const record = { version: 1, id, time: new Date().toISOString(), request, result }
    await writeFile(pending, JSON.stringify(record, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
    await rename(pending, path.join(directory, id + '.json'))
    return id
  } finally {
    await rm(pending, { force: true })
  }
}

export async function loadCase(root, id) {
  if (typeof id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error('caseId 应为保存用例时返回的 UUID')
  }
  const file = path.join(root, '.ilabrat', 'history', id + '.json')
  const record = JSON.parse(await readFile(file, 'utf8'))
  if (record.version !== 1 || record.id !== id || !record.request) throw new Error('用例格式无效')
  return record.request
}

export async function listCases(root) {
  const dir = path.join(root, '.ilabrat', 'history')
  let files
  try { files = await readdir(dir, { withFileTypes: true }) }
  catch (error) { if (error.code === 'ENOENT') return []; throw error }
  const cases = []
  for (const item of files) {
    if (!item.isFile() || !/^[0-9a-f-]{36}\.json$/.test(item.name)) continue
    const { id, time, request, result } = JSON.parse(await readFile(path.join(dir, item.name), 'utf8'))
    cases.push({ id, time, name: request.name, method: request.method, ok: result.ok, elapsedMs: result.elapsedMs })
  }
  return cases.sort((a, b) => b.time.localeCompare(a.time))
}
