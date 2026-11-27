import React, { useState } from 'react'

export function SourceSettings({ run, onSaved, onClose, busy }) {
  const [draft, setDraft] = useState({ name:'', host:'', port:'22', username:'', auth:'password', password:'' })
  const [fingerprint, setFingerprint] = useState('')
  const edit = key => e => {
    setDraft({ ...draft, [key]:e.target.value })
    if (key === 'host' || key === 'port') setFingerprint('')
  }
  return <fieldset disabled={busy} className="source-card">
    <legend>添加 SSH 来源</legend>
    <label>来源名称<input value={draft.name} onChange={edit('name')} placeholder="例如：联调开发机"/></label>
    <div className="pair"><label>SSH 主机<input value={draft.host} onChange={edit('host')} placeholder="dev.example.com"/></label>
    <label>端口<input type="number" min="1" max="65535" value={draft.port} onChange={edit('port')}/></label></div>
    <label>用户名<input value={draft.username} onChange={edit('username')} autoComplete="off"/></label>
    <label>认证方式<select value={draft.auth} onChange={edit('auth')}><option value="password">保存密码</option><option value="agent">SSH agent 密钥</option></select></label>
    {draft.auth === 'password' && <label>SSH 密码<input type="password" value={draft.password} onChange={edit('password')} autoComplete="new-password"/></label>}
    {fingerprint && <p className="fingerprint">请与开发机的主机指纹核对<br/><code>{fingerprint}</code></p>}
    <div className="row"><button onClick={onClose}>收起</button>{fingerprint ?
      <button className="primary" onClick={() => run('保存来源',async request => {
        const res = await request('sources',{action:'save',...draft,fingerprint})
        onSaved(res.profile)
      })}>信任并保存</button> :
      <button onClick={() => run('读取主机指纹',async request => {
        const res = await request('sources',{action:'probe',host:draft.host,port:draft.port})
        setFingerprint(res.fingerprint)
      })}>读取主机指纹</button>}</div>
  </fieldset>
}

export function Browser({ listing, visit, select, close, busy, mode }) {
  const [jump, setJump] = useState(listing.dir)
  const [filter,setFilter] = useState('')
  const entries = listing.entries.filter(e => (e.directory || (mode === 'proto' ? e.name.endsWith('.proto') : e.name === 'buf.yaml')) && e.name.toLowerCase().includes(filter.toLowerCase()))
  return <section className="picker" aria-label="协议文件浏览器">
    <div className="row spread"><h3>{mode === 'proto' ? '选择 Proto 文件' : '选择 Buf 工作区'}</h3><button disabled={busy} onClick={close}>关闭</button></div>
    {!!listing.roots?.length && <label>驱动器<select disabled={busy} value={listing.roots.find(r=>listing.dir.toUpperCase().startsWith(r)) || ''} onChange={e=>visit(e.target.value)}><option value="" disabled>选择驱动器</option>{listing.roots.map(r=><option key={r}>{r}</option>)}</select></label>}
    <label>当前目录<div className="row"><input className="grow mono" value={jump} disabled={busy} onChange={e=>setJump(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')visit(jump)}}/><button disabled={busy} onClick={()=>visit(jump)}>前往</button></div></label>
    <input type="search" aria-label="筛选文件" placeholder="筛选文件或目录" value={filter} onChange={e=>setFilter(e.target.value)}/>
    <div className="files"><button disabled={busy || listing.parent===listing.dir} onClick={()=>visit(listing.parent)}>↑　上一级目录</button>
    {entries.map(e=><button key={e.path} disabled={busy} onClick={()=>e.directory ? visit(e.path) : select(mode === 'proto' ? e.path : listing.dir)}>
      <span className="kind">{e.directory?'目录':'文件'}</span>{e.name}</button>)}</div>
    {mode==='buf' && <button className="primary" disabled={busy || !listing.entries.some(e=>e.name==='buf.yaml' && !e.directory)} onClick={()=>select(listing.dir)}>使用此工作区</button>}
  </section>
}
