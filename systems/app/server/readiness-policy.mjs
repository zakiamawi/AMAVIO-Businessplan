import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

function readContract(name) {
  return JSON.parse(readFileSync(new URL(`../contracts/${name}`, import.meta.url), 'utf8'))
}

const identityContract = readContract('identity-tenant-rights.v1.json')
const dataContract = readContract('data-governance.v1.json')
const aiContract = readContract('ai-human-oversight.v1.json')
const compatibilityContract = readContract('app-acc-compatibility-profile.v1.json')
const gatesContract = readContract('production-readiness-gates.v1.json')
const ownershipContract = readContract('system-ownership-registry.v1.json')
const identityAuthorityContract = readContract('identity-authority-boundaries.v1.json')
const systemOfRecordContract = readContract('data-system-of-record.v1.json')
const crmAccHandoffContract = readContract('crm-acc-handoff-profile.v1.json')

const rolePolicies = new Map(identityContract.appRoles.map((role) => [role.id, role]))
const allowedAiPurposes = new Set(aiContract.allowedPurposes)
const prohibitedAiDataClasses = new Set(aiContract.prohibitedDataClasses)

function decision(allowed, reason, details = {}) {
  return Object.freeze({ allowed, reason, ...details })
}

export function evaluateReferenceAuthorization(input = {}) {
  if (input.contextKind !== 'local_synthetic') return decision(false, 'productive_identity_gate_closed')
  if (input.synthetic !== true) return decision(false, 'real_data_gate_closed')
  const policy = rolePolicies.get(input.roleId)
  if (!policy) return decision(false, 'role_not_allowed_in_app')
  if (!policy.allowedActions.includes(input.action)) return decision(false, 'action_not_allowed_for_role')
  if (!input.sessionTenantId || input.sessionTenantId !== input.resourceTenantId) return decision(false, 'cross_tenant_access_denied')
  if (input.subjectRoleId && input.subjectRoleId !== input.roleId) return decision(false, 'cross_role_projection_denied')
  if (input.selfApproval === true) return decision(false, 'self_approval_denied')
  return decision(true, 'local_synthetic_reference_policy_allows', {
    policyVersion: identityContract.contractVersion,
    productiveAuthorization: false,
  })
}

export function evaluateAiOperation(input = {}) {
  if (input.synthetic !== true) return decision(false, 'real_data_not_allowed')
  if (!rolePolicies.has(input.roleId)) return decision(false, 'external_role_required')
  if (!allowedAiPurposes.has(input.purpose)) return decision(false, 'purpose_not_allowed')
  if ((input.autonomy || 'assistive_only') !== 'assistive_only') return decision(false, 'assistive_only')
  if ((input.provider || 'local_policy_assistant') !== 'local_policy_assistant') return decision(false, 'external_ai_provider_disabled_by_release_gate')
  const forbiddenClass = (input.dataClasses || []).find((value) => prohibitedAiDataClasses.has(value))
  if (forbiddenClass) return decision(false, 'ai_data_class_not_allowed', { dataClass: forbiddenClass })
  if (input.caseMutation === true || input.decisionEffect === true) return decision(false, 'decision_or_mutation_effect_denied')
  return decision(true, 'local_assistive_policy_allows', {
    policyVersion: aiContract.contractVersion,
    decisionEffect: false,
    caseMutation: false,
  })
}

export function evaluateAccPeerProfile(profile = {}) {
  const required = compatibilityContract.requiredPeerProfile
  const missingCapabilities = required.requiredCapabilities.filter((capability) => !profile.capabilities?.includes(capability))
  const reasons = []
  if (profile.interfaceContractVersion !== required.interfaceContractVersion) reasons.push('interface_contract_version_mismatch')
  if (profile.syntheticOnly !== true) reasons.push('synthetic_boundary_not_proven')
  if (profile.externalEffects !== false) reasons.push('external_effect_boundary_not_proven')
  if (missingCapabilities.length) reasons.push('required_capabilities_missing')
  return Object.freeze({
    compatible: reasons.length === 0,
    status: reasons.length === 0 ? 'CONTRACT_COMPATIBLE_SYNTHETIC' : 'NOT_COMPATIBLE_YET',
    reasons,
    missingCapabilities,
    requiredInterfaceContractVersion: required.interfaceContractVersion,
    observedInterfaceContractVersion: profile.interfaceContractVersion || null,
  })
}

export function productionReadinessSummary() {
  const gates = gatesContract.gates.map((gate) => ({ ...gate }))
  return Object.freeze({
    maturity: 'cross_system_contract_alignment_local_synthetic',
    productiveReleaseAllowed: false,
    currentAllowedMode: gatesContract.currentAllowedMode,
    contracts: {
      identity: identityContract.contractVersion,
      data: dataContract.contractVersion,
      ai: aiContract.contractVersion,
      appAccCompatibility: compatibilityContract.contractVersion,
      systemOwnership: ownershipContract.contractVersion,
      identityAuthority: identityAuthorityContract.contractVersion,
      systemOfRecord: systemOfRecordContract.contractVersion,
      crmAccHandoff: crmAccHandoffContract.contractVersion,
      gates: gatesContract.contractVersion,
    },
    closedGates: gates.filter((gate) => gate.status === 'CLOSED').map((gate) => gate.id),
  })
}

export const contractPaths = Object.freeze({
  identity: fileURLToPath(new URL('../contracts/identity-tenant-rights.v1.json', import.meta.url)),
  data: fileURLToPath(new URL('../contracts/data-governance.v1.json', import.meta.url)),
  ai: fileURLToPath(new URL('../contracts/ai-human-oversight.v1.json', import.meta.url)),
  appAccCompatibility: fileURLToPath(new URL('../contracts/app-acc-compatibility-profile.v1.json', import.meta.url)),
  systemOwnership: fileURLToPath(new URL('../contracts/system-ownership-registry.v1.json', import.meta.url)),
  identityAuthority: fileURLToPath(new URL('../contracts/identity-authority-boundaries.v1.json', import.meta.url)),
  systemOfRecord: fileURLToPath(new URL('../contracts/data-system-of-record.v1.json', import.meta.url)),
  crmAccHandoff: fileURLToPath(new URL('../contracts/crm-acc-handoff-profile.v1.json', import.meta.url)),
  gates: fileURLToPath(new URL('../contracts/production-readiness-gates.v1.json', import.meta.url)),
})
