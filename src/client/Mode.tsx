/** Framework-derived session props and journal projection; actions carry explicit operator intent. */
import {useState} from 'react'
import {Menu,type MenuEntry} from '@deepseek-ai/dsh-client-ui-primitives'
import type {PropsRuntime,PropsLocale,InjectFace} from '@deepseek-ai/dsh-client-ui-slots'
import type {Request,Snapshot} from '../wire.ts'
import type {Key} from './locales.ts'
import css from './LongTask.module.css'
export interface ModeActions{act(request:Request):Promise<Snapshot>;open():void}
type Props=PropsRuntime<'conversation.session.header.utilities'>&PropsLocale<'longTask'>&InjectFace<ModeActions>
export function Mode({sessionId,useProjection,act,open,t}:Props){
 const job=useProjection('long-task-job');const [error,setError]=useState(''),[busy,setBusy]=useState(false),[menu,setMenu]=useState(false)
 const action=async(op:'ordinary'|'long'|'pause'|'resume'|'end'|'new'|'acknowledge')=>{setBusy(true);setError('');try{await act({op,sessionId})}catch(e){setError(String(e))}finally{setBusy(false)}}
 if(!job?.jobId)return null
 const entries:MenuEntry[]=[{type:'label',id:'state',text:t(job.phase as Key)+' · '+(job.reviewer?.backend==='jev'?'JEV':'Laya')},{id:'open',label:t('open')}]
 if(job.mode==='long'&&job.phase==='active')entries.push({id:'pause',label:t('pause'),disabled:busy})
 else if(job.phase!=='ended'&&job.phase!=='done')entries.push({id:'resume',label:t('resume'),disabled:busy})
 if(job.phase!=='active')entries.push({id:'new',label:t('newJob'),disabled:busy})
 if(job.phase!=='ended')entries.push({id:'end',label:t('end'),disabled:busy})
 if(job.pendingCalls.length)entries.push({type:'label',id:'uncertain',text:t('unknown')},{id:'acknowledge',label:t('ack'),disabled:busy})
 if(job.changes.length)entries.push({type:'label',id:'changes',text:t('changes')+': '+job.changes.map(c=>c.taskId).join(', ')})
 if(job.reason)entries.push({type:'label',id:'reason',text:job.reason})
 return <div className={css.mode}><Menu open={menu} portal align="end" items={entries} onClose={()=>setMenu(false)}
  anchor={<button className={css.jobTrigger} aria-label={t('jobActions')} aria-haspopup="menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{t('long')} · {t(job.phase as Key)} ▾</button>}
  onSelect={id=>{setMenu(false);if(id==='open')open();else if(['pause','resume','end','new','acknowledge'].includes(id))void action(id as 'pause'|'resume'|'end'|'new'|'acknowledge')}}/>
  {error&&<span role="alert" className={css.error}>{error}</span>}</div>
}
