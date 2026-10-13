# QA – R3.15 Lokales Echtdaten-Staging

**Datum:** 13.10.2026  
**Prüfobjekt:** `20261013_AMAVIO_One_CRM_R3_15_Local_Real_Data_Staging_Working`  
**Zulässiger Reifegrad:** lokaler synthetischer CRM-Core mit getrenntem lokalem Echtdaten-Staging; nicht produktiv freigegeben

## Prüfumfang

- Quellintegrität und Feldzuordnung;
- lokale Importtransaktion und Rollback;
- Umfang, Deduplizierung, Mehrfachbeziehungen und Namensprüfungen;
- vollständige Kontaktsperre;
- Staging-/Core-Trennung und Demo-Reset-Grenze;
- Build, statisches QA-Gate, Unit-/Contract-/Component-/Integration-/Persistenztests;
- lokale API und Browserkonsole;
- Desktop, Zwischenbreite, Mobile, Tastatur und 200-%-Zoom;
- sichtbare Design- und Sprachkonsistenz.

## Import- und Datenprüfung

| Prüfung | Erwartung | Ergebnis |
|---|---:|---|
| Organisationspool | 2.242 | BESTANDEN |
| Kontaktpool | 3.213 | BESTANDEN |
| bestätigt aktuelle Organisationen | 192 | BESTANDEN |
| deduplizierte bestätigt aktuelle Kontakte | 166 | BESTANDEN |
| Beziehungen | 238 | BESTANDEN |
| Mehrfachgruppen / Zuordnungen | 31 / 103 | BESTANDEN |
| Namensprüfung | 48 Kontakte | BESTANDEN |
| Prüfqueue | 407 | BESTANDEN |
| Quarantänehinweise | 93 | BESTANDEN |
| Dublettensignale | 6 | BESTANDEN |
| Poolkontakte gesperrt | 3.213 von 3.213 | BESTANDEN |
| bestätigte Kontakte gesperrt | 166 von 166 | BESTANDEN |
| zweiter Lauf – neue Datensätze | 0 | BESTANDEN |

Der erste schreibende Versuch wurde wegen einer kollidierenden Quarantäne-Importzeile vollständig zurückgerollt; es wurden keine Teilstände übernommen. Nach Korrektur der deterministischen Importzeilen-ID lief die Transaktion vollständig durch. Ein zweiter identischer Lauf aktualisierte bestehende Zeilen und erzeugte null neue Datensätze.

Der abschließende idempotente Lauf meldet `created=0`, `updated=30445` technische Fach-/Supportzeilen und `quarantined=93`. Namens- und Adressprüfungen werden als `review_required` geführt und nicht fälschlich als Quarantäne gezählt. Vor diesem Lauf wurde der lokale Snapshot `local-data/real-data-staging/snapshots/amavio-real-data-staging-before-20261013T125529Z.sqlite` erzeugt.

Für die Tabellenverarbeitung stand keine aktive, editierbare Excel-/Spreadsheet-Sitzung zur Verfügung. Deshalb wurde die bereitgestellte professionelle gebündelte Python-/OpenPyXL-Laufzeit als lokaler read-only Extraktionsweg und anschließend SQLite für den kontrollierten Import verwendet. Es wurde keine eigene vereinfachende CSV- oder Browser-Fallbacklogik zwischengeschaltet.

## Schutzflags

| Flag | Soll | Ergebnis |
|---|---:|---|
| `outboundEnabled` | `false` | BESTANDEN |
| `cloudSyncEnabled` | `false` | BESTANDEN |
| `supabaseEnabled` | `false` | BESTANDEN |
| `appIntegrationEnabled` | `false` | BESTANDEN |
| `accIntegrationEnabled` | `false` | BESTANDEN |

## Technische Prüfläufe

| Lauf | Ergebnis | Beobachtung |
|---|---|---|
| `npm run build` | **PASS** | Vite-Produktionbuild, 1.605 Module, keine Buildfehler |
| `npm run qa` | **PASS** | Markenanker, Pflichtdokumente, Systemgrenzen und ausschließlich lokale `/api`-Pfade |
| `npm run test:logic` | **PASS** | 33 Unit-, 16 Contract-, 10 Component- und 6 Integrationstests |
| `npm run test:persistence` | **PASS** | SQLite, Sicherung, Export, Reset, Restore und Nicht-Synthetik-Abweisung |
| `npm run test:staging` | **PASS** | fünf Staging-Vertragstests zu Umfang, Sperren, Beziehungen, Quarantäne und Idempotenz |
| `npm run test:e2e` | **PASS** | 20 zusammenhängende Core-Abläufe plus separater Staging-Pfad; Konsole ohne Fehler |
| `npm run qa:browser` | **PASS** | 1600, 1280, 1024, 768, 430 und 390 px; sieben Arbeitsflächen je Breite; Tastatur und 200-%-Zoom |

Browserergebnis: `QA/CRM_R3_15_LOCAL_REAL_DATA_STAGING_BROWSER_RESULT_20261013.json`  
Screenshots: `QA/Screenshots/20261013-r3-15-local-real-data-staging/`

Während der Prüfung wurden drei reale Fehler kontrolliert entdeckt und behoben:

1. bestehender Persistenzvertrag erwartete die rückwärtskompatible Health-Angabe `mode=local-sqlite` und `syntheticOnly=true`; die neue Staging-Grenze wurde als zusätzliche Health-Eigenschaft ergänzt;
2. die 407er-Prüfgrafik erzeugte bei 430 px Seitenüberbreite; das horizontale Scrollen wurde auf das Modul begrenzt;
3. der Staging-Detaildialog verlor durch eine instabile Callback-Referenz den ursprünglichen Fokus; der Close-Handler ist nun stabil und die Focus-Rückgabe ist browsergeprüft.

## Bekannte Grenzen

- keine Authentifizierung; ausschließlich `127.0.0.1` und Einzelplatz;
- Staging-Oberfläche ist absichtlich lesend;
- keine Rechtsgrundlagen-, Einwilligungs- oder Versandfreigabe;
- kein produktiver Backup-/Disaster-Recovery-Nachweis für personenbezogene Daten;
- keine Cloud-, Provider-, Supabase-, App- oder ACC-Verbindung;
- keine Aussage, dass historische oder öffentliche Kontaktdaten noch aktuell oder kontaktierbar sind.

## Endbewertung

**PASS – lokaler R3.15-Stagingumfang.** Datenvertrag, Import, technische Trennung, Sperren, Core-Regression, Browserbreiten, Tastatur, Dialogsemantik, Focus-Trap/-Rückgabe, echter 200-%-Reflow und Browserkonsole sind für die datierte lokale Arbeitskopie geprüft.

Der zulässige Reifegrad bleibt: **Lokaler synthetischer CRM-Core-Prototyp mit getrenntem lokalem Echtdaten-Staging – nicht produktiv freigegeben.** Dieses PASS erteilt keine Produktiv-, Security-, Rechts-, Datenschutz-, Kontakt-, Versand-, Cloud-, Supabase-, App- oder ACC-Freigabe.

