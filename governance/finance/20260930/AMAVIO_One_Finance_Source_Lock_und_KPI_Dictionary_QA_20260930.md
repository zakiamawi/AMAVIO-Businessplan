# QA: AMAVIO One Finance Source Lock und KPI Dictionary

**Datum:** 30.09.2026  
**Pruefstatus:** Interner QA-Pass abgeschlossen; externe Zahlenfreigabe nicht erteilt

## 1. Gepruefte und erstellte Artefakte

Erstellt:

- `00_START_HIER/AMAVIO_One_Finance_Source_Lock_20260930.md`
- `00_START_HIER/AMAVIO_One_KPI_Dictionary_20260930.md`
- `00_START_HIER/AMAVIO_One_Finanzkennzahlen_Abweichungs_und_Entscheidungsliste_20260930.md`
- `90_QA/AMAVIO_One_Finance_Source_Lock_und_KPI_Dictionary_QA_20260930.md`

Nicht geaendert:

- Businessplan DOCX/PDF
- Original-Finanztool
- S2-Arbeitskopie
- fuehrende Finanztool-Abschlusskopie und Coach-Kopie
- Investorendeck, Executive Summary, Foerderunterlagen und sonstige externe Unterlagen

## 2. Werkzeug- und Pruefpfad

- Professional Spreadsheet Path: gebuendelte Workspace-Python-Runtime mit `openpyxl` fuer Read-only-Struktur-, Formel-, Wert-, Schutz- und Druckpruefung.
- Dokumentpruefung: `python-docx`, `pypdf`, Dateihashes und bestehende lokale QA-Berichte.
- Status des Spreadsheet-Pfads: installiert, callable und fuer diesen Read-only-Prueflauf smoke-tested.
- Keine Arbeitsmappe wurde gespeichert oder neu berechnet; keine Formel, kein Schutzstatus und kein Layout wurde veraendert.

## 3. Spreadsheet-QA

| Datei | Sheets sichtbar/gesamt | Formeln | Gespeicherte Formelfehler | geschuetzte Sheets | externe Links | Rolle |
|---|---:|---:|---:|---:|---:|---|
| Original `finanztool-2024-02-22-data.xlsx` | 10/22 | 6.406 | 0 | 9 | 0 | Original-/Template-Lineage, keine aktuelle Zahlenautoritaet |
| S2 `AMAVIO_Finanztool_Monatsmodell_S2_Tragbare_Preislogik_Arbeitskopie_20260822.xlsx` | 23/35 | 8.304 | 0 | 0 | 0 | Szenario-/Kapazitaetsquelle |
| Fuehrende Abschlusskopie 07.09.2026 | 10/22 | 6.587 | 0 | 9 | 0 | aktuelle integrierte Planungsquelle |

Print-Status der fuehrenden Abschlusskopie:

- Print Area `Umsatzplan Dienstleistungen`: `A1:BF44`
- Print Area `Eigene Nebenrechnungen`: `A1:BC19`
- Print Titles vorhanden fuer Umsatzplan, Rentabilitaetsvorschau, Liquiditaetsvorschau und Eigene Nebenrechnungen
- Keine externen Workbook-Links gefunden

## 4. Hash- und Lineage-Befund

- Fuehrende Abschlusskopie, aktueller SHA-256: `a5e77702a9dc175f3bd889e074a58cd9d69144759190195e46b8138f66457137`
- Coach-Kopie, SHA-256: `edf5acda67bda73bed582ac4576eeb573855dac04f0d0a092c5d8db6b2d5829e`
- Bestehende QA vom 07.09.2026 dokumentierte fuer die Abschlusskopie ebenfalls `edf5ac...`; der heutige Hash ist daher nicht identisch mit dem damaligen Lock.
- Zellweiser Read-only-Vergleich: keine Formel-, Eingabe- oder gespeicherte Wertabweichung.
- Strukturabweichung nur bei Freeze Panes:
  - `Rentabilitaetsvorschau`: Coach `AF11`, Abschlusskopie aktuell `D2`
  - `Eigene Nebenrechnungen`: Coach `L3`, Abschlusskopie aktuell `D3`
- Schutz- und Druckbereiche blieben im Vergleich unveraendert.

Bewertung: Die Abschlusskopie ist inhaltlich zahlen- und formelgleich mit der gesicherten Coach-Kopie und bleibt die nominell fuehrende aktuelle Quelle. Wegen des Hash-Drifts ist vor einer externen Releasebezeichnung eine neue menschlich bestaetigte, unveraenderliche Releasekopie mit neuem Hash erforderlich.

## 5. Zahlen- und Konsistenzpruefung

Bestanden:

- aktuelle Planumsatzreihe 237.700 / 390.500 / 661.400 EUR zwischen fuehrendem Finanztool und Businessplan V3.2 eingeordnet;
- alternative Reihen 93.500 / 269.000 / 442.000 EUR und 241.400 / 390.500 / 672.500 EUR als Szenario bzw. fruehere Modellstufe getrennt;
- alte EBITDA-Reihe nicht mit aktuellem Plan vermischt;
- 25.000 EUR Startfinanzierungsbedarf in 5.500 EUR Investitionen/GWG und 19.500 EUR Betriebsmittel reconciled;
- 12.500 EUR Eigenmittel und 12.500 EUR Darlehen als Modellannahme, nicht als Zusage, klassifiziert;
- Plan-Cash klar von vorhandenem Bankguthaben getrennt;
- keine Actual-, Contracted-, Pipeline-, ARR-, MRR-, Margen-, Burn-, Runway- oder Break-even-Zahl erfunden.

## 6. Claim- und Release-QA

- Keine Planwerte als Traction bezeichnet.
- Keine Finanzierung, Foerderung oder Bankkondition als zugesagt bezeichnet.
- Keine alte Preis- oder Umsatzlogik als aktuelle Zahlenbasis freigegeben.
- Founder-Erfahrung nicht als AMAVIO-Kundenumsatz oder AMAVIO-Retention-Nachweis behandelt.
- Fuer alle extern denkbaren Zahlen wurden Status-, Perioden- und Quellenpflichten festgelegt.

## 7. Offene Gates

1. Menschliche Bestaetigung der fuehrenden Datei und Erstellung einer neuen unveraenderlichen Releasekopie mit Hash.
2. Abschluss der GF-/Privat-/Sozialversicherungs- und Liquiditaetsbruecke.
3. Entscheidung ueber Finanzierungsverzoegerung und Mindestpuffer.
4. Cost-to-Serve- und Kostenklassifikation fuer Gross Margin, Contribution Margin und Break-even.
5. Vertragsregister, Fibu-/Bankabgleich und governte CRM-Pipeline fuer Actual, Contracted, Pipeline, ARR und MRR.
6. Explizite Freigabe, welche Planwerte in Investorendeck, Executive Summary und Foerder-/Bankunterlagen erscheinen duerfen.

## 8. QA-Ergebnis

**Interne Governance-Unterlagen: bestanden.**  
**Externe Zahlenfreigabe: nicht bestanden / noch nicht erteilt.**

Naechster kontrollierter Schritt: P0-Entscheidungen aus der Abweichungsliste schliessen; erst danach Investorendeck oder Executive Summary mit Zahlen aktualisieren.
