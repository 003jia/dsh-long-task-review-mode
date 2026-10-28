/** Add one native choice using the deployment's existing Standard composition. */
import {Service,type Context} from '@deepseek-ai/cordis'
import {entryListSchema} from '@deepseek-ai/cordis-plugin-include'
import {entryListProblem,type PresetDefinition} from '@deepseek-ai/dsh-agent-preset-registry'
import {load} from 'js-yaml'
export const LONG_TASK_PRESET='long-task'
function checkRows(value:unknown):asserts value is PresetDefinition['plugins']{
 const problem=entryListProblem(value);if(problem)throw new Error('Cannot compose long-task mode: '+problem)
}
export class LongTaskPreset {
 static inject=['agentPresets']
 constructor(private ctx:Context){}
 async* [Service.init](){
  const document=await this.ctx.agentPresets.readDocument('standard')
  const plugins=load(document.content,{schema:entryListSchema});checkRows(plugins)
  yield await this.ctx.agentPresets.register({id:LONG_TASK_PRESET,name:'长任务模式',
   description:'先判断是否为代码任务，再按验收开关选择 plan.md 与 Laya/Jev 验收或主模型自检；非代码任务正常回答。',order:1.5,plugins})
 }
}
