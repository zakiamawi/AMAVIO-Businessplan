# Usability-Konsole – Brandbook-Korrektur und QA

**Stand:** 07.10.2026  
**Ergebnis:** Brandbook-V2-Abgleich bestanden  
**Rückfallbasis:** `archive/20261007_pre_brandbook_correction/`

## Führungsquellen

- `08_Website/brand/AMAVIO_One_Brandbook_Master_V2_Designveredelung_20260930/AMAVIO_One_Brand_Quick_Reference_20260930.md`
- `08_Website/brand/AMAVIO_One_Brandbook_Master_V2_Designveredelung_20260930/AMAVIO_One_Design_Tokens_Master_20260930.css`
- `08_Website/brand/AMAVIO_One_Brandbook_Master_V2_Designveredelung_20260930/AMAVIO_One_Brand_Compliance_Prompt_20260930.md`
- vorhandenes Logoasset `assets/brand/amavio-logo-light.svg`

## Festgestellte Ausgangsabweichungen

- Teal-/Mintpalette statt Navy/Gold/Creme;
- grüner Erfolgszustand statt funktionalem Statusblau;
- Manrope statt Geist/Fraunces;
- Radien bis 18 px statt 0/4/8 px;
- Panel-Schatten ohne Overlayfunktion;
- zu viele optisch eigenständige Karten und Pillen;
- Logo mit 126 px unter der digitalen Mindestbreite von 180 px.

## Korrigierter Zustand

- exakte Primär- und Statustokens eingesetzt;
- Stage Navy auf Kopfbereich, Gold als Arrival Line, Cream als Hauptgrund;
- Geist für UI/Body, Fraunces für den kurzen redaktionellen Titel, Mono nur für Systemlabels;
- vorhandenes Light-Logo unverändert mit 180 px Breite;
- 1200 px Contentbreite, großzügiger Weißraum und feine 1-px-Linien;
- Radien auf 0/4/8 begrenzt;
- keine Gradienten, keine neu eingeführte Teal-/Mintfarbe und keine Panel-Schatten;
- Statusfarbe nie ohne Textlabel.

## Prüfnachweise

| Prüfung | Ergebnis |
|---|---|
| `npm run qa:brandbook` | bestanden |
| `npm run qa:static` | bestanden |
| `npm run qa:usability` | Desktop und Mobile bestanden |
| Cream-Hauptgrund | `rgb(247, 244, 236)` bestätigt |
| Stage-Navy-Kopf | `rgb(8, 21, 39)` bestätigt |
| Typografie | Geist/Fraunces bestätigt |
| Logo | 180 px Desktop bestätigt |
| Panelradius | 8 px bestätigt |
| Panel-Schatten | keiner |
| externe Requests | 0 |

Visuelle Referenzen:

- `QA/usability-screens/desktop-brandbook-start.png`
- `QA/usability-screens/desktop-brandbook-session.png`
- `QA/usability-screens/mobile-brandbook-start.png`

## Berührt

- ausschließlich visuelles System der lokalen Usability-Konsole;
- Brandbook- und Browser-QA;
- Dokumentation des Welle-1-Founder-Gates.

## Unberührt

- Gate-02A-Backend und Routen;
- Testaufgaben und synthetische Falllogik;
- lokale Persistenz und Exportvertrag;
- laufende ACC-Demo auf Port 4193;
- Drei-Rollen-App;
- Website, Hosting, Deployment, Provider und externe Kommunikation.
