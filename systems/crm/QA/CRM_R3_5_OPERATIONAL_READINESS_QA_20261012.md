# QA – R3.5 Operational Conversion & Outreach Readiness

**Datum:** 12.10.2026  
**Arbeitskopie:** `20261012_AMAVIO_One_CRM_R3_5_Operational_Readiness_Working`  
**Prüfstatus:** bestanden – lokal und ausschließlich synthetisch; nicht produktiv freigegeben.

## Prüfumfang

- Schutz und Isolation gegenüber R3.4;
- Kontaktentscheidung mit offenen, vollständigen und gesperrten Zuständen;
- Outreach-Preflight und unveränderliche produktive Versandsperre;
- Aufgabenconversion mit Beziehung, Audit und Dublettenschutz;
- Vorbereitung der drei getrennten Folgetore;
- Build, statisches QA-Gate, Unit-, Vertrags-, Komponenten-, Integrations-, Persistenz- und End-to-End-Tests;
- Browserkonsole, Tastatur, Escape, Focus-Trap und Focus-Rückgabe;
- 1600, 1280, 1024, 768, 430 und 390 Pixel;
- echter 200-%-Zoom im isolierten Chrome-Profil;
- ausschließlich synthetische Daten und `.invalid`-Adressen.

## Ergebnisse

- Build erfolgreich.
- 22 Unit-Tests, 9 Vertragstests, 5 Komponententests und 4 Integrationstests erfolgreich.
- 1 Persistenztest erfolgreich: SQLite, Speichern, Snapshot/Export, Reset, Restore und synthetische Importgrenze.
- 20 zusammenhängende End-to-End-Pfade erfolgreich, einschließlich R3.5-Aufgabenconversion.
- Browserkonsole im E2E- und Responsive-Lauf ohne Fehler.
- 1600, 1280, 1024, 768, 430 und 390 Pixel ohne horizontalen Seitenüberlauf.
- Tastatur, Skip-Link, `Strg/⌘ K`, Escape, Focus-Trap und Focus-Rückgabe erfolgreich.
- echter 200-%-Zoom: 1280 Pixel Außenbreite reflowt auf 640 CSS-Pixel ohne horizontalen Seitenüberlauf.
- aktuelle Screenshots unter `QA/Screenshots/20261012-r3-5/`; Ergebnisdatei `QA/CRM_R3_5_BROWSER_RESULT_20261012.json`.
- Kontaktentscheidung macht fehlende Nachweise sichtbar und behauptet keine Rechtmäßigkeit.
- Suppression erzeugt eine harte Sperre.
- Auch ein vollständig dokumentierter Kontakt bleibt nur lokal vorbereitet.
- Aufgabenconversion wird bei gleichem `readinessKey` abgewiesen.
- Provider- und Außenwege bleiben technisch deaktiviert.

## Visuelle Prüfung

Die aktuellen Desktop- und Mobile-Screenshots wurden gegen das akzeptierte R3.4-Konzept geprüft. Typografie, Navy-/Creme-/Gold-System, offene Editorial-Flächen, Founder-Fokus-Hierarchie und Systemgrenzen bleiben erhalten. R3.5 ist als klar getrennte Arbeitsfläche zwischen Entscheidungsmodulen und Relationship-/Aging-Auswertung eingefügt. Auf schmalen Breiten stapeln Kontaktentscheidung, Preflight, Aufgaben und Gate-Status in derselben Informationsreihenfolge. Beim echten 200-%-Zoom ist die Oberfläche lang, aber ohne Seitenüberlauf; die feste Mobilnavigation bleibt erreichbar.

## Restgrenzen

Es wurde kein externer Screenreader-/WCAG-Audit durchgeführt. Der lokale Nachweis umfasst Semantik, benannte Schaltflächen, Fokusverhalten, Tastaturweg, Reduced Motion, Responsive-Reflow und Browserkonsole. Ein erfolgreicher Abschluss ändert den Reifegrad nicht und erteilt keine produktive, rechtliche, datenschutzrechtliche oder sicherheitsbezogene Freigabe.
