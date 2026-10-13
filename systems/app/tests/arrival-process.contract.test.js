import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { arrivalScope, canonicalObjectIds } from '../src/arrival/contracts.js'
import { advanceArrivalState, createInitialArrivalState, getCurrentStep, runGoldenCase } from '../src/arrival/engine.js'
import { arrivalGraph } from '../src/arrival/graph.js'
import { arrivalPhases, goldenCaseSteps } from '../src/arrival/goldenCase.js'
import { getActorProjection, projectionContainsForbiddenKeys } from '../src/arrival/projections.js'

test('canonical graph preserves all approved V2.4 objects nodes and transitions', () => {
  assert.equal(canonicalObjectIds.length, 13)
  assert.equal(arrivalGraph.nodes.length, 49)
  assert.equal(arrivalGraph.edges.length, 46)
  assert.deepEqual([...arrivalGraph.statuslessObjectIds].sort(), ['RoleContext', 'WorkflowEvent'])
})

test('one golden case covers every arrival phase, three external roles and two boundary responsibilities', () => {
  assert.deepEqual([...new Set(goldenCaseSteps.map(({ phaseId }) => phaseId))], arrivalPhases.map(({ id }) => id))
  const actors = new Set(goldenCaseSteps.filter(({ actor }) => actor !== 'workflow_core').map(({ actor }) => actor))
  assert.deepEqual([...actors].sort(), ['employer', 'housing', 'operations', 'partner', 'professional'])
})

test('the full synthetic arrival process completes deterministically', () => {
  const first = runGoldenCase()
  const second = runGoldenCase()
  assert.deepEqual(first, second)
  assert.equal(first.state.completed, true)
  assert.equal(first.state.cursor, 44)
  assert.equal(first.state.events.length, 44)
  assert.equal(first.state.objects.syn_task_arrival.status, 'completed')
  assert.equal(first.state.objects.syn_support_workstart.status, 'closed')
  assert.equal(first.state.objects.syn_housing_capacity.status, 'archived')
  assert.equal(first.state.objects.syn_housing_need.status, 'closed')
  assert.equal(first.state.objects.syn_housing_response.status, 'acknowledged')
  assert.equal(first.state.objects.syn_handover.status, 'ready')
  assert.equal(first.state.objects.syn_partner_offer.status, 'archived')
  assert.equal(first.state.objects.syn_partner_demand.status, 'expired')
  assert.equal(first.state.objects.syn_partner_response.status, 'acknowledged')
  assert.equal(first.state.objects.syn_role_message.status, 'read')
  assert.equal(first.state.objects.syn_review_cost.status, 'decided')
})

test('realistic disruptions are visible without false success', () => {
  const { state } = runGoldenCase()
  const disruptions = state.events.filter(({ disruption }) => disruption).map(({ disruption }) => disruption)
  assert.deepEqual(disruptions, ['changes_requested', 'version_conflict', 'timeout', 'manual_fallback'])
  const conflict = state.events.find(({ disruption }) => disruption === 'version_conflict')
  assert.equal(conflict.result, 'rejected')
  assert.equal(conflict.from, null)
  assert.equal(conflict.to, null)
  assert.equal(state.objects.syn_handover.status, 'ready')
})

test('wrong actor stale command and duplicate command never mutate state', () => {
  const initial = createInitialArrivalState()
  const wrongActor = advanceArrivalState(initial, 'professional', 'CMD-001')
  assert.equal(wrongActor.ok, false)
  assert.equal(wrongActor.reason, 'actor_not_allowed')
  assert.deepEqual(wrongActor.state, initial)

  const stale = advanceArrivalState(initial, 'employer', 'CMD-002')
  assert.equal(stale.ok, false)
  assert.equal(stale.reason, 'stale_command')
  assert.deepEqual(stale.state, initial)

  const accepted = advanceArrivalState(initial, 'employer', 'CMD-001')
  assert.equal(accepted.ok, true)
  assert.equal(getCurrentStep(accepted.state).actor, 'professional')
  const duplicate = advanceArrivalState(accepted.state, 'employer', 'CMD-001')
  assert.equal(duplicate.ok, false)
  assert.equal(duplicate.reason, 'duplicate_command')
  assert.deepEqual(duplicate.state, accepted.state)
})

test('role projections expose only the three external App roles', () => {
  const { state } = runGoldenCase()
  const professional = getActorProjection(state, 'professional')
  const housing = getActorProjection(state, 'housing')
  const partner = getActorProjection(state, 'partner')

  assert.deepEqual([...new Set(professional.objects.map(({ objectType }) => objectType))].sort(), ['ProfessionalTask', 'RoleContext', 'RoleMessage', 'SupportRequest'])
  assert.deepEqual([...new Set(housing.objects.map(({ objectType }) => objectType))].sort(), ['HandoverSignal', 'HousingCapacity', 'HousingNeed', 'HousingNeedResponse', 'RoleContext'])
  assert.deepEqual([...new Set(partner.objects.map(({ objectType }) => objectType))].sort(), ['PartnerDemand', 'PartnerDemandResponse', 'PartnerOffer', 'RoleContext'])
  for (const projection of [professional, housing, partner]) {
    assert.deepEqual(projectionContainsForbiddenKeys(projection), [])
  }
})

test('events are immutable and visibility-scoped', () => {
  const { state } = runGoldenCase()
  assert.equal(Object.isFrozen(state), true)
  assert.equal(Object.isFrozen(state.events), true)
  assert.equal(Object.isFrozen(state.events[0]), true)
  const professional = getActorProjection(state, 'professional')
  assert.equal(professional.events.every(({ visibility }) => visibility.includes('professional')), true)
  assert.equal(professional.events.some(({ referencedObjectType }) => referencedObjectType === 'HousingCapacity'), false)
})

test('R2 local technical foundation is active while productive gates remain closed', () => {
  assert.equal(arrivalScope.maturity, 'local_synthetic_executable_process')
  assert.equal(arrivalScope.boundaries.syntheticOnly, true)
  assert.equal(arrivalScope.boundaries.backendConnected, true)
  assert.equal(arrivalScope.boundaries.databaseConnected, true)
  assert.equal(arrivalScope.boundaries.backendScopeLocalSynthetic, true)
  assert.equal(arrivalScope.boundaries.technicalAccEndpointAvailable, true)
  assert.equal(arrivalScope.boundaries.localAiGatewayAvailable, true)
  for (const key of [
    'productiveAuthentication', 'productiveArrivalGraph', 'productiveAccIntegration', 'realDataAllowed',
    'realRoleTestsAllowed', 'productiveAiAllowed', 'externalAiProviderEnabled', 'matchingAllowed',
    'scoringAllowed', 'automatedDecisionAllowed', 'deploymentAllowed', 'publicationAllowed',
  ]) assert.equal(arrivalScope.boundaries[key], false, key)
})

test('the App consumes the Arrival process panel without role switching or ACC imports', () => {
  const external = readFileSync(new URL('../src/components/ExternalApp.jsx', import.meta.url), 'utf8')
  const panel = readFileSync(new URL('../src/components/ArrivalProcessPanel.jsx', import.meta.url), 'utf8')
  assert.match(external, /<ArrivalProcessPanel actorId=\{role\}/)
  assert.match(panel, /useArrivalScenario\(actorId, language\)/)
  assert.doesNotMatch(panel, /setRole|role-switch|selectRole/i)
  assert.doesNotMatch(external, /AccApp|AccCaseWorkspace|accRoutes/)
})
