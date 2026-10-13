# Release P – Designsystem

Stand: 13.10.2026

## Referenzen

- Desktop: `ACC_RELEASE_P_EMPLOYER_READINESS_DECISION_CONCEPT_20261013.png`
- Mobil: `ACC_RELEASE_P_EMPLOYER_READINESS_MOBILE_CONCEPT_20261013.png`

Die Referenzen wurden als vollständige Arbeitsoberflächen erzeugt und vor der Implementierung als Struktur- und Hierarchievorgabe verwendet. Die sichtbare Oberfläche bleibt vollständig code-nativ.

## Gestaltungsziel

Ruhige europäische B2B-Operationsoberfläche mit editorialer Klarheit. Intelligenz zeigt sich in der Qualität der Entscheidungsvorlage, nicht durch sichtbare KI-Module, Chatflächen, leuchtende Effekte oder technische Interna.

## Grundsystem

| Element | Festlegung |
|---|---|
| Hintergrund | echtes Weiß `#ffffff`, Arbeitsfläche `#f7f8fa` |
| Primärfarbe | AMAVIO Navy `#0b1d38` / `#0f2444` |
| Akzent | zurückhaltendes Gold `#b39743` |
| Überschriften | Fraunces, editorial und sparsam |
| UI und Fließtext | Geist, kompakt und gut lesbar |
| Radius | 3 px, keine weichen KI-Karten |
| Schatten | nur für Dialog und mobile Navigation |
| Container | offene Bänder, Tabellen und Rails statt verschachtelter Karten |

## Informationshierarchie

1. Startversprechen und belegter Status.
2. Einer von drei Ausnahmewegen.
3. Evidence-basierter Readiness-Zustand.
4. zentrale Entscheidungsfrage und Betriebsfolge.
5. Handlungsoptionen im direkten Vergleich.
6. konkrete AMAVIO-Intervention mit Human Gate oder Operations-Nachweis.
7. Arbeitsprodukte.
8. Stabilisierung nach dem Start.

## Dichte und Sprache

- Schriftgrößen bleiben bewusst kompakt; große Typografie ist auf Seitentitel und fachliche Entscheidungsfrage begrenzt.
- Keine technischen IDs, Kernelbegriffe, Policyversionen, Providerbezeichnungen oder QA-Informationen in der operativen Oberfläche.
- Keine Bezeichnung „Sponsor“ in der sichtbaren Arbeitgeberoberfläche; die Funktion heißt „Gesamtsteuerung“.
- Kein allgemeiner Score. Zustände werden mit einer benannten Bedingung und einer Evidenzgrundlage erklärt.

## Responsive Verhalten

- Desktop ab 901 px: feste Navigation, zweispaltiger Entscheidungsraum und Optionsvergleich als Tabelle.
- Tablet bis 900 px: ausklappbare Navigation, einspaltige Entscheidung mit weiterhin kompakter Vergleichsstruktur.
- Mobil bis 680 px: 112-px-Kopfbereich, einspaltige Journey, Optionsvergleich als lesbare Auswahlkarten, keine horizontale Scrollfläche.
- Touchziele mindestens 44 px.
- `prefers-reduced-motion` reduziert alle Übergänge.
