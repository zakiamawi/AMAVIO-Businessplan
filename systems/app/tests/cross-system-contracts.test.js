import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  crossSystemContractPaths,
  crossSystemContractSummary,
  evaluateCrossSystemRoute,
} from '../server/system-boundaries.mjs'

function read(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('App ACC and CRM remain autonomous products with disjoint role authorities', () => {
  const ownership = read(crossSystemContractPaths.ownership)
  assert.deepEqual(ownership.products.map(({ id }) => id), ['app', 'acc', 'crm'])
  assert.equal(ownership.mandatorySeparation.separateCodebases, true)
  assert.equal(ownership.mandatorySeparation.separateDatastores, true)
  assert.equal(ownership.mandatorySeparation.sharedDatabaseAllowed, false)
  assert.equal(ownership.mandatorySeparation.directAppCrmRouteAllowed, false)
  const allRoles = ownership.products.flatMap(({ roles }) => roles)
  assert.equal(new Set(allRoles).size, allRoles.length)
})

test('identity sessions and roles are not federated across products', () => {
  const identity = read(crossSystemContractPaths.identity)
  assert.equal(identity.crossSystemRules.sharedIdentityProviderApproved, false)
  assert.equal(identity.crossSystemRules.sessionFederationApproved, false)
  assert.equal(identity.crossSystemRules.roleReuseAcrossProductsAllowed, false)
  assert.equal(identity.crossSystemRules.appRoleMayAuthenticateToCrm, false)
  assert.equal(identity.crossSystemRules.employerOrOperationsMayAuthenticateToApp, false)
})

test('each governed object has exactly one leading system', () => {
  const contract = read(crossSystemContractPaths.systemOfRecord)
  const allowedSystems = new Set(['app', 'acc', 'crm'])
  assert.ok(contract.objects.length >= 15)
  assert.ok(contract.objects.every(({ leadingSystem }) => allowedSystems.has(leadingSystem)))
  assert.equal(new Set(contract.objects.map(({ objectType }) => objectType)).size, contract.objects.length)
  assert.equal(contract.runtimeBoundary.realDataAllowed, false)
  assert.equal(contract.runtimeBoundary.crossSystemTransportConnected, false)
})

test('direct App CRM routes are denied without fallback', () => {
  const appToCrm = evaluateCrossSystemRoute({
    sourceSystem: 'app', targetSystem: 'crm', purpose: 'sync_contact', synthetic: true,
  })
  const crmToApp = evaluateCrossSystemRoute({
    sourceSystem: 'crm', targetSystem: 'app', purpose: 'create_account', synthetic: true,
  })
  assert.equal(appToCrm.reason, 'direct_app_crm_route_forbidden')
  assert.equal(crmToApp.reason, 'direct_app_crm_route_forbidden')
  assert.equal(appToCrm.transportAllowed, false)
  assert.equal(crmToApp.transportAllowed, false)
})

test('App ACC purposes are defined but the transport gate remains closed', () => {
  const outbound = evaluateCrossSystemRoute({
    sourceSystem: 'app', targetSystem: 'acc', purpose: 'external_submission_for_human_review', synthetic: true,
  })
  const inbound = evaluateCrossSystemRoute({
    sourceSystem: 'acc', targetSystem: 'app', purpose: 'role_minimised_status_and_next_step_projection', synthetic: true,
  })
  assert.equal(outbound.contractuallyDefined, true)
  assert.equal(inbound.contractuallyDefined, true)
  assert.equal(outbound.transportAllowed, false)
  assert.equal(inbound.transportAllowed, false)
  assert.equal(outbound.externalEffect, false)
})

test('CRM ACC handoff stays payload-free and cannot create an Arrival Case', () => {
  const handoff = read(crossSystemContractPaths.crmAccHandoff)
  assert.equal(handoff.trigger.automaticTriggerAllowed, false)
  assert.equal(handoff.currentRuntime.localReviewMarkersOnly, true)
  assert.equal(handoff.currentRuntime.transportConnected, false)
  assert.ok(handoff.forbiddenByDefault.includes('automaticArrivalCaseCreation'))

  const marker = evaluateCrossSystemRoute({
    sourceSystem: 'crm', targetSystem: 'acc', purpose: 'commercial_handoff_review_marker', synthetic: true, payloadFields: [],
  })
  assert.equal(marker.contractuallyDefined, true)
  assert.equal(marker.transportAllowed, false)

  const forbidden = evaluateCrossSystemRoute({
    sourceSystem: 'crm', targetSystem: 'acc', purpose: 'commercial_handoff_review_marker', synthetic: true,
    payloadFields: ['contactPersonalData'],
  })
  assert.equal(forbidden.reason, 'crm_acc_payload_contains_forbidden_fields')
  assert.deepEqual(forbidden.forbiddenFields, ['contactPersonalData'])
})

test('cross-system summary exposes no productive connection or real-data authority', () => {
  const summary = crossSystemContractSummary()
  assert.equal(summary.products.length, 3)
  assert.equal(summary.transports.appAccConnected, false)
  assert.equal(summary.transports.crmAccConnected, false)
  assert.equal(summary.transports.appCrmAllowed, false)
  assert.equal(summary.realDataAllowed, false)
})
