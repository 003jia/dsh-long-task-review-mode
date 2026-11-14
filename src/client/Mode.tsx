/** Framework-derived session props and journal projection; actions carry explicit operator intent. */
import {useEffect,useRef,useState} from 'react'
import {Menu,type MenuEntry} from '@deepseek-ai/dsh-client-ui-primitives'
import type {PropsRuntime,PropsLocale,InjectFace} from '@deepseek-ai/dsh-client-ui-slots'
import type {Request,Snapshot} from '../wire.ts'
import type {Key} from './locales.ts'
import css from './LongTask.module.css'
export interface ModeActions{act(request:Request):Promise<Snapshot>;open():void}
type Props=PropsRuntime<'conversation.session.header.utilities'>&PropsLocale<'longTask'>&InjectFace<ModeActions>
export function Mode({sessionId,useProjection,act,open,t}:Props){
 const job=useProjection('long-task-job');const [error,setError]=useState(''),[busy,setBusy]=useState(false),[menu,setMenu]=useState(false)
 const [extendOpen,setExtendOpen]=useState(false),[extTools,setExtTools]=useState(''),[extMinutes,setExtMinutes]=useState(''),[extTokens,setExtTokens]=useState(''),[extCost,setExtCost]=useState(''),[extAssessments,setExtAssessments]=useState('')
 const [supplementOpen,setSupplementOpen]=useState(false),[supplement,setSupplement]=useState('')
 const lastPhase=useRef<string|undefined>(undefined)
 useEffect(()=>{
  const phase=job?.phase
  if(phase===undefined)return
  if(lastPhase.current===phase)return
  const previous=lastPhase.current;lastPhase.current=phase
  if(previous===undefined)return
  if(!['paused','blocked','done'].includes(phase))return
  if(typeof Notification==='undefined'||document.visibilityState!=='hidden')return
  const key=phase==='done'?'notifyDone':phase==='blocked'?'notifyBlocked':'notifyPaused'
  if(Notification.permission==='granted')new Notification(t('notifyTitle')+' '+t(key as Key),{body:job?.reason??''})
  else if(Notification.permission==='default')void Notification.requestPermission()
 },[job?.phase])
 const exportReport=()=>{if(!job)return
  const lines=['# 长任务验收报告','',`- jobId: ${job.jobId}`,`- 状态: ${job.phase}`,`- 路由: ${job.route}`,`- 阈值: ${job.threshold}%`,`- 通过项: ${job.acceptances.length}`,...job.acceptances.map(a=>`  - ${a.taskId}: ${(a.score*100).toFixed(1)}%`)]
  if(job.changes.length)lines.push('- 交付物变化:',...job.changes.map(c=>`  - ${c.taskId}: ${c.paths.join(', ')}`))
  if(job.reason)lines.push(`- 原因: ${job.reason}`)
  const blob=new Blob([lines.join('\n')+'\n'],{type:'text/markdown'}),url=URL.createObjectURL(blob),link=document.createElement('a')
  link.href=url;link.download=`long-task-${job.jobId??'report'}.md`;link.click();URL.revokeObjectURL(url)}
 const submitSupplement=async()=>{setBusy(true);setError('');try{await act({op:'supplement',sessionId,text:supplement});setSupplementOpen(false);setSupplement('')}catch(e){setError(String(e))}finally{setBusy(false)}}
 const action=async(op:'ordinary'|'long'|'pause'|'resume'|'end'|'new'|'acknowledge')=>{setBusy(true);setError('');try{await act({op,sessionId})}catch(e){setError(String(e))}finally{setBusy(false)}}
 const extend=async()=>{setBusy(true);setError('');try{await act({op:'extend',sessionId,...(Number(extTools)>0?{toolCalls:Number(extTools)}:{}),...(Number(extMinutes)>0?{minutes:Number(extMinutes)}:{}),...(Number(extTokens)>0?{modelTokens:Number(extTokens)}:{}),...(Number(extCost)>0?{cost:Number(extCost)}:{}),...(Number(extAssessments)>0?{assessments:Number(extAssessments)}:{})});setExtendOpen(false);setExtTools('');setExtMinutes('');setExtTokens('');setExtCost('');setExtAssessments('')}catch(e){setError(String(e))}finally{setBusy(false)}}
 if(!job?.jobId)return null
 const limits=job.budget?{toolCalls:job.budget.limits.toolCalls+(job.budget.extra.toolCalls??0),minutes:job.budget.limits.minutes+(job.budget.extra.minutes??0)}:null
 const entries:MenuEntry[]=[{type:'label',id:'state',text:t(job.phase==='done'&&(job.route==='non_coding'||!job.reviewEnabled)?'completedNormal':job.phase as Key)+' · '+(job.route==='pending'?t('routing'):job.route==='non_coding'?(job.nonCodingMode==='direct'?t('nonCoding'):job.nonCodingMode==='selfCheck'?t('selfReview'):(job.reviewer?.backend==='jev'?'JEV':'Laya')):!job.reviewEnabled?t('selfReview'):(job.reviewer?.backend==='jev'?'JEV':'Laya'))},{type:'label',id:'budget',text:limits?`${t('budget')}: ${job.toolCalls}/${limits.toolCalls} · ${Math.floor(job.elapsedMs/60000)}/${limits.minutes}min${job.budget?.warned80?' · '+t('budgetWarn80'):''}`:t('budgetGlobal')},{id:'open',label:t('open')}]
 if(job.mode==='long'&&job.phase==='active')entries.push({id:'pause',label:t('pause'),disabled:busy})
 else if(job.phase!=='ended'&&job.phase!=='done')entries.push({id:'resume',label:t('resume'),disabled:busy})
 if(job.phase!=='active')entries.push({id:'new',label:t('newJob'),disabled:busy})
 if(['active','paused','blocked'].includes(job.phase))entries.push({id:'extend',label:t('extendBudget'),disabled:busy})
 if(job.phase!=='ended')entries.push({id:'end',label:t('end'),disabled:busy})
 if(job.pendingCalls.length)entries.push({type:'label',id:'uncertain',text:t('unknown')},{id:'acknowledge',label:t('ack'),disabled:busy})
 entries.push({id:'report',label:t('exportReport')})
 if(job.phase!=='ended')entries.push({id:'supplement',label:t('addRequirement'),disabled:busy})
 if(job.changes.length)entries.push({type:'label',id:'changes',text:t('changes')+': '+job.changes.map(c=>c.taskId).join(', ')})
 if(job.reason)entries.push({type:'label',id:'reason',text:job.reason})
 return <div className={css.mode}><Menu open={menu} portal align="end" items={entries} onClose={()=>setMenu(false)}
  anchor={<button className={css.jobTrigger} aria-label={t('jobActions')} aria-haspopup="menu" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{t('long')} · {t(job.phase==='done'&&(job.route==='non_coding'||!job.reviewEnabled)?'completedNormal':job.phase as Key)} ▾</button>}
  onSelect={id=>{setMenu(false);if(id==='open')open();else if(id==='report')exportReport();else if(id==='supplement')setSupplementOpen(true);else if(id==='extend')setExtendOpen(true);else if(['pause','resume','end','new','acknowledge'].includes(id))void action(id as 'pause'|'resume'|'end'|'new'|'acknowledge')}}/>
  {extendOpen&&<div className={css.extendPanel}>
   <label className={css.extendField}>{t('extendTools')}<input type="number" min="0" step="1" value={extTools} onChange={e=>setExtTools(e.target.value)}/></label>
   <label className={css.extendField}>{t('extendMinutes')}<input type="number" min="0" step="1" value={extMinutes} onChange={e=>setExtMinutes(e.target.value)}/></label>
   <label className={css.extendField}>{t('extendTokens')}<input type="number" min="0" step="1" value={extTokens} onChange={e=>setExtTokens(e.target.value)}/></label>
   <label className={css.extendField}>{t('extendCost')}<input type="number" min="0" step="0.01" value={extCost} onChange={e=>setExtCost(e.target.value)}/></label>
   <label className={css.extendField}>{t('extendAssessments')}<input type="number" min="0" step="1" value={extAssessments} onChange={e=>setExtAssessments(e.target.value)}/></label>
   <div className={css.extendActions}><button type="button" disabled={busy} onClick={()=>void extend()}>{t('extendSave')}</button><button type="button" onClick={()=>setExtendOpen(false)}>{t('extendCancel')}</button></div>
  </div>}
  {supplementOpen&&<div className={css.extendPanel}>
   <label className={css.extendField}>{t('addRequirement')}<textarea value={supplement} onChange={e=>setSupplement(e.target.value)}/></label>
   <div className={css.extendActions}><button type="button" disabled={busy||supplement.trim()===''} onClick={()=>void submitSupplement()}>{t('supplementSave')}</button><button type="button" onClick={()=>setSupplementOpen(false)}>{t('supplementCancel')}</button></div>
  </div>}
  {error&&<span role="alert" className={css.error}>{error}</span>}</div>
}
