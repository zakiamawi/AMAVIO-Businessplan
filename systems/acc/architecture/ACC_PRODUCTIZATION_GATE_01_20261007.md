# AMAVIO ACC – Productization Gate 01

**Stand:** 07.10.2026  
**Status:** lokal implementierter technischer Vertikalschnitt; ausschließlich synthetisch; nicht veröffentlicht; nicht produktionsreif  
**Rückfallbasis:** `10_Control_Center/20261003_AMAVIO_ACC_Calm_Capable_V2_Working/` bleibt unverändert

## Entscheidung

Der nächste sinnvolle Schritt ist nicht die gleichzeitige Aktivierung von externer KI, Prognosen, produktiver Registrierung, Versand, Buchung und automatisierten Entscheidungen. Gate 01 beweist zuerst eine vollständige, kontrollierte Systemkette:

`synthetische Demo-Sitzung → serverseitiger Mandant → persistierter Fall → strukturierte Assistenz → menschliche Prüfung → Audit → wirkungsloser Outbox-/Buchungs-Sink`

Damit wird aus der statischen Konzeptlogik erstmals ein echter lokaler Systemlauf, ohne die noch offenen Datenschutz-, Security-, Hosting-, Vertrags- und Betriebsgates zu überspringen.

## Implementierter Vertikalschnitt

### Frontend

- neuer, ruhiger Bereich `Produktpilot` innerhalb der bestehenden ACC-Arbeitsoberfläche;
- sichtbarer Laufstatus für Backend und Datenbank;
- ein durchgängig als synthetisch gekennzeichneter Fall;
- strukturierter Assistenzlauf mit Zusammenfassung, Empfehlung, Belegen, Konfidenz, Unsicherheit und verbotenen Aktionen;
- explizites Human Gate: annehmen oder zurückweisen mit Prüfnotiz;
- Nachricht- und Buchung ausschließlich als serverseitig gespeicherte Vorschau mit Status `sink_only`;
- Audit Trail der relevanten Ereignisse.

### Backend und Datenbank

- lokales Node.js-HTTP-Backend ohne zusätzliche Laufzeitabhängigkeit;
- persistente SQLite-Datenbank als Entwicklungsnachweis;
- synthetische Tabellen für Mandanten, Nutzer, Arrival-Fälle, Assistenzläufe, Prüfentscheidungen, Vorschauen und Audit-Ereignisse;
- Mandantenkontext wird aus einer lokalen Demo-Sitzung serverseitig abgeleitet, nicht aus einem vom Client frei gesetzten `tenant_id`;
- Cross-Tenant-Abfragen liefern keinen fremden Datensatz;
- positive menschliche Prüfung ist technische Voraussetzung für jede Vorschau;
- keine Route für produktive Registrierung, echten Versand oder reale Buchung.

### Intelligence Boundary

Gate 01 verwendet `local-structured-fallback / acc-rules-v1`. Das ist eine reproduzierbare strukturierte Assistenz, keine externe oder generative KI. Ein anderer Provider-Modus wird serverseitig mit `503` blockiert, bis Founder-, Datenschutz- und Kostenfreigabe vorliegen.

Dieser Zwischenschritt ist absichtlich: Erst wenn Datenvertrag, Ausgabeformat, Human Gate, Audit und Wirkungssperre funktionieren, darf ein externer Modellanbieter hinter dieselbe Schnittstelle gesetzt werden.

## Warum die Reihenfolge fachlich und technisch sinnvoll ist

### 1. Generative Assistenz vor Prognose

Generative Assistenz kann auf einen klar begrenzten Arbeitsauftrag hin strukturierte Entwürfe und Vorschläge erzeugen. Ihre Ausgabe bleibt prüfbar und hat ohne menschliche Freigabe keine Wirkung. Das ist der erste externe KI-Kandidat für Gate 02.

Eine echte Prognose benötigt dagegen mindestens:

- eine dokumentierte Zielvariable, zum Beispiel welcher konkrete Ausgang prognostiziert werden soll;
- ausreichend historische, rechtmäßig nutzbare und repräsentative Daten;
- getrennte Trainings-, Validierungs- und Testmengen;
- Baseline, Fehlermetriken und akzeptierte Schwellenwerte;
- Subgruppen-/Fairnessprüfung;
- Kalibrierung, Drift-Erkennung und regelmäßige Neubewertung;
- Modellkarte, Datenherkunft und dokumentierten menschlichen Umgang mit Unsicherheit.

Ohne diese Nachweise wäre ein Prozentwert nur eine illustrierte Vermutung und darf nicht als „echte Prognose“ bezeichnet werden.

### 2. Assistenz vor automatisierter Entscheidung

AMAVIO bewegt sich in einem arbeitsbezogenen Kontext. Je nach beabsichtigtem Zweck können KI-Systeme für Beschäftigung und Arbeitnehmermanagement nach Anhang III des EU AI Act als Hochrisiko gelten, insbesondere wenn sie Auswahl, Arbeitsbedingungen, Aufgabenverteilung, Überwachung oder Leistungsbewertung beeinflussen. Der konkrete `intended purpose` ist entscheidend. Deshalb schließt Gate 01 Personenbewertung, Profiling, Leistungsbewertung, Rekrutierungsentscheidung und automatische Zuteilung ausdrücklich aus.

