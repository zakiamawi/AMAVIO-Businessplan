(function () {
  "use strict";

  const app = document.querySelector("#app");
  const gate = document.querySelector("[data-runtime-gate]");
  const gateTitle = document.querySelector("[data-runtime-title]");
  const gateMessage = document.querySelector("[data-runtime-message]");
  const gateStatus = document.querySelector("[data-runtime-status]");
  const gateActions = document.querySelector("[data-runtime-actions]");
  const toastRegion = document.querySelector("#toast-region");
  const params = new URLSearchParams(location.search);
  const allowedPages = new Set(["readiness", "decisions", "work-products", "programs"]);
  const incomingPage = params.get("page");
  const lensAliases = { sponsor: "governance", governance: "governance", hr: "hr", location: "location", budget: "budget" };

  const state = {
    role: params.get("role") === "operations" ? "operations" : "employer",
    lens: lensAliases[params.get("lens")] || "governance",
    page: allowedPages.has(incomingPage) ? incomingPage : incomingPage === "programs" ? "programs" : "readiness",
    scenarioId: params.get("scenario") || "housing-handover",
    data: null,
    busy: false,
  };

  const sessions = {
    operations: "demo-session-operations",
    governance: "demo-session-employer-sponsor",
    hr: "demo-session-employer-hr",
    location: "demo-session-employer-location",
    budget: "demo-session-employer-budget",
  };
  const workAreas = {
    governance: "Gesamtsteuerung",
    hr: "Personal & Onboarding",
    location: "Standort & Übergabe",
    budget: "Budget & Freigaben",
  };
  const readinessLabels = {
    unverified: "Ungeprüft",
    at_risk: "Gefährdet",
    conditional: "Unter Bedingungen",
    intervention_active: "Intervention aktiv",
    confirmed: "Bestätigt",
  };
  const readinessOrder = ["unverified", "at_risk", "conditional", "intervention_active", "confirmed"];

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const fmtDate = (value) => {
    if (!value) return "nicht terminiert";
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? esc(value) : new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  };
  const session = () => state.role === "operations" ? sessions.operations : sessions[state.lens];
  const uid = () => `release-p-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function icon(name) {
    const paths = {
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      readiness: '<path d="M5 4h14v16H5z"/><path d="m8 12 2 2 5-5"/>',
      decision: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
      file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h5"/>',
      program: '<path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 3v6M14 9v6M10 15v6"/>',
      arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      reset: '<path d="M20 6v5h-5M4 18v-5h5"/><path d="M18 9a7 7 0 0 0-12-2l-2 4M6 15a7 7 0 0 0 12 2l2-4"/>',
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.file}</svg>`;
  }

  function toast(message, tone = "info") {
    const node = document.createElement("div");
    node.className = "toast";
    node.dataset.tone = tone;
    node.textContent = message;
    toastRegion.replaceChildren(node);
    setTimeout(() => node.remove(), 4200);
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const response = await fetch(path, {
      method,
      cache: "no-store",
      headers: {
        "x-demo-session": session(),
        ...(options.body ? { "content-type": "application/json" } : {}),
        ...(method !== "GET" && method !== "HEAD" ? { "idempotency-key": uid() } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `Anfrage fehlgeschlagen (${response.status}).`);
      error.code = payload.code;
      throw error;
    }
    return payload;
  }

  function updateUrl(push = false) {
    const url = new URL(location.href);
    url.searchParams.set("page", state.page);
    url.searchParams.set("scenario", state.scenarioId);
    url.searchParams.set("program", "SYN-PROG-001");
    url.searchParams.set("opsCase", "SYN-CASE-001");
    if (state.role === "operations") {
      url.searchParams.set("role", "operations");
      url.searchParams.delete("lens");
    } else {
      url.searchParams.set("role", "employer");
      url.searchParams.set("lens", state.lens);
    }
    history[push ? "pushState" : "replaceState"]({}, "", url);
  }

  async function load({ focus = false } = {}) {
    state.data = await api(`/api/reliability/v1/bootstrap?scenario=${encodeURIComponent(state.scenarioId)}`);
    render();
    updateUrl(false);
    if (focus) document.querySelector("#main-content")?.focus();
  }

  function navigation() {
    const items = [
      ["readiness", "Startfähigkeit", "Ergebnis & Intervention", "readiness"],
      ["decisions", "Entscheidungen", "Optionen & Freigabe", "decision"],
      ["work-products", "Arbeitsprodukte", "Pläne & Briefs", "file"],
      ["programs", "Programme", "Kohorte & Ausnahmen", "program"],
    ];
    return items.map(([page, label, note, glyph]) => `
      <button class="nav__item" type="button" data-page="${page}" ${state.page === page ? 'aria-current="page"' : ""}>
        ${icon(glyph)}<span><strong>${label}</strong><small>${note}</small></span>
      </button>`).join("");
  }

  function shell(content) {
    const employer = state.role === "employer";
    const profile = employer ? { initials: "MK", name: "Max Keller", role: workAreas[state.lens] } : { initials: "AC", name: "Alex Cordes", role: "AMAVIO Operations" };
    return `
      <aside class="sidebar" aria-label="Hauptnavigation">
        <div class="brand"><img src="assets/brand/amavio-logo-light.svg" alt="AMAVIO One"></div>
        <nav class="nav">${navigation()}</nav>
        <div class="sidebar__context"><span>Synthetisches Mandat</span><strong>Klinikverbund Rheinland</strong><small>lokale Pilot-Simulation</small></div>
        <div class="sidebar__footer"><strong>AMAVIO</strong>Menschen ankommen lassen.<br>Arbeit möglich machen.</div>
      </aside>
      <button class="mobile-overlay" type="button" data-close-menu aria-label="Navigation schließen"></button>
      <header class="topbar">
        <button class="mobile-menu" type="button" data-open-menu aria-label="Navigation öffnen">${icon("menu")}</button>
        <div class="role-switch" role="tablist" aria-label="Perspektive">
          <button type="button" role="tab" data-role="operations" aria-selected="${!employer}">AMAVIO Operations</button>
          <button type="button" role="tab" data-role="employer" aria-selected="${employer}">Arbeitgeber</button>
        </div>
        ${employer ? `<div class="work-area"><label for="work-area">Arbeitsbereich</label><select id="work-area" data-work-area>${Object.entries(workAreas).map(([value, label]) => `<option value="${value}" ${state.lens === value ? "selected" : ""}>${label}</option>`).join("")}</select></div>` : '<div class="operations-label">Operative Steuerung</div>'}
        <div class="profile"><span class="profile__avatar">${profile.initials}</span><div><strong>${profile.name}</strong><small>${profile.role}</small></div></div>
      </header>
      <main id="main-content" class="main" tabindex="-1">${content}</main>
      <dialog class="product-dialog" data-product-dialog aria-labelledby="product-dialog-title"><button class="dialog-close" type="button" data-dialog-close aria-label="Arbeitsprodukt schließen">${icon("close")}</button><div data-dialog-content></div></dialog>
    `;
  }

  function boundary() {
    return '<span class="boundary">Synthetische Daten · keine Außenwirkung</span>';
  }

  function pageHeader({ compact = false } = {}) {
    const { program, cohort } = state.data;
    return `
      <div class="page-heading ${compact ? "page-heading--compact" : ""}">
        <div><span class="organization">${esc(program.employer)}</span><h1>${state.page === "readiness" ? "Startfähigkeit" : state.page === "decisions" ? "Entscheidungsraum" : state.page === "work-products" ? "Arbeitsprodukte" : "Ankunftsprogramm"}</h1>${compact ? "" : `<p>${program.cohort.participantCount === 12 ? "Zwölf" : esc(program.cohort.participantCount)} internationale ${esc(program.cohort.profession)} auf dem Weg nach Düsseldorf, Köln und Solingen.</p>`}</div>
        <div class="promise"><span>Arbeitsstart ${fmtDate(program.employmentStart)}</span><strong>${cohort.confirmedCount} bestätigt · ${cohort.conditionalCount} unter Bedingungen</strong>${boundary()}</div>
      </div>`;
  }

  function scenarioSwitch() {
    return `<div class="scenario-switch" role="tablist" aria-label="Drei synthetische Ausnahmewege">${state.data.scenarios.map((scenario) => `
      <button type="button" role="tab" data-scenario="${scenario.id}" aria-selected="${scenario.id === state.scenarioId}">
        <span>${esc(scenario.title)}</span><small>${readinessLabels[scenario.readiness] || scenario.readiness} · ${scenario.affectedStartPlaces} Startplätze</small>
      </button>`).join("")}</div>`;
  }

  function readinessBand() {
    const current = state.data.selectedScenario.state.readiness;
    return `<ol class="readiness-band" aria-label="Status der Startfähigkeit">${readinessOrder.map((key) => `<li data-state="${key}" aria-current="${current === key ? "step" : "false"}"><span></span><strong>${readinessLabels[key]}</strong></li>`).join("")}</ol>`;
  }

  function failureMode() {
    const scenario = state.data.selectedScenario;
    return `<section class="failure-mode" aria-labelledby="failure-title">
      <div class="failure-mode__head"><span>Zentrale Entscheidungsfrage</span><h2 id="failure-title">${esc(scenario.title)}</h2></div>
      <div class="failure-mode__facts">
        <div><strong>Ursache und Evidenz</strong><p>${esc(scenario.cause)}</p><details><summary>Alle Nachweise anzeigen</summary><ul>${scenario.evidence.map((item) => `<li><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small data-evidence="${esc(item.status)}">${esc(item.status)}</small></li>`).join("")}</ul></details></div>
        <div><strong>Betriebliche Auswirkung</strong><p>${esc(scenario.affectedStartPlaces)} Startplätze · möglicher Verzug ${esc(scenario.possibleDelay)}.</p></div>
        <div><strong>Entscheidung bis</strong><p>${fmtDate(scenario.deadline)}</p></div>
      </div>
    </section>`;
  }

  function options() {
    const scenario = state.data.selectedScenario;
    const canSelect = scenario.permissions.canSelectOption;
    const rows = scenario.options.map((option) => {
      const selected = scenario.state.selectedOptionId === option.id;
      return `<div class="option-row ${selected ? "is-selected" : ""}" data-recommended="${option.recommended}">
        <div class="option-row__name">${option.recommended ? "<span>Empfohlen</span>" : ""}<strong>${esc(option.label)}</strong><small>${esc(option.tradeoff)}</small></div>
        <div><span>Starttermin</span><strong>${fmtDate(option.startDate)}</strong></div>
        <div><span>Aufwand</span><strong>${esc(option.effort)}</strong></div>
        <div><span>Risiko</span><strong>${esc(option.risk)}</strong></div>
        <div><span>Voraussetzung</span><strong>${esc(option.requirement)}</strong></div>
        <button class="option-select" type="button" data-select-option="${option.id}" ${canSelect ? "" : "disabled"} aria-pressed="${selected}">${selected ? "Gewählt" : "Option wählen"}</button>
      </div>`;
    }).join("");
    return `<section class="options" id="options"><div class="section-head"><div><h2>Handlungsoptionen</h2><p>Auswirkungen und Voraussetzungen im direkten Vergleich.</p></div></div><div class="option-table"><div class="option-table__head"><span>Option</span><span>Starttermin</span><span>Aufwand</span><span>Risiko</span><span>Voraussetzung</span><span></span></div>${rows}</div></section>`;
  }

  function interventionPanel() {
    const scenario = state.data.selectedScenario;
    const status = scenario.state.intervention;
    let action = "";
    if (state.role === "employer" && state.lens === "governance" && status === "awaiting_authorization") {
      action = `<form class="intervention-form" data-authorize-form><label for="decision-rationale">Entscheidungsbegründung</label><textarea id="decision-rationale" name="rationale" minlength="12" required placeholder="Warum ist diese Option betrieblich tragfähig?"></textarea><label class="check"><input type="checkbox" name="confirmSynthetic" required><span>Ich bestätige diese ausschließlich synthetische Demoentscheidung.</span></label><button class="button button--gold" type="submit">Intervention freigeben</button></form>`;
    } else if (state.role === "employer" && status === "awaiting_selection") {
      action = state.lens === "governance" ? '<p class="action-note">Wählen Sie zuerst eine Handlungsoption.</p>' : `<p class="action-note">Die Freigabe liegt bei der Gesamtsteuerung. Ihr Bereich sieht nur den gemeinsamen Arbeitsstand.</p>`;
    } else if (state.role === "operations" && status === "active") {
      action = `<form class="intervention-form" data-complete-form><label for="proof-reference">Nachweisreferenz</label><input id="proof-reference" name="proofReference" required minlength="5" placeholder="z. B. SYN-Übergabebestätigung 04"><label for="completion-note">Fachliche Prüfnotiz</label><textarea id="completion-note" name="note" minlength="12" required placeholder="Welche Bedingung wurde wie erfüllt?"></textarea><button class="button button--gold" type="submit">Nachweis bestätigen</button></form>`;
    } else if (status === "active") {
      action = '<div class="status-line"><span></span><strong>Intervention aktiv</strong><small>AMAVIO prüft den vereinbarten Abschlussnachweis.</small></div>';
    } else if (status === "completed") {
      action = `<div class="status-line status-line--success">${icon("check")}<strong>Intervention abgeschlossen</strong><small>${esc(scenario.state.completionReference || "Nachweis fachlich bestätigt")}</small></div>`;
    } else if (state.role === "operations") {
      action = '<p class="action-note">Die Arbeitgeber-Gesamtsteuerung wählt eine Option und bestätigt die Intervention. Danach übernimmt AMAVIO die Ausführung.</p>';
    } else {
      action = '<p class="action-note">Dieser Arbeitsbereich verfolgt den gemeinsamen Status. Entscheidungen werden in der Gesamtsteuerung dokumentiert.</p>';
    }
    return `<aside class="intervention" aria-labelledby="intervention-title"><h2 id="intervention-title">AMAVIO-Intervention</h2><p>${esc(scenario.intervention.title)}</p><dl><div><dt>Leistung</dt><dd>${esc(scenario.intervention.service)}</dd></div><div><dt>Verantwortlich</dt><dd>${esc(scenario.intervention.owner)}</dd></div><div><dt>Zieltermin</dt><dd>${fmtDate(scenario.intervention.dueDate)}</dd></div><div><dt>Ihr Beitrag</dt><dd>${esc(scenario.intervention.employerContribution)}</dd></div><div><dt>Abschlussnachweis</dt><dd>${esc(scenario.intervention.completionProof)}</dd></div></dl>${action}</aside>`;
  }

  function workProducts() {
    const status = state.data.selectedScenario.state.readiness === "confirmed" ? "Fachlich bestätigt" : "Aktualisiert sich mit der Entscheidung";
    return `<section class="work-products" id="work-products"><div class="section-head"><div><h2>Arbeitsprodukte</h2><p>Sofort nutzbare Ergebnisse für die weitere Steuerung.</p></div></div><div class="product-list"><article><div class="product-icon">${icon("file")}</div><div><strong>Übergabe- und Ankunftsplan</strong><small>Aufenthalte, Standorte, Zuständigkeiten</small><span>${status}</span></div><button class="button button--secondary" type="button" data-product="handover-plan">Öffnen</button></article><article><div class="product-icon">${icon("file")}</div><div><strong>Arrival Readiness Brief</strong><small>Ergebnis, Bedingungen und nächste Schritte</small><span>${status}</span></div><button class="button button--secondary" type="button" data-product="readiness-brief">Öffnen</button></article></div></section>`;
  }

  function stabilization() {
    const scenario = state.data.selectedScenario;
    if (scenario.state.readiness !== "confirmed") return `<section class="stabilization"><div><h2>Stabilisierung nach dem Start</h2><p>Die 30-Tage-Rückmeldung wird nach bestätigter Startfähigkeit geöffnet.</p></div><span class="locked">Noch nicht geöffnet</span></section>`;
    if (scenario.outcome) return `<section class="stabilization"><div><h2>Stabilisierung nach dem Start</h2><p>Synthetische 30-Tage-Rückmeldung: <strong>${esc(scenario.outcome.rating)}</strong> · ${esc(scenario.outcome.note)}</p></div><span class="confirmed">Dokumentiert</span></section>`;
    if (scenario.permissions.canRecordOutcome) return `<section class="stabilization stabilization--form"><div><h2>Stabilisierung nach dem Start</h2><p>Ergebnis der Intervention nach 30 synthetischen Tagen dokumentieren.</p></div><form data-outcome-form><label for="outcome-rating">Bewertung</label><select id="outcome-rating" name="rating"><option value="stabil">Stabil</option><option value="beobachten">Beobachten</option><option value="nachsteuern">Nachsteuern</option></select><label for="outcome-note">Ergebnisbegründung</label><textarea id="outcome-note" name="note" minlength="12" required></textarea><button class="button button--secondary" type="submit">Rückmeldung dokumentieren</button></form></section>`;
    return `<section class="stabilization"><div><h2>Stabilisierung nach dem Start</h2><p>Die Arbeitgeber-Gesamtsteuerung dokumentiert die synthetische 30-Tage-Rückmeldung.</p></div><span class="confirmed">Startfähigkeit bestätigt</span></section>`;
  }

  function programOverview() {
    const { program, cohort, scenarios } = state.data;
    return `<section class="program-overview"><div class="program-summary"><div><span>Gemeinsames Startversprechen</span><h2>${esc(program.promise)}</h2><p>Anreisefenster ${esc(program.arrivalWindow)} · Arbeitsstart ${fmtDate(program.employmentStart)}</p></div><dl><div><dt>Geplant</dt><dd>${cohort.participantCount}</dd></div><div><dt>Bestätigt</dt><dd>${cohort.confirmedCount}</dd></div><div><dt>Unter Bedingungen</dt><dd>${cohort.conditionalCount}</dd></div></dl></div><div class="location-plan">${cohort.locations.map((location) => `<div><span>${esc(location.name)}</span><strong>${location.planned}</strong><small>geplante Starts</small></div>`).join("")}</div><div class="exception-list"><div class="exception-list__head"><h2>Drei geprüfte Ausnahmewege</h2><p>Jeder Weg verbindet Ausfallmodus, Betriebsfolge, Intervention und Abschlussnachweis.</p></div>${scenarios.map((scenario) => `<button type="button" data-scenario="${scenario.id}"><span>${esc(scenario.title)}</span><strong>${scenario.affectedStartPlaces} Startplätze</strong><small>${readinessLabels[scenario.readiness]}</small>${icon("arrow")}</button>`).join("")}</div>${state.role === "operations" ? `<button class="button button--quiet reset-button" type="button" data-reset>${icon("reset")} Lokalen Demo-Arbeitsstand zurücksetzen</button>` : ""}</section>`;
  }

  function renderReadiness() {
    return `<div class="workspace">${pageHeader()}${scenarioSwitch()}${readinessBand()}<div class="decision-layout"><div>${failureMode()}${options()}</div>${interventionPanel()}</div>${workProducts()}${stabilization()}</div>`;
  }

  function renderDecisions() {
    return `<div class="workspace">${pageHeader({ compact: true })}${scenarioSwitch()}<div class="decision-layout decision-layout--page"><div>${failureMode()}${options()}</div>${interventionPanel()}</div></div>`;
  }

  function renderProducts() {
    return `<div class="workspace">${pageHeader({ compact: true })}${scenarioSwitch()}${workProducts()}${stabilization()}<div class="brief-context"><h2>Was diese Arbeitsprodukte belegen</h2><p>Das Produkt dokumentiert Startversprechen, Ausfallmodus, gewählte Intervention, menschliche Entscheidung, Abschlussnachweis und verbleibende Bedingungen in einer reproduzierbaren Form.</p></div></div>`;
  }

  function renderPrograms() {
    return `<div class="workspace">${pageHeader({ compact: true })}${programOverview()}</div>`;
  }

  function render() {
    const content = state.page === "decisions" ? renderDecisions() : state.page === "work-products" ? renderProducts() : state.page === "programs" ? renderPrograms() : renderReadiness();
    app.innerHTML = shell(content);
    bind();
  }

  async function runAction(task, success) {
    if (state.busy) return;
    state.busy = true;
    document.documentElement.dataset.busy = "true";
    try { await task(); await load(); toast(success, "success"); }
    catch (error) { toast(error.message, "error"); }
    finally { state.busy = false; delete document.documentElement.dataset.busy; }
  }

  function bind() {
    document.querySelector("[data-open-menu]")?.addEventListener("click", () => { document.body.dataset.menuOpen = "true"; });
    document.querySelectorAll("[data-close-menu]").forEach((button) => button.addEventListener("click", () => { document.body.dataset.menuOpen = "false"; }));
    document.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", async () => { state.page = button.dataset.page; document.body.dataset.menuOpen = "false"; await load({ focus: true }); }));
    document.querySelectorAll("[data-role]").forEach((button) => button.addEventListener("click", async () => { state.role = button.dataset.role; if (state.role === "employer" && !state.lens) state.lens = "governance"; await load({ focus: true }); }));
    document.querySelector("[data-work-area]")?.addEventListener("change", async (event) => { state.lens = event.target.value; await load({ focus: true }); });
    document.querySelectorAll("[data-scenario]").forEach((button) => button.addEventListener("click", async () => { state.scenarioId = button.dataset.scenario; state.page = state.page === "programs" ? "readiness" : state.page; await load({ focus: true }); }));

    document.querySelectorAll("[data-select-option]").forEach((button) => button.addEventListener("click", () => runAction(async () => {
      await api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/options`, { method: "POST", body: { optionId: button.dataset.selectOption, version: state.data.selectedScenario.state.version } });
    }, "Handlungsoption ist für die menschliche Freigabe vorgemerkt.")));

    document.querySelector("[data-authorize-form]")?.addEventListener("submit", (event) => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/authorize`, { method: "POST", body: { rationale: form.get("rationale"), confirmSynthetic: form.get("confirmSynthetic") === "on", version: state.data.selectedScenario.state.version } }), "Intervention lokal freigegeben. Es wurde keine externe Aktion ausgelöst.");
    });

    document.querySelector("[data-complete-form]")?.addEventListener("submit", (event) => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/complete`, { method: "POST", body: { proofReference: form.get("proofReference"), note: form.get("note"), version: state.data.selectedScenario.state.version } }), "Abschlussnachweis bestätigt. Die Startfähigkeit wurde neu bewertet.");
    });

    document.querySelector("[data-outcome-form]")?.addEventListener("submit", (event) => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/outcomes`, { method: "POST", body: { rating: form.get("rating"), note: form.get("note") } }), "Synthetische 30-Tage-Rückmeldung dokumentiert.");
    });

    document.querySelectorAll("[data-product]").forEach((button) => button.addEventListener("click", async () => {
      try {
        const payload = await api(`/api/reliability/v1/work-products/${encodeURIComponent(button.dataset.product)}?scenario=${encodeURIComponent(state.scenarioId)}`);
        openProduct(payload.workProduct);
      } catch (error) { toast(error.message, "error"); }
    }));

    document.querySelector("[data-dialog-close]")?.addEventListener("click", () => document.querySelector("[data-product-dialog]")?.close());
    document.querySelector("[data-reset]")?.addEventListener("click", () => runAction(async () => api("/api/reliability/v1/reset", { method: "POST", body: { programId: "SYN-PROG-001" } }), "Lokaler synthetischer Demo-Arbeitsstand wurde zurückgesetzt."));
  }

  function openProduct(product) {
    const dialog = document.querySelector("[data-product-dialog]");
    const content = document.querySelector("[data-dialog-content]");
    content.innerHTML = `<span class="document-type">Synthetisches Arbeitsprodukt</span><h2 id="product-dialog-title">${esc(product.title)}</h2><p class="document-status">${esc(product.status)}</p>${product.sections.map((section) => `<section><h3>${esc(section.title)}</h3><p>${esc(section.text)}</p></section>`).join("")}<footer>Lokale Konzeptdemo · keine Außenwirkung · keine reale Freigabe</footer>`;
    dialog.showModal();
  }

  function showFileGuard() {
    gateStatus.textContent = "Lokale Demo starten";
    gateTitle.textContent = "Öffnen Sie die Demo über den lokalen Server";
    gateMessage.textContent = "1. Im Release-P-Ordner npm start ausführen. 2. Danach http://127.0.0.1:4216 öffnen.";
    gateActions.innerHTML = "";
  }

  async function start() {
    if (location.protocol === "file:") { showFileGuard(); return; }
    try {
      const health = await fetch("/api/health", { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject(new Error("health")));
      if (health.release !== "P" || health.externalEffects !== false || health.providerCalls !== 0) throw new Error("boundary");
      await load();
      gate.hidden = true;
      app.hidden = false;
      updateUrl(false);
    } catch {
      gateStatus.textContent = "Demo ist noch nicht erreichbar";
      gateTitle.textContent = "Lokalen Server prüfen";
      gateMessage.textContent = "Starten Sie im Release-P-Ordner npm start und öffnen Sie anschließend die lokale Adresse erneut.";
      gateActions.innerHTML = '<button class="button button--gold" type="button" data-runtime-retry>Erneut versuchen</button>';
      gateActions.querySelector("[data-runtime-retry]")?.addEventListener("click", start, { once: true });
    }
  }

  addEventListener("popstate", () => location.reload());
  start();
})();
