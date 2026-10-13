import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { createInitialArrivalState } from '../src/arrival/engine.js'

export const defaultDatabasePath = resolve('.runtime/amavio-one-v2-4-r2.synthetic.sqlite')

const schema = `
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  CREATE TABLE IF NOT EXISTS arrival_cases (
    id TEXT PRIMARY KEY,
    schema_version INTEGER NOT NULL,
    contract_version TEXT NOT NULL,
    revision INTEGER NOT NULL,
    cursor INTEGER NOT NULL,
    completed INTEGER NOT NULL CHECK (completed IN (0, 1)),
    synthetic INTEGER NOT NULL CHECK (synthetic = 1),
    state_json TEXT NOT NULL,
    updated_at_utc TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id TEXT NOT NULL REFERENCES arrival_cases(id),
    command_id TEXT NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    actor_id TEXT NOT NULL,
    expected_revision INTEGER,
    result TEXT NOT NULL,
    reason TEXT,
    response_json TEXT NOT NULL,
    created_at_utc TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS workflow_events (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES arrival_cases(id),
    sequence INTEGER NOT NULL,
    visibility_json TEXT NOT NULL,
    event_json TEXT NOT NULL,
    occurred_at_utc TEXT NOT NULL,
    UNIQUE (case_id, sequence)
  ) STRICT;

  CREATE TABLE IF NOT EXISTS integration_messages (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES arrival_cases(id),
    direction TEXT NOT NULL CHECK (direction IN ('app_to_acc', 'acc_to_app')),
    message_type TEXT NOT NULL,
    contract_version TEXT NOT NULL,
    correlation_id TEXT NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    envelope_json TEXT NOT NULL,
    created_at_utc TEXT NOT NULL,
    processed_at_utc TEXT
  ) STRICT;

  CREATE TABLE IF NOT EXISTS ai_requests (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL REFERENCES arrival_cases(id),
    role_id TEXT NOT NULL,
    purpose TEXT NOT NULL,
    provider TEXT NOT NULL,
    input_hash TEXT NOT NULL,
    decision_effect INTEGER NOT NULL CHECK (decision_effect = 0),
    response_json TEXT NOT NULL,
    created_at_utc TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata_json TEXT NOT NULL,
    created_at_utc TEXT NOT NULL
  ) STRICT;

  CREATE INDEX IF NOT EXISTS idx_events_case_sequence ON workflow_events(case_id, sequence);
  CREATE INDEX IF NOT EXISTS idx_messages_case_direction ON integration_messages(case_id, direction, created_at_utc);
  CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id, created_at_utc);
`

function utcNow() {
  return new Date().toISOString()
}

function seedCase(database) {
  const state = createInitialArrivalState()
  database.prepare(`
    INSERT INTO arrival_cases (
      id, schema_version, contract_version, revision, cursor, completed, synthetic, state_json, updated_at_utc
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
    ON CONFLICT(id) DO NOTHING
  `).run(
    state.caseId,
    state.schemaVersion,
    state.contractVersion,
    state.revision,
    state.cursor,
    state.completed ? 1 : 0,
    JSON.stringify(state),
    utcNow(),
  )
}

export function openDatabase(databasePath = defaultDatabasePath) {
  mkdirSync(dirname(databasePath), { recursive: true })
  const database = new DatabaseSync(databasePath)
  database.exec(schema)
  seedCase(database)
  return database
}

export function readCaseState(database, caseId = 'SYN-ARRIVAL-0417') {
  const row = database.prepare('SELECT state_json FROM arrival_cases WHERE id = ?').get(caseId)
  return row ? JSON.parse(row.state_json) : null
}

export function writeCaseState(database, state) {
  database.prepare(`
    UPDATE arrival_cases
    SET schema_version = ?, contract_version = ?, revision = ?, cursor = ?, completed = ?, state_json = ?, updated_at_utc = ?
    WHERE id = ?
  `).run(
    state.schemaVersion,
    state.contractVersion,
    state.revision,
    state.cursor,
    state.completed ? 1 : 0,
    JSON.stringify(state),
    utcNow(),
    state.caseId,
  )
}

export function resetSyntheticCase(database, caseId = 'SYN-ARRIVAL-0417') {
  const state = createInitialArrivalState()
  if (state.caseId !== caseId) throw new Error('unknown_synthetic_case')
  database.exec('BEGIN IMMEDIATE')
  try {
    for (const table of ['commands', 'workflow_events', 'integration_messages', 'ai_requests']) {
      database.prepare(`DELETE FROM ${table} WHERE case_id = ?`).run(caseId)
    }
    database.prepare("DELETE FROM audit_log WHERE entity_id = ? OR json_extract(metadata_json, '$.caseId') = ?").run(caseId, caseId)
    writeCaseState(database, state)
    database.exec('COMMIT')
    return state
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
}

export function recordAudit(database, action, entityType, entityId, metadata = {}) {
  database.prepare(`
    INSERT INTO audit_log (action, entity_type, entity_id, metadata_json, created_at_utc)
    VALUES (?, ?, ?, ?, ?)
  `).run(action, entityType, entityId, JSON.stringify(metadata), utcNow())
}

export function databaseSummary(database) {
  const tables = ['arrival_cases', 'commands', 'workflow_events', 'integration_messages', 'ai_requests', 'audit_log']
  return Object.fromEntries(tables.map((table) => [table, database.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count]))
}

export { utcNow }
