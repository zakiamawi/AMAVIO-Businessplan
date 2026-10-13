import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApplication } from "../backend/server.mjs";

let sequence = 0;
const sessionHeaders = {
  operations: "demo-session-operations",
  governance: "demo-session-employer-sponsor",
  hr: "demo-session-employer-hr",
  location: "demo-session-employer-location",
  beta: "demo-session-beta",
};

async function withApp(run) {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-p-"));
  const app = createApplication({ databasePath: join(directory, "release-p.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  try { await run(`http://127.0.0.1:${app.server.address().port}`); }
  finally { await new Promise((resolve) => app.server.close(resolve)); }
}

async function call(base, path, { session = "operations", method = "GET", body } = {}) {
  const headers = { "x-demo-session": sessionHeaders[session] };
  if (body !== undefined) {
    sequence += 1;
    headers["content-type"] = "application/json";
    headers["idempotency-key"] = `release-p-${sequence}`;
  }
  const response = await fetch(`${base}${path}`, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { response, payload: await response.json().catch(() => ({})) };
}

test("Release P exposes a provider-free Arrival Reliability contract with three exception paths", async () => {
  await withApp(async (base) => {
    const health = await fetch(`${base}/api/health`).then((response) => response.json());
    assert.equal(health.release, "P");
    assert.equal(health.arrivalReliability, true);
    assert.equal(health.interventionSystem, true);
    assert.equal(health.providerCalls, 0);
    assert.equal(health.externalEffects, false);

    const { response, payload } = await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "governance" });
    assert.equal(response.status, 200);
    assert.equal(payload.program.cohort.participantCount, 12);
    assert.equal(payload.scenarios.length, 3);
    assert.deepEqual(payload.cohort, {
      participantCount: 12,
      profession: "Pflegefachkräfte",
      locations: [
        { name: "Düsseldorf", planned: 5 },
        { name: "Köln", planned: 4 },
        { name: "Solingen", planned: 3 },
      ],
      confirmedCount: 10,
      conditionalCount: 2,
      statusLabel: "2 unter Bedingungen",
    });
    assert.equal(payload.access.workArea, "Gesamtsteuerung");
    assert.equal(payload.selectedScenario.state.readiness, "conditional");
    assert.equal(payload.selectedScenario.permissions.canSelectOption, true);
    assert.equal(payload.boundaries.automaticDecision, false);
  });
});

test("Release P closes every exception path through human option, intervention and verified outcome", async () => {
  await withApp(async (base) => {
    for (const scenarioId of ["housing-handover", "arrival-shift", "onboarding-mismatch"]) {
      let view = (await call(base, `/api/reliability/v1/bootstrap?scenario=${scenarioId}`, { session: "governance" })).payload.selectedScenario;
      const recommended = view.options.find((item) => item.recommended);

      const selected = await call(base, `/api/reliability/v1/scenarios/${scenarioId}/options`, {
        session: "governance", method: "POST", body: { optionId: recommended.id, version: view.state.version },
      });
      assert.equal(selected.response.status, 200);
      assert.equal(selected.payload.scenario.state.intervention, "awaiting_authorization");
      assert.equal(selected.payload.externalEffect, false);

      const authorized = await call(base, `/api/reliability/v1/scenarios/${scenarioId}/authorize`, {
        session: "governance", method: "POST", body: { rationale: "Die empfohlene Option hält den synthetischen Arbeitsstart bei nachvollziehbarem Aufwand stabil.", confirmSynthetic: true, version: selected.payload.scenario.state.version },
      });
      assert.equal(authorized.response.status, 200);
      assert.equal(authorized.payload.scenario.state.readiness, "intervention_active");
      assert.equal(authorized.payload.scenario.permissions.canAuthorize, false);

      const completed = await call(base, `/api/reliability/v1/scenarios/${scenarioId}/complete`, {
        session: "operations", method: "POST", body: { proofReference: `SYN-NACHWEIS-${scenarioId}`, note: "Der vereinbarte Abschlussnachweis wurde vollständig gegen die synthetische Programmlage geprüft.", version: authorized.payload.scenario.state.version },
      });
      assert.equal(completed.response.status, 200);
      assert.equal(completed.payload.scenario.state.readiness, "confirmed");
      assert.equal(completed.payload.scenario.state.evidence, "verified");
      assert.equal(completed.payload.scenario.permissions.canComplete, false);

      const brief = await call(base, `/api/reliability/v1/work-products/readiness-brief?scenario=${scenarioId}`, { session: "governance" });
      assert.equal(brief.response.status, 200);
      assert.equal(brief.payload.workProduct.status, "Startfähigkeit bestätigt");
      assert.ok(brief.payload.workProduct.sections.some((section) => section.title === "Dokumentierte Entscheidung"));
      assert.ok(brief.payload.workProduct.sections.some((section) => section.title === "Nachweisstatus"));
      assert.equal(brief.payload.externalEffect, false);

      const outcome = await call(base, `/api/reliability/v1/scenarios/${scenarioId}/outcomes`, {
        session: "governance", method: "POST", body: { rating: "stabil", note: "Der synthetische Start blieb nach dreißig Tagen ohne erneuten Handlungsbedarf stabil." },
      });
      assert.equal(outcome.response.status, 201);
      assert.equal(outcome.payload.outcome.rating, "stabil");
    }

    const reset = await call(base, "/api/reliability/v1/reset", { session: "operations", method: "POST", body: { programId: "SYN-PROG-001" } });
    assert.equal(reset.response.status, 200);
    assert.equal(reset.payload.scenarios.every((item) => item.intervention === "awaiting_selection"), true);
  });
});

test("Release P enforces role boundaries, human gate completeness and tenant isolation", async () => {
  await withApp(async (base) => {
    const governance = (await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "governance" })).payload.selectedScenario;
    const recommended = governance.options.find((item) => item.recommended);

    const hrSelection = await call(base, "/api/reliability/v1/scenarios/housing-handover/options", {
      session: "hr", method: "POST", body: { optionId: recommended.id, version: governance.state.version },
    });
    assert.equal(hrSelection.response.status, 403);
    assert.equal(hrSelection.payload.code, "role_scope_denied");

    const opsSelection = await call(base, "/api/reliability/v1/scenarios/housing-handover/options", {
      session: "operations", method: "POST", body: { optionId: recommended.id, version: governance.state.version },
    });
    assert.equal(opsSelection.response.status, 403);

    const selected = await call(base, "/api/reliability/v1/scenarios/housing-handover/options", {
      session: "governance", method: "POST", body: { optionId: recommended.id, version: governance.state.version },
    });
    const incompleteGate = await call(base, "/api/reliability/v1/scenarios/housing-handover/authorize", {
      session: "governance", method: "POST", body: { rationale: "zu kurz", confirmSynthetic: false, version: selected.payload.scenario.state.version },
    });
    assert.equal(incompleteGate.response.status, 400);
    assert.equal(incompleteGate.payload.code, "human_gate_incomplete");

    const prematureCompletion = await call(base, "/api/reliability/v1/scenarios/housing-handover/complete", {
      session: "operations", method: "POST", body: { proofReference: "SYN-04", note: "Nachweis wurde fachlich geprüft.", version: selected.payload.scenario.state.version },
    });
    assert.equal(prematureCompletion.response.status, 409);

    const otherTenant = await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "beta" });
    assert.equal(otherTenant.response.status, 404);
    assert.match(otherTenant.payload.error, /aktiven Mandanten nicht gefunden/i);
  });
});
