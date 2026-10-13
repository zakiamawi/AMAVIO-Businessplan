# AMAVIO One CRM – Status- und Übergangsvertrag

**Version:** Draft 0.2 · 09.10.2026

## Opportunity-Pipeline

| Phase | Zulässige direkte Übergänge | Mindestanforderung |
|---|---|---|
| Erstkontakt | Qualifiziert, Verloren | Organisation, Titel, Owner, nächster Schritt |
| Qualifiziert | Erstkontakt, Scoping, Verloren | Bedarf und Ansprechpartnerstatus beschrieben |
| Scoping | Qualifiziert, Angebot, Verloren | Scope-Notiz und nächste Handlung |
| Angebot | Scoping, Entscheidung, Verloren | Potenzial oder begründete Offenheit; Angebotskontext |
| Entscheidung | Angebot, Gewonnen, Verloren | Entscheidungspfad und Fälligkeit |
| Gewonnen | Entscheidung | lokaler Gewinnmarker; keine automatische ACC-Übergabe |
| Verloren | Qualifiziert | Verlustgrund erforderlich |

Vorwärts- und dokumentierte Rückwärtsbewegungen sind zulässig. Sprünge über Phasen sind im Core gesperrt. Archivierung ist kein Pipeline-Schritt, sondern Objektstatus.

## Opportunity-Status

- `active`: regulär bearbeitbar.
- `on_hold`: Phase bleibt erhalten; Grund und Wiedervorlagedatum erforderlich.
- `won`: wird bei Phase `won` gesetzt.
- `lost`: wird bei Phase `lost` gesetzt; Verlustgrund erforderlich.
- `archived`: aus Standardansichten ausgeblendet; wiederherstellbar.

## Aufgabenstatus

- `open → in_progress` oder direkt `completed`;
- `in_progress → open` oder `completed`;
- `completed → open` oder `in_progress`, jeweils mit Audit;
- jeder nicht archivierte Status kann separat archiviert werden; Wiederherstellung behält den vorherigen Aufgabenstatus.

## Organisation/Kontakt

- Organisation: `active ↔ on_hold → archived → active`.
- Kontakt: `active ↔ do_not_contact → archived → active`.
- `do_not_contact` verhindert im späteren Produkt externe Kontaktaktionen; im lokalen Core existieren keine solchen Aktionen.

## Validierungsfehler

Ungültige Übergänge verändern keinen Zustand und erzeugen eine verständliche Fehlermeldung. Fehlende Pflichtfelder werden am Formular und in einer zusammenfassenden Fehlermeldung ausgewiesen. Kein stilles Fallback auf erfundene Werte.

## Historie

Jede erfolgreiche Status-/Phasenänderung erzeugt:

1. ein Audit-Ereignis mit vorher/nachher;
2. eine Aktivität vom Typ `stage_change` oder `system_event`;
3. einen aktualisierten `updatedAt`-Zeitstempel;
4. eine Undo-Aktion, sofern die Änderung lokal reversibel ist.
