(function () {
  "use strict";

  const AREAS = Object.freeze({
    sponsor: {
      title: "Gesamtsteuerung",
      purpose: "Programmweite Prioritäten, Eskalationen und bereichsübergreifende Entscheidungen steuern.",
      work: "Entscheidungen mit Wirkung auf Arbeitsstart, Leistung oder mehrere Bereiche",
      visibility: "Geprüfte Entscheidungsgrundlagen, Auswirkungen und gemeinsamer Status",
      urgency: "Eine bereichsübergreifende Entscheidung blockiert oder verändert den nächsten gemeinsamen Schritt.",
      outcome: "AMAVIO prüft die Auswirkungen und führt den bestätigten Stand im Programm fort.",
      programOutcome: "Prioritäten und nächste Programmfreigabe nachvollziehbar festhalten",
      detail: "Die bereichsübergreifenden Auswirkungen und die verfügbare Grundlage wurden geprüft. Die begründete Entscheidung wird AMAVIO zur fachlichen Einordnung übergeben.",
    },
    hr: {
      title: "Personal & Onboarding",
      purpose: "Personalbezogene Voraussetzungen, betriebliche Vorbereitung und Onboarding-Beiträge koordinieren.",
      work: "Personalangaben, betriebliche Paten, Startvoraussetzungen und Rückmeldungen",
      visibility: "Nur personalbezogene Grundlagen, Termine und gemeinsame Ergebnisse",
      urgency: "Eine personalbezogene Voraussetzung wird für den nächsten Ankunfts- oder Arbeitsschritt benötigt.",
      outcome: "AMAVIO ordnet den Beitrag dem Fall zu und macht den geprüften nächsten Schritt sichtbar.",
      programOutcome: "Personalübergabe und betriebliche Startbereitschaft absichern",
      detail: "Die personalbezogenen Angaben und der betriebliche Startbezug wurden geprüft. Der dokumentierte Beitrag wird AMAVIO zur weiteren Fallsteuerung übergeben.",
    },
    location: {
      title: "Standort & Übergabe",
      purpose: "Lokale Zuständigkeiten, Zugänge, Übergaben und erreichbare Ansprechpartner bestätigen.",
      work: "Standortangaben, Übergabezeiten, Zuständigkeiten und lokale Bestätigungen",
      visibility: "Nur standortbezogene Grundlagen, Fristen und bestätigte Übergabeschritte",
      urgency: "Eine lokale Bestätigung wird benötigt, damit Ankunft oder betriebliche Übergabe verlässlich vorbereitet werden kann.",
      outcome: "AMAVIO prüft die Standortfolge und aktualisiert den gemeinsamen Übergabestand.",
      programOutcome: "Standortübergabe mit klarer Zuständigkeit und Frist absichern",
      detail: "Die standortbezogenen Angaben, Zuständigkeit und Übergabezeit wurden geprüft. Die Bestätigung wird AMAVIO zur fachlichen Einordnung übergeben.",
    },
    budget: {
      title: "Budget & Freigaben",
      purpose: "Kostenrelevante Zusatzbedarfe anhand einer nachvollziehbaren Grundlage prüfen und entscheiden.",
      work: "Kostenrahmen, Zusatzbedarf, Freigabe oder begründete Rückfrage",
      visibility: "Nur freigegebene Kostengrundlagen, Auswirkungen und Entscheidungsbedarf",
      urgency: "Ohne dokumentierte Budgetentscheidung bleibt der abhängige Leistungs- oder Ankunftsschritt offen.",
      outcome: "AMAVIO prüft die Folge für Leistung und Termin und aktualisiert den gemeinsamen Stand.",
      programOutcome: "Kostenwirkung und freigegebenen Leistungsrahmen nachvollziehbar festhalten",
      detail: "Kostengrundlage, Zusatzbedarf und Auswirkung wurden geprüft. Die begründete Budgetentscheidung wird AMAVIO zur fachlichen Einordnung übergeben.",
    },
  });

  const q = (selector, root = document) => root.querySelector(selector);
  const setText = (selector, value, root = document) => {
    const node = q(selector, root);
    if (node && node.textContent !== value) node.textContent = value;
  };
  const route = () => window.AMAVIO_NAVIGATION?.getState?.() || { role: document.body.dataset.role || "admin", employerLens: "sponsor" };
  const area = () => AREAS[route().employerLens] || AREAS.sponsor;

  function replaceVisibleTerminology(root = document) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue?.match(/Sponsor/i)) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE"].includes(node.parentElement?.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      node.nodeValue = node.nodeValue
        .replace(/Arbeitgeber[ ·-]+Sponsor/gi, "Arbeitgeber · Gesamtsteuerung")
        .replace(/Sponsorentscheidungen/gi, "Entscheidungen der Gesamtsteuerung")
        .replace(/Sponsorentscheidung/gi, "Entscheidung der Gesamtsteuerung")
        .replace(/Sponsor/gi, "Gesamtsteuerung");
    });
  }

  function renderNavigation() {
    const current = route();
    const employer = current.role === "employer";
    setText("[data-program-nav-label]", employer ? "Ankunftsprogramme" : "Programme");
    setText("[data-program-nav-detail]", employer ? "Stand, Meilensteine & Beiträge" : "");
    if (!employer) return;
    const config = area();
    setText("[data-employer-area-title]", config.title);
    setText("[data-employer-area-purpose]", config.purpose);
    setText("[data-employer-area-work]", config.work);
    setText("[data-employer-area-visibility]", config.visibility);
  }

  function renderCaseContext() {
    const current = route();
    if (current.role !== "employer") return;
    const config = area();
    const purpose = q("[data-collab-action-title]")?.textContent?.trim() || "Zugewiesenen Arbeitgeberauftrag bearbeiten";
    setText("[data-employer-case-purpose]", purpose);
    setText("[data-employer-case-urgency]", config.urgency);
    setText("[data-employer-case-outcome]", config.outcome);
    const detail = q("[data-collab-detail]");
    if (detail && (!detail.value.trim() || detail.value.startsWith("Die vorliegenden Angaben wurden geprüft."))) detail.value = config.detail;
  }

  function renderProgramFocus() {
    const current = route();
    if (current.role !== "employer") return;
    const config = area();
    const firstDecision = q("[data-program-decisions] .program-decision");
    const responsibility = firstDecision?.querySelector("h3")?.textContent?.trim() || "Aktuell keine eigene Entscheidung offen";
    const deadline = firstDecision?.querySelector(":scope > span")?.textContent?.trim() || "Der gemeinsame Programmstand bleibt einsehbar.";
    setText("[data-program-area-title]", config.title);
    setText("[data-program-area-purpose]", config.purpose);
    setText("[data-program-area-responsibility]", responsibility);
    setText("[data-program-area-deadline]", deadline);
    setText("[data-program-area-outcome]", config.programOutcome);
  }

  function sync() {
    renderNavigation();
    renderCaseContext();
    renderProgramFocus();
    const visiblePage = q("main .page:not([hidden])") || document;
    replaceVisibleTerminology(visiblePage);
    replaceVisibleTerminology(q(".topbar") || document);
  }

  ["amavio:runtime-ready", "amavio:rolechange", "amavio:pagechange", "amavio:routechange", "amavio:employer-case-rendered", "amavio:program-rendered", "amavio:execution-rendered"].forEach((name) => {
    window.addEventListener(name, () => window.requestAnimationFrame(sync));
  });
  sync();
  window.setTimeout(sync, 250);
}());
