import { execFileSync } from 'node:child_process'
import { cp, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../',import.meta.url))
const pkg = JSON.parse(await readFile(path.join(root,'package.json'),'utf8'))
const stage = await mkdtemp(path.join(tmpdir(),'ilabrat-pack-'))
const npm = (args,cwd) => execFileSync(process.execPath,[process.env.npm_execpath,...args],{cwd,stdio:'inherit'})
try {
  npm(['run','build'],root)
  for (const name of ['package.json','package-lock.json',...pkg.files]) {
    await cp(path.join(root,name),path.join(stage,name),{recursive:true})
  }
  npm(['ci','--omit=dev','--omit=optional','--ignore-scripts','--no-audit','--no-fund'],stage)
  npm(['pack','--pack-destination',root],stage)
} finally { await rm(stage,{recursive:true,force:true}) }
