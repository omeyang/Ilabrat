import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'node:crypto'
import { link, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import { spawn } from 'node:child_process'

export const settingsDir = () => process.env.ILABRAT_HOME || path.join(homedir(), '.ilabrat')
const folder = () => path.join(settingsDir(), 'sources')
const file = id => {
  if (typeof id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(id)) throw new Error('无效的 SSH 来源')
  return path.join(folder(), id + '.json')
}

async function localKey() {
  const keyFile = path.join(folder(), '.key')
  try { return await readFile(keyFile) } catch (e) { if (e.code !== 'ENOENT') throw e }
  const temp = keyFile + '.' + randomUUID()
  try {
    await writeFile(temp, randomBytes(32), { mode: 0o600, flag: 'wx' })
    try { await link(temp, keyFile) } catch (e) { if (e.code !== 'EEXIST') throw e }
  } finally { await rm(temp, { force: true }) }
  return readFile(keyFile)
}

// DPAPI binds the Windows secret to the DSH user's logon identity.
function dpapi(data, operation) {
  const script = 'Add-Type -AssemblyName System.Security; $ErrorActionPreference="Stop";' +
    '$bytes=[Convert]::FromBase64String([Console]::In.ReadToEnd());' +
    '[Console]::Write([Convert]::ToBase64String([Security.Cryptography.ProtectedData]::' + operation +
    '($bytes,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser)))'
  return new Promise((resolve, reject) => {
    const child = spawn('powershell.exe', ['-NoProfile','-NonInteractive','-Command',script], { windowsHide: true })
    let out = ''
    child.stdout.on('data', b => { out += b })
    child.stderr.resume()
    child.stdin.on('error', reject)
    child.on('error', reject)
    child.on('close', code => code === 0 ? resolve(Buffer.from(out, 'base64')) : reject(new Error('Windows 凭据保护失败')))
    child.stdin.end(data.toString('base64'))
  })
}

async function seal(password) {
  const data = Buffer.from(password)
  if (process.platform === 'win32') return { dpapi: (await dpapi(data, 'Protect')).toString('base64') }
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', await localKey(), iv)
  return { iv: iv.toString('hex'), data: Buffer.concat([cipher.update(data), cipher.final()]).toString('hex'), tag: cipher.getAuthTag().toString('hex') }
}

export function endpoint(input) {
  const host = String(input.host || '').trim(), port = Number(input.port || 22)
  if (!/^[\w.:%-]+$/.test(host) || !Number.isInteger(port) || port < 1 || port > 65535) throw new Error('请填写 SSH 主机及有效端口')
  return { host, port }
}

export async function saveProfile(input) {
  const name = String(input.name || '').trim(), username = String(input.username || '').trim()
  if (!name || !username || !/^SHA256:[A-Za-z0-9+/]{43}$/.test(input.fingerprint)) throw new Error('请填写来源名、用户名并核对主机指纹')
  if (!['agent', 'password'].includes(input.auth) || (input.auth === 'password' && (typeof input.password !== 'string' || !input.password))) throw new Error('请填写 SSH 认证信息')
  const profile = { ...endpoint(input), id: randomUUID(), name, username, fingerprint: input.fingerprint, auth: input.auth }
  await mkdir(folder(), { recursive: true, mode: 0o700 })
  const secret = input.auth === 'password' ? await seal(input.password) : undefined
  const record = file(profile.id), temp = record + '.tmp'
  try {
    await writeFile(temp, JSON.stringify({ ...profile, secret }), { flag: 'wx', mode: 0o600 })
    await rename(temp, record)
  } finally { await rm(temp, { force: true }) }
  return profile
}

export async function profiles() {
  let entries
  try { entries = await readdir(folder()) } catch (e) { if (e.code === 'ENOENT') return []; throw e }
  return Promise.all(entries.filter(n => n.endsWith('.json')).map(async n => {
    const { secret, ...publicFields } = JSON.parse(await readFile(file(n.slice(0,-5)), 'utf8'))
    return publicFields
  }))
}

export async function credentials(id) {
  const { secret, ...profile } = JSON.parse(await readFile(file(id), 'utf8'))
  if (profile.auth === 'agent') {
    const agent = process.env.SSH_AUTH_SOCK || (process.platform === 'win32' && '\\\\.\\pipe\\openssh-ssh-agent')
    if (!agent) throw new Error('DSH 无法访问 SSH agent，请启动 agent 并加载密钥，或使用密码认证')
    return { ...profile, agent }
  }
  if (secret.dpapi) return { ...profile, password: (await dpapi(Buffer.from(secret.dpapi, 'base64'), 'Unprotect')).toString() }
  const cipher = createDecipheriv('aes-256-gcm', await localKey(), Buffer.from(secret.iv,'hex'))
  cipher.setAuthTag(Buffer.from(secret.tag,'hex'))
  return { ...profile, password: Buffer.concat([cipher.update(Buffer.from(secret.data,'hex')), cipher.final()]).toString() }
}

export const deleteProfile = id => rm(file(id))
