(function () {
  "use strict";

  const app = document.querySelector("#app");
  const gate = document.querySelector("[data-runtime-gate]");
  const gateTitle = document.querySelector("[data-runtime-title]");
  const gateMessage = document.querySelector("[data-runtime-message]");
  const gateStatus = document.querySelector("[data-runtime-status]");
  const gateActions = document.querySelector("[data-runtime-actions]");
  const toastRegion = document.querySelector("#toast-region");
  const localHosts = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
  const params = new URLSearchParams(location.search);
  const pageAliases = {
    operations: "cases", collaboration: "tasks", "learning-quality": "home",
    learning: "home", twin: "cases", admin: "home", overview: "home",
  };
  const rawPage = pageAliases[params.get("page")] || params.get("page");
  const initialRole = params.get("role") === "employer" ? "employer" : "operations";
  const allowedPages = initialRole === "employer"
    ? new Set(["tasks", "programs"])
    : new Set(["home", "cases", "decisions", "programs"]);

  const state = {
    role: initialRole,
    lens: ["sponsor", "hr", "location", "budget"].includes(params.get("lens")) ? params.get("lens") : "sponsor",
    page: allowedPages.has(rawPage) ? rawPage : initialRole === "employer" ? "tasks" : "cases",
    caseId: params.get("opsCase") || "SYN-CASE-001",
    programId: params.get("program") || "SYN-PROG-001",
    bootstrap: null,
    detail: null,
    execution: null,
    programs: null,
    collaboration: null,
    metrics: null,
    simulationPreview: null,
    activeScenario: "evidence",
    activeTab: "history",
    queueFilter: "all",
    queueSearch: "",
    selectedProductId: null,
    busy: false,
    sessionStartedAt: Date.now(),
  };

  const sessions = {
    operations: "demo-session-operations",
    sponsor: "demo-session-employer-sponsor",
    hr: "demo-session-employer-hr",
    location: "demo-session-employer-location",
    budget: "demo-session-employer-budget",
  };

  const roleLabels = {
    sponsor: "Gesamtsteuerung",
    hr: "Personal & Onboarding",
    location: "Standort & Übergabe",
    budget: "Budget & Freigaben",
  };

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  const fmtDate = (value) => {
    if (!value) return "nicht terminiert";
    const date = new Date(String(value).length === 10 ? `${value}T12:00:00Z` : value);
    return Number.isNaN(date.getTime()) ? esc(value) : new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  };
  const fmtTime = (value) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(date);
  };
  const currentSession = () => state.role === "operations" ? sessions.operations : sessions[state.lens];
  const uid = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function icon(name) {
    const paths = {
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      home: '<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
      cases: '<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
      decision: '<path d="M5 4h14v16H5z"/><path d="m8 12 2 2 5-5"/>',
      program: '<path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 3v6M14 9v6M10 15v6"/>',
      arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
      file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/>',
      refresh: '<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M18 9a7 7 0 0 0-12-2l-2 4M6 15a7 7 0 0 0 12 2l2-4"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      warning: '<path d="M12 3 2.5 20h19z"/><path d="M12 9v4M12 17h.01"/>',
    };
    return `<svg class="nav__icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.file}</svg>`;
  }

  function toast(message, tone = "info") {
    const node = document.createElement("div");
    node.className = "toast";
    node.dataset.tone = tone;
    node.textContent = message;
    toastRegion.replaceChildren(node);
    setTimeout(() => node.remove(), 4600);
  }

  async function api(path, options = {}) {
    const method = options.method || "GET";
    const headers = {
      "x-demo-session": currentSession(),
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(method !== "GET" && method !== "HEAD" ? { "idempotency-key": options.key || uid("release-o") } : {}),
      ...(options.headers || {}),
    };
    const response = await fetch(path, {
      method,
      headers,
      cache: "no-store",
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || `Anfrage fehlgeschlagen (${response.status}).`);
      error.status = response.status;
      error.code = payload.code;
      throw error;
    }
    return payload;
  }

  async function loadData({ quiet = false } = {}) {
    if (!quiet) {
      app.innerHTML = '<main class="main"><div class="loading">Operativer Arbeitsstand wird geladen …</div></main>';
    }
    const [bootstrap, programs, collaboration, metrics] = await Promise.all([
      api("/api/v1.5/bootstrap"),
      api("/api/programs/v1/bootstrap"),
      api("/api/collaboration/v1/bootstrap"),
      api(`/api/execution/v1/metrics/summary?caseId=${encodeURIComponent(state.caseId)}`).catch(() => null),
    ]);
    state.bootstrap = bootstrap;
    state.programs = programs;
    state.collaboration = collaboration;
    state.metrics = metrics;
    const visibleCase = bootstrap.portfolio.some((item) => item.id === state.caseId)
      ? state.caseId
      : (bootstrap.portfolio[0]?.id || "SYN-CASE-001");
    state.caseId = visibleCase;
    const [detail, execution] = await Promise.all([
      api(`/api/v1.5/cases/${encodeURIComponent(visibleCase)}`),
      api(`/api/execution/v1/cases/${encodeURIComponent(visibleCase)}`),
    ]);
    state.detail = detail;
    state.execution = execution;
    render();
  }

  function updateUrl(push = true) {
    const url = new URL(location.href);
    url.searchParams.set("page", state.page);
    url.searchParams.set("opsCase", state.caseId);
    if (state.role === "employer") {
      url.searchParams.set("role", "employer");
      url.searchParams.set("lens", state.lens);
    } else {
      url.searchParams.delete("role");
      url.searchParams.delete("lens");
    }
    if (state.page === "programs") url.searchParams.set("program", state.programId);
    else url.searchParams.delete("program");
    history[push ? "pushState" : "replaceState"]({}, "", url);
  }

  async function navigate(next, push = true) {
    Object.assign(state, next);
    if (state.role === "operations" && !new Set(["home", "cases", "decisions", "programs"]).has(state.page)) state.page = "cases";
    if (state.role === "employer" && !new Set(["tasks", "programs"]).has(state.page)) state.page = "tasks";
    updateUrl(push);
    document.body.dataset.menuOpen = "false";
    await loadData();
  }

  function navItems() {
    if (state.role === "employer") return [
      { page: "tasks", label: "Aufgaben & Entscheidungen", note: "Eigene Beiträge bearbeiten", icon: "decision" },
      { page: "programs", label: "Ankunftsprogramme", note: "Stand, Meilensteine & Beiträge", icon: "program" },
    ];
    return [
      { page: "home", label: "Heute", note: "Priorisierte Arbeit", icon: "home" },
      { page: "cases", label: "Fälle", note: "Operative Fallsteuerung", icon: "cases" },
      { page: "decisions", label: "Entscheidungen", note: "Prüfen & dokumentieren", icon: "decision" },
      { page: "programs", label: "Programme", note: "Lieferstand & Wirkung", icon: "program" },
    ];
  }

  function shell(content) {
    const profile = state.role === "operations"
      ? { initials: "AC", name: "Alex Cordes", role: "AMAVIO Operations" }
      : { initials: "MK", name: "Dr. Martin Keller", role: roleLabels[state.lens] };
    const nav = navItems().map((item) => `
      <button class="nav__item" type="button" data-nav="${item.page}" ${state.page === item.page ? 'aria-current="page"' : ""}>
        ${icon(item.icon)}<span><strong>${item.label}</strong><small>${item.note}</small></span>
      </button>`).join("");
    return `
      <aside class="sidebar" aria-label="Hauptnavigation">
        <div class="brand"><img src="assets/brand/amavio-logo-light.svg" alt="AMAVIO One"></div>
        <nav class="nav">${nav}</nav>
        <div class="sidebar__context">
          <span>Synthetisches Mandat</span>
          <strong>Klinikverbund Rheinland</strong>
          <small>lokale Pilot-Simulation</small>
        </div>
        <div class="sidebar__footer"><strong>AMAVIO</strong>Menschen ankommen lassen.<br>Arbeit möglich machen.</div>
      </aside>
      <button class="mobile-overlay" type="button" data-close-menu aria-label="Navigation schließen"></button>
      <header class="topbar">
        <button class="mobile-menu" type="button" data-open-menu aria-label="Navigation öffnen">${icon("menu")}</button>
        <div class="product-name">Arrival Control Center</div>
        <div class="role-switch" role="tablist" aria-label="Perspektive">
          <button type="button" role="tab" data-role="operations" aria-selected="${state.role === "operations"}">AMAVIO Operations</button>
          <button type="button" role="tab" data-role="employer" aria-selected="${state.role === "employer"}">Arbeitgeber</button>
        </div>
        ${state.role === "employer" ? `
          <div class="work-area">
            <label for="work-area-select">Arbeitsbereich</label>
            <select id="work-area-select" data-work-area>
              ${Object.entries(roleLabels).map(([value, label]) => `<option value="${value}" ${state.lens === value ? "selected" : ""}>${label}</option>`).join("")}
            </select>
          </div>` : ""}
        <div class="profile" aria-label="Lokales Demo-Profil">
          <span class="profile__avatar">${profile.initials}</span>
          <div><strong>${profile.name}</strong><small>${profile.role}</small></div>
        </div>
      </header>
      <main id="main-content" class="main" tabindex="-1">${content}</main>
    `;
  }

  function render() {
    let content;
    if (state.role === "employer") content = state.page === "programs" ? renderPrograms() : renderEmployerTasks();
    else if (state.page === "home") content = renderToday();
    else if (state.page === "programs") content = renderPrograms();
    else if (state.page === "decisions") content = renderDecisionDesk();
    else content = renderOperationsCase();
    app.innerHTML = shell(content);
    bindCommon();
    bindPage();
  }

  function pageHead(title, description, meta = "") {
    return `
      <div class="page-head">
        <div><h1>${title}</h1><p>${description}</p>${meta}</div>
        <aside class="boundary-note"><strong>Lokale Konzeptdemo</strong>Synthetische Daten · keine Außenwirkung</aside>
      </div>`;
  }

  function breadcrumbs(items) {
    return `<nav class="breadcrumbs" aria-label="Brotkrumen">${items.map((item, index) => `
      ${index ? '<span class="breadcrumbs__separator">›</span>' : ""}
      ${item.page ? `<button type="button" data-nav="${item.page}">${esc(item.label)}</button>` : `<span>${esc(item.label)}</span>`}
    `).join("")}</nav>`;
  }

  function journeyState() {
    const exec = state.execution;
    if (!exec?.available && !exec?.plan) return 1;
    if (exec.plan.status === "locally_decided") return 5;
    const orders = exec.orders || [];
    const bySequence = (sequence) => orders.find((item) => item.sequence === sequence);
    if (bySequence(1)?.status !== "completed") return 1;
    if (bySequence(2)?.status !== "completed") return 2;
    if (bySequence(3)?.status !== "completed") return 3;
    return 4;
  }

  function journey() {
    const current = journeyState();
    const labels = [
      ["Lage klären", "Evidenz abgleichen"],
      ["Verantwortung sichern", "Arbeitgeberbeitrag"],
      ["Wirkung prüfen", "Abhängigkeiten"],
      ["Entscheidung treffen", "Menschlich bestätigen"],
      ["Ergebnis übergeben", "Arbeitsprodukt"],
    ];
    return `<div class="journey" aria-label="Golden Journey">${labels.map((item, index) => {
      const step = index + 1;
      const mode = step < current ? "complete" : step === current ? "current" : "pending";
      return `<div class="journey__step" data-state="${mode}"><span class="journey__number">${mode === "complete" ? "✓" : step}</span><strong>${item[0]}</strong><small>${item[1]}</small></div>`;
    }).join("")}</div>`;
  }

  function renderToday() {
    const cases = filteredCases();
    const all = state.bootstrap.portfolio;
    const blocked = all.filter((item) => item.readiness === "blocked").length;
    const decisions = all.filter((item) => item.readiness === "decision").length;
    const own = all.filter((item) => /AMAVIO/i.test(item.ownerRole)).length;
    return `<div class="workspace">
      ${pageHead("Heute", "Die wenigen Vorgänge, die jetzt Aufmerksamkeit benötigen – nach Wirkung und Verantwortung priorisiert.")}
      <div class="metric-grid" style="margin:24px 0">
        ${metric("Kritisch", blocked, "harte Abhängigkeit")}
        ${metric("Entscheidung offen", decisions, "menschlich zu bestätigen")}
        ${metric("Bei AMAVIO", own, "eigene nächste Schritte")}
        ${metric("Außenwirkungen", 0, "alle Aktionen lokal")}
      </div>
      <div class="queue-layout">
        ${renderQueue(cases)}
        <section class="queue-detail">
          <div class="section-title"><h2>${esc(state.detail.case.title)}</h2><p>${esc(state.detail.case.readinessLabel)}</p></div>
          <div class="context-strip">
            <div class="context-strip__item"><strong>Was ist passiert?</strong><p>${esc(state.detail.exceptions[0]?.title || state.detail.tasks[0]?.title || "Kein kritisches Ereignis.")}</p></div>
            <div class="context-strip__item"><strong>Was ist jetzt zu tun?</strong><p>${esc(state.detail.tasks.find((item) => item.status !== "completed")?.title || "Kein offener Arbeitsschritt.")}</p></div>
            <div class="context-strip__item"><strong>Was folgt danach?</strong><p>Der bestätigte Stand öffnet den nächsten abhängigen Schritt.</p></div>
          </div>
          <div class="action-row"><button class="button button--gold" type="button" data-nav="cases">Fall öffnen ${icon("arrow")}</button></div>
        </section>
      </div>
    </div>`;
  }

  function metric(label, value, note) {
    return `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
  }

  function filteredCases() {
    return state.bootstrap.portfolio.filter((item) => {
      const text = `${item.id} ${item.title} ${item.location}`.toLowerCase();
      const matchesSearch = text.includes(state.queueSearch.toLowerCase());
      const matchesFilter = state.queueFilter === "all"
        || (state.queueFilter === "critical" && item.readiness === "blocked")
        || (state.queueFilter === "mine" && /AMAVIO/i.test(item.ownerRole));
      return matchesSearch && matchesFilter;
    });
  }

  function renderQueue(items = filteredCases()) {
    return `<aside class="queue" aria-label="Fallauswahl">
      <div class="queue__head"><h2>Arbeitsliste</h2><small>${items.length} Vorgänge</small></div>
      <input class="search" type="search" data-queue-search value="${esc(state.queueSearch)}" placeholder="Fall oder Ort suchen" aria-label="Fälle durchsuchen">
      <div class="filter-row" aria-label="Arbeitsliste filtern">
        <button type="button" data-filter="all" aria-pressed="${state.queueFilter === "all"}">Alle</button>
        <button type="button" data-filter="critical" aria-pressed="${state.queueFilter === "critical"}">Kritisch</button>
        <button type="button" data-filter="mine" aria-pressed="${state.queueFilter === "mine"}">Bei mir</button>
      </div>
      <div class="queue__list">${items.map((item) => `
        <button type="button" class="queue-card" data-case="${item.id}" aria-current="${item.id === state.caseId}">
          <span class="queue-card__top"><span>${esc(item.id.replace("SYN-CASE-", "A-"))}</span><span>${esc(item.readinessLabel.split("·")[0])}</span></span>
          <strong>${esc(item.title)}</strong><small>${esc(item.location)} · ${fmtDate(item.arrivalDate)}</small>
        </button>`).join("") || '<div class="empty">Keine passenden Vorgänge.</div>'}</div>
    </aside>`;
  }

  function renderOperationsCase() {
    const detail = state.detail;
    const current = journeyState();
    const meta = `<div class="case-meta"><span>${esc(detail.case.mandate)}</span><span>${esc(detail.case.cohort)}</span><span>Anreise ${fmtDate(detail.case.arrivalDate)}</span><span class="status ${detail.case.readiness === "blocked" ? "status--danger" : ""}">${esc(detail.case.readinessLabel)}</span></div>`;
    return `<div class="workspace">
      ${breadcrumbs([{ page: "home", label: "Heute" }, { page: "cases", label: "Fälle" }, { label: detail.case.id.replace("SYN-CASE-", "A-") }])}
      ${pageHead(esc(detail.case.title), "Was ist jetzt zu klären, wer trägt den nächsten Schritt und welches Ergebnis wird benötigt?", meta)}
      ${journey()}
      <div class="workspace-grid">
        <div class="work-column">
          ${renderStage(current)}
          ${renderScenarioLab()}
          ${renderTabs()}
        </div>
        ${renderContextRail(current)}
      </div>
    </div>`;
  }

  function renderStage(step) {
    if (step === 1) return renderEvidenceStage();
    if (step === 2) return renderHandoffStage();
    if (step === 3) return renderImpactStage();
    if (step === 4) return renderDecisionStage();
    return renderResultStage();
  }

  function renderEvidenceStage() {
    const evidence = state.detail.evidence.filter((item) => item.conflictGroup).slice(0, 2);
    const order = state.execution.orders?.find((item) => item.sequence === 1);
    const product = state.detail.workProducts.find((item) => item.product_type === "exception_resolution_plan");
    return `
      <div class="section-title"><h2>Widerspruch fachlich klären</h2><p>Zwei Quellen beschreiben unterschiedliche Wohnungsadressen. Die fehlende verbindliche Grundlage muss benannt werden, bevor die Arbeitgeberübergabe geöffnet wird.</p></div>
      <div class="evidence-compare">
        ${evidenceCard(evidence[0])}<div class="compare-mark" aria-hidden="true">↔</div>${evidenceCard(evidence[1])}
      </div>
      <div class="callout" data-tone="danger"><span>!</span><div><strong>Verbindlicher Nachweis fehlt</strong><p>Das Übergabeprotokoll ist noch nicht eingereicht; keine der beiden Adressen darf automatisch übernommen werden.</p></div></div>
      <div class="action-panel">
        <h3>${product ? "Klärungsauftrag liegt als Entwurf vor" : "Prüfbaren Klärungsauftrag erzeugen"}</h3>
        <p>${product ? "Der Entwurf enthält belegten Stand, offene Verantwortung und Wirkungsgrenze." : "Der Auftrag wird ausschließlich aus dem aktuellen synthetischen Fallstand erzeugt und nicht versendet."}</p>
        ${product ? `<div class="field"><label for="order-note">Abschlussnotiz <span>*</span></label><textarea id="order-note" data-order-note>Klärungsauftrag mit beiden Adressquellen und fehlendem Übergabenachweis vorbereitet.</textarea></div>
          <div class="action-row" style="margin-top:14px"><button class="button button--gold" type="button" data-complete-order="${order?.id || ""}" ${!order?.canAct ? "disabled" : ""}>Lageklärung abschließen ${icon("arrow")}</button><button class="button button--secondary" type="button" data-show-product="${product.id}">Entwurf ansehen</button></div>`
          : `<button class="button button--gold" type="button" data-create-product="exception_resolution_plan">Klärungsauftrag vorbereiten ${icon("arrow")}</button>`}
      </div>`;
  }

  function evidenceCard(item) {
    if (!item) return '<div class="evidence-card"><p>Keine Quelle vorhanden.</p></div>';
    return `<article class="evidence-card" data-status="${esc(item.reviewStatus)}">
      <div class="evidence-card__top"><strong>${esc(item.label)}</strong><span>${esc(item.reviewStatus === "confirmed" ? "bestätigt" : "abweichend")}</span></div>
      <blockquote>„${esc(item.assertion)}“</blockquote>
      <footer><span>${esc(item.source)}</span><span>gültig bis ${fmtDate(item.validUntil)}</span></footer>
    </article>`;
  }

  function renderHandoffStage() {
    const handoff = state.execution.handoffs?.[0];
    return `
      <div class="section-title"><h2>Arbeitgeberbeitrag steht aus</h2><p>Die Lage ist fachlich vorbereitet. Jetzt benötigt der Standortarbeitsbereich eine eindeutige Bestätigung mit Grundlage.</p></div>
      <div class="context-strip">
        <div class="context-strip__item"><strong>Auftrag</strong><p>${esc(handoff?.request || "Standortbestätigung einholen.")}</p></div>
        <div class="context-strip__item"><strong>Benötigte Grundlage</strong><p>${esc(handoff?.evidenceNeeded || "Bestätigte Übergabezeit und Rollenverantwortung.")}</p></div>
        <div class="context-strip__item"><strong>Danach</strong><p>AMAVIO prüft die Auswirkung auf Arbeitsstart und Programm.</p></div>
      </div>
      <div class="callout"><span>2</span><div><strong>Bewusste Rollenübergabe</strong><p>AMAVIO kann diesen Arbeitgeberbeitrag nicht selbst ausführen.</p></div></div>
      <div class="action-row" style="margin-top:18px"><button class="button button--gold" type="button" data-switch-employer-location>Zur Standortbestätigung ${icon("arrow")}</button></div>`;
  }

  function renderImpactStage() {
    const order = state.execution.orders?.find((item) => item.sequence === 3);
    const handoff = state.execution.handoffs?.[0];
    return `
      <div class="section-title"><h2>Auswirkung auf den Arbeitsstart prüfen</h2><p>Der Arbeitgeberbeitrag ist dokumentiert. AMAVIO prüft jetzt, welche Termin- und Programmabhängigkeiten betroffen sind.</p></div>
      <div class="context-strip">
        <div class="context-strip__item"><strong>Bestätigter Beitrag</strong><p>${esc(handoff?.responseNote || "Standortbeitrag liegt vor.")}</p></div>
        <div class="context-strip__item"><strong>Harte Abhängigkeit</strong><p>Wohnraum und Übergabe müssen vor der Startklarheit erfüllt sein.</p></div>
        <div class="context-strip__item"><strong>Prüfergebnis</strong><p>Die Entscheidungsvorlage öffnet erst nach dokumentierter Auswirkungsprüfung.</p></div>
      </div>
      <div class="action-panel"><h3>Lokale Auswirkungsprüfung</h3><p>Keine Frist oder Programmaktion wird automatisch verändert.</p>
        <div class="field"><label for="impact-note">Prüfnotiz <span>*</span></label><textarea id="impact-note" data-order-note>Standortbeitrag gegen Wohnraum-, Übergabe- und Arbeitsstartabhängigkeit geprüft; Entscheidungsvorlage kann geöffnet werden.</textarea></div>
        <div class="action-row" style="margin-top:14px"><button class="button button--gold" type="button" data-complete-order="${order?.id || ""}" ${!order?.canAct ? "disabled" : ""}>Auswirkungsprüfung abschließen ${icon("arrow")}</button></div>
      </div>`;
  }

  function renderDecisionStage() {
    const pack = state.execution.decisionPackages?.[0];
    if (!pack) return '<div class="empty"><h2>Entscheidung wird vorbereitet</h2><p>Die vorgelagerten Arbeitsschritte sind noch nicht vollständig.</p></div>';
    return `
      <div class="section-title"><h2>${esc(pack.title)}</h2><p>${esc(pack.question)}</p></div>
      <form class="action-panel" data-decision-form data-decision-id="${pack.id}" data-version="${pack.version}">
        <h3>Menschliche Entscheidung</h3><p>Die lokale AMAVIO-Logik stellt Empfehlung und Alternative gegenüber; keine Option wird automatisch gewählt.</p>
        <div class="field"><label for="decision-option">Option <span>*</span></label><select id="decision-option" name="option" required>
          <option value="">Bitte wählen</option><option value="${esc(pack.recommendation)}">${esc(pack.recommendation)}</option><option value="${esc(pack.alternative)}">${esc(pack.alternative)}</option>
        </select></div>
        <div class="field" style="margin-top:14px"><label for="decision-rationale">Begründung <span>*</span></label><textarea id="decision-rationale" name="rationale" required>Entscheidung auf Grundlage der geklärten Wohnungsangaben, bestätigten Standortübergabe und dokumentierten Auswirkungsprüfung.</textarea></div>
        <div class="callout" style="margin-bottom:14px"><span>i</span><div><strong>Wirkungsgrenze</strong><p>${esc(pack.consequence)}</p></div></div>
        <button class="button button--gold" type="submit">Entscheidung dokumentieren ${icon("check")}</button>
      </form>`;
  }

  function renderResultStage() {
    const impact = state.execution.impacts?.[0];
    const brief = state.detail.workProducts.find((item) => item.product_type === "arrival_readiness_brief");
    return `
      <div class="section-title"><h2>Ergebnis ist nachvollziehbar dokumentiert</h2><p>Die menschliche Entscheidung erzeugt eine beratende Programmfolge und kann jetzt in ein prüfbares Arbeitsprodukt überführt werden.</p></div>
      <div class="callout" data-tone="success"><span>✓</span><div><strong>Lokale Fallentscheidung abgeschlossen</strong><p>${esc(impact?.recommendation || "Die Entscheidung bleibt dokumentiert; keine externe Wirkung.")}</p></div></div>
      <div class="action-panel"><h3>${brief ? "Arrival Readiness Brief liegt vor" : "Arrival Readiness Brief erzeugen"}</h3><p>Der Brief verbindet Evidenz, Verantwortung, Entscheidung und Wirkungsgrenze reproduzierbar.</p>
        ${brief ? `<button class="button button--secondary" type="button" data-show-product="${brief.id}">Brief öffnen</button>` : `<button class="button button--gold" type="button" data-create-product="arrival_readiness_brief">Brief erzeugen ${icon("file")}</button>`}
      </div>`;
  }

  function renderContextRail(step) {
    const next = state.execution.nextAction;
    const owners = ["AMAVIO Operations", "Arbeitgeber · Standort & Übergabe", "AMAVIO Operations", "AMAVIO Operations", "Gemeinsamer Status"];
    const outcomes = [
      "Prüfbarer Klärungsauftrag", "Bestätigter Standortbeitrag", "Geprüfte Auswirkung",
      "Dokumentierte Entscheidung", "Arrival Readiness Brief",
    ];
    const blocker = state.detail.exceptions.find((item) => item.status === "open") || state.detail.exceptions[0];
    const resolved = step === 5;
    return `<aside class="context-rail" aria-label="Arbeitskontext">
      <div class="context-group"><span>Verantwortung</span><strong>${owners[step - 1]}</strong><p>${step === 2 ? "AMAVIO wartet auf einen bewussten Arbeitgeberbeitrag." : "Der Schritt ist der aktiven Rolle zugeordnet."}</p></div>
      <div class="context-group"><span>Fällig bis</span><strong>${fmtDate(next?.dueDate || state.detail.tasks[0]?.dueDate)}</strong><p>Synthetische Pilotfrist</p></div>
      <div class="context-group"><span>${resolved ? "Bearbeiteter Ausgangskonflikt" : "Blockierende Abhängigkeit"}</span><strong>${esc(blocker?.title || "Keine harte Blockade")}</strong><p>${resolved ? "Im lokalen Arbeitsweg behandelt; verbleibende Beobachtung ist dokumentiert." : esc(blocker?.impact || "Nächster Schritt kann planmäßig vorbereitet werden.")}</p></div>
      <div class="context-group"><span>Nächstes Ergebnis</span><strong>${outcomes[step - 1]}</strong><p>Erst danach wird die nächste Phase geöffnet.</p></div>
    </aside>`;
  }

  function renderScenarioLab() {
    const scenarios = {
      evidence: {
        title: "Widersprüchliche Evidenz",
        copy: "Zwei Quellen widersprechen sich. Der Klärungsauftrag benennt Quellen, Lücke und nächste Verantwortung.",
        owner: "AMAVIO Operations", effect: "Folgeschritte bleiben bis zur Klärung blockiert.", action: "product",
      },
      overdue: {
        title: "Arbeitgeberantwort verspätet",
        copy: "Eine fällige Rückmeldung bleibt aus. Das ACC bereitet eine lokale Eskalationsvorlage vor, versendet aber nichts.",
        owner: "Gesamtsteuerung und AMAVIO Operations", effect: "Arbeitsstart und Übergabe bleiben unter Beobachtung.", action: "escalation",
      },
      schedule: {
        title: "Ankunftsdatum geändert",
        copy: "Ein Ereignis verschiebt die Ankunft. Abhängigkeiten und Fristen werden isoliert neu berechnet.",
        owner: "AMAVIO Operations", effect: "Nur eine Vorschau; Übernahme benötigt ein Human Gate.", action: "simulation",
      },
    };
    const item = scenarios[state.activeScenario];
    return `<section style="margin-top:38px" aria-labelledby="exception-paths-title">
      <div class="section-title"><h2 id="exception-paths-title">Drei geprüfte Ausnahmewege</h2><p>Die Golden Journey bleibt gleich; Ereignis, Verantwortung und nächste Vorlage ändern sich kontrolliert.</p></div>
      <div class="scenario-switch" role="tablist">
        <button type="button" role="tab" data-scenario="evidence" aria-selected="${state.activeScenario === "evidence"}">Evidenzkonflikt</button>
        <button type="button" role="tab" data-scenario="overdue" aria-selected="${state.activeScenario === "overdue"}">Antwort verspätet</button>
        <button type="button" role="tab" data-scenario="schedule" aria-selected="${state.activeScenario === "schedule"}">Termin geändert</button>
      </div>
      <div class="scenario-box" role="tabpanel">
        <h3>${item.title}</h3><p>${item.copy}</p>
        <dl><dt>Verantwortung</dt><dd>${item.owner}</dd><dt>Operative Folge</dt><dd>${item.effect}</dd></dl>
        ${scenarioAction(item.action)}
      </div>
    </section>`;
  }

  function scenarioAction(action) {
    if (action === "product") return '<button class="button button--secondary" type="button" data-create-product="exception_resolution_plan">Klärungsvorlage aktualisieren</button>';
    if (action === "escalation") return '<button class="button button--secondary" type="button" data-create-product="employer_handover_brief">Lokale Eskalationsvorlage erstellen</button>';
    if (state.simulationPreview) {
      const output = state.simulationPreview.output;
      return `<div class="callout"><span>i</span><div><strong>${esc(output.summary)}</strong><p>${output.impactedMilestones.length} Folgefristen neu berechnet; Original noch unverändert.</p></div></div>
        <div class="action-row"><button class="button button--gold" type="button" data-apply-simulation="${state.simulationPreview.id}">Geprüfte Datumsänderung lokal übernehmen</button><button class="button button--quiet" type="button" data-dismiss-simulation>Vorschau verwerfen</button></div>`;
    }
    return `<form class="action-row" data-simulation-form><div class="field"><label for="simulation-date">Neues synthetisches Anreisedatum</label><input id="simulation-date" name="arrivalDate" type="date" value="2026-09-17" required></div><button class="button button--secondary" type="submit">Auswirkung berechnen</button></form>`;
  }

  function renderTabs() {
    const panels = {
      history: renderHistory(),
      products: renderProducts(),
      metrics: renderMetrics(),
    };
    return `<section class="tabs">
      <div class="tabs__list" role="tablist">
        <button type="button" role="tab" data-tab="history" aria-selected="${state.activeTab === "history"}">Verlauf</button>
        <button type="button" role="tab" data-tab="products" aria-selected="${state.activeTab === "products"}">Arbeitsprodukte (${state.detail.workProducts.length})</button>
        <button type="button" role="tab" data-tab="metrics" aria-selected="${state.activeTab === "metrics"}">Pilotmessung</button>
      </div>
      <div class="tab-panel" role="tabpanel">${panels[state.activeTab]}</div>
    </section>`;
  }

  function renderHistory() {
    const events = state.detail.events.slice(0, 8);
    return events.length ? `<ol class="timeline">${events.map((event) => `<li><time>${fmtTime(event.created_at)}</time><div><strong>${eventLabel(event.event_type)}</strong><p>Lokaler synthetischer Arbeitsschritt · keine Außenwirkung</p></div></li>`).join("")}</ol>`
      : '<div class="empty">Noch kein lokaler Verlauf für diesen Vorgang.</div>';
  }

  function eventLabel(type) {
    const labels = {
      "work_product.created": "Arbeitsprodukt als Entwurf erstellt",
      "simulation.created": "Auswirkungsprüfung vorbereitet",
      "simulation.applied": "Geprüfte Terminänderung lokal übernommen",
      "decision.recorded": "Menschliche Entscheidung dokumentiert",
      "task.updated": "Aufgabe aktualisiert",
      "evidence.reviewed": "Evidenz fachlich geprüft",
    };
    return labels[type] || "Arbeitsstand aktualisiert";
  }

  function renderProducts() {
    const products = state.detail.workProducts;
    const selected = products.find((item) => item.id === state.selectedProductId) || products[0];
    return `${products.length ? `<div class="product-list">${products.map((item) => `<div class="product-row"><div><strong>${esc(item.title)}</strong><small>${esc(item.review_status || "Entwurf")} · lokal und synthetisch</small></div><button class="button button--quiet" type="button" data-show-product="${item.id}">Öffnen</button></div>`).join("")}</div>` : '<div class="empty">Noch kein Arbeitsprodukt erzeugt.</div>'}
      ${selected ? renderProductPreview(selected) : ""}`;
  }

  function renderProductPreview(product) {
    const sections = product.content?.sections || [];
    return `<article class="product-preview"><h3>${esc(product.content?.heading || product.title)}</h3>${sections.map((section) => `<section><h4>${esc(section.title)}</h4><p>${esc(section.text)}</p></section>`).join("")}</article>`;
  }

  function renderMetrics() {
    const summary = state.metrics?.summary || {};
    const progress = state.execution.plan?.progress || { completed: 0, total: 4 };
    const completion = Math.round((progress.completed / Math.max(progress.total, 1)) * 100);
    const elapsed = Math.max(1, Math.round((Date.now() - state.sessionStartedAt) / 60000));
    return `
      <div class="metric-grid">
        ${metric("Journey abgeschlossen", `${completion}%`, `${progress.completed} von ${progress.total} Arbeitsaufträgen`)}
        ${metric("Dokumentierte Aktionen", summary.totalEvents || 0, "nur lokale Pilotsitzung")}
        ${metric("Human Gates", summary.humanGates || 0, "bewusst bestätigt")}
        ${metric("Aktive Bearbeitungszeit", `${elapsed} Min.`, "aktueller Browserlauf")}
      </div>
      <div class="callout"><span>i</span><div><strong>Nutzenkriterien, keine Leistungsbehauptung</strong><p>Gemessen werden künftig Aufgabenerfolg, Bearbeitungszeit, Übergabelatenz, Nacharbeit und Evidenzvollständigkeit. Diese lokale Anzeige beweist noch keine reale Zeitersparnis.</p></div></div>
      <div class="action-panel action-panel--quiet"><h3>Pilotdurchlauf wiederholen</h3><p>Setzt ausschließlich diesen synthetischen lokalen Fall, seine Entwürfe und Messereignisse auf den Startstand zurück.</p><button class="button button--secondary" type="button" data-reset-pilot>${icon("refresh")} Lokalen Pilotstand zurücksetzen</button></div>`;
  }

  function renderEmployerTasks() {
    const detail = state.detail;
    const handoff = state.execution.handoffs?.[0];
    const open = handoff?.status === "open" && handoff?.canAct;
    const meta = `<div class="case-meta"><span>${esc(detail.case.mandate)}</span><span>Arbeitsbereich ${esc(roleLabels[state.lens])}</span><span class="status">${esc(handoff?.statusLabel || detail.case.readinessLabel)}</span></div>`;
    return `<div class="workspace">
      ${breadcrumbs([{ page: "tasks", label: "Aufgaben & Entscheidungen" }, { label: detail.case.id.replace("SYN-CASE-", "A-") }])}
      ${pageHead(open ? "Standortbestätigung für den geplanten Arbeitsstart" : esc(detail.case.title), "Bearbeiten Sie genau den Beitrag, für den Ihr Arbeitsbereich verantwortlich ist.", meta)}
      <div class="context-strip" style="margin-top:24px">
        <div class="context-strip__item"><strong>Worum geht es?</strong><p>Eine bestätigte Wohn- und Übergabegrundlage wird für den geplanten Arbeitsstart benötigt.</p></div>
        <div class="context-strip__item"><strong>Warum jetzt?</strong><p>Ohne eindeutigen Beitrag bleiben Auswirkungsprüfung und Entscheidung blockiert.</p></div>
        <div class="context-strip__item"><strong>Was folgt danach?</strong><p>AMAVIO prüft den Beitrag und dokumentiert den nächsten gemeinsamen Status.</p></div>
      </div>
      <div class="workspace-grid">
        <div class="work-column">
          ${renderEmployerForm(handoff, open)}
          ${renderEmployerStatus()}
        </div>
        <aside class="context-rail">
          <div class="context-group"><span>Fällig bis</span><strong>${fmtDate(handoff?.dueDate)}</strong><p>Synthetische Pilotfrist</p></div>
          <div class="context-group"><span>Abhängigkeit</span><strong>Auswirkungsprüfung durch AMAVIO</strong><p>Sie öffnet erst nach Ihrer bewussten Übergabe.</p></div>
          <div class="context-group"><span>Verantwortlicher Bereich</span><strong>${esc(roleLabels[state.lens])}</strong><p>Andere Arbeitgeberbereiche können diesen Beitrag nicht übernehmen.</p></div>
          <div class="context-group"><span>Nächstes Ergebnis</span><strong>Geprüfter gemeinsamer Status</strong><p>Keine Nachricht und keine Buchung wird ausgelöst.</p></div>
        </aside>
      </div>
    </div>`;
  }

  function renderEmployerForm(handoff, open) {
    if (!open) {
      const message = handoff?.status === "acknowledged"
        ? "Ihr Beitrag wurde übergeben. AMAVIO Operations prüft jetzt die Auswirkung."
        : handoff?.status === "returned"
          ? "Die Rückfrage ist dokumentiert. AMAVIO Operations übernimmt die Klärung."
          : "Dieser Beitrag wird nach der vorgelagerten AMAVIO-Lageklärung geöffnet.";
      return `<div class="empty"><h2>Aktuell kein bearbeitbarer Standortbeitrag</h2><p>${message}</p>${handoff?.status === "acknowledged" ? '<button class="button button--secondary" style="margin-top:16px" type="button" data-switch-operations>AMAVIO-Folgeprüfung ansehen</button>' : ""}</div>`;
    }
    return `<form class="action-panel" data-employer-form data-handoff-id="${handoff.id}" data-version="${handoff.version}">
      <h3>Ihr strukturierter Beitrag</h3><p>Pflichtangaben bleiben gemeinsam mit Grundlage und Begründung dokumentiert.</p>
      <div class="form-grid">
        <div class="field field--full"><label for="employer-address">Bestätigte Wohnadresse am Arbeitsstandort <span>*</span></label><input id="employer-address" name="address" autocomplete="off" placeholder="Synthetische Adresse eingeben" required></div>
        <div class="field"><label for="employer-date">Verfügbar ab <span>*</span></label><input id="employer-date" name="availableFrom" type="date" required></div>
        <div class="field"><label for="employer-basis">Nachweis / Grundlage <span>*</span></label><select id="employer-basis" name="basis" required><option value="">Bitte auswählen</option><option>Geprüfter Vertragsentwurf</option><option>Bestätigte Standortmeldung</option><option>Übergabeprotokoll</option></select></div>
        <div class="field field--full"><label for="employer-rationale">Kurze Begründung <span>*</span></label><textarea id="employer-rationale" name="rationale" required placeholder="Welche Grundlage wurde geprüft und was wird bestätigt?"></textarea><small>Keine sensiblen oder realen personenbezogenen Angaben verwenden.</small></div>
      </div>
      <div class="action-row" style="margin-top:18px"><button class="button button--gold" type="submit">Beitrag übergeben ${icon("arrow")}</button><button class="button button--secondary" type="button" data-return-handoff>Rückfrage an AMAVIO</button></div>
    </form>`;
  }

  function renderEmployerStatus() {
    const handoff = state.execution.handoffs?.[0];
    const steps = [
      ["Aufgabe vorbereitet", "complete"],
      ["Ihr Beitrag", handoff?.status === "acknowledged" ? "complete" : handoff?.status === "open" ? "active" : "pending"],
      ["Prüfung durch AMAVIO", handoff?.status === "acknowledged" ? "active" : "pending"],
      ["Nächste Schritte", state.execution.plan?.status === "locally_decided" ? "complete" : "pending"],
    ];
    return `<section style="margin-top:26px"><div class="section-title"><h2>Gemeinsamer Status</h2><p>Sie sehen den Arbeitsstand, nicht die interne AMAVIO-Fachlogik.</p></div><div class="phase-grid" style="grid-template-columns:repeat(4,1fr)">${steps.map((item, index) => `<div class="phase-card" data-state="${item[1]}"><span>${index + 1}</span><strong>${item[0]}</strong><small>${item[1] === "complete" ? "Erledigt" : item[1] === "active" ? "Aktuell" : "Danach"}</small></div>`).join("")}</div></section>`;
  }

  function renderDecisionDesk() {
    const packs = state.execution.decisionPackages || [];
    const products = state.detail.workProducts;
    return `<div class="workspace">
      ${pageHead("Entscheidungen", "Nur Vorgänge mit vollständiger Grundlage und bewusstem Human Gate werden hier bearbeitet.")}
      <div class="metric-grid" style="margin:24px 0">
        ${metric("Offene Vorlage", packs.filter((item) => item.status === "open").length, "menschlich zu bestätigen")}
        ${metric("Dokumentiert", packs.filter((item) => item.status === "reviewed").length, "lokale Entscheidungen")}
        ${metric("Arbeitsprodukte", products.length, "nachvollziehbare Entwürfe")}
        ${metric("Automatische Entscheidungen", 0, "nicht zulässig")}
      </div>
      ${packs.length ? renderDecisionStage() : '<div class="empty"><h2>Keine offene Entscheidung</h2><p>Die vorgelagerten Schritte der Golden Journey sind noch nicht vollständig.</p><button class="button button--secondary" style="margin-top:16px" type="button" data-nav="cases">Zur Fallarbeit</button></div>'}
      <section style="margin-top:34px"><div class="section-title"><h2>Dokumentierte Arbeitsprodukte</h2><p>Begründete Ergebnisse statt lose Statuskarten.</p></div>${renderProducts()}</section>
    </div>`;
  }

  function renderPrograms() {
    const data = state.programs;
    const selected = data.selected;
    if (!selected) return '<div class="workspace"><div class="empty">Kein synthetisches Programm verfügbar.</div></div>';
    const phases = selected.workstreams;
    return `<div class="workspace">
      ${pageHead(state.role === "employer" ? "Ankunftsprogramme" : "Programme", state.role === "employer" ? "Verfolgen Sie vereinbarte Leistungen, Meilensteine und die Beiträge Ihres Arbeitsbereichs." : "Steuern Sie Lieferstand, Abhängigkeiten und gemeinsame Ergebnisse über den Einzelfall hinaus.")}
      <div class="program-layout" style="margin-top:24px">
        <aside class="program-list"><h2>Programme</h2><div class="program-list__items">${data.programs.map((program) => `<button type="button" class="program-item" data-program="${program.id}" aria-current="${program.id === selected.program.id}"><strong>${esc(program.title)}</strong><small>${esc(program.employer)} · ${program.status === "delivery_active" ? "In Lieferung" : "In Planung"}</small></button>`).join("")}</div></aside>
        <section class="program-detail">
          <div class="section-title"><h2>${esc(selected.program.title)}</h2><p>${esc(selected.program.employer)} · Arbeitsstart ${fmtDate(selected.program.employmentStart)}</p></div>
          <div class="context-strip">
            <div class="context-strip__item"><strong>Lieferstand</strong><p>${selected.sharedStatus.completed} abgeschlossen · ${selected.sharedStatus.active} aktiv</p></div>
            <div class="context-strip__item"><strong>Offene Entscheidungen</strong><p>${selected.sharedStatus.openDecisions} menschlich zu bestätigen</p></div>
            <div class="context-strip__item"><strong>Gemeinsames Ergebnis</strong><p>${esc(selected.program.successCriteria[0] || "Arbeitsstart planmäßig")}</p></div>
          </div>
          <div class="phase-grid">${phases.map((phase) => `<div class="phase-card" data-state="${phase.status === "completed" ? "complete" : phase.status === "active" || phase.status === "blocked" ? "active" : "pending"}"><span>${phase.sequence}</span><strong>${esc(phase.title)}</strong><small>${esc(phase.ownerRole)} · ${phase.status === "blocked" ? "Klärung offen" : phase.status === "completed" ? "Abgeschlossen" : phase.status === "active" ? "Aktuell" : "Vorgemerkt"}</small></div>`).join("")}</div>
          <div class="action-panel"><h3>Nächste gemeinsame Verantwortung</h3><p>${esc(selected.decisions.find((item) => item.status === "open")?.question || "Keine offene Programmentscheidung.")}</p><div class="action-row"><button class="button button--secondary" type="button" data-nav="${state.role === "employer" ? "tasks" : "cases"}">${state.role === "employer" ? "Eigene Beiträge öffnen" : "Betroffenen Fall öffnen"}</button></div></div>
        </section>
      </div>
    </div>`;
  }

  function bindCommon() {
    document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigate({ page: button.dataset.nav })));
    document.querySelectorAll("[data-role]").forEach((button) => button.addEventListener("click", () => {
      const role = button.dataset.role;
      navigate({ role, lens: role === "employer" ? state.lens : "sponsor", page: role === "employer" ? "tasks" : "cases", caseId: "SYN-CASE-001" });
    }));
    document.querySelector("[data-work-area]")?.addEventListener("change", (event) => navigate({ lens: event.target.value, caseId: event.target.value === "location" ? "SYN-CASE-001" : state.caseId }));
    document.querySelector("[data-open-menu]")?.addEventListener("click", () => { document.body.dataset.menuOpen = "true"; });
    document.querySelector("[data-close-menu]")?.addEventListener("click", () => { document.body.dataset.menuOpen = "false"; });
  }

  function bindPage() {
    document.querySelectorAll("[data-case]").forEach((button) => button.addEventListener("click", () => navigate({ caseId: button.dataset.case, page: state.role === "employer" ? "tasks" : "cases" })));
    document.querySelector("[data-queue-search]")?.addEventListener("input", (event) => { state.queueSearch = event.target.value; render(); });
    document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => { state.queueFilter = button.dataset.filter; render(); }));
    document.querySelectorAll("[data-scenario]").forEach((button) => button.addEventListener("click", () => { state.activeScenario = button.dataset.scenario; render(); }));
    document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => { state.activeTab = button.dataset.tab; render(); }));
    document.querySelectorAll("[data-show-product]").forEach((button) => button.addEventListener("click", () => { state.selectedProductId = button.dataset.showProduct; state.activeTab = "products"; render(); document.querySelector(".tabs")?.scrollIntoView({ behavior: "smooth" }); }));
    document.querySelectorAll("[data-create-product]").forEach((button) => button.addEventListener("click", () => createProduct(button.dataset.createProduct)));
    document.querySelectorAll("[data-complete-order]").forEach((button) => button.addEventListener("click", () => completeOrder(button.dataset.completeOrder)));
    document.querySelector("[data-decision-form]")?.addEventListener("submit", submitDecision);
    document.querySelector("[data-simulation-form]")?.addEventListener("submit", createSimulation);
    document.querySelector("[data-apply-simulation]")?.addEventListener("click", (event) => applySimulation(event.currentTarget.dataset.applySimulation));
    document.querySelector("[data-dismiss-simulation]")?.addEventListener("click", () => { state.simulationPreview = null; render(); });
    document.querySelector("[data-switch-employer-location]")?.addEventListener("click", () => navigate({ role: "employer", lens: "location", page: "tasks" }));
    document.querySelector("[data-switch-operations]")?.addEventListener("click", () => navigate({ role: "operations", page: "cases" }));
    document.querySelector("[data-employer-form]")?.addEventListener("submit", submitEmployerContribution);
    document.querySelector("[data-return-handoff]")?.addEventListener("click", returnHandoff);
    document.querySelector("[data-reset-pilot]")?.addEventListener("click", resetPilot);
    document.querySelectorAll("[data-program]").forEach((button) => button.addEventListener("click", async () => {
      state.programId = button.dataset.program;
      state.programs.selected = await api(`/api/programs/v1/programs/${encodeURIComponent(state.programId)}`);
      updateUrl();
      render();
    }));
  }

  async function withBusy(action, successMessage) {
    if (state.busy) return;
    state.busy = true;
    document.querySelectorAll("button").forEach((button) => { if (button.type === "submit" || button.dataset.createProduct || button.dataset.completeOrder) button.disabled = true; });
    try {
      await action();
      if (successMessage) toast(successMessage);
      await loadData({ quiet: true });
    } catch (error) {
      toast(error.message, "error");
      render();
    } finally {
      state.busy = false;
    }
  }

  async function recordMetric(eventType, step, success = true, durationMs = null) {
    try {
      await api("/api/execution/v1/metrics/events", {
        method: "POST",
        body: { caseId: state.caseId, eventType, journeyStep: step, success, durationMs },
      });
    } catch { /* Metrics must never block casework. */ }
  }

  function createProduct(type) {
    withBusy(async () => {
      await api(`/api/v1.5/cases/${encodeURIComponent(state.caseId)}/work-products`, { method: "POST", body: { type } });
      await recordMetric("work_product_created", journeyState(), true, Date.now() - state.sessionStartedAt);
      state.activeTab = type === "arrival_readiness_brief" ? "products" : state.activeTab;
    }, "Arbeitsprodukt wurde lokal als synthetischer Entwurf erstellt.");
  }

  function completeOrder(orderId) {
    const note = document.querySelector("[data-order-note]")?.value.trim() || "";
    const order = state.execution.orders.find((item) => item.id === orderId);
    if (note.length < 12) { toast("Bitte ergänzen Sie eine nachvollziehbare Abschlussnotiz.", "error"); return; }
    withBusy(async () => {
      await api(`/api/execution/v1/work-orders/${encodeURIComponent(orderId)}/transitions`, { method: "POST", body: { version: order.version, status: "completed", note } });
      await recordMetric("journey_step_completed", order.sequence, true, Date.now() - state.sessionStartedAt);
    }, "Arbeitsschritt abgeschlossen; die nächste Abhängigkeit wurde geöffnet.");
  }

  function submitDecision(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const option = String(data.get("option") || "");
    const rationale = String(data.get("rationale") || "").trim();
    if (!option || rationale.length < 12) { toast("Option und nachvollziehbare Begründung sind erforderlich.", "error"); return; }
    withBusy(async () => {
      await api(`/api/execution/v1/decision-packages/${encodeURIComponent(form.dataset.decisionId)}/review`, {
        method: "POST", body: { version: Number(form.dataset.version), option, rationale },
      });
      await recordMetric("human_gate_confirmed", 4, true, Date.now() - state.sessionStartedAt);
    }, "Menschliche Entscheidung wurde lokal dokumentiert.");
  }

  async function createSimulation(event) {
    event.preventDefault();
    const arrivalDate = String(new FormData(event.currentTarget).get("arrivalDate") || "");
    if (!arrivalDate) return;
    try {
      const result = await api(`/api/v1.5/cases/${encodeURIComponent(state.caseId)}/simulations`, { method: "POST", body: { arrivalDate } });
      state.simulationPreview = result.simulation;
      await recordMetric("simulation_previewed", 3, true, Date.now() - state.sessionStartedAt);
      render();
      toast("Auswirkung wurde isoliert berechnet; der Originalstand ist unverändert.");
    } catch (error) { toast(error.message, "error"); }
  }

  function applySimulation(id) {
    withBusy(async () => {
      await api(`/api/v1.5/simulations/${encodeURIComponent(id)}/apply`, {
        method: "POST",
        body: { selectedChanges: ["arrivalDate"], note: "Synthetische Datumsänderung und alle berechneten Folgefristen menschlich geprüft." },
      });
      await recordMetric("human_gate_confirmed", 3, true, Date.now() - state.sessionStartedAt);
      state.simulationPreview = null;
    }, "Geprüfte Terminänderung wurde ausschließlich im lokalen synthetischen Fall übernommen.");
  }

  function submitEmployerContribution(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const contribution = {
      address: String(data.get("address") || "").trim(),
      availableFrom: String(data.get("availableFrom") || ""),
      basis: String(data.get("basis") || ""),
      rationale: String(data.get("rationale") || "").trim(),
    };
    if (!contribution.address || !contribution.availableFrom || !contribution.basis || contribution.rationale.length < 12) {
      toast("Bitte füllen Sie Adresse, Datum, Grundlage und Begründung vollständig aus.", "error"); return;
    }
    withBusy(async () => {
      await api(`/api/execution/v1/handoffs/${encodeURIComponent(form.dataset.handoffId)}/respond`, {
        method: "POST",
        body: {
          version: Number(form.dataset.version), decision: "acknowledged",
          note: `${contribution.address}; verfügbar ab ${contribution.availableFrom}; Grundlage: ${contribution.basis}. ${contribution.rationale}`,
          contribution,
        },
      });
      await recordMetric("employer_handoff_completed", 2, true, Date.now() - state.sessionStartedAt);
    }, "Arbeitgeberbeitrag wurde lokal übergeben. AMAVIO kann die Auswirkung prüfen.");
  }

  function returnHandoff() {
    const form = document.querySelector("[data-employer-form]");
    const rationale = document.querySelector("#employer-rationale")?.value.trim() || "Rückfrage: Die vorliegende Grundlage reicht für eine Bestätigung noch nicht aus.";
    withBusy(async () => {
      await api(`/api/execution/v1/handoffs/${encodeURIComponent(form.dataset.handoffId)}/respond`, {
        method: "POST", body: { version: Number(form.dataset.version), decision: "returned", note: rationale },
      });
      await recordMetric("employer_handoff_returned", 2, true, Date.now() - state.sessionStartedAt);
    }, "Rückfrage wurde lokal an AMAVIO zurückgegeben.");
  }

  function resetPilot() {
    withBusy(async () => {
      await api("/api/execution/v1/demo-reset", { method: "POST", body: { caseId: state.caseId } });
      state.simulationPreview = null;
      state.selectedProductId = null;
      state.activeTab = "history";
      state.activeScenario = "evidence";
      state.sessionStartedAt = Date.now();
    }, "Der synthetische Pilotfall wurde auf den Startstand zurückgesetzt.");
  }

  async function start() {
    if (!["http:", "https:"].includes(location.protocol)) {
      gateStatus.textContent = "Lokaler Server erforderlich";
      gateTitle.textContent = "Lokale Demo starten";
      gateMessage.textContent = "Diese Arbeitskopie wird über den lokalen AMAVIO-Demoserver ausgeführt.";
      gateActions.innerHTML = '<a class="button button--gold" href="http://127.0.0.1:4215/?page=cases">Demo auf Port 4215 öffnen</a>';
      return;
    }
    if (!localHosts.has(location.hostname)) {
      gateStatus.textContent = "Host gesperrt";
      gateTitle.textContent = "Öffentliche Ansicht nicht freigegeben";
      gateMessage.textContent = "Release O ist ausschließlich für die lokale Founder- und Pilot-Simulation vorgesehen.";
      return;
    }
    try {
      const health = await fetch("/api/health", { cache: "no-store" }).then((response) => response.json());
      if (health.status !== "ok" || health.release !== "O" || health.syntheticOnly !== true || health.externalEffects !== false) {
        throw new Error("Der lokale Sicherheitsrahmen konnte nicht bestätigt werden.");
      }
      await loadData();
      gate.hidden = true;
      app.hidden = false;
      updateUrl(false);
    } catch (error) {
      gateStatus.textContent = "System nicht bereit";
      gateTitle.textContent = "Demo ist noch nicht erreichbar";
      gateMessage.textContent = error.message || "Der lokale Demoserver antwortet gerade nicht.";
      gateActions.innerHTML = '<button class="button button--gold" type="button" data-runtime-retry>Erneut versuchen</button>';
      gateActions.querySelector("[data-runtime-retry]")?.addEventListener("click", start, { once: true });
    }
  }

  addEventListener("popstate", () => location.reload());
  start();
}());
