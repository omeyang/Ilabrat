import { isDeepStrictEqual } from 'node:util'

export function validateCheck(check) {
  if (check === undefined) return
  if (!check || typeof check !== 'object' || Array.isArray(check)) throw new Error('断言必须是对象')
  if (check.maxMs !== undefined && (!Number.isFinite(check.maxMs) || check.maxMs <= 0)) throw new Error('耗时上限必须为正数')
  if (check.pointer !== undefined || Object.hasOwn(check, 'equals')) {
    if (typeof check.pointer !== 'string' || !/^(?:\/(?:[^~]|~[01])*)*$/u.test(check.pointer) || !Object.hasOwn(check, 'equals')) {
      throw new Error('字段断言需要 JSON Pointer 和 JSON 期望值')
    }
  }
}

export function evaluate(check, result) {
  const checks = [{ name: 'gRPC OK', passed: result.ok }]
  if (check.maxMs !== undefined) checks.push({ name: 'RPC ≤ ' + check.maxMs + ' ms', actual: result.rpcMs ?? null, passed: result.ok && result.rpcMs <= check.maxMs })
  if (Object.hasOwn(check, 'equals')) {
    let value = result.response
    for (const key of check.pointer.split('/').slice(1)) {
      const field = key.replace(/~1/g, '/').replace(/~0/g, '~')
      value = value !== null && typeof value === 'object' && Object.hasOwn(value, field) ? value[field] : undefined
    }
    checks.push({ name: check.pointer || '/', expected: check.equals, actual: value ?? null,
      passed: result.ok && isDeepStrictEqual(value, check.equals) })
  }
  return checks
}
