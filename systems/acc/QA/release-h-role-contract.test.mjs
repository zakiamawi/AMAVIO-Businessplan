import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

const sessions = {
  operations: "demo-session-operations",
  sponsor: "demo-session-employer-sponsor",
  hr: "demo-session-employer-hr",
  location: "demo-session-employer-location",
  budget: "demo-session-employer-budget",
};
let sequence = 0;
const headers = (session, mutation = false) => ({
  "content-type": "application/json",
  "x-demo-session": session,
  ...(mutation ? { "idempotency-key": `role-contract-${String(++sequence).padStart(6, "0")}` } : {}),
});

async function start() {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-h-role-contract-"));
  const app = createApplication({ databasePath: join(directory, "role-contract.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  return { ...app, base: `http://127.0.0.1:${app.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }
async function read(response) { return response.json(); }

test("Release H projects distinct portfolios for Operations, Sponsor, HR, Standort and Budget", async () => {
  const app = await start();
  try {
    const results = {};
    for (const [role, session] of Object.entries(sessions)) {
      const response = await fetch(`${app.base}/api/v1.5/bootstrap`, { headers: headers(session) });
      assert.equal(response.status, 200, role);
      results[role] = await read(response);
    }
    assert.deepEqual(results.operations.portfolio.map((item) => item.id), ["SYN-CASE-001", "SYN-CASE-005", "SYN-CASE-003", "SYN-CASE-002", "SYN-CASE-004"]);
    assert.equal(results.operations.selected.rules.length, 10);
    assert.equal(results.operations.access.role, "operations");
    assert.equal(results.sponsor.portfolio.length, 5);
    assert.equal(results.sponsor.selected.rules.length, 0);
    assert.equal(results.sponsor.selected.events.length, 0);
    assert.equal(results.sponsor.selected.evidence[0].source, "Projektion aus geprüften synthetischen Quellen");
    assert.deepEqual(results.hr.portfolio.map((item) => item.id), ["SYN-CASE-003"]);
    assert.deepEqual(results.location.portfolio.map((item) => item.id), ["SYN-CASE-001", "SYN-CASE-002"]);
    assert.deepEqual(results.budget.portfolio.map((item) => item.id), ["SYN-CASE-005"]);
    assert.equal(results.budget.selected.tasks[0].ownerRole, "Budgetverantwortung");
    assert.equal(results.budget.selected.decisions[0].canReview, true);
    assert.equal(results.sponsor.providerStatus, null);
  } finally { await close(app); }
});

test("Release H denies internal routes and cross-role mutations before idempotency processing", async () => {
  const app = await start();
  try {
    const kernel = await fetch(`${app.base}/api/kernel/v2/status`, { headers: headers(sessions.sponsor) });
    assert.equal(kernel.status, 403);
    assert.equal((await read(kernel)).code, "role_scope_denied");

    const simulation = await fetch(`${app.base}/api/v1.5/cases/SYN-CASE-001/simulations`, {
      method: "POST", headers: headers(sessions.sponsor), body: JSON.stringify({ arrivalDate: "2026-09-16" }),
    });
    assert.equal(simulation.status, 403);

    const foreignTask = await fetch(`${app.base}/api/v1.5/tasks/SYN-CASE-002-TASK-1`, {
      method: "PATCH", headers: headers(sessions.hr), body: JSON.stringify({ status: "completed", note: "Unzulässige Fremdaufgabe.", version: 1 }),
    });
    assert.equal(foreignTask.status, 403);

    const foreignDecision = await fetch(`${app.base}/api/v1.5/decisions/SYN-CASE-005-DEC-1/review`, {
      method: "POST", headers: headers(sessions.sponsor), body: JSON.stringify({ option: "Im Kostenrahmen freigeben", rationale: "Unzulässige Fremdentscheidung." }),
    });
    assert.equal(foreignDecision.status, 403);
  } finally { await close(app); }
});

test("Release H permits only assigned employer actions and keeps every result local", async () => {
  const app = await start();
  try {
    const hrTask = await fetch(`${app.base}/api/v1.5/tasks/SYN-CASE-003-TASK-1`, {
      method: "PATCH", headers: headers(sessions.hr, true), body: JSON.stringify({ status: "completed", note: "Synthetischen HR-Review lokal dokumentiert.", version: 1 }),
    });
    assert.equal(hrTask.status, 200);
    assert.equal((await read(hrTask)).externalEffect, false);

    const locationEvidence = await fetch(`${app.base}/api/v1.5/evidence/SYN-CASE-002-EVD-1/review`, {
      method: "POST", headers: headers(sessions.location, true), body: JSON.stringify({ status: "confirmed", note: "Synthetischen Standortkontakt lokal bestätigt.", version: 1 }),
    });
    assert.equal(locationEvidence.status, 200);
    assert.equal((await read(locationEvidence)).externalEffect, false);

    const budgetDecision = await fetch(`${app.base}/api/v1.5/decisions/SYN-CASE-005-DEC-1/review`, {
      method: "POST", headers: headers(sessions.budget, true), body: JSON.stringify({ option: "Im Kostenrahmen freigeben", rationale: "Synthetische Kostengrundlage und Kostenrahmen lokal geprüft." }),
    });
    assert.equal(budgetDecision.status, 201);
    const decision = await read(budgetDecision);
    assert.equal(decision.effectMode, "local_only");
    assert.equal(decision.externalEffect, false);
  } finally { await close(app); }
});
