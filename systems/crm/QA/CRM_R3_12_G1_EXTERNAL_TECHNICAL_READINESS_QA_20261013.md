# R3.12 – G1 External & Technical Readiness QA

**Datum:** 13.10.2026  
**Prüfobjekt:** R3.12-Arbeitskopie  
**Status:** vollständig bestanden im lokalen synthetischen Scope; nicht produktiv freigegeben

## Ausgeführter Abschlussnachweis

- Build: bestanden, 1.603 Module transformiert.
- Statisches QA-Gate: bestanden; keine aktive externe Browserverbindung, Produktgrenzen und Pflichtdokumente bestätigt.
- Unit-Tests: 33/33 bestanden.
- Vertragstests: 11/11 bestanden.
- Komponententests: 10/10 bestanden.
- Integrationstests: 6/6 bestanden.
- Persistenztest: 1/1 bestanden; umfasst Sicherheitsheader, Cross-Site-403, SQLite, Backup, Export, Reset, Restore, synthetischen Importvertrag sowie `0700`/`0600`.
- End-to-End: 20 zusammenhängende synthetische Kernabläufe bestanden; Persistenz, Archiv/Wiederherstellung und Reset bestanden; Browserkonsole ohne Fehler.
- Browsermatrix: 1600, 1280, 1024, 768, 430 und 390 Pixel ohne Seiten-Overflow; je sechs Arbeitsflächen geprüft.
- Accessibility/Interaktion: Skip-Link, `⌘/Strg K`, Escape, Focus-Trap und Focus-Rückgabe bestanden.
- echter 200-%-Zoom: 1.280 px Außenbreite reflowt auf 640 CSS-Pixel; Bodybreite und Scrollbreite jeweils 640 px.
- Browserkonsole: 0 Fehler.
- visuelle Evidenz: 61 Screenshots in `QA/Screenshots/20261013-r3-12-g1-external-technical-readiness`.
- Ergebnisdatei: `QA/CRM_R3_12_G1_EXTERNAL_TECHNICAL_READINESS_BROWSER_RESULT_20261013.json`.

## Laufender lokaler Abschlusszustand

Der geprüfte R3.12-Server läuft auf `http://127.0.0.1:4391/`. `/api/health` meldet `schemaVersion: 7`, `syntheticOnly: true`, `outboundEnabled: false` und `localHardeningVersion: 1.0`. Die Header wurden am laufenden Server erneut beobachtet. Daten- und Exportordner besitzen `0700`, SQLite-, WAL- und SHM-Dateien `0600`. Eine absichtlich fremde ändernde Anfrage wurde mit HTTP 403 abgewiesen. Dieser Laufzustand ist lokal und flüchtig; er ist kein Deployment.

Ein zusätzlicher Chromium-Smoke-Test direkt gegen diesen Produktions-Build lieferte HTTP 200, den Titel `AMAVIO One · CRM Cockpit`, eine Seitenbreite von 1.280 px bei 1.280-px-Viewport und 0 Konsolen-/Page-Fehler. Dynamische Diagrammstyles bleiben durch eine eng auf Style-Attribute begrenzte CSP-Regel funktionsfähig; externe Script- und Connect-Ziele bleiben ausgeschlossen.

## Sicherheits- und Wahrheitsprüfung

Die QA bestätigt, dass alle Produktivflags aus bleiben und keine externe URL im aktiven Browsercode angesprochen wird. Erfolgreiche lokale Tests schließen G1-03, G1-06, G1-10 oder C1 nicht. Die macOS-Firewall bleibt ein beobachteter Blocker; FileVault und Sperrzeit bleiben nicht verifiziert. Authentifizierung, Autorisierung und Sitzungsschutz bleiben nicht implementiert.

## Abweichungen und Auflösung

Der erste Chromium-Start wurde von der macOS-Mach-Port-Sandbox abgewiesen; derselbe lokale Test lief nach der ausdrücklich erlaubten Ausführung außerhalb dieser Sandbox. Danach zeigte ein veralteter E2E-Selektor noch die R3.11-Überschrift. Der Selektor wurde an die sichtbare R3.12-Überschrift angepasst und das Zugriffsschutzregister zusätzlich auf exakt 13 Einträge sowie den sichtbaren Geräteblocker geprüft. Der vollständige Wiederholungslauf endete mit Exit-Code 0.

## Abschlusskriterium

Der Abschlusslauf ist fehlerfrei. Die zulässige Aussage lautet ausschließlich: **„Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben.“** Es wird keine Produktions-, Rechts-, Datenschutz- oder Security-Freigabe behauptet.
