import test from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes, generateKeyPairSync } from 'node:crypto'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http2'
import { tmpdir } from 'node:os'
import path from 'node:path'
import ssh2 from 'ssh2'
import { execute } from '../src/workspace.js'
import { credentials, profiles, saveProfile, deleteProfile } from '../src/profiles.js'
import { probe } from '../src/runtime.js'

const sftpServer = ['/usr/libexec/openssh/sftp-server','/usr/lib/openssh/sftp-server'].find(p=>existsSync(p))

test('独立 Proto、密码来源、远程 RPC 与指纹校验', async t => {
  const dir = await mkdtemp(path.join(tmpdir(),"ilabrat ' 测试 "))
  const oldHome = process.env.ILABRAT_HOME
  process.env.ILABRAT_HOME = path.join(dir,'profile')
  t.after(async () => {
    if (oldHome === undefined) delete process.env.ILABRAT_HOME
    else process.env.ILABRAT_HOME = oldHome
    await rm(dir,{recursive:true,force:true})
  })
  const file = path.join(dir,'echo.proto')
  await writeFile(path.join(dir,'data.proto'),'syntax="proto3"; package data; message Payload { string text = 1; }')
  await writeFile(file,'syntax="proto3"; package lab; import "data.proto"; service Echo { rpc Get(data.Payload) returns (data.Payload); }')
  const schema = await execute('buf',{action:'schema',proto:file},dir)
  assert.equal(schema.ok,true,schema.stderr)
  assert.equal(schema.methods[0].package,'lab')
  assert.deepEqual({...schema.methods[0].template},{text:''})
  const echo = createServer()
  echo.on('stream',(stream,headers)=>{
    assert.equal(headers[':path'],'/lab.Echo/Get')
    stream.respond({':status':200,'content-type':'application/grpc'},{waitForTrailers:true})
    stream.on('wantTrailers',()=>stream.sendTrailers({'grpc-status':'0'}))
    stream.pipe(stream)
  })
  echo.listen(0,'127.0.0.1'); await once(echo,'listening')
  t.after(()=>new Promise(resolve=>echo.close(resolve)))
  const data = JSON.stringify({text:"来自 RPC 的 ' 和空格"})
  const args = {proto:file, address:'127.0.0.1:'+echo.address().port, plaintext:true, method:'lab.Echo/Get',data}
  assert.deepEqual((await execute('grpcurl',args,dir)).response,JSON.parse(data))

  await t.test('SSH 密码来源使用 SFTP 和远程工具', {skip: !sftpServer}, async () => {
    const password = randomBytes(24).toString('hex')
    // ssh2 accepts PKCS#1 PEM for RSA host keys.
    const hostKey = generateKeyPairSync('rsa',{modulusLength:2048}).privateKey.export({type:'pkcs1',format:'pem'})
    let commands = 0, authentications = 0
    const server = new ssh2.Server({hostKeys:[hostKey]}, client => {
      client.on('error',()=>{})
      client.on('authentication',ctx=>{
        authentications++
        if (ctx.method==='password' && ctx.username==='tester' && ctx.password===password) ctx.accept()
        else ctx.reject(['password'])
      })
      client.on('ready',()=>client.on('session',accept=>{
        const session = accept()
        function bridge(channel,proc) {
          channel.on('error',()=>{})
          proc.stdin.on('error',()=>{})
          channel.pipe(proc.stdin); proc.stdout.pipe(channel,{end:false}); proc.stderr.pipe(channel.stderr,{end:false})
          proc.on('close',code=>{channel.exit(code ?? 1);channel.end()})
          channel.on('close',()=>proc.kill())
        }
        session.on('subsystem',(accept,reject,info)=>{
          if (info.name !== 'sftp') return reject()
          bridge(accept(),spawn(sftpServer,[],{cwd:dir}))
        })
        session.on('exec',(accept,reject,info)=>{
          commands++
          bridge(accept(),spawn('/bin/sh',['-c',info.command],{cwd:dir}))
        })
      }))
    })
    server.listen(0,'127.0.0.1'); await once(server,'listening')
    try {
      const endpoint = {host:'127.0.0.1',port:server.address().port}
      const fingerprint = await probe(endpoint)
      assert.equal(authentications,0)
      const profile = await saveProfile({...endpoint,username:'tester',name:'联调机',auth:'password',password,fingerprint})
      assert.equal((await credentials(profile.id)).password,password)
      assert.equal(JSON.stringify(await profiles()).includes(password),false)
      assert.equal((await readFile(path.join(process.env.ILABRAT_HOME,'sources',profile.id+'.json'),'utf8')).includes(password),false)
      const remote = {sourceId:profile.id}
      const listing = await execute('browse',{...remote,dir:'.'},'/unused')
      assert.equal(listing.ok,true,listing.stderr)
      assert.ok(listing.entries.some(e=>e.path===file))
      const discovered = await execute('buf',{...remote,proto:'echo.proto',action:'schema'},'/unused')
      assert.equal(discovered.ok,true,discovered.stderr)
      const res = await execute('grpcurl',{...args,...remote,proto:'echo.proto',save:true},'/unused')
      assert.equal(res.ok,true,res.stderr)
      assert.deepEqual(res.response,JSON.parse(data))
      assert.equal((await execute('grpcurl',{...remote,proto:'echo.proto',action:'history'},'/unused')).cases[0].id,res.caseId)
      assert.deepEqual((await execute('grpcurl',{proto:file,action:'history'},dir)).cases,[])
      await writeFile(path.join(dir,'buf.yaml'),'version: v2\n')
      assert.equal((await execute('buf',{...remote,dir,action:'schema'},'/unused')).methods[0].name,'lab.Echo/Get')
      for(let i=0;i<2;i++) {
        const result = await execute('buf',{...remote,dir,action:'build'},'/unused')
        assert.equal(result.ok,true,result.stderr)
      }
      assert.ok(commands>=6)
      const bad = await saveProfile({...profile,password,fingerprint:'SHA256:'+'A'.repeat(43)})
      const before = authentications
      const refused = await execute('browse',{sourceId:bad.id},dir)
      assert.match(refused.stderr,/指纹/)
      assert.equal(authentications,before)
      await deleteProfile(profile.id)
      assert.equal((await profiles()).some(p=>p.id===profile.id),false)
    } finally { await new Promise(resolve=>server.close(resolve)) }
  })
})
