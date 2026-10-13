# AMAVIO One CRM Cockpit – QA

**Zeitpunkt:** 08.10.2026, 19:21 CEST  
**Autorenschaft:** Codex-Arbeitsfassung im Auftrag des Nutzers  
**Status:** **LOKAL QA-BESTANDEN / SYNTHETISCH / NICHT PRODUKTIV / NICHT VERÖFFENTLICHT**

## Ergebnis

Aus dem bereitgestellten IGS-Deal-Cockpit wurde ein eigenständiges AMAVIO-One-CRM als lokale React/Vite-Arbeitsfassung entwickelt. Die Informationsarchitektur wurde nicht kopiert, sondern fachlich übersetzt: Accounts, Kontakte, Opportunities, Partnerquellen, Aufgaben, Bericht und kontrollierte Übergabeplanung.

## Berührter Bereich

Ausschließlich neu angelegt:

`09_Unternehmenssystem/07_AMAVIO_One_CRM/20261008_AMAVIO_One_CRM_Cockpit_Working/`

Unverändert geblieben:

- `/Users/zakia/Downloads/Deal-Cockpit IGS Gruppe.md`;
- `/Users/zakia/Downloads/Deal-Cockpit IGS Gruppe.html`;
- bestehende AMAVIO-Website;
- bestehendes Arrival Control Center;
- bestehende AMAVIO One App;
- Businessplan, Finanztool, Preise, CV, Kunden-, Investoren- und Förderunterlagen;
- externe CRM-, E-Mail-, Kalender-, Drive-, Hosting- und Deployment-Systeme.

Der Ordner `09_Unternehmenssystem/` wird durch `.git/info/exclude` ignoriert. Die Dateien sind lokal vorhanden, erscheinen aber nicht automatisch in `git status`.

## Quellen

| Quelle | Nutzung |
|---|---|
| `/Users/zakia/Downloads/Deal-Cockpit IGS Gruppe.md` · SHA-256 `368889c2980082d4e130be3162eb0c34f641ca954f4a6dad264b5c87c3c12f8f` | kurze Funktionsübersicht |
| `/Users/zakia/Downloads/Deal-Cockpit IGS Gruppe.html` · SHA-256 `e31995638fa8951322cd1267517243df7b1830b55dd36f4360c38999c7e696be` | UI-, Detail- und Interaktionsinventar |
| `AMAVIO_One_Brand_Quick_Reference_20260930.md` | Farb-, Typografie-, Sprach- und Claim-Grenzen |
| `AMAVIO_One_Design_Tokens_Master_20260930.json` | konkrete Design-Tokens |
| `.codex/knowledge-base/topics/amavio/product-architecture-portal-app-20260822.md` | AMAVIO-Produktrollen und ACC-Abgrenzung |
| `09_App/20261008_AMAVIO_One_App_Contract_Brand_Experience_Working/01_IMPLEMENTATION_AND_BOUNDARIES.md` | App-/ACC-Trennung und lokale Datenhaltung |

## Werkzeugstatus

| Werkzeug | Status | Ergebnis |
|---|---|---|
| AMAVIO Operating System / Tool Router | installiert, gelesen und angewendet | Source-of-truth- und Produktgrenzen eingehalten |
| Frontend App Builder | installiert, gelesen und angewendet | React/Vite, Konzept-vor-Code und visuelle Vergleichs-QA |
| eingebaute Bildgenerierung | callable und smoke-tested | Desktop-/Mobile-Konzept sowie neutrales Architekturmotiv erzeugt |
| Codex In-App Browser | callable und smoke-tested | lokale Navigation und Kerninteraktionen geprüft |
| React 18 / Vite 6 | lokal installiert und build-getestet | Produktionsbuild erfolgreich |
| Playwright + lokales Google Chrome | lokal installiert; Screenshotlauf außerhalb der Sandbox smoke-tested | Desktop- und Mobile-Captures erfolgreich |
| CRM-/Cloud-Connectoren | nicht verwendet; Authentifizierung nicht geprüft | keine externe Lese- oder Schreibaktion |

## Technische Prüfungen

- `npm run build`: erfolgreich; 1.586 Module transformiert.
- `npm run qa`: `AMAVIO One CRM QA: OK`.
- `npm audit --omit=dev`: 0 bekannte Schwachstellen.
- Secret-Musterprüfung der neuen Quellen: kein Treffer.
- Browserkonsole Desktop/Mobile: keine Fehler.
- Dokumentbreite Desktop 1600×1000: kein horizontaler Seitenüberlauf.
- Dokumentbreite Mobile 430×932: kein horizontaler Seitenüberlauf; allein die Stage-Schiene ist bewusst horizontal navigierbar.
- `noindex,nofollow,noarchive` vorhanden.
- `prefers-reduced-motion` vorhanden.
- Originale AMAVIO-Logo-SVGs eingebunden.

