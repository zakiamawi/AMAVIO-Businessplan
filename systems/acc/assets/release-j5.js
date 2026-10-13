(function () {
  "use strict";

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const sessions = {
    admin: "demo-session-operations",
    sponsor: "demo-session-employer-sponsor",
    hr: "demo-session-employer-hr",
    location: "demo-session-employer-location",
    budget: "demo-session-employer-budget",
  };
  const contributionStatus = { submitted: "An AMAVIO übergeben", in_review: "AMAVIO prüft", reviewed: "Gemeinsamer Status aktualisiert", returned: "Rückfrage vorbereitet" };
  const state = { role: "admin", lens: "sponsor", portfolio: [], detail: null, contributions: [], selectedCaseId: null, loading: false };

  function routeState() {
    return window.AMAVIO_NAVIGATION?.getState?.() || { role: "admin", employerLens: "sponsor", page: "today" };
  }

  function sessionFor(role = state.role, lens = state.lens) {
    return role === "admin" ? sessions.admin : sessions[lens] || sessions.sponsor;
  }

  function key(prefix) {
    return globalThis.crypto?.randomUUID ? `${prefix}-${globalThis.crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function request(path, options = {}, role = state.role, lens = state.lens) {
    const method = String(options.method || "GET").toUpperCase();
    const headers = { "x-demo-session": sessionFor(role, lens), ...(options.headers || {}) };
    if (!["GET", "HEAD"].includes(method)) {
      headers["content-type"] = "application/json";
      headers["idempotency-key"] = options.idempotencyKey || key("j5-collaboration");
    }
    const response = await fetch(path, { ...options, method, headers });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
    return payload;
  }

  function toast(message, error = false, target = "[data-collab-toast]") {
    const node = q(target);
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", error);
    node.classList.add("is-visible");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove("is-visible"), 3_800);
  }

  function formatDateTime(value) {
    if (!value) return "–";
    return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  }

  function renderEmployerCases() {
    const list = q("[data-collab-case-list]");
    if (!list) return;
    const actionable = state.portfolio.filter((item) => item.nextTask && item.nextTask !== "Kein Schritt für diese Rolle");
    q("[data-collab-case-count]").textContent = `${actionable.length} Vorgänge`;
    list.innerHTML = actionable.map((item) => {
      const selected = item.id === state.selectedCaseId;
      return `<button type="button" class="dual-case-button${selected ? " is-selected" : ""}" data-collab-case="${escapeHtml(item.id)}" aria-pressed="${selected}">
        <span><span>${escapeHtml(item.id.replace("SYN-CASE-", "A-"))}</span><span>${escapeHtml(item.readinessLabel?.split(" · ")[0] || "offen")}</span></span>
        <b>${escapeHtml(item.title)}</b>
        <small>${escapeHtml(item.nextTask || "Beitrag prüfen")} · ${escapeHtml(item.location)}</small>
      </button>`;
    }).join("") || '<p class="ops-contribution-empty">Für diesen Arbeitsbereich ist aktuell kein synthetischer Vorgang zu bearbeiten. Der vollständige Programmstand bleibt unter „Ankunftsprogramme“ sichtbar.</p>';
  }

  function renderEmployerDetail() {
    const detail = state.detail;
    if (!detail) return;
    const item = detail.case;
    const access = detail.access || {};
    const openTask = detail.tasks?.find((task) => task.status !== "completed");
    const openDecision = detail.decisions?.find((decision) => decision.status === "open");
    const primary = openDecision || openTask;
    const contributions = state.contributions.filter((entry) => entry.caseId === item.id);
    const latest = contributions[0];
    const roleSummaries = {
      sponsor: "Bereichsübergreifende Entscheidungen, ihre Grundlage und die gemeinsame Wirkung stehen zuerst.",
      hr: "Personalbezogene Aufgaben, Startvoraussetzungen und betriebliche Beiträge stehen zuerst.",
      location: "Lokale Zuständigkeiten, Übergabezeiten und Standortbestätigungen stehen zuerst.",
      budget: "Kostenrahmen, Zusatzbedarf und begründete Freigaben stehen zuerst.",
    };
    q("[data-collab-case-reference]").textContent = `Synthetischer Fall ${item.id.replace("SYN-CASE-", "A-")}`;
    q("[data-collab-case-name]").textContent = item.title;
    q("[data-collab-case-meta]").textContent = `${item.location} · geplante Anreise ${new Intl.DateTimeFormat("de-DE").format(new Date(`${item.arrivalDate}T12:00:00`))}`;
    q("[data-collab-role-label]").textContent = access.label || "Arbeitgeber";
    q("[data-collab-role-summary]").textContent = roleSummaries[state.lens] || "Ihre offenen Aufgaben und Entscheidungen stehen zuerst.";
    q("[data-collab-open-decisions]").textContent = String(detail.decisions?.filter((entry) => entry.status === "open").length || 0);
    q("[data-collab-open-tasks]").textContent = String(detail.tasks?.filter((entry) => entry.status !== "completed").length || 0);
    q("[data-collab-contribution-count]").textContent = String(state.contributions.length);
    q("[data-collab-action-title]").textContent = openDecision?.question || openTask?.title || "Gemeinsamen Status prüfen";
    q("[data-collab-action-copy]").textContent = openDecision
      ? "Prüfen Sie Grundlage und Auswirkung und dokumentieren Sie die zugewiesene Entscheidung mit einer nachvollziehbaren Begründung. AMAVIO ordnet den Beitrag anschließend fachlich ein."
      : openTask
        ? "Bearbeiten Sie die für Ihren Arbeitsbereich zugewiesene Aufgabe mit Grundlage und Ergebnis und übergeben Sie sie anschließend bewusst an AMAVIO."
        : "Für diese Rolle ist keine offene Aufgabe vorhanden. Sie können eine Ergebnisrückmeldung zum gemeinsamen Fallstand übergeben.";
    q("[data-collab-action-state]").textContent = primary ? "offen" : "Status prüfen";
    const evidence = detail.evidence?.[0];
    q("[data-collab-evidence-line]").innerHTML = evidence
      ? `<b>${escapeHtml(evidence.label)}</b><span>${escapeHtml(evidence.assertion)}</span>`
      : "<b>Freigegebene Grundlage</b><span>Für diese Rolle ist kein zusätzlicher Beleg erforderlich.</span>";
    q("[data-collab-type]").value = openDecision ? "decision" : openTask ? "evidence_confirmation" : "outcome_feedback";
    q("[data-collab-summary]").value = openDecision?.question || openTask?.title || "Ergebnis zum gemeinsamen Fallstand";
    q("[data-collab-shared-status]").textContent = latest
      ? `${contributionStatus[latest.status] || latest.sharedStatus}. ${latest.reviewNote || latest.sharedStatus}`
      : "Noch kein Arbeitgeberbeitrag zu diesem Fall. Die nächste Übergabe wird nach Ihrer bewussten Bestätigung sichtbar.";
    q("[data-collab-history]").innerHTML = contributions.map((entry) => `<article class="contribution-row"><b>${escapeHtml(entry.typeLabel)}</b><span>${escapeHtml(entry.summary)}</span><small>${escapeHtml(contributionStatus[entry.status] || entry.sharedStatus)} · ${formatDateTime(entry.createdAt)}</small></article>`).join("") || '<p class="ops-contribution-empty">Noch keine Beiträge für diesen Fall.</p>';
    renderEmployerCases();
    window.dispatchEvent(new CustomEvent("amavio:employer-case-rendered", { detail: { caseId: item.id, employerLens: state.lens } }));
  }

  async function loadEmployerCase(caseId) {
    const payload = await request(`/api/v1.5/cases/${encodeURIComponent(caseId)}`);
    state.selectedCaseId = caseId;
    state.detail = payload;
    renderEmployerDetail();
    window.AMAVIO_NAVIGATION?.updateContext({ opsCase: caseId }, { history: "push" });
  }

  async function bootstrapEmployer() {
    if (state.loading) return;
    state.loading = true;
    try {
      const [cases, collaboration] = await Promise.all([request("/api/v1.5/bootstrap"), request("/api/collaboration/v1/bootstrap")]);
      state.portfolio = cases.portfolio || [];
      state.contributions = collaboration.contributions || [];
      const requested = new URLSearchParams(location.search).get("opsCase");
      const caseId = state.portfolio.some((item) => item.id === requested) ? requested : cases.selected?.case?.id || state.portfolio[0]?.id;
      state.selectedCaseId = caseId || null;
      state.detail = caseId === cases.selected?.case?.id ? cases.selected : null;
      if (caseId && !state.detail) state.detail = await request(`/api/v1.5/cases/${encodeURIComponent(caseId)}`);
      renderEmployerCases();
      renderEmployerDetail();
      if (caseId) window.AMAVIO_NAVIGATION?.updateContext({ opsCase: caseId }, { history: "replace" });
    } catch (error) { toast(`Arbeitgeber-Arbeitsfläche nicht verfügbar: ${error.message}`, true); }
    finally { state.loading = false; }
  }

  function renderOperationsInbox(contributions) {
    q("[data-ops-contribution-total]").textContent = String(contributions.length);
    q("[data-ops-contribution-open]").textContent = String(contributions.filter((item) => item.status === "submitted" || item.status === "in_review").length);
    const inbox = q("[data-ops-contribution-inbox]");
    if (!inbox) return;
    inbox.innerHTML = contributions.slice(0, 6).map((item) => `<article class="ops-contribution-card${item.status === "reviewed" ? " is-reviewed" : ""}" data-contribution-card="${escapeHtml(item.id)}">
      <span><span>${escapeHtml(item.caseId.replace("SYN-CASE-", "A-"))}</span><span>${escapeHtml(contributionStatus[item.status] || item.status)}</span></span>
      <b>${escapeHtml(item.summary)}</b>
      <p>${escapeHtml(item.createdRoleLabel)} · ${formatDateTime(item.createdAt)}</p>
      ${item.status === "submitted" ? `<textarea rows="2" aria-label="Prüfnotiz für ${escapeHtml(item.summary)}" data-contribution-note="${escapeHtml(item.id)}">Beitrag fachlich geprüft und in den synthetischen Fallstand eingeordnet.</textarea>${item.type === "outcome_feedback" ? `<label class="ops-learning-choice"><input type="checkbox" data-contribution-learning="${escapeHtml(item.id)}"><span>Als strukturierte Rückmeldung für die interne Lernschleife vormerken</span></label>` : ""}<button type="button" data-review-contribution="${escapeHtml(item.id)}">Fachlich prüfen</button>` : `<p>${escapeHtml(item.reviewNote || item.sharedStatus)}</p>`}
    </article>`).join("") || '<p class="ops-contribution-empty">Noch keine Arbeitgeberbeiträge. Eingänge aus der Arbeitgeber-Arbeitsfläche erscheinen hier automatisch.</p>';
  }

  async function bootstrapOperationsInbox() {
    try {
      const payload = await request("/api/collaboration/v1/bootstrap", {}, "admin", "sponsor");
      renderOperationsInbox(payload.contributions || []);
    } catch (error) {
      const inbox = q("[data-ops-contribution-inbox]");
      if (inbox) inbox.innerHTML = `<p class="ops-contribution-empty">${escapeHtml(error.message)}</p>`;
    }
  }

  q("[data-collab-case-list]")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-collab-case]");
    if (!button) return;
    try { await loadEmployerCase(button.dataset.collabCase); }
    catch (error) { toast(error.message, true); }
  });

  q("[data-collab-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector("button[type='submit']");
    button.disabled = true;
    try {
      await request("/api/collaboration/v1/contributions", {
        method: "POST",
        body: JSON.stringify({ caseId: state.selectedCaseId, type: q("[data-collab-type]").value, summary: q("[data-collab-summary]").value.trim(), detail: q("[data-collab-detail]").value.trim() }),
      });
      const collaboration = await request("/api/collaboration/v1/bootstrap");
      state.contributions = collaboration.contributions || [];
      renderEmployerDetail();
      toast("Beitrag lokal an AMAVIO Operations übergeben · keine Außenwirkung.");
    } catch (error) { toast(error.message, true); }
    finally { button.disabled = false; }
  });

  q("[data-ops-contribution-inbox]")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-review-contribution]");
    if (!button) return;
    const note = q(`[data-contribution-note="${CSS.escape(button.dataset.reviewContribution)}"]`)?.value.trim();
    const includeInLearning = Boolean(q(`[data-contribution-learning="${CSS.escape(button.dataset.reviewContribution)}"]`)?.checked);
    if (!note) { toast("Für die fachliche Prüfung ist eine nachvollziehbare Notiz erforderlich.", true, "[data-ops-toast]"); return; }
    button.disabled = true;
    try {
      const result = await request(`/api/collaboration/v1/contributions/${encodeURIComponent(button.dataset.reviewContribution)}/review`, { method: "POST", body: JSON.stringify({ decision: "reviewed", note, includeInLearning }) }, "admin", "sponsor");
      await bootstrapOperationsInbox();
      toast(result.learningIntake?.created ? "Beitrag geprüft und bewusst in die interne Lernschleife vorgemerkt." : "Arbeitgeberbeitrag fachlich geprüft; gemeinsamer Status lokal aktualisiert.", false, "[data-ops-toast]");
    } catch (error) { toast(error.message, true, "[data-ops-toast]"); button.disabled = false; }
  });

  function syncRole(detail) {
    const current = routeState();
    state.role = detail?.role === "employer" || current.role === "employer" ? "employer" : "admin";
    state.lens = detail?.employerLens || current.employerLens || "sponsor";
    if (state.role === "employer") bootstrapEmployer();
    else bootstrapOperationsInbox();
  }

  window.addEventListener("amavio:rolechange", (event) => syncRole(event.detail));
  window.addEventListener("amavio:pagechange", (event) => {
    syncRole(event.detail);
    if (event.detail?.page === "collaboration") bootstrapEmployer();
    if (event.detail?.page === "operations") bootstrapOperationsInbox();
  });
  syncRole();
}());

