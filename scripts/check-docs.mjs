/** Check the published guides and their local links without network access. */
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {resolve,dirname} from 'node:path'
const root=resolve(import.meta.dirname,'..')
const guides=['README.md','README.en.md','README.zh.md','docs/workflow.md','docs/workflow.en.md','CHANGELOG.md']
let links=0
for(const name of guides){
 const file=resolve(root,name),text=readFileSync(file,'utf8')
 for(const match of text.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
  const target=match[1].split('#')[0]
  if(!target||/^[a-z]+:/i.test(target))continue
  assert.ok(existsSync(resolve(dirname(file),decodeURIComponent(target))),`${name}: missing ${target}`);links++
 }
}
for(const name of ['task-routing.svg','review-cycle.svg']){
 const svg=readFileSync(resolve(root,'docs/images',name),'utf8')
 assert.match(svg,/<svg\b/);assert.match(svg,/<title\b/);assert.match(svg,/<desc\b/)
 assert.ok(!/\b(?:href|src)="https?:|<script\b/i.test(svg),`External or active image content: ${name}`)
}
const manifest=JSON.parse(readFileSync(resolve(root,'package.json'),'utf8'))
for(const name of ['README.en.md','docs','CHANGELOG.md'])assert.ok(manifest.files.includes(name),`Package omits ${name}`)
console.log(`PASS: ${guides.length} guides, ${links} local links, 2 self-contained SVG diagrams, package documentation entries`)
