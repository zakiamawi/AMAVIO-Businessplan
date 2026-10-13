# AMAVIO Arrival Control Center – Umsetzungs- und QA-Nachweis

**Datum:** 30.09.2026  
**Status:** lokal geprüft; nicht veröffentlicht, nicht deployt, kein Produktivbetrieb  
**Arbeitsordner:** `10_Control_Center/20260930_AMAVIO_Arrival_Control_Center_Demo_Working/`

## 1. Prüfkontext und Quellen

Führende fachliche Quelle:

- `00_START_HIER/AMAVIO_Zentrale_3_20260929/AMAVIO_One_Product_Truth_V1_Arbeitsmaster_20260930.md`

Geprüfte technische Quellen:

- `08_Website/amavio-living-site/20260930_V17_Product_Truth_A11y_Working/control-center.html`
- `08_Website/amavio-control-center-demo-deploy/index.html`
- zugehörige Website-V17-QA, lokale Assets und Brandbook-Master-Arbeitsfassung.

Technische Basisentscheidung und Delta stehen in `SOURCE_OF_TRUTH_HANDOFF_20260930.md`.

## 2. Rückfallstand und Quellschutz

Die V17-Ausgangsdatei wurde vor den wesentlichen Änderungen unverändert archiviert:

- Quelle SHA-256: `7aefd53fb7091c2b8ccfa6a3f2e5623d281d4f33db4e25431a9e76d1a646fb16`
- Rückfallkopie SHA-256: `7aefd53fb7091c2b8ccfa6a3f2e5623d281d4f33db4e25431a9e76d1a646fb16`

Beide Hashes stimmen überein.

## 3. Berührte und unberührte Bereiche

### Berührt

Ausschließlich neue Dateien unter:

`10_Control_Center/20260930_AMAVIO_Arrival_Control_Center_Demo_Working/`

Insbesondere:

- `index.html`;
- lokale Brand-/Fontassets;
- README, Source-of-Truth/Handoff, Backlog, Changelog;
- fachliche App-/ACC-Grenze und Demo-Gesprächsleitfaden;
- lokale QA-Skripte und Screenshots.

### Unberührt

- Website-V17 einschließlich `control-center.html`;
- ältere ACC-Deploy-Demo;
- separate AMAVIO One App und alle App-Quellen;
- Brandbook-Master und Logoassets an ihrer Quelle;
- Hosting, DNS, Git-Remote, CRM, externe Connectoren und echte Daten.

Die beiden geprüften Website-ACC-Dateien erscheinen im aktuellen Git-Status nicht als von diesem Pass geänderte Dateien; die V17-Quelle ist bereits außerhalb dieses neuen Ordners untracked und wurde per Hash gegen die Rückfallkopie geprüft.

## 4. Umgesetzte Arbeitspakete

### Produktgrenze

- aktive Rollen auf `AMAVIO Operations` und `Arbeitgeber` begrenzt;
- historische Fachkraftansicht aus Navigation und Routing entfernt;
- historischer Markup-Bestand verbleibt nur verborgen und `inert` zur Rückverfolgbarkeit;
- `?view=arbeitnehmer` fällt auf AMAVIO Operations zurück;
- separate App-Grenze sichtbar gemacht.

### Steuerungslogik

- sichtbare Kette `Mandat → Standort → Kohorte → Arrival Case → Risiko → Freigabe → Reporting`;
- mandatsbezogene Verantwortungskarten mit Rolle, nächster Aktion, Termin/Eskalation;
- nächste Verantwortung in jeder geöffneten Fallakte;
- Arbeitgeber-Rollenmatrix als Zielstruktur, ausdrücklich ohne produktive Autorisierungsbehauptung.

### Demo-Wirkungsgrenzen

- Fallanlage als rein lokale Sitzungshandlung bezeichnet;
- Freigabe/Ablehnung als Demo-Markierung ohne System-/Vertragswirkung;
- Export, Einladung, Nachricht und Dateiaktionen ohne echte Außenwirkung;
- reale App-/ACC-, Vertrags- oder Kundendatenanbindung ausdrücklich nicht implementiert;
- keine KI-, Matching-, Scoring- oder Automatisierungsbehauptung.

### Bedienung und Präsentation

