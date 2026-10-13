import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { createAssistance } from '../server/ai-service.mjs'
import { databaseSummary, openDatabase } from '../server/database.mjs'

function withDatabase(run) {
  const folder = mkdtempSync(join(tmpdir(), 'amavio-r2-ai-'))
  const database = openDatabase(join(folder, 'test.sqlite'))
  try {
    return run(database)
  } finally {
    database.close()
    rmSync(folder, { recursive: true, force: true })
  }
}

test('local assistance explains only a role-minimised synthetic projection', () => withDatabase((database) => {
  const result = createAssistance(database, {
    caseId: 'SYN-ARRIVAL-0417',
    roleId: 'professional',
    language: 'de',
    purpose: 'explain_next_step',
    synthetic: true,
  })
  assert.equal(result.ok, true)
  assert.equal(result.response.provider, 'local_policy_assistant')
  assert.equal(result.response.decisionEffect, false)
  assert.match(result.response.boundary, /keine Person/)
  assert.equal(databaseSummary(database).ai_requests, 1)
}))

test('real data, matching and scoring purposes are refused', () => withDatabase((database) => {
  const base = { caseId: 'SYN-ARRIVAL-0417', roleId: 'professional', language: 'de', synthetic: true }
  const real = createAssistance(database, { ...base, synthetic: false, purpose: 'explain_next_step' })
  const matching = createAssistance(database, { ...base, purpose: 'matching' })
  assert.equal(real.reason, 'real_data_not_allowed')
  assert.equal(matching.reason, 'purpose_not_allowed')
  assert.equal(databaseSummary(database).ai_requests, 0)
}))

test('an external AI provider remains disabled by the no-cost no-external gate', () => withDatabase((database) => {
  const previous = process.env.AMAVIO_AI_PROVIDER
  process.env.AMAVIO_AI_PROVIDER = 'external-provider'
  try {
    const result = createAssistance(database, {
      caseId: 'SYN-ARRIVAL-0417',
      roleId: 'housing',
      language: 'en',
      purpose: 'summarize_visible_status',
      synthetic: true,
    })
    assert.equal(result.ok, false)
    assert.equal(result.reason, 'external_ai_provider_disabled_by_release_gate')
  } finally {
    if (previous === undefined) delete process.env.AMAVIO_AI_PROVIDER
    else process.env.AMAVIO_AI_PROVIDER = previous
  }
}))
