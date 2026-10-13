# AMAVIO Abendreview

Stand: 31. Juli 2026, 20:26 Europe/Berlin

Ziel: coach-faehigen Zwischenstand fuer den 6. August 2026 absichern. Keine
finale DOCX-, PDF-, PPTX- oder XLSX-Datei wurde in diesem Lauf veraendert.

## Kurzurteil

Der Tag hat die Coach-Readiness substanziell vorangebracht. Die Zahlen- und
Quellenlinie ist konsistent, die drei coach-relevanten Deck-Notes sind bereinigt,
ein 16-seitiges Coach-Paket liegt vor und die ausfuehrliche v2.3-Arbeitsfassung
ist technisch sowie visuell belegt. Der Stand ist coach-faehig, aber noch nicht
abgabefinal. Die groessten Restpunkte sind eine klare Rollenentscheidung fuer
v2.2 versus v2.3, der Desktop-Hero der Website, Interaktions-QA und die spaetere
finale Office-Renderstrecke.

## 1. Fortschritt seit dem Morgencheck

- Deck-Quellen geschlossen: Employer Deck, Investor Deck und One-Pager wurden
  mit Backup ausschliesslich in `ppt/notesSlides/` auf Businessplan v2.2 und
  Finanzmodell v1.8 aktualisiert. Neue Extrakte enthalten keine Treffer fuer
  `v1.7`, `v1_7` oder `92.000`.
- Coach-Paket erzeugt: DOCX, PDF und QA-Beleg im neuen Ordner
  `04_Final_Abgabe_v2_1/05_Coach_Paket/`. Das PDF hat 16 Seiten, einen
  vollstaendigen Textlayer und keine leeren Seiten. Sichtpruefung der Seiten 1,
  7, 13 und 16 zeigt lesbare Tabellen und keine abgeschnittenen Raender.
- Businessplan erweitert: v2.3 als ausdruecklicher Arbeitsstand mit 59 Seiten,
  eigenem Footer und Coach-/Pruefer-Ergaenzung. Die v2.2-Finals blieben
  unangetastet. Die vorhandenen 59 PNG-Seiten und Kontaktboegen zeigen keinen
  groben Ueberlauf.
- Website veredelt: Navy/Creme/Champagne, bereinigte SVG-Platzhalter und ein
  stabilerer above-the-fold Reveal. Aktueller Abendcheck: `npm run lint`
  erfolgreich; `npm run build` erfolgreich; 19 Routen. Ohne `SITE_URL` bleibt
  der Build korrekt lokal und no-index.
- Hashbeleg geschlossen: Alle 11 Dateien des bisherigen Coach-Manifests stimmen
  weiterhin exakt mit ihren SHA-256-Werten ueberein. Fuer die danach erzeugten
  fuenf v2.3-/Coach-Paket-Dateien wurde das neue Delta
  `AMAVIO_Coach_Manifest_Delta_20260731.json` angelegt.

## 2. Konkrete To-do-Liste fuer morgen

1. **Fuehrungslinie festhalten:** Fuer den Coach bleibt v2.2 der Vollbeleg;
   v2.3 wird als optionales Arbeits-/Addendum-Dokument bezeichnet, nicht als
   neue Finalfassung.
2. **Website-Hero gezielt reparieren:** Desktop trennt den Markennamen aktuell
   sichtbar als `AMA- / VIO / Living`. Nur die H1-Worttrennung bzw. Maximalgroesse
   korrigieren, danach Desktop und Mobile neu screenshotten.
3. **Website-Interaktionen testen:** Navigation und interne Links, native
   Formularvalidierung, API-Antworten 415/400/413/422/503 sowie Netzwerkfehler,
   Tastatur/Fokus, Kontrast und Reduced Motion.
4. **Coach-Paket polieren:** Seitenumbruch vor Seite 16 pruefen; die Seite startet
   mit einem fortgesetzten EBITDA-Bullet. Cover und Schlussseiten duerfen ruhiger
   bleiben, sollten aber bewusst statt zufaellig wirken.
5. **Coach-Run-of-Show proben:** One-Pager -> Investor Deck -> Employer Deck ->
   Finanzmodell-Bridge -> drei Coach-Fragen; Gesamtzeit zehn Minuten.
6. **Belegkette ergaenzen:** Offizielle Arbeitgeber-Unterlagen von
   `Make it in Germany` zu fairer Rekrutierung, Wohnungssuche, Ankommen und
   Feedback als bessere Primaerbelege in die Quellenmatrix aufnehmen.
