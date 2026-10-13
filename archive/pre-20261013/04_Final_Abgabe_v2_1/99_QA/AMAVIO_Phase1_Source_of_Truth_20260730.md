# AMAVIO Phase 1 Source-of-Truth Report

Stand: 30. Juli 2026, Europe/Berlin

## Ziel

Dieser Report legt fest, welche Dateien und Ordner als Arbeitsbasis für die nächste Konsolidierungsrunde gelten. Er ist bewusst kein finaler QA-Bericht und ersetzt keine visuelle Endprüfung. Zweck ist, Versionsbrüche sichtbar zu machen, bevor Businessplan, Website und Präsentationen weiter überarbeitet werden.

## Grundsatz für die weitere Arbeit

- Finale Abgabedateien liegen im Repo unter `04_Final_Abgabe_v2_1/`.
- Desktop-Dateien werden nur dann führend, wenn sie nachweislich neuer oder fachlich korrigierter sind.
- Tooling-, Agent-, Build- und Runtime-Artefakte gehören nicht in das finale Abgabepaket.
- Designrichtung ab nächster Phase: dunkleres warmes Papier statt Reinweiß, AMAVIO Navy + Gold, keine grüne Primärlinie. Grün nur falls fachlich zwingend als Ampelstatus, nicht als Brand-Farbe.
- Keine komplette Neuerstellung ohne Not: Bestehende 57-Seiten-Fassung, Finanzmodell, Decks und Website werden zuerst gesichert, verglichen und dann gezielt verbessert.

## Tool-/Skill-Strategie

| Arbeitsbereich | Wofür genutzt | Verfügbare Basis | Wann User-/externe Freigabe nötig ist |
|---|---|---|---|
| Documents Skill | DOCX lesen, strukturell prüfen, vorsichtig layouten, nach Änderungen rendern/visuell prüfen | Lokal verfügbar | Wenn Microsoft Word COM/LibreOffice-Konvertierung außerhalb der Sandbox nötig ist oder finale manuelle Word-Ansicht gewünscht ist |
| PDF Skill | Seitenzahl, Textlayer, PDF-Render und visuelle Prüfung | Lokal verfügbar | Wenn ein finaler PDF-Export nur über Word/PowerPoint GUI zuverlässig gelingt |
| Spreadsheets Skill | Finanzmodell v1.8 prüfen, Sheet-/Formel-/Wertlogik bewerten, keine blind-neue Excel | Lokal verfügbar | Wenn echte Excel-Recalc/COM-Speicherung notwendig wird |
| Presentations Skill | PPTX-Decks prüfen, Render-Checks wiederverwenden, später gezielt veredeln | Lokal verfügbar | Wenn PowerPoint-Export zu PDF oder manuelle finale Präsentationsansicht nötig ist |
| Next.js Skill | Website konsolidieren, Build/Lint, Next.js-16-Regeln, Deployment-Readiness | Lokal verfügbar | Wenn echte Domain, Webhook, Hosting oder Deploy-Zugang gesetzt werden muss |
| Git/GitHub | Änderungen versionieren, später Commit/Push/PR | Lokales Git verfügbar; GitHub nur bei Bedarf | Erst nach expliziter Freigabe für Commit/Push/PR |
| Image/Video-Generierung | Spätere Premium-Website, Hero-Visuals, Motion-/Video-Richtung, Deck-Veredelung | Teilweise verfügbar über Codex/Image-Tools; externe Generatoren nur falls installiert | Wenn Higgsfield/Fal/andere externe Medien-Tools benötigt werden und nicht installiert/verbunden sind |
| ECC/Agents/Prompts | Nur als Inspirations-/Archivquelle, nicht als ausführbare Wahrheit | Lokal vorhanden, aber nicht automatisch vertrauenswürdig aktiv | Keine direkte Ausführung ohne gesonderte Prüfung |

## Businessplan

### Gefundene Linien

| Quelle | Datei | Befund |
|---|---|---|
| Repo | `04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx` | Enthält zusätzlichen Absatz zum internen KI-/Mehrmodell-Setup; verweist an einer Stelle noch auf Finanzmodell v1.7; Quellenlinks teils ohne Trennzeichen. |
| Desktop | `C:/Users/zakia/OneDrive/Desktop/04_Final_Abgabe_v2_1/01_Businessplan/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx` | Beste Textbasis: verweist auf Finanzmodell v1.8 und hat sauberere Quellen-Trenner; enthält den KI-Setup-Absatz nicht. |
| Temp | `C:/Users/zakia/AppData/Local/Temp/AMAVIO_Living_Businessplan_Master_2026_v2_2_FINAL.docx` | Ähnlich zur Desktop-Linie, aber verweist noch auf v1.7 und hat Quellen-Trenner nicht sauber wie Desktop. |

