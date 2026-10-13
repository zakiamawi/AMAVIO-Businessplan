# AMAVIO Morgenplanung

Stand: 31. Juli 2026, 08:15 Europe/Berlin

Ziel dieses Laufs: den kuerzesten belastbaren Weg zu einem coach-faehigen
Zwischenstand am 6. August 2026 festlegen. Finale DOCX-, PDF-, PPTX- und
XLSX-Dateien wurden nicht ueberschrieben.

## Kurzstatus

- Website: `npm run lint` und `npm run build` erfolgreich; 19 Routen erzeugt.
  Ohne `SITE_URL` bleibt der Build absichtlich auf `localhost` und blockiert
  Indexing. Das ist fuer eine lokale Coach-Preview akzeptabel, nicht fuer
  Deployment.
- Finanzmodell v1.8: 2.099 Formelzellen, 0 fehlende Cachewerte, 0
  Formel-Fehlerzellen. Der alte Audit mit 2.062 ungecachten Formeln beschreibt
  einen historischen Vor-Recalc-Stand.
- Businessplan v2.2: aktuelles DOCX enthaelt keine Nennung `v1.7`, nennt
  Finanzmodell v1.8 und enthaelt die kanonischen Umsatzwerte
  93.500 / 269.000 / 442.000 EUR.
- Decks: sichtbare Investor-Zahlen sind konsistent. In den Sprecher-Notizen von
  Employer Deck, Investor Deck und One-Pager stehen noch alte v1.7-Quellen.
  Das ist vor Coach-Nutzung zu bereinigen und danach neu zu extrahieren.
- Repo: stark dirty; bestehende Aenderungen und untracked QA-/Backup-Dateien
  wurden als laufende Nutzerarbeit behandelt und nicht veraendert.

## 1. Heutige Top-Prioritaeten

1. **Coach-Paket festziehen:** Businessplan v2.2, Finanzmodell v1.8,
   One-Pager und Investor-Deck als eine belegbare Linie behandeln.
2. **Quellenhygiene schliessen:** veraltete v1.7-Sprecher-Notizen korrigieren,
   jedoch erst nach Backup; anschliessend PPTX-Extrakte und Kontaktboegen neu
   erzeugen.
3. **Coach-Erzaehlung vorbereiten:** Problem, Zielkunde, Angebot, Preis,
   Marktzugang, Kapazitaet, Drei-Jahres-Zahlen und vier P1-Gates in einer
   5-Minuten-Linie.
4. **Website als Preview stabilisieren:** zuerst Desktop/Mobile, Kontrast,
   Navigation, Formular-Fehlerpfade und sichtbare Platzhalter pruefen. Keine
   3D- oder Medienausweitung vor diesen Gates.
5. **Arbeitsbaum ordnen:** Office-Finals, Website-Code, QA, Backups und lokale
   Tooling-Dateien vor Commit oder Uebergabe getrennt inventarisieren.

## 2. Konkrete To-do-Liste in Reihenfolge

1. `AMAVIO_Coach_Readiness_Checklist_20260806.md` als taegliches Gate-Board
   verwenden.
2. Vor jeder PPTX-Aenderung einen datierten Backup-Ordner anlegen.
3. In den Sprecher-Notizen ersetzen:
   - Businessplan v1.7 -> Businessplan v2.2
   - Finanzmodell v1.7 -> Finanzmodell v1.8
4. Deck-Textextrakte neu erzeugen und auf `v1.7`, `92.000`, ungesicherte
   Garantien und erfundene Verfuegbarkeiten pruefen.
5. Eine coach-faehige 5-Minuten-Sprechspur schreiben und gegen One-Pager,
   Investor-Deck und Businessplan testen.
6. Finanzmodell-Gates fuer den Coach markieren: Basisannahmen, Umsatztreiber,
   Kapazitaet, Liquiditaet, Startkapital 25.000 EUR und Abgrenzung zum
   Launch-Preis 29.500 EUR netto.
7. Website lokal im Browser auf Desktop und Mobile pruefen; Screenshot-Belege
   fuer Startseite, Angebot/Prozess, Kontakt und rechtliche Seiten ablegen.
8. Danach erst entscheiden, ob ein kleiner Motion-/3D-Pilot bis 6. August
   wirklich mehr Coach-Nutzen als Risiko bringt.
9. Vor Commit/Push eine gezielte Dateiliste erstellen; keine pauschale Aufnahme
   von `_backups`, Render-Caches, `.next` oder `node_modules`.

## 3. Offene Fragen und Risiken

Heute ist keine Nutzerentscheidung zwingend erforderlich.

- **P1 Quellenhygiene:** alte v1.7-Nennungen befinden sich in PPTX-Notizen.
- **P1 Statuswahrheit:** `financial_model_v1_8_audit.json` ist veraltet und
  widerspricht dem aktuellen, erfolgreich gecachten Workbook. Als historisch
  kennzeichnen oder nach einem kontrollierten Re-Audit ersetzen.
- **P1 Repo-Hygiene:** der grosse dirty Worktree erschwert sichere Commits und
  belastbare Aenderungsnachweise.
- **P2 Website-Live-Reife:** echte HTTPS-`SITE_URL`, finale Pflichtdaten,
  Webhook-Empfaenger und finale Medien fehlen weiterhin. Eine lokale
  Coach-Preview ist trotzdem moeglich.
- **P2 Design-Dokumentation:** die CSS-Werte sind bereits Navy/Creme/Champagne,
  aber alte Variablennamen und `docs/design-system.md` nennen noch
  Petrol/Sage. Code und Doku sollten semantisch synchronisiert werden.
