# AMAVIO ACC – Productization Gate 01.5 QA

**Stand:** 07.10.2026  
**Arbeitskopie:** `20261007_AMAVIO_ACC_Productization_Gate_01_5_Working`  
**Prüfstatus:** lokale Founder-Evaluationsfassung; D–F als zusammenhängender vertikaler Produktschnitt implementiert  
**Daten/Wirkung:** ausschließlich synthetisch, lokal und ohne Außenwirkung

## 1. Rückfall- und Source-of-Truth-Nachweis

- Ausgangsbasis: `20261007_AMAVIO_ACC_Productization_Gate_01_Working`
- Neue Arbeitskopie: `20261007_AMAVIO_ACC_Productization_Gate_01_5_Working`
- Implementierungsbaseline: `archive/20261007_gate_01_5_implementation_baseline/`
- Ausgangs-Hashes: `index.html` `0c32ff…`, `package.json` `5ade27…`, `backend/server.mjs` `4d3322…`
- Laufende ältere Demo wurde nicht verändert; Gate 01.5 verwendet lokal Port `4193`.

## 2. Implementierter Produktschnitt D–F

### Release D – Operational Case Workbench

- zwei serverseitig getrennte synthetische Mandanten mit je vier Fällen;
- Fallindex, Kohorten-/Mandatskontext und kanonische Fallakte;
- fünfstufiger kritischer Pfad, Aufgaben, Evidenz, Entscheidung und Verlauf;
- serverseitige Tenant-Filter und 404 für fremde Ressourcen;
- SQLite-Persistenz mit Fallversion und append-only Ereignisspur.

### Release E – Exceptions, Rules & Simulation

- zehn transparente lokale Fachregeln;
- Ausnahmen und regelbasierte Readiness ohne Wahrscheinlichkeitsclaim;
- isolierte Vorher-/Nachher-Simulation einer Anreiseänderung;
- fünf berechnete Folgefristen;
- Übernahme ausschließlich mit menschlicher Prüfnotiz und neuer Fallversion.

### Release F – Work Products, Evidence & Evaluation

- Evidenzprüfung und sichtbarer Widerspruch;
- sieben lokale Arbeitsprodukttypen mit Quellenreferenzen und Status `sink_only`;
- vier providerneutrale Intelligence-Fähigkeiten;
- 24 reproduzierbare Evaluationsszenarien: 6 Standard, 6 Evidenz, 6 Ausnahme, 4 Human Gate, 2 Isolation;
- lokaler AMAVIO-Engine-Lauf mit Quellen, Unsicherheiten, verbotenen Aktionen und Human-Gate-Schritten.

## 3. Automatisierte Prüfergebnisse

| Prüfschicht | Ergebnis |
|---|---|
| Node/API/SQLite | 7 Tests bestanden |
| Gate-01-Kompatibilität | Human Gate, Sink, Provider-Sperre bestanden |
| Gate-01.5-Domain | 8 Fälle, 2 Mandanten, 10 Regeln, kritischer Pfad bestanden |
| Simulation | Isolation, Human Gate, Versionierung und Neustartpersistenz bestanden |
| Evidenz/Entscheidung | lokale Prüfung und Wirkungsgrenze bestanden |
| Arbeitsprodukte | 7/7 Typen erzeugt, belegt und `sink_only` |
| Evaluation | 24/24 Szenarien bestanden, 0 verbotene Aktionen, 0 Cross-Tenant-Funde |
| Provider-Adapter | OpenAI/Mistral nur mit injizierten Fake-Transporten geprüft; kein Netzwerk |
| Static QA | Assets, Navigation, Endpoints, Grenzen und Provider-Gates bestanden |
| Browsermatrix | 1505, 1280, 1024, 768, 390 und 360 px bestanden |
| Browserinteraktion | Evidenz, Regeln, Simulation, Human Gate, Arbeitsprodukt, Evaluation bestanden |
| Accessibility-Basis | Tastaturmodus, Feldlabels, Buttonnamen, Reduced Motion bestanden |
| Netzwerk-Audit | keine externen Browserrequests |

Im QA-Lauf gefunden und korrigiert:

