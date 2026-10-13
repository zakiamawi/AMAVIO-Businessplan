const ROLE_DEFINITIONS = Object.freeze({
  operations: {
    id: "operations",
    group: "amavio",
    label: "AMAVIO Operations",
    scopeTitle: "Vollständige operative Fallsteuerung",
    scopeDescription: "Evidenz, Fachregeln, Abhängigkeiten, Simulationen, Entscheidungen und interne Arbeitsprodukte.",
    journey: ["Evidenz", "Verantwortung", "Simulation", "Entscheidung", "Arbeitsprodukt"],
  },
  employer_sponsor: {
    id: "employer_sponsor",
    group: "employer",
    label: "Arbeitgeber · Gesamtsteuerung",
    scopeTitle: "Bereichsübergreifende Steuerung und Entscheidungen",
    scopeDescription: "Gemeinsamer Status, zugewiesene bereichsübergreifende Entscheidungen und ihre Auswirkungen; keine interne AMAVIO-Fachlogik.",
    journey: ["Auftrag und Grundlage", "Verantwortung", "Auswirkungen", "Entscheidung", "Gemeinsamer Status"],
  },
  employer_hr: {
    id: "employer_hr",
    group: "employer",
    label: "Arbeitgeber · Personal & Onboarding",
    scopeTitle: "Personalbezogene Aufgaben und Startvorbereitung",
    scopeDescription: "Nur personalbezogene Fälle, Grundlagen und Aufgaben; keine Simulation oder interne Policy-Auswertung.",
    journey: ["Grundlagen", "Personalaufgaben", "Terminbezug", "Rückfragen", "Gemeinsamer Status"],
  },
  employer_location: {
    id: "employer_location",
    group: "employer",
    label: "Arbeitgeber · Standort & Übergabe",
    scopeTitle: "Lokale Zuständigkeit und Übergabeverantwortung",
    scopeDescription: "Nur standortbezogene Fälle, Übergaben und Bestätigungen; keine internen AMAVIO-Artefakte.",
    journey: ["Standortangaben", "Übergaben", "Termine", "Bestätigung", "Status"],
  },
  employer_budget: {
    id: "employer_budget",
    group: "employer",
    label: "Arbeitgeber · Budget & Freigaben",
    scopeTitle: "Kostenprüfung und begründete Freigaben",
    scopeDescription: "Nur budgetbezogene Fälle, Kostengrundlagen und menschliche Freigaben; keine operative Fallbearbeitung.",
    journey: ["Kostengrundlage", "Budgetaufgabe", "Auswirkung", "Freigabe", "Beschluss"],
  },
});

const INTERNAL_ACTIONS = Object.freeze([
  "case.transition", "simulation.create", "simulation.apply", "work_product.create", "evaluation.run",
  "capability.run", "kernel.read", "kernel.reconcile", "kernel.replan", "kernel.compose", "kernel.review",
  "provider.read", "legacy.run", "legacy.review", "legacy.preview",
]);

const roleMatchers = Object.freeze({
  employer_sponsor: /sponsor|gesamtsteuer|programmverantwort|geschäft|leitung/i,
  employer_hr: /hr|personal/i,
  employer_location: /standort|facility|wohn|übergabe/i,
  employer_budget: /budget|finanz|kosten|controlling/i,
});

function definition(session) {
  return ROLE_DEFINITIONS[session?.role] || ROLE_DEFINITIONS.operations;
}

function ownerMatches(session, ownerRole = "") {
  if (session?.role === "operations") return true;
  return Boolean(roleMatchers[session?.role]?.test(String(ownerRole)));
}

function evidenceMatches(session, item = {}) {
  if (session?.role === "operations") return true;
  if (session?.role === "employer_sponsor") return true;
  if (session?.role === "employer_hr") return /review|cohort|arrival|hr/i.test(`${item.type || item.evidence_type || ""} ${item.source || item.source_label || ""}`);
  if (session?.role === "employer_location") return /location|housing|handover|standort|wohn|übergabe/i.test(`${item.type || item.evidence_type || ""} ${item.label || ""}`);
  if (session?.role === "employer_budget") return /budget|cost|kosten|finanz/i.test(`${item.type || item.evidence_type || ""} ${item.label || ""}`);
  return false;
}

