import { buildAgingStrip, buildOpportunityReadiness, demoToday, daysBetween } from "./decisionIntelligence.js";
import { organizationName, pipelineStages } from "./crmDomain.js";
import { buildG1GateEvaluation } from "./g1Governance.js";

const DAY_MS = 86400000;

function dateValue(value) {
  const normalized = String(value || "").slice(0, 10);
  return normalized ? new Date(`${normalized}T12:00:00`).getTime() : 0;
}

function active(records = []) {
  return records.filter((item) => !item.archivedAt);
}

export function buildAnalytics(data, period = "30") {
  const today = demoToday(data);
  const periodDays = period === "all" ? Infinity : period === "quarter" ? 90 : 30;
  const cutoff = periodDays === Infinity ? 0 : dateValue(today) - (periodDays * DAY_MS);
  const opportunities = active(data.opportunities || []);
  const activeOpportunities = opportunities.filter((item) => !["won", "lost"].includes(item.stageId));
  const won = opportunities.filter((item) => item.stageId === "won");
  const lost = opportunities.filter((item) => item.stageId === "lost");
  const openTasks = active(data.tasks || []).filter((item) => item.status !== "completed");

  const pipeline = pipelineStages.map((stage) => {
    const items = opportunities.filter((item) => item.stageId === stage.id);
    return {
      ...stage,
      count: items.length,
      amount: items.reduce((sum, item) => sum + Number(item.potential || 0), 0),
    };
  });

  const sourceMap = new Map();
  activeOpportunities.forEach((item) => sourceMap.set(item.sourceLabel || "Ohne Quelle", (sourceMap.get(item.sourceLabel || "Ohne Quelle") || 0) + 1));
  const sources = [...sourceMap.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "de"));

  const eventCollections = [
    ["Aktivität", data.activities, "occurredAt"],
    ["Gespräch", data.conversations, "occurredAt"],
    ["Notiz", data.notes, "occurredAt"],
    ["Termin", data.appointments, "startsAt"],
    ["Aufgabe", data.tasks, "createdAt"],
  ];
  const datedEvents = eventCollections.flatMap(([type, records = [], field]) => active(records).map((item) => ({ type, date: String(item[field] || "").slice(0, 10) })))
    .filter((item) => item.date && dateValue(item.date) >= cutoff && dateValue(item.date) <= dateValue(today));
  const activityMap = new Map();
  datedEvents.forEach((item) => activityMap.set(item.date, (activityMap.get(item.date) || 0) + 1));
  const activityTrend = [...activityMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => ({ date, count }));

  const readiness = activeOpportunities.map((item) => buildOpportunityReadiness(data, item));
  const readinessMix = [
    { id: "high", label: "Hoch", count: readiness.filter((item) => item.level === "hoch").length },
    { id: "medium", label: "Mittel", count: readiness.filter((item) => item.level === "mittel").length },
    { id: "low", label: "Niedrig", count: readiness.filter((item) => item.level === "niedrig").length },
  ];
  const completeness = readiness.length ? Math.round(readiness.reduce((sum, item) => sum + item.score, 0) / readiness.length) : 0;
  const aging = buildAgingStrip(data, today).map((item) => ({ ...item, count: item.items.length }));
  const overdue = activeOpportunities.filter((item) => item.nextActionDue && dateValue(item.nextActionDue) < dateValue(today)).length;

  const roleCoverage = [
    { id: "decision", label: "Entscheider", count: activeOpportunities.filter((item) => String(item.decisionRole || "").trim()).length },
    { id: "contact", label: "Schlüsselkontakt", count: activeOpportunities.filter((item) => item.primaryContactId).length },
    { id: "scope", label: "Leistungsrahmen", count: activeOpportunities.filter((item) => String(item.scopeSummary || "").trim()).length },
    { id: "next", label: "Nächster Schritt", count: activeOpportunities.filter((item) => item.nextAction && item.nextActionDue).length },
  ].map((item) => ({ ...item, total: activeOpportunities.length, percent: activeOpportunities.length ? Math.round((item.count / activeOpportunities.length) * 100) : 0 }));

  const decisions = activeOpportunities
    .map((item) => ({
      id: item.id,
      organization: organizationName(data, item.organizationId),
      title: item.nextAction || item.title,
      reason: decisionReason(data, item, today),
      due: item.nextActionDue,
      urgency: item.nextActionDue && dateValue(item.nextActionDue) < dateValue(today) ? 2 : item.stageId === "decision" ? 1 : 0,
      potential: Number(item.potential || 0),
    }))
    .sort((a, b) => b.urgency - a.urgency || dateValue(a.due) - dateValue(b.due) || b.potential - a.potential)
    .slice(0, 3);

  const maxSource = Math.max(1, ...sources.map((item) => item.count));
  const maxActivity = Math.max(1, ...activityTrend.map((item) => item.count));

  return {
    period,
    today,
    metrics: {
      active: activeOpportunities.length,
      potential: activeOpportunities.reduce((sum, item) => sum + Number(item.potential || 0), 0),
      won: won.length,
      lost: lost.length,
      openTasks: openTasks.length,
      overdue,
      decisionReady: readinessMix.find((item) => item.id === "high")?.count || 0,
    },
    pipeline,
    statusMix: [
      { id: "active", label: "Aktiv", count: activeOpportunities.length },
      { id: "won", label: "Gewonnen", count: won.length },
      { id: "lost", label: "Verloren", count: lost.length },
    ],
    sources: sources.map((item) => ({ ...item, percent: Math.round((item.count / maxSource) * 100) })),
    activityTrend: activityTrend.map((item) => ({ ...item, percent: Math.round((item.count / maxActivity) * 100) })),
    readinessMix,
    completeness,
    aging,
    roleCoverage,
    decisions,
    evidence: {
      eventCount: datedEvents.length,
      opportunityCount: opportunities.length,
      generatedFrom: "Aktueller CRM-Datenstand",
    },
  };
}

function decisionReason(data, opportunity, today) {
  const days = opportunity.nextActionDue ? daysBetween(opportunity.nextActionDue, today) : 0;
  if (opportunity.nextActionDue && dateValue(opportunity.nextActionDue) < dateValue(today)) return `${days} Tage überfällig · ${formatMoney(opportunity.potential)} Potenzial`;
  if (opportunity.stageId === "decision") return `Entscheidungsphase · ${formatMoney(opportunity.potential)} Potenzial`;
  if (!opportunity.decisionRole && ["scoping", "proposal"].includes(opportunity.stageId)) return "Entscheiderrolle noch offen";
  return `${formatMoney(opportunity.potential)} Potenzial · nächster Schritt terminiert`;
}

export function buildG1Readiness(data, persistence) {
  return buildG1GateEvaluation(data, persistence);
}

export function formatMoney(value) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));
}
