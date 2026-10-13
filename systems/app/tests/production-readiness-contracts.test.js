import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  contractPaths,
  evaluateAccPeerProfile,
  evaluateAiOperation,
  evaluateReferenceAuthorization,
  productionReadinessSummary,
} from '../server/readiness-policy.mjs'

function read(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('identity contract permits only the three external App roles', () => {
  const contract = read(contractPaths.identity)
  assert.deepEqual(contract.appRoles.map(({ id }) => id), ['professional', 'housing', 'partner'])
  assert.deepEqual(contract.boundaryOnlyRoles.map(({ id }) => id), ['employer', 'operations'])
  assert.ok(contract.boundaryOnlyRoles.every(({ appSessionAllowed }) => appSessionAllowed === false))
  assert.equal(contract.authentication.implemented, false)
})

test('reference authorization denies cross-tenant cross-role and boundary-role access', () => {
  const base = {
    contextKind: 'local_synthetic', synthetic: true, roleId: 'housing',
    action: 'housing_capacity.command.own', sessionTenantId: 'TENANT-H-1', resourceTenantId: 'TENANT-H-1', subjectRoleId: 'housing',
  }
  assert.equal(evaluateReferenceAuthorization(base).allowed, true)
  assert.equal(evaluateReferenceAuthorization({ ...base, resourceTenantId: 'TENANT-H-2' }).reason, 'cross_tenant_access_denied')
  assert.equal(evaluateReferenceAuthorization({ ...base, subjectRoleId: 'partner' }).reason, 'cross_role_projection_denied')
  assert.equal(evaluateReferenceAuthorization({ ...base, roleId: 'operations' }).reason, 'role_not_allowed_in_app')
  assert.equal(evaluateReferenceAuthorization({ ...base, contextKind: 'productive' }).reason, 'productive_identity_gate_closed')
})

test('data contract defaults to deny and allows only synthetic demo data now', () => {
  const contract = read(contractPaths.data)
  assert.equal(contract.defaultPolicy, 'deny_unclassified_data')
  assert.deepEqual(contract.currentRuntime.allowedDataClasses, ['synthetic_demo'])
  assert.equal(contract.currentRuntime.realDataAllowed, false)
  assert.equal(contract.currentRuntime.externalTransferAllowed, false)
  assert.ok(contract.dataClasses.filter(({ currentUseAllowed }) => currentUseAllowed).every(({ id }) => id === 'synthetic_demo'))
})

test('AI contract remains assistive provider-neutral and without decision effect', () => {
  const contract = read(contractPaths.ai)
  assert.equal(contract.providerDecision.approvedProvider, null)
  assert.equal(contract.providerDecision.externalProviderEnabled, false)
  assert.equal(contract.allowedAutonomy, 'assistive_only')
  assert.ok(contract.prohibitedPurposes.includes('matching'))
  assert.ok(contract.prohibitedPurposes.includes('scoring'))

  assert.equal(evaluateAiOperation({ synthetic: true, roleId: 'professional', purpose: 'explain_next_step' }).allowed, true)
  assert.equal(evaluateAiOperation({ synthetic: true, roleId: 'professional', purpose: 'matching' }).reason, 'purpose_not_allowed')
  assert.equal(evaluateAiOperation({ synthetic: true, roleId: 'professional', purpose: 'explain_next_step', provider: 'external' }).reason, 'external_ai_provider_disabled_by_release_gate')
  assert.equal(evaluateAiOperation({ synthetic: true, roleId: 'professional', purpose: 'explain_next_step', dataClasses: ['identity_contact'] }).reason, 'ai_data_class_not_allowed')
})

test('ACC peer must implement the complete shared interface profile', () => {
  const incomplete = evaluateAccPeerProfile({
    interfaceContractVersion: null,
    syntheticOnly: true,
    externalEffects: false,
    capabilities: ['idempotency_key', 'audit_trace'],
  })
  assert.equal(incomplete.compatible, false)
  assert.equal(incomplete.status, 'NOT_COMPATIBLE_YET')
  assert.ok(incomplete.reasons.includes('interface_contract_version_mismatch'))
  assert.ok(incomplete.missingCapabilities.includes('app_to_acc_consumer'))

  const profile = read(contractPaths.appAccCompatibility).requiredPeerProfile
  const complete = evaluateAccPeerProfile({
    interfaceContractVersion: profile.interfaceContractVersion,
    syntheticOnly: true,
    externalEffects: false,
    capabilities: profile.requiredCapabilities,
  })
  assert.equal(complete.compatible, true)
})

test('all productive readiness gates remain closed', () => {
  const summary = productionReadinessSummary()
  assert.equal(summary.productiveReleaseAllowed, false)
  assert.equal(summary.currentAllowedMode, 'local_synthetic_foundation')
  assert.equal(summary.closedGates.length, 9)
})
