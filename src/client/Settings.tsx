/** Unified settings with explicit saves and retained drafts after failures. */
import {useEffect,useState} from 'react'
import {Button,Switch} from '@deepseek-ai/dsh-client-ui-primitives'
import type {PropsRuntime,PropsLocale,InjectFace} from '@deepseek-ai/dsh-client-ui-slots'
import type {Snapshot,Request,LoopSettings} from '../wire.ts'
import type {LayaSettings,LayaView} from '../laya/types.ts'
import type {ReviewerSettings,ReviewerView} from '../reviewer-wire.ts'
import {presets} from './presets.ts'
import css from './LongTask.module.css'
export interface SettingsActions {act(request:Request):Promise<Snapshot>;layaStatus():Promise<LayaView>;saveLaya(settings:LayaSettings):Promise<LayaView>;reconnect():Promise<LayaView>}
type Props=PropsRuntime<'settings.section'>&PropsLocale<'longTask'>&InjectFace<SettingsActions>
export function Settings({act,layaStatus,saveLaya,reconnect,t}:Props){
 const [draft,setDraft]=useState<Snapshot['settings']|null>(null),[loop,setLoop]=useState<LoopSettings|null>(null)
 const [reviewer,setReviewer]=useState<ReviewerView|null>(null),[reviewerDraft,setReviewerDraft]=useState<ReviewerSettings|null>(null),[key,setKey]=useState('')
 const [laya,setLaya]=useState<LayaView|null>(null),[preferences,setPreferences]=useState<LayaSettings|null>(null)
 const [error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[testing,setTesting]=useState(false)
 useEffect(()=>{let live=true;void Promise.all([act({op:'settings'}),layaStatus()]).then(([s,l])=>{if(live){setDraft(s.settings);setLoop(s.loop);setReviewer(s.reviewer);setReviewerDraft(s.reviewer.settings);setLaya(l);setPreferences(l.settings)}}).catch(e=>{if(live)setError(String(e))});return()=>{live=false}},[act,layaStatus])
 const run=async(fn:()=>Promise<void>,message=t('saved'))=>{setBusy(true);setError('');setNotice('');try{await fn();setNotice(message)}catch(e){setError(String(e))}finally{setBusy(false)}}
 const test=async(backend:'laya'|'jev')=>{setTesting(true);setError('');setNotice('');try{const s=await act({op:'testReviewer',backend});setReviewer(s.reviewer);setNotice(t('testPassed'))}catch(e){setError(String(e));const s=await act({op:'settings'}).catch(()=>null);if(s)setReviewer(s.reviewer)}finally{setTesting(false)}}
 if(!draft||!preferences||!loop||!reviewer||!reviewerDraft)return <section className={css.settings}>{error?<p role="alert">{error}</p>:t('loading')}</section>
 const disabled=busy||testing,cloudDirty=JSON.stringify(reviewerDraft)!==JSON.stringify(reviewer.settings)||key!==''
 return <section className={css.settings}><p>{t('hint')}</p>
  <div className={css.group}><h3>{t('claudeLoop')}</h3><p>{t('presetHint')}</p>
   <div className={css.presets}>{presets.map(p=><Button variant="outline" key={p.name} disabled={disabled} title={t(p.hint)} onClick={()=>{setLoop({...loop,...p.values});setNotice(t('staged'))}}>{t(p.name)}<span className={css.presetHint}>{t(p.hint)}</span></Button>)}</div>
   <p>{t('currentLoop')}: {loop.maxToolTurns===0?t('unlimited'):loop.maxToolTurns} {t('toolSteps')} · {Math.round(loop.snipAtRatio*100)}% {t('trimContext')} · {loop.maxTokensRecoveryLimit} {t('resumes')}</p>
   <label className={css.field}>{t('maxToolTurns')}<input type="number" min="0" value={loop.maxToolTurns} onChange={e=>setLoop({...loop,maxToolTurns:Number(e.target.value)})}/></label>
   <div className={css.field}><span>{t('deferMcpTools')}</span><Switch label={t('deferMcpTools')} checked={loop.deferMcpTools} disabled={disabled} onChange={value=>setLoop({...loop,deferMcpTools:value})}/></div><p className={css.muted}>{t('toolHint')}</p>
   <details open={error?true:undefined}><summary>{t('loopAdvanced')}</summary>
    {(['snipAtRatio','compactAtRatio','turnTokenBudget','budgetCompletionRatio','budgetDiminishingDelta','maxTokensRecoveryLimit','layaReviewMaxRepairs','layaReviewTimeoutMs','layaReviewStallRounds'] as const).map(name=><label key={name} className={css.field}>{t(name)}<input type="number" min="0" step={name.endsWith('Ratio')?'0.05':'1'} value={loop[name]} onChange={e=>setLoop({...loop,[name]:Number(e.target.value)})}/></label>)}
    <label className={css.field}>{t('planAgentModel')}<input value={loop.planAgentModel??''} onChange={e=>setLoop({...loop,planAgentModel:e.target.value||null})}/></label><p className={css.muted}>{t('loopAdvancedHint')}</p>
   </details><Button disabled={disabled} onClick={()=>void run(async()=>{setLoop((await act({op:'saveLoop',loop})).loop)})}>{t('saveLoop')}</Button>
  </div>
  <div className={css.group}><h3>{t('reviewerTitle')}</h3><p>{t('reviewerHint')}</p>
   <p>{t('service')}: {reviewer.settings.backend==='jev'?t('cloudJev'):t('localLaya')} · {reviewer.settings.backend==='jev'?t(reviewer.phase):laya?t(laya.phase):t('loading')}</p>
   <label className={css.field}>{t('reviewerBackend')}<select value={reviewerDraft.backend} disabled={disabled} onChange={e=>setReviewerDraft({...reviewerDraft,backend:e.target.value as ReviewerSettings['backend']})}><option value="laya">{t('localLaya')}</option><option value="jev">{t('cloudJev')}</option></select></label>
   <Button disabled={disabled} onClick={()=>void run(async()=>{const s=await act({op:'saveReviewer',reviewer:reviewerDraft,...key?{apiKey:key}:{}});setReviewer(s.reviewer);setReviewerDraft(s.reviewer.settings);setKey('')})}>{t('saveReviewer')}</Button>
   <details open={reviewerDraft.backend==='jev'||error?true:undefined}><summary>{t('cloudJev')}</summary>
    <p>{t('jevProtocol')}</p><p>{t('cloudStatus')}: {t(reviewer.phase)} · {reviewer.credentialConfigured?t('keySaved'):t('keyMissing')}</p>
    <label className={css.field}>{t('endpoint')}<input type="url" value={reviewerDraft.endpoint} onChange={e=>setReviewerDraft({...reviewerDraft,endpoint:e.target.value})}/></label>
    <label className={css.field}>{t('jevModel')}<input value={reviewerDraft.model} onChange={e=>setReviewerDraft({...reviewerDraft,model:e.target.value})}/></label>
    <label className={css.field}>{t('apiKey')}<input type="password" autoComplete="new-password" value={key} placeholder={reviewer.credentialConfigured?t('keyKeep'):t('keyMissing')} onChange={e=>setKey(e.target.value)}/></label>
    <label className={css.field}>{t('jevTimeout')}<input type="number" min="1000" value={reviewerDraft.timeoutMs} onChange={e=>setReviewerDraft({...reviewerDraft,timeoutMs:Number(e.target.value)})}/></label>
    <p className={css.muted}>{t('cloudHint')}</p><Button disabled={disabled||cloudDirty||!reviewer.credentialConfigured} onClick={()=>void test('jev')}>{t('testJev')}</Button>
    {cloudDirty&&<p className={css.muted}>{t('saveBeforeTest')}</p>}
   </details>
   <details open={error?true:undefined}><summary>{t('localLaya')}</summary>
    <p>{t('service')}: {laya?t(laya.phase):t('loading')} · {t('actualDevice')}: {laya?.actualDevice??'—'}</p>{laya?.error&&<p role="alert" className={css.error}>{laya.error}</p>}
    <div className={css.field}><span>{t('enabled')}</span><Switch label={t('enabled')} checked={preferences.enabled} disabled={disabled} onChange={value=>setPreferences({...preferences,enabled:value})}/></div>
    <label className={css.field}>{t('launcher')}<input value={preferences.launcher} onChange={e=>setPreferences({...preferences,launcher:e.target.value})}/></label>
    <label className={css.field}>{t('device')}<select value={preferences.device} onChange={e=>setPreferences({...preferences,device:e.target.value as LayaSettings['device']})}>{['auto','cpu','mps','cuda'].map(v=><option key={v}>{v}</option>)}</select></label>
    <label className={css.field}>{t('localModels')}<input value={preferences.models.join(', ')} onChange={e=>setPreferences({...preferences,models:e.target.value.split(',').map(v=>v.trim())})}/></label>
    <div className={css.field}><span>{t('preload')}</span><Switch label={t('preload')} checked={preferences.preload} disabled={disabled} onChange={value=>setPreferences({...preferences,preload:value})}/></div>
    <div className={css.field}><span>{t('offline')}</span><Switch label={t('offline')} checked={preferences.offline} disabled={disabled} onChange={value=>setPreferences({...preferences,offline:value})}/></div>
    <label className={css.field}>{t('localTimeout')}<input type="number" min="1000" value={preferences.timeoutMs} onChange={e=>setPreferences({...preferences,timeoutMs:Number(e.target.value)})}/></label>
    <div className={css.actions}><Button disabled={disabled} onClick={()=>void run(async()=>{const l=await saveLaya(preferences);setLaya(l);setPreferences(l.settings)})}>{t('saveService')}</Button><Button disabled={disabled} onClick={()=>void run(async()=>{setLaya(await reconnect())},t('reconnected'))}>{t('reconnect')}</Button><Button disabled={disabled||laya?.phase!=='ready'||JSON.stringify(preferences)!==JSON.stringify(laya.settings)} onClick={()=>void test('laya')}>{t('testLaya')}</Button></div>
    <details><summary>{t('availableTools')} ({laya?.tools.length??0})</summary>{laya?.tools.map(tool=><details key={tool.name}><summary>{tool.name}</summary><p>{tool.description}</p><pre className={css.code}>{tool.schema}</pre></details>)}</details>
   </details>
   {testing&&<p role="status">{t('checking')} <Button onClick={()=>void act({op:'cancelReviewerTest'}).catch(e=>setError(String(e)))}>{t('cancelTest')}</Button></p>}
   {reviewer.test&&<p role="status">{reviewer.test.backend==='jev'?'JEV':'Laya'} · {reviewer.test.model??'—'} · {(reviewer.test.rate*100).toFixed(1)}% · {reviewer.test.elapsedMs} ms · {t('testSample')}</p>}
  </div>
  <div className={css.group}><h3>{t('budgetsTitle')}</h3>
   {(['threshold','noProgressLimit','maxToolCalls','maxAssessments','maxMinutes'] as const).map((name,i)=><label key={name} className={css.field}>{t((['threshold','noProgress','tools','assessments','minutes'] as const)[i]!)}<input type="number" value={draft[name]} onChange={e=>setDraft({...draft,[name]:Number(e.target.value)})}/></label>)}
   <details open={error?true:undefined}><summary>{t('costAdvanced')}</summary><p>{t('costHint')}</p>{(['maxModelTokens','maxCost','inputPerMillion','outputPerMillion'] as const).map((name,i)=><label key={name} className={css.field}>{t((['tokens','cost','inputPrice','outputPrice'] as const)[i]!)}<input type="number" min="0" value={draft[name]} onChange={e=>setDraft({...draft,[name]:Number(e.target.value)})}/></label>)}</details>
   <Button disabled={disabled} onClick={()=>void run(async()=>{setDraft((await act({op:'save',...draft})).settings)})}>{t('saveBudgets')}</Button>
  </div>{error&&<p role="alert" className={css.error}>{error}</p>}{notice&&<p role="status">{notice}</p>}
 </section>
}
