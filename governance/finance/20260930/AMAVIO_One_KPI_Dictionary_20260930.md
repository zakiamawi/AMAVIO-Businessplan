# AMAVIO One KPI Dictionary

**Stichtag:** 30.09.2026
**Status:** Interne Governance-Arbeitsfassung; keine externe Zahlenfreigabe

## Statuslabels

`ACTUAL` = realisiert und belegt; `CONTRACTED` = rechtswirksam beauftragt; `PIPELINE` = nach freigegebener CRM-Methodik qualifiziert; `PLAN` = integrierte Finanzplanung; `SCENARIO` = Sensitivitaet/Variante; `TARGET` = separat beschlossener Zielwert.

## KPI-Definitionen

| KPI | Verbindliche Definition und Formel | Zulaessige Quelle | Aktuell belegbarer Wert / Zeitraum | Status | Grenze fuer externe Aussagen |
|---|---|---|---|---|---|
| **Umsatz / Revenue** | Periodengerecht realisierter Nettoerloes aus AMAVIO-Leistungen, ohne Umsatzsteuer und ohne lediglich durchlaufende Fremdkosten. Plan: Summe der im Modell angesetzten Netto-Leistungserloese je Periode. | ACTUAL: Finanzbuchhaltung, Rechnungen, Bankabgleich. CONTRACTED: unterschriebene Vertraege/Auftraege. PLAN: fuehrendes Finanztool. | ACTUAL: nicht ableitbar. CONTRACTED: nicht ableitbar. PLAN: 237.700 / 390.500 / 661.400 EUR; Okt. 2026-Sep. 2029 in drei Planjahren. | PLAN verfuegbar; ACTUAL/CONTRACTED nicht verifiziert | Nur als `Planumsatz` mit Planperioden und Stichtag nennen. Nicht als Umsatzhistorie, Auftragsbestand oder Traction darstellen. |
| **ARR** | Annualisierter, vertraglich wiederkehrender Netto-Umsatz-Run-rate. Formel: Summe der zum Stichtag aktiven qualifizierten wiederkehrenden Monatsvertraege x 12, bereinigt um einmalige Leistungen und sichere Kuendigungen. | Vertragsregister plus Rechnungs-/CRM-Abgleich; nicht Preisliste oder Planmodell. | Nicht ableitbar. | Kein verifizierter Wert | Monitoring-Preis oder geplante Wiederholung nicht als ARR ausgeben. |
| **MRR** | Vertraglich wiederkehrender Netto-Umsatz eines Monats aus aktiven qualifizierten wiederkehrenden Leistungen; einmalige Piloten, Setups und Fremdkosten ausgeschlossen. | Vertragsregister plus Faktura/CRM. | Nicht ableitbar. | Kein verifizierter Wert | Keine MRR-Zahl und kein SaaS-Multiple behaupten. |
| **Gross Margin / Bruttomarge** | `(Umsatz - vollstaendige direkte Leistungskosten) / Umsatz`. Direkte Leistungskosten umfassen alle unmittelbar lieferbezogenen Partner-, Personal-, Reise- und sonstigen Kosten nach freigegebener Kostenklassifikation. | Kostenrechnung/Fibu mit freigegebener COGS-Zuordnung. | Nicht ableitbar. Das Modell setzt Fremdleistungen mit 12 % vom Umsatz an, bildet aber keine vollstaendige direkte Cost-to-Serve-Klassifikation ab. | Nicht verifiziert | Nicht `88 % Gross Margin` aus 12 % Fremdleistungen ableiten. |
| **Contribution Margin / Deckungsbeitrag** | Absolut: `Umsatz - variable und direkt zurechenbare Leistungskosten`. Quote: `Deckungsbeitrag / Umsatz`. | Projektkalkulation, Zeiterfassung, Partner-/Reise-/Lieferkosten und freigegebene Fix/variabel-Zuordnung. | Nicht ableitbar. | Nicht verifiziert | Keine Deckungsbeitragszahl oder Pilotprofitabilitaet behaupten. |
| **EBITDA** | Betriebsergebnis vor Zinsen, Ertragsteuern, Abschreibungen und Amortisation. Formel: EBIT + Abschreibungen/Amortisation oder Umsatz minus operative Kosten vor diesen Positionen. | GuV/Kostenrechnung mit expliziter EBITDA-Ueberleitung. | Fuer den aktuellen Plan nicht eindeutig ableitbar. Das Finanztool weist `Ergebnis vor KSt/SolZ/GewSt` aus; dies ist ohne Abschreibungs- und Zinsueberleitung nicht als EBITDA freigegeben. Historisch 34.950 / 120.320 / 169.300 EUR nur im alten Untergrenzen-Szenario. | Aktueller Wert nicht freigegeben; Altwert SCENARIO | Aktuelles Planergebnis niemals als EBITDA beschriften. Alte EBITDA-Reihe nicht mit 237.700 / 390.500 / 661.400 EUR kombinieren. |
| **Burn** | Tatsaechlicher durchschnittlicher monatlicher Netto-Cash-Abfluss in negativen operativen Monaten, Finanzierungseinzahlungen und Sondereffekte separat. Formel und Betrachtungsfenster vor Verwendung festlegen. | Bankkonten, Fibu und Cashflow-Auswertung. | Nicht ableitbar. Planmonatliche Cashflows sind vorhanden, aber kein freigegebener Actual-Burn und keine governte Plan-Burn-Kennzahl. | Nicht verifiziert | Keine Burn-Zahl aus einzelnen Planmonaten ableiten. |
| **Runway** | Anzahl Monate, die frei verfuegbare Liquiditaet beim normalisierten monatlichen Netto-Burn reicht. Formel: `unrestricted cash / average monthly net burn`. | Verifizierter Cash-Stichtag plus freigegebener Actual-Burn. | Nicht ableitbar. | Nicht verifiziert | Geplante Endliquiditaet nicht in Runway umrechnen. |
| **Break-even** | Umsatz-/Leistungsniveau oder Zeitpunkt, ab dem Deckungsbeitraege die fixen operativen Kosten decken. Erfordert freigegebene Fix-/Variabel-Klassifikation und Service-Mix. | Kostenrechnung plus integriertes Monatsmodell. | Nicht belastbar ableitbar. Positive geplante Jahresergebnisse beweisen keinen realisierten oder sauber berechneten Break-even-Monat. | Nicht verifiziert | Keine Break-even-Datumsbehauptung. |
| **Cash / Liquiditaet** | Frei verfuegbare Bank- und Kassenmittel zum Stichtag; gebundene Mittel getrennt. Plan-Cash ist kumulierter modellierter Liquiditaetsstand. | ACTUAL: Bank/Fibu. PLAN: fuehrendes Finanztool. | ACTUAL: nicht ableitbar. PLAN: Minimum 10.843,65 / 75.795,62 / 127.062,48 EUR; Planjahresende 88.792,77 / 142.393,67 / 267.858,45 EUR. | PLAN | Nur als geplante Liquiditaet mit Periode nennen; nicht als vorhandenes Bankguthaben. |
| **Startfinanzierungsbedarf** | Zu Beginn benoetigte Finanzierung fuer Investitionen/GWG und Betriebsmittel nach aktuellem Plan. Formel: 5.500 EUR + 19.500 EUR. | Fuehrendes Finanztool und konsistenter Businessplan. | 25.000 EUR; Startphase ab Okt. 2026. Modellstruktur: 12.500 EUR Eigenmittel + 12.500 EUR Hausbankdarlehen. | PLAN/FINANZIERUNGSSZENARIO | Kein eingeworbenes Kapital, keine Bank-/Foerderzusage, kein automatisch identischer Investor-Ask. Konditionen als unbestaetigte Annahmen markieren. |

## Zusaetzliche Governance-Regeln

1. Ein Preis ist kein Umsatz. Ein Gespraech ist keine Pipeline. Ein Angebot ist kein Contracted Revenue. Ein Plan ist kein Actual.
2. ARR und MRR duerfen erst nach Vertragsklassifikation und Stichtagsabgleich verwendet werden.
3. Gross Margin und Contribution Margin brauchen eine vollstaendige Cost-to-Serve- und Kostenartenlogik.
4. EBITDA braucht eine nachvollziehbare Ueberleitung; das IHK-Ergebnisfeld darf nicht automatisch umbenannt werden.
5. Cash, Burn und Runway brauchen aktuelle Bank-/Fibu-Daten. Modellliquiditaet bleibt PLAN.
6. Jede externe KPI braucht Wert, Einheit, Periode, Statuslabel, Stichtag und Quelle.