7. **Keine neue 3D-Stufe starten**, bevor Hero, Interaktion und Platzhalterstatus
   gruen sind.

## 3. Notwendige Checklisten inklusive Inhalt

### Coach-Day Run-of-Show

- Dateien lokal/offline oeffnen; Reihenfolge und Dateiversion vorab pruefen.
- 5-Minuten-Story einmal mit Timer sprechen.
- Kanonische Werte griffbereit: Umsatz 93.500 / 269.000 / 442.000 EUR;
  EBITDA 34.950 / 120.320 / 169.300 EUR.
- Kapitalbedarf 25.000 EUR klar vom Launch-Preis 29.500 EUR netto trennen.
- P1-Gates ohne Beschwichtigung benennen: Mittelzufluss, Paragraf 34c,
  Unternehmensgegenstand, Pipeline und Partnerfaehigkeit.
- Drei konkrete Coach-Fragen am Schluss stellen und Antworten protokollieren.

### Website-Interaction-QA

- Jede Header-/Footer-Navigation auf Desktop und Mobile anklicken.
- Formular: leere Felder, ungueltige E-Mail, fehlende Einwilligung, zu kurze und
  zu lange Nachricht pruefen.
- API: falscher Content-Type, ungueltiges JSON, unbekannte Felder, zu grosse
  Anfrage, fehlender/ungueltiger Webhook und nicht erreichbarer Empfaenger.
- Tab-Reihenfolge, sichtbarer Fokus, Enter/Space-Bedienung und Live-Regionen.
- Kontrast, 200-Prozent-Zoom, Reduced Motion und horizontalen Overflow pruefen.
- Platzhaltermedien sichtbar als Konzept kennzeichnen; keine Verfuegbarkeit
  suggerieren.

### Claims-/Evidence-Matrix

- Pro Claim: exakte Formulierung, Artefakt/Folie/Seite, Quelle, Datum, Owner,
  Status und naechste Erneuerung.
- Fakten, Annahmen, Zielwerte und offene Gates getrennt markieren.
- Pflege, Medizin, Kochen/Gastronomie nur berufsfeldspezifisch argumentieren;
  keinen allgemeinen Arbeitskraeftemangel behaupten.
- Housing-/Arrival-Nutzen mit offiziellen Integrationsunterlagen belegen;
  keine Garantie oder rechtssichere Vermittlung behaupten.

### Office-Final-Gate

- Datierter Backup, Recalc/Export, Hash, Seiten-/Folienzahl und Textlayer.
- Jede DOCX-/PDF-Seite und PPTX-Folie nach letzter sichtbarer Aenderung rendern.
- Ueberlauf, Fonts, Tabellen, Seitenumbrueche, Notes-Quellen und Kontaktbogen.
- Nur freigegebene Finals ins Abgabepaket; keine Backups, Caches oder Logs.

## 4. Risiken und eigenstaendige Loesungsversuche

- **Versionsambiguitaet v2.2/v2.3:** v2.3 ist neuer, aber nicht freigegeben.
  Loesung: Im Delta als `supplemental_working_state` klassifiziert; v2.2 bleibt
  bis zu einer bewussten Freigabe fuehrender Vollbeleg.
- **Manifest-Drift:** Das bestehende Manifest entstand vor Phase 9/10.
  Loesung: 11/11 Baseline-Hashes erneut verifiziert und ein separates Delta fuer
  die fuenf neuen Artefakte angelegt.
- **Website-Hero:** Desktop-Worttrennung wirkt unkontrolliert. Loesungspfad ist
  ein lokaler H1-CSS-Fix mit anschliessendem Zwei-Viewport-Screenshot, kein
  Redesign.
- **Website-Zustellung:** Ohne `INQUIRY_WEBHOOK_URL` endet ein valider Submit
  absichtlich mit 503. Das blockiert die lokale Coach-Preview nicht, aber jede
  Live-Demo muss den Zustand erklaeren oder einen sicheren Testempfaenger nutzen.
- **Office-Runtime:** Der gebuendelte Dependency-Lader blieb in diesem Lauf
  haengen. Deshalb keine Office-Datei angefasst. Vorhandene PDF-/PNG-Belege,
  Text-Audits, Hashes und Notes-ZIP-Vergleich wurden stattdessen read-only
  geprueft.
- **Dirty Worktree:** Umfangreiche aktive Nutzerarbeit, heute kein Git-Commit.
  Loesung: keine Bereinigung oder pauschales Staging; neue Abenddateien sind
  klar auf `99_QA` begrenzt.

