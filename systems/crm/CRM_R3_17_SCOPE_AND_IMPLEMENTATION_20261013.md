# AMAVIO One CRM – R3.17 Scope und Umsetzung

**Datum:** 13.10.2026  
**Reifegrad:** Lokaler CRM-Prototyp mit synthetischem Core und schreibgeschützt eingebundenen Importdaten – nicht produktiv freigegeben

## Ziel

R3.17 schließt eine konkrete Bedienlücke: Organisationen und Kontakte, die in R3.16 in ihre fachlichen Reiter integriert wurden, müssen auch über die bereits vorhandene globale Suche auffindbar sein. Die globale Suche bleibt ein Einstieg in die vorhandenen Arbeitsbereiche und wird nicht zu einem neuen Datenpool.

## Erhalten

- R3.16 bleibt als unveränderte Ausgangsarbeitskopie erhalten.
- Der synthetische CRM-Core, sein Schema und seine lokale Persistenz bleiben unverändert.
- Die getrennte lokale SQLite-Staging-Datenbank bleibt die Quelle der importierten Datensätze.
- `Do_Not_Contact = TRUE` und `Outreach_Approved = FALSE` bleiben wirksam und sichtbar.
- Die Reiter `Organisationen` und `Kontakte` sowie ihre vorhandenen Detaildarstellungen bleiben die einzigen fachlichen Zielansichten.
- Versand, Cloud-Synchronisierung, Supabase, App und ACC bleiben deaktiviert.

## Verändert

- Die globale Suche startet ab zwei eingegebenen Zeichen zusätzlich zwei begrenzte lokale Leseabfragen: höchstens sechs importierte Organisationen und sechs importierte Kontakte.
- Importtreffer tragen eine eindeutige Typkennzeichnung und einen schreibgeschützten beziehungsweise nicht kontaktierbaren Kontext.
- Die Auswahl eines Importtreffers navigiert zum richtigen Reiter und öffnet die zentrale importierte Detailansicht.
- Die bisher je Reiter lokal verwaltete Importdetail-Auswahl wurde auf App-Ebene zusammengeführt. Die fachliche Oberfläche bleibt identisch; die Zuständigkeit ist nun eindeutig.
- Lade-, Fehler-, Kurzabfrage- und Leerezustände der globalen Suche sind getrennt.

## Nicht verändert oder umgesetzt

- keine automatische oder manuelle Übernahme eines Importdatensatzes in den synthetischen Core;
- keine Bearbeitung, Archivierung oder Löschung importierter Datensätze;
- keine Suche außerhalb lokaler Dateien und APIs;
- kein Supabase-Projekt, kein Login, keine Schlüssel, keine Authentifizierung und keine RLS-Policy;
- keine E-Mail-, Kalender-, Research-, App- oder ACC-Integration;
- keine Outreach-Freigabe und kein Versand.

## Technischer Ablauf

1. `⌘ K` oder `Strg K` öffnet den bestehenden Suchdialog.
2. Unter zwei Zeichen findet keine Importabfrage statt.
3. Ab zwei Zeichen werden der lokale Core-Index und die zwei lokalen Importendpunkte parallel ausgewertet.
4. Höchstens 24 lokale Core-Treffer sowie je sechs importierte Organisationen und Kontakte werden dargestellt.
5. Importtreffer wechseln in den passenden Reiter und öffnen den zentralen schreibgeschützten Detaildialog.
6. Ein Kontakt zeigt weiterhin ausdrücklich `Nicht kontaktieren`.

## Akzeptanzkriterien

- `Adesso SE` ist über die globale Suche als importierte Organisation auffindbar und öffnet sich im Reiter `Organisationen`.
- `Kristin Assmann` ist als importierter Kontakt auffindbar und öffnet sich im Reiter `Kontakte`.
- Der Kontaktstatus `Nicht kontaktieren` bleibt sichtbar.
- Bereichssuche und Pagination bleiben funktionsfähig.
- Tastaturkürzel, Escape, Focus-Trap und Focus-Rückgabe bleiben funktionsfähig.
- Browserkonsole bleibt ohne Fehler.
- Kein produktiver oder externer Seiteneffekt wird ausgelöst.

## Offene Folgeentscheidung

Die kontrollierte Übernahme eines importierten Eintrags in ein künftig produktives kanonisches Datenmodell ist ausdrücklich kein Teil von R3.17. Dafür sind Identitätsabgleich, Feldmapping, Freigabe-/Rechtsstatus, Änderungsverlauf, Rollback und Zielplattform in einem gesonderten Beschluss zu definieren.

