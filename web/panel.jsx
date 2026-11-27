import React, { useEffect, useRef, useState } from 'react'
import { SourceSettings, Browser } from './source.jsx'
import { Fields } from './fields.jsx'
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
  const [sourceId,setSourceId] = useState(() => readPreference('source','local'))
  const [sources,setSources] = useState([]), [manage,setManage] = useState(false)
  const recent = id => readPreference('schema.' + id, { mode:'proto', dir:'' })
  const [mode,setMode] = useState(() => recent(sourceId).mode)
  const [dir,setDir] = useState(() => recent(sourceId).dir), [root,setRoot] = useState('')
  const [listing,setListing] = useState(null), [bodyView,setBodyView] = useState('字段')
  const [issues,setIssues] = useState({}), drafts = useRef(new Map())
  const [presets,setPresets] = useState(() => readPreference('presets',[]))
  const [presetName,setPresetName] = useState(''), [presetEdit,setPresetEdit] = useState(false)
  const [targetName,setTargetName] = useState('')
  const preference = (key,value) => localStorage.setItem('ilabrat.' + key, JSON.stringify(value))
  const location = (sourceId,mode,dir) => ({sourceId, dir:mode === 'buf' ? dir || '.' : undefined, proto:mode === 'proto' ? dir : undefined})
  const sourceName = sourceId === 'local' ? '本机 · DSH' : sources.find(s=>s.id===sourceId)?.name || 'SSH 来源'
  const [form, setForm] = useState(initial), [schema, setSchema] = useState([]), [cases, setCases] = useState([])
  const [types,setTypes] = useState({})
  const [nav, setNav] = useState('方法'), [tab, setTab] = useState('请求体'), [filter, setFilter] = useState('')
  const [result, setResult] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState('')
  const [selected, setSelected] = useState([]), [save, setSave] = useState(false)
  const [envs, setEnvs] = useState(() => readPreference('envs', [])), [envName, setEnvName] = useState('')
  const [envEdit, setEnvEdit] = useState(false)
  const output = useRef(null), task = useRef(null), mounted = useRef(true), importFile = useRef(null)
  const patch = values => setForm(old => ({ ...old, ...values }))
  const change = key => e => patch({ [key]: e.target.value })
  const setWorkspace = value => {
    drafts.current.clear(); patch({method:'',data:'{}'}); setIssues({}); setListing(null)
    setDir(value); setRoot(''); setSchema([]); setCases([]); setSelected([]); setResult(null); setError('')
  }
  function switchSource(id, list=sources) {
    const next = recent(id)
    setSources(list); setSourceId(id); preference('source',id); setManage(false)
    setMode(next.mode); setWorkspace(next.dir)
  }
  async function run(label, operation) {
    if (task.current) return
    const job = { id: uid(), cancelled: false }
    task.current = job; setBusy(label); setError('')
    const request = async (command, args) => {
      if (job.cancelled) throw new Error('操作已取消')
      const base = ['buf','grpcurl'].includes(command) ? location(sourceId,mode,dir) : command === 'browse' ? {sourceId} : {}
      const response = await api(job.id, command, { ...base, ...args })
      if (job.cancelled || !mounted.current) throw new Error('操作已取消')
      return response
    }
    try { await operation(request) }
    catch (err) { if (mounted.current && task.current === job) setError(err.message) }
    finally { if (task.current === job) { task.current = null; if (mounted.current) setBusy('') } }
  }
  function cancel() {
    const job = task.current
    if (job) { job.cancelled = true; api(job.id, 'cancel').catch(() => {}) }
  }
  async function history(request, at = {}) {
    const response = await request('grpcurl', { action: 'history', ...at })
    if (!response.ok) throw new Error(response.stderr)
    setCases(response.cases)
  }
  async function loadSchema(request,id,kind,path,restore) {
    const at = location(id,kind,path)
    const value = await request('buf',{ action:'schema', ...at })
    if (!value.ok) { setWorkspace(path); throw new Error(value.stderr) }
    const actual = value.file || value.root
    setListing(null); setDir(actual); setRoot(value.root); setSchema(value.methods); setTypes(value.types); setResult(null); setCases([]); setSelected([])
    preference('schema.'+id,{mode:kind,dir:actual})
    const first = value.methods.find(m=>m.name === restore?.method) || value.methods[0]
    drafts.current.clear(); setIssues({}); setBodyView('字段')
    if (restore && first?.name !== restore.method) {
      patch({method:'',data:'{}'}); throw new Error('配置模板中的 RPC 已不存在，请重新选择接口')
    }
    if (restore) setForm(fromCase(restore))
    else patch({ method:first?.name || '', data:first ? JSON.stringify(first.template,null,2) : '{}' })
    await history(request, at)
  }
  const load = path => run('读取协议', request => loadSchema(request,sourceId,mode,path))
  const visit = path => run('浏览来源目录', async request => {
    const value = await request('browse',{dir:path || '.'})
    if (!value.ok) throw new Error(value.stderr)
    setListing(value)
  })
  function browseStart() {
    const parent = mode === 'proto' && dir ? dir.replace(/[^/\\]+$/, '') : dir
    visit(parent || (sourceId==='local' ? defaultDir : '.') || '.')
  }
  useEffect(() => {
    mounted.current = true
    run('读取来源',async request => {
      const { profiles } = await request('sources',{action:'list'})
      setSources(profiles)
      if (sourceId !== 'local' && !profiles.some(p=>p.id===sourceId)) {
        switchSource('local',profiles); throw new Error('上次的 SSH 来源已删除，请重新选择来源')
      }
      if (dir) await loadSchema(request,sourceId,mode,dir)
    })
    return () => { mounted.current = false; cancel(); task.current = null }
  }, [])

  const method = schema.find(item => item.name === form.method)
  function choose(item) {
    if (!item || item.name === form.method) return
    if (method) drafts.current.set(method.name, form.data)
    patch({method:item.name, data:drafts.current.get(item.name) ?? JSON.stringify(item.template,null,2)})
    setTab('请求体'); setResult(null); setIssues({}); setBodyView('字段')
  }
  const packages = [...new Set(schema.map(m=>m.package))]
  const services = [...new Set(schema.filter(m=>m.package===method?.package).map(m=>m.service))]
  const methods = schema.filter(m=>m.package===method?.package && m.service===method?.service)
  function savePreset() {
    try {
      if (!presetName.trim()) throw new Error('请填写配置模板名称')
      const {metadata,...request} = params(form)
      const entry = {name:presetName.trim(), sourceId,mode,dir,targetName,request:{...request,metadataKeys:Object.keys(metadata)}}
      const next = [...presets.filter(p=>p.name!==entry.name),entry]
      preference('presets',next); setPresets(next); setPresetEdit(false); setError('')
    } catch(err) { setError(err.message) }
  }
  function restorePreset(p) {
    if (!p) return
    run('打开配置模板',async request => {
      if (p.sourceId!=='local' && !sources.some(s=>s.id===p.sourceId)) throw new Error('配置模板引用的 SSH 来源已删除')
      switchSource(p.sourceId); setMode(p.mode); setWorkspace(p.dir); setTargetName(p.targetName)
      setForm(fromCase(p.request)); setTab('请求体')
      await loadSchema(request,p.sourceId,p.mode,p.dir,p.request)
    })
  }
  const issue = (id,message) => setIssues(old => {
    const next = {...old}
    if (message) next[id]=message
    else delete next[id]
    return next
  })
  let payload, validJson = true
  try { payload = JSON.parse(form.data) } catch { validJson = false }
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
      setTargetName(''); setIssues({}); setBodyView('JSON'); setForm(fromCase(value.request)); setTab('请求体'); setResult(null)
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
    if (!/^(?:\[[^\]]+\]|[\w.-]+):\d+$/.test(form.address.trim()) || !Number(form.address.trim().split(':').at(-1)) || Number(form.address.trim().split(':').at(-1)) > 65535) { setError('服务地址应为 host:port 或 [IPv6]:port'); return }
    const next = [...envs.filter(e => e.name !== envName.trim()), { name: envName.trim(), address: form.address.trim(), plaintext: form.plaintext }]
    try { localStorage.setItem('ilabrat.envs', JSON.stringify(next)); setEnvs(next); setTargetName(envName.trim()); setEnvEdit(false) }
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
      setTargetName(''); setIssues({}); setBodyView('JSON'); setForm(fromCase(r)); setResult(null); setTab('请求体'); setError('')
    } catch (err) { setError(err.message) }
  }
  const responseText = result?.response !== undefined ? pretty(result.response) : result?.descriptor || result?.stdout
  return <div className="ilb">
    <style>{styles}</style>
    <header><span className="mark"><Mark size={26}/></span><div><h1>Ilabrat</h1><p className="subtitle">gRPC 工作台</p></div>
      <div className="header-tools"><select aria-label="打开配置模板" value="" disabled={!!busy || !presets.length} onChange={e=>restorePreset(presets.find(p=>p.name===e.target.value))}><option value="">配置模板</option>{presets.map(p=><option key={p.name}>{p.name}</option>)}</select>
      <button disabled={!!busy || !method || !!Object.keys(issues).length} onClick={()=>setPresetEdit(!presetEdit)}>保存模板</button></div></header>
    {presetEdit && <div className="preset-bar"><label>配置模板名称<input placeholder="例如：开发机 · 测试集群 · 查询资产" value={presetName} onChange={e=>setPresetName(e.target.value)}/></label><button disabled={!!busy} onClick={savePreset}>保存当前配置与请求</button></div>}
    <main><aside>
      <div className="row spread"><h2>请求来源</h2><button disabled={!!busy} onClick={()=>setManage(!manage)}>添加 SSH</button></div>
      <select aria-label="请求来源" value={sourceId} disabled={!!busy} onChange={e=>switchSource(e.target.value)}><option value="local">本机 · DSH</option>{sources.map(s=><option key={s.id} value={s.id}>{s.name} · SSH</option>)}</select>
      {manage && <SourceSettings busy={!!busy} run={run} onClose={()=>setManage(false)} onSaved={p=>switchSource(p.id,[...sources,p])}/>}
      {sourceId !== 'local' && <details className="source-info"><summary>连接详情</summary><code>{sources.find(p=>p.id===sourceId)?.username}@{sources.find(p=>p.id===sourceId)?.host} · {sources.find(p=>p.id===sourceId)?.port}</code><small>来源 ID · {sourceId}</small><button disabled={!!busy} onClick={()=>run('删除来源',async req=>{await req('sources',{action:'delete',sourceId});switchSource('local',sources.filter(p=>p.id!==sourceId))})}>移除此来源和凭据</button></details>}
      <div className="box"><h2>协议来源</h2><fieldset disabled={!!busy}><Tabs names={['Proto 文件','Buf 工作区']} value={mode==='proto'?'Proto 文件':'Buf 工作区'} change={n=>{const k=n==='Proto 文件'?'proto':'buf';if(k!==mode){setMode(k);setWorkspace('')}}}/>
      {field(mode==='proto'?'文件路径':'工作区路径',<input className="mono" value={dir} placeholder={mode==='proto'?'选择 .proto 文件':'选择含 buf.yaml 的目录'} onChange={e=>setWorkspace(e.target.value)}/>)}
      <div className="row"><button onClick={browseStart}>浏览{mode==='proto'?'文件':'目录'}…</button><button disabled={!dir} onClick={()=>load(dir)}>加载协议</button></div></fieldset>
      {listing && <Browser key={listing.dir} listing={listing} mode={mode} busy={!!busy} visit={visit} close={()=>setListing(null)} select={load}/>}</div>
      <Tabs value={nav} names={['方法','用例']} change={n => { setNav(n); setFilter('') }}/>
      {field('筛选' + nav, <input type="search" value={filter} onChange={e => setFilter(e.target.value)}/>)}
      <div className="items">{nav === '方法' ? schema.filter(m => m.name.toLowerCase().includes(filter.toLowerCase())).map(m => <div className="item" key={m.name}>
        <button disabled={!!busy} className={form.method === m.name ? 'active' : ''} onClick={() => choose(m)}><strong>{m.name.split('/')[1]}</strong><small>{m.name.split('/')[0]}</small></button></div>) :
        cases.filter(c => (c.name + c.method).toLowerCase().includes(filter.toLowerCase())).map(c => <div className="item" key={c.id}>
          <input type="checkbox" aria-label={'选中 ' + (c.name || c.method)} disabled={!!busy} checked={selected.includes(c.id)} onChange={e => setSelected(e.target.checked ? [...selected,c.id] : selected.filter(id => id !== c.id))}/>
          <button onClick={() => openCase(c.id)} disabled={!!busy}><strong>{c.name || c.method}</strong><small>{c.ok ? '通过' : '失败'} · {new Date(c.time).toLocaleString()}</small></button></div>)}</div>
      {nav==='用例' && <div className="row"><input hidden type="file" accept=".json,application/json" ref={importFile} onChange={e=>{importRequest(e.target.files[0]);e.target.value=''}}/><button disabled={!!busy} onClick={()=>importFile.current.click()}>导入用例</button><button disabled={!!busy || !form.method || !!Object.keys(issues).length} onClick={exportRequest}>导出用例</button></div>}
      {nav === '方法' && <small>{root ? schema.length + ' 个方法' : '选择协议后显示方法'}</small>}
      {nav === '用例' && <div className="row"><button disabled={!!busy || !selected.length} onClick={batch}>运行选中 ({selected.length})</button><button disabled={!!busy} onClick={() => run('刷新用例', history)}>刷新</button></div>}
      <div className="box"><h3>Schema 检查</h3><div className="row" style={{marginTop:8}}>{['lint','build'].map(action => <button key={action} disabled={!!busy || !root} onClick={() => run('buf ' + action, async request => setResult(await request('buf',{action})))}>{action === 'lint' ? '校验' : '编译'}</button>)}</div></div>
    </aside>
    <section className="editor">
      <div className="route"><span>{sourceName}</span><span aria-hidden="true">→</span><b>{targetName || form.address || '待选择目标'}</b><div className="route-actions">
        {result && <button onClick={()=>output.current?.scrollIntoView({block:'center'})}>{result.ok?'查看结果':'查看失败原因'}{result.rpcMs!=null && ' · '+result.rpcMs+' ms'}</button>}
        {busy ? <button onClick={cancel}>取消{busy}</button> : <button className="primary" disabled={!!busy || !root || !method || !form.address.trim() || !validJson || !!Object.keys(issues).length} onClick={send}>发送请求</button>}</div></div>
      <div className="row spread"><h2>目标环境</h2>
      <select className="mini" aria-label="切换目标环境" disabled={!!busy} value={targetName} onChange={e=>{setTargetName(e.target.value);const env=envs.find(v=>v.name===e.target.value);if(env)patch({address:env.address,plaintext:env.plaintext,metadata:'{}'})}}><option value="">自定义目标</option>{envs.map(e=><option key={e.name}>{e.name}</option>)}</select></div>
      <fieldset disabled={!!busy}>
      <div className="row"><label className="grow">服务地址<input className="mono" placeholder="localhost:50051" value={form.address} onChange={e=>{setTargetName('');patch({address:e.target.value})}}/></label>
        <label className="transport">传输<select aria-label="传输" value={form.plaintext?'plain':'tls'} onChange={e=>{setTargetName('');patch({plaintext:e.target.value==='plain'})}}><option value="tls">TLS</option><option value="plain">明文 h2c</option></select></label>
        <button onClick={()=>setEnvEdit(v=>!v)}>保存目标</button></div>
      {envEdit && <div className="row">{field('目标环境名称',<input value={envName} onChange={e=>setEnvName(e.target.value)}/>)}<button onClick={keepEnv}>保存地址与传输</button></div>}
      <div className="box"><h2>RPC 接口</h2><div className="selectors">
      {field('Package',<select value={method?.package ?? ''} disabled={!schema.length} onChange={e=>choose(schema.find(m=>m.package===e.target.value))}>{!method && <option value="">请选择协议</option>}{packages.map(n=><option key={n} value={n}>{n||'（无 package）'}</option>)}</select>)}
      {field('Service',<select value={method?.service || ''} disabled={!services.length} onChange={e=>choose(schema.find(m=>m.package===method?.package && m.service===e.target.value))}>{services.map(n=><option key={n}>{n}</option>)}</select>)}
      {field('Method',<select value={method?.name || ''} disabled={!methods.length} onChange={e=>choose(schema.find(m=>m.name===e.target.value))}>{methods.map(m=><option key={m.name} value={m.name}>{m.rpc}</option>)}</select>)}
      </div></div>
      {method && <small>{method.input} → {method.output}{method.clientStreaming || method.serverStreaming ? ' · streaming' : ' · unary'}</small>}
      <Tabs names={['请求体','Metadata','断言']} value={tab} change={setTab}/>
      <div hidden={tab !== '请求体'}><div className="row spread"><h3>{method?.input || '请求参数'}</h3><div className="row"><button aria-pressed={bodyView==='字段'} disabled={!validJson || !method} onClick={()=>setBodyView('字段')}>字段</button><button aria-pressed={bodyView==='JSON'} disabled={!!Object.keys(issues).length} onClick={()=>setBodyView('JSON')}>JSON</button></div></div>
        {bodyView==='字段' && method && validJson ? <Fields key={method.name} value={payload} types={types} type={method.input} onChange={v=>patch({data:JSON.stringify(v,null,2)})} issue={issue}/> :
        field('请求 JSON',<textarea rows={6} spellCheck={false} value={form.data} onChange={change('data')}/>)}
        {Object.values(issues).map(m=><small className="fail" key={m}>{m}</small>)}
        <div className="row">{bodyView==='JSON' && <button onClick={()=>{try {patch({data:JSON.stringify(JSON.parse(form.data),null,2)});setError('')} catch(err){setError(err.message)}}}>格式化 JSON</button>}
        <button disabled={!method} onClick={()=>{patch({data:JSON.stringify(method.template,null,2)});setIssues({});setBodyView('JSON')}}>重置为协议模板</button></div></div>
      {tab === 'Metadata' && <>{field('gRPC Metadata（JSON 键值对）', <textarea rows={5} spellCheck={false} value={form.metadata} onChange={change('metadata')}/>)}<small>历史用例仅保存键名，回放前可在这里补填凭据。</small></>}
      {tab === '断言' && <><div className="row"><label className="grow">响应字段（JSON Pointer）<input placeholder="/result/id" value={form.pointer} onChange={change('pointer')}/></label><label className="grow">期望值（JSON）<input placeholder='"ok"' value={form.expected} onChange={change('expected')}/></label></div>
        {field('RPC 耗时上限（毫秒）', <input type="number" min="1" value={form.maxMs} onChange={change('maxMs')}/>)}<small>空路径匹配整个响应。每次发送都会检查 gRPC 是否成功。</small></>}
      <div className="box row"><label className="inline"><input type="checkbox" checked={save} onChange={e=>setSave(e.target.checked)}/>保存为用例</label>
      {save && <input style={{maxWidth:235}} aria-label="用例名称" placeholder="用例名称" value={form.name} onChange={change('name')}/>}</div></fieldset>
      {busy && <div className="row" role="status">{busy}… <button onClick={cancel}>取消</button></div>}
      {error && <p className="alert" role="alert">{error}</p>}
      <section ref={output} className="output" aria-live="polite"><div className="row spread"><h2>结果</h2>{result && <span className={'status '+(result.ok?'pass':'fail')}>{result.ok?'通过':'失败'} · {result.stage}</span>}</div>
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
