# ACC Calm but Capable V2 – QA

**Datum:** 03.10.2026  
**Prüfobjekt:** `20261003_AMAVIO_ACC_Calm_Capable_V2_Working`  
**Status:** abgeschlossen – lokale technische, interaktive, responsive und visuelle QA grün; Founder-Gesamtwirkung bleibt separat zu bewerten

## Zielablauf

`Heute → synthetischen Fall auswählen → Plan bearbeiten → Änderung simulieren → Arbeitsprodukt vorbereiten → Vollständigkeit prüfen → Entscheidung dokumentieren`

## Vorgesehener Prüfumfang

- HTML-, CSS- und JavaScript-Syntax;
- lokale Assets und Netzwerkfreiheit;
- fünf Arbeitsmodi und reale lokale Zustandsänderungen;
- AMAVIO- und Arbeitgeberperspektive;
- sechs Desktop-/Tablet-/Mobil-Viewports;
- Tastatur-/Labelbasis, Fokuszustände, Reduced Motion und mobile Navigation;
- visuelle Gegenprüfung mit Desktop- und Mobilreferenz;
- Demo-, Daten-, Wirkungs- und Produktgrenzen.

## Ergebnis

- **Static QA:** bestanden – fünf Arbeitsmodi, drei ACC-Bereiche, zwei Perspektiven, keine Netzwerk-/API-Pfade und keine fehlenden aktiven Assets.
- **In-App-Browser:** bestanden – Plan bearbeitet und neu geordnet, lokale Planvormerkung, Simulation, Sponsor-Entwurf, Vollständigkeitsprüfung, Kontextfrage, Entscheidung und Verlauf ausgeführt.
- **Konsole:** keine relevanten Fehler oder Warnungen.
- **Responsive QA:** bestanden bei 1505×1045, 1280×800, 1024×900, 768×900, 390×844 und 360×800 Pixeln.
- **Accessibility-Basis:** bestanden – Skip-Link, Landmarken, zugängliche Namen, Formularlabels, Fokuszustände, Reduced Motion, mobile Navigation und eine sichtbare H1 pro Ansicht.
- **HTTP:** Startseite 200, nicht vorhandener Pfad 404.
- **Rollenadaption:** Budgetperspektive öffnet den passenden synthetischen Budgetfall; Sponsor, HR und Standort behalten eigene Prioritäten.

## Geprüfte Kernjourney

1. Fall A-2233 geöffnet.
2. Verantwortung und Frist des ersten Planschritts geändert.
3. ersten Planschritt in der Reihenfolge verschoben.
4. Plan lokal vorgemerkt.
5. Ausfall der Wohnoption simuliert und drei Folgefelder geprüft.
6. Sponsor-Update mit Betreff, Entscheidungslage und Versandgrenze aufgebaut.
7. zwei fehlende Angaben über die Vollständigkeitsprüfung erkannt.
8. Rollenverantwortung über eine Kontextfrage abgefragt.
9. Entscheidung lokal dokumentiert und Arbeitsspur geprüft.
10. Fallliste, Suche und Budgetrollenwechsel geprüft.

## Im QA-Lauf korrigiert

1. Bei 1024 Pixeln erzeugte die Mindestbreite der zweispaltigen Tagesansicht einen horizontalen Überlauf. Die Ansicht wechselt nun bereits unter 1100 Pixeln in einen stabilen gestapelten Modus.
2. Auf Mobilgeräten waren nicht alle fünf Arbeitsmodi gleichzeitig sichtbar. Die mobile Typografie und Spaltenbreite wurden so angepasst, dass alle fünf Modi ohne Seitenüberlauf erreichbar sind.
3. Die mobile Zusammenfassung überlagerte im Full-Page-Render ihren ersten Inhalt. Sie ist nun bewusst einklappbar; die primäre Planvormerkung steht direkt nach dem Plan.

## Fidelity-Ledger

| Vergleichspunkt | Referenz | Umsetzung | Ergebnis |
|---|---|---|---|
| Grundarchitektur | Navy-Seitenleiste, echte weiße Arbeitsfläche, Prioritäten links, Fall rechts | identische Containerlogik ohne Kartenraster | erfüllt |
| Arbeitsmodi | fünf ruhige Texttabs mit Goldunterstreichung | Verstehen, Planen, Simulieren, Vorbereiten, Verlauf in gleicher Reihenfolge | erfüllt |
| Plananatomie | fünf offene Zeilen mit Nummer, Rolle, Frist, Abhängigkeit und Bearbeitung | vollständig code-nativ und interaktiv umgesetzt | erfüllt |
| Kontextleiste | schmale Zusammenfassung mit drei Aussagen und goldener Aktion | Desktop identisch; mobil kontrolliert einklappbar | erfüllt, responsive Abweichung beabsichtigt |
| Typografie/Farbe | Serif-Haupttitel, ruhige UI-Typografie, Navy/Weiß/Gold | bestehende lokale Fraunces-/Geist-Fonts und gesperrte Farbwerte verwendet | erfüllt |
| Mobil | direkte Fallansicht, fünf Modi, kompakter Plan, prominente Planaktion | gleiche Hierarchie ohne Worklist und ohne Seitenüberlauf | erfüllt |
| Funktionswirkung | Intelligenz durch Planqualität und Abhängigkeiten sichtbar | Plan, Simulation, Entwürfe, Prüfung und Verlauf verändern echten lokalen UI-Zustand | erfüllt |

## Above-the-fold-Copy-Diff

Die erlaubte sichtbare Kopie aus der Referenz wurde beibehalten. Die Umsetzung ergänzt ausschließlich die bereits freigegebenen Reifegradgrenzen `Bearbeitbarer Vorschlag · nichts wird automatisch ausgeführt` und `keine Systemanbindung`. Keine KI-Markenbegriffe oder neuen Produktclaims wurden hinzugefügt.

## Visuelle Belege

- Desktop-Referenz: `design/ACC_CALM_CAPABLE_V2_DESKTOP_REFERENCE_20261003.png`
- Desktop-Render: `QA/v2-screens/desktop-native-1505-plan.png`
- Mobil-Referenz: `design/ACC_CALM_CAPABLE_V2_MOBILE_REFERENCE_20261003.png`
- Mobil-Render: `QA/v2-screens/mobile-390-plan.png`

Die Referenzen und die finalen Renderings wurden jeweils mit `view_image` direkt verglichen. Es bestehen keine offenen materiellen Designabweichungen. Die mobile Einklappung der Zusammenfassung ist eine bewusste funktionale Anpassung an den realen 390-Pixel-Viewport.

## Reproduzierbare Befehle

```bash
node QA/static-check.js
QA_BASE=http://127.0.0.1:4191 node QA/browser-check.js
```

## Grenzen

Die QA belegt nur die lokale synthetische Konzeptdemo. Sie ist kein Nachweis für produktive KI, fachliche Wirkung, Datenschutz, Security, Authentifizierung, Mandantentrennung, Hosting, Betrieb oder vollständige Barrierefreiheitskonformität.
