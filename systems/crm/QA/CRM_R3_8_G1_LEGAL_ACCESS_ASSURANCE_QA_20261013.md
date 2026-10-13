# QA – R3.8 G1 Legal & Access Assurance

Datum: 13.10.2026  
Prüfobjekt: `20261013_AMAVIO_One_CRM_R3_8_G1_Legal_Access_Assurance_Working`  
Zulässiger Reifegrad: **Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben**

## 1. Sicherung und Änderungsgrenze

- R3.7 vor Änderungen per SQLite-WAL-Checkpoint konsolidiert.
- vollständige Sicherung: `20261013_AMAVIO_One_CRM_R3_7_Sicherung_Pre_G1_Legal_Access_Closure`;
- separate R3.8-Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_8_G1_Legal_Access_Assurance_Working`;
- beide Kopien beim Anlegen: jeweils 6.449 Dateien, rund 178 MB;
- Post-QA-Snapshot: `backup-mv5y10y2`, Schema v7, plus lokaler synthetischer JSON-Export;
- keine Datei gelöscht, kein Git-Push, kein Deployment, kein externer Versand und keine Connector-Aktivierung.

## 2. Implementierte Prüfflächen

- sieben Quellen-/Zweck-/Kanalpfade einschließlich gesperrtem Anbieterpfad und verbotenem Schutzumgehungspfad;
- vier Informationspflicht-/Betroffenenrechte-Artefakte mit Version, Trigger und Evidenzanforderung;
- neun Zugriffsschutzkontrollen: drei lokal belegt, drei nicht implementiert, drei extern zu belegen;
- sechs synthetische Kontrollläufe einschließlich Rechtsvertrags- und Zugriffsschutz-Negativtest;
- kontrollierte Migration R3.7/v6 → R3.8/v7 ohne Öffnung eines Produktivflags;
- UI-Register „Recht & Quellen“ und „Zugriff & Gerät“ mit klarer NO-GO-Grenze.

## 3. Automatisierte Ergebnisse

| Ebene | Ergebnis |
|---|---|
| Build | bestanden; Vite Production Build, 1.603 Module |
| statisches QA-Gate | bestanden |
| Unit | 31/31 bestanden |
| Vertrag | 11/11 bestanden |
| Komponente | 9/9 bestanden |
| Integration | 5/5 bestanden |
| Logik gesamt | 56/56 bestanden |
| Persistenz | 1/1 bestanden |
| End-to-End | vollständiger lokaler Core- und G1-Pfad bestanden |
| Browserkonsole | 0 Fehler |

Der erste E2E-Aufruf innerhalb der macOS-Sandbox konnte Chromium wegen einer verweigerten MachPort-Registrierung nicht starten. Der unveränderte Test wurde danach mit der erforderlichen lokalen Browserberechtigung außerhalb dieser Sandbox erneut ausgeführt und bestand. Dies war eine Ausführungsumgebungsgrenze, kein CRM-Fehler.

## 4. Browser-, Responsive- und Accessibility-QA

Geprüfte Viewports: 1600×1000, 1280×900, 1024×900, 768×1024, 430×932 und 390×844. Für jeden Viewport wurden Arbeitstag, Cockpit, Pipeline, Auswertungen, Daten & Sicherung, Kontaktfreigabe sowie die beiden neuen Assurance-Register geprüft. Es entstand kein horizontales Seiten-Overflow und kein Framework-Fehleroverlay.

Tastatur/Fokus: Skip-Link, `Ctrl/⌘ K`, Escape-Schließen, Focus-Trap und Focus-Rückgabe bestanden. Der echte 200-%-Browserzoom wurde mit 1.280 px Außenbreite geprüft und reflowte auf 640 CSS-Pixel ohne Seiten-Overflow. Insgesamt wurden 55 lokale QA-Screenshots erzeugt. Ergebnisdatei: `QA/CRM_R3_8_G1_ASSURANCE_BROWSER_RESULT_20261013.json`.

Die manuelle Screenshot-Sichtprüfung fand einen in langen Vollseitenaufnahmen teilweise mitgerenderten Skip-Link. Die Off-Focus-Ausblendung wurde auf eine robuste Clip-/1-Pixel-Technik umgestellt; die Fokusdarstellung bleibt vollständig erhalten. Build, statisches QA-Gate, alle sechs Viewports, Tastatur-/Fokusprüfung und 200-%-Zoom wurden danach erneut bestanden. Die finalen Screenshots enthalten den Fehler nicht mehr.

## 5. Negative Sicherheits- und Datenschutzprüfungen

- `realDataEnabled=false`;
- `outboundEnabled=false`;
- `releaseEligible=false`;
- `productiveContactAllowed=false`;
- `productiveAccessAllowed=false`;
- keine externe Fetch-, XMLHttpRequest- oder WebSocket-Verbindung im aktiven Browsercode;
- ausschließlich `.invalid`-Adressen in synthetischen Testdaten;
- kein Login, kein Security-Claim, kein Secret-Feld und keine produktive Rollenbehauptung;
- geschützte Plattformen und Schutzumgehung bleiben ausgeschlossen.

## 6. Geräteevidenz

Read-only beobachtet wurden Betriebssystemversion `26.6.2` und unmittelbare Screen-Lock-Verzögerung. Geräte-/Volumeverschlüsselung konnte in der Ausführungsumgebung nicht verifiziert werden; DiskManagement war dort nicht verfügbar. Diese Lücke wird nicht als „bestanden“ umgedeutet und hält G1-06 gesperrt. Es wurden keine Gerätekennung, Recovery-Daten, Benutzergeheimnisse, Token oder Passwörter gelesen.

## 7. Abschlussbewertung

R3.8 ist lokal-synthetisch fachlich und technisch geprüft. G1-03 ist strukturiert, aber extern rechtlich gesperrt. G1-06 besitzt belegte lokale Schutzgrenzen, bleibt wegen fehlender Authentifizierung, Autorisierung, Sitzungssicherheit und Geräte-/Backupnachweise technisch gesperrt. G1-10 bleibt Product-Owner-gesperrt. Der Stand darf nicht als produktionsbereit, datenschutzrechtlich freigegeben, sicherheitsgeprüft, mehrbenutzerfähig oder für reale personenbezogene Daten freigegeben bezeichnet werden.

