# ACC Calm but Capable V2

**Stand:** 03.10.2026  
**Status:** lokale Konzeptdemo; ausschließlich synthetische Fälle; nicht veröffentlicht; nicht deployt

## Produktentscheidung

V1 löste die visuelle Überladung, verbarg dabei aber zu viel Produktleistung. V2 hält das ruhige Designsystem und macht die Ergebnisse der unterstützenden Logik innerhalb des ausgewählten Falls sichtbar. Die Intelligenz erhält keine eigene Produktbühne. Sie zeigt sich in Priorisierung, Abhängigkeiten, Planvorschlägen, Folgenabschätzung, Arbeitsprodukten und nachvollziehbarer Arbeitsspur.

## Kernjourney

`Priorität → Fall verstehen → Plan bearbeiten → Änderung simulieren → Arbeitsprodukt vorbereiten → Entscheidung dokumentieren`

## Fünf Arbeitsmodi

1. **Verstehen:** Situation, Abhängigkeiten, fehlende Angaben, Belege, Vollständigkeitsprüfung und Kontextfrage.
2. **Planen:** fünfstufiger bearbeitbarer Ablauf mit Verantwortung, Frist und Abhängigkeit; Reihenfolge veränderbar; lokale Vormerkung.
3. **Simulieren:** ausgewählte Änderung mit Vorher-/Nachher-Bild und drei konkreten Folgefeldern; lokale Variante ohne Prognoseclaim.
4. **Vorbereiten:** Rückfrage an den Standort, Sponsor-Update oder Ankunftsinformation als editierbarer lokaler Entwurf; kein Versand.
5. **Verlauf:** menschliche Entscheidung und chronologische lokale Arbeitsspur.

## Designsystem

- tiefes Navy für Struktur;
- echtes Weiß für Arbeitsfläche;
- warmes Gold nur für Auswahl, Priorität und primäre Handlung;
- Fraunces für inhaltliche Hauptüberschriften, Geist für UI und Text;
- Listen, Rails und offene Flächen statt Kartenraster;
- Funktionsnavigation als ruhige Textleiste mit Goldunterstreichung;
- keine Gradienten, Glows, KI-Badges oder englischen Modulnamen.

## Referenzen

- Desktop: `design/ACC_CALM_CAPABLE_V2_DESKTOP_REFERENCE_20261003.png`
- Mobil: `design/ACC_CALM_CAPABLE_V2_MOBILE_REFERENCE_20261003.png`
- V1-Rückfallbasis: `archive/20261003_product_design_reset_v1_baseline/`

## Technische Struktur

- `index.html` enthält die semantische Arbeitsfläche und alle fünf Arbeitsmodi.
- `assets/calm-capable-v2.css` enthält das bestehende Reset-Designsystem plus V2-Komponenten und responsive Regeln.
- `assets/calm-capable-v2.js` enthält synthetische Fälle, Plan-, Simulations-, Entwurfs-, Rollen- und Verlaufslogik.
- Keine Bibliothek, kein Framework und kein Netzwerkaufruf wurden ergänzt; die bestehende statische Architektur bleibt bewusst erhalten.

## Reifegradgrenze

Alle Funktionen sind lokale deterministische Demonstrationslogik. Es gibt keine generative KI, Prognose, automatische Entscheidung, Authentifizierung, Datenbank, App-/CRM-/HRIS-Anbindung, Nachricht, Buchung, Freigabe, Veröffentlichung oder produktive Mandantentrennung.
