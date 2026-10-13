# AMAVIO Daily QA / Advisor Run

Datum: 2026-07-30

## Arbeitsmodus

Dieser Lauf war ein QA-/Advisor-Lauf. Es wurden keine finalen DOCX-, PDF-, PPTX- oder XLSX-Dateien ueberschrieben.

Gelesene Projektregeln:

- `AMAVIO_Working_System_v1_20260730.md`
- `AMAVIO_Skills_Agents_Roadmap_v1_20260730.md`
- `AMAVIO_Website_Toolchain_Subscription_Decision_v1_20260730.md`

## Gepruefter Stand

Git-Status:

- Der Arbeitsbaum ist deutlich dirty.
- Finale Artefakte in `04_Final_Abgabe_v2_1/01_Businessplan`, `02_Finanzmodell` und `04_Decks` sind als geaendert bzw. neu sichtbar.
- Viele Website-Dateien sind geaendert.
- Mehrere QA-Logs, Backups und Rendercheck-Ordner sind untracked.

Offene QA-Linie aus bestehenden Logs:

- Businessplan/Finanzmodell: fuehrende Quelle bleibt Finanzmodell v1.8; v1.7-Verweise waren ein frueheres Risiko und muessen vor finaler Freigabe sichtbar/extrahiert geprueft bleiben.
- Website: technisch reifer Stand vorhanden, aber Designsystem ist noch zu stark Petrol/Sage/Gruen und noch nicht final auf Navy/Gold/Creme/Premium umgestellt.
- Investor/Employer/Partner/One-Pager: Decks sind konsolidiert und als PDF exportiert; nicht blind neu bauen, sondern nach Website-Visualsystem gezielt veredeln.
- Deployment: `SITE_URL` ist lokal nicht gesetzt; Build blockt Indexing korrekt. Fuer deploybare Umgebung muss eine echte HTTPS-Origin gesetzt werden.

## Heute verbesserte Vorarbeit

GitHub / Plugins:

- GitHub CLI ist jetzt angemeldet als `zakiamawi`.
- Token-Scopes laut `gh auth status`: `gist`, `read:org`, `repo`, `workflow`.
- Codex MCPs sind global aktiv: `context7`, `playwright`, `node_repl`.
- `codex doctor --json` meldet `overallStatus: ok` und `mcp servers: 3`.

Website-Toolchain:

- Keine neuen Abos oder kostenpflichtigen Tools gestartet.
- Motion for React bleibt installiert und wird als erster kleiner Pilot auf der Startseite genutzt.
- Kostenlose Kern-Vorarbeit installiert:
  - `lenis`
  - `gsap`
  - `three`
  - `@react-three/fiber`
  - `@react-three/drei`
  - `@react-three/postprocessing`
- Spline/Rive/Lottie-Runtime-Pakete wurden wieder entfernt, weil sie jetzt nicht in die unmittelbare, schlanke Kernphase gehoeren.
- Spline, Rive, LottieFiles, Remotion, Figma bleiben damit Entscheidungspunkte fuer spaeter, nicht aktuelle Umsetzung.

Technische Pruefung:

- `npm run lint` erfolgreich.
- `npm run build` erfolgreich.
- 19 Next.js-Routen wurden generiert.
- Hinweis bleibt: `SITE_URL` fehlt lokal und blockt Indexing fuer nicht-deploybare Builds.

## Konkrete Risiken / Widersprueche

1. Dirty Worktree vor finaler Abgabe

   Der Arbeitsbaum enthaelt viele geaenderte und untracked Dateien. Vor Commit, Push oder finaler Lieferung braucht es eine klare Trennung:
   - finale Artefakte
   - QA-/Backup-Dateien
   - Website-Code
   - lokale Tooling-/Runtime-Dateien

2. Website-Designrichtung noch nicht voll auf Projektregel

   Die Projektregel verlangt Navy/Gold/Creme und kein Gruen/Sage als Leitsystem. Das bestehende CSS nutzt noch Petrol/Sage/Gruen-Tokens. Das ist der naechste grosse Website-Risikopunkt, nicht die reine Technik.

3. 3D ja, aber nur funktional

   3D passt stark zu AMAVIO, aber nur als erklaerende Produkt-/Businessmodell-Schicht:
   - Campus-/Wohnhub-Miniatur
   - Ankunftspfad
   - Projekt-Gates
   - Partner-/Objektnetzwerk
   - Plattform-Statusflaeche

   Keine generische 3D-Deko.

4. Audit-Warnungen

   `npm audit` meldet weiterhin 12 high severity Findings. Der Audit-Pfad schlaegt teils unpassende Major-/Downgrade-Fixes fuer Next/Eslint vor. Nicht blind mit `npm audit fix --force` ausfuehren.

5. Finale Office-Dateien

   Businessplan, Finanzmodell und Decks sind im Git-Status geaendert. Ohne Backup/Rendercheck/Quellenentscheidung duerfen sie nicht weiter ueberschrieben werden.

## Sichere kleine Verbesserung / Pilotvorschlag

Naechster Pilot sollte kein finaler Rollout sein:

1. Eine isolierte Website-Premium-Pilotsektion bauen, z. B. `Campus-/Wohnhub-Miniatur`.
2. Erst CSS-Tokens auf Navy/Brass/Creme in einem begrenzten Bereich testen.
3. Danach eine kleine R3F-Szene mit mobilem Fallback vorbereiten.
4. Browser-Screenshot und mobile QA pruefen.
5. Nur bei sichtbar besserem Ergebnis auf weitere Website-Abschnitte ausrollen.

## Naechster bester Schritt

Als naechstes sollte ein fokussierter Website-Designsystem-Pilot entstehen:

- keine finalen Office-Dateien anfassen
- keine neuen Abos
- Navy/Gold/Creme-Tokens testen
- 3D-Motiv als funktionale Erklaerflaeche vorbereiten
- danach Browser-Preview und responsive QA

Erst wenn dieser Pilot klar besser ist, Website-Designsystem und spaeter Deck-/One-Pager-Veredelung daran angleichen.
