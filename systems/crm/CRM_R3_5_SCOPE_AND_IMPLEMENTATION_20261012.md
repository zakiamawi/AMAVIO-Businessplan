# AMAVIO One CRM – R3.5 Operational Conversion & Outreach Readiness

**Stand:** 12.10.2026  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Ziel

R3.5 verbindet die in R3.3 vorbereitete Research-/Outreach-Fachlogik mit dem in R3.4 eingeführten Founder Decision Cockpit. Der Block beantwortet nicht pauschal, ob eine reale Kontaktaufnahme rechtmäßig ist. Er macht stattdessen sichtbar, welche lokalen fachlichen Nachweise vorhanden sind, welche fehlen, ob eine harte Sperre besteht und welcher nächste interne Arbeitsschritt erforderlich ist.

## Umgesetzt

- kontaktbezogene Sicht „Darf kontaktiert werden?“ mit den Zuständen `blocked`, `review_required` und `locally_ready`;
- kombinierter Outreach-Preflight aus Kontaktstatus, Sperrliste, Kontakt-/Rechtsstatus, Herkunft, Aktualität, Informationsstatus, Entwurf, Kanalprüfnotiz und menschlicher lokaler Freigabe;
- aus dem lokalen Zustand abgeleitete Operational-Readiness-Signale;
- kontrollierte Umwandlung eines Signals in eine verknüpfte lokale Aufgabe mit stabilem `readinessKey` und Dublettenschutz;
- sichtbare Vorbereitung der getrennten späteren Gates Reale Daten, Einzelversand und Live Research;
- isolierter Speicherstand `amavio-one-crm-r3-5-operational-readiness-v5` und lokale SQLite-Datei `amavio-one-crm-r3-5.sqlite`;
- Unit-, Komponenten-, Integrations-, E2E-, Persistenz-, Responsive-, Tastatur-, Zoom- und Konsolenprüfung.

## Erhalten

Alle R3.4-Funktionen, das AMAVIO Designsystem, Founder Focus, Decision Brief, Pipeline Movement, Aging Strip, Relationship Field, Datenvertrauen, Research-/Outreach-Arbeitsfläche, synthetische Seeds, lokale CRUD-Operationen, Archiv/Restore und der getrennte ACC-Prüfmarker bleiben erhalten. R3.4 und die Sicherung vor R3.5 wurden nicht überschrieben.

## Nicht umgesetzt

Kein realer Kontakt, keine rechtliche Einzelfallfreigabe, keine reale personenbezogene Information, kein E-Mail-Versand, kein Massenversand, kein Live-Scraping, kein Zugriff auf geschützte Plattformen, kein Provider-Login, kein Connector, keine externe KI, kein Mehrbenutzerbetrieb, kein Hosting, kein Deployment und keine App-/ACC-Integration. Ein Status `locally_ready` bedeutet ausschließlich, dass die lokale Dokumentationsprüfung vollständig ist; er ist keine Versand- oder Rechtsfreigabe.

## Schutz des Ausgangsstands

- Ausgang: `20261010_AMAVIO_One_CRM_R3_4_Founder_Decision_Working`
- Vollständige Sicherung: `20261012_AMAVIO_One_CRM_R3_4_Sicherung_Pre_R3_5`
- Arbeitskopie: `20261012_AMAVIO_One_CRM_R3_5_Operational_Readiness_Working`

Die Konfigurationsdateien `package.json`, `package-lock.json` und `vite.config.js` wurden vor der R3.5-Anpassung zusätzlich unter `QA/` gesichert.
