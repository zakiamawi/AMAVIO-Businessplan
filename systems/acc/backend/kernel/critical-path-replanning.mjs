import { CRITICAL_PATH_REPLAN_VERSION, assertSyntheticDetail, kernelError, stableHash } from "./contracts.mjs";

function shiftDate(value, days) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(from, to) {
  return Math.round((new Date(`${to}T00:00:00Z`) - new Date(`${from}T00:00:00Z`)) / 86_400_000);
}

export function replanCriticalPath(input, graph, event) {
  const detail = assertSyntheticDetail(input);
  const type = String(event?.type || "");
  const reason = String(event?.reason || "").trim();
  if (!reason) throw kernelError("Das Fallereignis benötigt eine fachliche Begründung.", "kernel_replan_reason_required", 400);
  let deltaDays = Number(event?.delayDays || 0);
  if (type === "arrival_date_changed") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(event?.effectiveDate || ""))) throw kernelError("Gültiges neues Anreisedatum erforderlich.", "kernel_replan_date_required", 400);
    deltaDays = daysBetween(detail.case.arrivalDate, event.effectiveDate);
  } else if (!new Set(["milestone_delayed", "owner_unavailable", "evidence_blocked"]).has(type)) {
    throw kernelError("Fallereignis ist für die lokale Neuplanung nicht freigegeben.", "kernel_replan_event_unknown", 400);
  }
  if (type !== "arrival_date_changed" && (!Number.isInteger(deltaDays) || deltaDays < 1 || deltaDays > 60)) {
    throw kernelError("Verzögerung muss zwischen 1 und 60 Tagen liegen.", "kernel_replan_delay_invalid", 400);
  }
  const affectedMilestones = new Set();
  if (type === "milestone_delayed") {
    const start = detail.milestones.find((item) => item.id === event.milestoneId);
    if (!start) throw kernelError("Betroffener Meilenstein wurde nicht gefunden.", "kernel_replan_milestone_not_found", 404);
    detail.milestones.filter((item) => item.sequence >= start.sequence).forEach((item) => affectedMilestones.add(item.id));
  } else {
    detail.milestones.forEach((item) => affectedMilestones.add(item.id));
  }
  const milestoneChanges = detail.milestones.filter((item) => affectedMilestones.has(item.id)).map((item) => ({
    entityType: "milestone", entityId: item.id, title: item.title, ownerRole: item.ownerRole,
    from: item.dueDate, to: shiftDate(item.dueDate, deltaDays), deltaDays,
    rationale: `${reason} · Abhängiger Termin im kritischen Pfad wird neu berechnet.`,
  }));
  const taskChanges = detail.tasks.filter((item) => {
    if (type === "owner_unavailable") return item.ownerRole === event.ownerRole && item.status !== "completed";
    return item.status !== "completed";
  }).map((item) => ({
    entityType: "task", entityId: item.id, title: item.title, ownerRole: item.ownerRole,
    from: item.dueDate, to: shiftDate(item.dueDate, deltaDays), deltaDays,
    rationale: `${reason} · Offene Aufgabe folgt der neu berechneten Zeitachse.`,
  }));
  const changedIds = new Set([...milestoneChanges, ...taskChanges].map((item) => item.entityId));
  const dependencyImpacts = detail.dependencies.filter((item) => changedIds.has(item.predecessorId) || changedIds.has(item.successorId)).map((item) => ({
    ...item,
    state: item.hard ? "human_review_required" : "observe",
    rationale: item.hard ? "Harte Abhängigkeit darf nur gemeinsam mit Vorgänger und Nachfolger bestätigt werden." : "Weiche Abhängigkeit bleibt beobachtbar.",
  }));
  const changes = [...milestoneChanges, ...taskChanges];
  const content = {
    contractVersion: CRITICAL_PATH_REPLAN_VERSION,
    caseId: detail.case.id,
    baseCaseVersion: detail.case.version,
    graphFingerprint: graph.fingerprint,
    event: { ...event, type, reason, deltaDays },
    summary: `${changes.length} Fristposition(en) lokal neu berechnet; ${dependencyImpacts.length} Abhängigkeit(en) fachlich begründet.`,
    proposal: {
      changes,
      dependencyImpacts,
      unchangedEntityIds: [...detail.milestones, ...detail.tasks].filter((item) => !changedIds.has(item.id)).map((item) => item.id),
      acceptanceCriteria: ["Basisversion ist beim Review unverändert.", "Jede harte Abhängigkeit ist menschlich geprüft.", "Verantwortung und neue Frist sind pro Änderung dokumentiert.", "Übernahme erfolgt ausschließlich über einen separaten Human Gate."],
      effectMode: "advisory_only",
    },
    boundaries: { originalMutated: false, automaticApply: false, externalEffect: false },
  };
  const quality = {
    rubric: "amavio.critical-path-replan-rubric.v1",
    changedEntityCount: changes.length,
    dependencyCoverageRatio: detail.dependencies.length ? Number((dependencyImpacts.length / detail.dependencies.length).toFixed(2)) : 1,
    rationaleCoverageRatio: changes.length ? Number((changes.filter((item) => item.rationale).length / changes.length).toFixed(2)) : 1,
    deterministic: true,
  };
  return { content, quality, inputHash: stableHash({ contractVersion: CRITICAL_PATH_REPLAN_VERSION, caseVersion: detail.case.version, graphFingerprint: graph.fingerprint, event: content.event }) };
}
