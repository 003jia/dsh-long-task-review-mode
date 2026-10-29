/** Build against the shared DSH workspace; never install a second Cordis. */
import {createRequire} from 'node:module'
import {resolve,dirname} from 'node:path'
import {spawnSync} from 'node:child_process'
import {readFileSync,writeFileSync,mkdirSync,existsSync,symlinkSync,rmSync,readdirSync} from 'node:fs'
const root=resolve(import.meta.dirname,'..'),source=process.env.DSH_SOURCE
if(!source)throw Error('Set DSH_SOURCE to a built compatible DSH source workspace (with dependencies)')
const sourceRequire=createRequire(resolve(source,'package.json'))
// Resolve private build dependencies from that workspace without copying shared services.
for(const name of ['typescript','tsdown','zod','acorn','js-yaml','@types']){
 const dest=resolve(root,'node_modules',name);let from=resolve(source,'node_modules',name)
 if(!existsSync(from)){const versions={acorn:'8.18.0'},id=readdirSync(resolve(source,'node_modules/.pnpm')).find(n=>n.startsWith(name.replaceAll('/','+')+'@'+versions[name]));if(!id)throw Error('Missing workspace dependency: '+name);from=resolve(source,'node_modules/.pnpm',id,'node_modules',name)}
 if(!existsSync(dest)){rmSync(dest,{force:true});mkdirSync(dirname(dest),{recursive:true});symlinkSync(from,dest,'dir')}
}
const mcp=resolve(root,'node_modules/@modelcontextprotocol/client')
if(!existsSync(mcp)){
 const req=createRequire(resolve(source,'packages/mcp/mcp-client/package.json'))
 let dir=dirname(req.resolve('@modelcontextprotocol/client'))
 while(!existsSync(resolve(dir,'package.json')))dir=dirname(dir)
 mkdirSync(dirname(mcp),{recursive:true});symlinkSync(dir,mcp,'dir')
}
const cfg=JSON.parse(readFileSync(resolve(root,'tsconfig.json'),'utf8'))
const prefix='../../dsh-upgrades/upgrade-0.2.1-alpha.2/'
cfg.compilerOptions.paths=Object.fromEntries(Object.entries(cfg.compilerOptions.paths).map(([name,paths])=>[name,paths.map(p=>p.startsWith(prefix)?resolve(source,p.slice(prefix.length)):p)]))
cfg.compilerOptions.typeRoots=cfg.compilerOptions.typeRoots.map(p=>resolve(source,p.slice(prefix.length)))
const generated=resolve(root,'tsconfig.generated.json');writeFileSync(generated,JSON.stringify(cfg,null,2))
try{
 for(const [bin,args] of [[process.execPath,[sourceRequire.resolve('typescript/bin/tsc'),'-p',generated]],[resolve(source,'node_modules/.bin/tsdown'),[]]]){
  const r=spawnSync(bin,args,{cwd:root,env:process.env,stdio:'inherit'});if(r.status!==0)process.exit(r.status??1)
 }
 const ts=sourceRequire('typescript'),host=resolve(root,'lib/index.js')
 writeFileSync(host,ts.transpileModule(readFileSync(host,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,experimentalDecorators:false}}).outputText)
 for(const name of ['index.js','client.js']){const path=resolve(root,'lib',name);writeFileSync(path,readFileSync(path,'utf8').replace(/^(\s*\/\/#region )[^\n]*dsh-css:[^\n]*$/gm,'$1bundled module'))}
}finally{rmSync(generated,{force:true})}
