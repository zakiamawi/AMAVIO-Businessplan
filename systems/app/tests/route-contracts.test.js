import test from 'node:test'
import assert from 'node:assert/strict'
import { externalRoutes, routeCount } from '../src/data/routes.js'

const expected = { professional: 6, housing: 6, partner: 6 }

test('all 18 external App routes are projected exactly once', () => {
  assert.equal(routeCount, 18)
  for (const [role, count] of Object.entries(expected)) assert.equal(externalRoutes[role].length, count, role)
  const ids = Object.values(externalRoutes).flat().map((item) => item.id)
  assert.equal(ids.length, new Set(ids).size)
  assert.equal(ids.filter((id) => /^P-/.test(id)).length, 6)
  assert.equal(ids.filter((id) => /^H-/.test(id)).length, 6)
  assert.equal(ids.filter((id) => /^L-/.test(id)).length, 6)
  assert.equal(ids.some((id) => /^[EO]-/.test(id)), false)
})

test('every App route carries bilingual content status and trust fields', () => {
  for (const item of Object.values(externalRoutes).flat()) {
    assert.ok(item.id)
    assert.ok(item.title.de && item.title.en)
    assert.ok(item.purpose.de && item.purpose.en)
    assert.ok(item.cta.de && item.cta.en)
    assert.ok(/^TN-\d{2}$/.test(item.trust), item.id)
    assert.ok(item.nonEffect.de && item.nonEffect.en)
    assert.notEqual(item.nonEffect.de, item.nonEffect.en)
    assert.ok(item.states.includes('NORMAL'))
  }
})
