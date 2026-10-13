import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

let sequence = 0;
const headers = (session = "demo-session-operations", mutation = false) => ({
  "x-demo-session": session,
  ...(mutation ? { "content-type": "application/json", "idempotency-key": `release-j-${String(++sequence).padStart(6, "0")}` } : {}),
});
async function start() {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-j-learning-"));
  const app = createApplication({ databasePath: join(directory, "learning.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  return { ...app, base: `http://127.0.0.1:${app.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
const json = (response) => response.json();

test("Release J schließt sechs strukturierte Operator-Rückmeldungen zu einem Lernzyklus zusammen", async () => {
  const app = await start();
  try {
    const response = await fetch(`${app.base}/api/learning/v1/bootstrap`, { headers: headers() });
    assert.equal(response.status, 200);
    const payload = await json(response);
    assert.equal(payload.feedback.length, 6);
    assert.equal(payload.loop.feedback, 6);
    assert.equal(payload.loop.outcomesLinked, 5);
    assert.equal(payload.loop.qualityDimensions, 5);
    assert.equal(payload.loop.openDecisions, 1);
    assert.equal(payload.versions.length, 4);
    assert.equal(payload.boundaries.externalCalls, 0);
    assert.equal(payload.boundaries.providerCosts, false);
    assert.equal(payload.boundaries.automaticActivation, false);
  } finally { await close(app); }
});

test("Release J speichert Feedback strukturiert und schützt parallele Outcome-Änderungen", async () => {
  const app = await start();
  try {
    const created = await fetch(`${app.base}/api/learning/v1/feedback`, {
      method: "POST", headers: headers(undefined, true), body: JSON.stringify({ title: "Neue synthetische Beobachtung", observation: "Verantwortung ist noch unklar.", expectedOutcome: "Rolle und Prüfkriterium werden benannt.", correctionType: "output_contract", evidenceRefs: ["SYN-TWIN-EVT-002"], operatorNote: "Lokale Testnotiz" }),
    });
    assert.equal(created.status, 201);
    const item = (await json(created)).feedback;
    assert.equal(item.status, "outcome_missing");
    assert.equal(item.synthetic, true);

    const update = (actual) => fetch(`${app.base}/api/learning/v1/feedback/${encodeURIComponent(item.id)}`, {
      method: "PATCH", headers: headers(undefined, true), body: JSON.stringify({ observation: item.observation, expectedOutcome: item.expectedOutcome, actualOutcome: actual, correctionType: item.correctionType, evidenceRefs: item.evidenceRefs, operatorNote: item.operatorNote, version: 1 }),
    });
    const responses = await Promise.all([update("Rolle ist jetzt klar benannt."), update("Parallele alternative Zuordnung.")]);
    assert.deepEqual(responses.map((response) => response.status).sort(), [200, 409]);
    const saved = app.db.prepare("SELECT status,version FROM learning_feedback WHERE id=?").get(item.id);
    assert.equal(saved.status, "outcome_linked");
    assert.equal(saved.version, 2);
  } finally { await close(app); }
});

test("Release J vergleicht lokale Versionen reproduzierbar und wertet geringeren Korrekturaufwand korrekt", async () => {
  const app = await start();
  try {
    const run = () => fetch(`${app.base}/api/learning/v1/evaluations`, { method: "POST", headers: headers(undefined, true), body: "{}" });
    const first = (await json(await run())).evaluation;
    const second = (await json(await run())).evaluation;
    assert.equal(first.inputHash, second.inputHash);
    assert.equal(first.result.reproducibilityFingerprint, second.result.reproducibilityFingerprint);
    assert.equal(first.result.fixtureSet.count, 24);
    assert.equal(first.result.externalCalls, 0);
    const correction = first.result.dimensions.find((item) => item.id === "correction_effort");
    assert.equal(correction.rawDelta, -6);
    assert.equal(correction.improvement, 6);
    assert.equal(correction.passed, true);
    assert.equal(first.result.adapter.status, "disabled");
  } finally { await close(app); }
});

test("Release J erzeugt nur eine menschliche Kandidatenentscheidung und aktiviert keine Version", async () => {
  const app = await start();
  try {
    const evaluation = (await json(await fetch(`${app.base}/api/learning/v1/evaluations`, { method: "POST", headers: headers(undefined, true), body: "{}" }))).evaluation;
    const comparison = (await json(await fetch(`${app.base}/api/learning/v1/comparisons`, { method: "POST", headers: headers(undefined, true), body: JSON.stringify({ evaluationId: evaluation.id }) }))).comparison;
    assert.equal(comparison.decisionStatus, "awaiting_human_review");
    assert.equal(comparison.automaticActivation, false);
    const candidate = app.db.prepare("SELECT id,version FROM learning_versions WHERE component_type='capability' AND tenant_id='SYN-TENANT-001'").get();
    const reviewed = await fetch(`${app.base}/api/learning/v1/versions/${candidate.id}/decisions`, { method: "POST", headers: headers(undefined, true), body: JSON.stringify({ comparisonId: comparison.id, rationale: "24 Fixtures, Outcome-Match und Korrekturaufwand synthetisch geprüft.", version: candidate.version }) });
    assert.equal(reviewed.status, 200);
    const result = await json(reviewed);
    assert.equal(result.version.status, "candidate_reviewed");
    assert.equal(result.version.activated, false);
    assert.equal(result.comparison.decisionStatus, "advisory_approved");
    assert.equal(result.externalEffect, false);
  } finally { await close(app); }
});

test("Release J isoliert Mandanten und sperrt Arbeitgeber vor der Lerndomäne", async () => {
  const app = await start();
  try {
    const beta = await fetch(`${app.base}/api/learning/v1/feedback/SYN-LEARN-FB-001`, { headers: headers("demo-session-beta") });
    assert.equal(beta.status, 404);
    const employer = await fetch(`${app.base}/api/learning/v1/bootstrap`, { headers: headers("demo-session-employer-sponsor") });
    assert.equal(employer.status, 403);
    assert.equal((await json(employer)).code, "role_scope_denied");
  } finally { await close(app); }
});
