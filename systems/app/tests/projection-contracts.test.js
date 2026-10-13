import test from 'node:test'
import assert from 'node:assert/strict'
import { externalProjections } from '../src/data/projections.js'
import { externalRoutes } from '../src/data/routes.js'

const externalIds = Object.values(externalRoutes).flat().map((route) => route.id)
const localized = (value) => typeof value?.de === 'string' && value.de.length > 0 && typeof value?.en === 'string' && value.en.length > 0

test('all 18 external routes have exactly one role-specific projection', () => {
  const projectedIds = externalIds.filter((id) => externalProjections[id])
  assert.equal(projectedIds.length, 18)
  assert.deepEqual(projectedIds.toSorted(), externalIds.toSorted())
})

test('every external route has bilingual facts and at least two distinct work items', () => {
  for (const id of externalIds) {
    const projection = externalProjections[id]
    assert.ok(localized(projection.title), `${id} title incomplete`)
    assert.ok(localized(projection.intro), `${id} intro incomplete`)
    assert.equal(projection.facts.length, 3, `${id} needs three context facts`)
    assert.ok(projection.facts.every((entry) => localized(entry.label) && localized(entry.value)), `${id} facts incomplete`)
    assert.ok(projection.items.length >= 2, `${id} needs at least two work items`)
    assert.ok(projection.items.every((entry) => entry.id.startsWith(id) && localized(entry.title) && localized(entry.detail) && entry.state), `${id} item contract incomplete`)
  }
})
