import { contactName, normalizeText, organizationName, pipelineStages } from "./crmDomain.js";

export const decisionIntelligenceContract = Object.freeze({
  version: "r3.4-local-rule-simulation-v1",
  mode: "local_rule_simulation",
  externalModel: false,
  externalDataTransfer: false,
  humanApprovalRequired: true,
  autonomousWrites: false,
  purpose: "Prioritäten und Entscheidungsentwürfe nachvollziehbar aus dem lokalen synthetischen CRM-Zustand ableiten.",
});

const DAY_MS = 86400000;
const priorityWeight = { high: 30, medium: 18, low: 8 };

function atNoon(value) {
  return new Date(`${String(value).slice(0, 10)}T12:00:00`).getTime();
}

export function daysBetween(from, to) {
  if (!from || !to) return 0;
  return Math.max(0, Math.floor((atNoon(to) - atNoon(from)) / DAY_MS));
}

export function demoToday(data) {
  return data?.meta?.demoDate || "2026-10-10";
}

export function latestOpportunityActivity(data, opportunityId) {
  return (data.activities || [])
    .filter((activity) => !activity.archivedAt && activity.opportunityId === opportunityId)
    .map((activity) => String(activity.occurredAt || "").slice(0, 10))
    .filter(Boolean)
    .sort()
    .at(-1) || "";
}

export function opportunityIdleDays(data, opportunity, today = demoToday(data)) {
  const reference = latestOpportunityActivity(data, opportunity.id) || String(opportunity.updatedAt || opportunity.createdAt).slice(0, 10);
  return daysBetween(reference, today);
}

function dueDistance(value, today) {
  if (!value) return 999;
  return Math.floor((atNoon(value) - atNoon(today)) / DAY_MS);
}

function activeOffer(data, opportunityId) {
  return (data.offers || []).find((offer) => !offer.archivedAt && offer.opportunityId === opportunityId && !["accepted", "rejected", "expired"].includes(offer.status));
}

function focusScore(data, opportunity, today) {
  const due = dueDistance(opportunity.nextActionDue, today);
  const idle = opportunityIdleDays(data, opportunity, today);
  const offer = activeOffer(data, opportunity.id);
  let score = priorityWeight[opportunity.priority] || 0;
  if (due < 0) score += 45;
  else if (due === 0) score += 38;
  else if (due <= 3) score += 25;
  else if (due <= 7) score += 12;
  if (idle >= 30) score += 30;
  else if (idle >= 14) score += 20;
  else if (idle >= 7) score += 8;
  if (["proposal", "decision"].includes(opportunity.stageId)) score += 12;
  if (offer && dueDistance(offer.validUntil, today) <= 7) score += 18;
  if (!opportunity.decisionRole && ["scoping", "proposal", "decision"].includes(opportunity.stageId)) score += 8;
  return score;
}

function focusReason(data, opportunity, today) {
  const idle = opportunityIdleDays(data, opportunity, today);
  const offer = activeOffer(data, opportunity.id);
  if (offer) {
    const remaining = Math.max(0, dueDistance(offer.validUntil, today));
    return `Angebot läuft in ${remaining} ${remaining === 1 ? "Tag" : "Tagen"} ab`;
  }
  if (idle >= Number(data.agingRules?.opportunityInactivityDays || 14)) {
    return `${formatCurrency(opportunity.potential)} Potenzial · ${idle} Tage ohne Fortschritt`;
  }
  if (!opportunity.decisionRole && ["scoping", "proposal"].includes(opportunity.stageId)) return "Bedarf bestätigt · Entscheider noch offen";
  return opportunity.note || opportunity.nextAction;
}

function focusActionLabel(index) {
  return ["Briefing öffnen", "Chance prüfen", "Entscheidung öffnen"][index] || "Vorgang öffnen";
}

export function buildFounderFocus(data, today = demoToday(data), limit = 3) {
  return (data.opportunities || [])
    .filter((opportunity) => !opportunity.archivedAt && !["won", "lost"].includes(opportunity.stageId))
    .map((opportunity) => ({
      opportunity,
      score: focusScore(data, opportunity, today),
      due: dueDistance(opportunity.nextActionDue, today),
      reason: focusReason(data, opportunity, today),
    }))
    .sort((a, b) => a.due - b.due || b.score - a.score || b.opportunity.potential - a.opportunity.potential)
    .slice(0, limit)
    .map((entry, index) => ({
      rank: index + 1,
      opportunityId: entry.opportunity.id,
      title: entry.opportunity.nextAction,
      organization: organizationName(data, entry.opportunity.organizationId),
      reason: entry.reason,
      actionLabel: focusActionLabel(index),
      score: entry.score,
    }));
}

