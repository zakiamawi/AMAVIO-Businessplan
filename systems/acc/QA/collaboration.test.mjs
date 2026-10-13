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
};
let sequence = 0;
const headers = (session, mutation = false) => ({
  "content-type": "application/json",
  "x-demo-session": session,
  ...(mutation ? { "idempotency-key": `dual-workflow-${String(++sequence).padStart(6, "0")}` } : {}),
});

async function start() {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-j5-collaboration-"));
  const app = createApplication({ databasePath: join(directory, "collaboration.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  return { ...app, base: `http://127.0.0.1:${app.server.address().port}` };
}
async function close(app) { await new Promise((resolve) => app.server.close(resolve)); }

test("Release J.5 exposes role-minimized employer contributions and the full Operations inbox", async () => {
  const app = await start();
  try {
    const sponsor = await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(sessions.sponsor) });
    const sponsorPayload = await sponsor.json();
    assert.equal(sponsor.status, 200);
    assert.equal(sponsorPayload.access.roleGroup, "employer");
    assert.equal(sponsorPayload.contributions.length, 1);
    assert.equal(sponsorPayload.boundaries.internalLearningHiddenFromEmployer, true);

    const hr = await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(sessions.hr) });
    assert.equal((await hr.json()).contributions.length, 0);

    const operations = await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(sessions.operations) });
    const operationsPayload = await operations.json();
    assert.equal(operationsPayload.access.roleGroup, "amavio");
    assert.equal(operationsPayload.contributions.length, 1);
  } finally { await close(app); }
});

test("Release J.5 carries an employer contribution into Operations without external effect", async () => {
  const app = await start();
  try {
    const submitted = await fetch(`${app.base}/api/collaboration/v1/contributions`, {
      method: "POST",
      headers: headers(sessions.sponsor, true),
      body: JSON.stringify({
        caseId: "SYN-CASE-001",
        type: "decision",
        summary: "Starttermin unter Vorbehalt bestätigt",
        detail: "Der synthetische Sponsor bestätigt den geplanten Starttermin unter der dokumentierten Wohnraumvoraussetzung.",
      }),
    });
    const contribution = await submitted.json();
    assert.equal(submitted.status, 201);
    assert.equal(contribution.externalEffect, false);
    assert.equal(contribution.contribution.status, "submitted");

    const operations = await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(sessions.operations) });
    const operationsPayload = await operations.json();
    assert.equal(operationsPayload.contributions.some((item) => item.id === contribution.contribution.id), true);

    const hr = await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(sessions.hr) });
    const hrPayload = await hr.json();
    assert.equal(hrPayload.contributions.some((item) => item.id === contribution.contribution.id), false);
  } finally { await close(app); }
});

test("Release J.5 returns a reviewed shared status while internal learning stays hidden", async () => {
  const app = await start();
  try {
    const review = await fetch(`${app.base}/api/collaboration/v1/contributions/SYN-CONTRIB-001/review`, {
      method: "POST",
      headers: headers(sessions.operations, true),
      body: JSON.stringify({ decision: "reviewed", note: "Sponsorbeitrag fachlich geprüft und in den synthetischen Fallstand eingeordnet." }),
    });
    const reviewed = await review.json();
    assert.equal(review.status, 200);
    assert.equal(reviewed.externalEffect, false);
    assert.equal(reviewed.contribution.status, "reviewed");
    assert.equal(reviewed.contribution.sharedStatus, "Gemeinsamer Status aktualisiert");

    const sponsor = await fetch(`${app.base}/api/collaboration/v1/bootstrap`, { headers: headers(sessions.sponsor) });
    const sponsorPayload = await sponsor.json();
    assert.equal(sponsorPayload.contributions[0].status, "reviewed");

    const learning = await fetch(`${app.base}/api/learning/v1/bootstrap`, { headers: headers(sessions.sponsor) });
    assert.equal(learning.status, 403);
  } finally { await close(app); }
});

test("Release J.5 adds outcome feedback to Operational Learning only after an explicit Operations choice", async () => {
  const app = await start();
  try {
    const submitted = await fetch(`${app.base}/api/collaboration/v1/contributions`, {
      method: "POST",
      headers: headers(sessions.sponsor, true),
      body: JSON.stringify({
        caseId: "SYN-CASE-001",
        type: "outcome_feedback",
        summary: "Arbeitsstart im synthetischen Fall planmäßig erfolgt",
        detail: "Der geplante Arbeitsbeginn konnte nach der dokumentierten Freigabe ohne weitere operative Abweichung stattfinden.",
      }),
    });
    const submission = await submitted.json();
    assert.equal(submitted.status, 201);

    const review = await fetch(`${app.base}/api/collaboration/v1/contributions/${encodeURIComponent(submission.contribution.id)}/review`, {
      method: "POST",
      headers: headers(sessions.operations, true),
      body: JSON.stringify({
        decision: "reviewed",
        note: "Ergebnisrückmeldung geprüft und bewusst als internes Lernsignal eingeordnet.",
        includeInLearning: true,
      }),
    });
    const reviewed = await review.json();
    assert.equal(review.status, 200);
    assert.equal(reviewed.learningIntake.created, true);
    assert.equal(reviewed.learningIntake.internalOnly, true);

    const learning = await fetch(`${app.base}/api/learning/v1/bootstrap`, { headers: headers(sessions.operations) });
    const learningPayload = await learning.json();
    const imported = learningPayload.feedback.find((item) => item.id === reviewed.learningIntake.id);
    assert.equal(Boolean(imported), true);
    assert.equal(imported.title, "Arbeitsstart im synthetischen Fall planmäßig erfolgt");
    assert.deepEqual(imported.evidenceRefs, ["SYN-CASE-001", submission.contribution.id]);

    const employerLearning = await fetch(`${app.base}/api/learning/v1/bootstrap`, { headers: headers(sessions.sponsor) });
    assert.equal(employerLearning.status, 403);
  } finally { await close(app); }
});

