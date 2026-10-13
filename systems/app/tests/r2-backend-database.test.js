import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { databaseSummary, openDatabase, readCaseState } from '../server/database.mjs'
import { executeCaseCommand, getCaseProjection } from '../server/case-service.mjs'

function withDatabase(run) {
  const folder = mkdtempSync(join(tmpdir(), 'amavio-r2-db-'))
  const path = join(folder, 'test.sqlite')
  const database = openDatabase(path)
  try {
    return run(database, path)
  } finally {
    database.close()
    rmSync(folder, { recursive: true, force: true })
  }
}

test('SQLite seeds exactly one synthetic canonical case', () => withDatabase((database) => {
  const state = readCaseState(database)
  assert.equal(state.caseId, 'SYN-ARRIVAL-0417')
  assert.equal(state.revision, 1)
  assert.equal(state.events.length, 0)
  assert.equal(databaseSummary(database).arrival_cases, 1)
}))

test('the database rejects stale revisions without changing the case', () => withDatabase((database) => {
  const result = executeCaseCommand(database, {
    caseId: 'SYN-ARRIVAL-0417',
    commandId: 'CMD-001',
    actorId: 'employer',
    expectedRevision: 99,
    idempotencyKey: 'test:stale-revision',
  })
  assert.equal(result.ok, false)
  assert.equal(result.reason, 'revision_conflict')
  assert.equal(readCaseState(database).revision, 1)
  assert.equal(databaseSummary(database).commands, 1)
}))

test('case state remains persisted after reopening SQLite', () => {
  const folder = mkdtempSync(join(tmpdir(), 'amavio-r2-persist-'))
  const path = join(folder, 'persist.sqlite')
  let database = openDatabase(path)
  const result = executeCaseCommand(database, {
    caseId: 'SYN-ARRIVAL-0417',
    commandId: 'CMD-001',
    actorId: 'employer',
    expectedRevision: 1,
    idempotencyKey: 'test:persist-employer',
  })
  assert.equal(result.ok, true)
  database.close()

  database = openDatabase(path)
  try {
    const state = readCaseState(database)
    assert.equal(state.revision, 3)
    assert.equal(state.events.length, 2)
    const projection = getCaseProjection(database, { actorId: 'professional', language: 'de' })
    assert.equal(projection.next.actorId, 'professional')
    assert.equal(projection.next.id, 'CMD-003')
  } finally {
    database.close()
    rmSync(folder, { recursive: true, force: true })
  }
})