- Tastaturalternative für Kanban-Phasenwechsel: `Alt + Pfeil links/rechts`;
- Live-Region meldet lokale Phasenänderung;
- Breakpoint für 1024-Pixel-Darstellung korrigiert;
- intern verbindliche Brandbook-Tokens für Navy, Stage Navy, Cream, Gold/Bronze, Success und Attention übernommen;
- Logoassets nicht verändert;
- 6–8-Minuten-Demo-Journey und App-/ACC-Übergabegrenze dokumentiert.

## 5. Toolstatus

| Werkzeug | Status | Nachweis |
|---|---|---|
| Node.js | installiert, callable, smoke-tested | statische QA, Syntaxprüfung, lokaler HTTP-Server |
| lokales Playwright/Chromium aus Website-Runtime | installiert, callable, smoke-tested | finaler Fünf-Viewport-Lauf erfolgreich |
| Chromium im Standard-Sandboxlauf | callable, zunächst blockiert | macOS `bootstrap_check_in ... Permission denied (1100)` |
| Chromium mit freigegebenem lokalen QA-Lauf | callable, smoke-tested | gleicher Test außerhalb der blockierenden Sandbox erfolgreich |
| Codex In-App-Browser | callable, smoke-tested | AX-/Interaktionsprüfung und leere Warn-/Fehlerkonsole |
| externe Plugins/Connectoren | nicht verwendet | für lokale statische Demo nicht erforderlich |

## 6. Automatisierte QA

### Statische Product-Truth-/Paketprüfung

Ausgeführt:

```text
node QA/static-check.js
```

Ergebnis:

```text
AMAVIO ACC Static QA: OK (2 aktive Rollen, lokale Assets vollständig, keine Netzwerkpfade)
```

Geprüft wurden unter anderem:

- Sprache, Titel, Main-Landmark und Skip-Link;
- `noindex,nofollow,noarchive`;
- sichtbare Reifegrad-, Wirkungs- und App-Grenzen;
- exakt zwei aktive Rollen;
- verborgener/inert markierter historischer Bestand;
- keine externe URL, keine Fetch-/API-/WebSocket-Pfade;
- keine gesperrten produktiven oder KI-Claims;
- lokale Links/Assets;
- Inline-JavaScript-Syntax und CSS-Klammerbilanz;
- Paketpflichtdateien und Rückfallstand.

### Browser-, Responsive- und Interaktions-QA

Ausgeführt gegen `http://127.0.0.1:4191`:

```text
node QA/browser-check.js
```

Finales Ergebnis nach der Founder-/Präsentationskorrektur und dem erweiterten 1280-Pixel-Pass:

```text
desktop-1440: OK
desktop-1280: OK
desktop-1024: OK
tablet-768: OK
mobile-390: OK
mobile-360: OK

AMAVIO ACC Browser QA: OK (6 Viewports × 2 Rollen, Interaktions- und Reduced-Motion-Pass)
```

Geprüft wurden:

- HTTP 200, Titel, H1, lokale Assets und fehlender horizontaler Überlauf;
- genau zwei aktive Rollen und keine sichtbare historische Fachkraftansicht;
- AMAVIO- und Arbeitgeberansicht je Viewport;
- Mandatswechsel zwischen beiden synthetischen Arbeitgeberfällen;
- Verantwortungsboard;
- Fallakte und nächste Verantwortung;
- Tastatur-Phasenwechsel im Board;
- lokale Demo-Freigabe;
- Demo-Fall-Modal;
- Rückfall von `?view=arbeitnehmer` auf AMAVIO;
- `prefers-reduced-motion`;
- Browser-/JavaScriptfehler;
- sichtbarer simulierter Stichtag und kein automatischer Tourstart;
- ungekürzter Seitenkontext im Kopfbereich;
- konsistenter Status nach lokaler Demo-Freigabe;
- Screenshots beider Rollen bei 1440, 1280, 1024, 768, 390 und 360 Pixeln.

### HTTP-Smoke-Test

```text
index   200 text/html; charset=utf-8
logo    200 image/svg+xml
font    200 font/woff2
missing 404 text/plain; charset=utf-8
```

### In-App-Browser

- aktive Rollen im Accessibility Tree: AMAVIO Operations und Arbeitgeber;
- Steuerungskette vollständig lesbar;
- Fall `#A-2231` öffnet eine Dialog-Fallakte;
- „Nächste Verantwortung: Wohnraumfreigabe überfällig“ mit Standortleitung sichtbar;
- Browserkonsole: keine Warnungen oder Fehler in der geprüften Journey.

## 7. Visuelle Prüfung