## 5. Empfohlene konkrete Aenderungen

### Businessplan

- v2.3 nicht in `FINAL` umbenennen. Fuer den Coach nur als vertiefendes Addendum
  mit klarer Arbeitsstandskennzeichnung beilegen.
- Nach Coach-Feedback entscheiden, ob Kapitel 12 in den Master integriert oder
  als separates Executive Addendum gefuehrt wird.

### Finanzmodell

- XLSX morgen nicht inhaltlich umbauen. Fuer den Coach reichen die vorhandene
  Bridge und drei Szenariofragen.
- Vor finaler Abgabe ein neuer Excel-Recalc-/Cache-/Fehler-Audit; der heutige
  Hash stimmt weiterhin mit dem grünen Morgenstand ueberein.

### Website

- Desktop-H1 auf Wortgrenzen stabilisieren; danach Screenshots erneuern.
- Interaktions-QA vor Motion/Three.js. Echte `SITE_URL` und Webhook erst in einer
  kontrollierten Deployment-Umgebung setzen.
- Aktuelle SVGs als Platzhalter behandeln; keine weitere Platzhalterproduktion.

### Decks und Anlagen

- Sichtbare Deck-Story unveraendert lassen. Vollrender erst nach der naechsten
  sichtbaren Folienaenderung, weil die heutige Aenderung notes-only belegt ist.
- In Quellenregister/Anlagen die BA-Engpassanalyse 2025 und die offiziellen
  `Make it in Germany`-Checklisten/Willkommensmappe als direkte Belege fuer
  berufsspezifischen Bedarf und Arrival-/Integrationsaufgaben aufnehmen.

## 6. Tool-/MCP-/CLI-Scout

| Option | AMAVIO-Nutzen | Kosten/Risiko | Entscheidung |
|---|---|---|---|
| Gitleaks v8.30.1 | Secrets in dirty Worktree, `.mcp.json`, Historie und Abgabedateien vor Commit erkennen | OSS; False Positives und sensible Reports, deshalb immer `--redact` | **Pilot vor erstem gebuendelten Commit**, heute nicht installieren |
| OSV-Scanner v2.4.0 | Lockfile-/Dependency-Scan als nachvollziehbare Zweitmeinung zu `npm audit`, ohne Force-Downgrade | OSS; V2 und Fix-Funktionen koennen sich aendern, `fix` nicht automatisch nutzen | **Abwarten bis Dependency-Freeze**, dann read-only Pilot |
| Offizielle MCP Registry v1.8.0 | Bessere, verifizierbare Quelle fuer spaetere MCP-Auswahl | OSS/Registry; Self-Hosting bringt AMAVIO keinen Produktnutzen | **Nur als Scout-Quelle nutzen**, nicht installieren/self-hosten |
| Figma-Plugin | Sinnvoll erst bei einer echten Figma-Datei als Design-Source-of-Truth | zusaetzliche Plattform- und Berechtigungsflaeche | **Abwarten** |
| Lighthouse CI, axe-core, lychee | Bereits bekannte QA-Kandidaten fuer Performance, Accessibility und Links | OSS; Setup erst nach stabiler Preview effizient | **Weiter abwarten**, nicht erneut installieren |
| Neue bezahlte Portale/MCPs | Kein heute ungedeckter Coach-Engpass | Kosten, Lock-in, Wartung | **Verwerfen** |

Primaerquellen fuer den Scout:

- https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1
- https://github.com/google/osv-scanner/releases/tag/v2.4.0
- https://github.com/modelcontextprotocol/registry/releases/tag/v1.8.0

Neue fachliche Belege fuer morgen:

- https://statistik.arbeitsagentur.de/DE/Statischer-Content/Statistiken/Themen-im-Fokus/Fachkraeftebedarf/Fachkraefteengpassanalyse/Fachkraefteengpassanalyse.html
- https://www.make-it-in-germany.com/de/unternehmen/unterstuetzung/downloads

## In diesem Lauf sicher verbessert

- Abendreport als neue QA-Datei angelegt.
- Baseline-Manifest 11/11 gegen aktuelle SHA-256-Werte verifiziert.
- Hash-Delta fuer v2.3-Arbeitsstand und Coach-Paket angelegt.
- Website-Lint und Produktionsbuild erfolgreich wiederholt.
- Office-Finals und bestehende Nutzerdateien nicht veraendert.
