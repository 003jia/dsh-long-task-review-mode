/** Resolve shared modules to the installed formal DSH runtime, retaining one Cordis identity. */
import { createRequire, registerHooks } from 'node:module'
import { readFileSync,mkdirSync } from 'node:fs'
import {resolve} from 'node:path'
mkdirSync(resolve(import.meta.dirname,'../test-results'),{recursive:true})
export const runtime=(process.env.DSH_RUNTIME??'/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/dsh').replace(/\/$/,'')+'/'
export const formalRequire=createRequire(runtime+'node_modules/@deepseek-ai/dsh/package.json')
export const nativeExecutorPackages=(()=>{try{formalRequire.resolve('@deepseek-ai/dsh-tool-executor-native');return ['dsh-tool-executor-native']}catch{return []}})()
const map=new Map()
for(const item of JSON.parse(readFileSync(runtime+'desktop-runtime.json')).sharedPackages){
  const manifest=JSON.parse(readFileSync(runtime+'node_modules/'+item.name+'/package.json'))
  for(const suffix of ['',...Object.keys(manifest.exports??{}).filter(k=>k.startsWith('./')&&!k.includes('*')).map(k=>k.slice(1))]){
    try{map.set(item.name+suffix,formalRequire.resolve(item.name+suffix))}catch{/* Type-only exports need no runtime mapping. */}
  }
}
registerHooks({resolve(specifier,context,next){return next(map.get(specifier)??specifier,context)}})