export function buildOpportunityReadiness(data, opportunity) {
  const primaryContact = data.contacts.find((contact) => contact.id === opportunity.primaryContactId && !contact.archivedAt);
  const dimensions = [
    { id: "need", label: "Bedarf bestätigt", met: Boolean(String(opportunity.needSummary || "").trim()) },
    { id: "contact", label: "Schlüsselkontakt vorhanden", met: Boolean(primaryContact) },
    { id: "decision", label: "Entscheider bekannt", met: Boolean(String(opportunity.decisionRole || "").trim()) },
    { id: "scope", label: "Leistungsrahmen geklärt", met: Boolean(String(opportunity.scopeSummary || "").trim()) },
    { id: "next", label: "Nächste Handlung terminiert", met: Boolean(opportunity.nextAction && opportunity.nextActionDue) },
    { id: "questions", label: "Offene Fragen dokumentiert", met: Boolean(String(opportunity.openQuestions || "").trim()) },
  ];
  const metCount = dimensions.filter((item) => item.met).length;
  const score = Math.round((metCount / dimensions.length) * 100);
  const level = score >= 84 ? "hoch" : score >= 55 ? "mittel" : "niedrig";
  return { score, level, dimensions };
}

export function buildDecisionBrief(data, opportunityId) {
  const opportunity = data.opportunities.find((item) => item.id === opportunityId);
  if (!opportunity) return null;
  const contact = data.contacts.find((item) => item.id === opportunity.primaryContactId);
  const readiness = buildOpportunityReadiness(data, opportunity);
  const confirmed = opportunity.needSummary || "Noch kein belastbarer Bedarf dokumentiert.";
  const assumption = opportunity.potential > 0
    ? `${formatCurrency(opportunity.potential)} Potenzial ist ein lokaler Planungswert und noch keine bestätigte Beauftragung.`
    : "Ein wirtschaftlicher Rahmen ist noch nicht dokumentiert.";
  const question = opportunity.decisionRole
    ? `Welche Evidenz benötigt ${opportunity.decisionRole} für die nächste Entscheidung?`
    : "Wer ist finaler Entscheider und wie verläuft der interne Freigabeweg?";
  const recommendation = readiness.dimensions.find((item) => !item.met)?.id === "decision"
    ? `${opportunity.nextAction} und Entscheiderrolle verifizieren.`
    : opportunity.nextAction;
  return {
    opportunityId,
    organization: organizationName(data, opportunity.organizationId),
    contact: contactName(contact),
    readiness,
    entries: [
      { kind: "confirmed", label: "Bestätigt", text: confirmed },
      { kind: "assumption", label: "Annahme", text: assumption },
      { kind: "question", label: "Offene Frage", text: question },
      { kind: "recommendation", label: "Empfehlung", text: recommendation },
    ],
    provenance: "Lokale regelbasierte Assistenzsimulation · keine externe KI",
  };
}

export function buildPipelineMovement(data, periodDays = 30) {
  const active = (data.opportunities || []).filter((item) => !item.archivedAt && item.stageId !== "lost");
  const movements = (data.activities || []).filter((activity) => !activity.archivedAt && activity.type === "stage_change");
  return pipelineStages.filter((stage) => stage.id !== "lost").map((stage) => ({
    ...stage,
    count: active.filter((item) => item.stageId === stage.id).length,
    movements: movements.filter((activity) => normalizeText(activity.summary).includes(normalizeText(stage.label))).length,
    periodDays,
  }));
}

export function buildAgingStrip(data, today = demoToday(data)) {
  const opportunities = (data.opportunities || []).filter((item) => !item.archivedAt && !["won", "lost"].includes(item.stageId));
  const buckets = [
    { id: "fresh", label: "0–7 Tage", min: 0, max: 7 },
    { id: "watch", label: "8–14 Tage", min: 8, max: 14 },
    { id: "attention", label: "15–30 Tage", min: 15, max: 30 },
    { id: "critical", label: ">30 Tage", min: 31, max: Infinity },
  ];
  return buckets.map((bucket) => ({
    ...bucket,
    items: opportunities
      .map((opportunity) => ({ opportunityId: opportunity.id, organization: organizationName(data, opportunity.organizationId), days: opportunityIdleDays(data, opportunity, today) }))
      .filter((item) => item.days >= bucket.min && item.days <= bucket.max)
      .sort((a, b) => b.days - a.days),
  }));
}

