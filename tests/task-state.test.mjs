import assert from 'node:assert/strict'
import test from 'node:test'
import {expandAffected, fingerprint, reopen, displayedItems} from '../src/loop/task-state.ts'

const task = (id, dependsOn = [], extra = {}) => ({id, title: id, requirement: `Do ${id}`, status: 'pending', result: '', evidenceIds: [], dependsOn, affectedPaths: [`${id}.txt`], critical: true, ...extra})
const state = tasks => ({tasks, assessments: {}, receipts: {}, threshold: 70})

test('revalidation reopens only the explicitly named items', () => {
  const tasks = [task('T1'), task('T2', ['T1']), task('T3', ['T2']), task('T4')]
  assert.deepEqual([...expandAffected(tasks, ['T1'])].sort(), ['T1'])
  assert.deepEqual([...expandAffected(tasks, ['T2'])].sort(), ['T2'])
  assert.deepEqual([...expandAffected(tasks, [])], [])
})

test('reopen resets only the named items', () => {
  const tasks = [task('T1', [], {status: 'completed', result: 'done', evidenceIds: ['7']}), task('T2', [], {status: 'completed', result: 'done', evidenceIds: ['8']})]
  const next = reopen(tasks, new Set(['T1']))
  assert.deepEqual(next[0], {...tasks[0], status: 'pending', result: '', evidenceIds: []})
  assert.deepEqual(next[1], tasks[1])
})

test('displayedItems reuses a cached judgment only for the same fingerprint', () => {
  const tasks = [task('T1', [], {status: 'completed', result: 'delivered', evidenceIds: ['7']})]
  const receipts = {7: 'receipt text'}
  const key = fingerprint(tasks[0], receipts)
  const cached = {tasks, receipts, assessments: {T1: {id: 'T1', fingerprint: key, status: 'completed', result: 'delivered', evidenceIds: ['7'], score: {rate: 0.8, criticalSatisfied: true}, passed: false, reused: false}}, threshold: 70}
  const reused = displayedItems(cached, 70)
  assert.equal(reused[0].reused, true)
  assert.equal(reused[0].passed, true)
  const changed = {...cached, receipts: {7: 'different receipt'}}
  assert.equal(displayedItems(changed, 70)[0].reused, false)
  assert.equal(displayedItems(changed, 70)[0].passed, false)
})

test('a critical item needs an explicit critical-satisfied judgment to pass', () => {
  const tasks = [task('T1', [], {status: 'completed', result: 'delivered', evidenceIds: []})]
  const key = fingerprint(tasks[0], {})
  const cached = {tasks, receipts: {}, assessments: {T1: {id: 'T1', fingerprint: key, status: 'completed', result: 'delivered', evidenceIds: [], score: {rate: 0.95, criticalSatisfied: false}, passed: false, reused: false}}, threshold: 70}
  assert.equal(displayedItems(cached, 70)[0].passed, false)
})
