import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

async function withApp(run) {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-n-role-language-"));
  const app = createApplication({ databasePath: join(directory, "role-language.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  try { await run(`http://127.0.0.1:${app.server.address().port}`); }
  finally { await new Promise((resolve) => app.server.close(resolve)); }
}

test("Release N exposes understandable employer function labels while preserving the internal role key", async () => {
  await withApp(async (base) => {
    const headers = { "x-demo-session": "demo-session-employer-sponsor" };
    const cases = await fetch(`${base}/api/v1.5/bootstrap`, { headers });
    assert.equal(cases.status, 200);
    const casePayload = await cases.json();
    assert.equal(casePayload.access.role, "employer_sponsor");
    assert.equal(casePayload.access.label, "Arbeitgeber · Gesamtsteuerung");
    assert.equal(casePayload.access.scopeTitle, "Bereichsübergreifende Steuerung und Entscheidungen");
    assert.equal(casePayload.access.label.includes("Sponsor"), false);

    const collaboration = await fetch(`${base}/api/collaboration/v1/bootstrap`, { headers });
    assert.equal(collaboration.status, 200);
    const collaborationPayload = await collaboration.json();
    assert.equal(collaborationPayload.access.label, "Arbeitgeber · Gesamtsteuerung");
    assert.equal(collaborationPayload.boundaries.externalEffects, false);
    assert.equal(collaborationPayload.boundaries.syntheticOnly, true);
  });
});
