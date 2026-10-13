(function () {
  "use strict";

  const q = (selector, root) => (root || document).querySelector(selector);
  const qa = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const sessionByRole = {
    admin: "demo-session-operations",
    sponsor: "demo-session-employer-sponsor",
    hr: "demo-session-employer-hr",
    location: "demo-session-employer-location",
    budget: "demo-session-employer-budget",
  };
  const state = { portfolio: [], detail: null, simulationId: null, providerStatus: null, evaluation: null, mode: "evidence", artifacts: {}, role: "admin", employerLens: "sponsor", access: null, bootstrapSequence: 0 };
  state.role = document.body.dataset.role === "employer" ? "employer" : "admin";
  state.employerLens = document.querySelector("[data-employer-lens]")?.value || "sponsor";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const formatDate = (value) => value ? new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "–";
  const formatTime = (value) => value ? new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "–";

  async function request(path, options) {
    const method = String(options?.method || "GET").toUpperCase();
    const mutationHeaders = method === "GET" || method === "HEAD" ? {} : { "idempotency-key": `ui-${crypto.randomUUID()}` };
    const session = state.role === "admin" ? sessionByRole.admin : sessionByRole[state.employerLens];
    const response = await fetch(path, { ...options, headers: { "content-type": "application/json", "x-demo-session": session, ...mutationHeaders, ...(options?.headers || {}) } });
    const payload = await response.json().catch(() => ({ error: "Ungültige Serverantwort" }));
    if (!response.ok) {
      const error = new Error(payload.error || `HTTP ${response.status}`);
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  const roleExperience = {
    operations: {
      headings: ["Lage", "Verantwortung", "Auswirkung", "Entscheidung", "Ergebnis"],
      descriptions: [
        "Was ist bekannt, was widerspricht sich und was muss geklärt werden?",
        "Wer übernimmt welchen nächsten Schritt bis wann?",
        "Welche Folgen hätte eine Änderung für Aufgaben und Fristen?",
        "Welche Option wird mit einer nachvollziehbaren Begründung gewählt?",
        "Aus dem geprüften Stand entsteht ein klarer interner Entwurf.",
      ],
    },
    employer_sponsor: {
      headings: ["Statusgrundlage", "Sponsor-Verantwortung", "Auswirkungen", "Entscheidung", "Freigegebener Status"],
      descriptions: ["Verdichtete Abweichungen und Entscheidungsgrundlagen ohne interne AMAVIO-Fachlogik.", "Nur Sponsoraufgaben und offene Eskalationen.", "Von AMAVIO vorbereitete Auswirkungen sind lesbar; eigene Simulationen sind gesperrt.", "Nur der Sponsor dokumentiert ihm zugewiesene Entscheidungen.", "Nur fachlich freigegebene Statusprodukte werden geteilt."],
    },
    employer_hr: {
      headings: ["Arbeitgeberbelege", "HR-Aufgaben", "Terminbezug", "Rückfragen", "Status"],
      descriptions: ["Nur HR-relevante synthetische Belege und deren Prüfstatus.", "Nur Aufgaben, die HR Operations zugewiesen sind.", "Relevante Termine sind lesbar; interne Neuplanung bleibt bei AMAVIO.", "HR sieht keine Sponsor- oder Budgetentscheidung.", "Freigegebene Statusinformationen ohne interne Ereignisspur."],
    },
    employer_location: {
      headings: ["Standortangaben", "Übergaben", "Termine", "Bestätigung", "Status"],
      descriptions: ["Nur standort-, wohn- und übergabebezogene synthetische Angaben.", "Nur Aufgaben der Standort- und Facility-Verantwortung.", "Standorttermine sind lesbar; Simulation und Replanning bleiben intern.", "Nur zugewiesene Standortbelege können bestätigt werden.", "Freigegebene Statusinformationen ohne interne Policy-Auswertung."],
    },
    employer_budget: {
      headings: ["Kostengrundlage", "Budgetaufgabe", "Auswirkung", "Freigabe", "Beschluss"],
      descriptions: ["Nur synthetische Kosten- und Budgetgrundlagen.", "Nur Aufgaben der Budgetverantwortung.", "Operative Auswirkungen werden zusammengefasst; interne Simulationen bleiben gesperrt.", "Nur zugewiesene Budgetentscheidungen können begründet dokumentiert werden.", "Der lokale Beschluss bleibt ohne Außenwirkung."],
    },
  };

  function hasAction(action) { return Boolean(state.access?.allowedActions?.includes(action)); }

  function applyRoleExperience(access) {
    state.access = access;
    const employer = access?.roleGroup === "employer";
    const copy = roleExperience[access?.role] || roleExperience.operations;
    document.body.dataset.operationsRole = access?.role || "operations";
    q("[data-ops-role-label]").textContent = access?.label || "AMAVIO Operations";
    q("[data-ops-role-title]").textContent = access?.scopeTitle || "Vollständige operative Fallsteuerung";
    q("[data-ops-role-description]").textContent = access?.scopeDescription || "Lokale operative Arbeitsoberfläche.";
    const journeyHeadings = employer ? (access?.journey || copy.headings) : copy.headings;
    qa("[data-ops-mode]").forEach((button, index) => { const label = button.querySelector("b"); if (label) label.textContent = journeyHeadings[index] || copy.headings[index]; });
    qa("[data-ops-panel] .journey-panel-head").forEach((head, index) => {
      const title = head.querySelector("h3"); const description = head.querySelector("p");
      if (title) title.textContent = copy.headings[index];
      if (description) description.textContent = copy.descriptions[index];
    });
    qa("[data-ops-internal-only]").forEach((node) => { node.hidden = employer; });
    qa("[data-ops-employer-only]").forEach((node) => { node.hidden = !employer; });
    q("[data-role-simulation-copy]").textContent = employer ? "AMAVIO Operations bereitet Terminvarianten und kritische Pfade vor. Diese Rolle kann Auswirkungen einsehen, aber keine Simulation erzeugen oder übernehmen." : "";
    q("[data-role-product-copy]").textContent = employer ? "Hier erscheinen ausschließlich durch AMAVIO fachlich freigegebene Statusinformationen. Interne Entwürfe, Quellenketten und Ereignisprotokolle bleiben getrennt." : "";
    q("[data-context-use]").textContent = employer ? access.label : "Nur AMAVIO Operations";
    q("[data-context-use-detail]").textContent = employer ? "Minimierte Rollenprojektion" : "Internes Arbeitsprodukt";
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

  function setMode(mode, options = {}) {
    if (!q(`[data-ops-panel="${mode}"]`)) return;
    state.mode = mode;
    qa("[data-ops-mode]").forEach((button) => {
      const active = button.dataset.opsMode === mode;
      button.setAttribute("aria-selected", active ? "true" : "false");
      button.tabIndex = active ? 0 : -1;
      button.classList.toggle("is-current", active);
      const label = button.querySelector("small");
      if (label) label.textContent = active ? "Aktuell" : (label.dataset.baseState || "Ausstehend");
    });
    qa("[data-ops-panel]").forEach((panel) => { panel.hidden = panel.dataset.opsPanel !== mode; });
    q(`[data-ops-panel="${mode}"]`)?.focus({ preventScroll: true });
    if (options.route !== false) window.AMAVIO_NAVIGATION?.updateContext({ opsMode: mode }, { history: options.history || "replace" });
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
      ...triggered.filter((item) => !["R-02"].includes(item.id)).slice(0, 1).map((item) => ({ type: "warning", title: item.title, text: item.explanation, target: "responsibility" })),
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
      ${item.canUpdate ? `<button type="button" data-ops-complete-task="${escapeHtml(item.id)}" data-task-version="${item.version}" ${item.status === "completed" ? "disabled" : ""}>${item.status === "completed" ? "Erledigt" : "Lokal erledigen"}</button>` : `<span class="role-read-only">Nur lesbar</span>`}
    </div>`).join("") || "<p>Für diese Rolle ist in diesem Fall keine Aufgabe zugewiesen.</p>";
  }

  function evidenceStatusLabel(status) {
    return ({ confirmed: "Bestätigt", rejected: "Zurückgewiesen", superseded: "Ersetzt", conflicting: "Widersprüchlich", unreviewed: "Ungeprüft" })[status] || status;
  }

  function renderEvidence(detail) {
    const cards = detail.evidence.map((item, index) => `<article class="ops-evidence-card${item.reviewStatus === "conflicting" ? " is-conflicting" : ""}">
      <span class="evidence-index">${index + 1}</span>
      <div><h4>${escapeHtml(item.label)}</h4><p>${escapeHtml(item.assertion)}</p><small>${escapeHtml(item.source)} · gültig bis ${formatDate(item.validUntil)} · ${evidenceStatusLabel(item.reviewStatus)}</small>${item.reviewNote ? `<p>Prüfnotiz: ${escapeHtml(item.reviewNote)}</p>` : ""}</div>
      ${item.canReview ? `<div class="ops-evidence-actions">
        <button type="button" data-ops-review-evidence="${escapeHtml(item.id)}" data-evidence-status="confirmed" data-evidence-version="${item.version}">Bestätigen</button>
        <button type="button" data-ops-review-evidence="${escapeHtml(item.id)}" data-evidence-status="rejected" data-evidence-version="${item.version}">Zurückweisen</button>
      </div>` : `<span class="role-read-only">Nur lesbar</span>`}
    </article>`).join("");
    q("[data-ops-evidence]").innerHTML = cards || "<p>Für diese Rolle sind keine Belege freigegeben.</p>";
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
    container.innerHTML = `<div class="decision-guard"><b>Menschliche Entscheidung erforderlich</b><p>${escapeHtml(decision.question)}</p><small>${escapeHtml(decision.deciderRole)} · keine automatische Übernahme</small></div>
      ${decision.canReview ? `
      <form class="ops-decision-form" data-ops-decision-form data-decision-id="${escapeHtml(decision.id)}">
        <label for="ops-decision-option">Option<select id="ops-decision-option" data-ops-decision-option>${decision.options.map((option) => `<option>${escapeHtml(option)}</option>`).join("")}</select></label>
        <label for="ops-decision-note">Begründung<textarea id="ops-decision-note" rows="3" data-ops-decision-note placeholder="Menschliche Prüfbegründung"></textarea></label>
        <button type="submit" class="primary-action">Entscheidung lokal dokumentieren</button>
      </form>` : `<p class="role-read-only">Diese Entscheidung ist einer anderen Rolle zugewiesen.</p>`}`;
  }

  function renderProducts(detail) {
    const briefs = detail.workProducts.filter((item) => item.product_type === "arrival_readiness_brief");
    q("[data-ops-products]").innerHTML = briefs.map((item) => `<article class="ops-product-card"><div class="product-header"><div><span>Früherer interner Entwurf</span><h4>${escapeHtml(item.title)}</h4></div><b>Keine Außenwirkung</b></div><p>${escapeHtml(item.content.summary)}</p><small>${item.sourceRefs.length} Quellen · lokal dokumentiert</small>${(item.content.sections || []).map((section) => `<section><b>${escapeHtml(section.title)}</b><p>${escapeHtml(section.text)}</p></section>`).join("")}</article>`).join("");
  }

  function artifactReview(artifact) {
    if (artifact.status !== "awaiting_human_review") return `<div class="kernel-artifact-meta"><span>Prüfstatus: ${escapeHtml(artifact.status)}</span><span>Keine automatische Wirkung</span></div>`;
    return `<div class="kernel-review"><label>Prüfbegründung<textarea rows="2" data-v2-review-note="${escapeHtml(artifact.id)}" placeholder="Warum ist dieses lokale Fachartefakt nachvollziehbar?"></textarea></label><button type="button" class="secondary-action" data-v2-review-artifact="${escapeHtml(artifact.id)}" data-v2-review-version="${artifact.reviewVersion}">Fachlich bestätigen</button></div>`;
  }

  function renderVerticalArtifact(artifact) {
    if (!artifact) return;
    state.artifacts[artifact.artifactType] = artifact;
    if (artifact.artifactType === "evidence_reconciliation") {
      const target = q("[data-v2-reconciliation-output]");
      target.classList.toggle("is-approved", artifact.status === "approved");
      target.innerHTML = `<h5>${escapeHtml(artifact.content.clarificationOrder.title)}</h5><p>${escapeHtml(artifact.content.summary)}</p><ul>${artifact.content.conflicts.map((item) => `<li>${escapeHtml(item.groupId)} · ${item.claims.length} Aussagen · ${escapeHtml(item.status)}</li>`).join("")}${artifact.content.missingEvidence.map((item) => `<li>Fehlend/ungeprüft: ${escapeHtml(item.label)} · ${escapeHtml(item.reason)}</li>`).join("")}</ul><div class="kernel-artifact-meta"><span>${escapeHtml(artifact.id)}</span><span>${artifact.content.clarificationOrder.citations.length} Quellen</span><span>Frist ${formatDate(artifact.content.clarificationOrder.dueDate)}</span></div>${artifactReview(artifact)}`;
    }
    if (artifact.artifactType === "critical_path_replan") {
      const target = q("[data-v2-replan-output]");
      target.classList.toggle("is-approved", artifact.status === "approved");
      target.innerHTML = `<h5>Begründete Anpassungsvorlage</h5><p>${escapeHtml(artifact.content.summary)}</p><ul>${artifact.content.proposal.changes.slice(0, 6).map((item) => `<li>${escapeHtml(item.title)} · ${formatDate(item.from)} → ${formatDate(item.to)} · ${escapeHtml(item.ownerRole)}</li>`).join("")}</ul><div class="kernel-artifact-meta"><span>${escapeHtml(artifact.id)}</span><span>Basisversion ${artifact.baseCaseVersion}</span><span>Originalfall unverändert</span></div>${artifactReview(artifact)}`;
    }
    if (artifact.artifactType === "arrival_readiness_brief") {
      const target = q("[data-v2-brief-output]");
      target.classList.toggle("is-approved", artifact.status === "approved");
      target.innerHTML = `<div class="product-header"><div><span>Interner Entwurf</span><h4>${escapeHtml(artifact.content.title)}</h4></div><span class="quality-score"><b>${artifact.quality.score}</b>/100</span></div><p>${escapeHtml(artifact.content.summary)}</p>${artifact.content.sections.map((section) => `<section><b>${escapeHtml(section.title)}</b><p>${escapeHtml(section.text)}</p></section>`).join("")}<div class="kernel-artifact-meta"><span>${artifact.content.sourceRefs.length} Quellen</span><span>lokal dokumentiert</span><span>nicht versendet</span></div>${artifactReview(artifact)}`;
      q("[data-ops-product-status]").textContent = `Entwurf lokal erzeugt · Qualität ${artifact.quality.score}/100 · nicht versendet.`;
      q("[data-context-product-status]").textContent = "Entwurf erstellt";
      q("[data-context-product-detail]").textContent = `${artifact.content.sourceRefs.length} Quellen · ${artifact.quality.score}/100`;
    }
  }

  function updateJourneyState(detail) {
    const hasConflict = detail.evidence.some((item) => item.reviewStatus === "conflicting" || item.reviewStatus === "unreviewed");
    const openTasks = detail.tasks.filter((item) => item.status !== "completed");
    const hasSimulation = detail.simulations.length > 0;
    const openDecision = detail.decisions.some((item) => item.status === "open");
    const hasBrief = detail.workProducts.some((item) => item.product_type === "arrival_readiness_brief");
    const labels = {
      evidence: hasConflict ? "Prüfung offen" : "Geprüft",
      responsibility: openTasks.length ? "Als Nächstes" : "Geklärt",
      simulation: hasSimulation ? "Variante vorhanden" : "Ausstehend",
      decision: openDecision ? "Ausstehend" : "Dokumentiert",
      products: hasBrief ? "Entwurf erstellt" : "Ausstehend",
    };
    qa("[data-journey-state]").forEach((label) => {
      label.dataset.baseState = labels[label.dataset.journeyState];
      if (label.closest("button")?.dataset.opsMode !== state.mode) label.textContent = label.dataset.baseState;
    });
    qa("[data-ops-mode]").forEach((button) => {
      const value = labels[button.dataset.opsMode];
      button.classList.toggle("is-complete", ["Geprüft", "Geklärt", "Variante vorhanden", "Dokumentiert", "Entwurf erstellt"].includes(value));
    });
  }

  function renderContext(detail) {
    const openTask = detail.tasks.find((item) => item.status !== "completed");
    const openDecision = detail.decisions.find((item) => item.status === "open");
    const brief = detail.workProducts.find((item) => item.product_type === "arrival_readiness_brief");
    const kernel = detail.kernel;
    const next = kernel?.orchestration?.nextResponsibility;
    const sourceCount = kernel?.evidenceGraph?.summary?.sourceReferenceCount ?? (detail.evidence.length + detail.rules.filter((item) => item.triggered).length);
    const contextRail = q(".release-g-context");
    if (contextRail) contextRail.dataset.kernelContract = kernel?.contractVersion || "local-fallback";
    q("[data-context-owner]").textContent = next?.ownerRole || openTask?.ownerRole || detail.case.ownerRole || "AMAVIO Operations";
    q("[data-context-task]").textContent = next?.task || openTask?.title || "Keine offene Aufgabe";
    q("[data-context-due]").textContent = formatDate(next?.dueDate || openTask?.dueDate);
    q("[data-context-human-gate]").textContent = kernel?.orchestration?.humanGate?.label || (openDecision ? "Entscheidung erforderlich" : "Dokumentiert");
    q("[data-context-product-status]").textContent = brief ? "Entwurf erstellt" : "Entwurf";
    q("[data-context-product-detail]").textContent = brief ? `${brief.sourceRefs.length} Quellen · ${brief.status}` : "Noch nicht erstellt";
    q("[data-context-source-count]").textContent = `${sourceCount} Referenzen`;
    q("[data-responsibility-summary]").innerHTML = (next || openTask) ? `<span>Nächste Verantwortung</span><h4>${escapeHtml(next?.ownerRole || openTask.ownerRole)}</h4><p>${escapeHtml(next?.task || openTask.title)}</p><dl><div><dt>Frist</dt><dd>${formatDate(next?.dueDate || openTask.dueDate)}</dd></div><div><dt>Abhängigkeit</dt><dd>${escapeHtml(next?.dependency || openTask.blockedReason || "keine harte Blockade dokumentiert")}</dd></div></dl>` : "<p>Keine offene Verantwortung in diesem Fall.</p>";
  }

  function renderEvents(detail) {
    q("[data-ops-events]").innerHTML = detail.events.map((item) => `<li><time datetime="${escapeHtml(item.created_at)}">${formatTime(item.created_at)}</time><span><b>${escapeHtml(item.event_type)}</b><small>${escapeHtml(JSON.stringify(item.payload))}</small></span></li>`).join("") || "<li><span>Noch kein Gate-01.5-Ereignis gespeichert.</span></li>";
  }

  function renderProviderStatus(status) {
    state.providerStatus = status;
    const target = q("[data-ops-provider-status]");
    if (!target || !status) return;
    target.innerHTML = status.providers.map((provider) => `<div><dt>${escapeHtml(provider.id === "local" ? "AMAVIO lokal" : provider.id)}</dt><dd>${escapeHtml(provider.id === "local" ? "aktiv" : "Adapter bereit · Gate zu")}</dd></div>`).join("");
  }

  function renderDetail(detail) {
    state.detail = detail;
    applyRoleExperience(detail.access || state.access);
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
    q("[data-v2-create-replan]").disabled = true;
    q("[data-ops-simulation-note]").value = "";
    renderMilestones(detail);
    renderNotices(detail);
    renderTasks(detail);
    renderEvidence(detail);
    renderExceptions(detail);
    renderDecision(detail);
    renderProducts(detail);
    renderEvents(detail);
    renderContext(detail);
    updateJourneyState(detail);
    renderPortfolio(q("[data-ops-search]")?.value || "");
    window.dispatchEvent(new CustomEvent("amavio:case-rendered", { detail: { caseId: item.id, role: state.role, employerLens: state.employerLens } }));
  }

  async function loadCase(caseId, preserveMode = true, options = {}) {
    const selectedMode = options.mode || q("[data-ops-mode][aria-selected='true']")?.dataset.opsMode || "evidence";
    const [detail, portfolioPayload, kernelContext] = await Promise.all([
      request(`/api/v1.5/cases/${encodeURIComponent(caseId)}`),
      request("/api/v1.5/portfolio"),
      hasAction("kernel.read") ? request(`/api/kernel/v1/cases/${encodeURIComponent(caseId)}/context`).catch(() => null) : Promise.resolve(null),
    ]);
    detail.kernel = kernelContext;
    state.portfolio = portfolioPayload.cases;
    renderDetail(detail);
    setMode(preserveMode ? selectedMode : (options.mode || "evidence"), { route: false });
    if (options.route !== false) window.AMAVIO_NAVIGATION?.updateContext({ opsCase: state.detail?.case.id || caseId, opsMode: state.mode }, { history: options.history || "replace" });
  }

  async function bootstrap() {
    const sequence = ++state.bootstrapSequence;
    try {
      const payload = await request("/api/v1.5/bootstrap");
      if (sequence !== state.bootstrapSequence) return;
      state.access = payload.access;
      state.portfolio = payload.portfolio;
      renderProviderStatus(payload.providerStatus);
      if (payload.selected) {
        payload.selected.kernel = hasAction("kernel.read") ? await request(`/api/kernel/v1/cases/${encodeURIComponent(payload.selected.case.id)}/context`).catch(() => null) : null;
        if (sequence !== state.bootstrapSequence) return;
        renderDetail(payload.selected);
      } else {
        applyRoleExperience(payload.access);
        state.detail = null;
        q("[data-ops-case-title]").textContent = "Keine Fälle für diese Rolle";
        q("[data-ops-case-meta]").textContent = "Die Rollenprojektion enthält aktuell keinen zugewiesenen synthetischen Fall.";
      }
      renderPortfolio();
      const desiredCase = window.AMAVIO_NAVIGATION?.param("opsCase");
      const desiredMode = window.AMAVIO_NAVIGATION?.param("opsMode") || "evidence";
      const visibleCase = desiredCase && state.portfolio.some((item) => item.id === desiredCase) ? desiredCase : state.detail?.case.id;
      if (visibleCase && state.detail?.case.id !== visibleCase) await loadCase(visibleCase, false, { route: false, mode: desiredMode });
      else setMode(desiredMode, { route: false });
      window.AMAVIO_NAVIGATION?.updateContext({ opsCase: state.detail?.case.id || "", opsMode: state.mode }, { history: "replace" });
      setRuntime(true, payload.access?.roleGroup === "employer" ? "Lokale Rollenprojektion aktiv" : "Lokale Domain Engine und Datenbank aktiv");
    } catch (error) {
      setRuntime(false, "Gate-01.5-Backend nicht gestartet");
      showToast(`Lokale Arbeitsfläche nicht verfügbar: ${error.message}`, true);
    }
  }

  qa("[data-ops-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.opsMode)));
  qa("[data-ops-next]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.opsNext)));
  q("[data-ops-search]")?.addEventListener("input", (event) => renderPortfolio(event.target.value));

  q("[data-ops-case-list]")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-ops-case-id]");
    if (!button) return;
    try { await loadCase(button.dataset.opsCaseId, false, { history: "push" }); }
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

    const reconciliation = event.target.closest("[data-v2-create-reconciliation]");
    if (reconciliation) {
      reconciliation.disabled = true;
      q("[data-v2-reconciliation-output]").innerHTML = "<p>Quellen werden lokal abgeglichen …</p>";
      try {
        const payload = await request(`/api/kernel/v2/cases/${encodeURIComponent(state.detail.case.id)}/evidence-reconciliations`, { method: "POST", body: "{}" });
        renderVerticalArtifact(payload.artifact);
        showToast("Klärungsauftrag lokal und quellenbezogen vorbereitet.");
      } catch (error) { q("[data-v2-reconciliation-output]").textContent = error.message; }
      finally { reconciliation.disabled = false; }
      return;
    }

    const replan = event.target.closest("[data-v2-create-replan]");
    if (replan) {
      replan.disabled = true;
      q("[data-v2-replan-output]").innerHTML = "<p>Kritischer Pfad wird lokal neu berechnet …</p>";
      try {
        const payload = await request(`/api/kernel/v2/cases/${encodeURIComponent(state.detail.case.id)}/replans`, { method: "POST", body: JSON.stringify({ event: { type: "arrival_date_changed", effectiveDate: q("[data-ops-arrival-date]").value, reason: "Die in der Fallreise simulierte Anreiseänderung wird als fachliche Anpassungsvorlage geprüft." } }) });
        renderVerticalArtifact(payload.artifact);
        showToast("Anpassungsvorlage lokal berechnet; Originalfall unverändert.");
      } catch (error) { q("[data-v2-replan-output]").textContent = error.message; replan.disabled = false; }
      return;
    }

    const review = event.target.closest("[data-v2-review-artifact]");
    if (review) {
      const note = q(`[data-v2-review-note="${CSS.escape(review.dataset.v2ReviewArtifact)}"]`)?.value.trim();
      if (!note) { showToast("Für die Bestätigung ist eine Prüfbegründung erforderlich.", true); return; }
      review.disabled = true;
      try {
        const payload = await request(`/api/kernel/v2/artifacts/${encodeURIComponent(review.dataset.v2ReviewArtifact)}/review`, { method: "POST", body: JSON.stringify({ decision: "approved", note, version: Number(review.dataset.v2ReviewVersion) }) });
        renderVerticalArtifact(payload.artifact);
        showToast("Fachartefakt menschlich bestätigt; weiterhin ohne Außenwirkung.");
      } catch (error) { showToast(error.message, true); review.disabled = false; }
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
        setMode("products");
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
        q("[data-v2-create-replan]").disabled = false;
        q("[data-ops-simulation-status]").textContent = "Isolierte Variante gespeichert · Originalfall unverändert.";
        updateJourneyState({ ...state.detail, simulations: [{ id: simulation.id }, ...state.detail.simulations] });
      } catch (error) { showToast(error.message, true); }
      finally { button.disabled = false; }
      return;
    }

    const productForm = event.target.closest("[data-ops-product-form]");
    if (productForm) {
      event.preventDefault(); const button = productForm.querySelector("button"); button.disabled = true;
      try {
        const payload = await request(`/api/kernel/v2/cases/${encodeURIComponent(state.detail.case.id)}/readiness-briefs`, { method: "POST", body: "{}" });
        renderVerticalArtifact(payload.artifact);
        showToast("Arrival Readiness Brief reproduzierbar erzeugt und gegen die Qualitätsrubrik geprüft.");
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

  window.addEventListener("amavio:rolechange", (event) => {
    state.role = event.detail?.role === "admin" ? "admin" : "employer";
    state.employerLens = event.detail?.employerLens || "sponsor";
    q("[data-ops-role-label]").textContent = "Ansicht wird geladen";
    if (state.role === "employer") qa("[data-ops-internal-only]").forEach((node) => { node.hidden = true; });
    state.detail = null;
    state.portfolio = [];
    state.artifacts = {};
    state.simulationId = null;
    bootstrap();
  });

  window.addEventListener("amavio:routechange", async (event) => {
    if (event.detail?.page !== "operations" || !state.portfolio.length) return;
    const desiredCase = event.detail.opsCase;
    const desiredMode = event.detail.opsMode || "evidence";
    try {
      if (desiredCase && desiredCase !== state.detail?.case.id && state.portfolio.some((item) => item.id === desiredCase)) await loadCase(desiredCase, false, { route: false, mode: desiredMode });
      else setMode(desiredMode, { route: false });
    } catch (error) { showToast(error.message, true); }
  });

  bootstrap();
}());