- **P2 Supply Chain:** `npm audit --omit=dev` meldet drei High-Findings ueber
  gebuendelte PostCSS-/Sharp-Versionen in Next.js. `npm audit fix --force`
  wuerde auf Next 9.3.3 zuruecksetzen und darf nicht ausgefuehrt werden.

## 4. Benoetigte Checklisten

Die neue Coach-Readiness-Checkliste enthaelt:

- Source-of-Truth und Versionslinie
- Zahlen- und Aussagenkonsistenz
- 5-Minuten-Coach-Story
- Angebots-, Vertriebs- und Kapazitaetslogik
- P1-Rechts-/Nachweisgates
- Website-Preview-Gates
- visuelle und technische QA
- Backup-, Extrakt- und Uebergabe-Nachweise

Zusaetzlich vor finaler Abgabe noetig:

- **Office Final QA:** Backup, Recalc, Export, Seiten-/Folienzahl,
  Einzelrender, Kontaktbogen, Textlayer, Fonts, Ueberlaeufe.
- **Website Release QA:** echte `SITE_URL`, Webhook-Testempfaenger,
  Fehlerpfade, interne Links, Accessibility, Performance, SEO, Security
  Headers, Desktop/Mobile.
- **Submission Manifest:** nur freigegebene Dateien, Version, Hash, Zweck,
  Zielgruppe und Abgabereihenfolge.

## 5. Empfohlene konkrete Aenderungen

### Businessplan

- Keine inhaltliche Neuerstellung.
- Coach-Randnotiz bzw. separates Briefing fuer die acht entscheidenden Punkte
  erstellen, ohne den Master zu verkuerzen.
- Veraltete QA-Artefakte klar als historisch markieren, damit der Coach keinen
  widerspruechlichen Formelstatus sieht.

### Finanzmodell

- Modell nicht aendern; aktueller technischer Cache- und Fehlerstatus ist gruen.
- Fuer den Coach die Treiber und Stressfaelle sichtbar erklaeren, besonders
  Volumen, Preise, Kapazitaet, Zahlungszeitpunkt und Liquiditaetsminimum.
- Den 25.000-EUR-Kapitalbedarf strikt vom 29.500-EUR-Netto-Launchpreis trennen.

### Website

- Bestehende Navy-/Creme-/Champagne-Werte beibehalten; alte Token-Namen und
  Design-Doku spaeter semantisch bereinigen.
- Bis zum Coach-Termin: Browser-QA und Platzhaltertransparenz vor 3D/Video.
- Keine oeffentliche Freigabe ohne echte `SITE_URL` und Pflichtdaten.

### Decks und One-Pager

- Nur Sprecher-Notizen und Quellenzeile korrigieren; sichtbare Story nicht
  blind neu bauen.
- Nach der Korrektur Extrakte und Renderchecks aktualisieren.
- Employer Deck fuer Kundenlogik, Investor Deck fuer Finanz-/Risikologik und
  One-Pager als Einstieg verwenden.

### Anlagen

- Keine Neuformatierung vor dem Coach-Termin.
- P1-Gates und Nachweisstatus in einem kurzen Coach-Index referenzieren.

## 6. Tool-/MCP-/CLI-Scout

| Option | Konkreter AMAVIO-Nutzen | Kosten/Risiko | Entscheidung |
|---|---|---|---|
| Bestehendes Playwright MCP | Desktop/Mobile, Formularpfade, Navigation und Screenshots | bereits vorhanden; kein Zusatzabo | **nutzen**, keine neue Browser-Loesung installieren |
| [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) | reproduzierbare Performance-, SEO-, Accessibility- und Best-Practice-Budgets | OSS; Messwerte schwanken, Einrichtung erst nach stabiler Preview sinnvoll | **abwarten bis Preview-URL**, dann Pilot |
| [axe-core](https://github.com/dequelabs/axe-core) | automatisierte WCAG-Checks, spaeter in Playwright integrierbar | OSS; deckt nur einen Teil manueller Accessibility-QA ab | **kleinen Pilot nach Browser-QA pruefen**, heute nicht installieren |
| [lychee](https://github.com/lycheeverse/lychee) | defekte Links in Markdown, HTML und Website pruefen; Windows-Binary und GitHub Action vorhanden | OSS; externe Links koennen fluktuieren | **spaeter installieren**, sobald Quellen-/Linkbestand stabil ist |
| Neue Codex-/MCP-Plugins | kein heute identifizierter Engpass; Context7, Playwright und bestehende Skills decken den Bedarf | zusaetzliche Angriffs- und Wartungsflaeche | **verwerfen/abwarten** |
| Next.js Sicherheitsupdate | wuerde PostCSS-/Sharp-Findings schliessen, sobald eine stabile Version verfuegbar ist | aktuell ist 16.2.12 laut npm die neueste stabile Version; Force-Fix waere ein riskanter Downgrade | **monitoren**, kein Force-Fix |

Quellenhinweis zur Sicherheitsbewertung:

- Next.js hat den gebuendelten PostCSS-Pfad im Projekt diskutiert; ein stabiler
  sauberer Upgrade-Pfad ist fuer den aktuell installierten Stand noch nicht
  belegt:
  [vercel/next.js Issue #93604](https://github.com/vercel/next.js/issues/93604).
- Der aktuelle Audit nennt unter anderem
  [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q).

## In diesem Lauf sicher verbessert

- Neuer kompakter Morgenbericht angelegt.
- Neue Coach-Readiness-Checkliste angelegt.
- Keine Office-Finaldatei und keine bestehende Nutzerdatei ueberschrieben.
- Aktuellen Website-Build, Finanzmodell-Cache und PPTX-Quellennotizen
  read-only verifiziert.

