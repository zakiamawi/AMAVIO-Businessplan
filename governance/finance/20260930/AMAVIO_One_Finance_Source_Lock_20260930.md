# AMAVIO One Finance Source Lock

**Stichtag:** 30.09.2026
**Status:** Interner Quellen- und Zahlenfreeze; keine externe Freigabe
**Zweck:** Verbindliche Arbeitsbasis fuer Investorendeck, Executive Summary, Businessplan- und Foerderunterlagen. Dieser Freeze aendert keine Quelldatei und ersetzt keine fachliche Freigabe.

## 1. Fuehrende Quellen

### Businessplan

Fuehrende Businessplan-Fassung:

`01_Businessplan/20260907_Gruendungszuschuss_Endpruefung_V3_2/AMAVIO_One_Businessplan_Gruendungszuschuss_Interner_Abgabekandidat_V3_2_20260907.docx`

- SHA-256: `b3a37f43b9f6defc0fbb1703cfeade32f5d1905aba5ac690d7beac93fb00c36f`
- Status: interner Abgabekandidat; nicht als extern freigegebene Endfassung behandeln
- Referenz-PDF: gleichnamige PDF, SHA-256 `5428f0e7ee43dd1813bc3bb8f24d85870143a1caff93f8df920e61a14d1fb920`

### Finanzplanung

Fuehrende integrierte Finanzdatei:

`02_Finanztool/20260907_Abschlusspruefung/AMAVIO_One_Finanztool_Abschlusskopie_Tilgungsentscheidung_20260907.xlsx`

- aktueller SHA-256 am 30.09.2026: `a5e77702a9dc175f3bd889e074a58cd9d69144759190195e46b8138f66457137`
- Status: fuehrende integrierte Planungsquelle; Zahlen sind PLAN, nicht Ist oder Traction
- Besonderheit: Der Hash weicht vom im QA-Bericht vom 07.09.2026 dokumentierten Hash ab. Der Read-only-Vergleich mit der Coach-Kopie ergab keine Abweichungen bei Formeln, Eingaben oder gespeicherten Werten. Festgestellt wurden nur zwei Freeze-Pane-Aenderungen auf `Rentabilitaetsvorschau` und `Eigene Nebenrechnungen`. Die Hash-Abweichung bleibt dennoch als Governance-Hinweis offen.

Referenz fuer die dokumentierte Zahlenidentitaet:

`02_Finanztool/20260907_Coach_Entwurfspruefung/AMAVIO_One_Finanztool_Coach_Entwurf_20260907.xlsx`

- SHA-256: `edf5acda67bda73bed582ac4576eeb573855dac04f0d0a092c5d8db6b2d5829e`
- Rolle: gesicherte Lineage- und Vergleichsquelle, nicht neue fuehrende Arbeitsdatei

### Einzuordnende Referenzquellen

`02_Finanztool/AMAVIO_Finanztool_Monatsmodell_S2_Tragbare_Preislogik_Arbeitskopie_20260822.xlsx`

- SHA-256: `70c99baafeb23ef9e73721746fba3b85abe313373ca3ffaa340f8225f7fba1d1`
- Rolle: Szenario-, Kapazitaets- und Entwicklungskorridor; nicht aktuelle integrierte Zahlenautoritaet

`02_Finanztool/finanztool-2024-02-22-data.xlsx`

- SHA-256: `02fe29275e504c09c9c0f533870b1c6a05343a171ee2f13492fac0aecf228933`
- Rolle: Original-/Template-Lineage; bereits befuellte Altwerte sind keine aktuelle AMAVIO-Zahlenbasis

## 2. Verbindliche Statuslogik

| Status | Bedeutung | Aktueller AMAVIO-Nachweis |
|---|---|---|
| **ACTUAL / IST** | Buchhalterisch oder durch Bank-/Vertragsbeleg realisierter Wert | In den geprueften Quellen kein belastbarer AMAVIO-Umsatz-, Cash-, Burn- oder Margenwert gefunden |
| **CONTRACTED / BEAUFTRAGT** | Rechtswirksam beauftragtes, noch nicht zwingend realisiertes Netto-Auftragsvolumen | Kein freigegebener Vertrags- oder Auftragsbestand mit Wertnachweis gefunden |
| **PIPELINE** | Nach definierter CRM-Logik qualifizierte Verkaufschancen; gewichtet nur mit freigegebener Methodik | Keine governte Pipeline-Liste, Gewichtungsmethodik oder freigegebene Summe gefunden |
| **PLAN** | In der fuehrenden integrierten Finanzplanung modellierte Erwartung | 237.700 / 390.500 / 661.400 EUR Umsatz fuer die drei rollierenden Planjahre |
| **SCENARIO** | Sensitivitaet, Korridor oder fruehere Modellvariante | 93.500 / 269.000 / 442.000 EUR sowie 241.400 / 390.500 / 672.500 EUR |
| **TARGET / ZIEL** | Gesondert beschlossener Zielwert ausserhalb des operativen Plans | Kein separat freigegebener Zielwert gefunden; PLAN darf nicht als TARGET umetikettiert werden |

## 3. Fuehrende Planwerte

Planperioden:

- Planjahr 1: Oktober 2026 bis September 2027
- Planjahr 2: Oktober 2027 bis September 2028
- Planjahr 3: Oktober 2028 bis September 2029

