import { contactName, contactRestriction } from "./crmDomain.js";

export const outreachReadinessContract = Object.freeze({
  version: "r3.5-local-operational-readiness-v1",
  syntheticOnly: true,
  productiveSend: false,
  externalResearch: false,
  externalConnector: false,
  externalAI: false,
  humanApprovalRequired: true,
  legalClearanceClaimed: false,
});

const active = (items = []) => items.filter((item) => !item.archivedAt);

export function buildContactabilityDecision(data, contactId) {
  const contact = active(data.contacts).find((item) => item.id === contactId);
  const restriction = contactRestriction(contact);
  const suppressed = active(data.suppressionEntries).some((item) => item.contactId === contactId);
  const statusAllowed = Boolean(contact && contact.contactStatus === "active" && !restriction.blocked && !suppressed);
  const legalStatusDocumented = ["documented", "not_required_review"].includes(contact?.consentStatus);
  const sourceDocumented = Boolean(contact?.sourceType && contact?.sourceUrl && contact?.researchedAt);
  const verificationDocumented = Boolean(contact?.lastVerifiedAt);
  const informationStatusDocumented = Boolean(contact?.informationNoticeAt);
  const syntheticBoundary = Boolean(contact?.synthetic && String(contact?.email || "").endsWith(".invalid"));

  const checks = [
    { id: "contact_status", label: "Kontaktstatus", met: statusAllowed, detail: restriction.blocked ? restriction.reason : "Aktiv und nicht lokal gesperrt." },
    { id: "legal_status", label: "Kontakt- und Rechtsstatus", met: legalStatusDocumented, detail: legalStatusDocumented ? "Dokumentiert oder gesondert geprüft markiert." : "Status ist offen; keine Außenaktion freigegeben." },
    { id: "source", label: "Datenherkunft", met: sourceDocumented, detail: sourceDocumented ? `${contact.sourceType} · ${contact.researchedAt}` : "Quelle und Recherchezeitpunkt vervollständigen." },
    { id: "verification", label: "Letzte Prüfung", met: verificationDocumented, detail: verificationDocumented ? `Geprüft am ${contact.lastVerifiedAt}.` : "Aktualität ist nicht dokumentiert." },
    { id: "information_notice", label: "Informationsstatus", met: informationStatusDocumented, detail: informationStatusDocumented ? `Dokumentiert am ${contact.informationNoticeAt}.` : "Informationsstatus ist noch offen." },
    { id: "synthetic_boundary", label: "Synthetische Schutzgrenze", met: syntheticBoundary, detail: syntheticBoundary ? "Nur .invalid-Demodaten; kein realer Versandweg." : "Datensatz verletzt die lokale Synthetikgrenze." },
  ];

  const blocked = restriction.blocked || suppressed || !contact || !syntheticBoundary;
  const reviewRequired = !blocked && checks.some((item) => !item.met);
  const state = blocked ? "blocked" : reviewRequired ? "review_required" : "locally_ready";
  const answer = state === "blocked" ? "Nein – lokal gesperrt" : state === "review_required" ? "Prüfung erforderlich" : "Nur lokal vorbereitet";

  return {
    contactId: contact?.id || contactId || "",
    contactName: contactName(contact),
    organizationId: contact?.organizationId || "",
    state,
    answer,
    summary: state === "blocked"
      ? "Mindestens eine harte lokale Sperre verhindert die Freigabe."
      : state === "review_required"
        ? "Offene Nachweise müssen vor jeder späteren Außenaktion geschlossen werden."
        : "Die lokale Dokumentation ist vollständig; produktiver Versand bleibt trotzdem gesperrt.",
    checks,
    missingEvidence: checks.filter((item) => !item.met),
    productiveSendAllowed: false,
  };
}

