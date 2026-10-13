import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

let requestSequence = 0;
const headers = (session = "demo-session-alpha") => ({
  "content-type": "application/json",
  "x-demo-session": session,
  "idempotency-key": `backend-test-${++requestSequence}`,
});

async function start(databasePath) {
  const application = createApplication({ databasePath, providerMode: "local" });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const address = application.server.address();
  return { ...application, base: `http://127.0.0.1:${address.port}` };
}

async function close(server) { await new Promise((resolve) => server.close(resolve)); }

test("Gate 01 enforces synthetic tenant context, human review and sink-only effects", async () => {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate01-"));
  const databasePath = join(directory, "gate01.sqlite");
  const app = await start(databasePath);
  try {
    const unauthenticated = await fetch(`${app.base}/api/v1/bootstrap`);
    assert.equal(unauthenticated.status, 401);

    const bootstrapResponse = await fetch(`${app.base}/api/v1/bootstrap`, { headers: headers() });
    assert.equal(bootstrapResponse.status, 200);
    const bootstrap = await bootstrapResponse.json();
    assert.equal(bootstrap.tenant.id, "SYN-TENANT-001");
    assert.equal(bootstrap.case.id, "SYN-CASE-001");
    assert.equal(bootstrap.boundaries.messaging, "sink_only");
    assert.equal(bootstrap.boundaries.registration, false);

    const crossTenantResponse = await fetch(`${app.base}/api/v1/assistant/runs`, {
      method: "POST", headers: headers("demo-session-beta"),
      body: JSON.stringify({ caseId: "SYN-CASE-001", objective: "Fremden Fall öffnen" }),
    });
    assert.equal(crossTenantResponse.status, 404);

    const runResponse = await fetch(`${app.base}/api/v1/assistant/runs`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ caseId: "SYN-CASE-001", objective: "Belegten Arbeitsplan erstellen" }),
    });
    assert.equal(runResponse.status, 201);
    const { run } = await runResponse.json();
    assert.equal(run.provider, "local-structured-fallback");
    assert.equal(run.output.schemaVersion, "acc.assistance.v1");
    assert.ok(run.output.evidence.length >= 3);
    assert.ok(run.output.forbiddenActions.includes("keine Nachricht senden"));

    const blockedPreview = await fetch(`${app.base}/api/v1/outbox/preview`, {
      method: "POST", headers: headers(), body: JSON.stringify({ caseId: "SYN-CASE-001", runId: run.id }),
    });
    assert.equal(blockedPreview.status, 409);

    const reviewResponse = await fetch(`${app.base}/api/v1/assistant/runs/${encodeURIComponent(run.id)}/review`, {
      method: "POST", headers: headers(), body: JSON.stringify({ decision: "approved", note: "Synthetische Belege geprüft; keine Außenwirkung." }),
    });
    assert.equal(reviewResponse.status, 200);
    const reviewed = await reviewResponse.json();
    assert.equal(reviewed.run.reviewDecision, "approved");

    const messageResponse = await fetch(`${app.base}/api/v1/outbox/preview`, {
      method: "POST", headers: headers(), body: JSON.stringify({ caseId: "SYN-CASE-001", runId: run.id }),
    });
    assert.equal(messageResponse.status, 201);
    const message = await messageResponse.json();
    assert.equal(message.status, "sink_only");
    assert.equal(message.externalEffect, false);

    const bookingResponse = await fetch(`${app.base}/api/v1/bookings/preview`, {
      method: "POST", headers: headers(), body: JSON.stringify({ caseId: "SYN-CASE-001", runId: run.id }),
    });
    assert.equal(bookingResponse.status, 201);
    const booking = await bookingResponse.json();
    assert.equal(booking.status, "sink_only");
    assert.equal(booking.externalEffect, false);

    const auditResponse = await fetch(`${app.base}/api/v1/audit`, { headers: headers() });
    const audit = await auditResponse.json();
    assert.equal(audit.events.length, 4);
    assert.equal(audit.events[0].label, "Buchungsvorschau im Sink gespeichert");
  } finally { await close(app.server); }

  const reopened = await start(databasePath);
  try {
    const response = await fetch(`${reopened.base}/api/v1/bootstrap`, { headers: headers() });
    const payload = await response.json();
    assert.equal(payload.latestRun.reviewDecision, "approved");
    assert.ok(payload.auditEvents.length >= 4);
  } finally { await close(reopened.server); }
});

test("external provider mode remains technically blocked without a released provider implementation", async () => {
  const directory = mkdtempSync(join(tmpdir(), "amavio-acc-gate01-provider-"));
  const app = createApplication({ databasePath: join(directory, "gate01.sqlite"), providerMode: "external" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  const address = app.server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/assistant/runs`, {
      method: "POST", headers: headers(), body: JSON.stringify({ caseId: "SYN-CASE-001", objective: "Externen Lauf starten" }),
    });
    assert.equal(response.status, 503);
    const payload = await response.json();
    assert.match(payload.error, /Founder.*Datenschutz.*Kostenfreigabe/);
  } finally { await close(app.server); }
});
