# AMAVIO ACC – Releases B + C QA

**Datum:** 03.10.2026  
**Arbeitskopie:** `20261003_AMAVIO_ACC_AI_Releases_B_C_Working`  
**Status:** QA abgeschlossen und lokal präsentationsbereit; synthetische Konzeptdemo, Founder-Bewertung offen

## Umfang

- Release-A-Regressionsprüfung;
- Release B: What-if Copilot, Workflow Composer, synthetische Dokumentprüfung, Anomaly Assistant, Audit Trail;
- Release C: kontrollierte App-Signalgrenze, Signal Inbox, 30/60/90/180 Learning Loop, Kohortenvergleich, Learning Copilot, Arbeitgeber-Role-Intelligence, Founder-System-Journey;
- HTML/CSS/JavaScript, Interaktion, Responsive, Accessibility, Reduced Motion und Produktgrenzen.

## Rückfallbasis

Der unmittelbar vor B/C aktive Release-A-Stand wurde unter `archive/20261003_release_a_baseline/` gesichert. `index.html`, `assets/release-a.js` und `assets/release-a.css` stimmen jeweils bytegleich mit der separaten Release-A-Arbeitskopie überein.

### Baseline-Hashes

- `index.html`: `df5fc30602b1f8fae76163526a66fccebd092d831d6af4d8205562010dbeb845`
- `assets/release-a.js`: `877590dc32a36ecb4eac25ac997fa2a33789c7af2ea1df3c49df8d116d622e8c`
- `assets/release-a.css`: `9acfb4d124db41ba6f0624e872c6a0536c0a8816645a9fe8cdfbb9dbb738c8b0`

### Aktive Kern-Hashes nach B/C

- `index.html`: `fb331639a86801d1348389c554aa4a5d5605aa4a5effeab75ff5253b860d5207`
- `assets/release-a.js`: `c32b0f7b27ad926b65c83cce8a505a2f24e261c8ad2307c72a3f99dd0a7e10a1`
- `assets/release-a.css`: `9acfb4d124db41ba6f0624e872c6a0536c0a8816645a9fe8cdfbb9dbb738c8b0`
- `assets/release-bc.js`: `4cdec3e3d65ba743f713f8a3107ea31d287885230a05e157cd20d8381efa2074`
- `assets/release-bc.css`: `d9255b3c6837366d2bebb06c2a676a26a7c6108a207a5a892135a70b1296f157`

`release-a.js` wurde in der aktiven B/C-Kopie ausschließlich um die lokale Zustandsbrücke und das Zustandsereignis erweitert; die unveränderte Fassung bleibt in der Rückfallbasis erhalten.

## Harte Grenzen

Alle Daten und Aktionen sind synthetisch und lokal. Nicht implementiert oder freigegeben sind externe KI, echte Daten, Backend, Authentifizierung, Registrierung, App-/ACC-Integration, CRM/HRIS, produktive Mandantentrennung, Nachricht, Upload, Zahlung, Buchung, Hosting, Deployment oder Veröffentlichung.

## Ergebnis

### Statische Prüfung

`node QA/static-check.js`

- Ergebnis: **OK**;
- zwei aktive ACC-Rollen;
- Releases A–C vollständig;
- lokale Assets vorhanden;
- Inline- und modulare JavaScript-Syntax gültig;
- keine Netzwerk-, API- oder externen URL-Pfade;
- historische Fachkraftansicht weiterhin verborgen und inert;
- keine produktiven KI-, Plattform- oder Integrationsclaims.

### Browser-, Responsive- und Interaktionsprüfung

`QA_BASE=http://127.0.0.1:4191 node QA/browser-check.js`

- Ergebnis: **OK**;
- sechs Viewports: 1440×1000, 1280×720, 1024×900, 768×900, 390×844, 360×800;
- beide aktiven Perspektiven: AMAVIO Operations und Arbeitgeber;
- Release-A-Regression: Szenario, Resolver, Event Engine, Decision Room und AI-Journey;
- Release B: What-if, Workflow, Dokumentprüfung, Datenqualität und Audit;
- Release C: Signalprüfung, Learning Loop, Playbook-Vormerkung, Role Intelligence und Founder-System-Journey;
- keine Console Errors, defekten Bilder, doppelten IDs, unbenannten Buttons oder ungelabelten aktiven Formularfelder;
- kein horizontaler Überlauf in den A-, B-, C- und Arbeitgeber-Intelligence-Flächen;
- Reduced Motion wirksam;
- 404-Verhalten korrekt.

### Visueller Pass

Desktop und Mobile wurden anhand der gerenderten Automation-, Learning- und Role-Intelligence-Flächen geprüft. Die finalen Nachweise liegen unter:

- `QA/screens/desktop-1440-automation.png`
- `QA/screens/desktop-1440-learning.png`
- `QA/screens/desktop-1440-role-intelligence.png`
- `QA/screens/mobile-390-automation.png`
- `QA/screens/mobile-390-learning.png`
- `QA/screens/mobile-390-role-intelligence.png`

Im visuellen Mobilpass wurde ein verbleibender Navigationszustand gefunden: Die mobile Seitenleiste blieb nach einem Tabwechsel geöffnet. Der Tab-Handler schließt sie nun explizit; der vollständige Browser- und Screenshot-Pass wurde danach erneut grün ausgeführt.

## Abschluss und offene Grenze

Releases B und C sind technisch und visuell für die lokale Founder-Bewertung bereit. Nicht bewertet ist die tatsächliche Gesprächswirkung durch den Founder. Aus diesem Abschluss folgt keine Freigabe für externe Validierung, echte Daten, produktive Architektur, Integration, Hosting, Deployment oder Veröffentlichung.
