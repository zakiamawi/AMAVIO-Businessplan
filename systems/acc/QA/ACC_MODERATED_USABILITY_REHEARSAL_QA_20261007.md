# ACC Gate 04A – technischer Probelauf

**Stand:** 07.10.2026  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Moderated_Usability_Test_Working`  
**Ergebnis:** technisch testbereit  
**Aussagegrenze:** automatisierter Probelauf, kein menschlicher Usability-Befund

## Prüfumfang

- Scope-Guard verhindert Start ohne vier bestätigte Testgrenzen;
- Teilnehmercode akzeptiert nur synthetisches Format `SYN-UT-00` bis `SYN-UT-99`;
- sechs Aufgaben, Zielzeiten und Erfolgskriterien vorhanden;
- lokale Beobachtungsfelder für Ergebnis, Hilfe, SEQ, Fehler und Schweregrad;
- Beobachtung, Aussage und Interpretation getrennt;
- Aufgabenfortschritt und Session lokal im Browser persistiert;
- Auswertung berechnet Bearbeitungsstand, Erfolgsquote, SEQ, Hilfepunkte und Zeiten;
- JSON-Export erfüllt `amavio.acc.usability.v1`, `syntheticOnly: true`, `externalEffect: false`;
- CSV-Export bleibt lokal;
- keine externen Requests;
- Desktop 1280 × 900 und Mobile 390 × 844 ohne horizontalen Überlauf;
- sichtbare Felder beschriftet, Buttons benannt, H1- und ID-Struktur konsistent;
- bestehende ACC-Demo über sechs Viewports ohne Regression.

## Ergebnisse

| Prüfung | Ergebnis |
|---|---|
| `npm test` | 78/78 bestanden |
| `npm run qa:static` | bestanden |
| `npm run qa:browser` | 6/6 ACC-Viewports bestanden |
| `npm run qa:usability` | Desktop und Mobile bestanden |
| externer Request im Testinstrument | 0 |
| produktive Außenwirkung | 0 |

## Offenes Founder-Gate

Das Instrument ist bereit. Noch nicht freigegeben sind Auswahl realer Teilnehmender, Einladung, Terminierung, Remote-Link, Aufzeichnung, Weitergabe von Exportdateien oder Behauptung einer Designpartner-/Pilotvalidierung.
