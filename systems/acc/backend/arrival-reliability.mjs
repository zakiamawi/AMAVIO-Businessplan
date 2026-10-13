const now = () => new Date().toISOString();
const clean = (value, max = 2_000) => String(value ?? "").trim().slice(0, max);

const PROGRAM = Object.freeze({
  id: "SYN-PROG-001",
  title: "Pflegekohorte Rheinland · September",
  employer: "Klinikverbund Rheinland",
  employmentStart: "2026-10-01",
  arrivalWindow: "13.–18.09.2026",
  promise: "Zwölf synthetische Pflegefachkräfte sollen am 01.10.2026 an drei Standorten arbeitsfähig starten.",
  cohort: {
    participantCount: 12,
    profession: "Pflegefachkräfte",
    locations: [
      { name: "Düsseldorf", planned: 5 },
      { name: "Köln", planned: 4 },
      { name: "Solingen", planned: 3 },
    ],
  },
});

const SCENARIOS = Object.freeze([
  {
    id: "housing-handover",
    orderCode: "HOUSING",
    shortTitle: "Unterkunftsübergabe",
    title: "Unterkunftsübergabe Solingen nicht bestätigt",
    decisionQuestion: "Wie sichern wir zwei Startplätze, solange die Übergabe in Solingen nicht belegt ist?",
    cause: "Die Unterkunftsübergabe für zwei synthetische Pflegefachkräfte in Solingen ist seitens der Vermieterseite noch nicht abschließend bestätigt.",
    consequence: "Zwei Startplätze sind gefährdet; ohne Eingriff kann sich der Arbeitsstart um bis zu sieben Tage verschieben.",
    affectedStartPlaces: 2,
    possibleDelay: "bis 7 Tage",
    deadline: "2026-09-15",
    initialState: "conditional",
    evidence: [
      { label: "Unterkunftszuordnung", value: "Solingen · zwei Plätze", status: "bestätigt" },
      { label: "Übergabezeit", value: "noch nicht abschließend bestätigt", status: "fehlt" },
      { label: "Arbeitsstart", value: "01.10.2026", status: "bestätigt" },
    ],
    options: [
      { id: "temporary-duesseldorf", label: "Vorläufiger Start in Düsseldorf", startDate: "2026-10-01", effort: "Mittel", risk: "Gering", requirement: "Temporäre Unterkunft verfügbar", tradeoff: "Ein Standortwechsel wird nach bestätigter Übergabe erneut geprüft.", recommended: true },
      { id: "solingen-bridge", label: "Start mit Übergangslösung in Solingen", startDate: "2026-10-01", effort: "Hoch", risk: "Mittel", requirement: "Vermieterbestätigung bis 22.09.2026", tradeoff: "Die Übergangslösung benötigt zusätzliche Abstimmung.", recommended: false },
      { id: "delay-two-starts", label: "Verschiebung der zwei Startplätze", startDate: "2026-10-08", effort: "Gering", risk: "Mittel", requirement: "Neuer Ankunftsplan erforderlich", tradeoff: "Der Einsatzplan muss angepasst werden.", recommended: false },
    ],
    intervention: {
      title: "Standort- und Wohnübergabe absichern",
      service: "Übergabe mit der synthetischen Vermieterseite klären, Ersatzunterkunft vergleichen und einen belastbaren Ankunftsweg dokumentieren.",
      owner: "AMAVIO Operations",
      dueDate: "2026-09-15",
      employerContribution: "Zugang zu den synthetischen Vermieterkontakten und Freigabe der Alternativoption innerhalb von 48 Stunden.",
      completionProof: "Schriftliche Bestätigung der Unterkunftsübergabe oder dokumentierter Mietvertragsentwurf der Ersatzunterkunft.",
      serviceLevel: "Arbeitsbeginn innerhalb von 1 Arbeitstag nach Freigabe; Ergebnisübergabe bis 15.09.2026.",
      acceptanceCriteria: [
        "Übergabezeit und verantwortliche Kontaktstelle sind dokumentiert.",
        "Unterkunft oder freigegebene Ersatzlösung ist für beide Startplätze belegt.",
        "Ankunftsweg und erste Übergabe sind ohne offene Zuständigkeitslücke beschrieben.",
      ],
      notIncluded: "Kein Mietvertragsabschluss, keine Buchung und keine Nachricht an reale Vermietende.",
    },
    executionSteps: [
      { id: "source-check", label: "Ausgangslage verifizieren", owner: "AMAVIO Operations", evidenceRequired: "Synthetische Kontakt- und Zuordnungsnotiz" },
      { id: "handover-secure", label: "Unterkunftsübergabe absichern", owner: "AMAVIO Operations", evidenceRequired: "Bestätigtes Übergabefenster oder dokumentierte Ersatzlösung" },
      { id: "arrival-route", label: "Ankunftsweg und Zuständigkeit schließen", owner: "AMAVIO Operations", evidenceRequired: "Zeit, Ort, Kontaktstelle und Übergabepunkt" },
    ],
  },
  {
    id: "arrival-shift",
    orderCode: "ARRIVAL",
    shortTitle: "Anreise verschoben",
    title: "Anreisefenster für vier Starts hat sich verschoben",
    decisionQuestion: "Wie halten wir den Arbeitsstart trotz einer dreitägigen Verschiebung stabil?",
    cause: "Ein synthetischer Terminbeleg verschiebt die Anreise von vier Fachkräften um drei Tage.",
    consequence: "Unterkunft, Abholung und betriebliches Onboarding müssen neu getaktet werden; vier Startplätze sind betroffen.",
    affectedStartPlaces: 4,
    possibleDelay: "bis 3 Tage",
    deadline: "2026-09-18",
    initialState: "at_risk",
    evidence: [
      { label: "Neues Anreisefenster", value: "16.–18.09.2026", status: "bestätigt" },
      { label: "Abholung", value: "alter Termin hinterlegt", status: "widersprüchlich" },
      { label: "Onboarding", value: "01.10.2026", status: "bestätigt" },
    ],
    options: [
      { id: "retime-chain", label: "Ankunftskette geschlossen neu takten", startDate: "2026-10-01", effort: "Mittel", risk: "Gering", requirement: "Standort und Abholung bestätigen neue Zeiten", tradeoff: "Drei Übergaben werden koordiniert angepasst.", recommended: true },
      { id: "split-arrival", label: "Anreise in zwei Teilgruppen", startDate: "2026-10-01", effort: "Hoch", risk: "Mittel", requirement: "Zwei Abhol- und Übergabefenster", tradeoff: "Zusätzlicher Begleitaufwand entsteht.", recommended: false },
      { id: "shift-onboarding", label: "Onboarding um drei Tage verschieben", startDate: "2026-10-04", effort: "Gering", risk: "Hoch", requirement: "Dienstplanänderung", tradeoff: "Vier Startplätze fehlen im ursprünglichen Fenster.", recommended: false },
    ],
    intervention: {
      title: "Ankunftskette neu planen",
      service: "Abholung, Unterkunftsübergabe und erstes betriebliches Zeitfenster auf den neuen Termin ausrichten.",
      owner: "AMAVIO Operations",
      dueDate: "2026-09-18",
      employerContribution: "Neue Onboarding-Zeitfenster und zuständige betriebliche Ansprechperson bestätigen.",
      completionProof: "Abgestimmter Ankunftsplan mit Zeitfenstern, Verantwortlichen und dokumentierten Übergaben.",
      serviceLevel: "Neutaktung innerhalb von 1 Arbeitstag nach Freigabe; Ergebnisübergabe bis 18.09.2026.",
      acceptanceCriteria: [
        "Neues Anreisefenster ist in Abholung, Unterkunft und Onboarding übernommen.",
        "Jede Übergabe besitzt ein Zeitfenster und eine verantwortliche Stelle.",
        "Keine alte Terminangabe bleibt als operative Grundlage offen.",
      ],
      notIncluded: "Keine reale Umbuchung, kein Ticketkauf und kein Nachrichtenversand.",
    },
    executionSteps: [
      { id: "arrival-window", label: "Neues Anreisefenster prüfen", owner: "AMAVIO Operations", evidenceRequired: "Synthetischer Terminbeleg" },
      { id: "pickup-retime", label: "Abholung und Unterkunft neu takten", owner: "AMAVIO Operations", evidenceRequired: "Abgestimmte Zeitfenster und Übergaben" },
      { id: "onboarding-confirm", label: "Onboardingfenster abgleichen", owner: "Arbeitgeber · Personal & Onboarding", evidenceRequired: "Bestätigte betriebliche Zeit" },
    ],
  },
  {
    id: "onboarding-mismatch",
    orderCode: "ONBOARDING",
    shortTitle: "Standort & Onboarding",
    title: "Einsatzstandort und Onboardingplan stimmen nicht überein",
    decisionQuestion: "Welche Zuordnung verhindert einen Fehlstart für drei Fachkräfte?",
    cause: "Drei synthetische Fachkräfte sind im Kohortenplan Solingen zugeordnet, im betrieblichen Onboarding jedoch für Köln vorgesehen.",
    consequence: "Drei Startplätze besitzen keine eindeutige betriebliche Übergabe; Paten, Wege und erste Schichten sind nicht belastbar verbunden.",
    affectedStartPlaces: 3,
    possibleDelay: "bis 5 Tage",
    deadline: "2026-09-20",
    initialState: "at_risk",
    evidence: [
      { label: "Kohortenplan", value: "Solingen · drei Plätze", status: "bestätigt" },
      { label: "Onboardingplan", value: "Köln · drei Plätze", status: "widersprüchlich" },
      { label: "Patenzuordnung", value: "noch nicht neu bestätigt", status: "fehlt" },
    ],
    options: [
      { id: "align-solingen", label: "Onboarding auf Solingen ausrichten", startDate: "2026-10-01", effort: "Mittel", risk: "Gering", requirement: "Drei Paten in Solingen benennen", tradeoff: "Der bestehende Kölner Plan wird angepasst.", recommended: true },
      { id: "move-to-cologne", label: "Einsatz vorläufig nach Köln verlagern", startDate: "2026-10-01", effort: "Hoch", risk: "Mittel", requirement: "Unterkunft und Transport neu prüfen", tradeoff: "Die Standortverteilung verändert sich.", recommended: false },
      { id: "staged-start", label: "Gestaffelter Start mit späterer Zuordnung", startDate: "2026-10-03", effort: "Mittel", risk: "Mittel", requirement: "Übergangsplan und Nachsteuerung", tradeoff: "Die endgültige Zuordnung bleibt zunächst offen.", recommended: false },
    ],
    intervention: {
      title: "Betriebliche Übergabe synchronisieren",
      service: "Standortzuordnung, Paten, erste Schichten und Arbeitsweg in einer gemeinsamen Übergabeplanung zusammenführen.",
      owner: "AMAVIO Operations",
      dueDate: "2026-09-20",
      employerContribution: "Einsatzstandort und drei synthetische betriebliche Paten verbindlich bestätigen.",
      completionProof: "Freigegebener Onboardingplan mit Standort, Paten, Schichtbeginn und Arbeitsweg.",
      serviceLevel: "Klärungsstart innerhalb von 1 Arbeitstag; Ergebnisübergabe bis 20.09.2026.",
      acceptanceCriteria: [
        "Einsatzstandort und Onboardingstandort stimmen überein.",
        "Drei synthetische Paten sind eindeutig zugeordnet.",
        "Erste Schicht und Arbeitsweg sind in derselben Übergabegrundlage dokumentiert.",
      ],
      notIncluded: "Keine produktive Dienstplanänderung und keine reale Personalentscheidung.",
    },
    executionSteps: [
      { id: "location-decision", label: "Standortzuordnung bestätigen", owner: "Arbeitgeber · Standort & Übergabe", evidenceRequired: "Synthetische Standortentscheidung" },
      { id: "mentor-map", label: "Patenzuordnung schließen", owner: "Arbeitgeber · Personal & Onboarding", evidenceRequired: "Drei dokumentierte Patenzuordnungen" },
      { id: "first-shift", label: "Erste Schicht und Arbeitsweg verbinden", owner: "AMAVIO Operations", evidenceRequired: "Abgestimmter Onboardingplan" },
    ],
  },
]);

