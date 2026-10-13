import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { arrivalScope, forbiddenProjectionKeys, roleVisibility } from '../src/arrival/contracts.js'

const load = (name) => JSON.parse(readFileSync(new URL(`../contracts/${name}`, import.meta.url), 'utf8'))
const contract = load('app-acc-interface-contract.v1.json')
const mapping = load('status-mapping.v1.json')
const fixture = load('synthetic-arrival-integration-fixture.v1.json')

test('interface contract fixes the product role and codebase boundary', () => {
  assert.deepEqual(contract.surfaces.app, ['professional', 'housing', 'partner'])
  assert.deepEqual(Object.keys(roleVisibility).sort(), ['housing', 'partner', 'professional'])
  assert.deepEqual(arrivalScope.externalRoleIds, contract.surfaces.app)
  assert.ok(contract.surfaces.acc.includes('operations'))
  assert.ok(contract.surfaces.acc.includes('employer_hr'))
})

test('every boundary message requires versioned and idempotent semantics', () => {
  assert.equal(contract.transportSemantics.idempotencyRequired, true)
  assert.equal(contract.transportSemantics.optimisticVersionRequired, true)
  assert.equal(contract.transportSemantics.silentOverwriteAllowed, false)
  assert.equal(contract.transportSemantics.lastWriteWinsAllowed, false)
  for (const entry of contract.directions.appToCore) {
    assert.ok(entry.requiredEnvelope.includes('idempotencyKey'))
    assert.ok(entry.requiredEnvelope.includes('objectVersion'))
    assert.ok(entry.requiredEnvelope.includes('correlationId'))
  }
})

test('interface contract and fixture exclude forbidden private or internal fields', () => {
  assert.deepEqual(contract.forbiddenFields, forbiddenProjectionKeys)
  const corpus = JSON.stringify(fixture)
  for (const key of forbiddenProjectionKeys) assert.doesNotMatch(corpus, new RegExp(`\\"${key}\\"`, 'i'))
})

test('status mapping never collapses App and ACC into one state machine', () => {
  assert.match(mapping.rule, /bounded-context states/)
  assert.ok(mapping.mappings.every((entry) => Object.hasOwn(entry, 'appState') && Object.hasOwn(entry, 'accMeaning')))
  assert.ok(mapping.mappings.some((entry) => entry.accMeaning === null))
  assert.ok(mapping.mappings.every((entry) => entry.appState !== 'active' && entry.appState !== 'awaiting_decision'))
})

test('the shared synthetic fixture covers all phases disruptions and only external projections', () => {
  assert.equal(fixture.phases.length, 7)
  assert.deepEqual(fixture.disruptions, ['changes_requested', 'version_conflict', 'timeout', 'manual_fallback'])
  assert.ok(fixture.referenceMessages.every((entry) => !entry.recipientRole || fixture.externalRoles.includes(entry.recipientRole)))
  assert.ok(fixture.referenceMessages.every((entry) => !entry.senderRole || fixture.externalRoles.includes(entry.senderRole)))
})

test('all productive gates remain closed', () => {
  assert.equal(contract.nonProductionGates.syntheticOnly, undefined)
  for (const value of Object.values(contract.nonProductionGates)) assert.equal(value, false)
})

test('the local technical foundation is explicit and does not imply an external ACC connection', () => {
  assert.equal(contract.localTechnicalFoundation.backendConnected, true)
  assert.equal(contract.localTechnicalFoundation.databaseConnected, true)
  assert.equal(contract.localTechnicalFoundation.accContractEndpointAvailable, true)
  assert.equal(contract.localTechnicalFoundation.aiGatewayAvailable, true)
  assert.equal(contract.localTechnicalFoundation.externalAiProviderEnabled, false)
  assert.equal(contract.nonProductionGates.productiveAccIntegration, false)
  assert.equal(contract.nonProductionGates.productiveAiAllowed, false)
})
