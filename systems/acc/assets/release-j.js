(function () {
  "use strict";
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const state = { data: null, selected: null, filter: "open", evaluation: null, comparison: null, versions: [], saving: false };
  const statusLabels = { outcome_linked: "Ergebnis geklärt", outcome_missing: "Ergebnis offen", active: "im Einsatz", candidate: "zur Prüfung", candidate_reviewed: "fachlich geprüft", baseline: "aktueller Stand", disabled: "deaktiviert" };
  const severityLabels = { high: "hoch", medium: "mittel", low: "niedrig", positive: "positiv" };
  const eventLabels = { "SYN-TWIN-EVT-001": "Dokumentenprüfung", "SYN-TWIN-EVT-002": "Standortübergabe", "SYN-TWIN-EVT-003": "Ablaufplanung", "SYN-TWIN-EVT-004": "Terminprüfung", "SYN-TWIN-EVT-005": "Budgetprüfung" };
  const componentLabels = { policy_set: "Regelwerk", capability: "Ablauf-Neuplanung", local_engine: "Lokale Falllogik" };

  function idempotencyKey(prefix) {
    return globalThis.crypto?.randomUUID ? `${prefix}-${globalThis.crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function request(path, options = {}) {
    const method = options.method || "GET";
    const headers = { "x-demo-session": "demo-session-operations", ...(options.headers || {}) };
    if (!['GET', 'HEAD'].includes(method)) {
      headers["content-type"] = "application/json";
      headers["idempotency-key"] = options.idempotencyKey || idempotencyKey("learning");
    }
    const response = await fetch(path, { ...options, method, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return payload;
  }

  function toast(message, error = false) {
    const node = q("[data-learning-toast]");
    if (!node) return;
    node.textContent = message; node.classList.toggle("is-error", error); node.classList.add("is-visible");
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("is-visible"), 3800);
  }

  function renderLoop() {
    const loop = state.data.loop;
    const openOutcomes = Math.max(0, loop.feedback - loop.outcomesLinked);
    const items = [
      ["Rückmeldungen", loop.feedback, "dokumentiert", false],
      ["Noch offen", openOutcomes, openOutcomes === 1 ? "Ergebnis klären" : "Ergebnisse klären", openOutcomes > 0],
      ["Qualitätsstand", `${loop.qualityDimensions}/${loop.qualityDimensions}`, "Kriterien geprüft", false],
    ];
    q("[data-learning-loop]").innerHTML = items.map((item) => `<div class="learning-summary-item ${item[3] ? "is-gap" : ""}"><span>${escapeHtml(item[0])}</span><b>${escapeHtml(item[1])}</b><small>${escapeHtml(item[2])}</small></div>`).join("");
  }

  function visibleFeedback() {
    if (state.filter === "open") return state.data.feedback.filter((item) => item.status === "outcome_missing");
    if (state.filter === "linked") return state.data.feedback.filter((item) => item.status === "outcome_linked");
    return state.data.feedback;
  }

  function renderFeedbackList() {
    const items = visibleFeedback();
    q("[data-learning-feedback-count]").textContent = `${items.length} ${items.length === 1 ? "Eintrag" : "Einträge"}`;
    q("[data-learning-feedback-list]").innerHTML = items.map((item) => `<button type="button" class="learning-feedback-item ${item.status === "outcome_missing" ? "is-missing" : ""} ${state.selected?.id === item.id ? "is-active" : ""}" data-learning-feedback="${escapeHtml(item.id)}"><span class="learning-feedback-item-top"><b>${escapeHtml(item.title)}</b><span class="learning-feedback-severity">${escapeHtml(severityLabels[item.severity] || "Hinweis")}</span></span><p>${escapeHtml(eventLabels[item.relatedEventId] || "Operativer Fallbezug")}</p><small>${escapeHtml(statusLabels[item.status] || item.status)}</small></button>`).join("") || '<p class="twin-empty">In diesem Filter gibt es keine Rückmeldung.</p>';
    qa("[data-learning-feedback]").forEach((button) => button.addEventListener("click", () => selectFeedback(button.dataset.learningFeedback)));
  }

  function fillInspector() {
    const item = state.selected;
    q("[data-learning-title]").value = item?.title || "";
    q("[data-learning-observation]").value = item?.observation || "";
    q("[data-learning-expected]").value = item?.expectedOutcome || "";
    q("[data-learning-actual]").value = item?.actualOutcome || "";
    q("[data-learning-correction]").value = item?.correctionType || "evaluation_gap";
    q("[data-learning-feedback-status]").textContent = item?.id ? (statusLabels[item.status] || item.status) : "neue Beobachtung";
    q("[data-learning-save]").textContent = item?.status === "outcome_linked" ? "Änderung speichern" : "Ergebnis als geklärt speichern";
  }

  function selectFeedback(id) {
    state.selected = state.data.feedback.find((item) => item.id === id) || null;
    renderFeedbackList(); fillInspector();
  }

  function renderQuality() {
    const evaluation = state.evaluation;
    const result = evaluation?.result || state.comparison?.result;
    q("[data-learning-quality]").innerHTML = (result?.dimensions || []).map((item) => {
      const raw = item.rawDelta > 0 ? `+${item.rawDelta}` : String(item.rawDelta);
      return `<div class="learning-quality-row" role="row"><span><b>${escapeHtml(item.label)}</b></span><span class="learning-score"><b>${item.baseline}</b><span class="learning-score-bar"><i style="width:${Math.min(100, item.baseline)}%"></i></span></span><span class="learning-score"><b>${item.candidate}</b><span class="learning-score-bar"><i style="width:${Math.min(100, item.candidate)}%"></i></span></span><span class="learning-delta">${escapeHtml(raw)}</span><span class="learning-quality-status">${item.passed ? "stabil" : "prüfen"}</span></div>`;
    }).join("");
  }

  function renderVersions() {
    const visibleVersions = state.versions.filter((item) => item.type !== "provider_adapter");
    q("[data-learning-versions]").innerHTML = visibleVersions.map((item) => `<div class="learning-version-row" role="row"><span><b>${escapeHtml(componentLabels[item.type] || item.label)}</b></span><span><i class="learning-version-status ${escapeHtml(item.status)}">${escapeHtml(statusLabels[item.status] || item.status)}</i></span><span>${escapeHtml(item.type === "capability" ? "24 Prüffälle" : item.type === "local_engine" ? "lokale Basis" : item.basis)}</span><span>${item.quality === null ? "–" : `${item.quality} %`}</span><span class="learning-version-actions">${item.status === "candidate" ? `<button type="button" data-learning-candidate="${escapeHtml(item.id)}">Vorschlag prüfen</button>` : "–"}</span></div>`).join("");
    qa("[data-learning-open-compare]").forEach((button) => button.addEventListener("click", () => openComparison(false)));
    qa("[data-learning-candidate]").forEach((button) => button.addEventListener("click", () => { state.candidateId = button.dataset.learningCandidate; openComparison(false); }));
  }

  function comparisonResult() { return state.comparison?.result || state.evaluation?.result || {}; }

  function renderComparisonDrawer() {
    const comparison = state.comparison;
    const result = comparisonResult();
    q("[data-learning-comparison-id]").textContent = "lokale Prüfung";
    const dimensions = (result.dimensions || []).map((item) => `<div class="learning-compare-row"><span><b>${escapeHtml(item.label)}</b></span><span>${item.baseline}</span><span>${item.candidate}</span><span class="learning-delta">${item.rawDelta > 0 ? "+" : ""}${item.rawDelta}</span><span>${escapeHtml(item.interpretation)}</span></div>`).join("");
    const outcome = result.outcomeComparison || {};
    const changedRules = (result.policyDiff || []).filter((item) => item.status === "changed").length;
    q("[data-learning-comparison-content]").innerHTML = `
      <div class="learning-compare-versions"><div><b>Aktueller Stand</b><span>bewährte lokale Falllogik</span></div><div><b>Verbesserungsvorschlag</b><span>überarbeitete Ablauf-Neuplanung</span></div></div>
      <section class="learning-compare-section"><h3>Qualitätsvergleich</h3><div class="learning-compare-table"><div class="learning-compare-row head"><span>Kriterium</span><span>Aktuell</span><span>Vorschlag</span><span>Δ</span><span>Einordnung</span></div>${dimensions}</div></section>
      <section class="learning-compare-section"><h3>Ergebnisvergleich</h3><div class="learning-outcome-table"><div class="learning-outcome-row"><span>Kriterium</span><span>Aktuell</span><span>Vorschlag</span></div><div class="learning-outcome-row"><span>Tatsächliche Ergebnisse</span><span>${outcome.actualBaseline || 0}</span><span>${outcome.actualCandidate || 0}</span></div><div class="learning-outcome-row"><span>Übereinstimmung</span><span>${outcome.matchBaseline || 0} %</span><span>${outcome.matchCandidate || 0} %</span></div><div class="learning-outcome-row"><span>Manuelle Korrekturen</span><span>${outcome.operatorCorrectionsBaseline || 0}</span><span>${outcome.operatorCorrectionsCandidate || 0}</span></div></div></section>
      <section class="learning-change-summary"><h3>Was ändert sich fachlich?</h3><div><article><b>Auslöser</b><p>Neue Ereignisse werden früher in die Ablaufplanung übernommen.</p></article><article><b>Reihenfolge</b><p>Abhängige Aufgaben werden nachvollziehbar neu geordnet.</p></article><article><b>Begründung</b><p>${changedRules || 1} fachliche Anpassung${changedRules === 1 ? "" : "en"} wurde${changedRules === 1 ? "" : "n"} im Vergleich geprüft.</p></article></div></section>
      <div class="learning-drawer-gate"><b>Bewusste Freigabe</b><span>Die fachliche Prüfung aktiviert keine Änderung automatisch.</span></div>
      <form class="learning-decision-form" data-learning-decision-form><label>Begründung zur fachlichen Prüfung<textarea data-learning-rationale>Ergebnisqualität und Korrekturaufwand wurden anhand synthetischer Prüffälle bewertet.</textarea></label><div class="learning-decision-actions"><button type="button" class="secondary-action" data-learning-defer>Zurückstellen</button><button type="submit" class="primary-action" ${comparison?.decisionStatus !== "awaiting_human_review" ? "disabled" : ""}>${comparison?.decisionStatus === "advisory_approved" ? "Vorschlag fachlich geprüft" : "Vorschlag fachlich bestätigen"}</button></div></form>`;
    q("[data-learning-defer]")?.addEventListener("click", closeDrawer);
    q("[data-learning-decision-form]")?.addEventListener("submit", decideCandidate);
  }

  function openDrawer() { q("[data-learning-drawer]").hidden = false; renderComparisonDrawer(); }
  function closeDrawer() { q("[data-learning-drawer]").hidden = true; }

  async function openComparison(create = true) {
    try {
      if (create) {
        const payload = await request("/api/learning/v1/comparisons", { method: "POST", body: JSON.stringify({ evaluationId: state.evaluation?.id }) });
        state.comparison = payload.comparison;
        state.data.loop.openDecisions = 1;
        renderLoop();
      }
      openDrawer();
    } catch (error) { toast(error.message, true); }
  }

  async function runEvaluation() {
    const button = q("[data-learning-run]"); button.disabled = true; button.textContent = "Evaluation läuft …";
    try {
      const payload = await request("/api/learning/v1/evaluations", { method: "POST", body: "{}" });
      state.evaluation = payload.evaluation;
      renderQuality(); fillInspector();
      toast("Lokale Bewertung abgeschlossen. Es wurden keine externen Dienste genutzt.");
    } catch (error) { toast(error.message, true); }
    finally { button.disabled = false; button.textContent = "Bewertung aktualisieren"; }
  }

  async function saveFeedback(event) {
    event.preventDefault(); if (state.saving) return; state.saving = true;
    const body = {
      title: q("[data-learning-title]").value.trim(), observation: q("[data-learning-observation]").value.trim(), expectedOutcome: q("[data-learning-expected]").value.trim(), actualOutcome: q("[data-learning-actual]").value.trim(), correctionType: q("[data-learning-correction]").value,
      evidenceRefs: state.selected?.evidenceRefs || [], operatorNote: state.selected?.operatorNote || "", severity: state.selected?.severity || "medium", relatedEventId: state.selected?.relatedEventId || "",
      ...(state.selected?.id ? { version: state.selected.version } : {}),
    };
    try {
      const path = state.selected?.id ? `/api/learning/v1/feedback/${encodeURIComponent(state.selected.id)}` : "/api/learning/v1/feedback";
      const payload = await request(path, { method: state.selected?.id ? "PATCH" : "POST", body: JSON.stringify(body) });
      const index = state.data.feedback.findIndex((item) => item.id === payload.feedback.id);
      if (index >= 0) state.data.feedback[index] = payload.feedback; else state.data.feedback.push(payload.feedback);
      state.selected = payload.feedback;
      state.data.loop.feedback = state.data.feedback.length;
      state.data.loop.outcomesLinked = state.data.feedback.filter((item) => item.status === "outcome_linked").length;
      state.filter = "all";
      qa("[data-learning-filter]").forEach((item) => item.classList.toggle("is-active", item.dataset.learningFilter === "all"));
      renderLoop(); renderFeedbackList(); fillInspector();
      toast("Rückmeldung lokal gespeichert. Es wurde keine aktive Regel verändert.");
    } catch (error) { toast(error.message, true); }
    finally { state.saving = false; }
  }

  async function decideCandidate(event) {
    event.preventDefault();
    const candidate = state.versions.find((item) => item.status === "candidate");
    const rationale = q("[data-learning-rationale]").value.trim();
    if (!candidate) { toast("Kein offener Kandidat vorhanden.", true); return; }
    try {
      const payload = await request(`/api/learning/v1/versions/${encodeURIComponent(candidate.id)}/decisions`, { method: "POST", body: JSON.stringify({ comparisonId: state.comparison.id, rationale, version: candidate.reviewVersion }) });
      state.versions = state.versions.map((item) => item.id === payload.version.id ? payload.version : item);
      state.comparison = payload.comparison;
      state.data.loop.openDecisions = 0;
      renderLoop(); renderVersions(); renderComparisonDrawer();
      toast("Vorschlag fachlich geprüft. Er wurde nicht automatisch aktiviert.");
    } catch (error) { toast(error.message, true); }
  }

  function newFeedback() {
    state.selected = { id: null, title: "", observation: "", expectedOutcome: "", actualOutcome: "", correctionType: "evaluation_gap", evidenceRefs: [], operatorNote: "", severity: "medium", status: "outcome_missing" };
    renderFeedbackList(); fillInspector(); q("[data-learning-title]").focus();
  }

  async function bootstrap() {
    try {
      state.data = await request("/api/learning/v1/bootstrap");
      state.selected = state.data.feedback.find((item) => item.status === "outcome_missing") || state.data.selected;
      state.evaluation = state.data.evaluation;
      state.comparison = state.data.comparison;
      state.versions = state.data.versions;
      renderLoop(); renderFeedbackList(); fillInspector(); renderQuality(); renderVersions();
    } catch (error) { toast(error.message, true); }
  }

  qa("[data-learning-filter]").forEach((button) => button.addEventListener("click", () => { state.filter = button.dataset.learningFilter; qa("[data-learning-filter]").forEach((item) => item.classList.toggle("is-active", item === button)); renderFeedbackList(); }));
  q("[data-learning-new]")?.addEventListener("click", newFeedback);
  q("[data-learning-feedback-form]")?.addEventListener("submit", saveFeedback);
  q("[data-learning-run]")?.addEventListener("click", runEvaluation);
  q("[data-learning-compare]")?.addEventListener("click", () => openComparison(true));
  q("[data-learning-close]")?.addEventListener("click", closeDrawer);
  q("[data-learning-drawer]")?.addEventListener("click", (event) => { if (event.target === event.currentTarget) closeDrawer(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && q("[data-learning-drawer]") && !q("[data-learning-drawer]").hidden) closeDrawer(); });
  window.addEventListener("amavio:rolechange", (event) => { if (event.detail?.role === "employer" && ["learning", "learning-quality"].includes(document.body.dataset.page)) q('[data-page-target="operations"]')?.click(); });
  window.AMAVIO_OPERATIONAL_LEARNING = { getState: () => JSON.parse(JSON.stringify(state)), reload: bootstrap };
  bootstrap();
}());
