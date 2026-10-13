# AMAVIO One CRM – ACC-Handoff-Fachvertrag

**Version:** Fachvertrag 1.0 · Product-Owner-Beschluss vom 09.10.2026  
**Status:** fachliche Freigabelogik beschlossen; ACC-Integration vollständig gesperrt  
**Grundsatz:** CRM und Arrival Control Center bleiben getrennte Produkte und Codebasen. Dieser Vertrag löst keine Integration aus.

**Lokale R3-Angleichung:** Für gewonnene synthetische Chancen können Commercial/Product Owner und Operations jeweils einen lokalen Prüfmarker setzen. `approved_marker` entsteht erst bei beiden Markern. Der lokale Zustand enthält ausdrücklich keinen Payload und keine ACC-ID.

## Zulässiger Auslöser

Eine Opportunity steht auf `won`. Zusätzlich müssen die Commercial-/Product-Owner-Verantwortung und die Operations-Verantwortung die Übergabe jeweils ausdrücklich freigeben. Beide Freigaben sind fachlich erforderlich; keine ersetzt die andere. Der lokale Core zeigt weiterhin nur `review_required` beziehungsweise `approved_marker`.

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

Der Default-Datensatz enthält keine Kontakt- oder sonstigen Personendaten. Eine spätere Erweiterung um personenbezogene Felder benötigt einen neuen versionierten Beschluss sowie Rechts-, Datenschutz- und Security-Prüfung.

## Ausdrücklich ausgeschlossen

- automatische ACC-Fallanlage;
- Übertragung von Kontakt- oder Personendaten;
- produktive ACC-ID;
- App-Konto oder App-Rollenanlage;
- E-Mail, Benachrichtigung oder Webhook;
- Annahme, dass „Gewonnen“ gleich „operativ startbereit“ ist.

## Weiterhin offene Umsetzungs- und Freigabegates

Technisches Nachrichtenformat, Feldvalidierung, Fehler-/Wiederholungslogik, Integrationsauthentifizierung, Verantwortungsübergang, Rücknahme, Auditnachweis, Datenschutzprüfung, Security Review und ACC-seitige Zustimmung. Ohne gesonderten Auftrag bleibt es bei lokalen Markern ohne Payload oder Übertragung.
