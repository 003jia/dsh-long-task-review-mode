/** Single installation unit for explicit long-task execution, local grading and native UI. */
import type {Context,Volatile} from '@deepseek-ai/cordis'
import schema from '@deepseek-ai/schemastery'
import * as Loop from './loop/index.ts'
import * as Laya from './laya/index.ts'
import * as Panel from './panel/index.ts'
import {LongTaskPreset} from './mode-preset.ts'
import {Reviewers} from './reviewers.ts'
import type {ReviewerSelection} from './reviewer-wire.ts'
import {LongTasks} from './jobs.ts'
import {PACKAGE,remoteContribution} from './wire.ts'
export type * from './laya/types.ts'
export type * from './panel/types.ts'
export const name='long-task'
export const inject=['typert','settings']
export interface Config {reviewer:Volatile<ReviewerSelection>;reviewerMaxInputBytes:number;reviewerMaxResponseBytes:number;loop:Loop.ClaudeLoopAlignmentConfig;laya:Laya.Config;panel:Panel.Config;noProgressLimit:Volatile<number>;maxToolCalls:Volatile<number>;maxAssessments:Volatile<number>;maxMinutes:Volatile<number>;maxModelTokens:Volatile<number>;maxCost:Volatile<number>;inputPerMillion:Volatile<number>;outputPerMillion:Volatile<number>}
export const Config=schema.object({reviewer:schema.object({backend:schema.union(['laya','jev']).default('laya'),endpoint:schema.string().default('https://api.typesafe.ai/v1/systemone'),model:schema.string().default('jev-latest'),timeoutMs:schema.number().min(1000).max(3600000).default(120000),credentialRef:schema.string().default('TYPESAFE_API_KEY'),revision:schema.string().default('local-v1')}).volatile(),reviewerMaxInputBytes:schema.number().min(1024).max(1000000).default(96000),reviewerMaxResponseBytes:schema.number().min(1024).max(1048576).default(262144),maxModelTokens:schema.number().min(1000).max(1000000000).default(1000000).volatile(),maxCost:schema.number().min(0).max(1000000).default(0).volatile(),inputPerMillion:schema.number().min(0).max(1000000).default(0).volatile(),outputPerMillion:schema.number().min(0).max(1000000).default(0).volatile(),loop:Loop.Config,laya:Laya.Config,panel:Panel.Config,noProgressLimit:schema.number().min(1).max(20).step(1).default(3).volatile(),maxToolCalls:schema.number().min(1).max(100000).step(1).default(2000).volatile(),maxAssessments:schema.number().min(1).max(10000).step(1).default(200).volatile(),maxMinutes:schema.number().min(1).max(10080).default(240).volatile()})
export async function apply(ctx:Context,config:Config):Promise<void>{
 ctx.effect(()=>ctx.settings.configure({auto:false}),'long task custom settings')
 ctx.effect(()=>ctx.typert.register({package:PACKAGE,face:'host',schemas:[],model:{services:[],events:[],objects:[]},invocations:remoteContribution.descriptors}),'long task contract')
 if(ctx.get('agentPresets'))await ctx.plugin(LongTaskPreset).await()
 else ctx.inject(['agentPresets'],ctx=>{ctx.plugin(LongTaskPreset)})
 Laya.apply(ctx,config.laya)
 await ctx.plugin(Reviewers,config).await()
 ctx.plugin(LongTasks,config)
 ctx.inject(['longTasks',...Loop.inject,...Panel.inject],ctx=>{
  Loop.apply(ctx,config.loop)
  Panel.apply(ctx,config.panel)
 })
}
