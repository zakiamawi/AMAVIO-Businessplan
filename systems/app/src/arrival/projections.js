import { actorLabels, forbiddenProjectionKeys, payloadProjectionFields, roleVisibility } from './contracts.js'
import { getCurrentPhase, getCurrentStep } from './engine.js'
import { arrivalPhases, goldenCaseMeta, goldenCaseSteps } from './goldenCase.js'

function localized(value, language) {
  return value?.[language] || value?.de || value?.en || String(value || '')
}

function projectPayload(object) {
  const allowed = payloadProjectionFields[object.objectType] || []
  return Object.fromEntries(allowed.filter((key) => Object.hasOwn(object.payload || {}, key)).map((key) => [key, object.payload[key]]))
}

function projectObject(object) {
  return {
    id: object.id,
    objectType: object.objectType,
    label: object.label,
    status: object.status,
    version: object.version,
    payload: projectPayload(object),
  }
}

export function getActorProjection(state, actorId, language = 'de') {
  const visibleTypes = new Set(roleVisibility[actorId] || [])
  const objects = Object.values(state.objects)
    .filter((object) => visibleTypes.has(object.objectType))
    .filter((object) => !object.ownerRole || object.ownerRole === actorId)
    .map(projectObject)
  const events = state.events.filter((event) => event.visibility.includes(actorId)).slice(-6)
  const currentStep = getCurrentStep(state)
  const phase = getCurrentPhase(state)
  const completedSteps = state.cursor
  const progress = Math.round((completedSteps / goldenCaseSteps.length) * 100)
  const incidents = state.events.filter((event) => event.disruption && event.visibility.includes(actorId))
  const latestIncident = incidents[incidents.length - 1] || null

  return {
    caseId: goldenCaseMeta.id,
    title: localized(goldenCaseMeta.title, language),
    context: localized(goldenCaseMeta.context, language),
    actorId,
    actorLabel: localized(actorLabels[actorId], language),
    phaseId: phase.id,
    phaseLabel: localized(phase.label, language),
    progress,
    completedSteps,
    totalSteps: goldenCaseSteps.length,
    completed: state.completed,
    next: currentStep ? {
      id: currentStep.id,
      actorId: currentStep.actor,
      actorLabel: localized(actorLabels[currentStep.actor], language),
      title: localized(currentStep.title, language),
      action: localized(currentStep.action, language),
      canAct: currentStep.actor === actorId,
    } : null,
    phases: arrivalPhases.map((entry) => {
      const phaseSteps = goldenCaseSteps.filter((step) => step.phaseId === entry.id)
      const phaseStart = goldenCaseSteps.indexOf(phaseSteps[0])
      const phaseEnd = phaseStart + phaseSteps.length
      return {
        id: entry.id,
        label: localized(entry.label, language),
        status: state.cursor >= phaseEnd ? 'complete' : state.cursor >= phaseStart ? 'current' : 'upcoming',
      }
    }),
    objects,
    events: events.map((event) => ({ ...event, displayTitle: localized(event.title, language) })),
    latestIncident: latestIncident ? { ...latestIncident, displayTitle: localized(latestIncident.title, language) } : null,
  }
}

export function projectionContainsForbiddenKeys(projection) {
  const corpus = JSON.stringify(projection)
  return forbiddenProjectionKeys.filter((key) => new RegExp(`\\"${key}\\"`, 'i').test(corpus))
}
