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
 const [extendOpen,setExtendOpen]=useState(false),[extTools,setExtTools]=useState(''),[extMinutes,setExtMinutes]=useState('')
 const action=async(op:'ordinary'|'long'|'pause'|'resume'|'end'|'new'|'acknowledge')=>{setBusy(true);setError('');try{await act({op,sessionId})}catch(e){setError(String(e))}finally{setBusy(false)}}
 const extend=async()=>{setBusy(true);setError('');try{await act({op:'extend',sessionId,...(Number(extTools)>0?{toolCalls:Number(extTools)}:{}),...(Number(extMinutes)>0?{minutes:Number(extMinutes)}:{})});setExtendOpen(false);setExtTools('');setExtMinutes('')}catch(e){setError(String(e))}finally{setBusy(false)}}
 if(!job?.jobId)return null
 const limits=job.budget?{toolCalls:job.budget.limits.toolCalls+(job.budget.extra.toolCalls??0),minutes:job.budget.limits.minutes+(job.budget.extra.minutes??0)}:null
 const entries:MenuEntry[]=[{type:'label',id:'state',text:t(job.phase==='done'&&(job.route==='non_coding'||!job.reviewEnabled)?'completedNormal':job.phase as Key)+' · '+(job.route==='pending'?t('routing'):job.route==='non_coding'?(job.nonCodingMode==='direct'?t('nonCoding'):job.nonCodingMode==='selfCheck'?t('selfReview'):(job.reviewer?.backend==='jev'?'JEV':'Laya')):!job.reviewEnabled?t('selfReview'):(job.reviewer?.backend==='jev'?'JEV':'Laya'))},{type:'label',id:'budget',text:limits?`${t('budget')}: ${job.toolCalls}/${limits.toolCalls} · ${Math.floor(job.elapsedMs/60000)}/${limits.minutes}min${job.budget?.warned80?' · '+t('budgetWarn80'):''}`:t('budgetGlobal')},{id:'open',label:t('open')}]
 if(job.mode==='long'&&job.phase==='active')entries.push({id:'pause',label:t('pause'),disabled:busy})
 else if(job.phase!=='ended'&&job.phase!=='done')entries.push({id:'resume',label:t('resume'),disabled:busy})
 if(job.phase!=='active')entries.push({id:'new',label:t('newJob'),disabled:busy})
 if(['active','paused','blocked'].includes(job.phase))entries.push({id:'extend',label:t('extendBudget'),disabled:busy})
 if(job.phase!=='ended')entries.push({id:'end',label:t('end'),disabled:busy})
 if(job.pendingCalls.length)entries.push({type:'label',id:'uncertain',text:t('unknown')},{id:'acknowledge',label:t('ack'),disabled:busy})
 if(job.changes.length)entries.push({type:'label',id:'changes',text:t('changes')+': '+job.changes.map(c=>c.taskId).join(', ')})
 if(job.reason)entries.push({type:'label',id:'reason',text:job.reason})
 return <div className={css.mode}><Menu open={menu} portal align="end" items={entries} onClose={()=>setMenu(false)}
  anchor={<button className={css.jobTrigger} aria-label={t('jobActions')} aria-haspopup="menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{t('long')} · {t(job.phase==='done'&&(job.route==='non_coding'||!job.reviewEnabled)?'completedNormal':job.phase as Key)} ▾</button>}
  onSelect={id=>{setMenu(false);if(id==='open')open();else if(id==='extend')setExtendOpen(true);else if(['pause','resume','end','new','acknowledge'].includes(id))void action(id as 'pause'|'resume'|'end'|'new'|'acknowledge')}}/>
  {extendOpen&&<div className={css.extendPanel}>
   <label className={css.extendField}>{t('extendTools')}<input type="number" min="0" step="1" value={extTools} onChange={e=>setExtTools(e.target.value)}/></label>
   <label className={css.extendField}>{t('extendMinutes')}<input type="number" min="0" step="1" value={extMinutes} onChange={e=>setExtMinutes(e.target.value)}/></label>
   <div className={css.extendActions}><button type="button" disabled={busy} onClick={()=>void extend()}>{t('extendSave')}</button><button type="button" onClick={()=>setExtendOpen(false)}>{t('extendCancel')}</button></div>
  </div>}
  {error&&<span role="alert" className={css.error}>{error}</span>}</div>
}
