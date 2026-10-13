# QA – Release N Employer Workspace

**Datum:** 13.10.2026  
**Arbeitskopie:** `20261013_AMAVIO_ACC_Release_N_Employer_Workspace_Working`  
**Rückfallbasis:** `20261013_AMAVIO_ACC_Release_M_Operational_Execution_Loop_Working`  
**Lokaler Port:** 4214

## Prüfumfang

- verständliche sichtbare Arbeitgeberbereiche statt „Sponsor“, „HR“, „Standort“ und „Budget“ ohne Kontext;
- klare Trennung zwischen „Aufgaben & Entscheidungen“ und „Ankunftsprogramme“;
- Aufgabenraum mit Arbeitsbereichsauftrag, bearbeitbarem Vorgang, Grundlage, Dringlichkeit, Folge, Beitrag und Übergabeverlauf;
- Programmraum mit Programmphasen, Verantwortungen, Terminen, eigenem Beitrag, Entscheidungen und Ergebnisrückmeldung;
- keine sichtbare interne AMAVIO-Analyse, technische QA-, Audit-, Provider- oder Lerninformation in der Arbeitgeberprojektion;
- Erhalt der Rollen-, Tenant-, Idempotenz-, Concurrency-, Failure-Injection-, Human-Gate- und Null-Außenwirkungsverträge;
- Desktop-, Tablet- und Mobilverhalten, Tastatur-/Landmark-Basis, Beschriftungen, URL-/Reload-Verhalten und Interaktionen;
- keine externen Requests.

## Berührt

- Arbeitgebernavigation und sichtbare Rollen-/Funktionssprache;
- Arbeitgeber-Aufgabenraum und Programmraum;
- Präsentationsmapping der bestehenden serverseitigen Rollenkennungen;
- Release-N-CSS und -Clientlogik;
- Release-N-Health- und Runtime-Startvertrag;
- zugehörige Regressionserwartungen und Dokumentation.

## Unberührt

- AMAVIO-Operations-Fachlogik und bestehende Capability-Verträge;
- produktive Architektur, Identity, Hosting, Deployment und Integrationen;
- externe KI-Provider und Providerkosten;
- Drei-Rollen-App und CRM;
- reale Daten und Außenwirkung.

## Ergebnis

| Prüfung | Ergebnis |
|---|---|
| Node-/Domänen-/Assurance-Tests | **296/296 bestanden** |
| Static- und Syntax-QA | **bestanden** |
| Brandbook-QA | **bestanden** |
| Runtime, Deep Link, Reload und History | **bestanden** |
| Arbeitgeber-Rollenprojektion | **bestanden** |
| Release-N-Browser-QA | **bestanden auf 1440, 820 und 390 px** |
| Bestehende Release-G/J.5/I/J.3/K/L/M-Browserregression | **bestanden** |
| Responsive-/Overflow-Prüfung | **bestanden** |
| Accessibility-Basis und verständliche Beschriftungen | **bestanden** |
| Usability-Testinstrumente Desktop/Mobil | **bestanden** |
| Externe Requests / Providercalls / Außenwirkung | **0 / 0 / 0** |

Der vollständige Befehl `npm run qa:all` war nach der Release-N-Integration grün. Nach der abschließenden Filterung nicht bearbeitbarer Arbeitgebervorgänge wurden die betroffenen J.5- und N-Browserprüfungen nochmals gezielt grün ausgeführt.

## Sichtprüfung

Die reale lokale Browseransicht auf Port 4214 wurde für „Aufgaben & Entscheidungen“ und „Ankunftsprogramme“ geprüft. Die Arbeitsfläche ist zentriert, die Hauptarbeit erhält mehr Breite, die Funktionssicht ist unmittelbar verständlich und der unklare sichtbare Begriff „Sponsor“ erscheint nicht mehr. In „Ihre Vorgänge“ werden nur Fälle mit einem aktuellen Schritt für den gewählten Arbeitsbereich gezeigt; der vollständige Programmstand bleibt separat erreichbar.

## Grenzen

Release N ist weiterhin eine lokale Konzeptdemo mit ausschließlich synthetischen Daten. Die lokalen Demo-Sessions sind keine produktive Authentifizierung. Es wurden keine externen Konten, Provider, Datenquellen, Nachrichten, Buchungen, Deployments oder Veröffentlichungen aktiviert.
