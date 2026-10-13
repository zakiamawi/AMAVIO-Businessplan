# AMAVIO ACC – Productization Gates 02–04

## Identity, Tenancy, Resilience, Data, Integration, Operations and Controlled Validation

**Stand:** 07.10.2026  
**Status:** verbindlicher Entscheidungs- und Umsetzungsrahmen; keine Produktivsysteme aktiviert  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Productization_Gate_02_Foundation_Working`  
**Ausgangsbasis:** Productization Gate 01.5 / Releases D–F  
**Rückfallbasis:** `archive/20261007_gate_02_foundation_baseline/`

## 1. Entscheidung

Die acht genannten Punkte werden nicht als ein großer Produktiv-Release umgesetzt. Sie bilden vier aufeinander aufbauende Gates. Jedes Gate besitzt eine eigene Abnahme, eigene Rückfallbasis und eine klare Stop-Bedingung. Ein späteres Gate darf ein früheres nicht stillschweigend ersetzen.

Die kostenbewusste Reihenfolge lautet:

`Assurance Core → moderierte synthetische Nutzervalidierung → Identity/Tenancy in Staging → enger Live-Provider-Sandboxtest → Data/Integrations-Sandbox → produktiver Betriebsnachweis`

Damit wird verhindert, dass reale Daten oder breite Produktivinfrastruktur auf einer noch nicht ausreichend fehlertoleranten oder nutzerseitig unverstandenen Basis eingeführt werden. Der enge Provider-Sandboxtest darf nach Gate 02A und Founder-Freigabe vor realen Datenintegrationen stattfinden, weil er ausschließlich synthetische Inputs verwendet.

## 2. Gate 02A – Assurance Core

**Deckt ab:** Punkt 3.  
**Außenwirkung:** keine.  
**Kann sofort lokal umgesetzt werden:** ja.  
**Status 07.10.2026:** abgeschlossen; 20/20 Routen und 13/13 Mutationen routenweise grün, 78/78 automatisierte Tests sowie Static- und Browser-QA bestanden.

### Ziel

Jede bestehende API-Route erhält einen reproduzierbaren Nachweis für Eingabegrenzen, Mandantengrenzen, konkurrierende Änderungen, Wiederholungen und technische Fehler.

### Lieferumfang

- versioniertes Route Registry mit allen Gate-01- und Gate-01.5-Endpunkten;
- Fuzz-Corpus für Typen, Längen, Enums, Datumswerte, Unicode, Nullwerte, malformed JSON und übergroße Requests;
- Concurrency-Tests für Fallversion, Entscheidung, Simulation, Evidenz, Aufgabe und Arbeitsprodukt;
- einheitlicher Idempotency-Key-Vertrag für alle Mutationen;
- Request-Fingerprint und Konfliktantwort bei wiederverwendetem Key mit anderem Payload;
- transaktionale Mutationen oder nachweislich atomare Compare-and-Swap-Updates;
- Failure-Injection-Hooks für Datenbankfehler, Providerfehler, Timeout, ungültige Antwort und abgebrochene Verbindung;
- Restart-, Recovery- und Audit-Konsistenztests;
- maschinenlesbarer Coverage-Report je Route und Fehlerklasse.

### Exit-Kriterien

- jede Route ist im Registry erfasst;
- 100 % der Mutationen haben eine dokumentierte Idempotenzstrategie;
- konkurrierende identische Mutation erzeugt höchstens eine fachliche Änderung;
- bei simulierten Fehlern bleiben Fall, Audit und abgeleitete Objekte konsistent;
- unbekannte oder fremde Ressourcen geben keine Mandantendetails preis;
- keine externen Requests und keine echten Daten.

## 3. Gate 02B – Identity, Authentication, Tenancy and Authorization

**Deckt ab:** Punkte 1 und 2 sowie Teile von Punkt 6.  
**Außenwirkung:** neues Identitäts-/Hostingkonto oder neue Infrastruktur erst nach separater Freigabe.  
**Kann vorab lokal spezifiziert werden:** ja.  
**Kann ohne Founderentscheidung produktiv implementiert werden:** nein.

### Verbindliche Architekturprinzipien

- Organisation beziehungsweise Arbeitgeber ist der Tenant, nicht der einzelne Nutzer;
- ein Nutzer kann nur über explizite Mitgliedschaften auf einen Tenant zugreifen;
- AMAVIO-interne Rollen und Arbeitgeberrollen bleiben getrennt;
- Autorisierung wird serverseitig erzwungen und nie aus UI-Sichtbarkeit abgeleitet;
- jede Datenabfrage benötigt Tenant-Kontext plus überprüfte Berechtigung;
- privilegierte Aktionen benötigen Step-up beziehungsweise erneute Bestätigung;
- Service Accounts, Hintergrundjobs und Integrationen erhalten eigene Identitäten;
- Audit protokolliert Actor, Tenant, Aktion, Zweck, Ergebnis und Korrelations-ID;
- produktive Sessions, Tokens und Secrets werden niemals in Projektdateien gespeichert.

### Vorgeschlagene Rollenbasis

| Rolle | Zweck | Darf nicht |
|---|---|---|
| `amavio_operations` | mandatsbezogene operative Fallarbeit | globale Plattformadministration |
| `amavio_supervisor` | Freigaben, Eskalationen, Qualitätsreview | technische Secrets verwalten |
| `employer_sponsor` | Überblick und benannte Entscheidungen | interne AMAVIO-Notizen sehen |
| `employer_hr` | HR-bezogene Aufgaben und Evidenz | andere Arbeitgebermandanten sehen |
| `employer_site` | Standortaufgaben und Übergaben | Personal- oder Vertragsdaten außerhalb Scope sehen |
| `employer_budget` | freigegebene Kosten-/Optionssicht | operative Personendetails ohne Zweck sehen |
| `auditor_readonly` | revisionssichere Lesesicht | Änderungen ausführen |
| `integration_service` | exakt definierter Datenaustausch | interaktive Anmeldung oder freie Abfragen |

### Vor einer Anbieterwahl benötigte Founderentscheidungen

1. verwalteter Identity Provider oder selbst betriebener Provider;
2. EU-Region und gewünschte Datenresidenz;
3. B2B-Organisationen, Einladungen, MFA und später gegebenenfalls SSO;
4. Sessiondauer, Step-up, Recovery und Supportprozess;
5. Rollenmatrix und Genehmigungsgrenzen;
6. Staging-/Produktionsumgebung und Budgetkorridor.

### Exit-Kriterien

- Threat Model und Datenflussdiagramm abgenommen;
- Tenant-Isolation serverseitig und auf Datenbankebene getestet;
- Rollen-/Rechtematrix mit Negativtests vollständig;
- MFA, Recovery, Session Revocation und Audit nachgewiesen;
- keine Demo-Session-Header mehr in der produktiven Route;
- externe Securityprüfung für den freizugebenden Umfang geplant beziehungsweise abgeschlossen.

## 4. Gate 03A – Real Data Contracts and Integration Fabric

**Deckt ab:** Punkte 4 und 5.  
**Außenwirkung:** reale Datenübertragung oder Connector-Schreibzugriff nur nach separater Freigabe.

### Reihenfolge

1. zuerst kanonische AMAVIO-Datenverträge;
2. dann eine lesende Sandbox-Quelle;
3. danach genau ein schreibender Sandbox-Kanal;
4. erst nach Messung und Rückfalltest weitere Systeme.

### Datenverträge

Für jede Quelle müssen dokumentiert werden:

- Zweck und Rechtsgrundlage;
- verantwortliche Organisation und Datenowner;
- erlaubte Felder und ausdrücklich ausgeschlossene Felder;
- Identifikatoren und Matchingregel;
- Aktualisierungsfrequenz und Lösch-/Aufbewahrungsfrist;
- Datenqualitätsregeln und Konfliktauflösung;
- Herkunft, Zeitstempel und Einwilligungs-/Vertragsstatus;
- Fehlerqueue, Retry, Dead-Letter und manueller Recovery-Pfad.

### Connector-Architektur

Jeder Connector besitzt:

- eigenes Adaptermodul;
- minimale Berechtigungen;
- getrennte Staging-Zugangsdaten;
- Schema- und Mappingversion;
- Idempotency-Key und Korrelations-ID;
- Dry-run und read-only Modus;
- Quarantäne für ungültige Datensätze;
- vollständigen Audit Trail;
- Kill Switch und Rollback;
- Kosten-, Rate- und Volumenlimit.

### Empfohlene Sequenz der Integrationsklassen

1. Dateiimport in Quarantäne, ausschließlich synthetische Testdateien;
2. CRM read-only Sandbox;
3. getrennte App-Signal-Sandbox mit minimierten Ereignissen;
4. HRIS read-only Sandbox;
5. Messaging-Sandbox ohne reale Empfänger;
6. Buchungs-Sandbox ohne Reservierung oder Zahlung.

Welche konkrete Quelle und welcher konkrete Anbieter zuerst verwendet werden, bleibt eine Founderentscheidung. Die Existenz älterer Connector-Notizen ist kein aktueller Authentifizierungs- oder Produktionsnachweis.

## 5. Gate 03B – Privacy, Security, Hosting and Operations Evidence

**Deckt ab:** Punkt 6.  
**Erfordert:** Datenschutz-, Security-, Hosting-, Vertrags- und Betriebsentscheidungen.

### Nachweispaket

- Dateninventar und Datenflussdiagramm;
- Rollen von Verantwortlichem, Auftragsverarbeiter und Unterauftragnehmern;
- AVV/DPA, TOMs, Subprocessor-Liste und Transfermechanismus;
- Rechtsgrundlagen-, Zweckbindungs- und Löschkonzept;
- DSFA-Screening und gegebenenfalls DSFA;
- Verschlüsselung in Transit und at rest;
- Secret Management und Key Rotation;
- Backup, Restore, RPO, RTO und Disaster-Recovery-Test;
- Logging, Monitoring, Alerting und Incident-Response-Runbook;
- Vulnerability-, Dependency- und Patchprozess;
- Penetrationstest-Scope;
- Verfügbarkeits-, Support- und Eskalationsmodell;
- Hostingregion, Datenresidenz, Kostenlimit und Exit-/Portabilitätsplan.

Dieses Paket ist ein Nachweis- und Prüfgegenstand. Es darf nicht durch Marketingformulierungen wie „DSGVO-konform“ ersetzt werden.

## 6. Gate 04A – Moderated Usability Validation

**Deckt ab:** Punkt 7.  
**Zulässige erste Stufe:** kontrollierter Test mit synthetischen Fällen.

Dieses Validierungspaket wird operativ direkt nach Gate 02A vorgezogen. Die Bezeichnung `04A` beschreibt die externe Validierungsart, nicht die zeitliche Reihenfolge. So können Verständnis- und Workflowprobleme vor teurer Identity-, Hosting- oder Integrationsarbeit korrigiert werden.

### Testdesign

- 5–8 Teilnehmende über mindestens zwei relevante Rollen;
- schriftlich freigegebener Scope;
- ausschließlich synthetische Fälle und Demoidentitäten;
- keine Aufzeichnung ohne gesonderte Einwilligung;
- sechs Kernaufgaben mit Erfolgs-, Zeit- und Verständnismaß;
- Beobachtungsbogen statt verkaufsorientierter Moderation;
- Schweregradklassifizierung für Befunde;
- keine Kunden-, Pilot- oder Marktvalidierungsbehauptung aus einem Usability-Test;
- externe Einladung und Terminierung bleiben ein separates Founder-Gate.

### Kernaufgaben

1. Blockade und kritische Abhängigkeit erkennen;
2. Evidenzkonflikt erklären;
3. nächste Verantwortung bestimmen;
4. Simulation ohne versehentliche Übernahme ausführen;
5. menschlich geprüfte Entscheidung dokumentieren;
6. Arbeitsprodukt finden und Wirkungsgrenze verstehen.

## 7. Gate 04B – Controlled Live Provider Test

**Deckt ab:** Punkt 8.  
**Voraussetzung:** Gate 02A abgeschlossen; Capability-Vertrag und Evaluationsbaseline bleiben verbindlich.

Dieser kleine synthetische Sandboxtest kann nach der moderierten Nutzervalidierung und vor realen Datenintegrationen stattfinden. Er öffnet weder produktive Identity noch reale Datenquellen.

### Testgrenze

- genau ein Provider;
- genau ein Modell;
- genau eine oder höchstens zwei Capabilities;
- ausschließlich synthetische Inputs;
- keine Produktivdaten und keine Außenwirkung;
- feste maximale Zahl an Läufen;
- hartes Budget- und Rate-Limit;
- Logging ohne Secrets und ohne unnötige Promptdaten;
- lokaler Fallback bleibt aktiv;
- sofortiger Kill Switch;
- menschliche Prüfung jeder Ausgabe.

### Messung

Der Live-Test darf nur fortgesetzt werden, wenn das Modell gegenüber der lokalen Baseline einen vorher definierten Mehrwert zeigt, beispielsweise:

- höhere Evidenztreue;
- verständlichere Konflikterklärung;
- bessere Vollständigkeit des Arbeitsproduktentwurfs;
- keine zusätzlichen verbotenen Aktionen;
- akzeptable Latenz und prognostizierbare Kosten.

Provider, Modell, Konto, Region, Retention/ZDR, Training, DPA, Budget und Zahl der Läufe benötigen eine neue ausdrückliche Founder-Freigabe.

## 8. Founder-Entscheidungen vor externer Umsetzung

Vor dem ersten Produktiv- oder Live-Schritt werden neun Entscheidungen benötigt:

1. Identity-Modell: managed oder self-hosted;
2. Hostingregion und Stagingziel;
3. Tenantmodell und Rollenmatrix;
4. erste reale Datenquelle;
5. erster Connector und read-only/write Umfang;
6. Datenschutz-/Security-Prüfverantwortung;
7. Usability-Teilnehmerkreis und Einladungsfreigabe;
8. AI-Provider, Modell und Capability;
9. maximales Einmal- und Monatsbudget.

Bis dahin dürfen nur lokale Architektur-, Test-, Vertrags- und synthetische Sandbox-Arbeiten erfolgen.
