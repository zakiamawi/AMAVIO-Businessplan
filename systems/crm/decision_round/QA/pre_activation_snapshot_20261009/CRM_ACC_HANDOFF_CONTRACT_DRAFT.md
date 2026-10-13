# AMAVIO One CRM – ACC-Handoff-Vertrag (Draft)

**Grundsatz:** CRM und Arrival Control Center bleiben getrennte Produkte und Codebasen. Dieser Entwurf löst keine Integration aus.

## Zulässiger Auslöser

Eine Opportunity steht auf `won`. Zusätzlich müssen ein Product Owner und die spätere Operations-Verantwortung die Übergabe ausdrücklich freigeben. Der lokale Core zeigt nur `review_required` beziehungsweise `approved_marker`.

## Minimales Übergabepaket – fachlicher Entwurf

- `contractVersion`;
- CRM-Opportunity-Referenz;
- Organisation-Referenz;
- freigegebener kommerzieller Scope;
- Pilot-/Leistungsbezeichnung;
- verantwortliche interne Rolle;
- geplanter Startkorridor;
- dokumentierte offene Punkte;
- Freigabestatus und Freigabezeitpunkte;
- Datenminimierungs- und Datenschutzprüfung;
- Idempotenzschlüssel für eine spätere technische Umsetzung.

## Ausdrücklich ausgeschlossen

- automatische ACC-Fallanlage;
- Übertragung von Kontakt- oder Personendaten;
- produktive ACC-ID;
- App-Konto oder App-Rollenanlage;
- E-Mail, Benachrichtigung oder Webhook;
- Annahme, dass „Gewonnen“ gleich „operativ startbereit“ ist.

## Noch offene Product-Owner-Entscheidungen

Freigaberollen, Pflichtfelder, Datenminimierung, Fehler-/Wiederholungslogik, Versionierung, Verantwortungsübergang, Rücknahme, Audit- und Datenschutznachweis.