Alle geprüften Businessplan-PDFs haben 57 Seiten. Desktop-PDF und Repo/Temp-PDF unterscheiden sich jedoch im Hash; sie sind daher nicht als identisches PDF-Paar zu behandeln.

### Phase-1-Entscheidung

**Führende Arbeitsbasis: Desktop-DOCX, nicht Repo-DOCX und nicht Temp-DOCX.**

Der KI-/Mehrmodell-Absatz aus der Repo-Version wird nicht automatisch übernommen. Er ist strategisch sensibel: Er kann intern ehrlich und modern wirken, aber bei Bank, Fachkundiger Stelle oder konservativen Prüfern unnötige Rückfragen auslösen. Übernahme nur nach bewusster Entscheidung.

### Nächster Schritt

- Desktop-DOCX als Basis ins Repo konsolidieren.
- Entscheiden, ob der KI-Setup-Absatz gestrichen bleibt oder in entschärfter Form in eine interne Anlage wandert.
- Danach DOCX -> PDF neu als konsistentes Paar erzeugen und visuell prüfen.

## Finanzmodell

### Gefundene Linien

| Quelle | Datei | Befund |
|---|---|---|
| Repo | `04_Final_Abgabe_v2_1/02_Finanzmodell/AMAVIO_Finanzmodell_36_Monate_v1_8_FINAL.xlsx` | Dateiname v1.8, aber sichtbare Inhalte nennen noch `Finanzmodell 36 Monate v1.7 FINAL`, `Businessplan v1.7` in Quellen und `Managementübersicht – Baseline v1.7`. |
| Desktop | `C:/Users/zakia/OneDrive/Desktop/04_Final_Abgabe_v2_1/02_Finanzmodell/AMAVIO_Finanzmodell_36_Monate_v1_8_FINAL.xlsx` | Führender Stand: Cover nennt `v1.8 FINAL`, Dashboard nennt `Baseline v1.8`; zentrale Werte 93.500 / 269.000 / 442.000 sind bestätigt. |

Beide Dateien haben dieselben 14 Sheets: `Cover`, `Source_of_Truth`, `Funding_Scenarios`, `Cash_Timing_Stress`, `P1_Gates`, `Assumptions`, `Contract_Cash`, `Monthly_Cash`, `Annual_P&L`, `Scenarios`, `Checks`, `Schedule_Inputs`, `Sources`, `Dashboard`.

### Phase-1-Entscheidung

**Desktop-Finanzmodell ist führend. Repo-Finanzmodell darf nicht als finale Quelle verwendet werden, obwohl der Dateiname bereits v1.8 sagt.**

### Nächster Schritt

- Desktop-Finanzmodell ins Repo übernehmen.
- Danach kompakte Modellprüfung: zentrale Werte, sichtbare Versionstexte, Formel-/Fehler-Scan.
- Excel bleibt inhaltlich zunächst sekundär, aber als Zahlenquelle für Businessplan und Decks muss v1.8 sauber synchronisiert sein.

## Anlagen

Die geprüften Desktop- und Repo-Anlagen in `03_Anlagen` sind byte-identisch.

### Phase-1-Entscheidung

**Repo-Anlagen bleiben führend. Keine Konsolidierung nötig.**

### Nächster Schritt

Nur spätere visuelle Endprüfung, keine inhaltliche Migration.

## Präsentationen und One-Pager

### Hash- und Render-Befund

| Deck | Render-PNGs vorhanden | Repo/Desktop identisch | Entscheidung |
|---|---:|---:|---|
| Employer Decision Deck v5.2 | 12 | Ja | Repo kann bleiben. |
| One-Pager v2.2 | 1 | Ja | Repo kann bleiben, aber Design sollte später deutlich stärker werden. |
| Partner Capability Deck v3.2 | 7 | Ja | Repo kann bleiben. |
| Investor Readiness Deck v3.2 | 9 | Nein | Desktop ist fachlich führend. |

Beim Investor-Deck ist der sichtbare Unterschied auf Folie 4: Desktop nennt korrekt `Finanzmodell v1.8`, Repo noch `v1.7`.

### Phase-1-Entscheidung

**Investor-Deck vom Desktop ins Repo übernehmen; die anderen drei Decks bleiben zunächst im Repo.**

### Designhinweis für Phase 2

