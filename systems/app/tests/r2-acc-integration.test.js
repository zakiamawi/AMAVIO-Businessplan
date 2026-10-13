import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { openDatabase, readCaseState } from '../server/database.mjs'
import {
  executeExternalRoleCommand,
  getCaseProjection,
  interfaceContractVersion,
  listAccOutbox,
  receiveAccMessage,
} from '../server/case-service.mjs'

function accEnvelope(overrides = {}) {
  return {
    messageId: 'ACC-MSG-001',
    contractVersion: interfaceContractVersion,
    correlationId: 'SYN-ARRIVAL-0417',
    idempotencyKey: 'acc:readiness:001',
    messageType: 'employer_decision',
    commandId: 'CMD-001',
    senderRole: 'employer',
    expectedRevision: 1,
    synthetic: true,
    payload: { outcome: 'readiness_confirmed' },
    ...overrides,
  }
}

function withDatabase(run) {
  const folder = mkdtempSync(join(tmpdir(), 'amavio-r2-acc-'))
  const database = openDatabase(join(folder, 'test.sqlite'))
  try {
    return run(database)
  } finally {
    database.close()
    rmSync(folder, { recursive: true, force: true })
  }
}

test('versioned ACC message advances only the applicable synthetic boundary step', () => withDatabase((database) => {
  const result = receiveAccMessage(database, accEnvelope())
  assert.equal(result.ok, true)
  assert.equal(result.integrationStatus, 'processed')
  const projection = getCaseProjection(database, { actorId: 'professional', language: 'de' })
  assert.equal(projection.next.id, 'CMD-003')
  assert.equal(projection.next.canAct, true)
  assert.equal(readCaseState(database).revision, 3)
}))

test('ACC messages are idempotent and real payloads are rejected', () => withDatabase((database) => {
  const first = receiveAccMessage(database, accEnvelope())
  const revision = readCaseState(database).revision
  const replay = receiveAccMessage(database, accEnvelope())
  const real = receiveAccMessage(database, accEnvelope({ messageId: 'ACC-MSG-REAL', idempotencyKey: 'acc:real', synthetic: false }))
  assert.equal(first.ok, true)
  assert.equal(replay.replayed, true)
  assert.equal(readCaseState(database).revision, revision)
  assert.equal(real.ok, false)
  assert.equal(real.reason, 'real_data_not_allowed')
}))

test('external role command creates an App-to-ACC outbox envelope', () => withDatabase((database) => {
  receiveAccMessage(database, accEnvelope())
  const projection = getCaseProjection(database, { actorId: 'professional', language: 'en' })
  const result = executeExternalRoleCommand(database, {
    caseId: projection.caseId,
    commandId: projection.next.id,
    actorId: 'professional',
    expectedRevision: projection.revision,
    idempotencyKey: 'ui:professional:CMD-003:3',
    language: 'en',
  })
  assert.equal(result.ok, true)
  assert.equal(result.projection.next.actorId, 'operations')
  const outbox = listAccOutbox(database)
  assert.equal(outbox.length, 1)
  assert.equal(outbox[0].actorRole, 'professional')
  assert.equal(outbox[0].synthetic, true)
  assert.equal(outbox[0].contractVersion, interfaceContractVersion)
}))

test('forbidden private fields never cross the ACC boundary', () => withDatabase((database) => {
  const result = receiveAccMessage(database, accEnvelope({
    messageId: 'ACC-MSG-FORBIDDEN',
    idempotencyKey: 'acc:forbidden',
    payload: { personName: 'Synthetic but forbidden' },
  }))
  assert.equal(result.ok, false)
  assert.equal(result.reason, 'forbidden_field_personName')
  assert.equal(readCaseState(database).revision, 1)
}))
