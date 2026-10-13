# ADR-005: Rollenvertrag und serverseitige View Projection

**Status:** akzeptiert für die lokale synthetische Founder-Evaluationsfassung  
**Datum:** 08.10.2026  
**Entscheider:** Founder/Product Owner für Release H  
**Produktionsfreigabe:** ausdrücklich nicht erteilt

## Kontext

Die bisherige Arbeitgeberumschaltung änderte Profil, Priorisierung und Textperspektive, verwendete in der operativen Arbeitsfläche aber weitgehend denselben Fallbestand, dieselben Fachmodule und dieselben Aktionspfade wie AMAVIO Operations. Damit war die Rollenlogik sichtbar, aber nicht technisch belastbar und für die jeweilige Arbeitgeberfunktion zu wenig eigenständig.

## Entscheidung

Release H führt einen zentralen Rollenvertrag unterhalb der Oberfläche ein. Jede lokale synthetische Sitzung enthält genau eine Rolle. Portfolio, Fallakte, Felder und Aktionen werden serverseitig auf diese Rolle projiziert. Nicht freigegebene API-Aufrufe werden vor Idempotenz- und Domänenverarbeitung mit `403 role_scope_denied` beendet.

Die aktive Rollenstruktur lautet:

1. `operations`: vollständige interne Fallsteuerung;
2. `employer_sponsor`: Status, Eskalation und zugewiesene Sponsorentscheidung;
3. `employer_hr`: HR-Fälle, HR-Belege und HR-Aufgaben;
4. `employer_location`: Standort-/Facility-Fälle, Übergaben und Standortbelege;
5. `employer_budget`: eigener synthetischer Budgetfall, Kostengrundlage, Budgetaufgabe und Budgetentscheidung.

## Sicherheits- und Produktprinzipien

- Die Oberfläche ist eine Projektion des Serververtrags, nicht dessen Sicherheitsgrenze.
- Interne Regeln, Audit-Events, Kernel-Artefakte, Providerstatus und Rohprovenienz bleiben in Arbeitgeberrollen verborgen und serverseitig gesperrt.
- Aufgaben, Belege und Entscheidungen sind nur bearbeitbar, wenn `owner_role`, Evidenztyp oder `decider_role` zum aktiven Rollenvertrag passen.
- Sponsoransichten erhalten verdichtete Entscheidungsgrundlagen statt interner Quellenaussagen.
- Rollenwechsel verwirft den aktuellen UI-Zustand und lädt eine neue rollenfeste synthetische Sitzung.
- Alle Aktionen bleiben lokal, synthetisch, human-gated und ohne Außenwirkung.

## Verwarfene Optionen

| Option | Bewertung | Entscheidung |
|---|---|---|
| nur Profil-/Textwechsel im Frontend | keine belastbare Trennung, direkt umgehbar | verworfen |
| getrennte vollständige Frontends je Rolle | hohe Duplikation und Driftgefahr | verworfen |
| zentraler Rollenvertrag plus serverseitige Projektion | klare Zuständigkeit, testbar, providerunabhängig | gewählt |
| produktiver Identity-/RBAC-Anbieter | Kosten, Datenschutz- und Betriebsbindung vor Produktreife | zurückgestellt |

## Konsequenzen

- Arbeitgeber- und AMAVIO-Arbeitsflächen teilen ein Designsystem, aber nicht mehr denselben Daten- und Aktionsumfang.
- Neue Routen müssen künftig einer Aktion im Rollenvertrag zugeordnet werden; ein unbehandelter Arbeitgeberaufruf wird geschlossen abgewiesen.
- Die lokale Demo simuliert Rollen und Rechte, ersetzt jedoch keine produktive Identität, Session-Sicherheit, Mandantenisolation oder Autorisierungsprüfung.
- Produktive Identity, Authentifizierung, RBAC/ABAC, Audit-Retention, Provisionierung und Rezertifizierung bleiben separate Founder-, Datenschutz-, Security-, Hosting- und Betriebsgates.

## Rückfall und Verifikation

- Arbeitskopie: `20261008_AMAVIO_ACC_Release_H_Role_Contract_View_Projection_Working`
- Rückfallbasis: `archive/20261008_release_h_source_baseline/`
- Rollenvertrag: `backend/role-contract.mjs`
- automatisierte Rollenmatrix: `QA/release-h-role-contract.test.mjs`
- Browsermatrix: `QA/release-h-browser-check.js`

