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
  beta: "demo-session-beta",
};

async function withApp(run) {
  const directory = mkdtempSync(join(tmpdir(), "amavio-release-p1-"));
  const app = createApplication({ databasePath: join(directory, "release-p1.sqlite"), providerMode: "local" });
  await new Promise((resolve) => app.server.listen(0, "127.0.0.1", resolve));
  try { await run(`http://127.0.0.1:${app.server.address().port}`); }
  finally { await new Promise((resolve) => app.server.close(resolve)); }
}

async function call(base, path, { session = "operations", method = "GET", body } = {}) {
  const headers = { "x-demo-session": sessionHeaders[session] };
  if (body !== undefined) {
    sequence += 1;
    headers["content-type"] = "application/json";
    headers["idempotency-key"] = `release-p1-${sequence}`;
  }
  const response = await fetch(`${base}${path}`, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { response, payload: await response.json().catch(() => ({})) };
}

async function authorizeRecommended(base, scenarioId) {
  const initial = (await call(base, `/api/reliability/v1/bootstrap?scenario=${scenarioId}`, { session: "governance" })).payload.selectedScenario;
  const option = initial.options.find((item) => item.recommended);
  const selected = await call(base, `/api/reliability/v1/scenarios/${scenarioId}/options`, {
    session: "governance", method: "POST", body: { optionId: option.id, version: initial.state.version },
  });
  assert.equal(selected.response.status, 200);
  const authorized = await call(base, `/api/reliability/v1/scenarios/${scenarioId}/authorize`, {
    session: "governance", method: "POST", body: {
      rationale: "Die ausgewählte Option sichert den synthetischen Arbeitsstart bei klarer Mitwirkung und überprüfbarer Abnahme.",
      confirmSynthetic: true,
      version: selected.payload.scenario.state.version,
    },
  });
  assert.equal(authorized.response.status, 200);
  return authorized.payload.scenario;
}

async function completeAllSteps(base, scenario) {
  const started = await call(base, `/api/reliability/v1/scenarios/${scenario.id}/start-execution`, {
    session: "operations", method: "POST", body: { orderVersion: scenario.serviceOrder.version },
  });
  assert.equal(started.response.status, 200);
  assert.equal(started.payload.scenario.serviceOrder.status, "in_execution");
  let current = started.payload.scenario;
  for (const step of current.serviceOrder.steps) {
    const completed = await call(base, `/api/reliability/v1/scenarios/${scenario.id}/steps/${step.id}/complete`, {
      session: "operations", method: "POST", body: {
        proofReference: `SYN-BELEG-${scenario.orderCode}-${step.position}`,
        note: "Der synthetische Nachweis wurde gegen die vereinbarte Abnahmebedingung geprüft und ist vollständig.",
        stepVersion: step.version,
      },
    });
    assert.equal(completed.response.status, 200);
    current = completed.payload.scenario;
  }
  assert.equal(current.serviceOrder.progress.completed, current.serviceOrder.progress.total);
  assert.equal(current.permissions.canComplete, true);
  return current;
}

test("Release P.1 exposes a provider-free service-delivery contract", async () => {
  await withApp(async (base) => {
    const health = await fetch(`${base}/api/health`).then((response) => response.json());
    assert.equal(health.release, "P.1");
    assert.equal(health.serviceDeliveryProof, true);
    assert.equal(health.providerCalls, 0);
    assert.equal(health.externalEffects, false);

    const { response, payload } = await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "governance" });
    assert.equal(response.status, 200);
    assert.equal(payload.selectedScenario.serviceOrder, null);
    assert.equal(payload.selectedScenario.intervention.acceptanceCriteria.length, 3);
    assert.match(payload.selectedScenario.intervention.notIncluded, /keine Buchung/i);
    assert.equal(payload.selectedScenario.permissions.canSelectOption, true);
  });
});

test("Release P.1 locks the employer decision and creates a traceable AMAVIO handoff", async () => {
  await withApp(async (base) => {
    const authorized = await authorizeRecommended(base, "housing-handover");
    assert.equal(authorized.state.readiness, "intervention_active");
    assert.equal(authorized.permissions.canSelectOption, false);
    assert.equal(authorized.serviceOrder.id, "SYN-AO-HOUSING-001");
    assert.equal(authorized.serviceOrder.status, "authorized");
    assert.deepEqual(authorized.serviceOrder.progress, { completed: 0, total: 3 });

    const lockedSelection = await call(base, "/api/reliability/v1/scenarios/housing-handover/options", {
      session: "governance", method: "POST", body: { optionId: "delay-two-starts", version: authorized.state.version },
    });
    assert.equal(lockedSelection.response.status, 409);

    const employerStart = await call(base, "/api/reliability/v1/scenarios/housing-handover/start-execution", {
      session: "governance", method: "POST", body: { orderVersion: authorized.serviceOrder.version },
    });
    assert.equal(employerStart.response.status, 403);

    const operationsView = (await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "operations" })).payload.selectedScenario;
    assert.equal(operationsView.permissions.canStartExecution, true);
    assert.equal(operationsView.serviceOrder.steps.length, 3);
  });
});

