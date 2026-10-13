const t = (de, en) => ({ de, en })
const item = (id, titleDe, titleEn, detailDe, detailEn, state) => ({ id, title: t(titleDe, titleEn), detail: t(detailDe, detailEn), state })
const fact = (labelDe, labelEn, valueDe, valueEn) => ({ label: t(labelDe, labelEn), value: t(valueDe, valueEn) })
const externalProjection = (titleDe, titleEn, introDe, introEn, facts, items) => ({ title: t(titleDe, titleEn), intro: t(introDe, introEn), facts, items })

export const externalProjections = {
  'P-00': externalProjection('Ihr sicherer Zugang', 'Your secure access', 'Prüfen Sie den sichtbaren Kontext, bevor Sie fortfahren.', 'Review the visible context before continuing.', [
    fact('Rolle', 'Role', 'Fachkraft', 'Professional'), fact('Organisation', 'Organisation', 'AMAVIO One · synthetisch', 'AMAVIO One · synthetic'), fact('Gültigkeit', 'Validity', 'Lokale Sitzung', 'Local session'),
  ], [
    item('P-00-1', 'Rolle und Zweck', 'Role and purpose', 'Nur die Fachkraft-Perspektive ist in dieser Sitzung sichtbar.', 'Only the professional perspective is visible in this session.', 'CONFIRMED'),
    item('P-00-2', 'Sitzungsgrenze', 'Session boundary', 'Keine Anmeldung, kein Konto und keine produktive Identität.', 'No sign-in, account or production identity.', 'NORMAL'),
  ]),
  'P-01': externalProjection('Ihre priorisierten Schritte', 'Your prioritised steps', 'Was jetzt zählt – mit Verantwortung und bestätigtem Stand.', 'What matters now – with responsibility and confirmed state.', [
    fact('Nächster Owner', 'Next owner', 'AMAVIO', 'AMAVIO'), fact('Servicefenster', 'Service window', 'Nächste Rückmeldung bis 14:00', 'Next update by 2 pm'), fact('Sichtbarkeit', 'Visibility', 'Nur Ihre Schritte', 'Your steps only'),
  ], [
    item('P-01-1', 'Ankunft vorbereiten', 'Prepare arrival', 'Wichtige Unterlagen und organisatorische Schritte sind in Prüfung.', 'Important documents and organisational steps are under review.', 'IN_REVIEW'),
    item('P-01-2', 'Erster Arbeitstag', 'First working day', 'Bestätigte Informationen zu Zeit, Weg und Ansprechperson folgen.', 'Confirmed information about time, route and contact will follow.', 'WAITING'),
    item('P-01-3', '30/60/90-Tage Check-in', '30/60/90-day check-in', 'Freiwillige Rückmeldung ohne Nachteil, Score oder Arbeitgeberfreitext.', 'Voluntary feedback without disadvantage, score or employer free text.', 'DRAFT'),
  ]),
  'P-02': externalProjection('Ihr Ankunftsplan', 'Your arrival plan', 'Eigene Aufgaben und bestätigte Schritte in einer nachvollziehbaren Reihenfolge.', 'Your tasks and confirmed steps in a clear sequence.', [
    fact('Fortschritt', 'Progress', '2 von 5 vorbereitet', '2 of 5 prepared'), fact('Offen', 'Open', '1 eigene Aufgabe', '1 task for you'), fact('Nächster Termin', 'Next appointment', '17. Oktober · bestätigt', '17 October · confirmed'),
  ], [
    item('P-02-1', 'Ankunftsdokumente prüfen', 'Review arrival documents', 'Die aktuelle Version ist für Ihre Prüfung vorbereitet.', 'The current version is prepared for your review.', 'READY_TO_SUBMIT'),
    item('P-02-2', 'Weg zum ersten Arbeitstag', 'Route to your first working day', 'Zeit, Ort und Ansprechperson sind bestätigt.', 'Time, place and contact are confirmed.', 'CONFIRMED'),
    item('P-02-3', 'Lokale Orientierung', 'Local orientation', 'Optionale Informationen können später geöffnet werden.', 'Optional information can be opened later.', 'NORMAL'),
  ]),
  'P-03': externalProjection('Gezielte Unterstützung', 'Focused support', 'Beginnen Sie ein Anliegen mit so wenig Angaben wie möglich.', 'Start a support request with as little information as possible.', [
    fact('Antwortweg', 'Response path', 'In diesem Vorgang', 'In this item'), fact('Erwartung', 'Expectation', 'Im nächsten Servicefenster', 'During the next service window'), fact('Privatsphäre', 'Privacy', 'Kein Arbeitgeberfreitext', 'No employer free text'),
  ], [
    item('P-03-1', 'Organisatorische Frage', 'Organisational question', 'Wählen Sie den betroffenen Schritt, bevor Sie Angaben teilen.', 'Choose the affected step before sharing information.', 'NORMAL'),
    item('P-03-2', 'Dringende Klärung', 'Urgent clarification', 'Dringlichkeit wird sichtbar begründet; die Entscheidung bleibt manuell.', 'Urgency is explained visibly; the decision remains manual.', 'PAUSED'),
  ]),
  'P-04': externalProjection('Änderungen im Kontext', 'Changes in context', 'Jede Rückfrage bleibt an ihren konkreten Vorgang gebunden.', 'Each question remains linked to its specific item.', [
    fact('Offene Rückfrage', 'Open question', '1', '1'), fact('Letzte Änderung', 'Last change', 'Heute · 09:18', 'Today · 9:18 am'), fact('Allgemeiner Chat', 'General chat', 'Nicht vorgesehen', 'Not provided'),
  ], [
    item('P-04-1', 'Zeitfenster aktualisieren', 'Update time window', 'Ihre vorhandene Eingabe bleibt bis zur bewussten Bestätigung erhalten.', 'Your existing input remains until you confirm deliberately.', 'CHANGES_REQUESTED'),
    item('P-04-2', 'Dokumentversion vergleichen', 'Compare document version', 'Die bestätigte Version wird nicht still überschrieben.', 'The confirmed version is not overwritten silently.', 'CONFLICT'),
  ]),
  'P-05': externalProjection('Zugang und Datenwege', 'Access and data paths', 'Transparente Optionen für Sprache, Sichtbarkeit und Datenanfragen.', 'Transparent options for language, visibility and data requests.', [
    fact('Rolle', 'Role', 'Fachkraft · gesperrt', 'Professional · locked'), fact('Sprache', 'Language', 'Deutsch / Englisch', 'German / English'), fact('Datenanfrage', 'Data request', 'Kontrollierter Prozess', 'Controlled process'),
  ], [
    item('P-05-1', 'Sichtbarkeit verstehen', 'Understand visibility', 'Sehen Sie, welche synthetischen Angaben in welchem Schritt erscheinen.', 'See which synthetic details appear in each step.', 'NORMAL'),
    item('P-05-2', 'Datenanfrage vorbereiten', 'Prepare a data request', 'Eine Auswahl startet keine sofortige Löschung oder Änderung.', 'A selection does not trigger immediate deletion or change.', 'DRAFT'),
  ]),

  'H-01': externalProjection('Priorisierte Vorgänge', 'Prioritised items', 'Eigene Kapazitäten, Rückfragen und Übergaben – ohne Personenprofile.', 'Your capacities, questions and handovers – without personal profiles.', [
    fact('Offen', 'Open', '2 Vorgänge', '2 items'), fact('Nächster Owner', 'Next owner', 'Wohnanbieter', 'Housing provider'), fact('Personendaten', 'Personal data', 'Nicht sichtbar', 'Not visible'),
  ], [
    item('H-01-1', 'Verfügbarkeit bestätigen', 'Confirm availability', 'Zeitraum und Bedingungen sind als Entwurf vorbereitet.', 'Period and conditions are prepared as a draft.', 'DRAFT'),
    item('H-01-2', 'Übergabezeitfenster', 'Handover window', 'Eine alternative Uhrzeit ist erforderlich.', 'An alternative time is required.', 'CHANGES_REQUESTED'),
    item('H-01-3', 'Minimierte Anfrage', 'Limited request', 'Die Anfrage enthält weder Namen noch Profile oder Dokumente.', 'The request contains no names, profiles or documents.', 'WAITING'),
  ]),
  'H-02': externalProjection('Eigene Kapazitäten', 'Your capacities', 'Verfügbarkeit und Übergabebedingungen bleiben vollständig unter Ihrer Kontrolle.', 'Availability and handover conditions remain fully under your control.', [
    fact('Einheiten', 'Units', '2 synthetische Einheiten', '2 synthetic units'), fact('Zeitraum', 'Period', 'Ab 1. November', 'From 1 November'), fact('Veröffentlichung', 'Publication', 'Nicht automatisch', 'Not automatic'),
  ], [
    item('H-02-1', 'Apartment Düsseldorf-Bilk', 'Apartment Düsseldorf-Bilk', 'Möbliert · zwei Einheiten · Angaben noch nicht eingereicht.', 'Furnished · two units · details not submitted.', 'DRAFT'),
    item('H-02-2', 'Bedingungen und Readiness', 'Conditions and readiness', 'Übergabe, Ausstattung und Verfügbarkeit können getrennt geprüft werden.', 'Handover, furnishings and availability can be reviewed separately.', 'READY_TO_SUBMIT'),
  ]),
  'H-03': externalProjection('Minimierte Bedarfe', 'Limited housing requests', 'Entscheiden Sie über Passung, ohne personenbezogene Profile zu erhalten.', 'Decide on fit without receiving personal profiles.', [
    fact('Anfrage', 'Request', '1 offen', '1 open'), fact('Profilzugang', 'Profile access', 'Keiner', 'None'), fact('Zuteilung', 'Allocation', 'Nicht automatisch', 'Not automatic'),
  ], [
    item('H-03-1', 'Bedarf Düsseldorf', 'Düsseldorf request', 'Zeitraum, Haushaltsgröße und notwendige Merkmale – ohne Namen.', 'Period, household size and required features – without names.', 'WAITING'),
    item('H-03-2', 'Passung beantworten', 'Respond on fit', 'Ihre Antwort ist keine Buchung oder endgültige Zuteilung.', 'Your response is not a booking or final allocation.', 'NORMAL'),
  ]),
  'H-04': externalProjection('Sichere Übergaben', 'Safe handovers', 'Readiness, Zeitfenster und Fallback werden vor Bestätigung getrennt geprüft.', 'Readiness, time window and fallback are reviewed separately before confirmation.', [
    fact('Zeitfenster', 'Time window', '15–18 Uhr', '3–6 pm'), fact('Readiness', 'Readiness', 'Nicht bestätigt', 'Not confirmed'), fact('Kontaktzugang', 'Contact access', 'Nur für die Übergabe', 'Handover only'),
  ], [
    item('H-04-1', 'Übergabezeitfenster bestätigen', 'Confirm handover window', 'Eine Bestätigung gilt nur für den sichtbaren Übergabevorgang.', 'Confirmation applies only to the visible handover item.', 'BLOCKED'),
    item('H-04-2', 'Fallback hinterlegen', 'Record fallback', 'Ein alternativer dokumentierter Kanal bleibt erforderlich.', 'An alternative documented channel remains required.', 'DRAFT'),
  ]),
  'H-05': externalProjection('Reviews und Versionen', 'Reviews and versions', 'Rückfragen werden mit der betroffenen Version und ihrer Wirkung gezeigt.', 'Questions are shown with the affected version and its effect.', [
    fact('Review', 'Review', '1 Rückfrage', '1 question'), fact('Version', 'Version', 'Entwurf 02', 'Draft 02'), fact('Interne Notizen', 'Internal notes', 'Nicht sichtbar', 'Not visible'),
  ], [
    item('H-05-1', 'Ausstattungsangabe präzisieren', 'Clarify furnishing detail', 'Nur die markierte Angabe benötigt eine Änderung.', 'Only the marked detail requires a change.', 'CHANGES_REQUESTED'),
    item('H-05-2', 'Versionen vergleichen', 'Compare versions', 'Der bestätigte Stand bleibt bis zur bewussten Auswahl erhalten.', 'The confirmed state remains until a deliberate choice is made.', 'CONFLICT'),
  ]),
  'H-06': externalProjection('Organisation und Zugriff', 'Organisation and access', 'Eigene Rolle, Kontakte und Sichtbarkeit – ohne fremde Mandanten.', 'Your role, contacts and visibility – without other tenants.', [
    fact('Organisation', 'Organisation', 'Synthetischer Anbieter', 'Synthetic provider'), fact('Rolle', 'Role', 'Wohnanbieter · gesperrt', 'Housing provider · locked'), fact('Mandanten', 'Tenants', 'Nur eigener Kontext', 'Own context only'),
  ], [
    item('H-06-1', 'Organisationsdaten prüfen', 'Review organisation details', 'Kontakte und Kategorien sind lokal und synthetisch.', 'Contacts and categories are local and synthetic.', 'NORMAL'),
    item('H-06-2', 'Zugriffsfrage vorbereiten', 'Prepare access question', 'Keine Berechtigungsänderung wird produktiv ausgeführt.', 'No permission change is performed in production.', 'DRAFT'),
  ]),

  'L-01': externalProjection('Priorisierte Partneraufgaben', 'Prioritised partner tasks', 'Termine, Rückfragen und Angebotsänderungen in Ihrem eigenen Kontext.', 'Schedules, questions and offer changes in your own context.', [
    fact('Offen', 'Open', '2 Vorgänge', '2 items'), fact('Nächster Owner', 'Next owner', 'Lokaler Partner', 'Local partner'), fact('Teilnehmerdaten', 'Participant data', 'Nicht sichtbar', 'Not visible'),
  ], [
    item('L-01-1', 'Termin und Plätze prüfen', 'Review schedule and places', 'Acht Plätze sind als Entwurf hinterlegt.', 'Eight places are recorded as a draft.', 'DRAFT'),
    item('L-01-2', 'Alternative vorschlagen', 'Suggest an alternative', 'Für den aktuellen Termin wird eine Alternative benötigt.', 'An alternative is needed for the current date.', 'CHANGES_REQUESTED'),
    item('L-01-3', 'Minimierte Nachfrage', 'Limited demand', 'Die Anfrage enthält keine Namen oder Teilnehmerliste.', 'The request contains no names or participant list.', 'IN_REVIEW'),
  ]),
  'L-02': externalProjection('Eigene Angebote', 'Your offers', 'Inhalt, Bedingungen, Termine und Plätze werden bewusst getrennt gepflegt.', 'Content, conditions, schedules and places are maintained separately.', [
    fact('Angebote', 'Offers', '1 Entwurf', '1 draft'), fact('Plätze', 'Places', '8 vorgesehen', '8 planned'), fact('Partnerschaft', 'Partnership', 'Nicht automatisch', 'Not automatic'),
  ], [
    item('L-02-1', 'Ankommen in Düsseldorf', 'Arriving in Düsseldorf', 'Orientierungsangebot · 29. Oktober · acht Plätze.', 'Orientation offer · 29 October · eight places.', 'DRAFT'),
    item('L-02-2', 'Bedingungen prüfen', 'Review conditions', 'Sichtbarkeit und Teilnahmebedingungen sind noch nicht bestätigt.', 'Visibility and participation conditions are not yet confirmed.', 'READY_TO_SUBMIT'),
  ]),
  'L-03': externalProjection('Minimierte Nachfrage', 'Limited demand', 'Bedarfssignale ohne Namen, Profile oder Teilnehmerlisten.', 'Demand signals without names, profiles or participant lists.', [
    fact('Signal', 'Signal', '1 synthetische Anfrage', '1 synthetic request'), fact('Zeitraum', 'Period', 'Nächste vier Wochen', 'Next four weeks'), fact('Garantie', 'Guarantee', 'Keine', 'None'),
  ], [
    item('L-03-1', 'Orientierungsbedarf', 'Orientation demand', 'Kategorie, Zeitraum und Größenordnung sind sichtbar.', 'Category, period and approximate volume are visible.', 'IN_REVIEW'),
    item('L-03-2', 'Kapazität rückmelden', 'Respond on capacity', 'Die Rückmeldung erzeugt keine Teilnehmerfreigabe.', 'The response does not approve participants.', 'NORMAL'),
  ]),
  'L-04': externalProjection('Termine und Kapazität', 'Schedule and capacity', 'Termin, Alternative, Wiederholung und Plätze werden separat bestätigt.', 'Date, alternative, recurrence and places are confirmed separately.', [
    fact('Nächster Termin', 'Next date', '29. Oktober', '29 October'), fact('Kapazität', 'Capacity', '8 Plätze', '8 places'), fact('Alternative', 'Alternative', 'Erforderlich', 'Required'),
  ], [
    item('L-04-1', 'Termin aktualisieren', 'Update schedule', 'Eine Alternative kann ergänzt werden, ohne den Entwurf zu verlieren.', 'An alternative can be added without losing the draft.', 'CHANGES_REQUESTED'),
    item('L-04-2', 'Wiederholung prüfen', 'Review recurrence', 'Eine Wiederholung ist optional und nicht automatisch aktiviert.', 'Recurrence is optional and not activated automatically.', 'PAUSED'),
  ]),
  'L-05': externalProjection('Reviews und Entscheidungen', 'Reviews and decisions', 'Rückfragen bleiben mit dem betroffenen Angebot verbunden.', 'Questions remain linked to the affected offer.', [
    fact('Review', 'Review', '1 offen', '1 open'), fact('Betroffen', 'Affected', 'Angebotsversion 02', 'Offer version 02'), fact('Social Feed', 'Social feed', 'Nicht vorhanden', 'Not provided'),
  ], [
    item('L-05-1', 'Beschreibung präzisieren', 'Clarify description', 'Die Rückfrage betrifft ausschließlich die markierte Passage.', 'The question concerns only the marked passage.', 'CHANGES_REQUESTED'),
    item('L-05-2', 'Entscheidung nachvollziehen', 'Understand decision', 'Grundlage und nächste Handlung werden gemeinsam angezeigt.', 'Basis and next action are shown together.', 'IN_REVIEW'),
  ]),
  'L-06': externalProjection('Organisation und Zugriff', 'Organisation and access', 'Eigene Kategorie, Kontakte und Sichtbarkeit – ohne fremde Mandanten.', 'Your category, contacts and visibility – without other tenants.', [
    fact('Organisation', 'Organisation', 'Synthetischer Partner', 'Synthetic partner'), fact('Rolle', 'Role', 'Lokaler Partner · gesperrt', 'Local partner · locked'), fact('Sichtbarkeit', 'Visibility', 'Eigener Kontext', 'Own context'),
  ], [
    item('L-06-1', 'Organisationsprofil prüfen', 'Review organisation profile', 'Kategorie und Kontakte sind nur lokal dargestellt.', 'Category and contacts are displayed locally only.', 'NORMAL'),
    item('L-06-2', 'Zugriffsfrage vorbereiten', 'Prepare access question', 'Keine produktive Rollen- oder Berechtigungsänderung.', 'No production role or permission change.', 'DRAFT'),
  ]),
}


export const projectedRouteIds = Object.keys(externalProjections)
