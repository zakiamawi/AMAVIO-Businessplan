(function () {
  "use strict";
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const labels = { critical: "kritisch", risk: "Risiko", decision: "Entscheidung", open: "offen", completed: "erledigt", blocked: "blockiert", in_arbeit: "in Arbeit", awaiting_human_review: "Prüfung erforderlich", advisory_approved: "fachlich geprüft", rejected: "zurückgewiesen" };
  const state = { bootstrap: null, selected: null, plan: null, simulation: null, loading: false };

  function idempotencyKey(prefix) {
    if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function request(path, options = {}) {
    const method = options.method || "GET";
    const headers = { "x-demo-session": "demo-session-operations", ...(options.headers || {}) };
    if (method !== "GET" && method !== "HEAD") {
      headers["content-type"] = "application/json";
      headers["idempotency-key"] = options.idempotencyKey || idempotencyKey("twin");
    }
    const response = await fetch(path, { ...options, method, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return payload;
  }

  function toast(message, error = false) {
    const node = q("[data-twin-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", error);
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 3800);
  }

  function renderStages() {
    q("[data-twin-stages]").innerHTML = state.bootstrap.readiness.map((item) => `
      <div class="twin-stage ${escapeHtml(item.state)}">
        <b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.window)}</small><em>${item.count} Fälle</em>
      </div>`).join("");
  }

  function eventTime(value) {
    const date = new Date(value);
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }) + " · " + date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  }

  function renderEvents() {
    q("[data-twin-event-count]").textContent = `${state.bootstrap.events.length} offen`;
    q("[data-twin-events]").innerHTML = state.bootstrap.events.map((item) => `
      <button type="button" class="twin-event ${state.selected?.event?.id === item.id ? "is-active" : ""}" data-twin-event="${escapeHtml(item.id)}">
        <span class="twin-event-top"><b>${escapeHtml(item.title)}</b><time>${escapeHtml(eventTime(item.occurredAt))}</time></span>
        <p>${escapeHtml(item.summary)}</p>
        <span class="twin-event-foot"><span class="twin-event-severity ${escapeHtml(item.severity)}">${escapeHtml(labels[item.severity] || item.severity)}</span><span>${item.caseIds.length} ${item.caseIds.length === 1 ? "Fall" : "Fälle"}</span></span>
      </button>`).join("");
    qa("[data-twin-event]").forEach((button) => button.addEventListener("click", () => selectEvent(button.dataset.twinEvent)));
  }

  function milestoneShort(title) {
    return title.replace("Wohnraumfreigabe einholen", "Wohnraum").replace("Schlüsselzeit bestätigen", "Schlüssel").replace("Ankunftsinformation vorbereiten", "Ankunft").replace("Standortvertretung bestätigen", "Standort").replace("Startklarheit prüfen", "Startklar").replace("Kostengrundlage dokumentieren", "Kostenbasis").replace("Budgetentscheidung dokumentieren", "Budget").replace("Operative Folgeplanung übernehmen", "Folgeplan");
  }

  function renderPath() {
    q("[data-twin-path-map]").innerHTML = state.bootstrap.criticalPaths.map((item) => `
      <div class="twin-path-case">
        <div class="twin-case-label"><b>${escapeHtml(item.caseId.replace("SYN-CASE-", "Fall "))}</b><small>${escapeHtml(item.location)}</small></div>
        <div class="twin-milestones">${item.milestones.map((milestone) => `<div class="twin-node ${escapeHtml(milestone.status)} ${milestone.critical ? "critical" : ""}" title="${escapeHtml(milestone.title)}"><span>${escapeHtml(milestoneShort(milestone.title))}</span><small>${escapeHtml(milestone.dueDate.slice(5).split("-").reverse().join("."))}</small></div>`).join("")}</div>
      </div>`).join("");
  }

  function statusCell(value) {
    return `<span class="handoff-state ${escapeHtml(value)}">${escapeHtml(labels[value] || value)}</span>`;
  }

  function renderHandoffs() {
    q("[data-twin-handoffs]").innerHTML = state.bootstrap.handoffs.map((item) => `
      <div class="twin-handoff-row" role="row">
        <span><b>${escapeHtml(item.caseId.replace("SYN-CASE-", "Fall "))}</b><small>${escapeHtml(item.location)} · ${escapeHtml(item.currentStep)}</small></span>
        <span>${statusCell(item.operations)}</span><span>${statusCell(item.sponsor)}</span><span>${statusCell(item.hr)}</span><span>${statusCell(item.locationRole)}</span><span>${statusCell(item.budget)}</span>
        <span>${escapeHtml(item.nextHandoff)}</span>
      </div>`).join("");
  }

  function renderPlan(plan) {
    if (!plan) return "";
    const review = plan.status === "awaiting_human_review" ? `
      <div class="twin-plan-review">
        <label for="twin-review-note">Prüfnotiz</label>
        <textarea id="twin-review-note" data-twin-review-note>Aufgaben, Verantwortung und Abhängigkeiten synthetisch geprüft.</textarea>
        <div class="twin-plan-actions"><button type="button" class="secondary-action" data-twin-review="rejected">Zurückweisen</button><button type="button" class="primary-action" data-twin-review="approved">Fachlich freigeben</button></div>
      </div>` : `<p class="twin-plan-state">Status: ${escapeHtml(labels[plan.status] || plan.status)} · keine automatische Ausführung</p>`;
    return `<div class="twin-detail-group"><h4>Erzeugter Arbeitsplan</h4><ol class="twin-plan-steps">${plan.steps.map((step) => `<li><span><b>${escapeHtml(step.ownerRole)}</b><br>${escapeHtml(step.action)} · ${escapeHtml(step.dueDate)}</span></li>`).join("")}</ol>${review}</div>`;
  }

  function renderInspector() {
    const detail = state.selected;
    if (!detail) return;
    q("[data-twin-severity]").textContent = labels[detail.event.severity] || detail.event.severity;
    q("[data-twin-inspector]").innerHTML = `
      <h3>${escapeHtml(detail.event.title)}</h3>
      <p>${escapeHtml(detail.event.summary)}</p>
      <div class="twin-detail-meta">${detail.cases.map((item) => `<span>${escapeHtml(item.id.replace("SYN-CASE-", "Fall "))} · ${escapeHtml(item.location)}</span>`).join("")}</div>
      <div class="twin-detail-group"><h4>Beleglage</h4><ul>${detail.evidence.length ? detail.evidence.map((item) => `<li><span><b>${escapeHtml(item.label)}</b><br>${escapeHtml(item.source)} · ${escapeHtml(item.reviewStatus)}</span></li>`).join("") : "<li><span>Bezug ist benannt; Belegdetails müssen im Fall ergänzt werden.</span></li>"}</ul></div>
      <div class="twin-detail-group"><h4>Vorgeschlagene Bearbeitung</h4><ul>${detail.workflow.map((step) => `<li><span><b>${escapeHtml(step.ownerRole)}</b><br>${escapeHtml(step.action)}</span></li>`).join("")}</ul></div>
      <div class="twin-human-gate"><b>Bewusste Bestätigung</b><span>Die Arbeitsfläche bereitet vor. Freigabe und Ausführung bleiben menschlich; keine Außenwirkung.</span></div>
      <div class="twin-plan-actions"><button type="button" class="primary-action" data-twin-create-plan ${state.plan ? "disabled" : ""}>${state.plan ? "Arbeitsplan erzeugt" : "Arbeitsplan erzeugen"}</button><button type="button" class="quiet-control" data-twin-open-case>Fallreise öffnen</button></div>
      ${renderPlan(state.plan)}`;
    q("[data-twin-create-plan]")?.addEventListener("click", createWorkPlan);
    q("[data-twin-open-case]")?.addEventListener("click", () => q('[data-page-target="operations"]')?.click());
    qa("[data-twin-review]").forEach((button) => button.addEventListener("click", () => reviewPlan(button.dataset.twinReview)));
  }

  async function selectEvent(id) {
    if (state.loading) return;
    state.loading = true;
    try {
      state.selected = await request(`/api/twin/v1/events/${encodeURIComponent(id)}`);
      state.plan = null;
      renderEvents();
      renderInspector();
      renderDecisions();
    } catch (error) { toast(error.message, true); }
    finally { state.loading = false; }
  }

  async function createWorkPlan() {
    try {
      const payload = await request(`/api/twin/v1/events/${encodeURIComponent(state.selected.event.id)}/work-plans`, { method: "POST", body: "{}" });
      state.plan = payload.plan;
      renderInspector();
      renderDecisions();
      toast("Prüfbarer Arbeitsplan erzeugt · Human Gate offen · keine Ausführung.");
    } catch (error) { toast(error.message, true); }
  }

  async function reviewPlan(decision) {
    const note = q("[data-twin-review-note]")?.value.trim();
    try {
      const payload = await request(`/api/twin/v1/work-plans/${encodeURIComponent(state.plan.id)}/review`, { method: "POST", body: JSON.stringify({ decision, note, version: state.plan.version }) });
      state.plan = payload.plan;
      renderInspector();
      renderDecisions();
      toast(decision === "approved" ? "Arbeitsplan fachlich freigegeben · weiterhin rein beratend." : "Arbeitsplan zur Überarbeitung zurückgewiesen.");
    } catch (error) { toast(error.message, true); }
  }

  async function simulateCohort() {
    const overlay = q("[data-twin-overlay]");
    overlay.hidden = false;
    q("[data-twin-simulation-result]").innerHTML = "<p>Auswirkungen werden lokal berechnet …</p>";
    try {
      const payload = await request("/api/twin/v1/cohort-simulations", { method: "POST", body: JSON.stringify({ shiftDays: 3 }) });
      state.simulation = payload.simulation;
      const result = payload.simulation.result;
      q("[data-twin-simulation-result]").innerHTML = `<p>${escapeHtml(result.summary)}</p><div class="twin-simulation-grid"><div><b>${result.affectedCases}</b><span>betroffene Fälle</span></div><div><b>${result.affectedMilestones}</b><span>kritische Meilensteine</span></div><div><b>${result.roleHandoffs}</b><span>Rollenübergaben</span></div><div><b>${result.budgetChecks}</b><span>Budgetprüfung</span></div></div><div class="twin-human-gate"><b>Original unverändert</b><span>Diese Variante trifft keine Entscheidung und verändert keinen Fall.</span></div>`;
    } catch (error) { q("[data-twin-simulation-result]").innerHTML = `<p>${escapeHtml(error.message)}</p>`; }
  }

  function renderDecisions() {
    if (!state.bootstrap) return;
    const events = state.bootstrap.events.filter((item) => ["critical", "decision"].includes(item.severity));
    q("[data-twin-decision-summary]").innerHTML = `<div><b>${events.length}</b><span>offene Entscheidungsgrundlagen</span></div><div><b>${state.plan ? 1 : 0}</b><span>erzeugte Arbeitspläne</span></div><div><b>${state.plan?.status === "advisory_approved" ? 1 : 0}</b><span>fachlich geprüfte Pläne</span></div>`;
    q("[data-twin-decision-list]").innerHTML = events.map((item) => `<article class="twin-decision-row"><span>${escapeHtml(item.id.replace("SYN-TWIN-EVT-", "Ereignis "))}</span><div><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.summary)}</p></div><span>${item.caseIds.length} ${item.caseIds.length === 1 ? "Fall" : "Fälle"} betroffen</span><span>Bestätigung offen</span><button type="button" class="quiet-control" data-twin-decision-event="${escapeHtml(item.id)}">Prüfen</button></article>`).join("") || '<div class="twin-empty">Keine offene Entscheidungsgrundlage.</div>';
    qa("[data-twin-decision-event]").forEach((button) => button.addEventListener("click", async () => { await selectEvent(button.dataset.twinDecisionEvent); q('[data-page-target="twin"]')?.click(); }));
  }

  async function bootstrap() {
    q("[data-twin-runtime]").textContent = "Wird geladen";
    try {
      state.bootstrap = await request("/api/twin/v1/bootstrap");
      state.selected = state.bootstrap.selected;
      q("[data-twin-cohort]").textContent = state.bootstrap.cohort.name;
      q("[data-twin-window]").textContent = state.bootstrap.cohort.windowLabel;
      q("[data-twin-arrivals]").textContent = String(state.bootstrap.cohort.plannedArrivals);
      q("[data-twin-critical]").textContent = String(state.bootstrap.metrics.criticalEvents);
      q("[data-twin-runtime]").textContent = "lokal aktiv";
      renderStages(); renderEvents(); renderPath(); renderHandoffs(); renderInspector(); renderDecisions();
    } catch (error) {
      q("[data-twin-runtime]").textContent = "nicht verfügbar";
      toast(error.message, true);
    }
  }

  q("[data-twin-simulate]")?.addEventListener("click", simulateCohort);
  q("[data-twin-close]")?.addEventListener("click", () => { q("[data-twin-overlay]").hidden = true; });
  q("[data-twin-overlay]")?.addEventListener("click", (event) => { if (event.target === event.currentTarget) event.currentTarget.hidden = true; });
  q("[data-twin-open-main]")?.addEventListener("click", () => q('[data-page-target="twin"]')?.click());
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && q("[data-twin-overlay]") && !q("[data-twin-overlay]").hidden) q("[data-twin-overlay]").hidden = true; });
  window.addEventListener("amavio:rolechange", (event) => {
    if (event.detail?.role === "employer" && ["twin", "twin-decisions"].includes(document.body.dataset.page)) q('[data-page-target="operations"]')?.click();
  });

  window.AMAVIO_OPERATIONS_TWIN = { getState: () => JSON.parse(JSON.stringify(state)), reload: bootstrap };
  bootstrap();
}());
