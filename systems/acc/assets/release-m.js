(function () {
  "use strict";

  const q = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const sessions = { admin: "demo-session-operations", sponsor: "demo-session-employer-sponsor", hr: "demo-session-employer-hr", location: "demo-session-employer-location", budget: "demo-session-employer-budget" };
  const state = { caseId: "", programId: "", execution: null, loadingCase: "", loadingProgram: "" };

  function route() {
    const current = window.AMAVIO_NAVIGATION?.getState?.() || {};
    return {
      role: current.role || document.body.dataset.role || "admin",
      lens: current.employerLens || q("[data-employer-lens]")?.value || "sponsor",
      page: current.page || document.body.dataset.page || "today",
    };
  }

  function session() {
    const current = route();
    return current.role === "employer" ? sessions[current.lens] || sessions.sponsor : sessions.admin;
  }

  function key(prefix) {
    return `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
  }

  async function api(path, options = {}) {
    const method = String(options.method || "GET").toUpperCase();
    const headers = { "x-demo-session": session(), ...(options.headers || {}) };
    if (!['GET', 'HEAD'].includes(method)) {
      headers["content-type"] = "application/json";
      headers["idempotency-key"] = key("execution");
    }
    const response = await fetch(path, { ...options, method, headers, cache: "no-store" });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Der operative Ausführungsstand konnte nicht verarbeitet werden.");
    return payload;
  }

  function date(value) {
    return value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "–";
  }

  function toast(message, error = false) {
    const page = route().page;
    const node = page === "programs" ? q("[data-program-toast]") : page === "collaboration" ? q("[data-collab-toast]") : q("[data-ops-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", error);
    node.classList.add("is-visible", "show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible", "show"), 3_800);
  }

  function orderMarkup(item, index, total, employer) {
    const active = item.canAct && ["ready", "in_progress"].includes(item.status);
    return `<article class="execution-order is-${escapeHtml(item.status)}${active ? " is-actionable" : ""}">
      <span class="execution-order-sequence">${index + 1}<small>/${total}</small></span>
      <div class="execution-order-copy">
        <div><span>${escapeHtml(item.ownerRole)}</span><em>${escapeHtml(item.statusLabel)}</em></div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.purpose)}</p>
        <small>${item.dependencyId ? (item.dependencyMet ? "Abhängigkeit erfüllt" : "Vorheriger Schritt erforderlich") : "Startpunkt"} · bis ${date(item.dueDate)}</small>
        ${active && !employer ? `<form data-execution-order-form="${escapeHtml(item.id)}" data-version="${item.version}"><label><span>Abschlussnotiz</span><textarea rows="2" data-execution-order-note>Arbeitsauftrag wurde anhand des synthetischen Fallstands fachlich geprüft und lokal abgeschlossen.</textarea></label><button type="submit" class="primary-action">Schritt abschließen</button></form>` : ""}
      </div>
    </article>`;
  }

  function renderOperations(execution) {
    const target = q("[data-execution-orders]");
    if (!target) return;
    const employer = execution.access.roleGroup === "employer";
    const legacyTasks = q(".ops-tasks");
    const legacyDecision = q("[data-ops-decision]");
    if (legacyTasks) legacyTasks.hidden = !employer;
    const executionDecision = execution.decisionPackages[0];
    if (legacyDecision) legacyDecision.hidden = !employer && Boolean(executionDecision && executionDecision.status !== "blocked");
    q("[data-execution-progress]").textContent = `${execution.plan.progress.completed} von ${execution.plan.progress.total} Schritten erledigt · ${execution.plan.statusLabel}`;
    target.innerHTML = execution.orders.length
      ? execution.orders.map((item, index) => orderMarkup(item, index, execution.orders.length, employer)).join("")
      : '<p class="execution-empty">Für diese Rolle ist in diesem Ausführungsweg kein Arbeitsauftrag zugewiesen.</p>';
    target.querySelectorAll("[data-execution-order-form]").forEach((form) => form.addEventListener("submit", completeOrder));
    if (!employer) {
      const next = execution.nextAction;
      const contextOwner = q("[data-context-owner]");
      const contextTask = q("[data-context-task]");
      const contextDue = q("[data-context-due]");
      const contextGate = q("[data-context-human-gate]");
      if (contextOwner) contextOwner.textContent = next?.ownerRole || "AMAVIO Operations";
      if (contextTask) contextTask.textContent = next?.title || "Ausführungsweg abgeschlossen";
      if (contextDue) contextDue.textContent = date(next?.dueDate);
      if (contextGate && executionDecision?.status === "open") contextGate.textContent = "Entscheidung offen";
      if (contextGate && executionDecision?.status === "reviewed") contextGate.textContent = "Dokumentiert";
    }

    const decisionTarget = q("[data-execution-decision]");
    if (decisionTarget) {
      const item = execution.decisionPackages[0];
      if (!item) decisionTarget.innerHTML = employer ? "" : '<p class="execution-empty">Die operative Entscheidungsvorlage wird nach Abschluss der Abhängigkeiten freigegeben.</p>';
      else if (item.status === "blocked") decisionTarget.innerHTML = `<div class="execution-gate is-blocked"><span>Entscheidungsvorlage</span><h4>${escapeHtml(item.title)}</h4><p>Zuerst müssen Arbeitsauftrag und Arbeitgeberübergabe nachvollziehbar abgeschlossen sein.</p></div>`;
      else if (item.status === "reviewed") decisionTarget.innerHTML = `<div class="execution-gate is-reviewed"><span>Menschlich dokumentiert</span><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.selectedOption)}</p><small>${escapeHtml(item.rationale)}</small></div>`;
      else decisionTarget.innerHTML = `<div class="execution-gate"><span>Menschliche Entscheidung</span><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.question)}</p><dl><div><dt>Empfehlung</dt><dd>${escapeHtml(item.recommendation)}</dd></div><div><dt>Alternative</dt><dd>${escapeHtml(item.alternative)}</dd></div><div><dt>Folge</dt><dd>${escapeHtml(item.consequence)}</dd></div></dl><form data-execution-decision-form="${escapeHtml(item.id)}" data-version="${item.version}"><label><span>Entscheidung</span><select data-execution-decision-option><option value="${escapeHtml(item.recommendation)}">Empfehlung übernehmen</option><option value="${escapeHtml(item.alternative)}">Alternative wählen</option></select></label><label><span>Begründung</span><textarea rows="3" data-execution-decision-note>Die vollständige synthetische Arbeitskette und ihre Abhängigkeiten wurden fachlich geprüft.</textarea></label><button type="submit" class="primary-action">Entscheidung dokumentieren</button></form></div>`;
      decisionTarget.querySelector("[data-execution-decision-form]")?.addEventListener("submit", reviewDecision);
    }

    const resultTarget = q("[data-execution-result]");
    if (resultTarget) {
      const impact = execution.impacts[0];
      resultTarget.innerHTML = impact
        ? `<div class="execution-outcome"><span>Operatives Ergebnis</span><h4>${escapeHtml(execution.plan.statusLabel)}</h4><p>${escapeHtml(impact.summary)}</p><dl><div><dt>Programmbezug</dt><dd>${escapeHtml(impact.affectedWorkstream)}</dd></div><div><dt>Beratende Folge</dt><dd>${escapeHtml(impact.recommendation)}</dd></div></dl><small>Nicht automatisch angewendet · keine Außenwirkung</small></div>`
        : `<div class="execution-outcome is-pending"><span>Operatives Ergebnis</span><h4>${escapeHtml(execution.plan.statusLabel)}</h4><p>${execution.nextAction ? `Nächster Schritt: ${escapeHtml(execution.nextAction.title)} · ${escapeHtml(execution.nextAction.ownerRole)}` : "Der lokale Ausführungsweg ist noch nicht abgeschlossen."}</p></div>`;
    }
  }

  function renderEmployer(execution) {
    const target = q("[data-execution-employer]");
    if (!target) return;
    const item = execution.handoffs[0];
    const genericForm = q("[data-collab-form]");
    const genericEvidence = q("[data-collab-evidence-line]");
    if (genericForm) genericForm.hidden = Boolean(item);
    if (genericEvidence) genericEvidence.hidden = Boolean(item);
    if (!item) { target.hidden = true; target.innerHTML = ""; return; }
    target.hidden = false;
    if (item.status === "waiting") {
      target.innerHTML = `<span>Operative Übergabe</span><h4>Noch nicht freigegeben</h4><p>AMAVIO Operations schließt zunächst die fachliche Grundlage ab. Danach erscheint hier Ihre konkrete Standortaufgabe.</p>`;
      return;
    }
    if (["acknowledged", "returned"].includes(item.status)) {
      target.innerHTML = `<span>Operative Übergabe · ${escapeHtml(item.statusLabel)}</span><h4>${escapeHtml(item.request)}</h4><p>${escapeHtml(item.responseNote || "Rückmeldung lokal dokumentiert.")}</p><small>Keine Nachricht versendet · keine externe Wirkung</small>`;
      return;
    }
    target.innerHTML = `<span>Operative Übergabe · bis ${date(item.dueDate)}</span><h4>${escapeHtml(item.request)}</h4><p><b>Benötigte Grundlage:</b> ${escapeHtml(item.evidenceNeeded)}</p><form data-execution-handoff-form="${escapeHtml(item.id)}" data-version="${item.version}"><label><span>Ihre Rückmeldung</span><textarea rows="3" data-execution-handoff-note>Übergabezeit und Standortverantwortung wurden für den synthetischen Fall nachvollziehbar bestätigt.</textarea></label><div><button type="submit" class="primary-action" data-decision="acknowledged">Bestätigen und übergeben</button><button type="submit" class="secondary-action" data-decision="returned">Rückfrage stellen</button></div></form><small>Bewusste lokale Übergabe · kein Versand und keine Buchung</small>`;
    target.querySelector("[data-execution-handoff-form]")?.addEventListener("submit", respondHandoff);
  }

  async function loadCase(caseId) {
    if (!caseId || state.loadingCase === `${caseId}:${session()}`) return;
    state.loadingCase = `${caseId}:${session()}`;
    try {
      const execution = await api(`/api/execution/v1/cases/${encodeURIComponent(caseId)}`);
      state.caseId = caseId; state.execution = execution;
      if (execution.available === false) {
        const orders = q("[data-execution-orders]");
        if (orders) orders.innerHTML = '<p class="execution-empty">Für diesen Fall ist noch kein zusammenhängender Ausführungsweg angelegt.</p>';
        const progress = q("[data-execution-progress]");
        if (progress) progress.textContent = "Noch nicht angelegt";
        const decision = q("[data-execution-decision]");
        if (decision) decision.innerHTML = "";
        const result = q("[data-execution-result]");
        if (result) result.innerHTML = "";
        const employer = q("[data-execution-employer]");
        if (employer) { employer.hidden = true; employer.innerHTML = ""; }
        const genericForm = q("[data-collab-form]");
        const genericEvidence = q("[data-collab-evidence-line]");
        if (genericForm) genericForm.hidden = false;
        if (genericEvidence) genericEvidence.hidden = false;
        const legacyTasks = q(".ops-tasks");
        const legacyDecision = q("[data-ops-decision]");
        if (legacyTasks) legacyTasks.hidden = false;
        if (legacyDecision) legacyDecision.hidden = false;
        return;
      }
      renderOperations(execution); renderEmployer(execution);
    } catch (error) {
      const target = q("[data-execution-orders]");
      if (target) target.innerHTML = `<p class="execution-empty">${escapeHtml(error.message)}</p>`;
    } finally { state.loadingCase = ""; }
  }

  async function completeOrder(event) {
    event.preventDefault(); const form = event.currentTarget; const button = q("button", form); button.disabled = true;
    try {
      const payload = await api(`/api/execution/v1/work-orders/${encodeURIComponent(form.dataset.executionOrderForm)}/transitions`, { method: "POST", body: JSON.stringify({ status: "completed", version: Number(form.dataset.version), note: q("[data-execution-order-note]", form).value.trim() }) });
      state.execution = payload.execution; renderOperations(payload.execution); renderEmployer(payload.execution);
      toast("Arbeitsauftrag lokal abgeschlossen; der nächste abhängige Schritt ist freigegeben.");
    } catch (error) { button.disabled = false; toast(error.message, true); }
  }

  async function respondHandoff(event) {
    event.preventDefault(); const form = event.currentTarget; const submitter = event.submitter; submitter.disabled = true;
    try {
      const payload = await api(`/api/execution/v1/handoffs/${encodeURIComponent(form.dataset.executionHandoffForm)}/respond`, { method: "POST", body: JSON.stringify({ decision: submitter.dataset.decision, version: Number(form.dataset.version), note: q("[data-execution-handoff-note]", form).value.trim() }) });
      state.execution = payload.execution; renderEmployer(payload.execution); renderOperations(payload.execution);
      toast(submitter.dataset.decision === "returned" ? "Rückfrage lokal dokumentiert." : "Standortübergabe lokal bestätigt und an AMAVIO Operations zurückgegeben.");
    } catch (error) { submitter.disabled = false; toast(error.message, true); }
  }

  async function reviewDecision(event) {
    event.preventDefault(); const form = event.currentTarget; const button = q("button", form); button.disabled = true;
    try {
      const payload = await api(`/api/execution/v1/decision-packages/${encodeURIComponent(form.dataset.executionDecisionForm)}/review`, { method: "POST", body: JSON.stringify({ version: Number(form.dataset.version), option: q("[data-execution-decision-option]", form).value, rationale: q("[data-execution-decision-note]", form).value.trim() }) });
      state.execution = payload.execution; renderOperations(payload.execution);
      toast("Menschliche Fallentscheidung dokumentiert; die Programmfolge bleibt beratend und lokal.");
      loadProgram(payload.execution.plan.programId);
    } catch (error) { button.disabled = false; toast(error.message, true); }
  }

  async function loadProgram(programId) {
    if (!programId || state.loadingProgram === `${programId}:${session()}`) return;
    state.loadingProgram = `${programId}:${session()}`;
    try {
      const payload = await api(`/api/execution/v1/programs/${encodeURIComponent(programId)}/impacts`);
      const target = q("[data-execution-program-impact]");
      if (!target) return;
      target.innerHTML = payload.impacts.length ? payload.impacts.map((item) => `<article><span>Beratend · nicht angewendet</span><p>${escapeHtml(item.summary)}</p><b>${escapeHtml(item.affectedWorkstream)}</b><small>${escapeHtml(item.recommendation)}</small></article>`).join("") : "<p>Noch keine beratende Programmfolge dokumentiert.</p>";
      state.programId = programId;
    } catch (error) { toast(error.message, true); }
    finally { state.loadingProgram = ""; }
  }

  window.addEventListener("amavio:case-rendered", (event) => loadCase(event.detail.caseId));
  window.addEventListener("amavio:employer-case-rendered", (event) => loadCase(event.detail.caseId));
  window.addEventListener("amavio:program-rendered", (event) => loadProgram(event.detail.programId));
  window.addEventListener("amavio:routechange", () => {
    const params = new URLSearchParams(location.search);
    const current = route();
    if (["operations", "collaboration"].includes(current.page)) loadCase(params.get("opsCase") || state.caseId || "SYN-CASE-001");
    if (current.page === "programs") loadProgram(params.get("program") || state.programId || "SYN-PROG-001");
  });

  const params = new URLSearchParams(location.search);
  if (["operations", "collaboration"].includes(route().page)) loadCase(params.get("opsCase") || "SYN-CASE-001");
  if (route().page === "programs") loadProgram(params.get("program") || "SYN-PROG-001");
}());
