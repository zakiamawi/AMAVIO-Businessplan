# QA-Protokoll – AMAVIO One App Contract & Brand Experience

**Datum:** 8. Oktober 2026  
**Arbeitsverzeichnis:** `09_App/20261008_AMAVIO_One_App_Contract_Brand_Experience_Working`  
**Status:** **QA BESTANDEN / LOKAL / SYNTHETISCH / NICHT PRODUKTIV**

## Geprüfte Quellen

- freigegebene AMAVIO-One-Brandbook-Arbeitsfassung vom 30. September 2026;
- UPAEC 1.0 Locked, einschließlich Experience-/Interaction-System, App-/ACC-Integrationsarchitektur, Anti-08/15-Liste und Acceptance Gates;
- Product-Truth-V2-Autoritätsaddendum und Product-Owner-Approval-Protokoll;
- vorherige lokale App-Arbeitsfassung als ausschließlich technische Ausgangsbasis;
- neue Desktop- und Mobile-Brand-Experience-Designreferenzen dieses Pakets.

## Prüfbefehle

```bash
npm run qa:all
npm run qa:browser
```

`qa:all` führt Lint, 36 automatisierte Tests und den Vite-Build aus. `qa:browser` prüft Chromium und WebKit über drei Rollen, zwei Sprachen und zwei Viewports sowie Dialogfokus, Fokus-Rückgabe, mobile Navigation, Touchziele, Logo-Ladung, Overflow und ACC-Abwesenheit.

## Ergebnis

- `npm run qa:all`: PASS;
- Tests: 36 bestanden, 0 fehlgeschlagen;
- Build: PASS;
- `npm run qa:browser`: 24/24 Matrixprüfungen PASS;
- Browserkonsolenfehler: 0;
- visuelle Desktop-/Mobile-Prüfung: PASS;
- aktive ACC-Routen, ACC-Rollen oder `acc.html` im Build: 0;
- produktive Gates in den Schnittstellenverträgen: vollständig geschlossen.

## Während der QA behobene Befunde

1. Geerbte ACC-Projektionen und alte ACC-nahe Browserläufe wurden aus dem aktiven App-Paket entfernt und nachvollziehbar archiviert.
2. Der Browser-Evidenzlauf wurde auf die aktuelle lokale Playwright-Engine-Installation festgelegt, ohne Download oder externe Abhängigkeit.
3. Die Fokus-Rückgabe wurde nach den zwei vorgesehenen Renderzyklen gemessen und bestätigt.
4. Deutsche Nichtwirkungs-Hinweise in englischen Rollenansichten wurden für alle Routen durch ein bilinguales Vertragsfeld ersetzt.
5. Ein veralteter Vite-Transformcache wurde durch einen lokalen Neustart verworfen; der Abschlusslauf prüfte den aktuellen Quellstand.

## Visueller Befund

Die aktuelle Umsetzung folgt der freigegebenen Markenrichtung wesentlich klarer als die Ausgangsfassung: echtes AMAVIO-One-Logo, genehmigte Farbpalette, ruhige Flächen, editoriale Hierarchie, sparsame Icons, klare Verantwortungsanzeige und keine generische KPI-Dashboardästhetik. Desktop und Mobile bleiben erkennbar ein Produkt, ohne identische Layouts zu erzwingen.

## Offene Punkte und Annahmen

- Physische iOS-/Android-Hardware wurde in diesem Paket nicht erneut verwendet; WebKit/390×844 ist nur die lokale technische Referenz.
- Reale Rollenvalidierung bleibt bis zu einer ausdrücklichen Product-Owner-Wiederfreigabe samt Research-, Datenschutz-, Rekrutierungs-, Einwilligungs- und Testdatenprotokoll geschlossen.
- Produktive Identität, Datenhaltung, Mandantenfähigkeit, Graphmutationen, ACC-Anbindung, Intelligence, Deployment und Betrieb bleiben separate Einzelgates.
- Die gemeinsame synthetische Wahrheit validiert Kompatibilität, nicht eine produktive Integrationsarchitektur.

## Urteil

Das große Konsolidierungspaket ist als lokale App-Zielprojektion abnahmefähig. Es ist keine Produktionsfreigabe und keine Freigabe für reale Nutzer, reale Daten oder das getrennte ACC.