Die DSGVO schützt Personen zudem vor ausschließlich automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung; bei Ausnahmen sind Schutzmaßnahmen einschließlich menschlichen Eingreifens und Anfechtbarkeit relevant. Verarbeitung mit voraussichtlich hohem Risiko kann eine Datenschutz-Folgenabschätzung vor Beginn erfordern. Für AMAVIO bedeutet das: Human-in-the-loop ist kein dekorativer Bestätigungsbutton, sondern muss fachlich informiert, zeitlich möglich und technisch wirksam sein.

### 3. Produktive Identität vor echten Daten

Die lokale Demo-Sitzung beweist nur die serverseitige Mandantenzuordnung. Sie ist keine Authentifizierung. Vor echten Personen- oder Arbeitgeberdaten braucht das Produkt mindestens:

- einen freigegebenen Identity Provider;
- MFA- und gegebenenfalls SSO-Entscheidung;
- Einladungs-, Joiner-/Mover-/Leaver- und Offboarding-Prozess;
- serverseitige Rollen- und Rechteprüfung;
- belastbare Mandantentrennung auf Datenbankebene;
- Audit, Session-Schutz, Rate Limits und Incident Response.

## Drei getrennte KI-Reifegrade

| Reifegrad | Zweck | Gate-01-Status | Nächster Nachweis |
|---|---|---|---|
| Assistive Generierung | Arbeitsvorschläge, Zusammenfassungen, Entwürfe | Schnittstelle und Human Gate implementiert; externer Provider aus | Provider-/Datenfreigabe und kontrollierter synthetischer Modelltest |
| Prognose | Wahrscheinlichkeit eines klar definierten operativen Ereignisses | nicht behauptet, nicht implementiert | rechtmäßiger Datensatz, Zielvariable, Validierung, Fairness, Kalibrierung, Drift |
| Automatisierte Entscheidung/Aktion | Ausgabe entscheidet oder löst Außenwirkung aus | ausdrücklich gesperrt | eigener Legal-/AI-Act-/DSGVO-, Risiko-, Human-Oversight- und Betriebsgate |

## Architektur für Gate 02

```text
Browser / ACC
    │
    ▼
API / BFF ── serverseitige Session, Rollen, Mandant
    │
    ├── Arrival Domain Service ── PostgreSQL + Tenant Policies
    ├── Assistance Orchestrator
    │       ├── strukturierter lokaler Fallback
    │       └── externer AI Provider Adapter [AUS bis Gate 02]
    ├── Human Review Service
    ├── Append-only Audit / Observability
    └── Effect Adapters
            ├── Outbox Sink [Gate 01]
            ├── Booking Sink [Gate 01]
            └── Live Provider [AUS bis eigener Gate]
```

SQLite ist nur die lokale, reversible Entwicklungsdatenbank. Für ein produktives Mehrmandantensystem ist ein serverseitiges PostgreSQL-Modell mit getesteten Tenant Policies die empfohlene Zielrichtung. Anbieter, Hostingregion, Authentifizierung und AI Provider sind bewusst noch nicht ausgewählt.

## Nicht implementiert und nicht freigegeben

- externe oder generative KI;
- echte Personen-, Arbeitnehmer-, Arbeitgeber-, Objekt- oder Partnerdaten;
- produktive Registrierung, Login, MFA oder SSO;
- produktive Mandantentrennung oder Security-Nachweis;
- echte Prognose oder Personen-Scoring;
- automatische Entscheidung, Freigabe oder Prozessänderung;
- Nachricht, E-Mail, SMS, Push, Buchung, Reservierung oder Zahlung;
- App-, CRM-, HRIS-, Dokumenten- oder Partnerintegration;
- Hosting, Veröffentlichung, Deployment, Monitoring oder Supportbetrieb.

## Akzeptanzkriterien Gate 01

- [x] neue datierte Arbeitskopie; vorheriger V2-Stand unverändert;
- [x] ein synthetischer Fall wird aus persistenter Datenbank geladen;
- [x] Mandantenkontext wird serverseitig aus der Demo-Sitzung bestimmt;
- [x] Cross-Tenant-Zugriff wird negativ getestet;
- [x] Assistenzlauf liefert ein versioniertes, strukturiertes Ergebnis;
- [x] Ergebnis enthält Evidenz, Unsicherheit und verbotene Aktionen;
- [x] menschliche Annahme oder Zurückweisung wird persistent gespeichert;
- [x] Außenkanäle bleiben `sink_only` und verlangen vorherige Freigabe;
- [x] Audit-Ereignisse sind tenantgebunden und persistent;
- [x] produktive Registrierung und externer Provider bleiben technisch gesperrt;
- [x] API-, Backend-, Browser-, Responsive-, Accessibility- und Interaktions-QA sind definiert.

## Rechtliche Orientierung – keine Rechtsberatung

- EU AI Act, Verordnung (EU) 2024/1689, insbesondere Art. 6 und Anhang III zum arbeitsbezogenen Einsatz: <https://eur-lex.europa.eu/eli/reg/2024/1689>
- DSGVO, Verordnung (EU) 2016/679, insbesondere Art. 22 zu automatisierten Einzelentscheidungen: <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679>
- DSGVO Art. 25 und Art. 35 zu Datenschutz durch Technikgestaltung und Datenschutz-Folgenabschätzung: <https://eur-lex.europa.eu/eli/reg/2016/679/oj>

Die konkrete rechtliche Einstufung muss vor Gate 02 anhand des beabsichtigten Zwecks, der Daten, der betroffenen Rollen und der tatsächlichen Wirkung durch Datenschutz-/Rechtskompetenz geprüft werden.
