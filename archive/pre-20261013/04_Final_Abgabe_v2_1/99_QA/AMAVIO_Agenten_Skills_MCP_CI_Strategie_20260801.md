# AMAVIO Agenten-, Skills-, MCP- und CI-Strategie

Datum: 2026-08-01

Ziel: AMAVIO Businessplan, Finanzmodell, Decks, Anlagen und Website mit wenigen starken, wiederholbaren Rollen finalisieren. Nicht die Anzahl der Tools ist entscheidend, sondern klare Zustaendigkeit, harte QA-Gates und keine blinde Veraenderung finaler Dateien.

## 1. Fuehrende Arbeitsarchitektur

### Kernprinzip

AMAVIO braucht eine kontrollierte Produktionslinie:

1. Source of Truth festlegen.
2. Fachagenten pruefen getrennt.
3. Hauptagent integriert.
4. Reviewer prueft gegen Zahlen, Recht, Design und Export.
5. Erst dann werden finale Dateien erzeugt oder ersetzt.

### Empfohlene Betriebsform

| Phase | Rolle | Zweck | Freigabe-Gate |
|---|---|---|---|
| Planung | Planner / Hauptagent | Ziel, Quellen, Dateien, Risiken, Reihenfolge festlegen | Arbeitsplan und Eingriffsgrenzen bestaetigt |
| Umsetzung | Executor-Rollen | Konkrete Datei-/Website-Aenderungen umsetzen | Keine finalen Dateien ohne Backup |
| Review | Reviewer-Rollen | Zahlen, Story, Legal, Design, Export pruefen | QA-Log mit Befund |
| Fix-Pass | Hauptagent + Spezialist | Nur echte Fehler korrigieren | Render/Text/Build/Hash-Check |

## 2. Top-Agenten fuer die Businessplan-Finalisierung

### A. Source-of-Truth & QA Controller

Prioritaet: kritisch

Zweck:
- fuehrende Versionen identifizieren
- Zahlen, Begriffe, Deck-Notizen, PDFs und Excel konsistent halten
- Git-Status und Artefakt-Chaos beherrschbar machen

Nutzt:
- RTK
- GitHub CLI
- lokale QA-Skripte
- PDF/DOCX/PPTX/XLSX-Extraktion
- Playwright MCP fuer Website-Smoke

Outputs:
- Widerspruchsliste
- Hash-/Manifest-Log
- Freigabe/Nicht-Freigabe
- Git-Cleanup-Kategorien

### B. Businessplan Editorial Architect

Prioritaet: kritisch

Zweck:
- Langfassung erhalten
- prueferfreundliche Fassung strukturieren
- Tabellenlast reduzieren
- Argumentationsfuehrung schaerfen

Nutzt:
- `investor-materials`
- `brand-voice`
- `content-engine`
- `documents:documents`

Outputs:
- Kapitelstruktur
- Kuerzungs-/Visualisierungsplan
- neue Prueferfassung
- Anhangslogik

### C. Financial Evidence Controller

Prioritaet: kritisch

Zweck:
- Excel, Businessplan, Decks und One-Pager zahlenlogisch verbinden
- Umsatz, EBITDA, Funding Need und Launch-Preis sauber trennen
- Sensitivitaeten und Annahmen prueferfest machen

Nutzt:
- `spreadsheets`
- `investor-materials`
- eigene Excel-Audit-Skripte
- RTK

Outputs:
- Zahlen-Mapping
- Annahmenliste
- Widerspruchsbericht
- prueferfreundliche Finanzstory

### D. Legal & Compliance Reviewer

Prioritaet: hoch

Zweck:
- keine erfundenen rechtlichen Aussagen
- §34c-/MaBV-/Datenschutz-/Impressums-/Leistungsabgrenzung sauber halten
- Businessplan-Claims als betriebswirtschaftliche Absicht statt Rechtsberatung formulieren

Nutzt:
- `documentation-lookup`
- `iterative-retrieval`
- bei echter Rechtsrecherche: Midpage Legal Research nur gezielt
- Scrapling nur fuer Quellensammlung, nicht als Rechtsurteil

Outputs:
- Legal-Risk-Liste
- Formulierungsredlines
- offene Rechtsklaerungen fuer Anwalt/Steuerberater

### E. HR & Employer Value Agent

Prioritaet: hoch

