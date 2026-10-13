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
  const fmtTimestamp = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? esc(value) : new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
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
    const items = state.role === "operations" ? [
      ["readiness", "Auftragslage", "Startfähigkeit & Übergaben", "readiness"],
      ["decisions", "Ausführung", "Schritte & Nachweise", "decision"],
      ["work-products", "Ergebnisübergaben", "Pläne & Briefs", "file"],
      ["programs", "Programme", "Kohorte & Ausnahmen", "program"],
    ] : [
      ["readiness", "Startfähigkeit", "Ergebnis & Intervention", "readiness"],
      ["decisions", "Entscheidung & Übergabe", "Option, Auftrag, Status", "decision"],
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
    const scenario = state.data.selectedScenario;
    const unaffected = program.cohort.participantCount - scenario.affectedStartPlaces;
    const scopeStatus = scenario.state.readiness === "confirmed" ? `${scenario.affectedStartPlaces} bestätigt · ${unaffected} nicht betroffen` : `${scenario.affectedStartPlaces} unter Bedingungen · ${unaffected} nicht betroffen`;
    return `
      <div class="page-heading ${compact ? "page-heading--compact" : ""}">
        <div><span class="organization">${esc(program.employer)}</span><h1>${state.page === "readiness" ? (state.role === "operations" ? "Auftragslage" : "Startfähigkeit") : state.page === "decisions" ? (state.role === "operations" ? "Operative Ausführung" : "Entscheidung & Übergabe") : state.page === "work-products" ? (state.role === "operations" ? "Ergebnisübergaben" : "Arbeitsprodukte") : "Ankunftsprogramm"}</h1>${compact ? "" : `<p>${state.role === "operations" ? "Freigegebene Aufträge übernehmen, Nachweise schließen und belastbare Ergebnisse zurückgeben." : `${program.cohort.participantCount === 12 ? "Zwölf" : esc(program.cohort.participantCount)} internationale ${esc(program.cohort.profession)} auf dem Weg nach Düsseldorf, Köln und Solingen.`}</p>`}</div>
        <div class="promise"><span>Arbeitsstart ${fmtDate(program.employmentStart)}</span><strong>${scopeStatus}</strong>${boundary()}</div>
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
        <button class="option-select" type="button" data-select-option="${option.id}" ${canSelect ? "" : "disabled"} aria-pressed="${selected}">${selected ? (scenario.serviceOrder ? "Entscheidung fixiert" : "Gewählt") : "Option wählen"}</button>
      </div>`;
    }).join("");
    return `<section class="options" id="options"><div class="section-head"><div><h2>Handlungsoptionen</h2><p>Auswirkungen und Voraussetzungen im direkten Vergleich.</p></div></div><div class="option-table"><div class="option-table__head"><span>Option</span><span>Starttermin</span><span>Aufwand</span><span>Risiko</span><span>Voraussetzung</span><span></span></div>${rows}</div></section>`;
  }

  function serviceContract() {
    const scenario = state.data.selectedScenario;
    return `<div class="service-contract">
      <div class="service-contract__heading"><span>Verbindlicher Leistungsauftrag</span><strong>${esc(scenario.intervention.title)}</strong></div>
      <dl>
        <div><dt>AMAVIO übernimmt</dt><dd>${esc(scenario.intervention.service)}</dd></div>
        <div><dt>Arbeitgeber liefert</dt><dd>${esc(scenario.intervention.employerContribution)}</dd></div>
        <div><dt>Servicefenster</dt><dd>${esc(scenario.intervention.serviceLevel)}</dd></div>
        <div><dt>Ergebnis gilt als erbracht, wenn</dt><dd><ul>${scenario.intervention.acceptanceCriteria.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></dd></div>
        <div><dt>Nicht enthalten</dt><dd>${esc(scenario.intervention.notIncluded)}</dd></div>
      </dl>
    </div>`;
  }

  function employerInterventionPanel() {
    const scenario = state.data.selectedScenario;
    const status = scenario.state.intervention;
    const order = scenario.serviceOrder;
    let action = "";
    if (state.lens === "governance" && status === "awaiting_authorization") {
      action = `<form class="intervention-form" data-authorize-form><label for="decision-rationale">Entscheidungsbegründung</label><textarea id="decision-rationale" name="rationale" minlength="12" required placeholder="Warum ist diese Option betrieblich tragfähig?"></textarea><label class="check"><input type="checkbox" name="confirmSynthetic" required><span>Ich bestätige den synthetischen Auftrag und die benannte Mitwirkung.</span></label><button class="button button--gold" type="submit">Auftrag an AMAVIO übergeben</button></form>`;
    } else if (status === "awaiting_selection") {
      action = state.lens === "governance" ? '<p class="action-note">Wählen Sie zuerst eine Handlungsoption. Danach wird der konkrete AMAVIO-Auftrag freigabefähig.</p>' : '<p class="action-note">Die Gesamtsteuerung entscheidet. Ihr Arbeitsbereich sieht anschließend nur die gemeinsame Mitwirkung und das Ergebnis.</p>';
    } else if (order && status === "active") {
      action = `<div class="handoff-receipt"><span>Auftrag an AMAVIO übergeben</span><strong>${esc(order.id)}</strong><p>${order.progress.completed} von ${order.progress.total} Ausführungsschritten belegt.</p><div class="progress" aria-label="Ausführungsfortschritt"><span style="width:${Math.round((order.progress.completed / order.progress.total) * 100)}%"></span></div><small>Die Entscheidung ist versioniert und kann während der Ausführung nicht verändert werden.</small></div>`;
    } else if (order && status === "completed") {
      action = `<div class="result-handoff"><span>Ergebnis von AMAVIO zurückgegeben</span><strong>${esc(order.result.summary)}</strong><dl><div><dt>Restbedingung</dt><dd>${esc(order.result.residualCondition)}</dd></div><div><dt>Nächster Prüfpunkt</dt><dd>${esc(order.result.nextCheckpoint)}</dd></div><div><dt>Nachweis</dt><dd>${esc(scenario.state.completionReference)}</dd></div></dl></div>`;
    } else {
      action = '<p class="action-note">Dieser Arbeitsbereich verfolgt den gemeinsamen Status. Die bereichsübergreifende Auftragserteilung liegt bei der Gesamtsteuerung.</p>';
    }
    return `<aside class="intervention intervention--employer" aria-labelledby="intervention-title"><h2 id="intervention-title">AMAVIO-Leistungsauftrag</h2><p>Aus der gewählten Option entsteht ein klarer Auftrag mit Abnahmebedingungen.</p>${serviceContract()}${action}</aside>`;
  }

  function executionStep(step, canComplete) {
    const completed = step.status === "completed";
    return `<article class="execution-step" data-step-status="${esc(step.status)}">
      <div class="execution-step__number">${completed ? icon("check") : esc(step.position)}</div>
      <div class="execution-step__body"><span>${esc(step.owner)}</span><h3>${esc(step.label)}</h3><p>${esc(step.evidenceRequired)}</p>${completed ? `<div class="step-proof"><strong>${esc(step.proofReference)}</strong><small>Nachweis dokumentiert</small></div>` : ""}</div>
      ${canComplete && !completed ? `<details class="step-action"><summary>Schritt belegen</summary><form data-step-form="${esc(step.id)}"><label>Nachweisreferenz<input name="proofReference" minlength="5" required placeholder="SYN-Nachweis"></label><label>Prüferläuterung<textarea name="note" minlength="12" required placeholder="Was wurde geprüft und erfüllt?"></textarea></label><input type="hidden" name="stepVersion" value="${esc(step.version)}"><button class="button button--secondary" type="submit">Schritt abschließen</button></form></details>` : ""}
    </article>`;
  }

  function operationsExecution() {
    const scenario = state.data.selectedScenario;
    const order = scenario.serviceOrder;
    if (!order) return `<section class="execution-workspace execution-workspace--waiting"><div><span>Nächster Rollenwechsel</span><h2>Arbeitgeberentscheidung abwarten</h2><p>AMAVIO kann den Fall prüfen und vorbereiten, übernimmt die Ausführung aber erst nach einer dokumentierten Übergabe der Gesamtsteuerung.</p></div>${serviceContract()}</section>`;
    const statusLabel = order.status === "authorized" ? "Zur Übernahme bereit" : order.status === "in_execution" ? "In Ausführung" : "Ergebnis übergeben";
    const allDone = order.progress.completed === order.progress.total;
    return `<section class="execution-workspace" aria-labelledby="execution-title">
      <header class="execution-workspace__head"><div><span>AMAVIO-Auftrag ${esc(order.id)}</span><h2 id="execution-title">${esc(scenario.intervention.title)}</h2><p>${esc(order.scope)}</p></div><div class="order-status"><strong>${statusLabel}</strong><small>${order.progress.completed} / ${order.progress.total} Nachweise</small></div></header>
      <div class="execution-contract"><div><span>Servicefenster</span><strong>${esc(order.serviceLevel)}</strong></div><div><span>Abnahmebedingung</span><strong>${esc(order.acceptanceCriteria[0])}</strong></div><div><span>Arbeitgeberbeitrag</span><strong>${esc(scenario.intervention.employerContribution)}</strong></div></div>
      ${order.status === "authorized" ? `<div class="takeover"><p>Die Gesamtsteuerung hat Option und Leistungsrahmen fixiert. Mit der Übernahme beginnt AMAVIO die dokumentierte Ausführung.</p><button class="button button--gold" type="button" data-start-execution>Auftrag übernehmen</button></div>` : ""}
      <div class="execution-steps">${order.steps.map((step) => executionStep(step, scenario.permissions.canCompleteStep)).join("")}</div>
      ${allDone && order.status !== "completed" ? `<form class="result-form" data-complete-form><div><span>Ergebnisübergabe vorbereiten</span><h3>Startfähigkeit mit belegt abgeschlossenem Auftrag zurückgeben</h3><p>Der Arbeitgeber erhält Ergebnis, Restbedingung, nächsten Prüfpunkt und den zusammenfassenden Nachweis.</p></div><label>Ergebniszusammenfassung<textarea name="resultSummary" minlength="12" required placeholder="Welches belastbare Ergebnis wurde hergestellt?"></textarea></label><label>Restbedingung<input name="residualCondition" minlength="5" required value="Keine offene Bedingung im synthetischen Fall"></label><label>Nächster Prüfpunkt<input name="nextCheckpoint" minlength="5" required value="30-Tage-Stabilisierung"></label><label>Zusammenfassender Nachweis<input id="proof-reference" name="proofReference" minlength="5" required placeholder="SYN-Übergabebestätigung 04"></label><label>Interne Prüfnotiz<textarea id="completion-note" name="note" minlength="12" required placeholder="Warum ist der Auftrag abnahmefähig?"></textarea></label><button class="button button--gold" type="submit">Ergebnis an Arbeitgeber übergeben</button></form>` : ""}
      ${order.status === "completed" ? `<div class="operations-result"><span>Ergebnis übergeben</span><h3>${esc(order.result.summary)}</h3><p><strong>Restbedingung:</strong> ${esc(order.result.residualCondition)}</p><p><strong>Nächster Prüfpunkt:</strong> ${esc(order.result.nextCheckpoint)}</p><small>${esc(scenario.state.completionReference)}</small></div>` : ""}
    </section>`;
  }

  function workProducts() {
    const scenario = state.data.selectedScenario;
    const status = scenario.state.readiness === "confirmed" ? "Fachlich bestätigt" : scenario.serviceOrder ? `${scenario.serviceOrder.progress.completed}/${scenario.serviceOrder.progress.total} Nachweise` : "Entwurf vor Auftrag";
    return `<section class="work-products" id="work-products"><div class="section-head"><div><h2>${state.role === "operations" ? "Ergebnisübergaben" : "Arbeitsprodukte"}</h2><p>Versionierte Unterlagen mit Entscheidung, Verantwortung, Evidenz und nächstem Prüfpunkt.</p></div></div><div class="product-list"><article><div class="product-icon">${icon("file")}</div><div><strong>Übergabe- und Ankunftsplan</strong><small>Leistungsauftrag, Ausführung und Zuständigkeiten</small><span>${status}</span></div><button class="button button--secondary" type="button" data-product="handover-plan">Dokument prüfen</button></article><article><div class="product-icon">${icon("file")}</div><div><strong>Arrival Readiness Brief</strong><small>Entscheidung, Ergebnis und Restbedingungen</small><span>${status}</span></div><button class="button button--secondary" type="button" data-product="readiness-brief">Dokument prüfen</button></article></div></section>`;
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
    if (state.role === "operations") return `<div class="workspace workspace--operations">${pageHeader()}${scenarioSwitch()}${readinessBand()}${failureMode()}${operationsExecution()}${workProducts()}${stabilization()}</div>`;
    return `<div class="workspace">${pageHeader()}${scenarioSwitch()}${readinessBand()}<div class="decision-layout"><div>${failureMode()}${options()}</div>${employerInterventionPanel()}</div>${workProducts()}${stabilization()}</div>`;
  }

  function renderDecisions() {
    if (state.role === "operations") return `<div class="workspace workspace--operations">${pageHeader({ compact: true })}${scenarioSwitch()}${operationsExecution()}</div>`;
    return `<div class="workspace">${pageHeader({ compact: true })}${scenarioSwitch()}<div class="decision-layout decision-layout--page"><div>${failureMode()}${options()}</div>${employerInterventionPanel()}</div></div>`;
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
      runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/authorize`, { method: "POST", body: { rationale: form.get("rationale"), confirmSynthetic: form.get("confirmSynthetic") === "on", version: state.data.selectedScenario.state.version } }), "Auftrag lokal an AMAVIO übergeben. Es wurde keine externe Aktion ausgelöst.");
    });

    document.querySelector("[data-start-execution]")?.addEventListener("click", () => runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/start-execution`, { method: "POST", body: { orderVersion: state.data.selectedScenario.serviceOrder.version } }), "AMAVIO hat den synthetischen Auftrag in die Ausführung übernommen."));

    document.querySelectorAll("[data-step-form]").forEach((formNode) => formNode.addEventListener("submit", (event) => {
      event.preventDefault(); const form = new FormData(event.currentTarget); const stepId = event.currentTarget.dataset.stepForm;
      runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/steps/${encodeURIComponent(stepId)}/complete`, { method: "POST", body: { proofReference: form.get("proofReference"), note: form.get("note"), stepVersion: Number(form.get("stepVersion")) } }), "Ausführungsschritt mit synthetischem Nachweis abgeschlossen.");
    }));

    document.querySelector("[data-complete-form]")?.addEventListener("submit", (event) => {
      event.preventDefault(); const form = new FormData(event.currentTarget);
      runAction(async () => api(`/api/reliability/v1/scenarios/${encodeURIComponent(state.scenarioId)}/complete`, { method: "POST", body: { proofReference: form.get("proofReference"), note: form.get("note"), resultSummary: form.get("resultSummary"), residualCondition: form.get("residualCondition"), nextCheckpoint: form.get("nextCheckpoint"), version: state.data.selectedScenario.state.version } }), "Ergebnis an den Arbeitgeber übergeben. Die Startfähigkeit wurde neu bewertet.");
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
    const meta = product.meta || { reference: product.id, version: "P1", updatedAt: new Date().toISOString(), owner: "AMAVIO Operations", status: product.status };
    content.innerHTML = `<div class="document-toolbar"><div><span class="document-type">Synthetisches Arbeitsprodukt</span><h2 id="product-dialog-title">${esc(product.title)}</h2></div><button class="button button--secondary" type="button" data-print-product>Als Druckansicht</button></div><p class="document-summary">${esc(product.summary || product.status)}</p><dl class="document-meta"><div><dt>Referenz</dt><dd>${esc(meta.reference)}</dd></div><div><dt>Version</dt><dd>${esc(meta.version)}</dd></div><div><dt>Status</dt><dd>${esc(meta.status)}</dd></div><div><dt>Verantwortung</dt><dd>${esc(meta.owner)}</dd></div><div><dt>Aktualisiert</dt><dd>${fmtTimestamp(meta.updatedAt)}</dd></div></dl>${product.sections.map((section) => `<section><h3>${esc(section.title)}</h3><p>${esc(section.text)}</p>${section.items?.length ? `<ul>${section.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}${section.rows?.length ? `<div class="document-table">${section.rows.map((row) => `<div><strong>${esc(row.label)}</strong><span>${esc(row.owner)}</span><span>${esc(row.evidence)}</span><small>${esc(row.status)}</small></div>`).join("")}</div>` : ""}</section>`).join("")}<footer>Lokale Konzeptdemo · ausschließlich synthetische Daten · keine Außenwirkung · keine reale Freigabe</footer>`;
    content.querySelector("[data-print-product]")?.addEventListener("click", () => window.print());
    dialog.showModal();
  }

  function showFileGuard() {
    gateStatus.textContent = "Lokale Demo starten";
    gateTitle.textContent = "Öffnen Sie die Demo über den lokalen Server";
    gateMessage.textContent = "1. Im Release-P.1-Ordner npm start ausführen. 2. Danach http://127.0.0.1:4217 öffnen.";
    gateActions.innerHTML = "";
  }

  async function start() {
    if (location.protocol === "file:") { showFileGuard(); return; }
    try {
      const health = await fetch("/api/health", { cache: "no-store" }).then((response) => response.ok ? response.json() : Promise.reject(new Error("health")));
      if (health.release !== "P.1" || health.externalEffects !== false || health.providerCalls !== 0) throw new Error("boundary");
      await load();
      gate.hidden = true;
      app.hidden = false;
      updateUrl(false);
    } catch {
      gateStatus.textContent = "Demo ist noch nicht erreichbar";
      gateTitle.textContent = "Lokalen Server prüfen";
      gateMessage.textContent = "Starten Sie im Release-P.1-Ordner npm start und öffnen Sie anschließend die lokale Adresse erneut.";
      gateActions.innerHTML = '<button class="button button--gold" type="button" data-runtime-retry>Erneut versuchen</button>';
      gateActions.querySelector("[data-runtime-retry]")?.addEventListener("click", start, { once: true });
    }
  }

  addEventListener("popstate", () => location.reload());
  start();
})();
