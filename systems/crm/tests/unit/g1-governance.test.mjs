import test from "node:test";
import assert from "node:assert/strict";
import { createSeedState } from "../../src/data/seed.js";
import { buildG1GateEvaluation, evaluateG1Controls, g1AccessAssuranceControls, g1DataClasses, g1InformationDutyArtifacts, g1ProductOwnerDecisionContract, g1RetentionSchedule, g1SourcePurposeChannelMatrix, runG1SyntheticControlSuite } from "../../src/domain/g1Governance.js";

test("G1-Datenklassen enthalten eine explizite Ausschlussklasse und Fristenregeln", () => {
  assert.ok(g1DataClasses.some((item) => item.level === "nicht_zulaessig"));
  assert.ok(g1RetentionSchedule.length >= 6);
});

test("G1-Kontrollen bestätigen den synthetischen Vertrag und halten Außenwirkung gesperrt", () => {
  const state = createSeedState();
  const evaluation = evaluateG1Controls(state, { mode: "sqlite" });
  assert.equal(evaluation.checks.syntheticContract, true);
  assert.equal(evaluation.checks.invalidMailOnly, true);
  assert.equal(evaluation.checks.adaptersLocked, true);
  assert.equal(state.meta.realDataEnabled, false);
  assert.equal(state.meta.outboundEnabled, false);
});

test("PO-CRM-043 protokolliert vier Fachbeschlüsse ohne G1-10-Freigabe", () => {
  const state = createSeedState();
  const readiness = buildG1GateEvaluation(state, { mode: "sqlite" });
  assert.equal(g1ProductOwnerDecisionContract.reference, "PO-CRM-043");
  assert.deepEqual(g1ProductOwnerDecisionContract.gateIds, ["G1-01", "G1-05", "G1-07", "G1-09"]);
  for (const id of g1ProductOwnerDecisionContract.gateIds) assert.equal(readiness.gates.find((gate) => gate.id === id).status, "po_decided_local");
  assert.equal(readiness.gates.find((gate) => gate.id === "G1-10").status, "po_blocked");
  assert.equal(state.g1Governance.productOwnerDecision.releaseDecision, "no_go");
  assert.equal(readiness.releaseEligible, false);
});

test("G1-Kontrollsuite erzeugt sechs synthetische Nachweise ohne Freigabe", () => {
  const result = runG1SyntheticControlSuite(createSeedState(), "2026-10-13T14:00:00.000Z");
  assert.equal(result.runs.length, 6);
  assert.ok(result.runs.every((run) => run.result === "passed"));
  assert.equal(result.state.g1Governance.status, "no_go");
  assert.equal(result.state.g1Governance.releaseEligible, false);
  assert.equal(result.state.g1Governance.realDataEnabled, false);
  assert.equal(result.state.meta.realDataEnabled, false);
  assert.equal(result.state.meta.outboundEnabled, false);
  assert.ok(result.state.auditEvents.some((event) => event.action === "g1_synthetic_control_suite"));
});

test("G1-03 trennt Quellenpfade, Informationspflichten und externe Freigabe", () => {
  const state = createSeedState();
  const evaluation = evaluateG1Controls(state, { mode: "sqlite" });
  assert.equal(g1SourcePurposeChannelMatrix.length, 7);
  assert.equal(g1InformationDutyArtifacts.length, 4);
  assert.ok(g1SourcePurposeChannelMatrix.some((item) => item.id === "protected_platform" && item.contactDecision === "blocked"));
  assert.equal(evaluation.checks.legalMatrixStructured, true);
  assert.equal(evaluation.checks.informationDutyStructured, true);
  assert.equal(evaluation.checks.productiveContactLocked, true);
});

test("G1-06 belegt nur lokale Grenzen und lässt produktiven Zugriff gesperrt", () => {
  const state = createSeedState();
  const evaluation = evaluateG1Controls(state, { mode: "sqlite" });
  assert.equal(g1AccessAssuranceControls.filter((item) => item.status === "verified_local").length, 8);
  assert.equal(g1AccessAssuranceControls.find((item) => item.id === "application_firewall").status, "observed_blocker");
  assert.equal(state.g1Governance.localEnvironmentEvidence.applicationFirewall, "system_profiler_allow_all_socketfilter_state_0_blocked");
  assert.equal(state.g1Governance.localEnvironmentEvidence.screenLock, "300_seconds_password_immediate_verified");
  assert.equal(state.g1Governance.c1Readiness.status, "partial_decision_recorded");
  assert.equal(state.g1Governance.c1Readiness.budget.hardCapMonthly, 100);
  assert.equal(state.g1Governance.c1Readiness.providerDecision, "pending_explicit_choice");
  assert.equal(state.g1Governance.c1Readiness.gateClosurePackageStatus, "prepared_for_external_review_and_explicit_decision");
  assert.equal(state.g1Governance.c1Readiness.securityReviewPackagePrepared, true);
  assert.equal(evaluation.checks.localAccessConstraints, true);
  assert.equal(evaluation.checks.productiveAccessLocked, true);
  assert.equal(state.g1Governance.accessAssurance.authenticationImplemented, false);
  assert.equal(state.g1Governance.accessAssurance.productiveAccessAllowed, false);
});

test("lokale Trockenläufe schließen Rechts-, Zugriffsschutz- und Freigabegate nicht", () => {
  const exercised = runG1SyntheticControlSuite(createSeedState(), "2026-10-13T14:00:00.000Z").state;
  const readiness = buildG1GateEvaluation(exercised, { mode: "sqlite" });
  assert.equal(readiness.gates.find((gate) => gate.id === "G1-03").status, "external_blocked");
  assert.equal(readiness.gates.find((gate) => gate.id === "G1-06").status, "technical_blocked");
  assert.equal(readiness.gates.find((gate) => gate.id === "G1-10").status, "po_blocked");
  assert.equal(readiness.releaseEligible, false);
});

test("isolierter Restore-Nachweis schärft G1-07, erteilt aber keine Freigabe", () => {
  const state = createSeedState();
  state.g1Governance.controlRuns.unshift({ id: "g1-run-restore-test", kind: "restore_drill", label: "Isolierte Wiederherstellungsprobe", result: "passed", evidence: "synthetisch", executedAt: "2026-10-13T15:00:00.000Z" });
  const evaluation = evaluateG1Controls(state, { mode: "sqlite" });
  const readiness = buildG1GateEvaluation(state, { mode: "sqlite" });
  assert.equal(evaluation.checks.restoreExercise, true);
  assert.equal(readiness.gates.find((gate) => gate.id === "G1-07").status, "po_decided_local");
  assert.match(readiness.gates.find((gate) => gate.id === "G1-07").detail, /isolierte synthetische Wiederherstellungsprobe/);
  assert.equal(readiness.releaseEligible, false);
});
