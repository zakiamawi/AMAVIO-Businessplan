# AMAVIO One CRM – R3.17 QA: Einheitliche globale Suche

**Datum:** 13.10.2026  
**Prüfstand:** R3.17-Arbeitskopie  
**Reifegrad:** lokal geprüft; nicht produktiv freigegeben

## Prüfumfang

- Build und statisches QA-Gate;
- Unit-, Vertrags-, Komponenten-, Integrations- und Persistenztests;
- E2E für synthetischen Core sowie integrierte Importdaten;
- globale Suche nach importierter Organisation und importiertem Kontakt;
- Zielnavigation und reguläre schreibgeschützte Detailansicht;
- Kontaktsperre `Nicht kontaktieren`;
- Desktop-, Zwischenbreiten-, Tablet- und Mobile-Ansichten;
- Tastatur, Shortcut, Escape, Focus-Trap und Focus-Rückgabe;
- echter 200-Prozent-Zoom;
- Browserkonsole und horizontales Overflow;
- Prüfung der unveränderten Produktiv- und Integrationssperren.

## Soll-Ergebnis

- `Adesso SE` öffnet aus der globalen Suche den Reiter `Organisationen` und die importierte Organisationsdetailansicht.
- `Kristin Assmann` öffnet den Reiter `Kontakte` und zeigt `Nicht kontaktieren`.
- Unter zwei Zeichen erfolgt keine Importabfrage.
- Importfehler werden als Teilfehler erklärt und lassen lokale Treffer nutzbar.
- Kein Pool- oder Staging-Reiter wird sichtbar.
- Kein Versand, keine Cloud-Synchronisierung und kein Supabase-Pfad werden aktiviert.

## Ergebnisprotokoll

**Gesamtergebnis: PASS im definierten lokalen R3.17-Scope.**

| Prüfung | Ergebnis |
|---|---|
| Build | PASS; Vite-Produktionsbuild ohne Fehler |
| statisches QA-Gate | PASS |
| Unit-Tests | 33/33 PASS |
| Vertragstests | 16/16 PASS |
| Komponententests | 11/11 PASS |
| Integrationstests | 6/6 PASS |
| Persistenztests | 1/1 PASS |
| Logik-/Persistenzsumme | 67/67 PASS |
| Core-E2E | PASS; 20 zusammenhängende lokale Kernabläufe |
| R3.17-Import-/Such-E2E | PASS |
| Browser-QA | PASS |
| Browserkonsole | keine Fehler |
| Außenwirkung | keine; Versand, Cloud, Supabase, App und ACC deaktiviert |

## Browser- und Accessibility-Nachweis

- 1600, 1280, 1024, 768, 430 und 390 Pixel ohne horizontales Seiten-Overflow;
- acht zentrale Arbeitsflächen pro Breite geprüft;
- Tastatur, `Strg K`, Escape, Focus-Trap und explizite Focus-Rückgabe bestanden;
- echter 200-Prozent-Zoom mit Reflow bestanden;
- importierte Organisation aus der globalen Suche geöffnet und im richtigen Reiter geprüft;
- 74 aktuelle QA-Screenshots im R3.17-Screenshotordner.
- abschließende sichtbare In-App-Browser-Prüfung auf `http://127.0.0.1:4401/`: `Adesso SE` über die globale Suche geöffnet; Organisationsreiter, schreibgeschützte Detailansicht und leere Fehlerkonsole bestätigt.

Automatisch erzeugtes Ergebnis: `QA/CRM_R3_17_UNIFIED_GLOBAL_SEARCH_BROWSER_RESULT_20261013.json`.

Repräsentativer Screenshot: `QA/Screenshots/20261013-r3-17-unified-global-search/desktop-1280-globale-suche-importierte-organisation.png`.

## Festgestellte und behobene Regression während der QA

Die asynchrone Ergänzung importierter Suchtreffer erzeugte zusätzliche App-Re-Renders. Dadurch konnten instabile Callback-Referenzen die lokale Pipeline-Phasenauswahl zurücksetzen und die Focus-Rückgabe des Suchdialogs unzuverlässig machen. Behoben wurden:

- stabiler Schließ-Callback für die kanonische Detailansicht;
- explizit markierte Suchauslöser für Desktop und Mobile;
- deterministische Focus-Rückgabe nach Schließen des Suchdialogs;
- Browserprüfung wartet auf den tatsächlich vollzogenen Fokuswechsel statt nur auf das Entfernen des Dialog-DOM.

Der anschließend wiederholte Core-E2E- und Browser-Gesamtlauf war vollständig grün.

## Reifegrenze

Der Nachweis gilt ausschließlich für den lokalen CRM-Prototyp mit synthetischem Core und schreibgeschützt eingebundenen Importdaten. Er ist keine Produktions-, Security-, Datenschutz-, Supabase-, Versand- oder Integrationsfreigabe.

