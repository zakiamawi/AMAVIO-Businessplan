import { randomUUID } from 'node:crypto'
import { actorLabels, arrivalContractVersion, forbiddenProjectionKeys } from '../src/arrival/contracts.js'
import { advanceArrivalState, getCurrentStep } from '../src/arrival/engine.js'
import { getActorProjection } from '../src/arrival/projections.js'
import { readCaseState, recordAudit, utcNow, writeCaseState } from './database.mjs'

export const interfaceContractVersion = '1.1.0-local-r2-foundation'
export const externalRoleIds = Object.freeze(['professional', 'housing', 'partner'])
export const boundaryActorIds = Object.freeze(['employer', 'operations'])

function jsonContainsForbiddenKey(value) {
  const corpus = JSON.stringify(value)
  return forbiddenProjectionKeys.find((key) => new RegExp(`\\"${key}\\"`, 'i').test(corpus)) || null
}

function commandReplay(database, idempotencyKey) {
  const row = database.prepare('SELECT response_json FROM commands WHERE idempotency_key = ?').get(idempotencyKey)
  if (!row) return null
  return { ...JSON.parse(row.response_json), replayed: true }
}

function recordCommand(database, input, response) {
  database.prepare(`
    INSERT INTO commands (
      case_id, command_id, idempotency_key, actor_id, expected_revision, result, reason, response_json, created_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.caseId,
    input.commandId,
    input.idempotencyKey,
    input.actorId,
    input.expectedRevision ?? null,
    response.ok ? 'accepted' : 'rejected',
    response.reason || null,
    JSON.stringify(response),
    utcNow(),
  )
}

function eventEnvelope(state, event) {
  const object = state.objects[event.referencedObjectId]
  const messageType = ['SupportRequest', 'RoleMessage'].includes(object?.objectType) ? 'structured_question' : 'external_submission'
  return {
    messageId: `MSG-${randomUUID()}`,
    contractVersion: interfaceContractVersion,
    correlationId: state.caseId,
    idempotencyKey: `event:${event.id}`,
    messageType,
    objectId: object?.id || event.referencedObjectId,
    objectType: object?.objectType || event.referencedObjectType,
    objectVersion: object?.version || event.objectVersion,
    actorRole: event.actorId,
    purpose: 'arrival_case_progression',
    occurredAtUtc: event.occurredAtUtc,
    synthetic: true,
    payload: object?.payload || {},
  }
}

function persistNewEvents(database, previousState, nextState) {
  const created = nextState.events.slice(previousState.events.length)
  const insertEvent = database.prepare(`
    INSERT OR IGNORE INTO workflow_events (id, case_id, sequence, visibility_json, event_json, occurred_at_utc)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  const insertMessage = database.prepare(`
    INSERT OR IGNORE INTO integration_messages (
      id, case_id, direction, message_type, contract_version, correlation_id, idempotency_key, status, envelope_json, created_at_utc
    ) VALUES (?, ?, 'app_to_acc', ?, ?, ?, ?, 'pending', ?, ?)
  `)

  for (const event of created) {
    insertEvent.run(event.id, nextState.caseId, Number(event.id.split('-').at(-1)), JSON.stringify(event.visibility), JSON.stringify(event), event.occurredAtUtc)
    if (externalRoleIds.includes(event.actorId) && event.result !== 'rejected') {
      const envelope = eventEnvelope(nextState, event)
      insertMessage.run(
        envelope.messageId,
        nextState.caseId,
        envelope.messageType,
        envelope.contractVersion,
        envelope.correlationId,
        envelope.idempotencyKey,
        JSON.stringify(envelope),
        utcNow(),
      )
    }
  }
  return created
}

export function getCaseProjection(database, { caseId = 'SYN-ARRIVAL-0417', actorId, language = 'de' }) {
  if (!externalRoleIds.includes(actorId)) throw new Error('external_role_required')
  const state = readCaseState(database, caseId)
  if (!state) throw new Error('case_not_found')
  return {
    ...getActorProjection(state, actorId, language),
    revision: state.revision,
    contractVersion: state.contractVersion,
    persistence: 'sqlite_local_synthetic',
  }
}

export function executeCaseCommand(database, input) {
  const required = ['caseId', 'commandId', 'idempotencyKey', 'actorId']
  const missing = required.find((key) => !input[key])
  if (missing) return { ok: false, reason: `missing_${missing}` }
  if (!Number.isInteger(input.expectedRevision)) return { ok: false, reason: 'missing_expectedRevision' }
  const replay = commandReplay(database, input.idempotencyKey)
  if (replay) return replay

  const state = readCaseState(database, input.caseId)
  if (!state) return { ok: false, reason: 'case_not_found' }
  if (input.expectedRevision !== undefined && input.expectedRevision !== state.revision) {
    const response = { ok: false, reason: 'revision_conflict', revision: state.revision }
    recordCommand(database, input, response)
    return response
  }

  const result = advanceArrivalState(state, input.actorId, input.commandId)
  const response = result.ok
    ? { ok: true, reason: null, revision: result.state.revision, executed: result.executed }
    : { ok: false, reason: result.reason, revision: state.revision }

  database.exec('BEGIN IMMEDIATE')
  try {
    if (result.ok) {
      writeCaseState(database, result.state)
      const events = persistNewEvents(database, state, result.state)
      response.eventsCreated = events.length
    }
    recordCommand(database, input, response)
    recordAudit(database, 'case_command', 'arrival_case', input.caseId, {
      actorId: input.actorId,
      commandId: input.commandId,
      result: response.ok ? 'accepted' : 'rejected',
      reason: response.reason,
    })
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
  return response
}

export function executeExternalRoleCommand(database, input) {
  if (!externalRoleIds.includes(input.actorId)) return { ok: false, reason: 'external_role_required' }
  const response = executeCaseCommand(database, input)
  return {
    ...response,
    projection: getCaseProjection(database, { caseId: input.caseId, actorId: input.actorId, language: input.language }),
  }
}

export function receiveAccMessage(database, envelope) {
  const forbidden = jsonContainsForbiddenKey(envelope)
  if (forbidden) return { ok: false, reason: `forbidden_field_${forbidden}` }
  if (envelope.synthetic !== true) return { ok: false, reason: 'real_data_not_allowed' }
  if (envelope.contractVersion !== interfaceContractVersion) return { ok: false, reason: 'contract_version_mismatch' }
  if (!boundaryActorIds.includes(envelope.senderRole)) return { ok: false, reason: 'boundary_actor_required' }
  const required = ['messageId', 'correlationId', 'idempotencyKey', 'messageType', 'commandId', 'senderRole']
  const missing = required.find((key) => !envelope[key])
  if (missing) return { ok: false, reason: `missing_${missing}` }
  if (!Number.isInteger(envelope.expectedRevision)) return { ok: false, reason: 'missing_expectedRevision' }

  const existing = database.prepare('SELECT status, envelope_json FROM integration_messages WHERE idempotency_key = ?').get(envelope.idempotencyKey)
  if (existing) return { ok: existing.status === 'processed', reason: null, replayed: true, status: existing.status }

  const state = readCaseState(database, envelope.correlationId)
  const step = state ? getCurrentStep(state) : null
  if (!state) return { ok: false, reason: 'case_not_found' }
  if (!step || step.id !== envelope.commandId || step.actor !== envelope.senderRole) return { ok: false, reason: 'message_not_applicable' }

  const result = executeCaseCommand(database, {
    caseId: envelope.correlationId,
    commandId: envelope.commandId,
    actorId: envelope.senderRole,
    expectedRevision: envelope.expectedRevision,
    idempotencyKey: `acc-command:${envelope.idempotencyKey}`,
  })
  database.prepare(`
    INSERT INTO integration_messages (
      id, case_id, direction, message_type, contract_version, correlation_id, idempotency_key, status, envelope_json, created_at_utc, processed_at_utc
    ) VALUES (?, ?, 'acc_to_app', ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    envelope.messageId,
    envelope.correlationId,
    envelope.messageType,
    envelope.contractVersion,
    envelope.correlationId,
    envelope.idempotencyKey,
    result.ok ? 'processed' : 'rejected',
    JSON.stringify(envelope),
    utcNow(),
    utcNow(),
  )
  recordAudit(database, 'acc_message_received', 'integration_message', envelope.messageId, {
    caseId: envelope.correlationId,
    senderRole: envelope.senderRole,
    commandId: envelope.commandId,
    result: result.ok ? 'processed' : 'rejected',
  })
  return { ...result, integrationStatus: result.ok ? 'processed' : 'rejected' }
}

export function listAccOutbox(database, caseId = 'SYN-ARRIVAL-0417') {
  return database.prepare(`
    SELECT envelope_json FROM integration_messages
    WHERE case_id = ? AND direction = 'app_to_acc'
    ORDER BY created_at_utc ASC
  `).all(caseId).map((row) => JSON.parse(row.envelope_json))
}

export function runtimeContractSummary() {
  return {
    arrivalContractVersion,
    interfaceContractVersion,
    externalRoles: externalRoleIds.map((id) => ({ id, label: actorLabels[id] })),
    boundaryActors: boundaryActorIds,
    dataPolicy: 'synthetic_only',
    authentication: 'not_implemented',
    deployment: 'not_authorised',
  }
}