test("Release P.1 requires every execution proof before result handback", async () => {
  await withApp(async (base) => {
    const authorized = await authorizeRecommended(base, "housing-handover");
    const premature = await call(base, "/api/reliability/v1/scenarios/housing-handover/complete", {
      session: "operations", method: "POST", body: {
        proofReference: "SYN-GESAMTNACHWEIS-01",
        note: "Der Auftrag wurde fachlich auf Abnahmefähigkeit geprüft.",
        resultSummary: "Die Unterkunftsübergabe und der Ankunftsweg sind nachvollziehbar abgesichert.",
        residualCondition: "Keine offene Bedingung",
        nextCheckpoint: "30-Tage-Stabilisierung",
        version: authorized.state.version,
      },
    });
    assert.equal(premature.response.status, 409);
    assert.equal(premature.payload.code, "service_order_steps_open");

    const ready = await completeAllSteps(base, authorized);
    const completed = await call(base, "/api/reliability/v1/scenarios/housing-handover/complete", {
      session: "operations", method: "POST", body: {
        proofReference: "SYN-GESAMTNACHWEIS-01",
        note: "Alle drei Ausführungsschritte und ihre synthetischen Nachweise erfüllen die vereinbarten Abnahmebedingungen.",
        resultSummary: "Die Unterkunftsübergabe für zwei Startplätze sowie der anschließende Ankunftsweg sind geschlossen dokumentiert.",
        residualCondition: "Keine offene Bedingung im synthetischen Fall",
        nextCheckpoint: "30-Tage-Stabilisierung am 31.10.2026",
        version: ready.state.version,
      },
    });
    assert.equal(completed.response.status, 200);
    assert.equal(completed.payload.scenario.state.readiness, "confirmed");
    assert.equal(completed.payload.scenario.serviceOrder.status, "completed");
    assert.match(completed.payload.scenario.serviceOrder.result.summary, /Unterkunftsübergabe/);

    const employerView = (await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "governance" })).payload.selectedScenario;
    assert.equal(employerView.serviceOrder.result.residualCondition, "Keine offene Bedingung im synthetischen Fall");
    assert.equal(employerView.serviceOrder.steps.every((step) => step.completionNote === null), true);
    assert.equal(employerView.state.decisionNote.includes("überprüfbarer Abnahme"), true);
  });
});

test("Release P.1 produces versioned, operationally usable work products", async () => {
  await withApp(async (base) => {
    const authorized = await authorizeRecommended(base, "housing-handover");
    const ready = await completeAllSteps(base, authorized);
    await call(base, "/api/reliability/v1/scenarios/housing-handover/complete", {
      session: "operations", method: "POST", body: {
        proofReference: "SYN-GESAMTNACHWEIS-02",
        note: "Der Auftrag ist anhand aller vereinbarten synthetischen Nachweise abnahmefähig.",
        resultSummary: "Übergabe, Unterkunft und Ankunftskette sind für beide synthetischen Startplätze belastbar beschrieben.",
        residualCondition: "Keine offene Bedingung",
        nextCheckpoint: "30-Tage-Stabilisierung",
        version: ready.state.version,
      },
    });

    for (const type of ["handover-plan", "readiness-brief"]) {
      const product = (await call(base, `/api/reliability/v1/work-products/${type}?scenario=housing-handover`, { session: "governance" })).payload.workProduct;
      assert.match(product.meta.version, /^P1\./);
      assert.ok(product.meta.reference.startsWith("SYN-WP-"));
      assert.ok(product.summary.length > 40);
      assert.ok(product.sections.some((section) => section.title === "Verantwortung" || section.title === "Verantwortungsübergabe"));
      assert.ok(product.sections.some((section) => section.title === "Ergebnisübergabe" || section.title === "Nachweis und Ergebnis"));
      assert.equal(product.synthetic, true);
    }
  });
});

test("Release P.1 keeps tenant, role and reset boundaries closed", async () => {
  await withApp(async (base) => {
    const initial = (await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "governance" })).payload.selectedScenario;
    const option = initial.options.find((item) => item.recommended);
    const denied = await call(base, "/api/reliability/v1/scenarios/housing-handover/options", {
      session: "hr", method: "POST", body: { optionId: option.id, version: initial.state.version },
    });
    assert.equal(denied.response.status, 403);

    const otherTenant = await call(base, "/api/reliability/v1/bootstrap?scenario=housing-handover", { session: "beta" });
    assert.equal(otherTenant.response.status, 404);

    await authorizeRecommended(base, "housing-handover");
    const reset = await call(base, "/api/reliability/v1/reset", { session: "operations", method: "POST", body: { programId: "SYN-PROG-001" } });
    assert.equal(reset.response.status, 200);
    assert.equal(reset.payload.selectedScenario.serviceOrder, null);
    assert.equal(reset.payload.scenarios.every((scenario) => scenario.intervention === "awaiting_selection"), true);
  });
});
