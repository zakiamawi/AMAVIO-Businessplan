# ACC Release M · Operational Execution Loop · QA

**Datum:** 13.10.2026  
**Arbeitskopie:** `20261013_AMAVIO_ACC_Release_M_Operational_Execution_Loop_Working`  
**Rückfallbasis:** `20261013_AMAVIO_ACC_Release_L2_Operational_Clarity_Working` (unverändert)  
**Status:** lokal implementiert und vollständig technisch geprüft; Founder-Abnahme offen

## Umgesetzter Produktumfang

Release M verbindet die vorhandene Fallreise zu einem geschlossenen Ausführungszyklus:

`AMAVIO-Arbeitsauftrag → Arbeitgeber-Standortübergabe → AMAVIO-Auswirkungsprüfung → menschliche Fallentscheidung → beratende Programmfolge`

Neu umgesetzt wurden:

- vier abhängige, versionierte Arbeitsaufträge;
- ein rollenbegrenzter Übergabevertrag für Arbeitgeber Standort;
- eine erst nach erfüllten Abhängigkeiten freigegebene Entscheidungsvorlage;
- eine lokale Programmfolge, die sichtbar, aber ausdrücklich nicht angewendet wird;
- getrennte Projektionen für AMAVIO Operations und Arbeitgeber;
- UI-Integration in Verantwortung, Entscheidung, Ergebnis, Arbeitgeber-Mitwirkung und Programme;
- ein eigener Release-M-Health-Vertrag und lokale Startbasis auf Port 4213.

## Fachliche Akzeptanzkriterien

| Kriterium | Nachweis | Ergebnis |
|---|---|---|
| Kein neuer Haupttab | statische Navigationsprüfung | bestanden |
| AMAVIO kann nur AMAVIO-Arbeitsaufträge ausführen | Rollenvertrag + Browserprüfung | bestanden |
| Arbeitgeber Standort sieht und bearbeitet nur die eigene Übergabe | API-Projektion + Browserprüfung | bestanden |
| Folgeauftrag wird erst nach Vorgängerabschluss freigegeben | Execution-Loop-Test | bestanden |
| Entscheidung bleibt bis zur Auswirkungsprüfung blockiert | Execution-Loop-Test | bestanden |
| Entscheidung benötigt Option, Begründung und aktuelle Version | Backend- und 02A-Assurance-Test | bestanden |
| Programmfolge wird nicht automatisch angewendet | API-Invariante und Browserdarstellung | bestanden |
| Fremde Rollen und Mandanten bleiben gesperrt | Rollen- und Tenant-Test | bestanden |
| Kein Provideraufruf und keine Außenwirkung | Health-, Static- und Browserprüfung | bestanden |
| Desktop, Tablet und Mobil ohne horizontalen Überlauf | Release-M-Browserprüfung | bestanden |

## Automatisierte Nachweise

### Backend und Assurance

- `npm test`
- 295/295 Tests bestanden;
- 75 registrierte API-Routen geprüft;
- 44 Mutationsrouten auf Idempotenz, Fuzz-Grenzen, Parallelität und Failure-Injection geprüft;
- Release-M-spezifisch: Projektion, kompletter Ausführungszyklus, Rollenverletzung, Versionskonflikt, Tenant-Isolation und providerfreie Health-Invariante geprüft.

### Statisch und Brandbook

- `npm run qa:static` bestanden;
- `npm run qa:brandbook` bestanden;
- keine zusätzliche sichtbare KI-Inszenierung;
- keine Verläufe, Teal-/Mint-Abweichung oder neue Designrichtung;
- L.2-Navigation und progressive Offenlegung bewahrt.

### Browser, Responsive, Accessibility und Interaktion

- `npm run qa:all` vollständig bestanden;
- alle bestehenden Browser- und Usability-Regressionen sowie `node QA/release-m-browser-check.js` bestanden;
- Chromium, lokal und headless;
- 1440 × 1050, 820 × 1050 und 390 × 844;
- vollständige Journey über beide Rollen und das Programm;
- keine Konsolenfehler;
- keine externen Requests;
- kein horizontaler Überlauf;
- reduzierte Bewegung berücksichtigt;
- Formularfelder beschriftet, Statusänderungen in bestehende Live-Regionen eingebunden;
- Screenshots unter `QA/release-m-screens/`.

## Visuelle Korrektur während der QA

Die erste mobile Arbeitgeberdarstellung zeigte die neue konkrete Standortübergabe und zusätzlich das alte allgemeine Beitragsformular. Das war funktional möglich, aber unnötig doppelt und zu voll. Release M blendet deshalb das generische Formular aus, solange eine konkrete Ausführungsübergabe besteht. Die korrigierte mobile Ansicht wurde erneut vollständig browsergeprüft und visuell kontrolliert.

## Grenzen

Diese Arbeitskopie ist keine produktive Freigabe. Nicht umgesetzt oder freigegeben sind reale Daten, produktive Identity oder Authentifizierung, produktive Mandantentrennung, externe KI, Hosting, Deployment, Veröffentlichung, Nachrichtenversand, Buchung, CRM-/HRIS-/App-Integration oder automatische Entscheidungen.

Alle Daten und Handlungen bleiben synthetisch, lokal und ohne Außenwirkung.

## Founder-Abnahme

Für die fachliche Abnahme sind fünf kurze Prüfpunkte vorgesehen:

1. Ist in Verantwortung sofort erkennbar, welcher Schritt aktiv und welcher abhängig ist?
2. Fühlt sich die Standortübergabe in der Arbeitgeberansicht wie eine konkrete, eigene Aufgabe an?
3. Ist klar, dass AMAVIO den Arbeitgeberauftrag nicht selbst ausführt?
4. Ist die menschliche Entscheidungsvorlage verständlich, ohne technische Interna zu zeigen?
5. Ist bei Ergebnis und Programmfolge eindeutig, dass nichts automatisch oder extern angewendet wurde?

Erst nach positiver Founder-Abnahme wird Release M zur neuen Arbeits- und Rückfallbasis erklärt. Bis dahin bleibt L.2 die freigegebene Basis.
