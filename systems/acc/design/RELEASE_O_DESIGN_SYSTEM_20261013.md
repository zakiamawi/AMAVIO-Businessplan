# Release O – konsolidiertes UI-Designsystem

## Zielwirkung

Ruhige operative Arbeitsoberfläche mit unsichtbar integrierter Intelligenz: fachlich belastbar, nicht CRM-artig, nicht als KI-Dashboard inszeniert und ohne Boxenwüste.

## Grundsystem

- **Navigation:** tiefes AMAVIO Navy; klare aktive Goldkante; höchstens vier Operations- beziehungsweise zwei Arbeitgeberziele.
- **Arbeitsfläche:** weißes Papier auf sehr hellem Canvas; feine Linien statt dekorativer Schatten.
- **Typografie:** Fraunces für Seiten- und Produkttitel, Geist für Bedienung und Fachtext.
- **Akzent:** gedecktes AMAVIO Gold ausschließlich für Fokus, aktive Stufe und primäre Handlung.
- **Statusfarben:** zurückhaltendes Rot, Grün und Ocker mit verständlichem Text; Farbe ist nie der einzige Informationsträger.
- **Geometrie:** 4-Pixel-Radius, klare Rasterkanten, ausreichend vertikaler Raum und keine pillenförmige KI-Ästhetik.

## Informationshierarchie

1. Seitentitel, Arbeitsfrage und dauerhafte Demogrenze.
2. Fünfstufige Golden Journey.
3. Eine dominante Arbeitsaufgabe.
4. Schmaler Kontext mit Verantwortung, Frist, Abhängigkeit und nächstem Ergebnis.
5. Ausnahmewege und Nachweise erst unterhalb der Hauptarbeit.

## Wiederverwendete Komponenten

- App-Shell mit Sidebar und Topbar
- Rollenwechsel und Arbeitgeber-Arbeitsbereich
- Golden-Journey-Stepper
- Evidenzvergleich
- Context Strip und Context Rail
- Action Panel mit begründungspflichtigen Formularen
- Scenario Switch für Ausnahmewege
- Arbeitsprodukt-Vorschau
- Pilotmetriken und lokaler Reset
- Queue, Suche und Filter
- Programm-Master/Detail

## Responsive Vertrag

- **Desktop ab 1121 px:** Hauptarbeit plus schmaler Kontext.
- **Tablet 821–1120 px:** reduzierte Kopfzeile, stabile Zweispaltenarbeit.
- **Mobil bis 820 px:** off-canvas Navigation, einspaltige Arbeit, horizontal scrollbare Journey.
- **Kleinmobil bis 560 px:** Formulare, Kennzahlen und Aktionen vollständig einspaltig; keine Pflichttexte abgeschnitten.

## Referenzbilder

- `design/reference/release-o-operations-concept.png`
- `design/reference/release-o-employer-concept.png`

Die Bilder sind visuelle Richtungsreferenzen, keine eigenständige Produktschicht. Maßgeblich ist die browsergeprüfte Implementierung.