export function buildRelationshipField(data, opportunityId) {
  const opportunity = data.opportunities.find((item) => item.id === opportunityId);
  if (!opportunity) return [];
  const organization = data.organizations.find((item) => item.id === opportunity.organizationId);
  const contact = data.contacts.find((item) => item.id === opportunity.primaryContactId);
  const partner = data.partnerOrganizations.find((item) => !item.archivedAt && item.relationshipStatus === "qualified") || data.partnerOrganizations.find((item) => !item.archivedAt);
  return [
    { kind: "organization", label: "Organisation", value: organization?.displayName || "Nicht zugeordnet", detail: `${organization?.region || "Region offen"} · ${organization?.sector || "Segment offen"}`, type: "organizations", id: organization?.id },
    { kind: "contact", label: "Schlüsselkontakt", value: contactName(contact), detail: contact?.role || "Rolle offen", type: "contacts", id: contact?.id },
    { kind: "department", label: "Fachbereich", value: opportunity.scopeSummary ? "Personalmanagement" : "Noch zu klären", detail: opportunity.scopeSummary || "Fachlicher Bereich ist noch offen." },
    { kind: "decision", label: "Entscheider", value: opportunity.decisionRole || "Offen", detail: opportunity.decisionRole ? opportunity.decisionPath || "Entscheidungspfad dokumentiert" : "Ziel: Entscheiderrolle und Freigabeweg bestätigen" },
    { kind: "partner", label: "Partner", value: partner?.displayName || "Kein Partner zugeordnet", detail: partner ? `${partner.category} · ${partner.relationshipStatus === "qualified" ? "qualifiziert" : "in Prüfung"}` : "Partnerbezug offen", type: partner ? "partnerOrganizations" : undefined, id: partner?.id },
  ];
}

export function buildDataConfidence(data, opportunityId) {
  const opportunity = data.opportunities.find((item) => item.id === opportunityId);
  if (!opportunity) return [];
  const organization = data.organizations.find((item) => item.id === opportunity.organizationId);
  const contact = data.contacts.find((item) => item.id === opportunity.primaryContactId);
  const completenessFields = [opportunity.needSummary, opportunity.primaryContactId, opportunity.nextAction, opportunity.nextActionDue, opportunity.scopeSummary, opportunity.openQuestions, opportunity.decisionRole];
  const completeness = Math.round((completenessFields.filter((value) => String(value || "").trim()).length / completenessFields.length) * 100);
  const duplicateOrganizations = data.organizations.filter((item) => item.id !== organization?.id && !item.archivedAt && normalizeText(item.displayName) === normalizeText(organization?.displayName)).length;
  const verifiedAt = contact?.lastVerifiedAt || String(opportunity.updatedAt || opportunity.createdAt).slice(0, 10);
  const age = daysBetween(verifiedAt, demoToday(data));
  return [
    { id: "source", label: "Quelle", status: opportunity.sourceLabel ? "Dokumentiert" : "Offen", detail: opportunity.sourceLabel || "Keine Quelle", tone: opportunity.sourceLabel ? "confirmed" : "attention" },
    { id: "freshness", label: "Aktualität", status: age <= 14 ? "Aktuell" : "Prüfen", detail: `Letzte Verifikation: ${formatDate(verifiedAt)}`, tone: age <= 14 ? "confirmed" : "warning" },
    { id: "completeness", label: "Vollständigkeit", status: completeness >= 85 ? "Hoch" : completeness >= 55 ? "Teilweise" : "Niedrig", detail: `${completeness} % der Entscheidungskriterien belegt`, tone: completeness >= 85 ? "confirmed" : "warning" },
    { id: "duplicates", label: "Dublettenrisiko", status: duplicateOrganizations ? "Prüfen" : "Gering", detail: duplicateOrganizations ? `${duplicateOrganizations} mögliche Übereinstimmung` : "Keine Namensübereinstimmung", tone: duplicateOrganizations ? "attention" : "confirmed" },
  ];
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return "offen";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${String(value).slice(0, 10)}T12:00:00`));
}