Die Decks sind seriös und sauber, aber nicht maximal innovativ. Für Investor/Employer ist die Zurückhaltung grundsätzlich angemessen. Für Website, One-Pager und Hero-/Sales-Material sollte die nächste Runde stärker werden: mehr filmische Raumwirkung, subtile Bewegung, Premium-Hospitality, Workforce-Housing-Atmosphäre, hochwertiger Einsatz von generativen Medien. Keine amateurhaften KI-Bilder.

## Website

### Gefundene Linien

| Quelle | Befund |
|---|---|
| Repo `amavio-living-web` | Sauberer, aber älterer Stand. Einfachere API, statische `.example`-Metadata, weniger Security-/Deployment-Reife. |
| Desktop `amavio-living-web` | Neuer und fachlich reifer: `SITE_URL`-Validierung, no-index fallback, Webhook-basierte Anfrage-API, Security Headers, bessere Doku. Enthält aber Build-/Runtime-/Agent-Artefakte. |

### Desktop-only / nicht finalpaketfähig

Diese Ordner/Dateien gehören nicht blind ins finale Repo:

- `.next`
- `node_modules`
- `dev.log`
- `ECC`
- `Kimi-K3`
- sonstige Agent-/Framework-Bundles, soweit sie nicht direkt Projektquellcode sind

### Phase-1-Entscheidung

**Desktop-Website ist die führende fachliche Arbeitsbasis, muss aber selektiv ins Repo migriert werden.**

Zu übernehmen sind voraussichtlich:

- `src/`
- `public/`
- `docs/`
- `scripts/validate-site-url.mjs`
- `.env.example`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `README.md`

Nicht zu übernehmen:

- `.next`
- `node_modules`
- `ECC`
- `Kimi-K3`
- Logs, lokale Build-Ausgaben, fremde Repos/Frameworks

### Live-Risiko

Die Website ist als Preview/MVP brauchbar, aber noch nicht öffentlich live-ready, solange Impressum, Datenschutz, echte Domain, Webhook-Empfänger und rechtliche Pflichtdaten nicht final bestätigt sind.

## ECC / Agents / Prompts

Der Ordner `C:/Users/zakia/OneDrive/Desktop/04_Final_Abgabe_v2_1/ECC/` ist ein großes eigenständiges Agent-/Plugin-/Tooling-Repository mit vielen Framework-Konfigurationen für Claude, Codex, Cursor, Gemini, Kimi, Qwen, VS Code und weitere Systeme.

### Phase-1-Entscheidung

**ECC ist kein AMAVIO-Abgabeartefakt und wird nicht ins finale Businessplan-/Website-Paket übernommen.**

ECC kann als Inspirations- oder Prompt-Archiv dienen, aber nicht als aktive Projektquelle. In dieser Codex-Umgebung sind diese Agents nicht automatisch installiert oder direkt vertrauenswürdig ausführbar. Für AMAVIO nutzen wir nur explizit verfügbare Codex-Skills/Tools und übernehmen Ideen manuell, wenn sie nützlich sind.

## Java-ZIP

`java-1.8.0-openjdk-1.8.0.502.b07-1.win.jre.x86_64.zip` ist ein Runtime-/Tooling-Artefakt mit ca. 47,7 MB.

### Phase-1-Entscheidung

**Nicht Bestandteil des finalen Abgabepakets.**

Falls Java für Render-/Konvertierungsprozesse lokal benötigt wurde, bleibt es außerhalb der Abgabe und wird nur als Tooling-Abhängigkeit dokumentiert.

## Empfohlene Reihenfolge ab Phase 2

1. Desktop-Finanzmodell v1.8 ins Repo übernehmen und als Zahlenquelle sichern.
2. Businessplan-DOCX konsolidieren: Desktop als Basis, KI-Absatz draußen lassen oder intern verlagern, PDF neu erzeugen.
3. Investor-Deck vom Desktop ins Repo übernehmen, weil dort `v1.8` korrekt ist.
4. One-Pager und übrige Decks nicht neu bauen, sondern in der nächsten Designrunde gezielt veredeln.
5. Desktop-Website selektiv ins Repo migrieren, ohne Build-/Agent-Artefakte.
6. Website technisch prüfen: `npm run lint`, `npm run validate:site-url`, `npm run build`.
7. Danach Premium-Runde: Website Motion/Video-Konzept, hochwertige KI-generierte Visuals, One-Pager stärker machen, Decks gezielt veredeln.

## Arbeitsmodus

Effizienzregel: Bestehende Render-Checks und Hash-Vergleiche wiederverwenden. Keine unnötige Neugenerierung von PDFs, PPTX oder Website-Builds, solange die Quelle der Wahrheit nicht sauber festgelegt ist.
