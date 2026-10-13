# AMAVIO One CRM – R3 UAT Preparation QA

**Datum:** 09.10.2026  
**Prüfobjekt:** `20261009_AMAVIO_One_CRM_R3_UAT_Acceptance_Working`  
**Status:** **UAT-PAKET VORBEREITET UND TECHNISCH VORGEPRÜFT / PRODUCT-OWNER-UAT NOCH NICHT DURCHGEFÜHRT**

## Schutzprüfung

- R3-Ausgangsstand vollständig gesichert.
- Pre-UAT-Sicherung und UAT-Arbeitskopie vor Änderungen rekursiv inhaltsgleich.
- R3-Code in der UAT-Vorbereitung nicht verändert.
- keine produktiven Daten und keine externe Verbindung.

## Dokumentprüfung

Vorbereitet werden Szenariobuch, Acceptance Checklist, Findings-Register, Product-Owner-Abnahme und Release-Entscheidung. Alle Dokumente unterscheiden technische QA, fachliche UAT und produktive Freigabe.

## Technische Vorprüfung

| Prüfung | Ergebnis |
|---|---|
| Build | bestanden; 1.591 Module |
| Statisches Scope-/Sicherheitsgate | bestanden |
| Unit | 8/8 bestanden |
| Vertrag | 6/6 bestanden |
| Komponente | 2/2 bestanden |
| Integration | 2/2 bestanden |
| End-to-End | 14/14 lokale synthetische Abläufe bestanden |
| Browserkonsole | ohne Fehler |
| Responsive | 1600, 1280, 1024 und 430 Pixel bestanden |
| Tastatur/Dialoge | Strg/⌘ K, Escape, Focus-Trap und Focus-Rückgabe bestanden |
| Echter 200-%-Zoom | bestanden |

## Code-Integrität

`src`, `scripts`, `tests`, `package.json`, `package-lock.json` und `index.html` wurden nach der UAT-Vorbereitung rekursiv beziehungsweise dateiweise gegen die abgeschlossene R3-Contract-Alignment-Arbeitskopie verglichen. Ergebnis: **identisch**. Die UAT-Vorbereitung hat keinen Anwendungscode, Testcode und keine Abhängigkeit verändert.

## Werkzeugstatus

- lokales Node/Vite-Testsystem: installiert, callable und smoke-tested;
- Playwright 1.64: installiert, callable und smoke-tested;
- lokal installiertes Google Chrome: callable und für E2E/Viewport/Zoom smoke-tested;
- separate Browser-Skill-Schnittstelle: in dieser Umgebung nicht callable; deshalb wurde der vorhandene lokale Playwright-/Chrome-Pfad verwendet;
- externe CRM-, Cloud- oder Connectorwerkzeuge: nicht verwendet.

## Noch ausstehend

- tatsächliche Product-Owner-Durchführung der 14 Szenarien;
- Bewertung der 22 Acceptance-Punkte;
- Eintrag realer UAT-Befunde, sofern vorhanden;
- ausdrückliche Acceptance-, R3.1- oder Zurückstellungsentscheidung;
- finales Acceptance-Freeze-Manifest erst nach dieser Entscheidung.

Die technische Vorprüfung darf nicht als Product-Owner-UAT oder fachliche Abnahme bezeichnet werden.
