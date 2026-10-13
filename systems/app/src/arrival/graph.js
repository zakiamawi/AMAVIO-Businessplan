import { canonicalObjectContracts, canonicalObjectIds, freezeDeep, statusContracts } from './contracts.js'

const nodes = []
const edges = []

for (const [statusContractId, contract] of Object.entries(statusContracts)) {
  for (const objectType of contract.objectIds) {
    for (const state of contract.states) nodes.push({ id: `${objectType}:${state}`, objectType, state, statusContractId })
    for (const [from, to, actor] of contract.transitions) edges.push({
      id: `${objectType}:${from}->${to}:${actor}`,
      objectType,
      from,
      to,
      actor,
      statusContractId,
    })
  }
}

export const arrivalGraph = freezeDeep({
  graphVersion: '2.4.0-arrival-process.1',
  maturity: 'local_synthetic_executable_graph',
  nodes,
  edges,
  statuslessObjectIds: canonicalObjectContracts.filter(({ statusContract }) => statusContract === null).map(({ id }) => id),
})

export function getStatusContractForObject(objectType) {
  return Object.values(statusContracts).find(({ objectIds }) => objectIds.includes(objectType)) || null
}

export function isTransitionAllowed({ objectType, from, to, actorId, ownerRole = null }) {
  const contract = getStatusContractForObject(objectType)
  if (!contract) return false
  return contract.transitions.some(([allowedFrom, allowedTo, expectedActor]) => {
    if (allowedFrom !== from || allowedTo !== to) return false
    if (expectedActor === 'external_owner' || expectedActor === 'external_recipient') return actorId === ownerRole
    return actorId === expectedActor
  })
}

export function validateCanonicalObject(object) {
  const errors = []
  if (!object || typeof object !== 'object') return ['object_missing']
  if (!String(object.id || '').startsWith('syn_')) errors.push('object_id_not_synthetic')
  if (!canonicalObjectIds.includes(object.objectType)) errors.push('unknown_object_type')
  if (!Number.isInteger(object.version) || object.version < 1) errors.push('invalid_version')
  if (object.synthetic !== true) errors.push('object_not_synthetic')
  const contract = getStatusContractForObject(object.objectType)
  if (contract && !contract.states.includes(object.status)) errors.push('invalid_status')
  if (!contract && object.status !== null) errors.push('unexpected_status')
  return errors
}
