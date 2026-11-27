import React, { useEffect, useState } from 'react'
import { isSpecial, seed } from '../src/descriptor.js'

function Scalar({ label, value, type, choices, update, issue }) {
  const [draft,setDraft] = useState(null)
  useEffect(()=>()=>issue(label,''),[label])
  const json = value === null || typeof value === 'object'
  function change(text) {
    try {
      let next = text
      if (json || typeof value === 'number') next = JSON.parse(text)
      if (typeof value === 'number' && (typeof next !== 'number' || !Number.isFinite(next))) throw Error('请输入有效数字')
      if (typeof value === 'boolean') next = text==='true'
      setDraft(null); issue(label,''); update(next)
    } catch (err) { setDraft(text); issue(label,label+' · '+err.message) }
  }
  const options = choices || (typeof value==='boolean' && ['true','false'])
  const props = {'aria-label':label,onChange:e=>change(e.target.value),onBlur:()=>{if(draft!==null && !json && String(value)===draft)setDraft(null)}}
  let control
  if (options) control = <select {...props} value={String(value)}>{options.map(v=><option key={v}>{v}</option>)}</select>
  else if (json) control = <textarea {...props} rows={2} value={draft ?? JSON.stringify(value,null,2)}/>
  else control = <input {...props} value={draft ?? value ?? ''} spellCheck={false}/>
  return <label className="value-field"><span><strong>{label}</strong><small>{type.replace(/^\./,'')}</small></span>{control}</label>
}

function Collection({ label, value, field, types, draw, update }) {
  const [key,setKey] = useState('')
  const map = types[field.type]?.map
  const values = Object.entries(value)
  const child = map ? types[field.type].fields[1] : {type:field.type}
  function remove(k) {
    if (!map) return update(value.filter((_,i)=>i!==Number(k)))
    const next = {...value}; delete next[k]; update(next)
  }
  return <section className="collection"><div className="row spread"><strong>{label}</strong><small>{map?'map':'repeated'} · {values.length}</small></div>
    {values.map(([k,v])=><div className="entry" key={k}>{draw(label+'['+k+']',v,child,next=>{
      if (map) update({...value,[k]:next})
      else update(value.map((x,i)=>i===Number(k)?next:x))
    })}<button aria-label={'移除 '+label+'['+k+']'} onClick={()=>remove(k)}>移除</button></div>)}
    <div className="row">{map && <input className="grow" aria-label={label+' 新键'} placeholder={'键 · '+types[field.type].fields[0].type} value={key} onChange={e=>setKey(e.target.value)}/>}
    <button disabled={map && Object.hasOwn(value,key)} onClick={()=>{
      const next = seed(child.type,types)
      update(map ? {...value,[key]:next} : [...value,next]); setKey('')
    }}>{map?'添加键值':'添加一项'}</button></div></section>
}

export function Fields({ value, type, types, onChange, issue }) {
  function draw(label,current,field,update) {
    const entry = types[field.type]
    const map = entry?.map
    if (field.repeated && (map ? current && typeof current==='object' && !Array.isArray(current) : Array.isArray(current))) {
      return <Collection key={label} label={label} value={current} types={types} field={field} draw={draw} update={update}/>
    }
    if (entry?.fields && !isSpecial(field.type) && current && typeof current==='object' && !Array.isArray(current)) {
      const content = Object.entries(current)
      const groups = [...new Set(entry.fields.map(f=>f.oneof).filter(Boolean))]
      if (content.length || groups.length) return <React.Fragment key={label}>
        {groups.map(group=>{
          const fields=entry.fields.filter(f=>f.oneof===group)
          const selected=fields.find(f=>Object.hasOwn(current,f.key))
          return <label className="value-field" key={group}>{group} · oneof<select aria-label={label+' '+group} value={selected?.key || ''} onChange={e=>{
            const next={...current}
            for(const f of fields) delete next[f.key]
            const f=fields.find(f=>f.key===e.target.value)
            update(f?{...next,[f.key]:seed(f.type,types)}:next)
          }}><option value="">不设置</option>{fields.map(f=><option key={f.key}>{f.key}</option>)}</select></label>
        })}
        {content.map(([k,v])=>draw(label?label+'.'+k:k,v,entry.fields.find(f=>f.key===k)||{type:'JSON'},next=>update({...current,[k]:next})))}
      </React.Fragment>
    }
    return <Scalar key={label} label={label||'请求值'} type={field.type} value={current} choices={entry?.choices} update={update} issue={issue}/>
  }
  return <div className="fields">{draw('',value,{type:'.'+type},onChange)}</div>
}
