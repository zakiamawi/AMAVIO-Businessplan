# AMAVIO One Finanzkennzahlen: Abweichungs- und Entscheidungsliste

**Stichtag:** 30.09.2026  
**Status:** P0-Entscheidungsvorlage vor weiterer Investorenkommunikation

## 1. Festgestellte Abweichungen

| Thema | Befund | Entscheidung fuer den Freeze | Restaktion / Owner |
|---|---|---|---|
| Fuehrende Umsatzreihe | Mehrere Reihen existieren: 93.500/269.000/442.000; 241.400/390.500/672.500; 237.700/390.500/661.400 EUR. | Nur 237.700/390.500/661.400 EUR ist fuehrender integrierter PLAN. | In allen neuen Unterlagen Status `PLAN` und rollierende Planjahre ausweisen. |
| 93.500/269.000/442.000 EUR | Konservative Solo-/Untergrenzenlogik aus frueherem Modell. | Nur SCENARIO/Referenz, nicht Lead Plan. | Alte Decks und Summaries vor Wiederverwendung kontrollieren. |
| 241.400/390.500/672.500 EUR | S2-Aufbauplan mit frueherer Preis- und Kapazitaetslogik. | Nur SCENARIO/historische Modellstufe. | Nicht in aktuelle Investorengrafiken uebernehmen. |
| EBITDA 34.950/120.320/169.300 EUR | Gehoert zum konservativen Alt-/Untergrenzenkorridor. | Nicht mit aktuellem Umsatzplan kombinieren; aktuelles EBITDA nicht ableitbar. | EBITDA-Ueberleitung erstellen, falls die Kennzahl spaeter benoetigt wird. |
| Planergebnis | Aktuelles Tool zeigt Ergebnis vor KSt/SolZ/GewSt 106.099,84/95.846,50/198.562,14 EUR. | Als PLAN-Ergebnis bezeichnen, nicht EBITDA. | Abschreibungs-, Zins- und Steuerueberleitung fachlich freigeben. |
| Startfinanzierung | 25.000 EUR, davon 5.500 EUR Investitionen/GWG und 19.500 EUR Betriebsmittel. | Fuehrender PLAN-Wert. | Vor Bank/Foerderung Konditionen, Puffer und GF-/Privat-/SV-Bruecke final pruefen. |
| Finanzierungsstruktur | 12.500 EUR Eigenmittel plus 12.500 EUR Hausbankdarlehen im Modell. | SCENARIO innerhalb des Plans; keine Zusage. | Finanzierungsnachweis und reale Konditionen offen. |
| Excel-Hash | Fuehrende Datei hat aktuell Hash `a5e777...`; QA vom 07.09 nennt `edf5ac...`. | Datei bleibt wegen identischer Formeln, Eingaben und Werte fuehrend; Hash-Drift wird nicht verschwiegen. | Nach menschlicher Sichtpruefung neue unveraenderliche Releasekopie mit neuem Hash erzeugen. |
| Freeze Panes | Zwei UI-Abweichungen gegenueber Coach-Kopie: `AF11` zu `D2` und `L3` zu `D3`. | Keine Zahlenabweichung. | Optional bei spaeterer Excel-Freigabe bewusst entscheiden; jetzt nicht anfassen. |
| Gross Margin | 12 % Fremdleistungen koennten faelschlich als 88 % Gross Margin gelesen werden. | Gross Margin nicht ableitbar. | Cost-to-Serve inklusive direkter Zeit-, Partner-, Reise- und Lieferkosten aufbauen. |
| Traction | Kein verifizierter AMAVIO-Ist-Umsatz, Vertragsbestand oder governter Pipeline-Wert gefunden. | Keine Traction-Zahl publizieren. | Fibu-/Bank-/Vertrags-/CRM-Belege als neue Quelle etablieren. |

## 2. Entscheidungsbedarf vor externer Freigabe

### P0: Zahlen- und Claim-Governance

- Fuehrende Excel nach menschlicher Sichtpruefung als neue unveraenderliche Releasekopie einfrieren und Hash protokollieren.
- Explizit entscheiden, ob das Investorendeck Planumsatz zeigt oder bis zum ersten belegten Contracted/Actual-Stand ohne Umsatzgrafik arbeitet.
- Fuer jede Kennzahl Statuslabel, Periode, Einheit, Stichtag und Quelle erzwingen.
- Historische Umsatz- und EBITDA-Reihen aus externen Arbeitsunterlagen entfernen oder klar als Szenario kennzeichnen.

### P0: Finanzierungs- und Liquiditaetsbruecke