const scenarioById = (id) => SCENARIOS.find((item) => item.id === id);
const roleGroup = (session) => session?.role === "operations" ? "operations" : String(session?.role || "").startsWith("employer_") ? "employer" : "unknown";
const canDecide = (session) => session?.role === "employer_sponsor";

export function installArrivalReliability(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS arrival_reliability_states (
      tenant_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      scenario_id TEXT NOT NULL,
      selected_option_id TEXT,
      decision_note TEXT,
      readiness_state TEXT NOT NULL,
      intervention_status TEXT NOT NULL,
      evidence_status TEXT NOT NULL,
      completion_reference TEXT,
      completion_note TEXT,
      decided_by TEXT,
      decided_at TEXT,
      completed_by TEXT,
      completed_at TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, scenario_id)
    );
    CREATE TABLE IF NOT EXISTS arrival_stabilization_outcomes (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      scenario_id TEXT NOT NULL,
      rating TEXT NOT NULL,
      note TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1)
    );
    CREATE TABLE IF NOT EXISTS arrival_intervention_orders (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      program_id TEXT NOT NULL,
      scenario_id TEXT NOT NULL,
      selected_option_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('authorized','in_execution','completed')),
      decision_version INTEGER NOT NULL,
      authorized_by TEXT NOT NULL,
      authorized_at TEXT NOT NULL,
      started_by TEXT,
      started_at TEXT,
      result_summary TEXT,
      residual_condition TEXT,
      next_checkpoint TEXT,
      handed_back_at TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      synthetic INTEGER NOT NULL CHECK (synthetic = 1),
      UNIQUE (tenant_id, scenario_id)
    );
    CREATE TABLE IF NOT EXISTS arrival_intervention_steps (
      order_id TEXT NOT NULL,
      tenant_id TEXT NOT NULL,
      step_id TEXT NOT NULL,
      position INTEGER NOT NULL,
      label TEXT NOT NULL,
      owner TEXT NOT NULL,
      evidence_required TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('open','completed')),
      proof_reference TEXT,
      completion_note TEXT,
      completed_by TEXT,
      completed_at TEXT,
      version INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (order_id, step_id)
    );
  `);
  const seed = db.prepare("INSERT OR IGNORE INTO arrival_reliability_states (tenant_id,program_id,scenario_id,readiness_state,intervention_status,evidence_status,version,updated_at) VALUES (?,?,?,?,?,?,1,?)");
  for (const scenario of SCENARIOS) seed.run("SYN-TENANT-001", PROGRAM.id, scenario.id, scenario.initialState, "awaiting_selection", "open", now());
}

function stateFor(db, tenantId, scenarioId) {
  return db.prepare("SELECT * FROM arrival_reliability_states WHERE tenant_id=? AND scenario_id=?").get(tenantId, scenarioId);
}

function outcomeFor(db, tenantId, scenarioId) {
  return db.prepare("SELECT * FROM arrival_stabilization_outcomes WHERE tenant_id=? AND scenario_id=? ORDER BY created_at DESC LIMIT 1").get(tenantId, scenarioId);
}

function serviceOrderFor(db, tenantId, scenarioId) {
  const order = db.prepare("SELECT * FROM arrival_intervention_orders WHERE tenant_id=? AND scenario_id=?").get(tenantId, scenarioId);
  if (!order) return null;
  const steps = db.prepare("SELECT * FROM arrival_intervention_steps WHERE tenant_id=? AND order_id=? ORDER BY position,step_id").all(tenantId, order.id);
  return { order, steps };
}

function presentServiceOrder(db, tenantId, scenario, session) {
  const stored = serviceOrderFor(db, tenantId, scenario.id);
  if (!stored) return null;
  const completedSteps = stored.steps.filter((step) => step.status === "completed").length;
  return {
    id: stored.order.id,
    status: stored.order.status,
    scope: scenario.intervention.service,
    serviceLevel: scenario.intervention.serviceLevel,
    acceptanceCriteria: scenario.intervention.acceptanceCriteria,
    notIncluded: scenario.intervention.notIncluded,
    authorizedAt: stored.order.authorized_at,
    startedAt: stored.order.started_at,
    handedBackAt: stored.order.handed_back_at,
    decisionVersion: stored.order.decision_version,
    version: stored.order.version,
    progress: { completed: completedSteps, total: stored.steps.length },
    result: stored.order.status === "completed" ? {
      summary: stored.order.result_summary,
      residualCondition: stored.order.residual_condition,
      nextCheckpoint: stored.order.next_checkpoint,
    } : null,
    steps: stored.steps.map((step) => ({
      id: step.step_id,
      position: step.position,
      label: step.label,
      owner: step.owner,
      evidenceRequired: step.evidence_required,
      status: step.status,
      proofReference: step.proof_reference,
      completionNote: session?.role === "operations" ? step.completion_note : null,
      completedAt: step.completed_at,
      version: step.version,
    })),
    synthetic: true,
    externalEffect: false,
  };
}

function presentScenario(db, tenantId, scenario, session) {
  const state = stateFor(db, tenantId, scenario.id);
  const outcome = outcomeFor(db, tenantId, scenario.id);
  const selectedOption = scenario.options.find((item) => item.id === state.selected_option_id) || null;
  const serviceOrder = presentServiceOrder(db, tenantId, scenario, session);
  const allStepsCompleted = Boolean(serviceOrder?.steps.length) && serviceOrder.steps.every((step) => step.status === "completed");
  return {
    ...scenario,
    state: {
      readiness: state.readiness_state,
      intervention: state.intervention_status,
      evidence: state.evidence_status,
      selectedOptionId: state.selected_option_id,
      decisionNote: session?.role === "operations" || canDecide(session) ? state.decision_note : null,
      completionReference: state.completion_reference,
      completionNote: roleGroup(session) === "operations" ? state.completion_note : null,
      version: state.version,
      updatedAt: state.updated_at,
    },
    selectedOption,
    serviceOrder,
    outcome: outcome ? { rating: outcome.rating, note: outcome.note, createdAt: outcome.created_at } : null,
    permissions: {
      canSelectOption: canDecide(session) && ["awaiting_selection", "awaiting_authorization"].includes(state.intervention_status),
      canAuthorize: canDecide(session) && Boolean(state.selected_option_id) && state.intervention_status === "awaiting_authorization",
      canStartExecution: session?.role === "operations" && state.intervention_status === "active" && serviceOrder?.status === "authorized",
      canCompleteStep: session?.role === "operations" && state.intervention_status === "active" && ["authorized", "in_execution"].includes(serviceOrder?.status),
      canComplete: session?.role === "operations" && state.intervention_status === "active" && allStepsCompleted,
      canRecordOutcome: canDecide(session) && state.readiness_state === "confirmed" && !outcome,
    },
    synthetic: true,
    externalEffect: false,
  };
}

function bootstrap(db, tenantId, scenarioId, session) {
  const scenario = scenarioById(scenarioId) || SCENARIOS[0];
  const selected = presentScenario(db, tenantId, scenario, session);
  const affected = selected.state.readiness === "confirmed" ? 0 : scenario.affectedStartPlaces;
  return {
    program: PROGRAM,
    cohort: {
      ...PROGRAM.cohort,
      confirmedCount: PROGRAM.cohort.participantCount - affected,
      conditionalCount: affected,
      statusLabel: selected.state.readiness === "confirmed" ? "Startfähigkeit bestätigt" : affected === 0 ? "Keine offene Bedingung" : `${affected} unter Bedingungen`,
    },
    scenarios: SCENARIOS.map((item) => {
      const state = stateFor(db, tenantId, item.id);
      const storedOrder = serviceOrderFor(db, tenantId, item.id);
      const completedSteps = storedOrder?.steps.filter((step) => step.status === "completed").length || 0;
      const totalSteps = storedOrder?.steps.length || item.executionSteps.length;
      const orderStatusLabel = !storedOrder ? "Freigabe ausstehend" : storedOrder.order.status === "authorized" ? "Neu" : storedOrder.order.status === "in_execution" ? "In Bearbeitung" : "Ergebnis übergeben";
      return {
        id: item.id,
        title: item.shortTitle,
        affectedStartPlaces: item.affectedStartPlaces,
        readiness: state.readiness_state,
        intervention: state.intervention_status,
        deadline: item.deadline,
        businessConsequence: item.consequence,
        serviceGoal: item.intervention.title,
        orderId: storedOrder?.order.id || null,
        orderStatus: storedOrder?.order.status || null,
        orderStatusLabel,
        allStepsCompleted: Boolean(storedOrder) && totalSteps > 0 && completedSteps === totalSteps,
      };
    }),
    selectedScenario: selected,
    access: {
      role: session.role,
      roleGroup: roleGroup(session),
      perspectiveLabel: session.role === "operations" ? "AMAVIO Operations" : "Arbeitgeber",
      workArea: session.role === "employer_sponsor" ? "Gesamtsteuerung" : session.role === "employer_hr" ? "Personal & Onboarding" : session.role === "employer_location" ? "Standort & Übergabe" : session.role === "employer_budget" ? "Budget & Freigaben" : "Operative Steuerung",
    },
    boundaries: { syntheticOnly: true, localOnly: true, externalEffects: false, providerCalls: 0, automaticDecision: false, productiveIdentity: false },
  };
}

function workProduct(db, tenantId, session, type, scenarioId) {
  const scenario = presentScenario(db, tenantId, scenarioById(scenarioId) || SCENARIOS[0], session);
  const option = scenario.selectedOption || scenario.options.find((item) => item.recommended);
  const confirmed = scenario.state.readiness === "confirmed";
  const order = scenario.serviceOrder;
  const evidenceStatus = order ? `${order.progress.completed} von ${order.progress.total} Ausführungsschritten belegt` : "Auftrag noch nicht freigegeben";
  const meta = {
    reference: type === "handover-plan" ? `SYN-WP-${scenario.id}-HANDOVER` : `SYN-WP-${scenario.id}-BRIEF`,
    version: `P1.${scenario.state.version}`,
    updatedAt: scenario.state.updatedAt,
    owner: type === "handover-plan" ? "AMAVIO Operations" : "Arbeitgeber · Gesamtsteuerung",
    status: confirmed ? "Fachlich bestätigt" : order ? "In Bearbeitung" : "Entwurf unter Bedingungen",
  };
  if (type === "employer-result-brief") {
    return {
      id: `SYN-P2-${scenario.id}-RESULT`, type, title: "Ergebnisbrief für den Arbeitgeber",
      status: confirmed ? "Zur betrieblichen Abnahme" : "Noch nicht übergeben",
      meta: { ...meta, reference: `SYN-P2-${scenario.id}-RESULT`, version: `P2.${scenario.state.version}`, owner: "Arbeitgeber · Gesamtsteuerung", status: confirmed ? "Zur betrieblichen Abnahme" : "Noch nicht übergeben" },
      summary: confirmed ? "Dieser Ergebnisbrief fasst die beauftragte AMAVIO-Leistung, ihre nachgewiesene Wirkung und den verbleibenden betrieblichen Prüfpunkt zusammen." : "Ein Ergebnisbrief entsteht erst nach vollständiger Leistungserbringung und Übergabe durch AMAVIO Operations.",
      sections: [
        { title: "Ausgangslage und Entscheidung", text: `${scenario.title}. ${scenario.consequence}`, items: [`Entscheidung: ${option.label}`, `Begründung: ${scenario.state.decisionNote || "noch nicht dokumentiert"}`, `Betroffene Startplätze: ${scenario.affectedStartPlaces}`] },
        { title: "Beauftragte Leistung", text: scenario.intervention.service, items: [`Servicefenster: ${scenario.intervention.serviceLevel}`, `Arbeitgeberbeitrag: ${scenario.intervention.employerContribution}`, `Nicht enthalten: ${scenario.intervention.notIncluded}`] },
        { title: "Erbrachtes Ergebnis", text: order?.result?.summary || "Noch kein abnahmefähiges Ergebnis übergeben.", items: order?.result ? [`Restbedingung: ${order.result.residualCondition}`, `Nächster Prüfpunkt: ${order.result.nextCheckpoint}`, `Übergabenachweis: ${scenario.state.completionReference}`] : [evidenceStatus] },
        { title: "Betriebliche Abnahme", text: confirmed ? "Die dokumentierten Abnahmekriterien sind erfüllt. Die Gesamtsteuerung kann das Ergebnis für die weitere Startplanung verwenden." : "Die betriebliche Abnahme bleibt bis zur Ergebnisübergabe geschlossen.", items: scenario.intervention.acceptanceCriteria },
      ], synthetic: true,
    };
  }
  if (type === "employer-readiness-record") {
    return {
      id: `SYN-P2-${scenario.id}-READINESS`, type, title: "Startfreigabeprotokoll",
      status: confirmed ? "Startfähigkeit bestätigt" : "Nicht freigabefähig",
      meta: { ...meta, reference: `SYN-P2-${scenario.id}-READINESS`, version: `P2.${scenario.state.version}`, owner: "Arbeitgeber · Gesamtsteuerung", status: confirmed ? "Startfähigkeit bestätigt" : "Nicht freigabefähig" },
      summary: "Das Protokoll verbindet Arbeitgeberentscheidung, AMAVIO-Ergebnis, erfüllte Abnahmekriterien und den nächsten betrieblichen Kontrollpunkt.",
      sections: [
        { title: "Geltungsbereich", text: PROGRAM.promise, items: [`Arbeitsstart: ${PROGRAM.employmentStart}`, `Anreisefenster: ${PROGRAM.arrivalWindow}`, `Prüffall: ${scenario.title}`] },
        { title: "Freigabegrundlage", text: confirmed ? `Das Ergebnis wurde unter ${scenario.state.completionReference} übergeben.` : "Es liegt noch keine vollständige Ergebnisübergabe vor.", rows: scenario.intervention.acceptanceCriteria.map((criterion, index) => ({ label: `${index + 1}. ${criterion}`, owner: index === 0 ? "AMAVIO Operations" : "Gemeinsame Übergabe", evidence: confirmed ? scenario.state.completionReference : "Noch offen", status: confirmed ? "Erfüllt" : "Offen" })) },
        { title: "Entscheidung für den Arbeitsstart", text: confirmed ? `${scenario.affectedStartPlaces} betroffene Startplätze sind auf Basis des dokumentierten Ergebnisses startfähig.` : `${scenario.affectedStartPlaces} Startplätze bleiben unter Bedingungen.`, items: order?.result ? [`Restbedingung: ${order.result.residualCondition}`, `Nächster Prüfpunkt: ${order.result.nextCheckpoint}`] : ["Keine produktive Freigabe in der Konzeptdemo"] },
      ], synthetic: true,
    };
  }
  if (type === "operations-evidence-log") {
    return {
      id: `SYN-P2-${scenario.id}-EVIDENCE`, type, title: "Leistungsnachweis",
      status: order ? evidenceStatus : "Kein Auftrag",
      meta: { ...meta, reference: `SYN-P2-${scenario.id}-EVIDENCE`, version: `P2.${scenario.state.version}`, owner: "AMAVIO Operations", status: order ? evidenceStatus : "Kein Auftrag" },
      summary: "Interner, chronologischer Nachweis der beauftragten Arbeitsschritte. Dieses Dokument gehört ausschließlich in die Operations-Perspektive.",
      sections: [
        { title: "Auftragsgrundlage", text: order ? `${order.id} · ${order.scope}` : "Noch kein ausführbarer Auftrag.", items: order ? [order.serviceLevel, `Entscheidungsversion: ${order.decisionVersion}`] : [] },
        { title: "Nachweismatrix", text: evidenceStatus, rows: (order?.steps || []).map((step) => ({ label: `${step.position}. ${step.label}`, owner: step.owner, evidence: step.proofReference || step.evidenceRequired, status: step.status === "completed" ? "Belegt" : "Offen" })) },
        { title: "Interne Prüferläuterungen", text: "Die Erläuterungen dokumentieren, wie AMAVIO die jeweilige Nachweisanforderung bewertet hat.", items: (order?.steps || []).filter((step) => step.completionNote).map((step) => `${step.label}: ${step.completionNote}`) },
      ], synthetic: true,
    };
  }
  if (type === "operations-handover-dossier") {
    return {
      id: `SYN-P2-${scenario.id}-DOSSIER`, type, title: "Übergabedossier",
      status: confirmed ? "An Arbeitgeber übergeben" : order && order.progress.completed === order.progress.total ? "Übergabebereit" : order ? "In Bearbeitung" : "Kein Auftrag",
      meta: { ...meta, reference: `SYN-P2-${scenario.id}-DOSSIER`, version: `P2.${scenario.state.version}`, owner: "AMAVIO Operations", status: confirmed ? "An Arbeitgeber übergeben" : "In Bearbeitung" },
      summary: "Das Dossier bündelt Auftragsumfang, Erfüllungsnachweise, Ergebnisformulierung und die Informationen für die kontrollierte Rückgabe an den Arbeitgeber.",
      sections: [
        { title: "Leistungsauftrag", text: order ? order.scope : "Noch kein Auftrag", items: scenario.intervention.acceptanceCriteria },
        { title: "Vollständigkeitsprüfung", text: evidenceStatus, rows: (order?.steps || []).map((step) => ({ label: step.label, owner: step.owner, evidence: step.proofReference || "Nachweis offen", status: step.status === "completed" ? "Vollständig" : "Offen" })) },
        { title: "Formulierte Ergebnisübergabe", text: order?.result?.summary || "Ergebnisformulierung wird nach vollständigem Nachweis erstellt.", items: order?.result ? [`Restbedingung: ${order.result.residualCondition}`, `Nächster Prüfpunkt: ${order.result.nextCheckpoint}`] : ["Übergabe noch nicht ausgelöst"] },
        { title: "Rückgabegrenze", text: "Die Übergabe informiert den Arbeitgeber. Sie löst keine reale Buchung, Nachricht, Personalentscheidung oder externe Freigabe aus." },
      ], synthetic: true,
    };
  }
  if (type === "handover-plan") {
    return {
      id: meta.reference,
      type,
      title: "Übergabe- und Ankunftsplan",
      status: meta.status,
      meta,
      summary: confirmed ? "Die vereinbarte Übergabekette ist belegt und wurde an die Arbeitgeber-Gesamtsteuerung zurückgegeben." : "Der Plan übersetzt die Entscheidung in überprüfbare Zuständigkeiten, Nachweise und Zeitpunkte.",
      sections: [
        { title: "Auftrag und Ziel", text: `${PROGRAM.promise} Gewählte Handlungsoption: ${option.label}.`, items: order ? [`Auftrag ${order.id}`, order.serviceLevel, `Status: ${order.status}`] : ["Freigabe der Gesamtsteuerung steht aus"] },
        { title: "Leistungsumfang", text: scenario.intervention.service, items: scenario.intervention.acceptanceCriteria },
        { title: "Verantwortungsübergabe", text: "Der Arbeitgeber entscheidet und liefert die benannte Mitwirkung; AMAVIO übernimmt danach die operative Koordination und Nachweisführung.", items: [`Arbeitgeberbeitrag: ${scenario.intervention.employerContribution}`, `AMAVIO-Verantwortung: ${scenario.intervention.owner}`, `Nicht enthalten: ${scenario.intervention.notIncluded}`] },
        { title: "Ausführung und Evidenz", text: evidenceStatus, rows: (order?.steps || scenario.executionSteps).map((step, index) => ({ label: `${index + 1}. ${step.label}`, owner: step.owner, status: step.status === "completed" ? "Belegt" : "Offen", evidence: step.proofReference || step.evidenceRequired })) },
        { title: "Ergebnisübergabe", text: order?.result?.summary || `Offener Abschlussnachweis: ${scenario.intervention.completionProof}`, items: order?.result ? [`Restbedingung: ${order.result.residualCondition}`, `Nächster Prüfpunkt: ${order.result.nextCheckpoint}`] : ["Ergebnis wird nach vollständiger Evidenz an die Gesamtsteuerung zurückgegeben."] },
      ],
      synthetic: true,
    };
  }
  return {
    id: meta.reference,
    type: "readiness-brief",
    title: "Arrival Readiness Brief",
    status: confirmed ? "Startfähigkeit bestätigt" : "Startfähigkeit unter Bedingungen",
    meta: { ...meta, status: confirmed ? "Startfähigkeit bestätigt" : meta.status },
    summary: confirmed ? "Die Startfähigkeit ist auf Basis der dokumentierten Entscheidung und der geprüften Ausführungsnachweise bestätigt." : "Die Startfähigkeit bleibt an den benannten Auftrag und seine Nachweise gebunden.",
    sections: [
      { title: "Startversprechen", text: PROGRAM.promise, items: [`Arbeitsstart: ${PROGRAM.employmentStart}`, `Anreisefenster: ${PROGRAM.arrivalWindow}`, `Betroffene Startplätze: ${scenario.affectedStartPlaces}`] },
      { title: "Entscheidungslage", text: `${scenario.title}. ${scenario.consequence}`, items: [`Gewählte Option: ${option.label}`, `Entscheidungsbegründung: ${scenario.state.decisionNote || "noch nicht dokumentiert"}`, `Entscheidungsfrist: ${scenario.deadline}`] },
      { title: "AMAVIO-Auftrag", text: order ? `${order.id} · ${order.scope}` : "Der operative Auftrag wird mit der Arbeitgeberfreigabe erzeugt.", items: order ? [order.serviceLevel, ...order.acceptanceCriteria] : [scenario.intervention.completionProof] },
      { title: "Nachweis und Ergebnis", text: confirmed ? `Bestätigt durch ${scenario.state.completionReference}. ${order?.result?.summary || ""}` : evidenceStatus, items: order?.result ? [`Restbedingung: ${order.result.residualCondition}`, `Nächster Prüfpunkt: ${order.result.nextCheckpoint}`] : [`Offen: ${scenario.intervention.completionProof}`] },
      { title: "Verantwortung", text: "Die Gesamtsteuerung verantwortet die Entscheidung. AMAVIO Operations verantwortet Ausführung, Evidenz und Ergebnisübergabe.", items: [scenario.intervention.employerContribution, scenario.intervention.notIncluded] },
      { title: "Geltungsgrenze", text: "Lokale Konzeptdemo mit ausschließlich synthetischen Daten; keine Außenwirkung, keine produktive Freigabe und keine automatisierte reale Entscheidung." },
    ],
    synthetic: true,
  };
}

function deny(response, sendJson, message, code = "role_scope_denied") {
  sendJson(response, 403, { error: message, code });
}

export function createArrivalReliabilityHandler({ db, sendJson, readBody, requireSession, audit }) {
  return async function handleArrivalReliability(request, response, url) {
    const session = requireSession(request, response); if (!session) return true;
    if (session.tenantId !== "SYN-TENANT-001") {
      sendJson(response, 404, { error: "Synthetisches Ankunftsprogramm im aktiven Mandanten nicht gefunden." });
      return true;
    }
    if (request.method === "GET" && url.pathname === "/api/reliability/v1/bootstrap") {
      sendJson(response, 200, bootstrap(db, session.tenantId, url.searchParams.get("scenario"), session)); return true;
    }

    const scenarioRead = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)$/);
    if (request.method === "GET" && scenarioRead) {
      const scenario = scenarioById(decodeURIComponent(scenarioRead[1]));
      if (!scenario) { sendJson(response, 404, { error: "Ausnahmeweg nicht gefunden." }); return true; }
      sendJson(response, 200, presentScenario(db, session.tenantId, scenario, session)); return true;
    }

    const optionMatch = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)\/options$/);
    if (request.method === "POST" && optionMatch) {
      if (!canDecide(session)) { deny(response, sendJson, "Nur die Arbeitgeber-Gesamtsteuerung kann eine Handlungsoption auswählen."); return true; }
      const scenario = scenarioById(decodeURIComponent(optionMatch[1]));
      if (!scenario) { sendJson(response, 404, { error: "Ausnahmeweg nicht gefunden." }); return true; }
      const body = await readBody(request); const optionId = clean(body.optionId, 120); const version = Number(body.version);
      if (!scenario.options.some((item) => item.id === optionId)) { sendJson(response, 400, { error: "Handlungsoption ist für diesen Ausnahmeweg nicht gültig." }); return true; }
      const result = db.prepare("UPDATE arrival_reliability_states SET selected_option_id=?,readiness_state='conditional',intervention_status='awaiting_authorization',version=version+1,updated_at=? WHERE tenant_id=? AND scenario_id=? AND version=? AND intervention_status IN ('awaiting_selection','awaiting_authorization')")
        .run(optionId, now(), session.tenantId, scenario.id, version);
      if (result.changes !== 1) { sendJson(response, 409, { error: "Der Arbeitsstand wurde bereits verändert. Bitte neu laden.", code: "reliability_version_conflict" }); return true; }
      audit(db, session, "reliability.option.selected", "arrival_scenario", scenario.id, { optionId, synthetic: true, externalEffect: false });
      sendJson(response, 200, { scenario: presentScenario(db, session.tenantId, scenario, session), externalEffect: false }); return true;
    }

    const authorizeMatch = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)\/authorize$/);
    if (request.method === "POST" && authorizeMatch) {
      if (!canDecide(session)) { deny(response, sendJson, "Nur die Arbeitgeber-Gesamtsteuerung kann die Intervention freigeben."); return true; }
      const scenario = scenarioById(decodeURIComponent(authorizeMatch[1]));
      if (!scenario) { sendJson(response, 404, { error: "Ausnahmeweg nicht gefunden." }); return true; }
      const body = await readBody(request); const note = clean(body.rationale, 1_200); const version = Number(body.version);
      if (note.length < 12 || body.confirmSynthetic !== true) { sendJson(response, 400, { error: "Eine kurze Begründung und die Bestätigung der synthetischen Demoentscheidung sind erforderlich.", code: "human_gate_incomplete" }); return true; }
      const authorizedAt = now();
      const orderId = `SYN-AO-${scenario.orderCode}-001`;
      db.exec("BEGIN IMMEDIATE");
      let result;
      try {
        result = db.prepare("UPDATE arrival_reliability_states SET decision_note=?,readiness_state='intervention_active',intervention_status='active',decided_by=?,decided_at=?,version=version+1,updated_at=? WHERE tenant_id=? AND scenario_id=? AND version=? AND selected_option_id IS NOT NULL AND intervention_status='awaiting_authorization'")
          .run(note, session.userId, authorizedAt, authorizedAt, session.tenantId, scenario.id, version);
        if (result.changes !== 1) throw Object.assign(new Error("authorization_conflict"), { code: "authorization_conflict" });
        const selected = stateFor(db, session.tenantId, scenario.id);
        db.prepare("INSERT INTO arrival_intervention_orders (id,tenant_id,program_id,scenario_id,selected_option_id,status,decision_version,authorized_by,authorized_at,version,synthetic) VALUES (?,?,?,?,?,'authorized',?,?,?,1,1)")
          .run(orderId, session.tenantId, PROGRAM.id, scenario.id, selected.selected_option_id, selected.version, session.userId, authorizedAt);
        const insertStep = db.prepare("INSERT INTO arrival_intervention_steps (order_id,tenant_id,step_id,position,label,owner,evidence_required,status,version) VALUES (?,?,?,?,?,?,?,'open',1)");
        scenario.executionSteps.forEach((step, index) => insertStep.run(orderId, session.tenantId, step.id, index + 1, step.label, step.owner, step.evidenceRequired));
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        if (error?.code === "authorization_conflict" || String(error?.message || "").includes("UNIQUE")) {
          sendJson(response, 409, { error: "Die Intervention ist nicht freigabefähig oder wurde bereits verändert.", code: "intervention_authorization_conflict" }); return true;
        }
        throw error;
      }
      audit(db, session, "reliability.intervention.authorized", "arrival_scenario", scenario.id, { humanGate: true, synthetic: true, externalEffect: false });
      sendJson(response, 200, { scenario: presentScenario(db, session.tenantId, scenario, session), externalEffect: false }); return true;
    }

    const startExecutionMatch = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)\/start-execution$/);
    if (request.method === "POST" && startExecutionMatch) {
      if (session.role !== "operations") { deny(response, sendJson, "Nur AMAVIO Operations kann den freigegebenen Auftrag in die Ausführung übernehmen."); return true; }
      const scenario = scenarioById(decodeURIComponent(startExecutionMatch[1]));
      if (!scenario) { sendJson(response, 404, { error: "Ausnahmeweg nicht gefunden." }); return true; }
      const body = await readBody(request); const orderVersion = Number(body.orderVersion);
      const result = db.prepare("UPDATE arrival_intervention_orders SET status='in_execution',started_by=?,started_at=?,version=version+1 WHERE tenant_id=? AND scenario_id=? AND version=? AND status='authorized'")
        .run(session.userId, now(), session.tenantId, scenario.id, orderVersion);
      if (result.changes !== 1) { sendJson(response, 409, { error: "Der Auftrag wurde bereits übernommen oder zwischenzeitlich verändert.", code: "service_order_start_conflict" }); return true; }
      audit(db, session, "reliability.service_order.started", "arrival_scenario", scenario.id, { synthetic: true, externalEffect: false });
      sendJson(response, 200, { scenario: presentScenario(db, session.tenantId, scenario, session), externalEffect: false }); return true;
    }

    const completeStepMatch = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)\/steps\/([^/]+)\/complete$/);
    if (request.method === "POST" && completeStepMatch) {
      if (session.role !== "operations") { deny(response, sendJson, "Ausführungsschritte werden ausschließlich durch AMAVIO Operations dokumentiert."); return true; }
      const scenario = scenarioById(decodeURIComponent(completeStepMatch[1]));
      const stepId = decodeURIComponent(completeStepMatch[2]);
      if (!scenario || !scenario.executionSteps.some((step) => step.id === stepId)) { sendJson(response, 404, { error: "Ausführungsschritt nicht gefunden." }); return true; }
      const body = await readBody(request); const reference = clean(body.proofReference, 240); const note = clean(body.note, 1_200); const stepVersion = Number(body.stepVersion);
      if (reference.length < 5 || note.length < 12) { sendJson(response, 400, { error: "Nachweisreferenz und kurze Prüferläuterung sind für den Arbeitsschritt erforderlich.", code: "execution_step_proof_incomplete" }); return true; }
      const order = serviceOrderFor(db, session.tenantId, scenario.id);
      if (!order || !["authorized", "in_execution"].includes(order.order.status)) { sendJson(response, 409, { error: "Für diesen Ausnahmeweg liegt kein ausführbarer Auftrag vor.", code: "service_order_not_executable" }); return true; }
      db.exec("BEGIN IMMEDIATE");
      try {
        if (order.order.status === "authorized") db.prepare("UPDATE arrival_intervention_orders SET status='in_execution',started_by=?,started_at=?,version=version+1 WHERE tenant_id=? AND id=? AND status='authorized'").run(session.userId, now(), session.tenantId, order.order.id);
        const result = db.prepare("UPDATE arrival_intervention_steps SET status='completed',proof_reference=?,completion_note=?,completed_by=?,completed_at=?,version=version+1 WHERE tenant_id=? AND order_id=? AND step_id=? AND version=? AND status='open'")
          .run(reference, note, session.userId, now(), session.tenantId, order.order.id, stepId, stepVersion);
        if (result.changes !== 1) throw Object.assign(new Error("step_conflict"), { code: "step_conflict" });
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        if (error?.code === "step_conflict") { sendJson(response, 409, { error: "Der Arbeitsschritt wurde bereits dokumentiert oder zwischenzeitlich verändert.", code: "execution_step_conflict" }); return true; }
        throw error;
      }
      audit(db, session, "reliability.execution_step.completed", "arrival_scenario", scenario.id, { stepId, proofReference: reference, synthetic: true, externalEffect: false });
      sendJson(response, 200, { scenario: presentScenario(db, session.tenantId, scenario, session), externalEffect: false }); return true;
    }

    const completeMatch = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)\/complete$/);
    if (request.method === "POST" && completeMatch) {
      if (session.role !== "operations") { deny(response, sendJson, "Der Erledigungsnachweis wird ausschließlich durch AMAVIO Operations geprüft."); return true; }
      const scenario = scenarioById(decodeURIComponent(completeMatch[1]));
      if (!scenario) { sendJson(response, 404, { error: "Ausnahmeweg nicht gefunden." }); return true; }
      const body = await readBody(request); const reference = clean(body.proofReference, 240); const note = clean(body.note, 1_200); const version = Number(body.version);
      const resultSummary = clean(body.resultSummary, 1_200); const residualCondition = clean(body.residualCondition, 600); const nextCheckpoint = clean(body.nextCheckpoint, 240);
      if (reference.length < 5 || note.length < 12 || resultSummary.length < 12 || residualCondition.length < 5 || nextCheckpoint.length < 5) { sendJson(response, 400, { error: "Nachweis, Ergebnis, Restbedingung und nächster Prüfpunkt sind für die Ergebnisübergabe erforderlich.", code: "completion_proof_incomplete" }); return true; }
      const order = serviceOrderFor(db, session.tenantId, scenario.id);
      if (!order || order.steps.length === 0 || order.steps.some((step) => step.status !== "completed")) { sendJson(response, 409, { error: "Alle vereinbarten Ausführungsschritte müssen vor der Ergebnisübergabe belegt sein.", code: "service_order_steps_open" }); return true; }
      const completedAt = now();
      db.exec("BEGIN IMMEDIATE");
      let result;
      try {
        result = db.prepare("UPDATE arrival_reliability_states SET readiness_state='confirmed',intervention_status='completed',evidence_status='verified',completion_reference=?,completion_note=?,completed_by=?,completed_at=?,version=version+1,updated_at=? WHERE tenant_id=? AND scenario_id=? AND version=? AND intervention_status='active'")
          .run(reference, note, session.userId, completedAt, completedAt, session.tenantId, scenario.id, version);
        if (result.changes !== 1) throw Object.assign(new Error("completion_conflict"), { code: "completion_conflict" });
        const orderResult = db.prepare("UPDATE arrival_intervention_orders SET status='completed',result_summary=?,residual_condition=?,next_checkpoint=?,handed_back_at=?,version=version+1 WHERE tenant_id=? AND id=? AND status IN ('authorized','in_execution')")
          .run(resultSummary, residualCondition, nextCheckpoint, completedAt, session.tenantId, order.order.id);
        if (orderResult.changes !== 1) throw Object.assign(new Error("completion_conflict"), { code: "completion_conflict" });
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        if (error?.code === "completion_conflict") { sendJson(response, 409, { error: "Die Intervention ist nicht abschließbar oder wurde bereits verändert.", code: "intervention_completion_conflict" }); return true; }
        throw error;
      }
      audit(db, session, "reliability.intervention.completed", "arrival_scenario", scenario.id, { proofReference: reference, synthetic: true, externalEffect: false });
      sendJson(response, 200, { scenario: presentScenario(db, session.tenantId, scenario, session), externalEffect: false }); return true;
    }

    const productMatch = url.pathname.match(/^\/api\/reliability\/v1\/work-products\/([^/]+)$/);
    if (request.method === "GET" && productMatch) {
      const type = decodeURIComponent(productMatch[1]);
      const allowedTypes = ["handover-plan", "readiness-brief", "employer-result-brief", "employer-readiness-record", "operations-evidence-log", "operations-handover-dossier"];
      if (!allowedTypes.includes(type)) { sendJson(response, 404, { error: "Arbeitsprodukt nicht gefunden." }); return true; }
      if (type.startsWith("employer-") && roleGroup(session) !== "employer") { deny(response, sendJson, "Dieses Arbeitsprodukt gehört ausschließlich zur Arbeitgeberperspektive."); return true; }
      if (type.startsWith("operations-") && session.role !== "operations") { deny(response, sendJson, "Interne Leistungsnachweise sind ausschließlich AMAVIO Operations zugeordnet."); return true; }
      const scenarioId = url.searchParams.get("scenario") || SCENARIOS[0].id;
      sendJson(response, 200, { workProduct: workProduct(db, session.tenantId, session, type, scenarioId), externalEffect: false }); return true;
    }

    const outcomeMatch = url.pathname.match(/^\/api\/reliability\/v1\/scenarios\/([^/]+)\/outcomes$/);
    if (request.method === "POST" && outcomeMatch) {
      if (!canDecide(session)) { deny(response, sendJson, "Die 30-Tage-Rückmeldung ist der Arbeitgeber-Gesamtsteuerung zugeordnet."); return true; }
      const scenario = scenarioById(decodeURIComponent(outcomeMatch[1]));
      const state = scenario && stateFor(db, session.tenantId, scenario.id);
      if (!scenario || state?.readiness_state !== "confirmed") { sendJson(response, 409, { error: "Eine Rückmeldung ist erst nach bestätigter Startfähigkeit möglich.", code: "outcome_not_ready" }); return true; }
      if (outcomeFor(db, session.tenantId, scenario.id)) { sendJson(response, 409, { error: "Für diesen Ausnahmeweg liegt bereits eine synthetische Rückmeldung vor.", code: "outcome_exists" }); return true; }
      const body = await readBody(request); const rating = clean(body.rating, 40); const note = clean(body.note, 1_200);
      if (!["stabil", "beobachten", "nachsteuern"].includes(rating) || note.length < 12) { sendJson(response, 400, { error: "Bewertung und kurze Ergebnisbegründung sind erforderlich." }); return true; }
      const id = `SYN-OUT-${scenario.id}-${Date.now()}`;
      db.prepare("INSERT INTO arrival_stabilization_outcomes (id,tenant_id,program_id,scenario_id,rating,note,created_by,created_at,synthetic) VALUES (?,?,?,?,?,?,?,?,1)")
        .run(id, session.tenantId, PROGRAM.id, scenario.id, rating, note, session.userId, now());
      audit(db, session, "reliability.outcome.recorded", "arrival_scenario", scenario.id, { rating, synthetic: true, externalEffect: false });
      sendJson(response, 201, { outcome: presentScenario(db, session.tenantId, scenario, session).outcome, externalEffect: false }); return true;
    }

    if (request.method === "POST" && url.pathname === "/api/reliability/v1/reset") {
      if (session.role !== "operations") { deny(response, sendJson, "Nur AMAVIO Operations kann den lokalen Demo-Arbeitsstand zurücksetzen."); return true; }
      db.exec("BEGIN IMMEDIATE");
      try {
        db.prepare("DELETE FROM arrival_stabilization_outcomes WHERE tenant_id=? AND program_id=?").run(session.tenantId, PROGRAM.id);
        db.prepare("DELETE FROM arrival_intervention_steps WHERE tenant_id=?").run(session.tenantId);
        db.prepare("DELETE FROM arrival_intervention_orders WHERE tenant_id=? AND program_id=?").run(session.tenantId, PROGRAM.id);
        for (const scenario of SCENARIOS) {
          db.prepare("UPDATE arrival_reliability_states SET selected_option_id=NULL,decision_note=NULL,readiness_state=?,intervention_status='awaiting_selection',evidence_status='open',completion_reference=NULL,completion_note=NULL,decided_by=NULL,decided_at=NULL,completed_by=NULL,completed_at=NULL,version=version+1,updated_at=? WHERE tenant_id=? AND scenario_id=?")
            .run(scenario.initialState, now(), session.tenantId, scenario.id);
        }
        db.exec("COMMIT");
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
      audit(db, session, "reliability.demo.reset", "arrival_program", PROGRAM.id, { synthetic: true, externalEffect: false });
      sendJson(response, 200, bootstrap(db, session.tenantId, SCENARIOS[0].id, session)); return true;
    }

    sendJson(response, 404, { error: "Arrival-Reliability-API-Pfad nicht gefunden." }); return true;
  };
}

export { PROGRAM, SCENARIOS };