export function describeSession(session) {
  const role = definition(session);
  return {
    role: role.id,
    roleGroup: role.group,
    label: role.label,
    scopeTitle: role.scopeTitle,
    scopeDescription: role.scopeDescription,
    journey: role.journey,
    syntheticSession: true,
    productiveIdentity: false,
  };
}

export function allowedActionsFor(session) {
  if (session?.role === "operations") return [
    "case.read", "case.transition", "task.update", "evidence.review", "decision.review", "simulation.create", "simulation.apply",
    "work_product.create", "evaluation.run", "capability.run", "kernel.read", "kernel.reconcile", "kernel.replan", "kernel.compose",
    "kernel.review", "provider.read", "legacy.run", "legacy.review", "legacy.preview",
  ];
  const base = ["case.read"];
  if (["employer_hr", "employer_location", "employer_budget"].includes(session?.role)) base.push("task.update", "evidence.review");
  if (["employer_sponsor", "employer_budget"].includes(session?.role)) base.push("decision.review");
  return base;
}

export function canViewCase(detail, session) {
  if (!detail) return false;
  if (session?.role === "operations" || session?.role === "employer_sponsor") return true;
  if (ownerMatches(session, detail.case?.ownerRole)) return true;
  if ((detail.tasks || []).some((item) => ownerMatches(session, item.ownerRole))) return true;
  if ((detail.decisions || []).some((item) => ownerMatches(session, item.deciderRole))) return true;
  return (detail.evidence || []).some((item) => evidenceMatches(session, item));
}

export function projectPortfolio(items, session, loadDetail) {
  const role = definition(session);
  return items.flatMap((item) => {
    const detail = loadDetail(item.id);
    if (!canViewCase(detail, session)) return [];
    const ownedTask = detail.tasks.find((task) => ownerMatches(session, task.ownerRole) && task.status !== "completed");
    const ownedDecision = detail.decisions.find((decision) => ownerMatches(session, decision.deciderRole) && decision.status === "open");
    return [{
      ...item,
      nextTask: session.role === "operations" ? item.nextTask : (ownedTask?.title || ownedDecision?.question || "Kein Schritt für diese Rolle"),
      ownerRole: session.role === "operations" ? item.ownerRole : role.label,
      projection: role.id,
    }];
  });
}

export function projectCaseDetail(detail, session) {
  if (!detail || !canViewCase(detail, session)) return null;
  const role = definition(session);
  const operations = session.role === "operations";
  const sponsor = session.role === "employer_sponsor";
  const allowedActions = allowedActionsFor(session);
  if (operations) return {
    ...detail,
    access: { ...describeSession(session), allowedActions, projection: "full_internal" },
    tasks: detail.tasks.map((item) => ({ ...item, canUpdate: true })),
    evidence: detail.evidence.map((item) => ({ ...item, canReview: true })),
    decisions: detail.decisions.map((item) => ({ ...item, canReview: true })),
  };

  const tasks = detail.tasks.filter((item) => ownerMatches(session, item.ownerRole)).map((item) => ({ ...item, canUpdate: true }));
  const evidence = detail.evidence.filter((item) => sponsor || evidenceMatches(session, item)).map((item) => ({
    id: item.id,
    type: item.type,
    label: item.label,
    assertion: sponsor ? "Status und Abweichung sind für die Entscheidung der Gesamtsteuerung zusammengefasst." : item.assertion,
    source: sponsor ? "Projektion aus geprüften synthetischen Quellen" : item.source,
    validUntil: item.validUntil,
    reviewStatus: item.reviewStatus,
    reviewNote: null,
    conflictGroup: null,
    version: item.version,
    synthetic: true,
    canReview: !sponsor && evidenceMatches(session, item),
  }));
  const decisions = detail.decisions.filter((item) => ownerMatches(session, item.deciderRole)).map((item) => ({ ...item, requiredEvidence: [], canReview: true }));
  const milestones = detail.milestones.filter((item) => sponsor || ownerMatches(session, item.ownerRole)).map((item) => ({ ...item, detail: sponsor ? "Statusprojektion; interne Abhängigkeiten bleiben bei AMAVIO Operations." : item.detail }));
  const exceptions = sponsor ? detail.exceptions.map((item) => ({ id: item.id, title: item.title, severity: item.severity, impact: item.impact, status: item.status, playbook: "Intern durch AMAVIO geführt" })) : [];
  const sharedProducts = detail.workProducts.filter((item) => item.review_status === "approved" || item.reviewStatus === "approved");

  return {
    case: { ...detail.case, version: detail.case.version },
    milestones,
    dependencies: [],
    tasks,
    evidence,
    exceptions,
    decisions,
    decisionHistory: sponsor ? detail.decisionHistory.map((item) => ({ id: item.id, selectedOption: item.selectedOption, createdAt: item.createdAt })) : [],
    rules: [],
    simulations: sponsor ? detail.simulations.map((item) => ({ id: item.id, status: item.status, output: { summary: item.output?.summary || "Auswirkung intern geprüft." } })) : [],
    workProducts: sharedProducts,
    events: [],
    criticalPath: milestones.filter((item) => item.critical).map((item) => item.id),
    access: { ...describeSession(session), allowedActions, projection: "role_minimized" },
  };
}

