# AMAVIO ACC Release J.5 – Dual-Sided Workflow QA

**Datum:** 10.10.2026  
**Quelle:** `20261010_AMAVIO_ACC_Release_J_5_Dual_Sided_Workflow_Working`  
**Rückfallbasis:** `archive/20261010_release_j5_dual_sided_baseline/`  
**Ergebnis:** lokal grün; keine produktive Freigabe

## Geprüfter Produktschnitt

- eigenständige AMAVIO-Operations-Fallsteuerung;
- eigenständige Arbeitgeber-Mitwirkung für Sponsor, HR Operations, Standort und Budget;
- rollenminimierte Portfolios, Fallprojektionen, Aufgaben, Entscheidungen und Belege;
- bewusste Arbeitgeberübergabe ohne Außenwirkung;
- Operations-Prüfung und gemeinsamer Status;
- optionale Operations-Entscheidung zur internen Lernübernahme;
- Reload, Deep Link, Browser-Zurück/-Vorwärts sowie Fall- und Rollenkontext.

## Automatisierte QA

- vollständiger Node-Testlauf mit 210/210 Tests grün;
- 54 API-Routen und 31 geschützte Mutationen registriert;
- Session-, Tenant- und Rollen-Negativtests grün;
- Idempotenz, Request-Fingerprint, Replay und Konflikterkennung grün;
- Fuzzing, malformed JSON, 64-KiB-Grenze und Unicode-Proben grün;
- Concurrency-Verträge einschließlich exklusiver Beitragsprüfung grün;
- Failure Injection vor jeder registrierten Route grün;
- Static- und Brandbook-Prüfung grün;
- Browserregression für Release G, J.5, I und J.3 grün;
- Desktop-, Tablet- und Mobile-Ansichten bis 360 px grün;
- Accessibility-Basis, Tastaturpfade, lesbare Labels und Netzwerkgrenze grün;
- Usability-Testinstrument Desktop und Mobile grün;
- keine externen Requests.

## Visuelle Prüfung

- Arbeitgeber-Desktop: `QA/release-j5-screens/1440-employer-collaboration.png`
- Arbeitgeber-Mobile: `QA/release-j5-screens/390-employer-collaboration.png`
- Operations-Desktop: `QA/release-j5-screens/1440-operations-desk.png`
- Operations-Mobile: `QA/release-j5-screens/390-operations-desk.png`
- Designbasis: `design/ACC_RELEASE_J5_EMPLOYER_COLLABORATION_CONCEPT_20261010.png` und `design/ACC_RELEASE_J5_OPERATIONS_DESK_CONCEPT_20261010.png`

Die erste mobile Fassung zeigte eine horizontal angeschnittene Schrittfolge. Sie wurde in eine vollständig sichtbare zweispaltige Fünf-Schritt-Struktur umgebaut und im realen Browser erneut geprüft.

## Grenzen

Der Nachweis bestätigt ausschließlich die lokale synthetische Konzeptdemo. Er bestätigt keine produktive Identity, reale Mandantentrennung, DSGVO-Betriebsfähigkeit, Security-Freigabe, Hosting, externe KI, Providervertrag, reale Datenquelle, Integration, Nachricht, Buchung, Veröffentlichung oder Deployment.

## Founder-Abnahme

Offen ist nur noch die qualitative Founder-Bewertung der Arbeitgeberreise, der Operations-Übergabe und der Gesamtwirkung. Korrekturen erfolgen ausschließlich auf einer neuen datierten Rückfallbasis.
