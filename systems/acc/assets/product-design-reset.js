(function () {
  "use strict";

  const cases = [
    {
      id: "A-2233",
      title: "Wohnraumfreigabe gefährdet den Start",
      location: "Düsseldorf",
      employer: "Klinikverbund Rheinland",
      arrival: "13.09.2026",
      deadline: "Entscheidung bis heute, 16:00 Uhr",
      dueShort: "Heute · 16:00",
      owner: "Standortleitung",
      reason: "Ohne Freigabe kann die Schlüsselübergabe nicht bestätigt werden.",
      evidence: [
        ["Wohnraum", "Freigabe seit zwei Tagen offen"],
        ["Übergabe", "Zeitfenster noch nicht bestätigt"],
        ["Verantwortung", "Standortleitung"],
      ],
      decisions: [
        { id: "reserve", label: "Wohnoption lokal vormerken", note: "Hält die vorbereitete Option im Demo-Fall offen.", effect: "Die Wohnoption bleibt im lokalen Fallbild reserviert; es wird nichts versendet." },
        { id: "clarify", label: "Rückfrage priorisieren", note: "Bereitet eine gezielte Klärung mit der Standortleitung vor.", effect: "Eine Rückfrage wird lokal vorgemerkt; keine Nachricht verlässt die Demo." },
        { id: "sponsor", label: "Sponsor einbeziehen", note: "Macht die offene Freigabe für die Arbeitgeberperspektive sichtbar.", effect: "Der Sponsor wird im synthetischen Verlauf als nächste Verantwortung markiert." },
      ],
      impacts: [
        { id: "later", label: "Anreise verschiebt sich um vier Tage", result: "Die Wohnraumfreigabe verliert ihre heutige Dringlichkeit. Neu zu prüfen wären Schlüsselzeit, Startdatum und Standortkapazität." },
        { id: "lost", label: "Die vorbereitete Wohnoption fällt aus", result: "Der Start bleibt gefährdet. Eine alternative Wohnoption und ein neues Übergabefenster wären vor einer Zusage erforderlich." },
        { id: "silent", label: "Die Standortleitung reagiert heute nicht", result: "Die Verantwortung sollte bis 16:00 Uhr an den Sponsor eskaliert werden. Externe Kommunikation bleibt unvorbereitet." },
      ],
      next: ["Schlüsselübergabe bestätigen", "Standort über den geprüften Stand informieren", "Startklarheit im lokalen Verlauf dokumentieren"],
      roles: ["sponsor", "hr", "location"],
    },
    {
      id: "A-2214",
      title: "Standortverantwortung noch offen",
      location: "Köln",
      employer: "Klinikverbund Rheinland",
      arrival: "17.09.2026",
      deadline: "Klärung bis heute, 14:00 Uhr",
      dueShort: "Heute · 14:00",
      owner: "HR",
      reason: "Für die ersten 48 Stunden ist noch keine erreichbare Standortvertretung bestätigt.",
      evidence: [
        ["Standort", "Dienstplan liegt nur als Entwurf vor"],
        ["Vertretung", "Keine bestätigte Rufnummer hinterlegt"],
        ["Verantwortung", "HR koordiniert die Klärung"],
      ],
      decisions: [
        { id: "nominate", label: "Vertretung vorschlagen", note: "Benennt eine Person im lokalen Demo-Fall.", effect: "Ein Vorschlag wird lokal hinterlegt und bleibt bis zur menschlichen Bestätigung unverbindlich." },
        { id: "request", label: "Bestätigung vorbereiten", note: "Bündelt die noch fehlenden Angaben.", effect: "Die benötigten Angaben werden als kompakte Rückfrage vorbereitet, aber nicht versendet." },
      ],
      impacts: [
        { id: "night", label: "Ankunft erfolgt außerhalb der Kernzeit", result: "Zusätzlich wären Rufbereitschaft, Zugang und Übergabeort verbindlich zu bestätigen." },
        { id: "delegate", label: "HR übergibt an den Standort", result: "Die operative Verantwortung wechselt. Die Übergabe gilt erst nach einer namentlichen Bestätigung als belastbar." },
      ],
      next: ["Erreichbare Vertretung benennen", "Zugang und Treffpunkt bestätigen", "Übergabe durch HR prüfen lassen"],
      roles: ["sponsor", "hr", "location"],
    },
    {
      id: "A-2198",
      title: "30-Tage-Review ist überfällig",
      location: "Solingen",
      employer: "Klinikverbund Rheinland",
      arrival: "06.08.2026",
      deadline: "Rückmeldung bis heute, 17:00 Uhr",
      dueShort: "Heute · 17:00",
      owner: "HR",
      reason: "Zwei Rückmeldungen fehlen; dadurch bleibt unklar, ob der Start stabilisiert ist.",
      evidence: [
        ["Fachkraft", "Synthetische Rückmeldung offen"],
        ["Standort", "Review noch nicht bestätigt"],
        ["Verantwortung", "HR"],
      ],
      decisions: [
        { id: "complete", label: "Review vervollständigen", note: "Führt beide fehlenden Rückmeldungen zusammen.", effect: "Eine lokale Prüfliste wird geöffnet; keine Erinnerung wird automatisch versendet." },
        { id: "flag", label: "Risiko zur Prüfung markieren", note: "Hält die offene Lage sichtbar.", effect: "Der Fall bleibt priorisiert, bis beide Perspektiven menschlich geprüft wurden." },
      ],
      impacts: [
        { id: "positive", label: "Beide Rückmeldungen sind positiv", result: "Der Fall kann nach menschlicher Prüfung aus der Tagespriorität genommen werden." },
        { id: "concern", label: "Der Standort meldet Unterstützungsbedarf", result: "Ein konkretes Folgethema sollte Verantwortlichem, Frist und nächstem Kontakt zugeordnet werden." },
      ],
      next: ["Beide Rückmeldungen zusammenführen", "Abweichungen fachlich prüfen", "Review-Ergebnis lokal dokumentieren"],
      roles: ["sponsor", "hr"],
    },
    {
      id: "A-2247",
      title: "Dokumentübergabe für den Standort abstimmen",
      location: "Neuss",
      employer: "Klinikverbund Rheinland",
      arrival: "22.09.2026",
      deadline: "Diese Woche",
      dueShort: "12.09.2026",
      owner: "AMAVIO Operations",
      reason: "Die Übergabereihenfolge ist vorbereitet, aber noch nicht mit dem Standort abgestimmt.",
      evidence: [["Dokumente", "Nur synthetische Beispieldokumente"], ["Standort", "Prüfung ausstehend"]],
      decisions: [{ id: "prepare", label: "Abstimmung vorbereiten", note: "Erstellt eine lokale Prüfreihenfolge.", effect: "Die Prüfreihenfolge wird nur in dieser Sitzung vorgemerkt." }],
      impacts: [{ id: "delay", label: "Standortprüfung verschiebt sich", result: "Die Übergabe sollte zeitlich neu eingeordnet werden; es entsteht noch keine Außenwirkung." }],
      next: ["Prüfreihenfolge bestätigen", "Standortverantwortung zuordnen", "Übergabestand dokumentieren"],
      roles: ["hr", "location"],
    },
    {
      id: "A-2285",
      title: "Budgetfreigabe für zusätzliche Begleitung prüfen",
      location: "Düsseldorf",
      employer: "Klinikverbund Rheinland",
      arrival: "28.09.2026",
      deadline: "Bis 15.09.2026",
      dueShort: "15.09.2026",
      owner: "Budget",
      reason: "Der synthetische Fall enthält einen zusätzlichen, noch ungeprüften Begleitbedarf.",
      evidence: [["Bedarf", "Synthetische Annahme"], ["Kosten", "Noch nicht freigegeben"]],
      decisions: [{ id: "budget", label: "Kostenprüfung vormerken", note: "Grenzt den Prüfbedarf ein.", effect: "Eine lokale Budgetprüfung wird vorgemerkt; es erfolgt keine Bestellung oder Buchung." }],
      impacts: [{ id: "remove", label: "Zusatzbedarf entfällt", result: "Die Budgetprüfung wäre nicht mehr erforderlich; der Basisablauf bleibt unverändert." }],
      next: ["Bedarf fachlich bestätigen", "Kostenrahmen prüfen", "Entscheidung dokumentieren"],
      roles: ["sponsor", "budget"],
    },
  ];

  const profiles = {
    admin: { name: "Alex Cordes", initials: "AC", role: "AMAVIO Operations", intro: "Drei Vorgänge brauchen Ihre Aufmerksamkeit." },
    sponsor: { name: "Dr. Martin Keller", initials: "MK", role: "Sponsor", intro: "Zwei Entscheidungen brauchen heute Ihre Aufmerksamkeit." },
    hr: { name: "Sabine Brandt", initials: "SB", role: "HR", intro: "Drei Vorgänge brauchen heute Ihre Koordination." },
    location: { name: "Nina Schubert", initials: "NS", role: "Standort", intro: "Zwei Standortfragen brauchen heute eine Bestätigung." },
    budget: { name: "Jonas Weber", initials: "JW", role: "Budget", intro: "Eine Kostenfrage braucht heute Ihre Prüfung." },
  };

  const state = {
    role: "admin",
    employerLens: "sponsor",
    page: "today",
    activeCase: "A-2233",
    selectedDecision: null,
    completed: {},
    histories: {},
  };

  const q = (selector, root) => (root || document).querySelector(selector);
  const qa = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const activeCase = () => cases.find((item) => item.id === state.activeCase) || cases[0];
  const activeProfile = () => state.role === "admin" ? profiles.admin : profiles[state.employerLens];

  function visiblePriorityCases() {
    const priorities = cases.slice(0, 3);
    if (state.role === "admin") return priorities;
    return cases.filter((item) => item.roles.includes(state.employerLens)).slice(0, 3);
  }

  function appendHistory(message) {
    const id = state.activeCase;
    const line = `${new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · ${message}`;
    state.histories[id] = [line].concat(state.histories[id] || []).slice(0, 6);
    renderHistory();
  }

  function renderProfile() {
    const profile = activeProfile();
    q("[data-profile-initials]").textContent = profile.initials;
    q("[data-profile-name]").textContent = profile.name;
    q("[data-profile-role]").textContent = profile.role;
    q(".profile").setAttribute("aria-label", `Demo-Profil ${profile.name}, ${profile.role}`);
    q("[data-today-intro]").textContent = profile.intro;
    q(".employer-lens").hidden = state.role !== "employer";
    document.body.dataset.role = state.role;
    qa("[data-role-target]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.roleTarget === state.role)));
  }

  function renderPriorityList() {
    const visible = visiblePriorityCases();
    if (!visible.some((item) => item.id === state.activeCase)) state.activeCase = visible[0] ? visible[0].id : cases[0].id;
    q("[data-worklist-count]").textContent = `${visible.length} offen`;
    q("[data-priority-list]").innerHTML = visible.map((item) => `
      <button type="button" class="case-row" data-case-id="${item.id}" aria-current="${item.id === state.activeCase}">
        <strong>${item.title}</strong>
        <small>${item.id} · ${item.location} · ${item.dueShort}</small>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
      </button>`).join("");
    qa("[data-case-id]", q("[data-priority-list]")).forEach((button) => button.addEventListener("click", () => selectCase(button.dataset.caseId)));
  }

  function renderCase() {
    const item = activeCase();
    state.selectedDecision = null;
    q("[data-case-title]").textContent = item.title;
    q("[data-case-meta]").textContent = `Fall ${item.id} · Anreise ${item.arrival} · ${item.location}`;
    q("[data-case-deadline]").textContent = item.deadline;
    q("[data-case-reason]").textContent = item.reason;
    q("[data-case-state]").textContent = state.completed[item.id] ? "Lokal vorgemerkt" : "Entscheidung offen";
    q("[data-case-evidence]").innerHTML = item.evidence.map(([label, value]) => `<div><b>${label}</b><span>${value}</span></div>`).join("");
    q("[data-case-evidence]").hidden = true;
    q("[data-toggle-evidence]").setAttribute("aria-expanded", "false");
    q("[data-toggle-evidence]").textContent = "Belege anzeigen";
    q("[data-impact-panel]").hidden = true;
    q("[data-decision-panel]").hidden = true;
    q("[data-toggle-impact]").setAttribute("aria-expanded", "false");
    q("[data-impact-select]").innerHTML = item.impacts.map((impact) => `<option value="${impact.id}">${impact.label}</option>`).join("");
    q("[data-impact-result]").textContent = "Noch keine Änderung geprüft.";
    q("[data-decision-options]").innerHTML = item.decisions.map((decision) => `
      <button type="button" class="decision-option" data-decision-id="${decision.id}" aria-pressed="false">
        <b>${decision.label}</b><span>${decision.note}</span>
      </button>`).join("");
    qa("[data-decision-id]").forEach((button) => button.addEventListener("click", () => selectDecision(button.dataset.decisionId)));
    q("[data-decision-preview]").textContent = "Wählen Sie eine Option, um die Auswirkung zu sehen.";
    q("[data-confirm-decision]").disabled = true;
    q("[data-assistant-input]").value = "";
    q("[data-assistant-answer]").hidden = true;
    q("[data-next-steps]").innerHTML = item.next.map((step, index) => `<li class="${state.completed[item.id] && index === 0 ? "is-done" : ""}">${step}</li>`).join("");
    renderHistory();
    renderPriorityList();
  }

  function renderHistory() {
    const history = state.histories[state.activeCase] || [];
    q("[data-local-history]").innerHTML = history.length
      ? history.map((entry) => `<div>${entry}</div>`).join("")
      : "Ausgangszustand geladen · keine Außenwirkung.";
  }

  function selectCase(id) {
    state.activeCase = id;
    renderCase();
  }

  function selectDecision(id) {
    const decision = activeCase().decisions.find((item) => item.id === id);
    if (!decision) return;
    state.selectedDecision = id;
    qa("[data-decision-id]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.decisionId === id)));
    q("[data-decision-preview]").textContent = decision.effect;
    q("[data-confirm-decision]").disabled = false;
  }

  function renderCaseTable(filter) {
    const term = (filter || "").trim().toLocaleLowerCase("de-DE");
    const matches = cases.filter((item) => [item.id, item.title, item.location, item.employer, item.owner].join(" ").toLocaleLowerCase("de-DE").includes(term));
    q("[data-case-table]").innerHTML = matches.length ? matches.map((item) => `
      <button type="button" class="case-table-row" role="row" data-table-case="${item.id}">
        <span role="cell"><strong>${item.id}</strong><small>${item.location} · ${item.employer}</small></span>
        <span role="cell">${item.next[0]}</span>
        <span role="cell">${item.owner}</span>
        <span role="cell" class="due">${item.dueShort}</span>
      </button>`).join("") : '<div class="empty-state">Keine synthetischen Fälle gefunden.</div>';
    qa("[data-table-case]").forEach((button) => button.addEventListener("click", () => {
      state.activeCase = button.dataset.tableCase;
      showPage("today");
      renderCase();
      q("[data-case-title]").focus({ preventScroll: true });
    }));
  }

  function showPage(page) {
    state.page = page;
    document.body.dataset.page = page;
    qa("[data-page]").forEach((section) => {
      const active = section.dataset.page === page;
      section.hidden = !active;
      section.classList.toggle("active", active);
    });
    qa("[data-page-target]").forEach((button) => {
      const active = button.dataset.pageTarget === page;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    if (page === "cases") renderCaseTable(q("[data-case-search]").value);
    closeMenu();
  }

  function setRole(role) {
    state.role = role;
    renderProfile();
    renderPriorityList();
    renderCase();
    closeMenu();
  }

  function closeMenu() {
    document.body.classList.remove("nav-open");
    q("[data-menu-button]").setAttribute("aria-expanded", "false");
  }

  function resetDemo() {
    state.role = "admin";
    state.employerLens = "sponsor";
    state.page = "today";
    state.activeCase = "A-2233";
    state.selectedDecision = null;
    state.completed = {};
    state.histories = {};
    q("[data-employer-lens]").value = "sponsor";
    q("[data-case-search]").value = "";
    q("[data-insight-status]").textContent = "Keine Änderung an Vorlagen oder Prozessen.";
    renderProfile();
    renderPriorityList();
    renderCase();
    showPage("today");
  }

  qa("[data-page-target]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.pageTarget)));
  qa("[data-role-target]").forEach((button) => button.addEventListener("click", () => setRole(button.dataset.roleTarget)));
  q("[data-employer-lens]").addEventListener("change", (event) => {
    state.employerLens = event.target.value;
    renderProfile();
    renderPriorityList();
    renderCase();
  });
  q("[data-toggle-evidence]").addEventListener("click", (event) => {
    const evidence = q("[data-case-evidence]");
    evidence.hidden = !evidence.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!evidence.hidden));
    event.currentTarget.textContent = evidence.hidden ? "Belege anzeigen" : "Belege ausblenden";
  });
  q("[data-toggle-impact]").addEventListener("click", (event) => {
    q("[data-impact-panel]").hidden = false;
    q("[data-decision-panel]").hidden = true;
    event.currentTarget.setAttribute("aria-expanded", "true");
    q("[data-impact-select]").focus();
  });
  q("[data-close-impact]").addEventListener("click", () => {
    q("[data-impact-panel]").hidden = true;
    q("[data-toggle-impact]").setAttribute("aria-expanded", "false");
    q("[data-toggle-impact]").focus();
  });
  q("[data-run-impact]").addEventListener("click", () => {
    const impact = activeCase().impacts.find((item) => item.id === q("[data-impact-select]").value);
    q("[data-impact-result]").textContent = impact ? impact.result : "Für diese Änderung liegt keine lokale Simulation vor.";
    if (impact) appendHistory(`Auswirkung geprüft: ${impact.label}`);
  });
  q("[data-open-decision]").addEventListener("click", () => {
    q("[data-decision-panel]").hidden = false;
    q("[data-impact-panel]").hidden = true;
    q("[data-toggle-impact]").setAttribute("aria-expanded", "false");
    const first = q("[data-decision-id]");
    if (first) first.focus();
  });
  q("[data-close-decision]").addEventListener("click", () => {
    q("[data-decision-panel]").hidden = true;
    q("[data-open-decision]").focus();
  });
  q("[data-confirm-decision]").addEventListener("click", () => {
    const decision = activeCase().decisions.find((item) => item.id === state.selectedDecision);
    if (!decision) return;
    state.completed[state.activeCase] = decision.label;
    appendHistory(`Entscheidung lokal vorgemerkt: ${decision.label}`);
    q("[data-case-state]").textContent = "Lokal vorgemerkt";
    const firstStep = q("[data-next-steps] li");
    if (firstStep) firstStep.classList.add("is-done");
    q("[data-confirm-decision]").textContent = "Lokal vorgemerkt";
    q("[data-confirm-decision]").disabled = true;
  });
  q("[data-assistant-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    const question = q("[data-assistant-input]").value.trim();
    if (!question) return;
    const item = activeCase();
    const normalized = question.toLocaleLowerCase("de-DE");
    let answer;
    if (/fehl|offen/.test(normalized)) answer = `Noch offen: ${item.evidence.map((entry) => entry[1]).join("; ")}.`;
    else if (/warum|prior|dring/.test(normalized)) answer = item.reason;
    else if (/wer|verantwort/.test(normalized)) answer = `Aktuell zugeordnet: ${item.owner}. Eine Änderung braucht weiterhin eine menschliche Bestätigung.`;
    else if (/auswirkung|ändert|verschieb/.test(normalized)) answer = item.impacts[0].result;
    else answer = `${item.title}. ${item.reason} Der nächste vorbereitete Schritt ist: ${item.next[0]}.`;
    q("[data-assistant-answer]").textContent = answer;
    q("[data-assistant-answer]").hidden = false;
    appendHistory("Kontextfrage lokal ausgewertet");
  });
  q("[data-case-search]").addEventListener("input", (event) => renderCaseTable(event.target.value));
  q("[data-review-insight]").addEventListener("click", () => {
    q("[data-insight-status]").textContent = "Zur fachlichen Prüfung lokal vorgemerkt · keine Prozessänderung.";
  });
  q("[data-menu-button]").addEventListener("click", () => {
    const open = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", open);
    q("[data-menu-button]").setAttribute("aria-expanded", String(open));
  });
  q("[data-sidebar-close]").addEventListener("click", closeMenu);
  q("[data-reset-demo]").addEventListener("click", resetDemo);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  window.AMAVIO_ACC_DESIGN_RESET = {
    getState: () => JSON.parse(JSON.stringify(state)),
    reset: resetDemo,
  };

  resetDemo();
}());
