# AMAVIO ACC Release H – QA-Nachweis

**Datum:** 08.10.2026  
**Arbeitskopie:** `20261008_AMAVIO_ACC_Release_H_Role_Contract_View_Projection_Working`  
**Quelle:** QA-grüne Intelligence-Kernel-V2-Arbeitskopie  
**Rückfallbasis:** `archive/20261008_release_h_source_baseline/`

## Umgesetzter Umfang

- zentraler Rollenvertrag für AMAVIO Operations, Arbeitgeber-Sponsor, HR Operations, Standort und Budget;
- fünf getrennte synthetische Sitzungen plus rückwärtskompatibler Operations-Alias;
- serverseitige Portfolio- und Fallprojektion;
- feld-, objekt- und aktionsbezogene Minimierung;
- serverseitige Negativsperre vor Idempotenz- und Domänenverarbeitung;
- rollenabhängige Journeys, Aufgaben, Belegprüfungen und Entscheidungen;
- eigener synthetischer Budgetfall mit Kostengrundlage und Human Gate;
- vollständiger Erhalt der AMAVIO-internen Release-G-/Kernel-V2-Fallreise.

## Automatisierte Nachweise

| Prüfung | Ergebnis |
|---|---:|
| Node-/API-/Kernel-/Resilience-/Rollenvertragstests | 137 / 137 grün |
| bestehende API-Route-Matrix | 34 / 34 grün |
| Rollenprojektionen | 5 / 5 grün |
| direkte rollenwidrige Negativaufrufe | 4 / 4 grün |
| bestehende Domain-Evaluation | 24 / 24 grün |
| Kernel-V1-Evaluation | 34 / 34 grün |
| Kernel-V2-Evaluation | 48 / 48 grün |
| Release-G-Browsermatrix | 1505, 1280, 1024, 768, 390 und 360 px grün |
| Release-H-Rollenmatrix | Desktop 1280 und Mobile 390 px grün |
| Accessibility-Basis | Landmark, Labels, Tastaturpfad, Reduced Motion und Überlauf grün |
| Brandbook | Geist/Fraunces, Navy/Cream/Gold/Bronze, Radien und schattenfreie Panels grün |
| Usability-Testinstrument | Desktop und Mobile grün |
| externe Requests/Providerkosten | 0 / 0 |

## Sichtprüfung

- AMAVIO Operations: fünf Fälle und vollständige interne Fachreise.
- Sponsor: fünf verdichtete Fälle, keine Rohregeln/Events/Kernel-Arbeitsflächen, Sponsorentscheidung sichtbar.
- HR: ein HR-Fall, ein HR-Beleg und eine HR-Aufgabe.
- Standort: zwei Standortfälle, standort-/wohnbezogene Belege und Aufgaben.
- Budget: ein eigener Budgetfall, zwei Kostengrundlagen, Budgetaufgabe und Budgetentscheidung.
- Rollenwechsel ändert Profil, Fallbestand, Journey, Felder und Aktionen konsistent.

## Grenzen

Keine produktive Identity, kein echtes Konto, kein Passwort, kein MFA, keine reale Person, kein externer Provider, keine Integration, keine Nachricht, keine Buchung, keine Veröffentlichung und kein Deployment wurden aktiviert. Der Rollenvertrag ist eine lokale synthetische Produkt- und Architekturvalidierung, kein Security- oder Produktionsnachweis.

## Ergebnis

`QA BESTANDEN / ROLLENLOGIK TECHNISCH GETRENNT / LOKALE SYNTHETISCHE FOUNDER-EVALUATIONSFASSUNG / KEINE PRODUKTIVFREIGABE`

