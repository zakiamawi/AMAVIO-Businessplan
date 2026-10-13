import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { advanceArrivalState, createInitialArrivalState, getCurrentStep } from './engine.js'
import { getActorProjection } from './projections.js'
import { executeRemoteCommand, getRemoteProjection, getRuntimeHealth, requestAssistance } from '../runtime/api.js'

export const arrivalStorageKey = 'amavio_one.synthetic_arrival_case.v2'

let cachedState = null
const listeners = new Set()

function validStoredState(value) {
  return value && value.schemaVersion === 2 && value.caseId === 'SYN-ARRIVAL-0417' && Number.isInteger(value.cursor) && value.objects && Array.isArray(value.events)
}

function loadState() {
  if (cachedState) return cachedState
  if (typeof window === 'undefined') return createInitialArrivalState()
  try {
    const parsed = JSON.parse(window.localStorage.getItem(arrivalStorageKey) || 'null')
    cachedState = validStoredState(parsed) ? parsed : createInitialArrivalState()
  } catch {
    cachedState = createInitialArrivalState()
  }
  return cachedState
}

function emit() {
  for (const listener of listeners) listener()
}

function persist(state) {
  cachedState = state
  if (typeof window !== 'undefined') window.localStorage.setItem(arrivalStorageKey, JSON.stringify(state))
  emit()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== arrivalStorageKey) return
    cachedState = null
    loadState()
    emit()
  })
}

export function resetArrivalScenario() {
  const state = createInitialArrivalState()
  persist(state)
  return state
}

export function executeArrivalAction(actorId) {
  const state = loadState()
  const step = getCurrentStep(state)
  if (!step) return { ok: false, reason: 'case_completed', state }
  const result = advanceArrivalState(state, actorId, step.id)
  if (result.ok) persist(result.state)
  return result
}

export function useArrivalScenario(actorId, language) {
  const state = useSyncExternalStore(subscribe, loadState, createInitialArrivalState)
  const localProjection = useMemo(() => getActorProjection(state, actorId, language), [actorId, language, state])
  const [remoteProjection, setRemoteProjection] = useState(null)
  const [runtime, setRuntime] = useState({ status: 'checking', persistence: 'browser_fallback', acc: 'contract_only', ai: 'disabled' })
  const [assistance, setAssistance] = useState(null)
  const projection = remoteProjection || localProjection

  useEffect(() => {
    let active = true
    setRemoteProjection(null)
    setAssistance(null)
    Promise.all([getRuntimeHealth(), getRemoteProjection(actorId, language)])
      .then(([health, nextProjection]) => {
        if (!active) return
        setRemoteProjection(nextProjection)
        setRuntime({
          status: 'connected',
          persistence: health.persistence,
          acc: health.contracts?.interfaceContractVersion ? 'local_endpoint_ready' : 'contract_only',
          ai: health.ai?.provider || 'disabled',
        })
      })
      .catch(() => {
        if (!active) return
        setRuntime({ status: 'fallback', persistence: 'browser_fallback', acc: 'contract_only', ai: 'disabled' })
      })
    return () => { active = false }
  }, [actorId, language])

  const execute = useCallback(async () => {
    if (runtime.status !== 'connected' || !remoteProjection) return executeArrivalAction(actorId)
    try {
      const result = await executeRemoteCommand({ roleId: actorId, language, projection: remoteProjection })
      if (result.projection) setRemoteProjection(result.projection)
      return result
    } catch (error) {
      return { ok: false, reason: error.message || 'backend_unavailable' }
    }
  }, [actorId, language, remoteProjection, runtime.status])

  const explain = useCallback(async () => {
    if (runtime.status !== 'connected') return { ok: false, reason: 'backend_unavailable' }
    try {
      const result = await requestAssistance({ roleId: actorId, language, projection })
      setAssistance(result.response)
      return result
    } catch (error) {
      return { ok: false, reason: error.message || 'assistance_unavailable' }
    }
  }, [actorId, language, projection, runtime.status])

  const reset = useCallback(() => resetArrivalScenario(), [])
  return { state, projection, execute, reset, runtime, assistance, explain }
}
