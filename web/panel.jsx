import React, { useEffect, useRef, useState } from 'react'
import styles from './theme.css'
import { api, fromCase, initial, params, readPreference } from './model.js'

const uid = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), x => x.toString(16).padStart(2, '0')).join('')
const pretty = value => typeof value === 'string' ? value : JSON.stringify(value, null, 2)
const field = (label, control) => <label>{label}{React.cloneElement(control, { 'aria-label': label })}</label>
function Mark({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m3 8 9-5 9 5-9 5z M3 12l9 5 9-5 M3 16l9 5 9-5" strokeLinejoin="round"/></svg>
}
function Tabs({ names, value, change }) {
  return <div className="tabs">{names.map(n => <button key={n} aria-pressed={value === n} onClick={() => change(n)}>{n}</button>)}</div>
}

function Workbench({ ctx, sessionId }) {
  const summaries = ctx.sessions.list.getSnapshot().byId
  const session = summaries[sessionId] ?? Object.values(summaries).find(s =>
    (s.retainedBy?.mainView ?? 0) > 0)

  const defaultDir = session?.projectionValues?.workingDirectory || session?.cwd || readPreference('dir', '')
  const [dir, setDir] = useState(defaultDir), [root, setRoot] = useState('')
  const [form, setForm] = useState(initial), [schema, setSchema] = useState([]), [cases, setCases] = useState([])
  const [nav, setNav] = useState('方法'), [tab, setTab] = useState('请求体'), [filter, setFilter] = useState('')
  const [result, setResult] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState('')
  const [selected, setSelected] = useState([]), [save, setSave] = useState(false)
  const [envs, setEnvs] = useState(() => readPreference('envs', [])), [envName, setEnvName] = useState('')
  const [envEdit, setEnvEdit] = useState(false)
  const task = useRef(null), mounted = useRef(true), importFile = useRef(null)
  const patch = values => setForm(old => ({ ...old, ...values }))
  const change = key => e => patch({ [key]: e.target.value })
  const setWorkspace = value => {
    setDir(value); setRoot(''); setSchema([]); setCases([]); setSelected([]); setResult(null); setError('')
  }
  async function run(label, operation) {
    if (task.current) return
    const job = { id: uid(), cancelled: false }
    task.current = job; setBusy(label); setError('')
    const request = async (command, args) => {
      if (job.cancelled) throw new Error('操作已取消')
      const response = await api(job.id, command, { dir: dir.trim() || '.', ...args })
      if (job.cancelled || !mounted.current) throw new Error('操作已取消')
      return response
    }
    try { await operation(request) }
    catch (err) { if (mounted.current) setError(err.message) }
    finally { if (task.current === job) { task.current = null; if (mounted.current) setBusy('') } }
  }
  function cancel() {
    const job = task.current
    if (job) { job.cancelled = true; api(job.id, 'cancel').catch(() => {}) }
  }
  async function history(request) {
    const response = await request('grpcurl', { action: 'history' })
    if (!response.ok) throw new Error(response.stderr)
    setCases(response.cases)
  }
  function load() {
    return run('加载 schema', async request => {
      const value = await request('buf', { action: 'schema' })
      if (!value.ok) { setSchema([]); setRoot(''); throw new Error(value.stderr) }
      setRoot(value.root); setDir(value.root); setSchema(value.methods)
      localStorage.setItem('ilabrat.dir', JSON.stringify(value.root))
      await history(request)
    })
  }
  useEffect(() => {
    mounted.current = true; load()
    return () => { mounted.current = false; cancel() }
  }, [])

  const method = schema.find(item => item.name === form.method)
  function choose(item) {
    patch({ method: item.name, ...(form.data.trim() === '{}' ? { data: pretty(item.template) } : {}) })
    setTab('请求体')
  }
  function send() {
    return run('发送', async request => {
      const value = await request('grpcurl', { ...params(form), save })
      setResult(value)
      if (value.caseId) await history(request)
    })
  }
  function openCase(id) {
    return run('读取用例', async request => {
      const value = await request('grpcurl', { action: 'load', caseId: id })
      if (!value.ok) throw new Error(value.stderr)
      setForm(fromCase(value.request)); setTab('请求体'); setResult(null)
    })
  }
  function batch() {
    return run('运行选中用例', async request => {
      const rows = []
      for (const id of selected) {
        const value = await request('grpcurl', { caseId: id })
        rows.push({ name: cases.find(c => c.id === id)?.name || id, ...value })
        setResult({ stage: '批量回归', ok: rows.every(r => r.ok), rows: [...rows] })
      }
    })
  }
  function keepEnv() {
    if (!envName.trim() || !form.address.trim()) { setError('请填写环境名称和服务地址'); return }
    const next = [...envs.filter(e => e.name !== envName.trim()), { name: envName.trim(), address: form.address.trim(), plaintext: form.plaintext }]
    try { localStorage.setItem('ilabrat.envs', JSON.stringify(next)); setEnvs(next); setEnvEdit(false) }
    catch (err) { setError(err.message) }
  }
  function exportRequest() {
    try {
      const { metadata, ...request } = params(form)
      const file = { format: 'ilabrat.case.v1', request: { ...request, metadataKeys: Object.keys(metadata) } }
      const url = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }))
      const link = document.createElement('a')
      link.href = url; link.download = 'ilabrat-case.json'; link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      setError('')
    } catch (err) { setError(err.message) }
  }
  async function importRequest(file) {
    if (!file) return
    try {
      if (file.size > 4 * 1024 * 1024) throw new Error('用例文件超过 4 MiB')
      const value = JSON.parse(await file.text())
      if (value.format !== 'ilabrat.case.v1') throw new Error('请选择 Ilabrat 导出的用例文件')
      const r = value.request
      if (!r || typeof r.address !== 'string' || typeof r.method !== 'string' || typeof r.data !== 'string'
          || (r.name !== undefined && typeof r.name !== 'string') || typeof r.plaintext !== 'boolean'
          || (r.check?.pointer !== undefined && typeof r.check.pointer !== 'string') || !Array.isArray(r.metadataKeys)
          || r.metadataKeys.some(k => typeof k !== 'string')) throw new Error('用例字段无效')
      JSON.parse(r.data)
      setForm(fromCase(r)); setResult(null); setTab('请求体'); setError('')
    } catch (err) { setError(err.message) }
  }
  const responseText = result?.response !== undefined ? pretty(result.response) : result?.descriptor || result?.stdout
  return <div className="ilb">
    <style>{styles}</style>
    <header><span className="mark"><Mark size={30}/></span><div><h1>Ilabrat</h1><p className="subtitle">gRPC 接口测试工作台</p></div></header>
    <main><aside><h2>Buf 工作区</h2>
      {field('目录', <input value={dir} onChange={e => setWorkspace(e.target.value)} disabled={!!busy} placeholder="含 buf.yaml 的目录"/>)}
      <div className="row"><button disabled={!!busy} onClick={load}>加载 schema</button>
        <button disabled={!!busy} onClick={() => run('选择目录', async () => { const path = await ctx.uiWorkspace.pickDirectory(); if (path) setWorkspace(path) })}>浏览…</button></div>
      <Tabs value={nav} names={['方法','用例']} change={n => { setNav(n); setFilter('') }}/>
      {field('筛选' + nav, <input type="search" value={filter} onChange={e => setFilter(e.target.value)}/>)}
      <div className="items">{nav === '方法' ? schema.filter(m => m.name.toLowerCase().includes(filter.toLowerCase())).map(m => <div className="item" key={m.name}>
        <button disabled={!!busy} className={form.method === m.name ? 'active' : ''} onClick={() => choose(m)}><strong>{m.name.split('/')[1]}</strong><small>{m.name.split('/')[0]}</small></button></div>) :
        cases.filter(c => (c.name + c.method).toLowerCase().includes(filter.toLowerCase())).map(c => <div className="item" key={c.id}>
          <input type="checkbox" aria-label={'选中 ' + (c.name || c.method)} disabled={!!busy} checked={selected.includes(c.id)} onChange={e => setSelected(e.target.checked ? [...selected,c.id] : selected.filter(id => id !== c.id))}/>
          <button onClick={() => openCase(c.id)} disabled={!!busy}><strong>{c.name || c.method}</strong><small>{c.ok ? '通过' : '失败'} · {new Date(c.time).toLocaleString()}</small></button></div>)}</div>
      {nav === '方法' && <small>{root ? schema.length + ' 个方法' : '加载工作区后显示方法'}</small>}
      {nav === '用例' && <div className="row"><button disabled={!!busy || !selected.length} onClick={batch}>运行选中 ({selected.length})</button><button disabled={!!busy} onClick={() => run('刷新用例', history)}>刷新</button></div>}
      <div className="box"><h3>Schema 检查</h3><div className="row" style={{marginTop:8}}>{['lint','build'].map(action => <button key={action} disabled={!!busy} onClick={() => run('buf ' + action, async request => setResult(await request('buf',{action})))}>{action === 'lint' ? '校验' : '编译'}</button>)}</div></div>
    </aside>
    <section className="editor">
      <div className="row spread"><h2>请求</h2><div className="row"><input hidden type="file" accept=".json,application/json" ref={importFile} onChange={e=>{importRequest(e.target.files[0]); e.target.value=''}}/>
        <button disabled={!!busy} onClick={()=>importFile.current.click()}>导入用例</button><button disabled={!!busy || !form.method} onClick={exportRequest}>导出用例</button><select style={{width:'auto'}} aria-label="切换环境" disabled={!!busy} value={envs.find(v => v.address === form.address && v.plaintext === form.plaintext)?.name || ''} onChange={e => { const env = envs.find(v => v.name === e.target.value); if (env) patch({address:env.address,plaintext:env.plaintext,metadata:'{}'}) }}>
        <option value="">选择环境</option>{envs.map(e => <option key={e.name}>{e.name}</option>)}</select></div></div>
      <fieldset disabled={!!busy} style={{padding:0,border:0,margin:0,minWidth:0}}>
      <div className="row"><label className="grow">服务地址<input className="mono" placeholder="localhost:50051" value={form.address} onChange={change('address')}/></label>
        <label className="transport">传输<select aria-label="传输" value={form.plaintext ? 'plain':'tls'} onChange={e=>patch({plaintext:e.target.value === 'plain'})}><option value="tls">TLS</option><option value="plain">明文 h2c</option></select></label>
        <button onClick={()=>setEnvEdit(v=>!v)}>保存环境</button></div>
      {envEdit && <div className="row">{field('环境名称', <input value={envName} onChange={e=>setEnvName(e.target.value)}/>)}<button onClick={keepEnv}>保存地址与传输</button></div>}
      {field('RPC 方法', <input className="mono" value={form.method} onChange={change('method')} placeholder="package.Service/Method"/>)}
      {method && <small>{method.input} → {method.output}{method.clientStreaming || method.serverStreaming ? ' · streaming' : ' · unary'}</small>}
      <Tabs names={['请求体','Metadata','断言']} value={tab} change={setTab}/>
      {tab === '请求体' && <>{field('请求 JSON', <textarea rows={7} spellCheck={false} value={form.data} onChange={change('data')}/>)}<div className="row">
        <button onClick={() => { try { patch({data:pretty(JSON.parse(form.data))}); setError('') } catch(err){setError(err.message)} }}>格式化 JSON</button>
        <button disabled={!method} onClick={() => patch({data:pretty(method.template)})}>填入 schema 模板</button></div></>}
      {tab === 'Metadata' && <>{field('gRPC Metadata（JSON 键值对）', <textarea rows={5} spellCheck={false} value={form.metadata} onChange={change('metadata')}/>)}<small>历史用例仅保存键名，回放前可在这里补填凭据。</small></>}
      {tab === '断言' && <><div className="row"><label className="grow">响应字段（JSON Pointer）<input placeholder="/result/id" value={form.pointer} onChange={change('pointer')}/></label><label className="grow">期望值（JSON）<input placeholder='"ok"' value={form.expected} onChange={change('expected')}/></label></div>
        {field('RPC 耗时上限（毫秒）', <input type="number" min="1" value={form.maxMs} onChange={change('maxMs')}/>)}<small>空路径匹配整个响应。每次发送都会检查 gRPC 是否成功。</small></>}
      <div className="box row"><button className="primary" onClick={send}>发送请求</button><label className="inline"><input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)}/>保存为用例</label>
      {save && <input style={{maxWidth:235}} aria-label="用例名称" placeholder="用例名称" value={form.name} onChange={change('name')}/>}</div></fieldset>
      {busy && <div className="row" role="status">{busy}… <button onClick={cancel}>取消</button></div>}
      {error && <p className="alert" role="alert">{error}</p>}
      <section className="output" aria-live="polite"><div className="row spread"><h2>结果</h2>{result && <span className={'status '+(result.ok?'pass':'fail')}>{result.ok?'通过':'失败'} · {result.stage}</span>}</div>
      {!result && <small>发送请求或执行 schema 检查后，结果会显示在这里。</small>}
      {result && <>{result.elapsedMs != null && <p className="subtitle">总耗时 {result.elapsedMs} ms{result.rpcMs != null && ' · RPC '+result.rpcMs+' ms'}{result.exitCode != null && ' · 退出码 '+result.exitCode}</p>}
      {result.checks?.map((c,i)=><div key={i} className={c.passed?'pass':'fail'}>{c.passed?'✓':'×'} {c.name}{!c.passed && Object.hasOwn(c,'expected') && '　期望 '+JSON.stringify(c.expected)+'，实际 '+JSON.stringify(c.actual)}</div>)}
      {result.rows?.map((r,i)=><details key={i}><summary>{r.ok?'✓':'×'} {r.name} · {r.elapsedMs} ms</summary><pre>{pretty(r)}</pre></details>)}
      {responseText && <pre>{responseText}</pre>}{result.stderr && <pre className="fail">{result.stderr}</pre>}{result.caseId && <small>已保存用例 · {result.caseId}</small>}{result.historyError && <p role="alert">用例保存失败 · {result.historyError}</p>}</>}
      </section>
    </section></main>
  </div>
}
export const inject = ['slots','locale','uiWorkspace','sessions']
export function apply(ctx) {
  ctx.locale.register('ilabrat', {zh:{nav:'Ilabrat · gRPC 工作台'},en:{nav:'Ilabrat · gRPC workbench'}})
  const t = ctx.locale.bind('ilabrat')
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({name:'sidebar.panellist',id:'ilabrat',order:50,label:()=>t('nav'),locale:'ilabrat'}, Mark))
  ctx.slots.inject('main', () => ctx.slots.register({name:'main',key:'ilabrat'}, props => <Workbench {...props} ctx={ctx}/>))
}