Visuell geprüft wurden insbesondere:

- Desktop 1440 × 1000, AMAVIO Operations;
- Desktop 1280 × 720, AMAVIO Operations und Arbeitgeber;
- Desktop 1024 nach Breakpoint-Korrektur;
- Tablet 768 × 900 nach zweizeiligem Topbar-Breakpoint;
- Mobile 390 × 844, Arbeitgeber;
- Mobile 360 × 800, Arbeitgeber;
- Screenshotmatrix beider Rollen in allen sechs Viewports.

Ergebnis:

- keine horizontale Überbreite;
- Demo-/Reifegradlabel bleibt auf Mobile sichtbar;
- Steuerungskette und Verantwortungsboard brechen nachvollziehbar um;
- Rollenmatrix stapelt ohne Textüberlauf;
- Navigation, Tabellen, Phasen und Footer bleiben lesbar;
- Markenfarben und Funktionstöne entsprechen der intern verbindlichen Brandbook-Arbeitsgrundlage.

## 8. Nicht nachgewiesen / offene Grenzen

- keine reale Safari-, Firefox-, iOS-Safari- oder Android-Chromium-Geräteprüfung;
- kein Test mit VoiceOver, NVDA oder JAWS;
- kein formeller WCAG-Konformitätsnachweis;
- keine echten Nutzer- oder Designpartner-Tests;
- keine Datenschutz-, Security-, Rechts-, Hosting- oder Betriebsfreigabe;
- keine Produktivdaten, Authentifizierung, Rechteprüfung oder Mandantentrennung;
- keine App-/ACC-, CRM- oder HRIS-Integration;
- keine echte Nachricht, Dateiübertragung, Einladung, Freigabe oder Exportfunktion;
- keine Veröffentlichung oder externe Freigabe.

## 9. Abnahmeurteil

Die Arbeitskopie erfüllt die lokal ausführbaren P0/P1-Arbeitspakete und ist als **lokale, präsentationsfähige ACC-Konzeptdemo** mit synthetischen Daten geeignet. Sie ist nicht produktionsreif, nicht extern freigegeben und kein Nachweis für SaaS-, Datenschutz-, Security-, Pilot- oder Marktreife.

Die Founder-/Präsentationsabnahme ist abgeschlossen. Bewusst freigegebene Designpartner-Validierung, produktive Architektur und Veröffentlichung bleiben getrennte, weiterhin ungeöffnete Entscheidungen.

## 10. Founder-/Präsentationsabnahme – zweiter Pass

Am 30.09.2026 wurde die tatsächliche 6–8-Minuten-Journey zusätzlich im lokalen In-App-Browser bei 1280 × 720 Pixeln geprüft. Dabei wurden vier sichtbare Präsentationsfehler und zwei Klarheitsverbesserungen identifiziert und gezielt korrigiert:

- abgeschnittener Kopfbereich;
- fehlender simulierter Zeitbezug;
- inkonsistenter Status nach lokaler Demo-Freigabe;
- scheinbar weiterführender, aber nicht erweiternder Falllink;
- automatisch eingeblendete Tour;
- zu allgemeine Reporting-Einordnung.

Vor der Änderung wurde `archive/20260930_181739_founder_presentation_baseline/` angelegt. Aktive und archivierte `index.html` hatten vor der Korrektur denselben SHA-256-Hash `bd6697bd22443b9b8f3ff8a62337b88e091a935bd3d68b3461504faa5478c4e6`.

Die Abnahme- und Governance-Unterlagen sind getrennt dokumentiert:

- `FOUNDER_PRAESENTATIONSABNAHME_20260930.md`;
- `DESIGNPARTNER_VALIDIERUNG_SCOPE_20260930.md`;
- `PRODUKTIVE_ARCHITEKTUR_GATES_20260930.md`.

Die Präsentationsabnahme gilt nur für die lokale, moderierte Konzeptdemo mit synthetischen Daten. Sie öffnet weder externe Validierung noch produktive Architektur oder Veröffentlichung.

Finaler Regressionstest nach allen Korrekturen:

```text
AMAVIO ACC Static QA: OK (2 aktive Rollen, lokale Assets vollständig, keine Netzwerkpfade)
AMAVIO ACC Browser QA: OK (6 Viewports × 2 Rollen, Interaktions- und Reduced-Motion-Pass)
```

Die Browserkonsole enthielt im finalen sichtbaren Präsentationspfad keine Warnungen oder Fehler.