Zweck:
- AMAVIO aus Sicht Arbeitgeber/Personalabteilung plausibel machen
- Fachkraeftebindung, Onboarding, Wohnen, Integration und operative Entlastung verbinden
- Employer Deck und Website-Arbeitgeberseiten staerken

Nutzt:
- `content-engine`
- `brand-voice`
- `investor-materials`
- Scrapling fuer offizielle Fachkraefte-/Arbeitsmarktquellen

Outputs:
- HR-Nutzenlogik
- Employer-Entscheidungskriterien
- Persona-/Use-Case-Matrix
- Website-Content fuer Arbeitgeber

### F. Operations / Backoffice Controller

Prioritaet: hoch

Zweck:
- Prozesse, P1-Gates, Rollen, Reporting und Umsetzung realistisch machen
- pruefen, ob AMAVIO operativ lieferbar wirkt

Nutzt:
- `backend-patterns` fuer Prozesslogik
- `dashboard-builder`
- `design-kpis`
- lokale QA-/KPI-Artefakte

Outputs:
- Operating Model
- KPI-/Owner-Matrix
- Backoffice-Prozessbild
- Risiko- und Gate-Logik

### G. Frontoffice / Sales & Partner Agent

Prioritaet: hoch

Zweck:
- Arbeitgeber, Immobilienpartner und Bewohner nicht vermischen
- Angebotslogik, CTA, Pipeline und Erstmandat schaerfen

Nutzt:
- `investor-outreach`
- `brand-voice`
- `content-engine`
- `google-workspace-ops` nur wenn echte Datenquelle dort liegt

Outputs:
- Angebotsarchitektur
- Partner-Pitch
- Employer-Sales-Story
- Website-Funnel nach Zielgruppe

### H. Delivery & Export Engineer

Prioritaet: kritisch

Zweck:
- Word, PDF, PowerPoint, Excel und Website technisch sauber exportieren
- Textlayer, Seiten, Folien, Formeln, Build und Render pruefen

Nutzt:
- `documents:documents`
- `spreadsheets`
- PDF-Tools
- PowerPoint/PPTX-Extraktion
- RTK
- Playwright MCP

Outputs:
- finale Exportdateien
- Exportprotokoll
- Render-/Kontaktbogen-Checks
- technische Freigabe

## 3. Website-Agenten fuer eine innovative AMAVIO-Plattform

Die Website soll nicht einfach wie der Businessplan aussehen. Sie braucht eine eigene digitale Produktdramaturgie: cinematic, hochwertig, bildstark, 3D-unterstuetzt, interaktiv und trotzdem serioes.

### A. Website Creative Technologist

Prioritaet: kritisch

Nutzt:
- Next.js
- Motion for React
- Lenis
- GSAP
- Three.js
- React Three Fiber
- Drei
- Playwright MCP

Aufgabe:
- immersive Seitenlogik bauen
- Scroll- und Transition-System fuehren
- 3D nur dort einsetzen, wo es Verstaendnis oder Premiumwirkung steigert

Gute AMAVIO-3D-Motive:
- Campus-/Wohnhub-Miniatur
- Ankunftspfad fuer neue Mitarbeitende
- Partner-/Objektnetzwerk
- Projekt-Gates
- Wohn- und Community-Zonen

### B. Brand & Motion Director

Prioritaet: kritisch

Nutzt:
- `frontend-design-direction`
- `animation-vocabulary`
- `find-animation-opportunities`
- `improve-animations`
- Higgsfield-Promptbibliothek

Aufgabe:
- visuelle Richtung definieren
- Motion-Regeln festlegen
- Asset-Shotlist schreiben
- Bild-/Video-/3D-Prompts steuern

Designregel:
- Navy, Warm Paper, Champagne Brass, feines Copper
- kein Sage/Green/Petrol als Leitsystem
- keine generischen Tech-Orbs
- keine Baukasten-Landingpage

### C. Browser QA & Accessibility Reviewer

Prioritaet: hoch

Nutzt:
- `browser-qa`
- `frontend-a11y`
- Playwright MCP
- spaeter optional lokale Playwright-E2E-Suite

Aufgabe:
- Desktop/Mobile-Smoke
- Navigation
- Kontaktformular
- visuelle Ueberlaeufe
- reduced motion
- Accessibility-Grundcheck

Status:
- Playwright MCP ist nutzbar, aber langsam.
- Lokales `@playwright/test` ist im Website-Projekt noch nicht installiert.