export function buildOutreachPreflight(data, draftId) {
  const draft = active(data.outreachDrafts).find((item) => item.id === draftId);
  const contactability = buildContactabilityDecision(data, draft?.contactId);
  const adapter = data.providerAdapters?.find((item) => item.id === draft?.providerAdapterId);
  const draftComplete = Boolean(draft?.purpose && draft?.channel && draft?.subject && draft?.body);
  const reviewDocumented = Boolean(draft?.legalReviewNote);
  const locallyApproved = draft?.status === "approved_local";
  const adapterLocked = !adapter || adapter.status === "disabled" || adapter.externalWritesAllowed === false;
  const checks = [
    { id: "contactability", label: "Kontaktentscheidung", met: contactability.state === "locally_ready", detail: contactability.answer },
    { id: "draft", label: "Entwurf vollständig", met: draftComplete, detail: draftComplete ? "Zweck, Kanal, Betreff und Text sind vorhanden." : "Pflichtangaben des Entwurfs fehlen." },
    { id: "review_note", label: "Kanalprüfung dokumentiert", met: reviewDocumented, detail: reviewDocumented ? "Prüfnotiz vorhanden; sie ersetzt keine rechtliche Freigabe." : "Prüfnotiz fehlt." },
    { id: "local_approval", label: "Menschliche lokale Freigabe", met: locallyApproved, detail: locallyApproved ? "Lokal geprüft markiert." : "Lokale Freigabe steht aus." },
    { id: "provider_lock", label: "Versandsperre", met: adapterLocked, detail: "Provider und externe Schreibwege bleiben deaktiviert." },
  ];
  const state = contactability.state === "blocked" || draft?.status === "blocked"
    ? "blocked"
    : checks.slice(0, 4).every((item) => item.met) ? "locally_ready" : "review_required";

  return {
    draftId: draft?.id || draftId || "",
    contactId: draft?.contactId || "",
    organizationId: draft?.organizationId || contactability.organizationId,
    state,
    label: state === "blocked" ? "Gesperrt" : state === "locally_ready" ? "Lokal prüfbereit" : "Prüfung offen",
    checks,
    missingEvidence: checks.slice(0, 4).filter((item) => !item.met),
    productiveSendAllowed: false,
    providerStatus: adapter?.label || "Kein Provider verbunden",
  };
}

export function buildOperationalSignals(data, opportunityId = "") {
  const opportunity = active(data.opportunities).find((item) => item.id === opportunityId)
    || active(data.opportunities).find((item) => item.primaryContactId);
  if (!opportunity) return [];
  const contact = active(data.contacts).find((item) => item.id === opportunity.primaryContactId);
  const organization = active(data.organizations).find((item) => item.id === opportunity.organizationId);
  const draft = active(data.outreachDrafts).find((item) => item.contactId === contact?.id);
  const contactability = buildContactabilityDecision(data, contact?.id);
  const preflight = draft ? buildOutreachPreflight(data, draft.id) : null;
  const signals = [];
  const context = {
    opportunityId: opportunity.id,
    organizationId: opportunity.organizationId,
    contactId: contact?.id || "",
    organization: organization?.displayName || "Nicht zugeordnet",
    ownerId: opportunity.ownerId || "usr-za",
  };

  if (contactability.missingEvidence.some((item) => item.id === "legal_status")) {
    signals.push(makeSignal("contact-basis", "Kontaktgrundlage klären", "Kontakt- und Rechtsstatus fachlich prüfen und den synthetischen Nachweis dokumentieren.", "high", context));
  }
  const sourceGaps = contactability.missingEvidence.filter((item) => ["source", "verification", "information_notice"].includes(item.id));
  if (sourceGaps.length) {
    signals.push(makeSignal("source-evidence", "Datenqualität und Informationsstatus prüfen", sourceGaps.map((item) => item.label).join(", ") + " sind offen.", "medium", context));
  }
  if (!String(opportunity.decisionRole || "").trim()) {
    signals.push(makeSignal("decision-role", "Entscheiderrolle verifizieren", "Offene Entscheidungsfrage aus dem Decision Brief in einen nachverfolgbaren Arbeitsschritt überführen.", "high", context));
  }
  if (draft && preflight?.state !== "locally_ready") {
    signals.push(makeSignal("outreach-preflight", "Outreach-Entwurf fachlich prüfen", `${preflight.missingEvidence.length} Preflight-Nachweise sind offen; produktiver Versand bleibt gesperrt.`, "medium", context, draft.id));
  }

  return signals.map((signal) => {
    const existingTask = active(data.tasks).find((task) => task.readinessKey === signal.readinessKey);
    return { ...signal, existingTaskId: existingTask?.id || "", existingTaskStatus: existingTask?.status || "" };
  });
}

export function buildFutureGatePreparation(data) {
  const contactDecisions = active(data.contacts).map((contact) => buildContactabilityDecision(data, contact.id));
  return [
    { id: "real_data", label: "Reale Daten", status: "Nicht freigegeben", detail: `${contactDecisions.filter((item) => item.state !== "locally_ready").length} von ${contactDecisions.length} Kontaktprüfungen sind offen; Datenschutz- und Sicherheitsgate fehlt.` },
    { id: "individual_send", label: "Einzelversand", status: "Nicht freigegeben", detail: "Kein authentifizierter Provider, keine operative Rechtsfreigabe und kein Sendelog vorhanden." },
    { id: "live_research", label: "Live Research", status: "Nicht freigegeben", detail: "Nur fachliche Kriterien vorbereitet; Quellen-, Nutzungsbedingungen- und Datenschutzprüfung stehen aus." },
  ];
}

function makeSignal(kind, title, detail, priority, context, draftId = "") {
  return {
    id: `readiness-${context.opportunityId}-${kind}`,
    readinessKey: `r3.5:${context.opportunityId}:${kind}`,
    kind,
    title,
    detail,
    priority,
    dueDate: priority === "high" ? "2026-10-13" : "2026-10-15",
    draftId,
    ...context,
  };
}
