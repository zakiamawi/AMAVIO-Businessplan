# AMAVIO ACC Release L.1 – Web Fidelity QA

**Datum:** 13.10.2026  
**Arbeitskopie:** `20261013_AMAVIO_ACC_Release_L1_Web_Fidelity_Working`  
**Lokaler Einstieg:** `http://127.0.0.1:4211/?page=cases`  
**Reifegrad:** lokale synthetische Konzeptdemo; nicht veröffentlicht und nicht produktiv

## Founder-Befund

Die visuelle Richtung der Release-K/L-Referenzbilder wurde positiv bestätigt. In der tatsächlich geöffneten Web-Version war auf `?page=cases` jedoch noch die ältere, schlichte Tabellenansicht aktiv. Zusätzlich wurde die allgemeine Informationsdichte als zu hoch bewertet.

## Ursache

- Programmraum und Planungsentscheidung verwendeten bereits das neue editoriale Layoutsystem.
- Die Fallübersicht stammte noch aus der älteren Calm-Capable-Basis.
- Ein Klick auf einen Tabellenfall öffnete unmittelbar die vollständige Arbeitsfläche. Zwischen Portfolioübersicht und tiefer Fallarbeit fehlte eine verständliche Zwischenebene.

## Umgesetzt

- alte Falltabelle durch eine editoriale Fallzentrale ersetzt;
- Portfolio-Kopf mit vier bewusst begrenzten Kennzahlen ergänzt;
- priorisierte Arbeitsliste links und fokussierte Fallvorschau rechts umgesetzt;
- Suchfunktion, Fallauswahl und URL-Kontext erhalten;
- bewusste Aktion „Fall öffnen“ vor der vollständigen Arbeitsreise ergänzt;
- fachliche Tiefe nicht entfernt, sondern progressiv offengelegt;
- Desktop-, Tablet- und Mobile-Raster definiert;
- alte Release-L-Arbeitskopie unverändert auf Port 4210 erhalten.

## Fidelity-Ledger

| Vergleichspunkt | Referenz | vorherige Web-Version | Release L.1 |
|---|---|---|---|
| Einstiegshierarchie | großzügiger Editorial-Header | kleiner Standardtitel plus Suche | Editorial-Header plus klarer Arbeitsrahmen |
| Informationsdichte | wenige Kennzahlen vor der Arbeitsfläche | flache Tabelle ohne Orientierung | vier Kennzahlen, danach Master/Detail |
| Containerlogik | Rail, Canvas und klare Linien | isolierte Tabellenzeilen | Arbeitsliste plus offene Detailfläche |
| Fallauswahl | aktive Auswahl sichtbar | sofortiger Sprung in Vollansicht | Auswahl bleibt sichtbar, Vorschau aktualisiert sich |
| progressive Offenlegung | Hauptaufgabe zuerst | Portfolio und Tiefe nicht verbunden | Portfolio → Auswahl → Vorschau → Fallarbeit |
| Typografie | Fraunces für redaktionelle Hierarchie, Geist für Bedienung | Basistitel und Mikro-Tabelle | gleiche Fraunces-/Geist-Hierarchie wie K/L |
| Farb- und Flächensystem | Weiß, Navy, Gold und ruhige Cream-Rails | überwiegend weiß, geringe Differenzierung | weißes Canvas, ruhige Rail und Gold-Fokus |
| Mobile | bewusste Einspaltenfortsetzung | komprimierte Tabellenzeile | Einspaltenreise mit vollständig lesbaren Texten |

## Berührte Dateien

- `index.html`
- `assets/calm-capable-v2.js`
- `assets/release-l1.css`
- `backend/server.mjs` – ausschließlich neuer lokaler Standardport und Release-Logtext
- `package.json`
- `QA/static-check.js`
- `QA/release-l1-static-check.js`
- `README.md`
- `CHANGELOG.md`
- `BACKLOG.md`

## Unverändert

- Release-L-Intelligence-Kernel und alle drei Capabilities;
- Evidence Graph, Policy Engine, Evaluation Harness und Human Gate;
- Program Delivery, Arbeitgeberprojektionen und Collaboration;
- bestehende Rollen-, Mandanten-, Idempotenz- und Failure-Injection-Logik;
- produktive Architektur-Gates;
- Release-L-Ausgangskopie auf Port 4210.

## Prüfungen

| Prüfung | Ergebnis |
|---|---:|
| Node-Testmatrix | 274 bestanden, 0 fehlgeschlagen |
| API-Routenmatrix | 70 Routen weiterhin abgedeckt |
| Static QA | bestanden |
| Release-L.1-Struktur-/Interaktionsvertrag | bestanden |
| Brandbook-QA | bestanden |
| JavaScript-Syntax | bestanden |
| HTML auf Port 4211 | HTTP 200 |
| Release-L.1-CSS auf Port 4211 | HTTP 200 |
| Health-Endpunkt | `status: ok` |
| Provideraufrufe | 0 |
| externe Wirkung | keine |

## Browsergrenze

Die eingebaute Browsersteuerung war in dieser Sitzung grundsätzlich vorhanden, blockierte jedoch die Bindung an die lokale `http://127.0.0.1:4210`-Ansicht durch ihre Browser-Sicherheitsrichtlinie. Die Richtlinie untersagte ausdrücklich, denselben Zugriff über einen alternativen Browserweg zu umgehen. Deshalb wurde keine Playwright- oder CDP-Ersatzsteuerung gestartet.

Die vorhandenen Release-K/L-Referenzbilder wurden mit `view_image` geprüft und als visuelle Designquelle verwendet. Eine neue gerenderte L.1-Screenshotabnahme bleibt bewusst der Founder-Sichtprüfung auf Port 4211 vorbehalten.

## Offene Abnahme

1. Wirkt die Fallzentrale auf dem ersten Bildschirm genauso hochwertig wie Programmraum und Planungsentscheidung?
2. Ist die Trennung zwischen Auswahl links und Vorschau rechts ohne Erklärung verständlich?
3. Fühlt sich die Seite deutlich weniger überladen an, obwohl der Funktionsumfang erhalten blieb?
4. Ist der Übergang über „Fall öffnen“ in die vollständige Fallarbeit selbstverständlich?
5. Bleibt die Mobile-Ansicht vollständig lesbar und ohne Enge?

## Grenzen

Keine echten Personen-, Arbeitgeber-, Objekt- oder Partnerdaten. Keine produktive Registrierung, Identity, Authentifizierung, Mandantentrennung, externe KI, CRM-/HRIS-/App-/Messaging-/Buchungsintegration, Veröffentlichung oder Deployment. Keine Providerkosten.
