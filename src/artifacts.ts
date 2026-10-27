/** Bounded byte manifests through the agent's filesystem capability (including remote backends). */
import { createHash } from 'node:crypto'
import type {Agent} from '@deepseek-ai/dsh-agent'
import type {FileRecord} from './wire.ts'
import type {} from '@deepseek-ai/dsh-fs'
export const hash=(value:unknown):string=>createHash('sha256').update(JSON.stringify(value)).digest('hex')
export async function capture(agent:Agent,paths:readonly string[],signal:AbortSignal):Promise<FileRecord[]> {
 const capability=agent.ctx.get('fs'),cwd=agent.session.header.cwd
 if(!capability||!cwd)throw new Error('交付物检查缺少任务文件系统或工作目录。')
 const fs=capability
 const root=await fs.resolve(cwd,{signal}),records:FileRecord[]=[],seen=new Set<string>();let bytes=0
 async function visit(path:string,depth:number):Promise<void>{
  signal.throwIfAborted()
  if(depth>32||records.length>=512)throw new Error('交付物检查不完整：超过目录深度或 512 项上限，请缩小交付路径。')
  const entry=await fs.lstat(path,{cwd},signal),target=await fs.resolve(path,{cwd,signal})
  if(!fs.contains(root,target))throw new Error(`交付路径越过工作目录（含软链接）：${path}`)
  const key=fs.processPath(target)
  if(seen.has(path))return;seen.add(path)
  if(!entry)throw new Error(`交付物不存在：${path}`)
  if(entry.type==='symlink')records.push({path,type:'symlink',hash:hash(key),bytes:0})
  const info=await fs.stat(target,signal)
  if(info?.type==='directory'){
   const children=await fs.listDir(target,signal);const names=children.map(x=>x.name).sort()
   records.push({path,type:'directory',hash:hash(names),bytes:0})
   for(const name of names)await visit(path.replace(/\/$/,'')+'/'+name,depth+1)
  }else if(info?.type==='file'){
   const data=await fs.readBytes(target,signal,Math.min(16*1024*1024,64*1024*1024-bytes))
   bytes+=data.byteLength;if(bytes>64*1024*1024)throw new Error('交付物检查不完整：超过 64 MiB 总预算。')
   const after=await fs.stat(target,signal)
   if(after?.version!==info.version)throw new Error(`交付物在检查时变化：${path}`)
   records.push({path,type:'file',hash:createHash('sha256').update(data).digest('hex'),bytes:data.byteLength})
  }else throw new Error(`无法完整检查交付路径：${path}`)
 }
 for(const path of [...new Set(paths)].sort())await visit(path,0)
 return records.sort((a,b)=>(a.path+a.type).localeCompare(b.path+b.type))
}
export function differences(before:FileRecord[],after:FileRecord[]):string[]{
 const a=new Map(before.map(x=>[x.path+'\0'+x.type,x])),b=new Map(after.map(x=>[x.path+'\0'+x.type,x]))
 return [...new Set([...a.keys(),...b.keys()].filter(k=>a.get(k)?.hash!==b.get(k)?.hash).map(k=>(a.get(k)??b.get(k))!.path))]
}
