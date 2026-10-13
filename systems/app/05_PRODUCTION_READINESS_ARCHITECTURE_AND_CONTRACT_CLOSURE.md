# R2 Production Readiness Architecture & Contract Closure

## 1. Ziel und Abgrenzung

Dieses Paket beantwortet nicht die Frage „Welchen Anbieter schalten wir sofort an?“, sondern die wichtigere Frage: **Welche überprüfbaren Verträge müssen App, Backend, ACC, Datenhaltung und Assistenz erfüllen, bevor eine produktive Fähigkeit überhaupt freigegeben werden darf?**

Es handelt sich um eine lokale, synthetische Architekturgrundlage. Die Ausarbeitung ist keine Rechtsberatung und keine Produktivfreigabe.

## 2. Zielarchitektur

```text
Externe App-Rolle
  │ verifizierte Identität + Rolle + Tenant + Zweck
  ▼
AMAVIO One BFF / Policy Enforcement
  │ rollen- und objektminimierte Projektion
  ├── Arrival Domain Service
  ├── Audit / Event / Idempotency
  ├── Assistenz-Gateway mit Human Oversight
  └── versionierte App-/ACC-Nachrichtengrenze
                  │
                  ▼
       getrenntes AMAVIO ACC
       eigene Rollen, Oberfläche und Codebasis
```

Kein App-Client darf später direkt auf ACC-Tabellen, interne ACC-Endpunkte oder ungefilterte Arbeitgeberdaten zugreifen.

## 3. Identity-, Tenant- und Rechtemodell

### Autorisierungsregel

Eine Anmeldung allein reicht nicht. Jeder Zugriff benötigt gemeinsam:

`Subjekt + App-Rolle + Tenant + Objektbezug + Zweck + erlaubten Statusübergang + Negativrechte`

### App-Rollen

- Fachkraft: ausschließlich eigene Projektion, eigene Aufgaben, eigene strukturierte Supportanfrage und eigene Nachrichten;
- Wohnanbieter: ausschließlich eigene Organisationskapazität, eigene Antworten und eigene Übergabesignale;
- lokaler Partner: ausschließlich eigene Angebote, eigene Antworten und eigene Nachrichten.

Arbeitgeber und Operations sind Boundary-Akteure. Sie erhalten keine App-Sitzung. Ihre Oberflächen und Entscheidungen bleiben im ACC.

### Unverzichtbare Negativrechte

- keine freie Rollenumschaltung;
- kein Cross-Tenant-Zugriff;
- keine fremde Rollenprojektion;
- keine Selbstfreigabe oder Selbstveröffentlichung;
- keine internen Notizen, Budgets oder Management-KPIs;
- keine App-Sitzung für Arbeitgeber oder Operations;
- keine automatische Personenentscheidung.

Ein Identity Provider, MFA-Modell, Recovery, Sitzungsdauer und Organisationsadministration sind bewusst noch nicht ausgewählt. Die Auswahl soll nach Vertrag, nicht vor Vertrag, erfolgen.

## 4. Daten- und Datenschutzarchitektur

Die Datenarchitektur arbeitet mit `deny_unclassified_data`. Unklassifizierte Daten dürfen weder erhoben noch übertragen werden.

Der aktuelle Runtime-Modus erlaubt ausschließlich `synthetic_demo`. Reale Identitäts-, Arrival-, Dokument-, Support-, Audit- oder KI-Daten bleiben gesperrt, bis je Klasse mindestens Zweck, Verantwortlichkeit, Rechtsgrundlage, Speicherregion, Empfänger, Aufbewahrung, Löschung, Betroffenenprozess und technische Schutzmaßnahmen entschieden sind.

Besondere oder hochriskante Daten sowie unstrukturierter sensibler Freitext erhalten ein separates Rechts- und Security-Gate. Eine spätere App darf solche Inhalte nicht beiläufig in allgemeine Notizen oder KI-Prompts übernehmen.

## 5. App-/ACC-Vertragsarchitektur

App und ACC bleiben getrennt. Kompatibilität bedeutet nicht gemeinsame Datenbank und nicht gemeinsamen Frontend-Code. Kompatibilität bedeutet:

- identischer versionierter Envelope;
- eindeutige Korrelation;
- Idempotenz;
- Revisionsprüfung;
- explizite Objekt-/Statusübersetzung;
- Negativrechte;
- Replay- und Reconciliation-Verhalten;
- Auditspur;
- Consumer-driven Contract-Tests in beiden Codebasen.

Der read-only Audit des aktuellen ACC J.4.1 bestätigt mehrere gemeinsame Grundlagen. Er bestätigt aber keine Implementierung des App-Vertrags. Solange Message-Envelope, Korrelations-ID und beide Richtungsadapter fehlen, bleibt das Live-Gate geschlossen.

## 6. KI- und Human-Oversight-Architektur

Die App verwendet derzeit nur die lokale deterministische Assistenz. Ein späterer Provider darf erst nach einem gemeinsamen Gate aktiviert werden.

### Zulässig

- sichtbaren nächsten Schritt erklären;
- sichtbaren Status zusammenfassen;
- strukturierte Supportfrage vorbereiten.

### Verboten

- Personenbewertung;
- Matching, Ranking oder Scoring;
- Beschäftigungs-, Eignungs- oder Wohnraumentscheidung;
- Risikoprognose über eine Person;
- automatische Fallmutation;
- automatische externe Nachricht.

### Provider-Gate

Vor jeder Providerfreigabe müssen Use Cases, Datenschutz/Vertrag, Datenregion, Training/Retention, Subprozessoren, Security, Qualitäts- und Bias-Evaluation, Prompt-Injection-/Exfiltrationstests, Human Oversight, Fallback, Kostenlimit, Redaction/Löschung sowie Release/Rollback geklärt sein.

Da diese Entscheidungen nicht vorliegen, bleibt `approvedProvider = null` die einzige korrekte Entscheidung.

## 7. Security-, Betriebs- und Observability-Grenze

Die aktuelle lokale API ist kein Produktionsservice. Für Produktion fehlen unter anderem:

- Secret- und Key-Management;
- Transport- und Speicherverschlüsselung mit freigegebener Schlüsselstrategie;
- produktive Authentifizierung und serverseitige Autorisierung;
- Rate Limits und Abuse Detection;
- Queue-, Retry- und Dead-Letter-Konzept;
- Monitoring, Alarmierung und Incident Response;
- Backup-/Restore- und Löschabgleich;
- Threat Model, Security Review und Penetrationstest;
- Umgebungs-, Deployment- und Rollbackmodell.

## 8. Abnahmeregel

Kein Modul wird produktiv aktiviert, nur weil sein lokaler Prototyp funktioniert. Jede Fähigkeit benötigt alle abhängigen Gates mit expliziter Entscheidung und Evidenz. Tests, lokale Konfiguration oder ein erfolgreicher Screenshot ersetzen keine Rechts-, Datenschutz-, Security-, Betriebs- oder Releasefreigabe.
