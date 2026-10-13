import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeState, stateContracts, stateOrder } from '../src/data/states.js'

test('all 20 G2.2 states are implemented', () => {
  assert.equal(stateOrder.length, 20)
  assert.equal(Object.keys(stateContracts).length, 20)
  assert.deepEqual(new Set(stateOrder), new Set(Object.keys(stateContracts)))
})

test('every state has bilingual meaning and action', () => {
  for (const id of stateOrder) {
    const state = stateContracts[id]
    assert.ok(state.tone, id)
    assert.ok(state.title.de && state.title.en, id)
    assert.ok(state.body.de && state.body.en, id)
    assert.ok(state.action.de && state.action.en, id)
  }
})

test('unknown state falls back without exposing a technical key', () => {
  assert.equal(normalizeState('unknown-internal-state'), 'NORMAL')
})