- Geschaeftsfuehrerbezug, private Lebenshaltung, Sozialversicherung und deren Liquiditaetswirkung abschliessend bestaetigen.
- Finanzierungsauszahlung und Timing nicht als gesichert behandeln. Im Modell fuehrt ein Ausbleiben des Darlehens zu einem Mindeststand von -1.580,99 EUR im November 2026; bei einmonatiger Verschiebung liegt das Minimum bei 866,74 EUR, bei zweimonatiger Verschiebung erneut bei -1.580,99 EUR.
- Mindestpuffer und Notfallmassnahmen bei Kunden- oder Finanzierungsverzoegerung beschliessen.

### P1: Wirtschaftlichkeit pro Leistung

- Direkte Cost-to-Serve je Readiness Sprint, Kompaktpilot, erweitertem Mandat und Monitoring definieren.
- Gruender-/Mitarbeiterzeit, Reisen, Partnerkosten und sonstige direkte Leistungskosten zurechnen.
- Erst danach Gross Margin, Contribution Margin und belastbaren Break-even ableiten.

### P1: Commercial Evidence

- Einheitliches Vertragsregister mit Netto-Auftragswert, Leistungszeitraum, Status und Kuendigungslogik anlegen.
- CRM-Pipeline mit klaren Stufen, Wahrscheinlichkeiten, Owner, naechstem Schritt und Stichtag governieren.
- ARR/MRR nur aus aktiven, qualifizierten Wiederholungsvertraegen berechnen.

## 3. Zahlen-Release-Matrix

| Kennzahl/Inhalt | Investorendeck | Executive Summary | Businessplan | Foerder-/Bankunterlagen |
|---|---|---|---|---|
| Planumsatz 237.700/390.500/661.400 EUR | **Bedingt freigabefaehig:** nur `PLAN`, Planperioden und Stichtag | **Bedingt freigabefaehig** mit kurzer Methodik | **Ja, intern konsistent**; externe Freigabe bleibt offen | **Bedingt**, wenn formularrelevant und eindeutig als Plan |
| Umsatz 93.500/269.000/442.000 EUR | Nein | Nein | Nur interne Szenario-/Historieneinordnung | Nur falls explizit als konservatives Szenario verlangt |
| Umsatz 241.400/390.500/672.500 EUR | Nein | Nein | Nur interne Historieneinordnung | Nein, sofern nicht fuer Variantenvergleich angefordert |
| Planergebnis vor KSt/SolZ/GewSt | Nur nach fachlicher Freigabe und exakt so benannt | Eher weglassen | Ja als Planfeld der Quelle | Bedingt, mit Steuer-/Ergebnisabgrenzung |
| EBITDA | Nein; aktuell nicht ableitbar | Nein | Nur nach eigener Ueberleitung | Nur nach eigener Ueberleitung |
| Startfinanzierungsbedarf 25.000 EUR | Bedingt als Startplan; nicht automatisch Investor-Ask | Bedingt | Ja als PLAN | Ja als PLAN, keine Zusage |
| 12.500 EUR Eigenmittel + 12.500 EUR Darlehen | Bedingt als Finanzierungsszenario | Bedingt | Ja als Modellannahme | Ja, mit Konditions- und Zusagevorbehalt |
| Plan-Cash / Mindestliquiditaet | Nur wenn fuer Risikologik erforderlich | Eher weglassen | Ja als PLAN | Ja als PLAN mit Sensitivitaet |
| Actual Revenue / Cash | Nein, solange kein Belegwert | Nein | Nur nach Fibu-/Bankabgleich | Nur nach Fibu-/Bankabgleich |
| Contracted Revenue | Nein, solange kein Vertragsregister | Nein | Nur nach Vertragsnachweis | Nur nach Vertragsnachweis |
| Pipeline | Nein, solange keine governte CRM-Quelle | Nein | Optional nach Governance | Nur falls verlangt und sauber getrennt |
| ARR / MRR | Nein | Nein | Nein, solange nicht ableitbar | Nein, solange nicht ableitbar |
| Gross Margin / Contribution Margin | Nein | Nein | Erst nach Cost-to-Serve | Erst nach Cost-to-Serve |
| Burn / Runway / Break-even | Nein | Nein | Erst nach Definition und Datenbasis | Erst nach Definition und Datenbasis |

## 4. Freigabeentscheidung dieses Arbeitsblocks

- **Freigegeben als interne Zahlenbasis:** fuehrende Quellen, Planperioden, Planumsatz, Planaufwands- und Planliquiditaetswerte, 25.000 EUR Startfinanzierungsbedarf.
- **Nur als Szenario:** konservativer Basiskorridor, S2-Aufbaukorridor, Darlehenskonditionen und Auszahlungstiming.
- **Nicht ableitbar und nicht freigegeben:** Actual, Contracted, Pipeline-Summe, ARR, MRR, Gross Margin, Contribution Margin, aktuelles EBITDA, Burn, Runway und Break-even.
- **Keine externe Gesamtfreigabe:** Erst nach Entscheidung der offenen P0-Punkte.

