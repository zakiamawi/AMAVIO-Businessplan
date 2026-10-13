import { arrivalContractVersion, freezeDeep } from './contracts.js'
import { isTransitionAllowed, validateCanonicalObject } from './graph.js'
import { arrivalPhases, goldenCaseMeta, goldenCaseSteps, initialArrivalObjects } from './goldenCase.js'

function clone(value) {
  if (Array.isArray(value)) return value.map(clone)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, clone(nested)]))
}

function objectMap() {
  return Object.fromEntries(initialArrivalObjects.map((entry) => [entry.id, clone(entry)]))
}

export function createInitialArrivalState() {
  return freezeDeep({
    schemaVersion: goldenCaseMeta.schemaVersion,
    contractVersion: arrivalContractVersion,
    caseId: goldenCaseMeta.id,
    revision: 1,
    cursor: 0,
    objects: objectMap(),
    events: [],
    completed: false,
  })
}

export function getCurrentStep(state) {
  return state.completed ? null : goldenCaseSteps[state.cursor] || null
}

export function getCurrentPhase(state) {
  const step = getCurrentStep(state)
  return arrivalPhases.find(({ id }) => id === step?.phaseId) || arrivalPhases[arrivalPhases.length - 1]
}

function enrichPayload(object, step) {
  const payload = clone(object.payload)
  if (object.objectType === 'ReviewDecision' && step.to === 'decided') {
    payload.outcome = 'approved'
    payload.nextResponsibility = 'operations'
  }
  if (object.objectType === 'HandoverSignal' && step.to === 'ready') {
    payload.readiness = 'ready'
    payload.nextResponsibility = 'professional'
  }
  if (['HousingNeedResponse', 'PartnerDemandResponse'].includes(object.objectType) && step.to === 'acknowledged') {
    payload.nextResponsibility = 'operations'
  }
  return payload
}

function eventForStep(step, sequence, details = {}) {
  return freezeDeep({
    id: `SYN-EVT-${String(sequence).padStart(3, '0')}`,
    commandId: step.id,
    objectType: 'WorkflowEvent',
    referencedObjectId: step.objectId,
    eventType: step.eventType || 'status_transition',
    phaseId: step.phaseId,
    actorId: step.actor,
    contractActorId: step.contractActor || step.actor,
    occurredAtUtc: step.at,
    result: step.result || 'accepted',
    visibility: [...step.visibility],
    title: clone(step.title),
    disruption: step.disruption,
    synthetic: true,
    ...details,
  })
}

function applyStep(state, step) {
  const nextState = clone(state)

  if (step.kind === 'transition') {
    const current = nextState.objects[step.objectId]
    if (!current) return { ok: false, reason: 'object_not_found', state }
    const validation = validateCanonicalObject(current)
    if (validation.length) return { ok: false, reason: 'invalid_object', errors: validation, state }
    if (!isTransitionAllowed({
      objectType: current.objectType,
      from: current.status,
      to: step.to,
      actorId: step.contractActor || step.actor,
      ownerRole: current.ownerRole,
    })) return { ok: false, reason: 'transition_not_allowed', state }

    const previousStatus = current.status
    const nextObject = {
      ...current,
      status: step.to,
      version: current.version + 1,
      payload: enrichPayload(current, step),
    }
    nextState.objects[step.objectId] = nextObject
    nextState.events.push(eventForStep(step, nextState.events.length + 1, {
      referencedObjectType: current.objectType,
      objectVersion: nextObject.version,
      from: previousStatus,
      to: step.to,
    }))
  } else {
    nextState.events.push(eventForStep(step, nextState.events.length + 1, {
      referencedObjectType: step.objectId ? nextState.objects[step.objectId]?.objectType || null : null,
      objectVersion: step.objectId ? nextState.objects[step.objectId]?.version || null : null,
      from: null,
      to: null,
    }))
  }

  nextState.cursor += 1
  nextState.revision += 1
  nextState.completed = nextState.cursor >= goldenCaseSteps.length
  return { ok: true, reason: null, state: freezeDeep(nextState) }
}

export function advanceArrivalState(state, actorId, commandId) {
  if (state.events.some((event) => event.commandId === commandId)) return { ok: false, reason: 'duplicate_command', state }
  const currentStep = getCurrentStep(state)
  if (!currentStep) return { ok: false, reason: 'case_completed', state }
  if (currentStep.id !== commandId) return { ok: false, reason: 'stale_command', state }
  if (currentStep.actor !== actorId) return { ok: false, reason: 'actor_not_allowed', state }

  let result = applyStep(state, currentStep)
  if (!result.ok) return result
  const executed = [currentStep.id]

  while (!result.state.completed && getCurrentStep(result.state)?.actor === 'workflow_core') {
    const automaticStep = getCurrentStep(result.state)
    result = applyStep(result.state, automaticStep)
    if (!result.ok) return result
    executed.push(automaticStep.id)
  }

  return { ok: true, reason: null, state: result.state, executed }
}

export function runGoldenCase() {
  let state = createInitialArrivalState()
  const commands = []
  while (!state.completed) {
    const step = getCurrentStep(state)
    if (!step || step.actor === 'workflow_core') throw new Error('Golden case stopped on an unowned automatic step')
    const result = advanceArrivalState(state, step.actor, step.id)
    if (!result.ok) throw new Error(`Golden case failed at ${step.id}: ${result.reason}`)
    commands.push(step.id)
    state = result.state
  }
  return freezeDeep({ state, commands })
}
