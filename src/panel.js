import { execute } from './workspace.js'

import { profiles, saveProfile, deleteProfile } from './profiles.js'
import { probe } from './runtime.js'

export function mountPanel(ctx) {
  const pending = new Map()
  ctx.effect(() => () => {
    for (const task of pending.values()) task.abort()
  })
  ctx.connection.fetch.register({
    path: '/api/ilabrat', methods: ['POST'], requestBody: 'buffered',
    async fetch(request) {
      let id, controller
      try {
        if (!request.headers.get('content-type')?.startsWith('application/json')) {
          return Response.json({ ok: false, stderr: '需要 JSON 请求' }, { status: 415 })
        }
        const body = await request.json()
        id = body.id
        if (typeof id !== 'string' || !/^[a-z0-9-]{8,64}$/i.test(id)) throw new Error('无效的操作 ID')
        if (body.command === 'cancel') {
          pending.get(id)?.abort()
          return Response.json({ ok: true })
        }
        if (pending.has(id)) throw new Error('操作 ID 重复')
        if (!['buf', 'grpcurl', 'browse', 'sources'].includes(body.command) || !body.args || typeof body.args !== 'object') throw new Error('无效的操作')
        controller = new AbortController()
        pending.set(id, controller)
        const signal = AbortSignal.any([request.signal, controller.signal])
        let value
        if (body.command === 'sources') {
          const args = body.args
          switch (args.action) {
            case 'list': value = { ok: true, profiles: await profiles() }; break
            case 'probe': value = { ok: true, fingerprint: await probe(args, signal) }; break
            case 'save': value = { ok: true, profile: await saveProfile(args) }; break
            case 'delete': await deleteProfile(args.sourceId); value = { ok: true }; break
            default: throw new Error('未知来源操作')
          }
        } else value = await execute(body.command, body.args, process.cwd(), signal)
        return Response.json(value, { headers: { 'cache-control': 'no-store' } })
      } catch (error) {
        return Response.json({ ok: false, stderr: error.name === 'AbortError' ? '操作已取消' : error.message }, { status: 400 })
      } finally {
        if (controller) pending.delete(id)
      }
    },
  })
}
