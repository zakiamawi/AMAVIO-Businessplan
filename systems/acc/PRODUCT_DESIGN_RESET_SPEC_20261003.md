# ACC Product Design Reset

**Stand:** 03.10.2026  
**Status:** lokale, synthetische Arbeitskopie; nicht veröffentlicht; nicht deployt  
**Ziel:** ruhige operative Arbeitsoberfläche mit unsichtbar integrierter Intelligenz

## Produktentscheidung

Die frühere Release-B/C-Oberfläche wurde fachlich nicht verworfen, aber aus der aktiven Präsentationsfläche entfernt. Ihre Funktionen waren zu stark als einzelne KI-Module inszeniert. Die aktive Oberfläche folgt nun einer einzigen operativen Logik:

1. Was braucht heute Aufmerksamkeit?
2. Warum ist es jetzt relevant?
3. Welche Entscheidung ist verantwortbar?
4. Welche Auswirkung hätte eine Änderung?
5. Was geschieht danach?

Die Intelligenz darf priorisieren, verdichten, erklären und Auswirkungen lokal simulieren. Sie spricht nicht über sich selbst, trägt keine Produktnamen und führt keine Aktion automatisch aus.

## Sichtbare Informationsarchitektur

- **Heute:** priorisierte Vorgänge und aktiver Entscheidungsfall.
- **Fälle:** ruhige, durchsuchbare Arbeitsliste aller synthetischen Standortfälle.
- **Erkenntnisse:** verständliche Muster mit menschlichem Prüfgate.
- **Perspektive:** AMAVIO Operations oder Arbeitgeber; innerhalb des Arbeitgebers Sponsor, HR, Standort und Budget.

Die drei externen App-Rollen Fachkraft, Wohnanbieter und lokaler Partner sind keine ACC-Navigation und bleiben getrennt.

## Gestaltungsprinzipien

- echte Arbeitsfläche statt Dashboard-Sammlung;
- eine dominante Aufgabe pro Ansicht;
- klare Typografie und viel Weißraum;
- tiefes Navy als Strukturfarbe, warmes Gold nur für Priorität und Handlung;
- keine Gradienten, keine leuchtenden KI-Flächen, keine dekorativen Statuskarten;
- Erklärung und Evidenz erst bei Bedarf;
- lokale, synthetische und wirkungslose Aktionen unmittelbar benennen.

## Referenz und Umsetzung

- visuelle Referenz: `design/ACC_PRODUCT_DESIGN_RESET_REFERENCE_20261003.png`
- aktive Umsetzung: `index.html`, `assets/product-design-reset.css`, `assets/product-design-reset.js`
- Rückfallbasis: `archive/20261003_release_bc_product_design_reset_baseline/`

Die Referenz wurde als Richtung, nicht als pixelgenaue Vorlage verwendet. Bewusste Abweichungen: Die Umsetzung ergänzt eine zugängliche mobile Navigation, eine Arbeitgeber-Rollenlinse, eine Fallsuche, einen lokalen Verlauf und sichtbare Demo-Grenzen. Dafür wurde eine zweite obere Navigation vermieden, um keine konkurrierenden Wege zu erzeugen.

## Nicht umgesetzt

- keine externe oder generative KI;
- keine echte Prognose oder automatisierte Entscheidung;
- keine Registrierung, Authentifizierung oder Rechteprüfung;
- keine App-, CRM-, HRIS-, Backend- oder Datenbankanbindung;
- keine Nachricht, Buchung, Freigabe, Dateiübertragung oder Veröffentlichung;
- keine realen Personen-, Arbeitgeber-, Objekt- oder Partnerdaten.
