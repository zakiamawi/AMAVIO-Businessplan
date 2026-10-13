const allStates = ['NORMAL', 'EMPTY', 'LOADING', 'DRAFT', 'READY_TO_SUBMIT', 'SUBMITTED', 'IN_REVIEW', 'WAITING', 'CHANGES_REQUESTED', 'APPROVED', 'CONFIRMED', 'BLOCKED', 'ERROR', 'OFFLINE', 'CONFLICT', 'ACCESS_DENIED', 'EXPIRED', 'PAUSED', 'COMPLETED', 'ARCHIVED']
const overviewStates = ['NORMAL', 'EMPTY', 'LOADING', 'WAITING', 'BLOCKED', 'ERROR', 'OFFLINE', 'ACCESS_DENIED', 'EXPIRED']

const nonEffectTranslations = {
  'keine freie Rollenwahl': 'no free role switching',
  'kein 24/7-Versprechen': 'no 24/7 promise',
  'keine Ergebnisgarantie': 'no outcome guarantee',
  'keine Arbeitgeberkopie privater Freitexte': 'no employer copy of private free text',
  'kein allgemeiner Chat': 'no general chat',
  'keine sofortige Löschzusage': 'no promise of immediate deletion',
  'keine Personenprofile': 'no personal profiles',
  'keine automatische Veröffentlichung': 'no automatic publication',
  'keine Buchung oder Zuteilung': 'no booking or allocation',
  'kein dauerhafter Kontaktzugang': 'no permanent contact access',
  'keine internen Prüfernotizen': 'no internal reviewer notes',
  'keine fremden Mandanten': 'no other tenants',
  'keine Reichweitengarantie': 'no reach guarantee',
  'keine automatische Partnerschaft': 'no automatic partnership',
  'keine Nachfragegarantie': 'no demand guarantee',
  'keine Teilnehmerfreigabe': 'no participant approval',
  'kein Social Feed': 'no social feed',
}

function route(id, labelDe, labelEn, titleDe, titleEn, purposeDe, purposeEn, ctaDe, ctaEn, trust, nonEffect, states = allStates) {
  return {
    id,
    label: { de: labelDe, en: labelEn },
    title: { de: titleDe, en: titleEn },
    purpose: { de: purposeDe, en: purposeEn },
    cta: { de: ctaDe, en: ctaEn },
    trust,
    nonEffect: { de: nonEffect, en: nonEffectTranslations[nonEffect] },
    states,
  }
}

export const externalRoles = {
  professional: { code: 'P', label: { de: 'Fachkraft', en: 'Professional' }, intro: { de: 'Ihr persönlicher, sicherer Weg durch die nächsten Ankunftsschritte.', en: 'Your personal and secure path through the next arrival steps.' } },
  housing: { code: 'H', label: { de: 'Wohnanbieter', en: 'Housing provider' }, intro: { de: 'Eigene Kapazitäten, minimierte Bedarfe und sichere Übergaben.', en: 'Your capacities, limited requests and safe handovers.' } },
  partner: { code: 'L', label: { de: 'Lokaler Partner', en: 'Local partner' }, intro: { de: 'Eigene Angebote, Termine und minimierte Nachfrage.', en: 'Your offers, schedules and limited demand.' } },
}

