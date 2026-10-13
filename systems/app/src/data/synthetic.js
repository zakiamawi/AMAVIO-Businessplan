export const professionalSteps = [
  { id: 'arrival', title: { de: 'Ankunft vorbereiten', en: 'Prepare arrival' }, detail: { de: 'Wichtige Unterlagen, organisatorische Schritte und praktische Informationen.', en: 'Important documents, organisational steps and practical information.' }, state: 'IN_REVIEW' },
  { id: 'workday', title: { de: 'Erster Arbeitstag', en: 'First working day' }, detail: { de: 'Bestätigte Informationen zu Zeitpunkt, Weg und Ansprechperson.', en: 'Confirmed information about time, route and contact.' }, state: 'WAITING' },
  { id: 'checkin', title: { de: '30/60/90-Tage Check-in', en: '30/60/90-day check-in' }, detail: { de: 'Freiwillige strukturierte Rückmeldung ohne Nachteil oder Score.', en: 'Voluntary structured feedback without disadvantage or score.' }, state: 'DRAFT' },
]

export const housingItems = [
  { id: 'H-SYN-01', title: { de: 'Möbliertes Apartment · Düsseldorf-Bilk', en: 'Furnished apartment · Düsseldorf-Bilk' }, meta: { de: '2 Einheiten · ab 1. November · Entwurf', en: '2 units · from 1 November · draft' }, state: 'DRAFT' },
  { id: 'H-SYN-02', title: { de: 'Minimierte Bedarfsanfrage', en: 'Limited housing request' }, meta: { de: 'Ohne Namen, Profile oder Dokumente', en: 'Without names, profiles or documents' }, state: 'WAITING' },
  { id: 'H-SYN-03', title: { de: 'Übergabezeitfenster', en: 'Handover window' }, meta: { de: '15–18 Uhr · Bestätigung offen', en: '3–6 pm · confirmation pending' }, state: 'BLOCKED' },
]

export const partnerItems = [
  { id: 'L-SYN-01', title: { de: 'Ankommen in Düsseldorf', en: 'Arriving in Düsseldorf' }, meta: { de: '8 Plätze · 29. Oktober · Entwurf', en: '8 places · 29 October · draft' }, state: 'DRAFT' },
  { id: 'L-SYN-02', title: { de: 'Minimierte Nachfrage', en: 'Limited demand request' }, meta: { de: 'Ohne Namen oder Teilnehmerliste', en: 'Without names or participant list' }, state: 'IN_REVIEW' },
  { id: 'L-SYN-03', title: { de: 'Termin und Kapazität', en: 'Schedule and capacity' }, meta: { de: 'Alternative erforderlich · Eingaben erhalten', en: 'Alternative required · input preserved' }, state: 'CHANGES_REQUESTED' },
]