| Kennzahl | Planjahr 1 | Planjahr 2 | Planjahr 3 | Status |
|---|---:|---:|---:|---|
| Umsatz | 237.700 EUR | 390.500 EUR | 661.400 EUR | PLAN |
| Fremdleistungen | 28.524 EUR | 46.860 EUR | 79.368 EUR | PLAN; modelliert mit 12 % vom Umsatz |
| Personalaufwand | 61.000 EUR | 172.200 EUR | 292.500 EUR | PLAN |
| Betriebliche Aufwendungen | 102.418,66 EUR | 247.136,00 EUR | 382.874,00 EUR | PLAN |
| Ergebnis vor KSt/SolZ/GewSt | 106.099,84 EUR | 95.846,50 EUR | 198.562,14 EUR | PLAN; nicht als EBITDA bezeichnen |
| Steuerreserve | 33.708,83 EUR | 31.599,92 EUR | 58.662,00 EUR | PLAN |
| Rechnerische Bruecke nach Steuerreserve | 72.391,01 EUR | 64.246,58 EUR | 139.900,14 EUR | PLAN; kein Jahresabschlusswert |
| Summe monatlicher Cashflows | 76.292,77 EUR | 53.600,90 EUR | 125.464,79 EUR | PLAN |
| Niedrigster kumulierter Liquiditaetsstand | 10.843,65 EUR | 75.795,62 EUR | 127.062,48 EUR | PLAN |
| Liquiditaet zum Planjahresende | 88.792,77 EUR | 142.393,67 EUR | 267.858,45 EUR | PLAN |

## 4. Kapital- und Finanzierungslogik

- Geplanter Startfinanzierungsbedarf: **25.000 EUR**
- Investitionen/GWG: **5.500 EUR**
- Betriebsmittel: **19.500 EUR**
- Modellierte Finanzierungsstruktur: **12.500 EUR Eigenmittel** plus **12.500 EUR Hausbankdarlehen als Planungsszenario**
- Darlehensannahme: 5,26 % p. a., zehn Jahre Laufzeit, Auszahlung Oktober 2026, 15 tilgungsfreie Planmonate, Tilgungsbeginn Januar 2028

Diese Angaben sind Planannahmen. Sie belegen weder eine Finanzierungszusage noch Auszahlung, Foerderfaehigkeit oder bankseitige Konditionsfreigabe. Der Startfinanzierungsbedarf ist nicht mit einer Investor-Runde gleichzusetzen.

## 5. Einordnung der Umsatzfamilien

### 93.500 / 269.000 / 442.000 EUR

Konservativer, gruendergefuehrter Basiskorridor beziehungsweise Untergrenze aus einer frueheren Businessplan-/S2-Logik. Die dazu gehoerenden EBITDA-Werte 34.950 / 120.320 / 169.300 EUR duerfen nur zusammen mit diesem Alt-/Untergrenzen-Szenario gezeigt werden. Nicht fuehrender Plan und keine Traction.

### 241.400 / 390.500 / 672.500 EUR

S2-Aufbau- und Kapazitaetsszenario vom 22.08.2026. Es beruhte unter anderem auf frueheren Paketpreisen und einer Team-/Portal-/App-Aufbaulogik. Nicht fuehrender Plan; durch die spaetere integrierte Planung abgeloest.

### 237.700 / 390.500 / 661.400 EUR

Aktuelle integrierte Umsatzplanung aus Finanztool 07.09.2026 und Businessplan V3.2. Sie basiert auf der spaeter konsolidierten Leistungs- und Preislogik. Ausschliesslich als PLAN mit Periode und Quellenstand verwenden.

## 6. Keine Traction

Folgende Angaben sind ausdruecklich **keine Ist-Traktion**:

- alle drei Umsatzreihen dieses Memos;
- Paketpreise und Mengenannahmen;
- geplante monatliche Monitoring-Erloese;
- geplante Ergebnisse, Cashflows und Liquiditaetsstaende;
- 25.000 EUR Startfinanzierungsbedarf und die modellierte 12.500/12.500-Finanzierung;
- die fruehere berufliche Umsetzungserfahrung des Gruenders mit rund 40 internationalen Fachkraeften an zehn Standorten; sie ist ein Erfahrungsbeleg, aber kein AMAVIO-Kundenumsatz.

## 7. Freigaberegel

Bis zur dokumentierten Entscheidung ueber die offenen Punkte gilt:

1. In externen Unterlagen nur die Reihe 237.700 / 390.500 / 661.400 EUR als **Planumsatz** verwenden.
2. Keine Ist-, Vertrags-, Pipeline-, ARR-, MRR-, Margen-, Burn-, Runway-, Break-even- oder EBITDA-Zahl behaupten.
3. Den Startfinanzierungsbedarf von 25.000 EUR nur als aktuellen Planwert nennen; keine Zusage und kein Investor-Ask daraus ableiten.
4. Alte Umsatz- oder EBITDA-Reihen nur in internen Vergleichs- und Entscheidungstabellen zeigen.
5. Vor externer Freigabe Hash-Abweichung, GF-/Privat-/SV-Bruecke, Kundenverzoegerung und Cost-to-Serve fachlich schliessen.

