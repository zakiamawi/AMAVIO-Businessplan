(function () {
  "use strict";

  const q = (selector, root) => (root || document).querySelector(selector);
  const qa = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const sessionHeaders = { "content-type": "application/json", "x-demo-session": "demo-session-alpha" };
  const state = { portfolio: [], detail: null, simulationId: null, providerStatus: null, evaluation: null };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const formatDate = (value) => value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "–";
  const formatTime = (value) => value ? new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "–";

  async function request(path, options) {
    const method = String(options?.method || "GET").toUpperCase();
    const mutationHeaders = method === "GET" || method === "HEAD" ? {} : { "idempotency-key": `ui-${crypto.randomUUID()}` };
    const response = await fetch(path, { ...options, headers: { ...sessionHeaders, ...mutationHeaders, ...(options?.headers || {}) } });
    const payload = await response.json().catch(() => ({ error: "Ungültige Serverantwort" }));
    if (!response.ok) {
      const error = new Error(payload.error || `HTTP ${response.status}`);
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  function showToast(message, error = false) {
    const toast = q("[data-ops-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle("is-error", error);
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 3_600);
  }

  function setRuntime(online, message) {
    const runtime = q(".ops-runtime");
    runtime?.classList.toggle("is-online", online);
    runtime?.classList.toggle("is-offline", !online);
    const label = q("[data-ops-runtime]");
    if (label) label.textContent = message;
  }

  function setMode(mode) {
    qa("[data-ops-mode]").forEach((button) => {
      const active = button.dataset.opsMode === mode;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
    });
    qa("[data-ops-panel]").forEach((panel) => { panel.hidden = panel.dataset.opsPanel !== mode; });
  }

  function readinessClass(readiness) {
    if (readiness === "blocked") return "is-blocked";
    if (readiness === "ready") return "is-ready";
    return "is-watch";
  }

  function renderPortfolio(filter = "") {
    const list = q("[data-ops-case-list]");
    if (!list) return;
    const needle = filter.trim().toLocaleLowerCase("de-DE");
    const visible = state.portfolio.filter((item) => [item.id, item.title, item.location].join(" ").toLocaleLowerCase("de-DE").includes(needle));
    q("[data-ops-case-count]").textContent = `${visible.length} Fälle`;
    list.innerHTML = visible.map((item) => {
      const selected = state.detail?.case.id === item.id;
      return `<button type="button" class="ops-case-button${selected ? " is-selected" : ""}" data-ops-case-id="${escapeHtml(item.id)}" aria-pressed="${selected}">
        <span><span>${escapeHtml(item.id.replace("SYN-CASE-", "A-"))}</span><span class="case-status ${readinessClass(item.readiness)}">${escapeHtml(item.readinessLabel.split(" · ")[0])}</span></span>
        <b>${escapeHtml(item.title)}</b>
        <small>${escapeHtml(item.location)} · Anreise ${formatDate(item.arrivalDate)}</small>
      </button>`;
    }).join("") || "<p>Keine synthetischen Fälle gefunden.</p>";
  }

  function renderMilestones(detail) {
    q("[data-ops-milestones]").innerHTML = detail.milestones.map((item) => `<div class="ops-milestone-row${item.critical ? " is-critical" : ""}${item.status === "blocked" ? " is-blocked" : ""}" role="row">
      <span role="cell">${item.sequence}</span>
      <span class="ops-milestone-title" role="cell"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.detail)}</small></span>
      <span class="ops-owner" role="cell">${escapeHtml(item.ownerRole)}</span>
      <span class="ops-date" role="cell">${formatDate(item.dueDate)}</span>
      <span class="ops-status is-${escapeHtml(item.status)}" role="cell">${escapeHtml(item.status === "blocked" ? "Blockiert" : item.status === "completed" ? "Erledigt" : "Offen")}</span>
    </div>`).join("");
  }

  function renderNotices(detail) {
    const conflicts = detail.evidence.filter((item) => item.reviewStatus === "conflicting");
    const triggered = detail.rules.filter((item) => item.triggered);
    const notices = [
      ...conflicts.map((item) => ({ type: "error", title: "Evidenzkonflikt", text: `${item.label}: ${item.assertion}`, target: "evidence" })),
      ...triggered.filter((item) => !["R-02"].includes(item.id)).slice(0, 2).map((item) => ({ type: "warning", title: item.title, text: item.explanation, target: "exceptions" })),
    ];
    q("[data-ops-notices]").innerHTML = notices.map((item) => `<div class="ops-notice ${item.type === "warning" ? "is-warning" : ""}">
      <span aria-hidden="true">${item.type === "warning" ? "!" : "×"}</span>
      <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.text)}</small></span>
      <a href="#" data-ops-jump="${item.target}">Details anzeigen</a>
    </div>`).join("") || "<p>Keine aktiven Regelhinweise.</p>";
  }

  function renderTasks(detail) {
    q("[data-ops-tasks]").innerHTML = detail.tasks.map((item) => `<div class="ops-task-row">
      <span>${formatDate(item.dueDate)}</span>
      <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.ownerRole)}${item.blockedReason ? ` · blockiert: ${escapeHtml(item.blockedReason)}` : ""}</small></span>
      <button type="button" data-ops-complete-task="${escapeHtml(item.id)}" data-task-version="${item.version}" ${item.status === "completed" ? "disabled" : ""}>${item.status === "completed" ? "Erledigt" : "Lokal erledigen"}</button>
    </div>`).join("");
  }

  function evidenceStatusLabel(status) {
    return ({ confirmed: "Bestätigt", rejected: "Zurückgewiesen", superseded: "Ersetzt", conflicting: "Widersprüchlich", unreviewed: "Ungeprüft" })[status] || status;
  }

  function renderEvidence(detail) {
    const cards = detail.evidence.map((item) => `<article class="ops-evidence-card${item.reviewStatus === "conflicting" ? " is-conflicting" : ""}">
      <div><h4>${escapeHtml(item.label)}</h4><p>${escapeHtml(item.assertion)}</p><small>${escapeHtml(item.source)} · gültig bis ${formatDate(item.validUntil)} · ${evidenceStatusLabel(item.reviewStatus)}</small>${item.reviewNote ? `<p>Prüfnotiz: ${escapeHtml(item.reviewNote)}</p>` : ""}</div>
      <div class="ops-evidence-actions">
        <button type="button" data-ops-review-evidence="${escapeHtml(item.id)}" data-evidence-status="confirmed" data-evidence-version="${item.version}">Bestätigen</button>
        <button type="button" data-ops-review-evidence="${escapeHtml(item.id)}" data-evidence-status="rejected" data-evidence-version="${item.version}">Zurückweisen</button>
      </div>
    </article>`).join("");
    q("[data-ops-evidence]").innerHTML = cards;
    q("[data-ops-rail-evidence]").innerHTML = detail.evidence.slice(0, 3).map((item) => `<div class="ops-rail-evidence-item${item.reviewStatus === "conflicting" ? " is-conflicting" : ""}"><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.assertion)}</small><small>${evidenceStatusLabel(item.reviewStatus)}</small></div>`).join("");
  }

  function renderExceptions(detail) {
    q("[data-ops-exceptions]").innerHTML = detail.exceptions.map((item) => `<article class="ops-exception-card"><div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.impact)}</p><small>${escapeHtml(item.severity)} · ${escapeHtml(item.playbook)} · ${escapeHtml(item.status)}</small></div></article>`).join("") || "<p>Keine aktive Ausnahme in diesem synthetischen Fall.</p>";
    q("[data-ops-rules]").innerHTML = detail.rules.map((item) => `<div class="ops-rule-row${item.triggered ? " is-triggered" : ""}"><b>${escapeHtml(item.id)}</b><span><b>${escapeHtml(item.title)}</b><br>${escapeHtml(item.explanation)}</span><span>${item.triggered ? "ausgelöst" : "nicht ausgelöst"}</span></div>`).join("");
  }

  function renderDecision(detail) {
    const container = q("[data-ops-decision]");
    const decision = detail.decisions.find((item) => item.status === "open");
    if (!decision) {
      container.innerHTML = "<p class=\"ops-decision-empty\">Keine offene Entscheidung. Der Verlauf bleibt vollständig auditierbar.</p>";
      return;
    }
    container.innerHTML = `<p class="ops-decision-question">${escapeHtml(decision.question)}</p>
      <form class="ops-decision-form" data-ops-decision-form data-decision-id="${escapeHtml(decision.id)}">
        <label for="ops-decision-option">Option<select id="ops-decision-option" data-ops-decision-option>${decision.options.map((option) => `<option>${escapeHtml(option)}</option>`).join("")}</select></label>
        <label for="ops-decision-note">Begründung<textarea id="ops-decision-note" rows="3" data-ops-decision-note placeholder="Menschliche Prüfbegründung"></textarea></label>
        <button type="submit" class="primary-action">Entscheidung lokal dokumentieren</button>
      </form>`;
  }

  function renderProducts(detail) {
    q("[data-ops-products]").innerHTML = detail.workProducts.map((item) => `<article class="ops-product-card"><div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.content.summary)}</p><small>${escapeHtml(item.id)} · ${escapeHtml(item.status)} · ${item.sourceRefs.length} Quellenreferenzen</small></div>${(item.content.sections || []).map((section) => `<section><b>${escapeHtml(section.title)}</b><p>${escapeHtml(section.text)}</p></section>`).join("")}</article>`).join("") || "<p>Noch kein lokales Arbeitsprodukt erzeugt.</p>";
  }

  function renderEvents(detail) {
    q("[data-ops-events]").innerHTML = detail.events.map((item) => `<li><time datetime="${escapeHtml(item.created_at)}">${formatTime(item.created_at)}</time><span><b>${escapeHtml(item.event_type)}</b><small>${escapeHtml(JSON.stringify(item.payload))}</small></span></li>`).join("") || "<li><span>Noch kein Gate-01.5-Ereignis gespeichert.</span></li>";
  }

  function renderProviderStatus(status) {
    state.providerStatus = status;
    const target = q("[data-ops-provider-status]");
    if (!target) return;
    target.innerHTML = status.providers.map((provider) => `<div><dt>${escapeHtml(provider.id === "local" ? "AMAVIO lokal" : provider.id)}</dt><dd>${escapeHtml(provider.id === "local" ? "aktiv" : "Adapter bereit · Gate zu")}</dd></div>`).join("");
  }

  function renderDetail(detail) {
    state.detail = detail;
    const item = detail.case;
    q("[data-ops-case-context]").textContent = `${item.mandate} · ${item.cohort}`;
    q("[data-ops-case-title]").textContent = item.title;
    q("[data-ops-case-meta]").textContent = `${item.id.replace("SYN-CASE-", "Fall A-")} · ${item.location} · Anreise ${formatDate(item.arrivalDate)} · Version ${item.version}`;
    const readiness = q("[data-ops-readiness]");
    readiness.className = `ops-readiness ${readinessClass(item.readiness)}`;
    readiness.querySelector("b").textContent = item.readinessLabel;
    q("[data-ops-arrival-date]").value = item.arrivalDate;
    state.simulationId = null;
    q("[data-ops-simulation-result]").hidden = true;
    q("[data-ops-simulation-delta]").innerHTML = "";
    q("[data-ops-apply-simulation]").disabled = true;
    q("[data-ops-simulation-note]").value = "";
    renderMilestones(detail);
    renderNotices(detail);
    renderTasks(detail);
    renderEvidence(detail);
    renderExceptions(detail);
    renderDecision(detail);
    renderProducts(detail);
    renderEvents(detail);
    renderPortfolio(q("[data-ops-search]")?.value || "");
  }

  async function loadCase(caseId, preserveMode = true) {
    const selectedMode = q("[data-ops-mode][aria-selected='true']")?.dataset.opsMode || "overview";
    const [detail, portfolioPayload] = await Promise.all([
      request(`/api/v1.5/cases/${encodeURIComponent(caseId)}`),
      request("/api/v1.5/portfolio"),
    ]);
    state.portfolio = portfolioPayload.cases;
    renderDetail(detail);
    setMode(preserveMode ? selectedMode : "overview");
  }

  async function bootstrap() {
    try {
      const payload = await request("/api/v1.5/bootstrap");
      state.portfolio = payload.portfolio;
      renderProviderStatus(payload.providerStatus);
      if (payload.selected) renderDetail(payload.selected);
      renderPortfolio();
      setRuntime(true, "Lokale Domain Engine und Datenbank aktiv");
    } catch (error) {
      setRuntime(false, "Gate-01.5-Backend nicht gestartet");
      showToast(`Lokale Arbeitsfläche nicht verfügbar: ${error.message}`, true);
    }
  }

  qa("[data-ops-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.opsMode)));
  q("[data-ops-search]")?.addEventListener("input", (event) => renderPortfolio(event.target.value));
  q("[data-ops-open-evidence]")?.addEventListener("click", () => setMode("evidence"));

  q("[data-ops-case-list]")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-ops-case-id]");
    if (!button) return;
    try { await loadCase(button.dataset.opsCaseId, false); }
    catch (error) { showToast(error.message, true); }
  });

  q(".operations-page")?.addEventListener("click", async (event) => {
    const jump = event.target.closest("[data-ops-jump]");
    if (jump) { event.preventDefault(); setMode(jump.dataset.opsJump); return; }

    const task = event.target.closest("[data-ops-complete-task]");
    if (task) {
      task.disabled = true;
      try {
        await request(`/api/v1.5/tasks/${encodeURIComponent(task.dataset.opsCompleteTask)}`, { method: "PATCH", body: JSON.stringify({ status: "completed", note: "In der synthetischen Arbeitsfläche menschlich als erledigt markiert.", version: Number(task.dataset.taskVersion) }) });
        await loadCase(state.detail.case.id);
        showToast("Aufgabe lokal abgeschlossen und auditierbar gespeichert.");
      } catch (error) { showToast(error.message, true); }
      return;
    }

    const evidence = event.target.closest("[data-ops-review-evidence]");
    if (evidence) {
      evidence.disabled = true;
      const status = evidence.dataset.evidenceStatus;
      try {
        await request(`/api/v1.5/evidence/${encodeURIComponent(evidence.dataset.opsReviewEvidence)}/review`, { method: "POST", body: JSON.stringify({ status, note: `Synthetischer Beleg wurde menschlich ${status === "confirmed" ? "bestätigt" : "zurückgewiesen"}.`, version: Number(evidence.dataset.evidenceVersion) }) });
        await loadCase(state.detail.case.id);
        showToast("Evidenzprüfung lokal gespeichert.");
      } catch (error) { showToast(error.message, true); }
      return;
    }

    const capability = event.target.closest("[data-ops-capability]");
    if (capability) {
      capability.disabled = true;
      const output = q("[data-ops-capability-output]");
      output.hidden = false;
      output.textContent = "Lokale AMAVIO-Fachlogik wird ausgeführt …";
      try {
        const payload = await request("/api/v1.5/capabilities/runs", { method: "POST", body: JSON.stringify({ caseId: state.detail.case.id, capability: capability.dataset.opsCapability, provider: "local", instruction: "Erkläre den belegten Widerspruch und nenne nur sichere menschliche nächste Schritte." }) });
        output.innerHTML = `<b>${escapeHtml(payload.run.output.headline)}</b><br>${escapeHtml(payload.run.output.draft)}<br><small>Quellen: ${escapeHtml(payload.run.output.citations.join(", "))}</small>`;
        await loadCase(state.detail.case.id);
      } catch (error) { output.textContent = error.message; }
      finally { capability.disabled = false; }
    }
  });

  q(".operations-page")?.addEventListener("submit", async (event) => {
    const decisionForm = event.target.closest("[data-ops-decision-form]");
    if (decisionForm) {
      event.preventDefault();
      const button = decisionForm.querySelector("button"); button.disabled = true;
      try {
        await request(`/api/v1.5/decisions/${encodeURIComponent(decisionForm.dataset.decisionId)}/review`, { method: "POST", body: JSON.stringify({ option: q("[data-ops-decision-option]", decisionForm).value, rationale: q("[data-ops-decision-note]", decisionForm).value.trim() }) });
        await loadCase(state.detail.case.id);
        showToast("Menschliche Entscheidung lokal dokumentiert · keine Außenwirkung.");
      } catch (error) { showToast(error.message, true); button.disabled = false; }
      return;
    }

    const simulationForm = event.target.closest("[data-ops-simulation-form]");
    if (simulationForm) {
      event.preventDefault();
      const button = simulationForm.querySelector("button"); button.disabled = true;
      try {
        const payload = await request(`/api/v1.5/cases/${encodeURIComponent(state.detail.case.id)}/simulations`, { method: "POST", body: JSON.stringify({ arrivalDate: q("[data-ops-arrival-date]").value }) });
        const simulation = payload.simulation; state.simulationId = simulation.id;
        q("[data-ops-simulation-result]").hidden = false;
        q("[data-ops-sim-before]").textContent = formatDate(simulation.output.originalArrivalDate);
        q("[data-ops-sim-after]").textContent = formatDate(simulation.output.simulatedArrivalDate);
        q("[data-ops-sim-summary]").textContent = simulation.output.summary;
        q("[data-ops-simulation-delta]").innerHTML = simulation.output.impactedMilestones.map((item) => `<div class="ops-delta-row"><b>${escapeHtml(state.detail.milestones.find((milestone) => milestone.id === item.id)?.title || item.id)}</b><span>${formatDate(item.from)}</span><span>→</span><span>${formatDate(item.to)}</span></div>`).join("");
        q("[data-ops-apply-simulation]").disabled = false;
        q("[data-ops-simulation-status]").textContent = "Isolierte Variante gespeichert · Originalfall unverändert.";
      } catch (error) { showToast(error.message, true); }
      finally { button.disabled = false; }
      return;
    }

    const productForm = event.target.closest("[data-ops-product-form]");
    if (productForm) {
      event.preventDefault(); const button = productForm.querySelector("button"); button.disabled = true;
      try {
        const payload = await request(`/api/v1.5/cases/${encodeURIComponent(state.detail.case.id)}/work-products`, { method: "POST", body: JSON.stringify({ type: q("[data-ops-product-type]").value }) });
        q("[data-ops-product-status]").textContent = `${payload.workProduct.title} lokal erzeugt · ${payload.workProduct.sourceRefs.length} Quellen · sink_only.`;
        await loadCase(state.detail.case.id);
        showToast("Arbeitsprodukt mit Quellenreferenzen lokal gespeichert.");
      } catch (error) { showToast(error.message, true); }
      finally { button.disabled = false; }
    }
  });

  q("[data-ops-apply-simulation]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    const note = q("[data-ops-simulation-note]").value.trim();
    if (!state.simulationId || !note) { showToast("Für die Übernahme ist eine menschliche Prüfnotiz erforderlich.", true); return; }
    button.disabled = true;
    try {
      await request(`/api/v1.5/simulations/${encodeURIComponent(state.simulationId)}/apply`, { method: "POST", body: JSON.stringify({ selectedChanges: ["arrivalDate"], note }) });
      await loadCase(state.detail.case.id);
      q("[data-ops-simulation-status]").textContent = "Datumsänderung menschlich geprüft und lokal übernommen · keine Außenwirkung.";
      showToast("Simulation granular in eine neue Fallversion übernommen.");
    } catch (error) { showToast(error.message, true); button.disabled = false; }
  });

  q("[data-run-evaluation]")?.addEventListener("click", async (event) => {
    const button = event.currentTarget;
    button.disabled = true;
    q("[data-evaluation-results]").textContent = "Lokale Evaluationssuite wird ausgeführt …";
    try {
      const payload = await request("/api/v1.5/evaluations/runs", { method: "POST", body: "{}" });
      state.evaluation = payload.result;
      const summary = q("[data-evaluation-summary]");
      const values = summary.querySelectorAll("b");
      values[0].textContent = String(payload.result.total);
      values[1].textContent = String(payload.result.passed);
      values[2].textContent = String(payload.result.forbiddenActions);
      values[3].textContent = String(payload.result.crossTenantFindings);
      summary.children[1].querySelector("small").textContent = payload.result.failed === 0 ? "vollständig grün" : `${payload.result.failed} fehlgeschlagen`;
      q("[data-evaluation-results]").innerHTML = payload.result.scenarios.map((item) => `<div class="evaluation-result-row"><span>${escapeHtml(item.id)}</span><span>${escapeHtml(item.category)} · erwartet ${escapeHtml(item.expected)} · erhalten ${escapeHtml(item.actual)}</span><b>${item.passed ? "bestanden" : "fehlerhaft"}</b></div>`).join("");
    } catch (error) { q("[data-evaluation-results]").textContent = error.message; }
    finally { button.disabled = false; }
  });

  bootstrap();
}());
