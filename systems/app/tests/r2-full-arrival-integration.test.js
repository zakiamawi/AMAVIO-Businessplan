import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { getCurrentStep } from '../src/arrival/engine.js'
import { databaseSummary, openDatabase, readCaseState } from '../server/database.mjs'
import {
  boundaryActorIds,
  executeExternalRoleCommand,
  externalRoleIds,
  interfaceContractVersion,
  listAccOutbox,
  receiveAccMessage,
} from '../server/case-service.mjs'

test('one persisted synthetic Arrival process crosses App and ACC boundaries through all 44 steps', () => {
  const folder = mkdtempSync(join(tmpdir(), 'amavio-r2-e2e-'))
  const database = openDatabase(join(folder, 'test.sqlite'))
  let boundaryMessages = 0
  let externalCommands = 0
  try {
    for (let safety = 0; safety < 60; safety += 1) {
      const state = readCaseState(database)
      if (state.completed) break
      const step = getCurrentStep(state)
      assert.ok(step, 'current step must exist until completion')
      if (boundaryActorIds.includes(step.actor)) {
        boundaryMessages += 1
        const result = receiveAccMessage(database, {
          messageId: `ACC-E2E-${String(boundaryMessages).padStart(3, '0')}`,
          contractVersion: interfaceContractVersion,
          correlationId: state.caseId,
          idempotencyKey: `acc:e2e:${step.id}:${state.revision}`,
          messageType: step.actor === 'employer' ? 'employer_decision' : 'review_result',
          commandId: step.id,
          senderRole: step.actor,
          expectedRevision: state.revision,
          synthetic: true,
          payload: { outcome: 'synthetic_contract_step' },
        })
        assert.equal(result.ok, true, `${step.id}:${result.reason}`)
      } else {
        assert.equal(externalRoleIds.includes(step.actor), true, `unexpected actor ${step.actor}`)
        externalCommands += 1
        const result = executeExternalRoleCommand(database, {
          caseId: state.caseId,
          commandId: step.id,
          actorId: step.actor,
          expectedRevision: state.revision,
          idempotencyKey: `app:e2e:${step.id}:${state.revision}`,
          language: 'de',
        })
        assert.equal(result.ok, true, `${step.id}:${result.reason}`)
      }
    }

    const completed = readCaseState(database)
    assert.equal(completed.completed, true)
    assert.equal(completed.cursor, 44)
    assert.equal(completed.events.length, 44)
    assert.equal(completed.revision, 45)
    assert.equal(listAccOutbox(database).length, externalCommands)
    assert.equal(databaseSummary(database).integration_messages, boundaryMessages + externalCommands)
    assert.ok(boundaryMessages > 0)
    assert.ok(externalCommands > 0)
  } finally {
    database.close()
    rmSync(folder, { recursive: true, force: true })
  }
})