function allow() { return { allowed: true }; }
function deny(session, action) {
  return { allowed: false, status: 403, code: "role_scope_denied", error: `${definition(session).label} darf die Aktion ${action} in dieser lokalen Konzeptdemo nicht ausführen.` };
}

export function authorizeRequest({ db, session, method, path }) {
  if (!session || session.role === "operations" || path === "/api/health") return allow();
  if (path.startsWith("/api/collaboration/v1/")) return allow();
  if (path.startsWith("/api/programs/v1/")) return allow();
  if (path.startsWith("/api/execution/v1/")) return allow();
  if (path.startsWith("/api/reliability/v1/")) return allow();
  if (method === "GET" && ["/api/v1.5/bootstrap", "/api/v1.5/portfolio"].includes(path)) return allow();
  if (method === "GET" && /^\/api\/v1\.5\/cases\/[^/]+$/.test(path)) return allow();
  if (path.startsWith("/api/learning/") || path.startsWith("/api/twin/") || path.startsWith("/api/kernel/") || path === "/api/v1.5/provider-status" || path.startsWith("/api/v1/")) return deny(session, "interne AMAVIO-Fachlogik");

  const taskMatch = method === "PATCH" && path.match(/^\/api\/v1\.5\/tasks\/([^/]+)$/);
  if (taskMatch) {
    const task = db.prepare("SELECT owner_role FROM case_tasks WHERE id=? AND tenant_id=?").get(decodeURIComponent(taskMatch[1]), session.tenantId);
    return task && ownerMatches(session, task.owner_role) ? allow() : deny(session, "fremde Aufgabe ändern");
  }
  const evidenceMatch = method === "POST" && path.match(/^\/api\/v1\.5\/evidence\/([^/]+)\/review$/);
  if (evidenceMatch) {
    const item = db.prepare("SELECT evidence_type,label,source_label FROM evidence_items WHERE id=? AND tenant_id=?").get(decodeURIComponent(evidenceMatch[1]), session.tenantId);
    return item && evidenceMatches(session, item) ? allow() : deny(session, "fremden oder internen Beleg prüfen");
  }
  const decisionMatch = method === "POST" && path.match(/^\/api\/v1\.5\/decisions\/([^/]+)\/review$/);
  if (decisionMatch) {
    const item = db.prepare("SELECT decider_role FROM decision_requests WHERE id=? AND tenant_id=?").get(decodeURIComponent(decisionMatch[1]), session.tenantId);
    return item && ownerMatches(session, item.decider_role) ? allow() : deny(session, "fremde Entscheidung treffen");
  }
  const requestedAction = INTERNAL_ACTIONS.find((action) => path.includes(action.split(".")[0])) || "nicht freigegebene Funktion";
  return deny(session, requestedAction);
}

export { ROLE_DEFINITIONS };