1. asynchrone Verwendung einer nach Eventabschluss ungültigen Buttonreferenz;
2. horizontaler Überlauf der Meilensteinmatrix bei 1024 px;
3. anfänglich zu frühes Lesen des lokalen Capability-Ergebnisses im Browsertest;
4. bestehende Gate-01-Testannahme zur Fixture-Reihenfolge;
5. unerwünschtes Zurücksetzen einer übernommenen Simulation beim Neustart.

## 4. Visuelle Soll-Ist-Prüfung

Referenz: `design/ACC_GATE_01_5_OPERATIONAL_WORKBENCH_REFERENCE_20261007.png`

| Merkmal | Referenz | Umsetzung | Urteil |
|---|---|---|---|
| Informationsarchitektur | Navigation, Fallindex, Fallarbeit, Kontextleiste | bei 1505 px als ruhige Dreiteilung umgesetzt | passend |
| Hierarchie | großer Falltitel, Critical Path als Primärinhalt | übernommen, AI bleibt nachgeordnet | passend |
| Farbwelt | Navy, Weiß, warmes Gold, gezieltes Rot | vorhandene AMAVIO-Tokens weitergeführt | passend |
| Oberflächencharakter | offene Arbeitsfläche statt Modul-/Kartenwand | Tabellen, Linien und Progressive Disclosure | passend |
| Entscheidung | menschlicher Schritt im rechten Kontext | eigener Prüfblock mit Begründung | passend |
| Evidenz | Quellen direkt am Fall | Konflikt und Status im Arbeitsraum sowie Kontext | passend |
| Intelligenz | ruhig integriert, Provider nicht dominant | lokale Engine sichtbar, externe Adapter nur als Gate-Status | passend |
| Responsive | Desktop-Arbeitsplatz, sinnvolle Verdichtung | Kontextleiste unter 1400 px, mobile Einspaltigkeit | passend |

Bewusste Abweichungen: Die Umsetzung nutzt die bereits etablierte ACC-Topbar und das bestehende AMAVIO-Logo. Bei schmaleren Desktopbreiten wird die Kontextleiste unter die Fallarbeit gestellt, um lesbare Tabellen und echte Bedienbarkeit zu erhalten.

## 5. Providerstatus – präzise Reifegradtrennung

- `AMAVIO local`: implementiert, aktiviert, callable und lokal smoke-tested.
- `OpenAI`: Adapter implementiert; nur über internen Fake-Transport getestet; nicht konfiguriert, nicht authentifiziert, nicht live smoke-tested, Gate geschlossen.
- `Mistral`: Adapter implementiert; nur über internen Fake-Transport getestet; nicht konfiguriert, nicht authentifiziert, nicht live smoke-tested, Gate geschlossen.
- Es wurden keine Anbieterzugänge, Tokens, Verträge, Konten, Budgets oder kostenpflichtigen Aufrufe eingerichtet.

## 6. Ehrliche Grenzen und offene Abnahme

Diese Arbeitskopie ist ein belastbarer lokaler Produkt- und Architekturprototyp, keine produktionsreife Plattform. Insbesondere nicht abgeschlossen sind:

- produktive Registrierung, Authentifizierung, Autorisierung und Mandantentrennung;
- Migration realer Gate-01-Bestandsdaten in ein produktives Schema;
- vollständige Fuzz-, Concurrency-, Idempotenz- und Failure-Injection-Matrix für sämtliche Routen;
- produktiver Datei-, Nachrichten-, Buchungs-, CRM-, HRIS- oder App-Kanal;
- Offlinebetrieb und formeller Screenreader-Test mit mehreren Assistenztechnologien;
- moderierter Usability-Test und Founder-Abnahme der neuen Gesamtwirkung;
- Provider-, Daten-, Datenschutz-, Security-, Vertrags-, Hosting-, Budget- und Betriebsgates.

Gate 01.5 ist damit als **Founder-Evaluationsfassung** bereit. Es ist nicht als produktionsreif oder extern freigegeben zu bezeichnen. Gate 02 bleibt trotz implementierter Adapter geschlossen.

