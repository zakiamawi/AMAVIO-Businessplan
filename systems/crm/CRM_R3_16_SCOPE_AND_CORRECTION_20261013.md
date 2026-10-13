# AMAVIO One CRM – R3.16 Scope und Produktkorrektur

**Datum:** 13.10.2026  
**Product-Owner-Entscheidung:** PO-CRM-047  
**Arbeitsstatus:** lokal umgesetzt, nicht produktiv freigegeben

## Anlass

R3.15 hatte die importierten Daten als sichtbaren eigenen Bereich `Altdaten-Staging` mit Pool-, Prüf-, Quarantäne-, Quellen- und Sperransichten dargestellt. Das war technisch nachvollziehbar, aber fachlich nicht der gewünschte CRM-Arbeitsablauf. Der Product Owner hat klargestellt: Die importierten Organisationen und Kontakte sollen nicht als Datenprüfung oder eigener Pool im CRM erscheinen, sondern in den dafür bereits vorhandenen Reitern genutzt werden.

## Verbindliche Korrektur

1. Der sichtbare Navigationspunkt `Altdaten-Staging` wird entfernt.
2. Importierte Organisationen erscheinen im bestehenden Reiter `Organisationen`.
3. Importierte Kontakte erscheinen im bestehenden Reiter `Kontakte`.
4. Beide Reiter bieten eine gemeinsame fachliche Sicht mit den Filtern `Alle CRM-Daten`, `Lokal angelegt` und `Importiert`.
5. Suche, Pagination und Detailansichten funktionieren innerhalb dieser beiden Arbeitsbereiche.
6. Importierte Datensätze bleiben vorerst schreibgeschützt.
7. Kontakte mit `do_not_contact = 1` und `outreach_approved = 0` bleiben als `Nicht kontaktieren` gekennzeichnet.
8. Prüfqueue, Quarantäne, Dublettensignale, Herkunft und Feldmapping bleiben technische Hintergrundkontrollen und werden nicht als CRM-Hauptfunktion präsentiert.

## Erhaltene technische Trennung

- Der bearbeitbare synthetische CRM-Core bleibt in seiner bisherigen SQLite-Datei.
- Die importierten Organisationen und Kontakte bleiben in der separaten lokalen Importdatei.
- Die Oberfläche führt beide Bestände fachlich zusammen, ohne sie technisch unkontrolliert zu verschmelzen.
- `Demo zurücksetzen` verändert nur den synthetischen Core.
- Es gibt keinen schreibenden Übernahmepfad für importierte Datensätze.

## Nicht Bestandteil von R3.16

- Supabase oder andere Cloud-Datenbank;
- Authentifizierung oder Mehrbenutzerbetrieb;
- E-Mail-Versand, Outreach-Automation oder Connectoren;
- App- oder ACC-Integration;
- produktive Kontaktfreigabe;
- Veröffentlichung, Deployment oder Git-Push.

## Reifegrad

**Lokaler CRM-Prototyp mit synthetischem Core und schreibgeschützt eingebundenen Importdaten – fachlich und technisch geprüft, nicht produktiv freigegeben.**
