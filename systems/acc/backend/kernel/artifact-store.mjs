import { randomUUID } from "node:crypto";
import { KERNEL_ARTIFACT_CONTRACT_VERSION, kernelError } from "./contracts.mjs";
import { createHumanGateContract, reviewHumanGate } from "./human-gate.mjs";

const PREFIXES = Object.freeze({
  evidence_reconciliation: "REC",
  critical_path_replan: "RPL",
  arrival_readiness_brief: "BRF",
});

function now() { return new Date().toISOString(); }
function parse(value, fallback = {}) { try { return JSON.parse(value); } catch { return fallback; } }

export function installKernelArtifactStore(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS kernel_artifacts (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id),
      case_id TEXT NOT NULL REFERENCES arrival_cases(id),
      contract_version TEXT NOT NULL,
      artifact_type TEXT NOT NULL CHECK (artifact_type IN ('evidence_reconciliation','critical_path_replan','arrival_readiness_brief')),
      capability_version TEXT NOT NULL,
      base_case_version INTEGER NOT NULL,
      graph_hash TEXT NOT NULL,
      input_hash TEXT NOT NULL,
      content_json TEXT NOT NULL,
      quality_json TEXT NOT NULL,
      gate_json TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('awaiting_human_review','approved','rejected')),
      review_version INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL REFERENCES users(id),
      created_at TEXT NOT NULL,
      reviewed_by TEXT,
      reviewed_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_kernel_artifacts_case ON kernel_artifacts(tenant_id,case_id,artifact_type,created_at DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_kernel_artifacts_reproducible ON kernel_artifacts(tenant_id,case_id,artifact_type,input_hash);
  `);
}

export function serializeArtifact(row) {
  if (!row) return null;
  return {
    id: row.id,
    contractVersion: row.contract_version,
    caseId: row.case_id,
    artifactType: row.artifact_type,
    capabilityVersion: row.capability_version,
    baseCaseVersion: row.base_case_version,
    graphHash: row.graph_hash,
    inputHash: row.input_hash,
    content: parse(row.content_json),
    quality: parse(row.quality_json),
    humanGate: parse(row.gate_json),
    status: row.status,
    reviewVersion: row.review_version,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    synthetic: true,
    effectMode: "advisory_only",
    externalEffect: false,
  };
}

export function createArtifact(db, { session, caseId, artifactType, capabilityVersion, baseCaseVersion, graphHash, inputHash, content, quality, reviewerRole = "AMAVIO Operations" }) {
  const existing = db.prepare("SELECT * FROM kernel_artifacts WHERE tenant_id=? AND case_id=? AND artifact_type=? AND input_hash=?").get(session.tenantId, caseId, artifactType, inputHash);
  if (existing) return { artifact: serializeArtifact(existing), reproduced: true };
  const prefix = PREFIXES[artifactType];
  if (!prefix) throw kernelError("Unbekannter Kernel-Artefakttyp.", "kernel_artifact_type_unknown", 400);
  const gate = createHumanGateContract({ reviewerRole });
  const id = `${prefix}-${randomUUID()}`;
  db.prepare(`INSERT INTO kernel_artifacts (
    id,tenant_id,case_id,contract_version,artifact_type,capability_version,base_case_version,graph_hash,input_hash,
    content_json,quality_json,gate_json,status,created_by,created_at
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(
    id, session.tenantId, caseId, KERNEL_ARTIFACT_CONTRACT_VERSION, artifactType, capabilityVersion,
    baseCaseVersion, graphHash, inputHash, JSON.stringify(content), JSON.stringify(quality), JSON.stringify(gate),
    "awaiting_human_review", session.userId, now(),
  );
  return { artifact: serializeArtifact(db.prepare("SELECT * FROM kernel_artifacts WHERE id=? AND tenant_id=?").get(id, session.tenantId)), reproduced: false };
}

export function getArtifact(db, id, tenantId) {
  return serializeArtifact(db.prepare("SELECT * FROM kernel_artifacts WHERE id=? AND tenant_id=?").get(id, tenantId));
}

export function latestApprovedArtifact(db, caseId, tenantId, artifactType) {
  return serializeArtifact(db.prepare("SELECT * FROM kernel_artifacts WHERE case_id=? AND tenant_id=? AND artifact_type=? AND status='approved' ORDER BY created_at DESC LIMIT 1").get(caseId, tenantId, artifactType));
}

export function reviewArtifact(db, { session, artifactId, decision, note, version }) {
  const row = db.prepare("SELECT * FROM kernel_artifacts WHERE id=? AND tenant_id=?").get(artifactId, session.tenantId);
  if (!row) throw kernelError("Kernel-Artefakt im aktiven Mandanten nicht gefunden.", "kernel_artifact_not_found", 404);
  if (row.status !== "awaiting_human_review" || Number(version) !== row.review_version) {
    throw kernelError("Kernel-Artefakt wurde bereits oder parallel geprüft.", "kernel_artifact_review_conflict", 409);
  }
  const gate = reviewHumanGate(parse(row.gate_json), decision, note);
  const updated = db.prepare(`UPDATE kernel_artifacts SET status=?,gate_json=?,review_version=review_version+1,reviewed_by=?,reviewed_at=?
    WHERE id=? AND tenant_id=? AND status='awaiting_human_review' AND review_version=?`)
    .run(decision, JSON.stringify(gate), session.userId, now(), artifactId, session.tenantId, Number(version));
  if (updated.changes !== 1) throw kernelError("Kernel-Artefakt wurde parallel geprüft.", "kernel_artifact_review_conflict", 409);
  return getArtifact(db, artifactId, session.tenantId);
}