### D. Media & Asset Producer

Prioritaet: mittel bis hoch

Nutzt:
- Higgsfield nur sparsam
- Imagegen fuer statische Entwuerfe
- Penpot nur wenn live verbunden und responsiv

Aufgabe:
- echte Bild-/Video-Briefs
- keine beliebigen Stock-Atmosphaeren
- jedes Asset auf Nutzbarkeit, Textfreiheit, Cropping und Markenwirkung pruefen

## 4. Datei-spezifische Tool-Auswahl

| Artefakt | Beste Rollen | Beste Skills/Tools | Muss-Gate |
|---|---|---|---|
| Word Businessplan | Businessplan Editorial Architect, Legal Reviewer, Source-of-Truth Controller | `documents:documents`, `investor-materials`, `brand-voice` | PDF/DOCX Text stimmt, keine alten Werte, Seitenfluss geprueft |
| Excel Finanzmodell | Financial Evidence Controller | `spreadsheets`, Excel-Audit-Skripte, RTK | Formelwerte, Annahmen, Szenarien, keine Fehlerzellen |
| PowerPoint Decks | Investor Pitch Strategist, Employer Pitch Strategist, Delivery Engineer | PPTX-Extraktion, Rendercheck, `investor-materials`, `frontend-slides` optional | sichtbare Slides + Notes XML stimmen |
| PDF Anlagen | Delivery Engineer, Legal Reviewer | PDF-Textlayer, Renderbilder, Hashes | keine unsichtbaren Altwerte im Textlayer |
| Website | Website Creative Technologist, Brand & Motion Director, Browser QA | Next.js, Motion, Lenis, GSAP, Three/R3F, Playwright MCP | lint/build, mobile/desktop, Performance, Accessibility |
| Coach-/Pruefpaket | Source-of-Truth Controller, Businessplan Architect | DOCX/PDF-Export, QA-Manifest | klarer Zweck, keine Materialdopplung, prueferfreundlich |

## 5. MCPs und Tools: Einsatzstatus

### Freigegeben

| Tool/MCP | Einsatz |
|---|---|
| RTK | Standard fuer effiziente Kommandos |
| GitHub CLI | Repo, Auth, PR, Issues, Status |
| GitHub Agentic Workflows | spaetere Automationen in GitHub |
| Scrapling | Recherche und Quellenextraktion |
| Playwright MCP | gezielte Browser-QA |
| OpenCodex CLI | installiert, aber nicht als Standard-Proxy aktivieren |

### Nicht als Kernprozess verwenden

| Tool/MCP | Grund |
|---|---|
| Graphiti | vorbereitet, aber Docker/MCP-Health noch nicht gruen |
| Command Code | installiert, aber CLI-Kommandos timed out |
| Penpot MCP | Tool sichtbar, aber Plugin-Kontext timed out |
| Lokales Playwright npm | nicht installiert; MCP reicht vorerst fuer kurze QA |

## 6. CI-, CIS- und Safety-Layers

Hier verwenden wir drei Ebenen:

- CI: technische Checks wie lint, build, render, export.
- CIS: Consistency Inspection System, also Zahlen-/Versions-/Quellenkonsistenz.
- SIL: Safety & Integrity Layer, also Regeln gegen Datenverlust, Secrets, falsche Rechts-/Finanzaussagen und Tool-Haenger.

### Pflicht-Gates

| Gate | Zweck | Tool |
|---|---|---|
| Git Dirty Tree Snapshot | Nichts versehentlich verlieren | `rtk git status --short` |
| Source-of-Truth Check | Zahlen und Begriffe zentral halten | QA-Skripte |
| Excel Formula Audit | Finanzmodell prueferfest halten | Spreadsheet-Skripte |
| DOCX/PDF Textlayer Check | unsichtbare Altwerte finden | PDF/DOCX-Extraktion |
| PPTX Notes XML Check | alte Quellen in Speaker Notes finden | PPTX-XML-Extraktion |
| Website Lint/Build | technische Website-Freigabe | `rtk npm run lint`, `rtk npm run build` |
| Browser Smoke | echte UI pruefen | Playwright MCP |
| Secret Safety | keine Keys ausgeben oder committen | `.env*`, Gitignore, formale Checks |
| Backup Gate | finale Office-Dateien schuetzen | `_backups` vor Aenderung |