Maschinenlesbares Browserergebnis: `QA/CRM_BROWSER_RESULT_20261008.json`.

## Geprüfter Kernweg

1. Cockpit laden und lokale/synthetische Kennzeichnung sehen.
2. Opportunity „Klinikverbund Rhein“ öffnen.
3. Phase lokal von `Scoping` auf `Angebot` ändern.
4. Detailansicht schließen.
5. Neue Chance mit Pflichtfeldern lokal anlegen.
6. Datensatz in Pipeline und Listenansicht wiederfinden.
7. Demo auf den kontrollierten synthetischen Ausgangsstand zurücksetzen.
8. Desktop- und Mobile-Navigation einschließlich Bottom-Navigation prüfen.

## Visueller Fidelity-Ledger

| Vergleichspunkt | Konzept | finaler Render | Ergebnis |
|---|---|---|---|
| Markenpalette | Navy, Cream, Gold, Statusblau, Attention-Coral | gleiche Tokenfamilien | bestanden |
| Typografie | redaktioneller Titel plus ruhige Sans-UI | Georgia/Fraunces-Fallback plus Geist/Inter-Systemfallback | bestanden |
| Desktop-Shell | dunkle Seitenleiste, ruhige Topbar, Goldlinie | deckungsgleiches Strukturprinzip | bestanden |
| Erster Viewport | Editorial-Titel, aktiver Fokus, Architekturmotiv | Titel einzeilig, neutral generiertes Motiv rechts | bestanden |
| Pipeline | sechs Phasen als horizontale Arrival-Line | sechs interaktive Phasen mit Counts | bestanden |
| Arbeitsliste | tabellarische Chancen, selektierter Datensatz | responsive Tabelle und mobile Listenvariante | bestanden |
| Kontextleiste | nächste Schritte plus zwei klare Hinweise | gleiche Hierarchie und Statusfarben | bestanden |
| Mobile | kompakter Navy-Header, Fokus, Stage-Rail, Bottom-Navigation | bei 430×932 geprüft, 44px-nahe Touchflächen, keine Seitenüberbreite | bestanden |

## Above-the-fold Copy-Diff

Erlaubte Kerntexte aus dem Konzept sind vorhanden: `AMAVIO One`, `CRM Cockpit`, `Beziehungen werden steuerbar.`, `Aktiver Fokus`, `Klinikverbund Rhein`, `Entscheidungsgespräch vorbereiten`, `Pipeline`, `Neue Chance`, `Nächste Schritte`, `Synthetische Arbeitsdaten · lokal`.

Bewusste Abweichungen:

- Profilname wurde auf `Zaki Amawi` statt einer erfundenen Mitarbeiteridentität gesetzt.
- Konzeptmetriken im sechsstelligen Bereich wurden nicht übernommen. Die Demo nutzt die aktuellen AMAVIO-Arbeitsanker `5.900`, `18.500`, `42.000` und `2.900 EUR/Monat` nur in klar synthetischen Datensätzen.
- Desktop startet mit `Alle Phasen`, damit die volle Datenlogik sichtbar ist; `Scoping` kann sofort als Filter gewählt werden.
- Das Architekturmotiv stellt keinen realen Kunden oder Standort dar und enthält keine Logos oder lesbare Beschilderung.

## Annahmen und offene Gates

- Diese Fassung ist eine lokale, synthetische Produktarbeitskopie.
- Browser-`localStorage` ist ausschließlich Demo-Speicher, kein Backend.
- Ein gewonnener Datensatz erzeugt keinen ACC-Fall und versendet nichts.
- Vor realen Kontakten oder Kundendaten sind Datenmodell, Rechtsgrundlage, Rollen, Mandantentrennung, Löschung, Sicherheit und Hosting zu entscheiden.
- Vor Produktivbetrieb sind Backend, Datenbank, Authentifizierung, Import/Export, Dublettenlogik, Backup, E-Mail/Kalender/Dokumente und eine versionierte ACC-Schnittstelle zu bauen und separat freizugeben.
- Airtable, HubSpot, Brevo, Gmail, Google Calendar, Drive, Supabase, Vercel und andere Connectoren wurden weder authentifiziert noch smoke-getestet.
- Keine Veröffentlichung, kein Deployment, kein Git-Push, kein externer Versand und keine externe CRM-Schreibaktion wurden durchgeführt.

## Abnahme

Die lokale Implementierung wurde gegen Desktop- und Mobile-Konzept mit `view_image` geprüft. Nach Korrektur von Titelbreite, Fokusmotiv, Mobile-Header, Mobile-Aktionszugang und Bottom-Navigation verbleibt keine bekannte, im aktuellen lokalen Scope material behebbare visuelle Abweichung. Produktiv-, Datenschutz-, Security- und Integrationsgates bleiben ausdrücklich offen.
