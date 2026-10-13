# AMAVIO One CRM – Kurzfristige Capability-Roadmap nach R3.3

**Stand:** 10.10.2026  
**Product-Owner-Priorität:** produktiver Versand, Automation, erlaubte Research-Quellen, Connectoren, Mehrbenutzerbetrieb, Mandantenfähigkeit und spätere App-/ACC-Verträge sind kurzfristig wichtig. Die Reihenfolge darf die lokale R3.3-Grundlage nicht zerstören.

## Leitentscheidung

Die acht genannten Fähigkeiten werden nicht mehr als dauerhaft „nicht gewollt“ behandelt. Sie sind priorisierte Folgefähigkeiten mit getrennten Freigaben. Eine Ausnahme gilt für die Umgehung von Login, CAPTCHA, Paywall oder Zugriffsschutz: Diese wird nicht umgesetzt. Geschützte Plattformen dürfen nur über erlaubte APIs, lizenzierte Exporte, vorhandene Nutzerfunktionen oder ausdrückliche Anbieterfreigaben angebunden werden.

## Folgeblöcke

| Block | Fähigkeit | Voraussetzung | Ergebnis |
|---|---|---|---|
| G1 Real-Data Readiness | kontrollierte interne AMAVIO-Kontakte | Geräte-/Backup-/Lifecycle-/Privacy-Gate | begrenzter operativer Datenbestand |
| G2 Provider Adapter | Brevo zuerst; Gmail nur für normale Einzelkommunikation; Apollo/Airtable optional | aktueller Vertrag, DPA/AV, Kosten, Auth, DNS, Testkonto | austauschbarer Adapter, noch ohne Automation |
| G3 Controlled Productive Send | freigegebene Einzel-/Kampagnenversände | Kontaktgrundlage, Art.-14-/Widerspruchsprozess, Suppression, SPF/DKIM/DMARC, Testversand | produktiver Versand mit Audit und Kill-Switch |
| G4 Sequencing & Automation | automatische Sequenzen und begrenzte Mengen | G3 stabil, Rate Limits, Bounce-/Complaint-Stop, Human Gate, Monitoring | kontrollierte Automation, kein ungebremster Massenversand |
| G5 Licensed Live Research | öffentliche Seiten, Anbieter-APIs und lizenzierte Datenquellen | Quellenbedingungen, Robots/Rate Limits, Datenminimierung, Kostenlimit | aktualisierbare Research-Queue |
| G6 Multi-User | interne zusätzliche Nutzer | zentrale Datenhaltung, Auth/MFA, Rollen, Session-/Audit-Vertrag | sicherer Teamzugang |
| G7 Workspace Isolation | getrennte interne Bereiche/Mandanten nur bei echtem Bedarf | G6 geprüft, Datenisolation, RLS/Autorisierung, Tests | Mandantenfähigkeit ohne Vermischung |
| G8 ACC/App Contracts | kontrollierte Übergaben | separate Codebasen, versionierte APIs/Events, Datenschutz- und Fachfreigabe | minimale, widerrufbare Integration |

## 1. Produktiver Versand

Kurzfristig planbar, aber erst nach G1/G2. Mindestanforderungen: aktive Providerfreigabe, dokumentierte Kontaktgrundlage, Sperrlistenabgleich, Abmeldeweg, Bounce-/Complaint-Verarbeitung, Domain-Authentisierung, Testempfänger, Tageslimit, Kostenlimit, Audit und sofortiger Kill-Switch. Die aktuelle UWG-/DSGVO-Bewertung ist vor Go-live qualifiziert zu prüfen.

## 2. Automatischer Massenversand

Technisch erst nach einem stabilen kontrollierten Einzelversand. „Massenversand“ wird als begrenzte, segmentierte Kampagne mit Zustell- und Beschwerdeüberwachung verstanden, nicht als unkontrolliertes Cold-Email-Blasting. Standard: Human Gate vor Aktivierung jeder Sequenz, Stop bei Abmeldung/Bounce/Beschwerde und harte Tages-/Monatsgrenzen.

## 3. Live-Scraping geschützter Plattformen

Wenn eine Plattform geschützt ist, wird nicht gegen den Schutz gescrapt. Stattdessen: offizielle API, lizenzierter Datenanbieter, Exportfunktion, Webhook, CSV-Übergabe oder manuelle Recherche. Für öffentliche Seiten kann ein regelkonformer Collector später Seiten abrufen, wenn Nutzungsbedingungen, robots.txt, Rate Limits, Urheber-/Datenbankrechte und Personenbezug geprüft sind.

## 4. Umgehung von Schutzmaßnahmen

Nicht umsetzbar. Keine Login-Übernahme, keine CAPTCHA-Lösung, kein Paywall-Bypass, keine Session-/Cookie-Wiederverwendung außerhalb des vorgesehenen Produkts und keine technische Umgehung von Zugriffsbeschränkungen. Diese Grenze schützt AMAVIO vor Konto-, Rechts-, Sicherheits- und Reputationsrisiken.

## 5. Produktive Connectoren

Jeder Connector erhält einen eigenen Adapter und ein eigenes Aktivierungsgate. Reihenfolge: Brevo für Kampagnen/Transaktion, Google Workspace für normale Geschäftskommunikation und Kalender, Apollo nur für explizit freigegebene Credits/Quellen, Airtable nur als Migrations- oder Austauschquelle. Kein Connector wird zweites führendes CRM.

## 6. Mehrbenutzerbetrieb

Benötigt zentrale Datenhaltung, Identität, MFA, Rollen, autorisierte API, Audit, Backup/Restore und Sessionmanagement. Ein bloßes Öffnen des lokalen Servers im Netzwerk ist ausdrücklich kein zulässiger Mehrbenutzerbetrieb.

## 7. Mandantenfähigkeit

Für das interne AMAVIO-System ist Mandantenfähigkeit nicht sofort notwendig. Wenn getrennte interne Geschäftsbereiche oder spätere rechtliche Einheiten einen echten Bedarf erzeugen, folgt sie erst nach geprüftem Mehrbenutzerbetrieb. Jede Datenabfrage muss dann die Workspace-Grenze serverseitig erzwingen und negativ testen.

## 8. App-/ACC-Integration

CRM, App und ACC bleiben getrennte Produkte und Codebasen. Integration erfolgt nur über minimale versionierte Verträge: Referenz-IDs, klarer Zweck, Datenminimierung, Freigabestatus, Wiederholungsschutz und Audit. Kein direkter gemeinsamer Datenbankzugriff.

## Kein stiller Gesamt-Go-live

Die kurzfristige Priorität ist ein Roadmap-Beschluss, kein pauschaler Produktionsbeschluss. Jeder Block benötigt eigene Testdaten, Akzeptanzkriterien, Rückfallweg und ausdrückliche Aktivierung. Dadurch bleibt R3.3 stabil und jede neue Außenwirkung kann einzeln abgeschaltet werden.
