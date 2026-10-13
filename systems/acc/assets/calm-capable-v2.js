(function () {
  "use strict";

  const icon = {
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v15H5zM8 3v4M16 3v4M5 9h14"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 15 6-6M7 17l-1 1a3 3 0 0 1-4-4l4-4a3 3 0 0 1 4 0M17 7l1-1a3 3 0 0 1 4 4l-4 4a3 3 0 0 1-4 0"/></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 4-1 11-11-3-3L5 16zM14 7l3 3"/></svg>',
  };

  function plan(titles, owners) {
    return titles.map((title, index) => ({
      id: `step-${index + 1}`,
      title,
      owner: owners[index],
      due: index === 0 ? "Heute, 16:00" : `${String(7 + index).padStart(2, "0")}.09.2026`,
      dependency: index === 0 ? "Keine Abhängigkeit" : `Nach Schritt ${index}`,
    }));
  }

  const cases = [
    {
      id: "A-2233", title: "Wohnraumfreigabe gefährdet den Start", location: "Düsseldorf", employer: "Klinikverbund Rheinland", arrival: "13.09.2026", deadline: "Entscheidung bis heute, 16:00 Uhr", dueShort: "Heute · 16:00", owner: "Standortleitung", status: "Entscheidung offen",
      reason: "Ohne Freigabe kann die Schlüsselübergabe nicht bestätigt werden.",
      evidence: [["Wohnraum", "Freigabe seit zwei Tagen offen"], ["Übergabe", "Zeitfenster noch nicht bestätigt"], ["Verantwortung", "Standortleitung"]],
      missing: ["Wohnungsadresse final bestätigen", "Übergabeprotokoll zuordnen"],
      situation: [["Kritische Abhängigkeit", "Wohnraumfreigabe vor Bestätigung der Schlüsselzeit"], ["Betroffene Rollen", "Standortleitung, Wohnanbieter, AMAVIO Operations"], ["Empfohlene Entscheidung", "Wohnoption lokal vormerken und Rückfrage priorisieren"], ["Nächste Kontrolle", "Heute, 16:00 Uhr"]],
      plan: plan(["Wohnraumfreigabe einholen", "Schlüsselzeit bestätigen", "Ankunftsinformation vorbereiten", "Standortvertretung bestätigen", "Startklarheit prüfen"], ["Facility Management", "Standortverantwortung", "HR Operations", "Standortleitung", "AMAVIO Operations"]),
      impacts: [
        { id: "housing_fails", label: "Die vorbereitete Wohnoption fällt aus", after: "Start kritisch · Ersatzunterkunft wird zur neuen Hauptabhängigkeit.", effects: [["Neue Abhängigkeit", "Alternative Wohnoption prüfen"], ["Betroffene Schritte", "Schlüsselzeit und Ankunftsinformation pausieren"], ["Nächste Entscheidung", "Sponsor bis 16:00 Uhr einbeziehen"]] },
        { id: "arrival_later", label: "Die Anreise verschiebt sich um vier Tage", after: "Startdatum verschoben · Wohnoption und Standortkapazität müssen neu bestätigt werden.", effects: [["Frist", "Neue Anreise am 17.09.2026"], ["Betroffene Rollen", "HR, Standort, Wohnanbieter"], ["Nächste Entscheidung", "Bestehende Reservierung verlängern oder neu planen"]] },
        { id: "owner_silent", label: "Die Standortleitung reagiert heute nicht", after: "Entscheidung blockiert · Sponsor wird zur nächsten Verantwortung.", effects: [["Eskalation", "Sponsor heute um 16:00 Uhr"], ["Risiko", "Schlüsselübergabe bleibt unbestätigt"], ["Vorbereitung", "Kompakte Entscheidungsvorlage erstellen"]] },
      ],
      decisions: [
        { id: "reserve", label: "Wohnoption lokal vormerken", note: "Hält die vorbereitete Option im Demo-Fall offen.", effect: "Die Option bleibt lokal reserviert; es wird keine Buchung ausgelöst." },
        { id: "clarify", label: "Rückfrage priorisieren", note: "Bündelt die zwei fehlenden Angaben.", effect: "Eine gezielte Rückfrage wird vorbereitet, aber nicht versendet." },
        { id: "sponsor", label: "Gesamtsteuerung einbeziehen", note: "Macht die blockierte Freigabe entscheidungsfähig.", effect: "Die Gesamtsteuerung wird als nächste Verantwortung im lokalen Verlauf markiert." },
      ],
      roles: ["sponsor", "hr", "location"],
    },
    {
      id: "A-2214", title: "Standortverantwortung noch offen", location: "Köln", employer: "Klinikverbund Rheinland", arrival: "17.09.2026", deadline: "Klärung bis heute, 14:00 Uhr", dueShort: "Heute · 14:00", owner: "HR", status: "Klärung offen",
      reason: "Für die ersten 48 Stunden ist noch keine erreichbare Standortvertretung bestätigt.",
      evidence: [["Standort", "Dienstplan liegt nur als Entwurf vor"], ["Vertretung", "Keine bestätigte Rufnummer hinterlegt"], ["Verantwortung", "HR koordiniert die Klärung"]],
      missing: ["Name der Vertretung", "Erreichbare Rufnummer"],
      situation: [["Kritische Abhängigkeit", "Erreichbare Vertretung für die ersten 48 Stunden"], ["Betroffene Rollen", "HR und Standortleitung"], ["Empfohlene Entscheidung", "Vertretung vorschlagen und bestätigen lassen"], ["Nächste Kontrolle", "Heute, 14:00 Uhr"]],
      plan: plan(["Vertretung vorschlagen", "Rufnummer bestätigen", "Zugang und Treffpunkt klären", "Fachkraftinformation vorbereiten", "Übergabe durch HR prüfen"], ["HR", "Standortleitung", "Standort", "AMAVIO Operations", "HR"]),
      impacts: [{ id: "late", label: "Ankunft erfolgt außerhalb der Kernzeit", after: "Übergabe gefährdet · Rufbereitschaft und Zugang werden kritisch.", effects: [["Zusätzliche Angabe", "Rufbereitschaft"], ["Betroffener Schritt", "Zugang und Treffpunkt"], ["Entscheidung", "Standortvertretung verbindlich benennen"]] }],
      decisions: [{ id: "nominate", label: "Vertretung vorschlagen", note: "Benennt eine Person im lokalen Fall.", effect: "Der Vorschlag bleibt bis zur menschlichen Bestätigung unverbindlich." }, { id: "request", label: "Bestätigung vorbereiten", note: "Bündelt die fehlenden Angaben.", effect: "Eine Rückfrage wird lokal vorbereitet und nicht versendet." }], roles: ["sponsor", "hr", "location"],
    },
    {
      id: "A-2198", title: "30-Tage-Review ist überfällig", location: "Solingen", employer: "Klinikverbund Rheinland", arrival: "06.08.2026", deadline: "Rückmeldung bis heute, 17:00 Uhr", dueShort: "Heute · 17:00", owner: "HR", status: "Review offen",
      reason: "Zwei Rückmeldungen fehlen; dadurch bleibt unklar, ob der Start stabilisiert ist.",
      evidence: [["Fachkraft", "Synthetische Rückmeldung offen"], ["Standort", "Review noch nicht bestätigt"], ["Verantwortung", "HR"]], missing: ["Rückmeldung Fachkraft", "Rückmeldung Standort"],
      situation: [["Kritische Abhängigkeit", "Beide Perspektiven vor Abschluss zusammenführen"], ["Betroffene Rollen", "HR, Standort, AMAVIO Operations"], ["Empfohlene Entscheidung", "Review vervollständigen"], ["Nächste Kontrolle", "Heute, 17:00 Uhr"]],
      plan: plan(["Fachkraft-Rückmeldung vorbereiten", "Standort-Rückmeldung vorbereiten", "Abweichungen zusammenführen", "Unterstützungsbedarf zuordnen", "Review abschließen"], ["AMAVIO Operations", "HR", "HR", "Standort", "HR"]),
      impacts: [{ id: "support", label: "Der Standort meldet Unterstützungsbedarf", after: "Review bleibt offen · ein konkretes Folgethema braucht Verantwortung und Frist.", effects: [["Neuer Schritt", "Unterstützungsbedarf qualifizieren"], ["Verantwortung", "Personal und Standort"], ["Kontrolle", "Innerhalb von zwei Arbeitstagen"]] }],
      decisions: [{ id: "complete", label: "Review vervollständigen", note: "Führt beide Perspektiven zusammen.", effect: "Eine lokale Prüfliste wird geöffnet; keine Erinnerung wird versendet." }, { id: "flag", label: "Risiko zur Prüfung markieren", note: "Hält die offene Lage sichtbar.", effect: "Der Fall bleibt bis zur menschlichen Prüfung priorisiert." }], roles: ["sponsor", "hr"],
    },
    {
      id: "A-2247", title: "Dokumentübergabe für den Standort abstimmen", location: "Neuss", employer: "Klinikverbund Rheinland", arrival: "22.09.2026", deadline: "Diese Woche", dueShort: "12.09.2026", owner: "AMAVIO Operations", status: "Abstimmung offen",
      reason: "Die Übergabereihenfolge ist vorbereitet, aber noch nicht mit dem Standort abgestimmt.", evidence: [["Dokumente", "Nur synthetische Beispieldokumente"], ["Standort", "Prüfung ausstehend"]], missing: ["Prüfreihenfolge"],
      situation: [["Kritische Abhängigkeit", "Freigegebene Prüfreihenfolge"], ["Betroffene Rollen", "AMAVIO Operations und Standort"], ["Empfohlene Entscheidung", "Abstimmung vorbereiten"], ["Nächste Kontrolle", "12.09.2026"]],
      plan: plan(["Dokumentumfang prüfen", "Prüfreihenfolge vorschlagen", "Standortverantwortung zuordnen", "Übergabe abstimmen", "Stand dokumentieren"], ["AMAVIO Operations", "AMAVIO Operations", "Standort", "Standort", "AMAVIO Operations"]), impacts: [{ id: "delay", label: "Standortprüfung verschiebt sich", after: "Übergabe wird später · Verantwortungen und Reihenfolge bleiben offen.", effects: [["Neue Frist", "Nach Standortbestätigung"], ["Risiko", "Unklare Übergabe"], ["Nächster Schritt", "Prüfreihenfolge erneut terminieren"]] }], decisions: [{ id: "prepare", label: "Abstimmung vorbereiten", note: "Erstellt eine lokale Prüfreihenfolge.", effect: "Die Reihenfolge wird nur in dieser Sitzung vorgemerkt." }], roles: ["hr", "location"],
    },
    {
      id: "A-2285", title: "Budgetfreigabe für zusätzliche Begleitung prüfen", location: "Düsseldorf", employer: "Klinikverbund Rheinland", arrival: "28.09.2026", deadline: "Bis 15.09.2026", dueShort: "15.09.2026", owner: "Budget", status: "Freigabe offen",
      reason: "Der synthetische Fall enthält einen zusätzlichen, noch ungeprüften Begleitbedarf.", evidence: [["Bedarf", "Synthetische Annahme"], ["Kosten", "Noch nicht freigegeben"]], missing: ["Bestätigter Bedarf", "Kostenrahmen"],
      situation: [["Kritische Abhängigkeit", "Fachliche Bedarfsbestätigung vor Kostenfreigabe"], ["Betroffene Bereiche", "Personal, Budget, Gesamtsteuerung"], ["Empfohlene Entscheidung", "Kostenprüfung vormerken"], ["Nächste Kontrolle", "15.09.2026"]],
      plan: plan(["Bedarf fachlich bestätigen", "Leistungsumfang abgrenzen", "Kostenrahmen prüfen", "Entscheidung der Gesamtsteuerung vorbereiten", "Freigabe dokumentieren"], ["Personal", "AMAVIO Operations", "Budget", "Gesamtsteuerung", "Budget"]), impacts: [{ id: "remove", label: "Der zusätzliche Bedarf entfällt", after: "Budgetprüfung entfällt · der Basisablauf bleibt bestehen.", effects: [["Entfallender Schritt", "Kostenrahmen prüfen"], ["Unverändert", "Basisbegleitung"], ["Nächste Kontrolle", "Bedarfsstatus dokumentieren"]] }], decisions: [{ id: "budget", label: "Kostenprüfung vormerken", note: "Grenzt den Prüfbedarf ein.", effect: "Eine lokale Budgetprüfung wird vorgemerkt; es erfolgt keine Buchung." }], roles: ["sponsor", "budget"],
    },
  ];

  const profiles = {
    admin: { name: "Alex Cordes", initials: "AC", role: "AMAVIO Operations", intro: "Drei Vorgänge brauchen Ihre Aufmerksamkeit." },
    sponsor: { name: "Dr. Martin Keller", initials: "MK", role: "Gesamtsteuerung", intro: "Drei bereichsübergreifende Entscheidungen brauchen heute Ihre Aufmerksamkeit." },
    hr: { name: "Sabine Brandt", initials: "SB", role: "Personal & Onboarding", intro: "Vier personalbezogene Vorgänge brauchen heute Ihre Koordination." },
    location: { name: "Nina Schubert", initials: "NS", role: "Standort & Übergabe", intro: "Drei Standortfragen brauchen heute eine Bestätigung." },
    budget: { name: "Jonas Weber", initials: "JW", role: "Budget & Freigaben", intro: "Eine Kostenfrage braucht heute Ihre Prüfung." },
  };

  const documentTypes = [
    { id: "location", label: "Rückfrage Standort", recipient: "Standortleitung" },
    { id: "sponsor", label: "Entscheidungsupdate", recipient: "Arbeitgeber · Gesamtsteuerung" },
    { id: "arrival", label: "Ankunftsinformation", recipient: "Fachkraft · getrennte App" },
  ];

  const state = { role: "admin", employerLens: "sponsor", page: "today", activeCase: "A-2233", mode: "plan", selectedDecision: null, selectedDocument: "location", selectedScenario: null, editingStep: null, reorder: false, completed: {}, histories: {} };
  const validPages = ["today", "cases", "twin", "twin-decisions", "operations", "collaboration", "programs", "planning", "evaluation", "learning", "learning-quality"];
  const internalPages = new Set(["twin", "twin-decisions", "planning", "evaluation", "learning", "learning-quality"]);
  const validModes = ["understand", "plan", "simulate", "prepare", "history"];
  const validLenses = ["sponsor", "hr", "location", "budget"];
  const routeContext = { opsCase: "", opsMode: "", program: "" };
  let restoringRoute = false;
  const q = (selector, root) => (root || document).querySelector(selector);
  const qa = (selector, root) => Array.from((root || document).querySelectorAll(selector));
  const getCase = () => cases.find((item) => item.id === state.activeCase) || cases[0];
  const getProfile = () => state.role === "admin" ? profiles.admin : profiles[state.employerLens];

  function readRoute() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role") === "employer" ? "employer" : "admin";
    const employerLens = validLenses.includes(params.get("lens")) ? params.get("lens") : "sponsor";
    let page = validPages.includes(params.get("page")) ? params.get("page") : "today";
    if (role === "employer" && (internalPages.has(page) || page === "operations")) page = "collaboration";
    if (role === "admin" && page === "collaboration") page = "operations";
    const activeCase = cases.some((item) => item.id === params.get("case")) ? params.get("case") : "A-2233";
    const mode = validModes.includes(params.get("mode")) ? params.get("mode") : "plan";
    return { role, employerLens, page, activeCase, mode, opsCase: params.get("opsCase") || "", opsMode: params.get("opsMode") || "", program: params.get("program") || "" };
  }

  function routeUrl() {
    const params = new URLSearchParams();
    params.set("page", state.page);
    if (state.role === "employer") {
      params.set("role", "employer");
      params.set("lens", state.employerLens);
    }
    if (["today", "cases"].includes(state.page) && state.activeCase !== "A-2233") params.set("case", state.activeCase);
    if (["today", "cases"].includes(state.page) && state.mode !== "plan") params.set("mode", state.mode);
    if (["operations", "collaboration"].includes(state.page) && routeContext.opsCase) params.set("opsCase", routeContext.opsCase);
    if (state.page === "operations" && routeContext.opsMode && routeContext.opsMode !== "evidence") params.set("opsMode", routeContext.opsMode);
    if (state.page === "programs" && routeContext.program) params.set("program", routeContext.program);
    return `${window.location.pathname}?${params.toString()}`;
  }

  function syncRoute(historyMode = "replace") {
    if (restoringRoute) return;
    const next = routeUrl();
    const current = `${window.location.pathname}${window.location.search}`;
    if (next === current) return;
    window.history[historyMode === "push" ? "pushState" : "replaceState"]({ amavioRoute: true }, "", next);
  }

  function updateRouteContext(values, options = {}) {
    if (Object.prototype.hasOwnProperty.call(values, "opsCase")) routeContext.opsCase = values.opsCase || "";
    if (Object.prototype.hasOwnProperty.call(values, "opsMode")) routeContext.opsMode = values.opsMode || "";
    if (Object.prototype.hasOwnProperty.call(values, "program")) routeContext.program = values.program || "";
    syncRoute(options.history || "replace");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  }

  function visibleCases() {
    if (state.role === "admin") return cases.slice(0, 3);
    return cases.filter((item) => item.roles.includes(state.employerLens)).slice(0, 4);
  }

  function historyFor(id) {
    if (!state.histories[id]) state.histories[id] = [{ time: "Ausgang", text: "Synthetischer Fallstand geladen · keine Außenwirkung." }];
    return state.histories[id];
  }

  function addHistory(text) {
    historyFor(state.activeCase).unshift({ time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }), text });
    renderHistory();
  }

  function renderProfile() {
    const profile = getProfile();
    q("[data-profile-initials]").textContent = profile.initials;
    q("[data-profile-name]").textContent = profile.name;
    q("[data-profile-role]").textContent = profile.role;
    q(".profile").setAttribute("aria-label", `Demo-Profil ${profile.name}, ${profile.role}`);
    q("[data-today-intro]").textContent = profile.intro;
    q(".employer-lens").hidden = state.role !== "employer";
    document.body.dataset.role = state.role;
    qa("[data-employer-only]").forEach((node) => { node.hidden = state.role !== "employer"; });
    qa("[data-admin-only]").forEach((node) => { node.hidden = state.role === "employer"; });
    qa("[data-role-target]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.roleTarget === state.role)));
  }

  function renderPriorityList() {
    const visible = visibleCases();
    if (!visible.some((item) => item.id === state.activeCase)) state.activeCase = visible[0]?.id || cases[0].id;
    q("[data-worklist-count]").textContent = `${visible.length} offen`;
    q("[data-priority-list]").innerHTML = visible.map((item) => `
      <button type="button" class="case-row" data-case-id="${item.id}" aria-current="${item.id === state.activeCase}">
        <strong>${item.title}</strong><small>${item.id} · ${item.location} · ${item.dueShort}</small>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>
      </button>`).join("");
    qa("[data-case-id]", q("[data-priority-list]")).forEach((button) => button.addEventListener("click", () => selectCase(button.dataset.caseId)));
  }

  function renderCase() {
    const item = getCase();
    state.selectedDecision = null; state.selectedScenario = null; state.editingStep = null; state.reorder = false;
    q("[data-case-title]").textContent = item.title;
    q("[data-case-meta]").textContent = `Fall ${item.id} · Anreise ${item.arrival} · ${item.location}`;
    q("[data-case-deadline]").textContent = item.deadline;
    q("[data-case-reason]").textContent = item.reason;
    q("[data-case-state]").textContent = state.completed[item.id] || item.status;
    q("[data-case-evidence]").innerHTML = item.evidence.map(([label, value]) => `<div><b>${label}</b><span>${value}</span></div>`).join("");
    q("[data-case-evidence]").hidden = true;
    q("[data-toggle-evidence]").setAttribute("aria-expanded", "false");
    q("[data-toggle-evidence]").textContent = "Belege anzeigen";
    renderSituation(); renderPlan(); renderSimulation(); renderDocuments(); renderDecisions(); renderHistory(); renderPriorityList(); showMode(state.mode, { history: false });
  }

  function renderSituation() {
    const item = getCase();
    q("[data-situation-list]").innerHTML = item.situation.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
    q("[data-completeness-result]").textContent = "Prüfung noch nicht ausgeführt.";
    q("[data-assistant-input]").value = ""; q("[data-assistant-answer]").hidden = true;
  }

  function renderPlan() {
    const item = getCase();
    q("[data-toggle-reorder]").setAttribute("aria-pressed", String(state.reorder));
    q("[data-plan-list]").classList.toggle("is-reordering", state.reorder);
    q("[data-plan-list]").innerHTML = item.plan.map((step, index) => `
      <li class="plan-step" data-plan-step="${step.id}">
        <div class="step-copy"><strong>${escapeHtml(step.title)}</strong><span>Verantwortlich: ${escapeHtml(step.owner)}</span></div>
        <div class="step-meta"><span>${icon.calendar}${escapeHtml(step.due)}</span><span>${icon.link}${escapeHtml(step.dependency)}</span></div>
        <button type="button" class="step-edit" data-edit-step="${index}" aria-label="${escapeHtml(step.title)} bearbeiten">${icon.edit}</button>
        <div class="reorder-controls"><button type="button" data-move-step="up" data-step-index="${index}" aria-label="${escapeHtml(step.title)} nach oben">↑</button><button type="button" data-move-step="down" data-step-index="${index}" aria-label="${escapeHtml(step.title)} nach unten">↓</button></div>
      </li>`).join("");
    qa("[data-edit-step]").forEach((button) => button.addEventListener("click", () => openStepEditor(Number(button.dataset.editStep))));
    qa("[data-move-step]").forEach((button) => button.addEventListener("click", () => moveStep(Number(button.dataset.stepIndex), button.dataset.moveStep)));
    q("[data-case-summary]").innerHTML = `
      <div><dt>${item.missing.length} Angaben fehlen</dt><dd>${item.missing.join(", ")}</dd></div>
      <div><dt>1 Entscheidung offen</dt><dd>${item.decisions[0].label}</dd></div>
      <div><dt>Start aktuell gefährdet</dt><dd>${item.reason}</dd></div>`;
    q("[data-summary-panel]").classList.remove("summary-open");
    q("[data-toggle-summary]").setAttribute("aria-expanded", "false");
    q("[data-toggle-summary]").textContent = "Zusammenfassung anzeigen";
    qa("[data-save-plan]").forEach((button) => { const saved = Boolean(state.completed[item.id]); button.textContent = saved ? "Plan vorgemerkt" : "Plan lokal vormerken"; button.disabled = saved; });
    q("[data-step-editor]").hidden = state.editingStep === null;
  }

  function openStepEditor(index) {
    state.editingStep = index;
    const item = getCase(); const step = item.plan[index];
    const owners = [...new Set(item.plan.map((entry) => entry.owner).concat(["AMAVIO Operations", "HR", "Standortleitung", "Sponsor", "Budget"]))];
    q("[data-step-owner]").innerHTML = owners.map((owner) => `<option${owner === step.owner ? " selected" : ""}>${owner}</option>`).join("");
    q("[data-step-due]").value = step.due;
    q("[data-step-dependency]").innerHTML = ["Keine Abhängigkeit"].concat(item.plan.slice(0, index).map((_, position) => `Nach Schritt ${position + 1}`)).map((dependency) => `<option${dependency === step.dependency ? " selected" : ""}>${dependency}</option>`).join("");
    q("[data-step-editor]").hidden = false;
    q("[data-step-owner]").focus();
  }

  function moveStep(index, direction) {
    const target = direction === "up" ? index - 1 : index + 1;
    const item = getCase(); if (target < 0 || target >= item.plan.length) return;
    [item.plan[index], item.plan[target]] = [item.plan[target], item.plan[index]];
    item.plan.forEach((step, position) => { step.dependency = position === 0 ? "Keine Abhängigkeit" : `Nach Schritt ${position}`; });
    addHistory(`Planreihenfolge lokal geändert: ${item.plan[target].title}`); renderPlan();
  }

  function renderSimulation() {
    const item = getCase();
    q("[data-simulation-select]").innerHTML = item.impacts.map((impact) => `<option value="${impact.id}">${impact.label}</option>`).join("");
    q("[data-simulation-before]").textContent = `${item.status} · ${item.reason}`;
    q("[data-simulation-after]").textContent = "Wählen Sie eine Änderung und starten Sie die Prüfung.";
    q("[data-affected-flow]").hidden = true; q("[data-keep-scenario]").disabled = true;
  }

  function renderDocuments() {
    q("[data-document-types]").innerHTML = documentTypes.map((type) => `<button type="button" role="tab" aria-selected="${type.id === state.selectedDocument}" data-document-type="${type.id}">${type.label}</button>`).join("");
    qa("[data-document-type]").forEach((button) => button.addEventListener("click", () => { state.selectedDocument = button.dataset.documentType; renderDocuments(); }));
    buildDraft(false);
  }

  function buildDraft(log) {
    const item = getCase(); const type = documentTypes.find((entry) => entry.id === state.selectedDocument) || documentTypes[0];
    let subject = `Klärung zu Fall ${item.id}: ${item.title}`;
    let body = `Guten Tag,\n\nfür den synthetischen Fall ${item.id} ist folgende Klärung vorbereitet:\n\n${item.reason}\n\nNoch benötigt werden:\n${item.missing.map((entry) => `– ${entry}`).join("\n")}\n\nVorgeschlagener nächster Schritt:\n– ${item.plan[0].title} (${item.plan[0].owner}, ${item.plan[0].due})\n\nBitte prüfen Sie die Angaben. Dieser Entwurf wurde in der lokalen Konzeptdemo erstellt und nicht versendet.`;
    if (type.id === "sponsor") { subject = `Entscheidungsbedarf ${item.id} · ${item.location}`; body = `Guten Tag,\n\nfür den synthetischen Fall ${item.id} besteht aktuell Entscheidungsbedarf.\n\nLage: ${item.reason}\nEmpfehlung: ${item.decisions[0].label}\nFrist: ${item.deadline}\n\nOhne Entscheidung bleibt der nächste abhängige Schritt blockiert. Dieser lokale Entwurf wurde nicht versendet.`; }
    if (type.id === "arrival") { subject = `Vorbereitete Ankunftsinformation · ${item.arrival}`; body = `Guten Tag,\n\nfür Ihre synthetische Anreise am ${item.arrival} nach ${item.location} ist folgender Stand vorbereitet:\n\n– Treffpunkt und Schlüsselzeit werden noch bestätigt.\n– Die zuständige Kontaktperson wird vor der Anreise ergänzt.\n– Sie erhalten erst nach menschlicher Prüfung eine verbindliche Information.\n\nDies ist ausschließlich ein lokaler Demo-Entwurf und wurde nicht versendet.`; }
    q("[data-draft-recipient]").value = type.recipient; q("[data-draft-subject]").value = subject; q("[data-draft-body]").value = body;
    q("[data-draft-status]").textContent = "Kein Versand · keine Nachricht außerhalb dieser lokalen Sitzung.";
    if (log) addHistory(`${type.label} aus dem Fall neu aufgebaut`);
  }

  function renderDecisions() {
    const item = getCase(); state.selectedDecision = null;
    q("[data-decision-options]").innerHTML = item.decisions.map((decision) => `<button type="button" class="decision-option" data-decision-id="${decision.id}" aria-pressed="false"><b>${decision.label}</b><span>${decision.note}</span></button>`).join("");
    qa("[data-decision-id]").forEach((button) => button.addEventListener("click", () => {
      state.selectedDecision = button.dataset.decisionId;
      qa("[data-decision-id]").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
      const decision = item.decisions.find((entry) => entry.id === state.selectedDecision);
      q("[data-decision-preview]").textContent = decision.effect; q("[data-confirm-decision]").disabled = false;
    }));
    q("[data-decision-preview]").textContent = "Wählen Sie eine Option, um ihre Wirkung zu sehen."; q("[data-confirm-decision]").disabled = true;
  }

  function renderHistory() {
    q("[data-local-history]").innerHTML = historyFor(state.activeCase).map((entry) => `<li><time>${entry.time}</time>${escapeHtml(entry.text)}</li>`).join("");
  }

  function showMode(mode, options = {}) {
    if (!validModes.includes(mode)) mode = "plan";
    state.mode = mode;
    qa("[data-work-mode]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.workMode === mode)));
    qa("[data-work-panel]").forEach((panel) => { const active = panel.dataset.workPanel === mode; panel.hidden = !active; panel.classList.toggle("active", active); });
    if (options.history !== false) syncRoute(options.history || "replace");
  }

  function selectCase(id) { state.activeCase = id; renderCase(); syncRoute("push"); }

  function renderCasePreview() {
    const item = getCase();
    q("[data-case-preview-reference]").textContent = `${item.id} · ${item.location}`;
    q("[data-case-preview-title]").textContent = item.title;
    q("[data-case-preview-meta]").textContent = `${item.employer} · Anreise ${item.arrival}`;
    q("[data-case-preview-status]").textContent = item.status;
    q("[data-case-preview-reason]").textContent = item.reason;
    q("[data-case-preview-deadline]").textContent = item.deadline;
    q("[data-case-preview-next]").textContent = item.plan[0].title;
    q("[data-case-preview-owner]").textContent = item.owner;
    q("[data-case-preview-missing]").textContent = item.missing[0] || "Keine zusätzliche Grundlage offen";
  }

  function renderCaseTable(filter) {
    const term = (filter || "").trim().toLocaleLowerCase("de-DE");
    const matches = cases.filter((item) => [item.id, item.title, item.location, item.employer, item.owner].join(" ").toLocaleLowerCase("de-DE").includes(term));
    if (matches.length && !matches.some((item) => item.id === state.activeCase)) state.activeCase = matches[0].id;
    q("[data-case-total]").textContent = cases.length;
    q("[data-case-decisions]").textContent = cases.filter((item) => /entscheidung/i.test(item.status)).length;
    q("[data-case-due-today]").textContent = cases.filter((item) => /heute/i.test(item.dueShort)).length;
    q("[data-case-result-count]").textContent = `${matches.length} ${matches.length === 1 ? "Fall" : "Fälle"}`;
    q("[data-case-table]").innerHTML = matches.length ? matches.map((item) => `<button type="button" class="case-portfolio-item${item.id === state.activeCase ? " active" : ""}" data-table-case="${item.id}" aria-current="${item.id === state.activeCase ? "true" : "false"}"><span>${item.id} · ${item.location}</span><b>${item.title}</b><small>${item.plan[0].title}</small><em>${item.dueShort}</em></button>`).join("") : '<div class="case-portfolio-empty">Keine synthetischen Fälle gefunden.</div>';
    qa("[data-table-case]").forEach((button) => button.addEventListener("click", () => {
      state.activeCase = button.dataset.tableCase;
      renderCasePreview();
      renderCaseTable(q("[data-case-search]").value);
      syncRoute("replace");
    }));
    renderCasePreview();
  }

  function showPage(page, options = {}) {
    if (!validPages.includes(page)) page = "today";
    if (state.role === "employer" && (internalPages.has(page) || page === "operations")) page = "collaboration";
    if (state.role === "admin" && page === "collaboration") page = "operations";
    state.page = page; document.body.dataset.page = page;
    qa("main .page[data-page]").forEach((section) => { const active = section.dataset.page === page; section.hidden = !active; section.classList.toggle("active", active); });
    const primaryPage = ({ operations: "cases", twin: "programs", planning: "programs", evaluation: "learning-quality", learning: "learning-quality" })[page] || page;
    qa("[data-page-target]").forEach((button) => {
      const active = !button.hasAttribute("data-l2-deep-route") && button.dataset.pageTarget === primaryPage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-current", active ? "page" : "false");
    });
    q("[data-reset-demo]").textContent = ["twin", "twin-decisions", "operations", "programs", "planning", "evaluation", "learning", "learning-quality"].includes(page) ? "Ansicht zurücksetzen" : "Demo zurücksetzen";
    if (page === "cases") renderCaseTable(q("[data-case-search]").value);
    closeMenu(); window.scrollTo({ top: 0, behavior: "auto" });
    if (options.history !== false) syncRoute(options.history || "push");
    window.dispatchEvent(new CustomEvent("amavio:pagechange", { detail: { page, role: state.role, employerLens: state.employerLens } }));
  }

  function announceRoleChange() {
    window.dispatchEvent(new CustomEvent("amavio:rolechange", { detail: { role: state.role, employerLens: state.employerLens } }));
  }
  function setRole(role) {
    const nextRole = role === "employer" ? "employer" : "admin";
    if (nextRole !== state.role) {
      routeContext.opsCase = "";
      routeContext.opsMode = "";
    }
    state.role = nextRole;
    if (state.role === "employer" && state.page !== "programs") state.page = "collaboration";
    if (state.role === "admin" && state.page === "collaboration") state.page = "operations";
    renderProfile(); renderPriorityList(); renderCase(); showPage(state.page, { history: "push" }); closeMenu(); announceRoleChange();
  }
  function closeMenu() { document.body.classList.remove("nav-open"); q("[data-menu-button]").setAttribute("aria-expanded", "false"); }

  qa("[data-page-target]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.pageTarget)));
  qa("[data-role-target]").forEach((button) => button.addEventListener("click", () => setRole(button.dataset.roleTarget)));
  qa("[data-work-mode]").forEach((button) => button.addEventListener("click", () => showMode(button.dataset.workMode)));
  q("[data-employer-lens]").addEventListener("change", (event) => { state.employerLens = event.target.value; const targetPage = state.page === "programs" ? "programs" : "collaboration"; state.page = targetPage; routeContext.opsCase = ""; routeContext.opsMode = ""; renderProfile(); renderPriorityList(); renderCase(); showPage(targetPage, { history: "replace" }); announceRoleChange(); });
  q("[data-toggle-evidence]").addEventListener("click", (event) => { const evidence = q("[data-case-evidence]"); evidence.hidden = !evidence.hidden; event.currentTarget.setAttribute("aria-expanded", String(!evidence.hidden)); event.currentTarget.textContent = evidence.hidden ? "Belege anzeigen" : "Belege ausblenden"; });
  q("[data-run-completeness]").addEventListener("click", () => { const item = getCase(); q("[data-completeness-result]").innerHTML = `<b>${item.missing.length} Angaben fehlen.</b> ${item.missing.join("; ")}. Diese lokale Prüfung verwendet nur die synthetischen Falldaten.`; addHistory("Vollständigkeit lokal geprüft"); });
  q("[data-assistant-form]").addEventListener("submit", (event) => { event.preventDefault(); const question = q("[data-assistant-input]").value.trim(); if (!question) return; const item = getCase(); const normalized = question.toLocaleLowerCase("de-DE"); let answer = `${item.title}. ${item.reason} Nächster vorbereiteter Schritt: ${item.plan[0].title}.`; if (/fehl|offen/.test(normalized)) answer = `Noch offen: ${item.missing.join("; ")}.`; else if (/wer|verantwort/.test(normalized)) answer = `Aktuell verantwortlich: ${item.owner}. Eine Änderung braucht eine menschliche Bestätigung.`; else if (/warum|dring|prior/.test(normalized)) answer = item.reason; q("[data-assistant-answer]").textContent = answer; q("[data-assistant-answer]").hidden = false; addHistory("Kontextfrage lokal ausgewertet"); });
  q("[data-toggle-reorder]").addEventListener("click", (event) => { state.reorder = !state.reorder; event.currentTarget.setAttribute("aria-pressed", String(state.reorder)); renderPlan(); });
  q("[data-close-step]").addEventListener("click", () => { state.editingStep = null; q("[data-step-editor]").hidden = true; });
  q("[data-save-step]").addEventListener("click", () => { if (state.editingStep === null) return; const step = getCase().plan[state.editingStep]; step.owner = q("[data-step-owner]").value; step.due = q("[data-step-due]").value.trim() || step.due; step.dependency = q("[data-step-dependency]").value; addHistory(`Planschritt lokal angepasst: ${step.title}`); state.editingStep = null; renderPlan(); });
  qa("[data-save-plan]").forEach((button) => button.addEventListener("click", () => { state.completed[state.activeCase] = "Plan lokal vorgemerkt"; q("[data-case-state]").textContent = "Plan lokal vorgemerkt"; qa("[data-save-plan]").forEach((target) => { target.textContent = "Plan vorgemerkt"; target.disabled = true; }); addHistory("Fallplan lokal vorgemerkt · keine Ausführung"); }));
  q("[data-toggle-summary]").addEventListener("click", (event) => { const panel = q("[data-summary-panel]"); const open = !panel.classList.contains("summary-open"); panel.classList.toggle("summary-open", open); event.currentTarget.setAttribute("aria-expanded", String(open)); event.currentTarget.textContent = open ? "Zusammenfassung ausblenden" : "Zusammenfassung anzeigen"; });
  q("[data-prepare-from-plan]").addEventListener("click", () => showMode("prepare"));
  q("[data-run-simulation]").addEventListener("click", () => { const item = getCase(); const impact = item.impacts.find((entry) => entry.id === q("[data-simulation-select]").value); if (!impact) return; state.selectedScenario = impact.id; q("[data-simulation-after]").textContent = impact.after; q("[data-affected-flow]").innerHTML = impact.effects.map(([label, value]) => `<div><b>${label}</b><span>${value}</span></div>`).join(""); q("[data-affected-flow]").hidden = false; q("[data-keep-scenario]").disabled = false; addHistory(`Auswirkung geprüft: ${impact.label}`); });
  q("[data-keep-scenario]").addEventListener("click", () => { const impact = getCase().impacts.find((entry) => entry.id === state.selectedScenario); if (!impact) return; addHistory(`Szenario als lokale Variante behalten: ${impact.label}`); q("[data-keep-scenario]").textContent = "Lokale Variante vorgemerkt"; q("[data-keep-scenario]").disabled = true; });
  q("[data-generate-draft]").addEventListener("click", () => buildDraft(true));
  q("[data-save-draft]").addEventListener("click", () => { const type = documentTypes.find((entry) => entry.id === state.selectedDocument); addHistory(`${type.label} lokal vorgemerkt · nicht versendet`); q("[data-draft-status]").textContent = "Entwurf lokal vorgemerkt · weiterhin kein Versand und keine Außenwirkung."; });
  q("[data-confirm-decision]").addEventListener("click", () => { const decision = getCase().decisions.find((entry) => entry.id === state.selectedDecision); if (!decision) return; state.completed[state.activeCase] = "Entscheidung lokal vorgemerkt"; q("[data-case-state]").textContent = "Entscheidung lokal vorgemerkt"; addHistory(`Entscheidung lokal vorgemerkt: ${decision.label}`); q("[data-confirm-decision]").textContent = "Entscheidung vorgemerkt"; q("[data-confirm-decision]").disabled = true; });
  q("[data-case-search]").addEventListener("input", (event) => renderCaseTable(event.target.value));
  q("[data-open-selected-case]").addEventListener("click", () => { renderCase(); showPage("operations"); });
  q("[data-open-current-case]")?.addEventListener("click", () => showPage("operations"));
  q("[data-review-insight]").addEventListener("click", () => { q("[data-insight-status]").textContent = "Zur fachlichen Prüfung lokal vorgemerkt · keine Prozessänderung."; });
  q("[data-menu-button]").addEventListener("click", () => { const open = !document.body.classList.contains("nav-open"); document.body.classList.toggle("nav-open", open); q("[data-menu-button]").setAttribute("aria-expanded", String(open)); });
  q("[data-sidebar-close]").addEventListener("click", closeMenu);
  q("[data-reset-demo]").addEventListener("click", () => {
    if (["twin", "twin-decisions", "operations", "collaboration", "programs", "planning", "evaluation", "learning", "learning-quality"].includes(state.page)) {
      window.location.assign(state.page === "collaboration" ? `?page=collaboration&role=employer&lens=${state.employerLens}` : state.page === "programs" ? `?page=programs${state.role === "employer" ? `&role=employer&lens=${state.employerLens}` : ""}` : state.page === "planning" ? "?page=planning" : ["twin", "twin-decisions"].includes(state.page) ? "?page=twin" : ["learning", "learning-quality"].includes(state.page) ? `?page=${state.page}` : "?page=operations");
      return;
    }
    state.role = "admin"; state.employerLens = "sponsor"; state.page = "today"; state.activeCase = "A-2233"; state.mode = "plan"; state.selectedDocument = "location"; state.completed = {}; state.histories = {}; q("[data-employer-lens]").value = "sponsor"; q("[data-case-search]").value = ""; q("[data-insight-status]").textContent = "Keine Änderung an Vorlagen oder Prozessen."; renderProfile(); renderCase(); showPage("today");
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeMenu(); q("[data-step-editor]").hidden = true; } });

  function restoreRoute() {
    const route = readRoute();
    restoringRoute = true;
    state.role = route.role;
    state.employerLens = route.employerLens;
    state.page = route.page;
    state.activeCase = route.activeCase;
    state.mode = route.mode;
    routeContext.opsCase = route.opsCase;
    routeContext.opsMode = route.opsMode;
    routeContext.program = route.program;
    q("[data-employer-lens]").value = state.employerLens;
    renderProfile(); renderCase(); showPage(state.page, { history: false });
    restoringRoute = false;
    syncRoute("replace");
  }

  window.AMAVIO_NAVIGATION = {
    navigate: (page, options) => showPage(page, options),
    updateContext: updateRouteContext,
    param: (name) => new URLSearchParams(window.location.search).get(name),
    getState: () => ({ ...JSON.parse(JSON.stringify(state)), routeContext: { ...routeContext } }),
  };
  window.AMAVIO_ACC_CALM_CAPABLE = { getState: () => JSON.parse(JSON.stringify(state)) };
  window.addEventListener("popstate", () => { restoreRoute(); announceRoleChange(); window.dispatchEvent(new CustomEvent("amavio:routechange", { detail: readRoute() })); });
  restoreRoute();
}());
