# AMAVIO One CRM – R3.2 Fachblock: Scope und Umsetzung

**Stand:** 10.10.2026  
**Arbeitskopie:** `20261010_AMAVIO_One_CRM_R3_2_Fachblock_Working`  
**Status:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Beschlossener Umfang

R3.2 erweitert ausschließlich den lokalen synthetischen Core um zusammenhängende Arbeitsobjekte:

- Notizen;
- Gespräche;
- Termine;
- Wiedervorlagen;
- Angebote;
- Entscheidungen;
- Dokumentreferenzen als reine Metadaten, ohne Dateiablage;
- lokale gespeicherte Ansichten;
- lokale, konfigurierbare Alterungshinweise.

## Vorher vorhanden und erhalten

- R3.1-AMAVIO-Layout, Typografie, Navy-/Creme-/Gold-System und zentrierte Inhaltsbreiten;
- Organisationen, Kontakte, Leads, Chancen, Pipeline, Partner, Aufgaben, Aktivitäten und Auswertungen;
- globale Suche, Tastaturkürzel, Dialogsemantik, Archiv/Wiederherstellung, Undo und lokaler Reset;
- phasenbezogene Validierung, Historie, Audit-Ereignisse und lokale Persistenz;
- synthetische Seeds, `.invalid`-Adressen und klare Produktgrenzen;
- getrennte ACC-Prüfmarker ohne Übertragung.

## Neu umgesetzt

| Bereich | Umsetzung |
|---|---|
| Arbeitsjournal | gemeinsame redaktionelle Oberfläche mit sieben fachlichen Tabs und Steuerungsansicht |
| CRUD | lokales Anlegen, Anzeigen, Bearbeiten, Archivieren und Wiederherstellen der sieben Objekttypen |
| Beziehungen | Verknüpfung zu Chance, Organisation und optional Kontakt; Angebote/Entscheidungen benötigen eine aktive Chance |
| Timeline/Audit | jede Neuanlage erzeugt verknüpfte Aktivität und Audit-Ereignis; Änderungen und Archivierung bleiben nachvollziehbar |
| Suche | globale Suche und Fachfilter umfassen alle sieben neuen Typen, einschließlich lokaler Dokumentreferenznummer |
| Gespeicherte Ansicht | lokale Kombination aus Objekttyp, Textsuche und Status; reversibel archivierbar |
| Alterung | lokale Hinweise für Chancen ohne Aktivität, fällige Wiedervorlagen und auslaufende Angebote; keinerlei Nachricht oder Automation |
| Detailansicht | vollständig erreichbare Detaildarstellung, Bearbeitung, Beziehungen und Audit-Verlauf |
| Persistenz | separates validiertes Schema v4 unter `amavio-one-crm-r3-2-local-core-v4`; v1/v2/v3 werden nicht überschrieben |

## Fachgrenzen

- Ein Termin ist kein Kalendertermin und wird nicht synchronisiert.
- Ein Gespräch ist eine strukturierte lokale Dokumentation; es existieren keine Audioaufnahme, Transkription oder Kommunikationsintegration.
- „Als versendet markiert“ ist nur ein interner Angebotsstatus und verschickt nichts.
- Eine Entscheidung dokumentiert ein Ergebnis, erzeugt aber keinen Vertrag, Auftrag oder ACC-Fall.
- Eine Dokumentreferenz speichert nur Titel, Typ, Version und lokale Textreferenz; kein Upload, kein Cloud-Speicher.
- Alterungshinweise führen weder Erinnerungen noch Nachrichten noch externe Aktionen aus.
- Gespeicherte Ansichten sind nicht geteilt und besitzen keine Mehrbenutzerwirkung.

## Nicht verändert oder aktiviert

- keine Authentifizierung, Datenbank oder Cloud;
- keine realen Daten und kein Import;
- keine E-Mail-/Kalender-/Dokumentenspeicherintegration;
- keine ACC-/App-Integration;
- keine produktive KI oder externe Automation;
- kein Deployment, Git-Push oder öffentliche Veröffentlichung;
- keine Mandanten- oder Mehrbenutzerfähigkeit.

## C0-Parallelarbeit

C0 wurde nur fachlich entschieden und dokumentiert. Die bevorzugte spätere Plattformgrundlage ist in `CRM_C0_DECISION_PACKAGE_20261010.md` festgehalten. Es wurde kein Anbieterzugang geöffnet, kein Projekt angelegt und C1 nicht begonnen.
