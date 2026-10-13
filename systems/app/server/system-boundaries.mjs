import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

function readContract(name) {
  return JSON.parse(readFileSync(new URL(`../contracts/${name}`, import.meta.url), 'utf8'))
}

const ownership = readContract('system-ownership-registry.v1.json')
const identity = readContract('identity-authority-boundaries.v1.json')
const records = readContract('data-system-of-record.v1.json')
const crmAccHandoff = readContract('crm-acc-handoff-profile.v1.json')

const definedBoundaries = new Map(
  ownership.definedBoundaries.map((boundary) => [`${boundary.source}:${boundary.target}:${boundary.purpose}`, boundary]),
)

export function evaluateCrossSystemRoute(input = {}) {
  const source = input.sourceSystem
  const target = input.targetSystem
  const purpose = input.purpose

  if (input.synthetic !== true) {
    return Object.freeze({ contractuallyDefined: false, transportAllowed: false, reason: 'real_data_gate_closed' })
  }
  if ((source === 'app' && target === 'crm') || (source === 'crm' && target === 'app')) {
    return Object.freeze({ contractuallyDefined: false, transportAllowed: false, reason: 'direct_app_crm_route_forbidden' })
  }

  const boundary = definedBoundaries.get(`${source}:${target}:${purpose}`)
  if (!boundary) {
    return Object.freeze({ contractuallyDefined: false, transportAllowed: false, reason: 'cross_system_purpose_not_defined' })
  }

  if (source === 'crm' && target === 'acc') {
    const forbidden = new Set(crmAccHandoff.forbiddenByDefault)
    const forbiddenFields = (input.payloadFields || []).filter((field) => forbidden.has(field))
    if (forbiddenFields.length) {
      return Object.freeze({
        contractuallyDefined: true,
        transportAllowed: false,
        reason: 'crm_acc_payload_contains_forbidden_fields',
        forbiddenFields,
      })
    }
  }

  return Object.freeze({
    contractuallyDefined: true,
    transportAllowed: false,
    reason: 'reference_contract_only_transport_gate_closed',
    boundaryStatus: boundary.status,
    productive: false,
    externalEffect: false,
  })
}

export function crossSystemContractSummary() {
  return Object.freeze({
    maturity: 'cross_system_contract_alignment_local_synthetic',
    products: ownership.products.map(({ id, name, roles }) => ({ id, name, roles })),
    separation: { ...ownership.mandatorySeparation },
    contractVersions: {
      ownership: ownership.contractVersion,
      identity: identity.contractVersion,
      systemOfRecord: records.contractVersion,
      crmAccHandoff: crmAccHandoff.contractVersion,
    },
    transports: {
      appAccConnected: false,
      crmAccConnected: false,
      appCrmAllowed: false,
    },
    realDataAllowed: records.runtimeBoundary.realDataAllowed,
  })
}

export const crossSystemContractPaths = Object.freeze({
  ownership: fileURLToPath(new URL('../contracts/system-ownership-registry.v1.json', import.meta.url)),
  identity: fileURLToPath(new URL('../contracts/identity-authority-boundaries.v1.json', import.meta.url)),
  systemOfRecord: fileURLToPath(new URL('../contracts/data-system-of-record.v1.json', import.meta.url)),
  crmAccHandoff: fileURLToPath(new URL('../contracts/crm-acc-handoff-profile.v1.json', import.meta.url)),
})
