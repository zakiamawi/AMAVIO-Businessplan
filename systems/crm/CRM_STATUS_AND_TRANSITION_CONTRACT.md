# AMAVIO One CRM – Status- und Übergangsvertrag

**Version:** Fachvertrag 1.0 · Product-Owner-Beschluss vom 09.10.2026  
**Umsetzungsstatus:** in der datierten R3-Arbeitskopie lokal-synthetisch umgesetzt und automatisiert geprüft; keine produktive Freigabe

> **R3.2-Fortschreibung 10.10.2026:** Die nachfolgenden lokalen Fachobjektstatus sind zusätzlich umgesetzt. Statuswerte besitzen ausschließlich interne synthetische Dokumentationswirkung.

## Chancenpipeline

| Phase | Zulässige direkte Übergänge | Mindestanforderung |
|---|---|---|
| Erstkontakt | Qualifiziert, Verloren | Organisation, Chancenbezeichnung, Verantwortlicher sowie nächster Schritt mit Datum; Kontaktperson und Potenzial dürfen offen bleiben |
| Qualifiziert | Erstkontakt, Leistungsrahmen, Verloren | dokumentierter Bedarf, zuständige Kontaktrolle oder begründete offene Kontaktfrage sowie nächste Handlung; Budget und Zeitplan dürfen offen bleiben |
| Leistungsrahmen (`scoping`) | Qualifiziert, Angebot, Verloren | Zielbild-/Leistungsrahmen-Notiz, offene Punkte sowie Hauptkontakt oder dokumentierte Ausnahme; finaler Umfang und Preis dürfen offen bleiben |
| Angebot | Leistungsrahmen, Entscheidung, Verloren | Angebotskontext, Leistungsgrenze, Betrag oder begründeter offener Betrag sowie Gültigkeits- oder Folgeschritt; formale Freigabe darf offen bleiben |
| Entscheidung | Angebot, Gewonnen, Verloren | Entscheiderrolle, Entscheidungspfad, Entscheidungsdatum oder -korridor sowie nächster Schritt; Ergebnis darf offen bleiben |
| Gewonnen | Entscheidung | ausdrücklicher lokaler Gewinnmarker und dokumentierter Leistungsrahmen; ACC-Freigabe und operative Startbereitschaft bleiben separat |
| Verloren | Qualifiziert | sachlicher Verlustgrund und Abschlussdatum; spätere Wiedervorlage darf offen bleiben |

Vorwärts- und dokumentierte Rückwärtsbewegungen sind zulässig. Sprünge über Phasen sind im Core gesperrt. Archivierung ist kein Pipeline-Schritt, sondern Objektstatus.

## Lead- und Chancen-Grenze

- Ein **Lead** ist ein ungeprüftes Signal mit Quelle und verantwortlicher interner Rolle.
- Eine **Chance** setzt mindestens eine benannte Organisation, einen dokumentierten konkreten Bedarf, einen Verantwortlichen und einen fälligen nächsten Schritt voraus.
- Die Konvertierung muss später als referenzierter, auditierbarer Vorgang umgesetzt werden; die Lead-UI bleibt bis zu einem gesonderten Umsetzungsauftrag geparkt.
- Die beschlossene Definition allein aktiviert keine neue UI-Funktion.

## Chancenstatus

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

## R3.2-Arbeitsjournal

| Objekt | Status / Übergang | Zusätzliche Regel |
|---|---|---|
| Gespräch | über Gesprächsdatum dokumentiert; Archivieren/Wiederherstellen | kein Kommunikations- oder Transkriptionsstatus |
| Termin | `planned → completed/cancelled` | Ende darf nicht vor Beginn liegen; keine Kalenderwirkung |
| Wiedervorlage | `open → completed/cancelled` | Owner und Fälligkeit Pflicht; Alterung erzeugt nur lokale Hinweise |
| Angebot | `draft → reviewed → marked_sent → accepted/rejected`; offene Stände können `expired` werden | aktive Chance, Version, Gültigkeit und Leistungsrahmen Pflicht; `marked_sent` versendet nichts |
| Entscheidung | `pending → approved/declined/deferred` | bei nicht offenem Status ist Entscheidungsdatum Pflicht; keine Vertragswirkung |
| Dokumentreferenz | `draft → current → superseded/archived` | nur Metadaten und lokale Textreferenz; keine Dateioperation |
| Notiz | lokal dokumentiert; Bearbeiten; Archivieren/Wiederherstellen | jede Mutation erzeugt Audit; kein stiller externer Wissensspeicher |

Gespeicherte Ansichten und Alterungsregeln sind lokale Arbeitseinstellungen, keine fachlichen Statusautomaten. Änderungen werden lokal bestätigt und lösen keine externen Aktionen aus.

## Validierungsfehler

Ungültige Übergänge verändern keinen Zustand und erzeugen eine verständliche Fehlermeldung. Fehlende Pflichtfelder werden am Formular und in einer zusammenfassenden Fehlermeldung ausgewiesen. Kein stilles Fallback auf erfundene Werte.

Die phasenbezogenen Mindestkriterien sind in den Chancenformularen dokumentierbar und werden beim Eintritt in eine Phase technisch geprüft. Fehlende Evidenz wird mit Feldbezug benannt; sie wird nicht durch einen erfundenen Wert ersetzt. Diese Durchsetzung gilt ausschließlich im lokalen synthetischen Zustand.

## Kennzahl- und Exportgrenze

- Auswertungen dürfen Anzahl und sichtbares Potenzial darstellen.
- Ein gewichteter Forecast ist ohne empirisch begründete Wahrscheinlichkeiten und Finance-Freigabe nicht zulässig.
- Export bleibt im R3-Zielvertrag deaktiviert. Eine spätere Exportfunktion benötigt einen separaten rollenbezogenen, zweckgebundenen, datenminimierten und auditierten Vertrag.

## Historie

Jede erfolgreiche Status-/Phasenänderung erzeugt:

1. ein Audit-Ereignis mit vorher/nachher;
2. eine Aktivität vom Typ `stage_change` oder `system_event`;
3. einen aktualisierten `updatedAt`-Zeitstempel;
4. eine Undo-Aktion, sofern die Änderung lokal reversibel ist.

## R3.15 – Stagingstatus und zulässige Übergänge

Die R3.15-Stagingoberfläche verändert keine Statuswerte. Importseitig gelten folgende fachliche Zustände:

- `confirmed_current`: in der bestätigt aktuellen Importvorbereitung belegt;
- `official_dated`: offizielle Quelle mit dokumentiertem, aber zeitgebundenem Stand;
- `historical_open`: historischer Stand, Aktualität offen;
- `changed_legacy`: Änderung beziehungsweise alter Datensatz dokumentiert;
- `ambiguous`: Zuordnung oder Aktualität nicht eindeutig bestätigt;
- `quarantined`: Mapping-, Identitäts- oder Qualitätskonflikt; keine Core-Übernahme.

Kein Zustand darf automatisch zu einer Kontaktfreigabe, Einwilligung oder Rechtsgrundlage übergehen. Zulässige spätere Übergänge benötigen eine neue Quelle, Provenienz, Prüfer, Zeitpunkt und dokumentierte Entscheidung. `blocked`, `withdrawn` und `do_not_contact` bleiben sperrend; `unknown` ist keine Freigabe. Eine Übernahme vom Staging in den operativen Core ist in R3.15 nicht implementiert.
