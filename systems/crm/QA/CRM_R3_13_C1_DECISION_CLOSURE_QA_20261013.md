# R3.13 – C1 Decision Closure QA

**Datum:** 13.10.2026  
**Status:** lokal vollständig geprüft; alle ausgeführten technischen Prüfungen Exit-Code 0  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Zu prüfender Umfang

- PO-CRM-045 ist im Seed, in der Migration, im Governance-Vertrag und in der sichtbaren Oberfläche konsistent.
- Zaki Amawi ist technischer Betreiber; Van Vardanian ist als Vertretung benannt, aber noch nicht operativ bestätigt.
- Security Review sowie eindeutige Provider-/Regionsfreigabe bleiben sichtbar offen.
- Budgetrahmen 50–100 EUR brutto/Monat mit harter Planungsobergrenze 100 EUR; kein Kauf.
- C1 bleibt ausschließlich synthetisch und nicht autorisiert.
- acht lokale Schutzgrenzen sind testbar; der Firewall-Nachweiswiderspruch bleibt sichtbar.
- alle früheren CRM-Core-Abläufe bleiben regressionsfrei.

## Ausgeführte Abschlussmatrix

| Prüfbereich | Befehl beziehungsweise Evidenz | Ergebnis |
|---|---|---|
| Build | `npm run build` als Bestandteil von `npm run qa:full` | bestanden |
| Statisches QA-Gate | `npm run qa` als Bestandteil von `npm run qa:full` | bestanden |
| Unit-Tests | 33 von 33 | bestanden |
| Vertragstests | 11 von 11 | bestanden |
| Komponententests | 10 von 10 | bestanden |
| Integrationstests | 6 von 6 | bestanden |
| Persistenz | 1 von 1 | bestanden |
| E2E | 20 zusammenhängende lokale Kernabläufe | bestanden |
| Browserkonsole | E2E und Browser-QA | ohne Fehler |
| Responsive | 1600, 1280, 1024, 768, 430 und 390 Pixel | kein Seiten-Overflow |
| Arbeitsflächen | Arbeitstag, Cockpit, Pipeline, Kontaktfreigabe, Auswertungen und System/Freigaben | geprüft |
| Tastatur/Dialog | Escape, Focus-Trap und Focus-Rückgabe | bestanden |
| Zoom | echter 200-Prozent-Zoom | bestanden |
| Visuelle Evidenz | `QA/Screenshots/20261013-r3-13-c1-decision-closure/` | 61 Screenshots |

## Funktions- und Governance-Nachweis

- PO-CRM-045 ist im Seed, in der Migrationsausrichtung, im Governance-Vertrag und im sichtbaren C1-Entscheidungsprotokoll konsistent.
- Der C1-Teilbeschluss wird als `partial_decision_recorded` ausgewiesen; `c1ImplementationAuthorized` bleibt `false`.
- Die Oberfläche weist Zaki Amawi als technischen Betreiber und Van Vardanian als benannte, noch nicht operativ bestätigte Vertretung aus.
- Der Budgetkorridor von 50–100 EUR brutto/Monat und die harte Planungsobergrenze von 100 EUR sind als Planung dokumentiert; Kauf und Zusatzkosten sind nicht freigegeben.
- C1 bleibt ausschließlich synthetisch. Es wurden weder Provider-Projekt noch Authentifizierung, produktive Daten, Connectoren, App-/ACC-Anbindung, Versand oder Deployment aktiviert.
- Die nach fünf Minuten greifende Bildschirmsperre mit sofortiger Passwortanforderung ist lokal bestätigt; FileVault wird in den Systemeinstellungen als eingeschaltet angezeigt.
- Die Firewall-Oberfläche zeigt nach Aktivierung und erneutem Öffnen `Aktiv`; das Legacy-CLI meldet weiterhin `State = 0`. Deshalb bleibt die Firewall-Kontrolle als `verification_conflict` offen.

## Live-Nachweis der gebauten lokalen Anwendung

- lokaler Produktionsserver: `http://127.0.0.1:4393/`;
- Health: `ok=true`, `mode=local-sqlite`, `schemaVersion=7`, `syntheticOnly=true`, `outboundEnabled=false`;
- C1-Healthgrenze: `c1DecisionStatus=partial_decision_recorded`, `c1ImplementationAuthorized=false`;
- SQLite-Dateirechte: `-rw-------`;
- simulierter ändernder Request mit fremdem Origin: HTTP `403`;
- Chromium-Smoke-Test der gebauten Ansicht `System & Freigaben → Zugriff & Gerät`: HTTP `200`, C1-Teilbeschluss, Synthetic-only-Grenze und offene Security-/Provider-Gates sichtbar, keine Konsolen- oder Seitenfehler.

Ein erster Diagnose-Smoke zielte irrtümlich auf die Startansicht und erwartete dort den C1-Nachweis. Die Anwendung blieb fehlerfrei; der korrigierte fachliche Pfad wurde anschließend erfolgreich geprüft.

## Offene Eintrittsgates

1. unabhängigen Security Reviewer benennen oder eine ausdrücklich befristete Einpersonen-Ausnahme mit Ablaufdatum und Kompensationsmaßnahmen beschließen;
2. `Supabase / Frankfurt eu-central-1` eindeutig als freigegeben oder nicht freigegeben entscheiden;
3. Annahme, Erreichbarkeit und Übergabeverfahren der benannten Vertretung nachweisen;
4. externe Datenschutz-/Vertragsprüfung durchführen und dokumentieren;
5. den Firewall-Nachweiswiderspruch mit einer für diese macOS-Version belastbaren Prüfung schließen;
6. einen späteren, gesonderten C1-Implementierungsbeschluss fassen.

## Claim-Grenze

Der vollständige lokale Testlauf bestätigt die technische Konsistenz dieser R3.13-Arbeitskopie. Er ist ausdrücklich **keine** C1-Implementierungsfreigabe, G1-Gesamtfreigabe, Rechts-, Datenschutz- oder Security-Freigabe und kein Nachweis für Produktionsreife, Mehrbenutzerfähigkeit, Backendbetrieb oder reale personenbezogene Daten.