export const externalRoutes = {
  professional: [
    route('P-00', 'Zugang', 'Access', 'Zugang prüfen', 'Check your access', 'Prüfen Sie Rolle, Organisation, Zweck und Gültigkeit.', 'Review your role, organisation, purpose and validity.', 'Zugang bestätigen', 'Confirm access', 'TN-01', 'keine freie Rollenwahl', ['NORMAL', 'LOADING', 'ERROR', 'OFFLINE', 'ACCESS_DENIED', 'EXPIRED']),
    route('P-01', 'Übersicht', 'Overview', 'Was jetzt wichtig ist', 'What matters now', 'Sehen Sie nächsten Schritt, Verantwortung und bestätigte Termine.', 'See your next step, responsibility and confirmed appointments.', 'Nächsten Schritt öffnen', 'Open next step', 'TN-13', 'kein 24/7-Versprechen', overviewStates),
    route('P-02', 'Ankunftsplan', 'Arrival plan', 'Ihr persönlicher Ankunftsplan', 'Your personal arrival plan', 'Verfolgen Sie eigene Aufgaben und bestätigte Schritte.', 'Follow your tasks and confirmed steps.', 'Offene Aufgabe ansehen', 'View open task', 'TN-03', 'keine Ergebnisgarantie'),
    route('P-03', 'Unterstützung', 'Support', 'Unterstützung von AMAVIO', 'Support from AMAVIO', 'Teilen Sie nur für die Klärung erforderliche Angaben.', 'Share only information needed to resolve the issue.', 'Anliegen beginnen', 'Start support request', 'TN-04', 'keine Arbeitgeberkopie privater Freitexte'),
    route('P-04', 'Änderungen', 'Changes', 'Änderungen und Rückfragen', 'Changes and questions', 'Jedes Update gehört zu einem konkreten Vorgang.', 'Each update belongs to a specific item.', 'Zugehörigen Vorgang öffnen', 'Open related item', 'TN-12', 'kein allgemeiner Chat'),
    route('P-05', 'Mehr', 'More', 'Ihr Zugang und Ihre Datenwege', 'Your access and data options', 'Prüfen Sie Rolle, Sprache, Sichtbarkeit und Datenanfragen.', 'Review role, language, visibility and data requests.', 'Datenweg auswählen', 'Choose data option', 'TN-15', 'keine sofortige Löschzusage'),
  ],
  housing: [
    route('H-01', 'Übersicht', 'Overview', 'Ihre nächsten Schritte', 'Your next steps', 'Prüfen Sie offene Angaben, Rückfragen und Übergaben.', 'Review open details, questions and handovers.', 'Priorisierten Vorgang öffnen', 'Open priority item', 'TN-05', 'keine Personenprofile', overviewStates),
    route('H-02', 'Kapazitäten', 'Capacities', 'Eigene Kapazitäten', 'Your capacities', 'Pflegen Sie Verfügbarkeit, Zeitraum, Bedingungen und Übergabe.', 'Maintain availability, period, conditions and handover.', 'Kapazität hinzufügen', 'Add capacity', 'TN-02', 'keine automatische Veröffentlichung'),
    route('H-03', 'Bedarfe', 'Requests', 'Minimierte Bedarfsanfragen', 'Limited housing requests', 'Antworten Sie ohne Namen, Profile oder Dokumente.', 'Respond without names, profiles or documents.', 'Anfrage beantworten', 'Respond to request', 'TN-05', 'keine Buchung oder Zuteilung'),
    route('H-04', 'Übergaben', 'Handovers', 'Übergaben vorbereiten', 'Prepare handovers', 'Bestätigen oder ändern Sie Zeitfenster und Readiness.', 'Confirm or update the time window and readiness.', 'Readiness prüfen', 'Review readiness', 'TN-08', 'kein dauerhafter Kontaktzugang'),
    route('H-05', 'Reviews', 'Reviews', 'Reviews und Änderungen', 'Reviews and changes', 'Sehen Sie Rückfragen und betroffene Version.', 'View questions and the related version.', 'Betroffene Version öffnen', 'Open related version', 'TN-12', 'keine internen Prüfernotizen'),
    route('H-06', 'Organisation', 'Organisation', 'Organisation und Zugriff', 'Organisation and access', 'Prüfen Sie Rolle, Kontext, Kontakte und Sichtbarkeit.', 'Review role, context, contacts and visibility.', 'Organisationsdaten ansehen', 'View organisation details', 'TN-01', 'keine fremden Mandanten'),
  ],
  partner: [
    route('L-01', 'Übersicht', 'Overview', 'Ihre nächsten Schritte', 'Your next steps', 'Prüfen Sie Rückfragen, Termine und Angebotsänderungen.', 'Review questions, dates and offer changes.', 'Priorisierten Vorgang öffnen', 'Open priority item', 'TN-06', 'keine Reichweitengarantie', overviewStates),
    route('L-02', 'Angebote', 'Offers', 'Eigene Angebote', 'Your offers', 'Pflegen Sie Inhalt, Bedingungen, Termine und Plätze.', 'Maintain content, conditions, dates and places.', 'Angebot hinzufügen', 'Add offer', 'TN-02', 'keine automatische Partnerschaft'),
    route('L-03', 'Nachfrage', 'Demand', 'Minimierte Nachfrage', 'Limited demand requests', 'Antworten Sie ohne Namen oder Teilnehmerlisten.', 'Respond without names or participant lists.', 'Anfrage beantworten', 'Respond to request', 'TN-06', 'keine Nachfragegarantie'),
    route('L-04', 'Termine', 'Schedule', 'Termine und Kapazität', 'Schedule and capacity', 'Prüfen Sie Termin, Alternative, Wiederholung und Plätze.', 'Review date, alternative, recurrence and places.', 'Termin aktualisieren', 'Update schedule', 'TN-08', 'keine Teilnehmerfreigabe'),
    route('L-05', 'Reviews', 'Reviews', 'Reviews und Änderungen', 'Reviews and changes', 'Sehen Sie Rückfragen und Entscheidungen zu Angeboten.', 'View questions and decisions about offers.', 'Betroffenen Vorgang öffnen', 'Open related item', 'TN-12', 'kein Social Feed'),
    route('L-06', 'Organisation', 'Organisation', 'Organisation und Zugriff', 'Organisation and access', 'Prüfen Sie Rolle, Kategorie, Kontakte und Sichtbarkeit.', 'Review role, category, contacts and visibility.', 'Organisationsdaten ansehen', 'View organisation details', 'TN-01', 'keine fremden Mandanten'),
  ],
}

export const routeCount = Object.values(externalRoutes).flat().length

export function findRoute(collection, role, id) {
  const routes = collection[role] || []
  return routes.find((item) => item.id === id) || routes[0]
}
