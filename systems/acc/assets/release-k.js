(function () {
  "use strict";

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const state = { programs: [], detail: null, selectedId: "", role: "admin", lens: "sponsor", loading: false };
  const statusLabels = { delivery_active: "In Lieferung", planning: "In Planung", intake: "In Aufnahme", completed: "Abgeschlossen", active: "Aktiv", blocked: "Klärung nötig", planned: "Vorbereitet", open: "Offen", reviewed: "Dokumentiert", awaiting_human_review: "Prüfung offen", advisory_approved: "Fachlich geprüft" };
  const journey = ["Programmrahmen", "Kohortenplanung", "Einreise & Wohnen", "Betriebliche Übergabe", "Ankunft & Arbeitsstart", "Outcome & Stabilisierung"];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  }
  function date(value) { return value ? new Intl.DateTimeFormat("de-DE").format(new Date(`${value}T12:00:00`)) : "–"; }
  function roleLabel(value) {
    return String(value || "")
      .replace(/Arbeitgeber[ -]+Sponsor/gi, "Arbeitgeber · Gesamtsteuerung")
      .replace(/Arbeitgeber[ -]+HR/gi, "Arbeitgeber · Personal & Onboarding")
      .replace(/Arbeitgeber[ -]+Standort/gi, "Arbeitgeber · Standort & Übergabe")
      .replace(/Arbeitgeber[ -]+Budget/gi, "Arbeitgeber · Budget & Freigaben");
  }
  function session() {
    if (state.role === "admin") return "demo-session-operations";
    return `demo-session-employer-${state.lens}`;
  }
  async function api(path, options = {}) {
    const headers = { "x-demo-session": session(), ...(options.headers || {}) };
    if (options.body) {
      headers["content-type"] = "application/json";
      headers["idempotency-key"] = `program-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    const response = await fetch(path, { ...options, headers, cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Der lokale Programmstand konnte nicht verarbeitet werden.");
    return payload;
  }
  function toast(message) {
    const node = q("[data-program-toast]");
    node.textContent = message; node.classList.add("show");
    window.clearTimeout(toast.timer); toast.timer = window.setTimeout(() => node.classList.remove("show"), 3600);
  }
  function renderRoleCopy() {
    const employer = state.role === "employer";
    q("[data-program-nav-label]").textContent = employer ? "Ankunftsprogramme" : "Programme";
    q("[data-program-kicker]").textContent = employer ? "Gemeinsamer Programmraum" : "Programmsteuerung";
    q("[data-program-title]").textContent = employer ? "Ankunftsprogramme" : "Ankunftsprogramme steuern";
    q("[data-program-intro]").textContent = employer ? "Verfolgen Sie vereinbarte Leistungen, Meilensteine und Verantwortungen und bearbeiten Sie die Beiträge Ihres Arbeitsbereichs." : "Von der Bedarfsklärung bis zum stabilisierten Arbeitsstart – als gemeinsamer, nachvollziehbarer Programmverlauf.";
    const areaLabel = state.lens === "hr" ? "Personal & Onboarding" : state.lens === "location" ? "Standort & Übergabe" : state.lens === "budget" ? "Budget & Freigaben" : "Gesamtsteuerung";
    q("[data-program-role-title]").textContent = employer ? `Ihr Arbeitsbereich · ${areaLabel}` : "AMAVIO Operations";
    q("[data-program-role-copy]").textContent = employer ? "Sie sehen den vereinbarten Programmstand und die Aufgaben Ihres Arbeitsbereichs. Interne AMAVIO-Analyse und technische Prüfprotokolle bleiben ausgeblendet." : "Sie koordinieren Programmstand, Abhängigkeiten und die nächsten Entscheidungen.";
  }
  function renderList() {
    q("[data-program-count]").textContent = state.programs.length;
    q("[data-program-index-count]").textContent = `${state.programs.length} aktiv`;
    q("[data-program-list]").innerHTML = state.programs.map((program) => `
      <button type="button" class="program-list-item${program.id === state.selectedId ? " active" : ""}" data-program-id="${program.id}" aria-current="${program.id === state.selectedId}">
        <span>${escapeHtml(program.sector)}</span><b>${escapeHtml(program.title)}</b><small>${escapeHtml(program.employer)} · Start ${date(program.employmentStart)}</small><em>${statusLabels[program.status] || program.status}</em>
      </button>`).join("");
    qa("[data-program-id]").forEach((button) => button.addEventListener("click", () => selectProgram(button.dataset.programId)));
  }
  function renderJourney(detail) {
    const completed = detail.sharedStatus.completed;
    const activeIndex = Math.min(5, Math.max(1, completed));
    q("[data-program-journey]").innerHTML = journey.map((label, index) => `<li class="${index < activeIndex ? "done" : index === activeIndex ? "current" : ""}"><span>${index + 1}</span><b>${label}</b><small>${index < activeIndex ? "Abgeschlossen" : index === activeIndex ? "Aktuell" : "Vorgemerkt"}</small></li>`).join("");
  }
  function renderWorkstreams(detail) {
    q("[data-program-workstreams]").innerHTML = detail.workstreams.length ? detail.workstreams.map((item) => `
      <article class="blueprint-row is-${item.status}">
        <span class="blueprint-sequence">${String(item.sequence).padStart(2, "0")}</span>
        <div><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.outcome)}</small></div>
        <div><span>Verantwortung</span><b>${escapeHtml(roleLabel(item.ownerRole))}</b></div>
        <div><span>Zeitraum</span><b>${date(item.startDate)} – ${date(item.endDate)}</b></div>
        <em>${statusLabels[item.status] || item.status}</em>
      </article>`).join("") : '<p class="program-empty">Für dieses synthetische Planungsprogramm sind die Arbeitspakete noch nicht ausgearbeitet.</p>';
  }
  function renderCapacity(detail) {
    const max = Math.max(1, ...detail.capacity.flatMap((item) => [item.planned, item.available]));
    q("[data-program-capacity]").innerHTML = detail.capacity.length ? detail.capacity.map((item) => `<div class="capacity-column"><div class="capacity-bars"><i style="height:${Math.round((item.available / max) * 100)}%" title="Kapazität ${item.available}"></i><b style="height:${Math.round((item.planned / max) * 100)}%" title="Geplant ${item.planned}"></b></div><span>${escapeHtml(item.period)}</span><small>${item.planned} geplant · ${item.available} verfügbar</small></div>`).join("") : '<p class="program-empty">Noch keine Kapazitätsplanung hinterlegt.</p>';
  }
  function decisionMarkup(item) {
    const canReview = state.role === "employer" && item.canReview;
    return `<article class="program-decision ${item.status === "open" ? "is-open" : ""}" data-decision-card="${item.id}">
      <span>${escapeHtml(roleLabel(item.deciderRole))} · bis ${date(item.dueDate)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.question)}</p>
      <small>Grundlage: ${item.basis.map(escapeHtml).join(" · ")}</small>
      ${canReview ? `<form data-program-decision-form="${item.id}" data-version="${item.version}"><label><span>Entscheidung</span><input data-decision-option value="Im synthetischen Programm bestätigen" /></label><label><span>Begründung</span><textarea rows="3" data-decision-rationale>Die Programmgrundlage wurde für die Arbeitgeberrolle geprüft und nachvollziehbar bestätigt.</textarea></label><button type="submit" class="primary-action">Entscheidung dokumentieren</button></form>` : `<em>${statusLabels[item.status] || item.status}</em>`}
    </article>`;
  }
  function renderDecisions(detail) {
    q("[data-program-decisions]").innerHTML = detail.decisions.length ? detail.decisions.map(decisionMarkup).join("") : '<p class="program-empty">Für diese Rolle ist aktuell keine Entscheidung offen.</p>';
    qa("[data-program-decision-form]").forEach((form) => form.addEventListener("submit", submitDecision));
  }
  function renderAdjustment(detail) {
    const item = detail.adjustments[0];
    q("[data-program-adjustment-output]").innerHTML = item ? `<article><span>${statusLabels[item.status] || item.status}</span><h4>${escapeHtml(item.trigger)}</h4><p>${escapeHtml(item.recommendation)}</p><dl><div><dt>Wirkung</dt><dd>${escapeHtml(item.impact)}</dd></div><div><dt>Betroffene Pakete</dt><dd>${item.affected.length}</dd></div><div><dt>Unsicherheit</dt><dd>${escapeHtml(item.uncertainties[0] || "Keine zusätzliche Angabe")}</dd></div></dl>${item.status === "awaiting_human_review" ? `<button type="button" class="secondary-action" data-review-adjustment="${item.id}" data-version="${item.version}">Fachlich prüfen</button>` : ""}</article>` : "<p>Noch keine Programmvariante berechnet.</p>";
    q("[data-review-adjustment]")?.addEventListener("click", reviewAdjustment);
  }
  function renderDetail() {
    const detail = state.detail; if (!detail) return;
    const participants = detail.cohorts.reduce((sum, item) => sum + item.participantCount, 0);
    const readiness = detail.cohorts.length ? Math.round(detail.cohorts.reduce((sum, item) => sum + item.readiness, 0) / detail.cohorts.length) : 0;
    q("[data-program-cohort-count]").textContent = detail.cohorts.length;
    q("[data-program-participant-count]").textContent = `${participants} synthetische Teilnehmende`;
    q("[data-program-decision-count]").textContent = detail.sharedStatus.openDecisions;
    q("[data-program-reference]").textContent = `${detail.program.id} · ${detail.program.sector}`;
    q("[data-program-name]").textContent = detail.program.title;
    q("[data-program-meta]").textContent = `${detail.program.employer} · Ankunft ${date(detail.program.arrivalWindow.start)}–${date(detail.program.arrivalWindow.end)} · Arbeitsstart ${date(detail.program.employmentStart)}`;
    q("[data-program-status]").textContent = statusLabels[detail.program.status] || detail.program.status;
    const completedWorkstreams = detail.workstreams.filter((item) => item.status === "completed").length;
    q("[data-program-readiness]").textContent = `${completedWorkstreams} von ${detail.workstreams.length} Arbeitspaketen abgeschlossen · ${detail.sharedStatus.blocked} Klärung offen`;
    renderJourney(detail); renderWorkstreams(detail); renderCapacity(detail); renderDecisions(detail); renderAdjustment(detail); renderList();
    window.dispatchEvent(new CustomEvent("amavio:program-rendered", { detail: { programId: detail.program.id, role: state.role, employerLens: state.lens } }));
  }
  async function selectProgram(id) {
    if (!id || state.loading) return; state.loading = true;
    try {
      state.detail = await api(`/api/programs/v1/programs/${encodeURIComponent(id)}`); state.selectedId = id;
      window.AMAVIO_NAVIGATION?.updateContext({ program: id }, { history: "replace" }); renderDetail();
    } catch (error) { toast(error.message); } finally { state.loading = false; }
  }
  async function load() {
    const nav = window.AMAVIO_NAVIGATION?.getState(); state.role = nav?.role || "admin"; state.lens = nav?.employerLens || "sponsor"; renderRoleCopy();
    try {
      const payload = await api("/api/programs/v1/bootstrap"); state.programs = payload.programs;
      const requested = window.AMAVIO_NAVIGATION?.param("program"); const chosen = state.programs.find((item) => item.id === requested)?.id || payload.selected?.program?.id || state.programs[0]?.id;
      state.selectedId = chosen || ""; state.detail = chosen === payload.selected?.program?.id ? payload.selected : chosen ? await api(`/api/programs/v1/programs/${encodeURIComponent(chosen)}`) : null;
      renderList(); renderDetail();
    } catch (error) { toast(error.message); }
  }
  async function submitDecision(event) {
    event.preventDefault(); const form = event.currentTarget; const id = form.dataset.programDecisionForm;
    try {
      await api(`/api/programs/v1/decisions/${encodeURIComponent(id)}/review`, { method: "POST", body: JSON.stringify({ version: Number(form.dataset.version), option: q("[data-decision-option]", form).value, rationale: q("[data-decision-rationale]", form).value }) });
      toast("Programmentscheidung lokal dokumentiert · keine Außenwirkung."); await selectProgram(state.selectedId);
    } catch (error) { toast(error.message); }
  }
  async function reviewAdjustment(event) {
    const button = event.currentTarget;
    try {
      await api(`/api/programs/v1/adjustments/${encodeURIComponent(button.dataset.reviewAdjustment)}/review`, { method: "POST", body: JSON.stringify({ version: Number(button.dataset.version), note: "Die Auswirkungen und Unsicherheiten wurden fachlich geprüft; keine automatische Anwendung." }) });
      toast("Anpassungsvorlage fachlich geprüft · nicht angewendet."); await selectProgram(state.selectedId);
    } catch (error) { toast(error.message); }
  }
  q("[data-program-simulation-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api(`/api/programs/v1/programs/${encodeURIComponent(state.selectedId)}/simulations`, { method: "POST", body: JSON.stringify({ trigger: q("[data-program-trigger]").value, shiftDays: Number(q("[data-program-shift]").value) }) });
      toast("Lokale Programmvariante berechnet · menschliche Prüfung bleibt offen."); await selectProgram(state.selectedId);
    } catch (error) { toast(error.message); }
  });
  q("[data-program-outcome-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await api(`/api/programs/v1/programs/${encodeURIComponent(state.selectedId)}/outcomes`, { method: "POST", body: JSON.stringify({ rating: q("[data-program-rating]").value, strengths: q("[data-program-strengths]").value, challenges: q("[data-program-challenges]").value, currentNeed: q("[data-program-current-need]").value }) });
      q("[data-program-outcome-status]").textContent = "Rückmeldung lokal übergeben · kein Versand und keine externe Wirkung."; toast("Outcome-Rückmeldung im synthetischen Programm übernommen.");
    } catch (error) { toast(error.message); }
  });
  q("[data-program-create-product]")?.addEventListener("click", async () => {
    try {
      const payload = await api(`/api/programs/v1/programs/${encodeURIComponent(state.selectedId)}/work-products`, { method: "POST", body: JSON.stringify({ type: "weekly_arrival_status" }) });
      const product = payload.workProduct; q("[data-program-product-output]").innerHTML = `<b>${escapeHtml(product.title)}</b><span>${product.content.cohortCount} Kohorten · ${product.content.participantCount} Teilnehmende · ${product.content.openDecisions.length} offene Entscheidungen</span><small>Entwurf · nicht versendet</small>`; toast("Interner Wochenstatus reproduzierbar erzeugt.");
    } catch (error) { toast(error.message); }
  });
  window.addEventListener("amavio:rolechange", (event) => { state.role = event.detail.role; state.lens = event.detail.employerLens; load(); });
  window.addEventListener("amavio:routechange", () => { if (document.body.dataset.page === "programs") load(); });
  window.addEventListener("amavio:pagechange", (event) => { if (event.detail.page === "programs" && !state.detail) load(); });
  load();
}());
