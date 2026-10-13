# ACC Product Design Reset – QA

**Datum:** 03.10.2026  
**Prüfobjekt:** `20261003_AMAVIO_ACC_Product_Design_Reset_Working`  
**Status:** abgeschlossen – lokal grün; Founder-Gesamtwirkung bleibt separat zu bewerten

## Prüfumfang

- HTML-, CSS- und JavaScript-Syntax;
- lokale Assets und Netzwerkfreiheit;
- Kernjourney Priorität → Begründung → Auswirkung/Entscheidung → nächster Schritt;
- AMAVIO- und Arbeitgeberperspektive einschließlich Sponsor, HR, Standort und Budget;
- Desktop, Tablet und Mobile;
- Tastatur-/Labelbasis, reduzierte Bewegung, Fokuszustände und mobile Navigation;
- sichtbare Demo-, Daten- und Wirkungsgrenzen;
- visuelle Gegenprüfung mit der Referenz unter `design/`.

## Ergebnis

- **Static QA:** bestanden – drei Arbeitsbereiche, zwei ACC-Perspektiven, keine Netzwerk-/API-Pfade, keine fehlenden aktiven Assets.
- **In-App-Browser:** bestanden – Kernjourney, Belege, Folgenabschätzung, lokale Entscheidung, Kontextfrage, Fallsuche, Erkenntnisprüfung und Arbeitgeber-Rollenadaption manuell ausgeführt.
- **Konsole:** keine Fehler oder Warnungen im geprüften lokalen Ablauf.
- **Responsive QA:** bestanden bei 1440×1000, 1280×720, 1024×900, 768×900, 390×844 und 360×800 Pixeln; kein horizontaler Überlauf.
- **Interaktions-QA:** bestanden – Navigation, Fallwechsel, Fallsuche, lokale Entscheidung, Auswirkungsprüfung, Arbeitgeberrollen und mobile Navigation.
- **Accessibility-Basis:** bestanden – Skip-Link, Landmarken, zugängliche Namen, Formularlabels, Fokuszustände, Reduced Motion und genau eine sichtbare H1 pro Ansicht geprüft.
- **HTTP:** Startseite 200 und nicht vorhandener Pfad 404.

## Im QA-Lauf korrigiert

1. Die Budgetperspektive zeigte zunächst einen fachfremden Wohnraumfall. Die Filterlogik greift nun auf alle passenden Fälle zu und öffnet den synthetischen Budgetfall A-2285.
2. Das Suchfeld war semantisch über ein umschließendes Label benannt, wurde vom strengeren Regressionstest mobil aber nicht akzeptiert. Ein expliziter zugänglicher Name wurde ergänzt.
3. Die Fallauswahl wurde von einem Toggle-Zustand auf `aria-current` umgestellt, damit Screenreader sie als Navigation zum aktiven Fall und nicht als Checkbox interpretieren.

## Visuelle Gegenprüfung

Verglichen wurden:

- `design/ACC_PRODUCT_DESIGN_RESET_REFERENCE_20261003.png`
- `QA/reset-screens/desktop-1440-today.png`

**Hohe Übereinstimmung:** ruhige Weißraumarchitektur, feste Navy-Seitenleiste, goldene Prioritätsmarkierung, klare Zwei-Spalten-Arbeitsfläche, typografische Hierarchie, ein dominanter Entscheidungsfall und zurückhaltende Folgeschritte.

**Bewusste Abweichungen:** keine doppelte obere Navigation; stattdessen nur die Seitenleiste. Zusätzlich sichtbar sind Demo-Stichtag, aktives Mandat, lokale Verlaufsgrenze und aussagekräftige Profilrolle. Die Umsetzung ist dadurch operativer und reifegradklarer als die reine Konzeptreferenz.

## Reproduzierbare Befehle

```bash
node QA/static-check.js
QA_BASE=http://127.0.0.1:4191 node QA/browser-check.js
```

## Grenzen

Die Prüfung belegt ausschließlich die lokale Konzeptdemo. Sie ist kein Nachweis für produktive Sicherheit, Datenschutz, Authentifizierung, Mandantentrennung, Hosting, Barrierefreiheitskonformität, Datenqualität oder fachliche Wirkung.
