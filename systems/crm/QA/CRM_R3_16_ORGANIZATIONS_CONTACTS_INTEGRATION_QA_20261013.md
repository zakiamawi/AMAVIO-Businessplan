# AMAVIO One CRM – R3.16 Organisations- und Kontaktintegration QA

**Datum:** 13.10.2026  
**Stand:** lokal vollständig geprüft – nicht produktiv freigegeben  
**Prüfgegenstand:** Korrektur des sichtbaren R3.15-Poolbereichs und Einbindung importierter Datensätze in die vorhandenen CRM-Reiter

## Abnahmekriterien

- kein sichtbarer Reiter `Altdaten-Staging`;
- 2.242 importierte Organisationen im Reiter `Organisationen`;
- 3.213 importierte Kontakte im Reiter `Kontakte`;
- Filter `Alle CRM-Daten`, `Lokal angelegt`, `Importiert`;
- serverseitige Suche und Pagination;
- normale, dialogsemantisch korrekte Detailansichten;
- `Nicht kontaktieren` für importierte Kontakte;
- keine sichtbare Prüfqueue, Quarantäne, Herkunftsmatrix oder Poolübersicht;
- synthetischer Demo-Reset verändert die Importdatei nicht;
- kein Versand, keine Cloud, kein Supabase, keine App- oder ACC-Verbindung;
- keine Browserkonsolenfehler;
- Desktop, Zwischenbreiten, Mobile, Tastatur und echter 200-%-Zoom geprüft.

## Prüfergebnisse

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Build | **PASS** | Vite-Produktionserstellung ohne Fehler |
| statisches QA-Gate | **PASS** | aktiver Pool-Reiter und aktive Pool-Route ausgeschlossen; lokale API-Grenze geprüft |
| Unit | **33/33 PASS** | Zustands-, Analyse-, Entscheidungs- und Schutzlogik |
| Vertrag | **16/16 PASS** | einschließlich Umfang, Mehrfachbeziehungen, Sperren und Import-Hintergrundkontrollen |
| Komponenten | **10/10 PASS** | Formulare, Dialoge, Workspaces und G1-Grenzen |
| Integration | **6/6 PASS** | verbundene lokale CRM-Abläufe |
| Persistenz | **1/1 PASS** | SQLite, Sicherung, Export, Reset und Restore |
| E2E | **PASS** | 20 Core-Abläufe plus Organisations-/Kontaktintegration; Konsole fehlerfrei |
| Browser-QA | **PASS** | 1600, 1280, 1024, 768, 430 und 390 Pixel |
| Tastatur/Dialog | **PASS** | Tastaturöffnung, Escape, Focus-Trap und Focus-Rückgabe |
| echter 200-%-Zoom | **PASS** | Chromium-Profil mit ungefähr 640 CSS-Pixeln bei 1280 Pixel Außenbreite |
| visuelle Sichtprüfung | **PASS** | Desktop-Organisationen und Mobile-Kontakte gegen bestehende AMAVIO-Designrichtung geprüft |

## Fachliche Beobachtung

- Der unerwünschte Reiter `Altdaten-Staging` ist nicht mehr erreichbar.
- Die technische Prüfarchitektur ist nicht gelöscht, sondern im Hintergrund erhalten.
- Organisationen und Kontakte erscheinen dort, wo die tägliche CRM-Arbeit stattfindet.
- Importierte Einträge sind visuell dezent als `Importiert` gekennzeichnet und nicht als eigener Datenpool inszeniert.
- Die Kontaktsperre bleibt sichtbar; technische Prüfbegriffe werden nicht in den normalen CRM-Arbeitsfluss getragen.

## Offene Grenzen

- Importierte Datensätze sind noch nicht bearbeitbar.
- Die globale `⌘ K`-Suche durchsucht weiterhin den synthetischen Core; die importierten Bestände werden innerhalb ihrer beiden Reiter durchsucht.
- Supabase, Authentifizierung, produktiver Versand, Connectoren, App und ACC bleiben deaktiviert.
- Ein grüner lokaler Testlauf ist keine Produktiv-, Datenschutz-, Security- oder Rechtsfreigabe.