### Ethik- und Genauigkeitsregeln

- Keine erfundenen Kunden, Objekte, Registerdaten, Rechtsfreigaben oder Finanzierungszusagen.
- Rechtliche Aussagen nur als Recherche-/Pruefhinweis, nicht als Rechtsberatung.
- Finanzmodell-Annahmen sichtbar machen, nicht verstecken.
- Website darf emotional und innovativ sein, aber keine falschen Leistungsversprechen machen.
- Agenten duerfen recherchieren und pruefen, aber der Hauptagent entscheidet ueber Integration.

## 7. Unternehmensabteilungen und Agentennutzen

| Abteilung | Agent/Rolle | Nutzen fuer korrekten Businessplan |
|---|---|---|
| Geschaeftsfuehrung | Source-of-Truth & QA Controller | klare Version, klare Strategie, keine Widersprueche |
| Finance | Financial Evidence Controller | belastbare Umsatz-, Kosten-, Cash- und Funding-Logik |
| Legal/Compliance | Legal & Compliance Reviewer | saubere Risiken, Datenschutz, Leistungsabgrenzung |
| HR/Personal | HR & Employer Value Agent | Arbeitgebernutzen, Fachkraeftebindung, Onboarding |
| Operations | Operations / Backoffice Controller | Lieferfaehigkeit, Prozesse, KPIs, Gates |
| Sales/Frontoffice | Frontoffice / Sales & Partner Agent | Angebotslogik, CTA, Pipeline, Erstmandat |
| Real Estate / Partner | Partner Capability Agent | Immobilienpartner-Nutzen, Objektlogik, Betreiberfaehigkeit |
| Marketing/Brand | Brand & Motion Director | hochwertige Story, Bildwelt, Wiedererkennbarkeit |
| IT/Product | Website Creative Technologist | Plattformlogik, Website, technische Glaubwuerdigkeit |
| QA/Delivery | Delivery & Export Engineer | finale Exporte, Render, Build, Hashes |

## 8. Git-Status saeubern, ohne Tools zu loeschen

Der Git-Status ist gross und dirty. Das ist kein Grund fuer Loeschen, sondern fuer Kategorisierung.

### Ziel

- AMAVIO-Arbeitsstand sichern.
- Tools, Skills, Plugins und Experimente nicht loeschen.
- Secrets und lokale Logs nicht committen.
- Projektartefakte nachvollziehbar gruppieren.

### Vorgehen

1. Status inventarisieren.
2. Dateien in Gruppen teilen:
   - finale Office-Artefakte
   - QA-/Dokumentationsartefakte
   - Website-Code
   - Website-Docs
   - Tooling-/MCP-Konfig
   - lokale Logs/Caches
3. `.env*`, lokale Logs, Playwright-Snapshots und generierte Preview-Logs pruefen und ggf. in `.gitignore` halten.
4. Keine `.codex`, `.agents`, Skills oder Plugin-Ordner loeschen.
5. Erst selektiv stagebar machen, dann getrennte Commits:
   - `docs/qa: add AMAVIO tooling and readiness logs`
   - `website: sync premium AMAVIO web implementation`
   - `docs: add coach and businessplan finalization artifacts`
   - `tooling: update mcp and agent guidance`
6. Vor jedem Commit: finaler Secret- und Dateityp-Check.

## 9. Sofort empfohlene Reihenfolge

1. Git-Status kategorisieren, ohne aufzuraeumen.
2. `.gitignore` fuer lokale Logs/Caches pruefen.
3. Businessplan/Excel/Decks gegen Source of Truth final pruefen.
4. Website als eigenstaendige innovative Plattform neu bewerten, nicht als Businessplan-Kopie.
5. Erst danach sichtbare Website-Design-/Motion-Phase starten.
6. Graphiti spaeter separat in einem engen Docker-Healthcheck-Lauf freigeben oder bewusst zurueckstellen.

## 10. Nicht jetzt tun

- Keine Skills/Agents/Plugins loeschen.
- Kein `npm audit fix --force`.
- Kein OpenCodex als Standard-Proxy aktivieren.
- Keine finalen DOCX/PDF/PPTX/XLSX ohne Backup ersetzen.
- Kein Penpot als Kernprozess einplanen, solange der Minimaltest timed out.
- Kein Graphiti als Memory-Wahrheit verwenden, solange der MCP-Healthcheck nicht gruen ist.
