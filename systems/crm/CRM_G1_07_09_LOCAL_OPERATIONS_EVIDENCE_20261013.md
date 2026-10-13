# G1-07/09 – Lokale Betriebsevidenz

**Stand:** 13.10.2026  
**Status:** lokale synthetische Evidenz; keine produktive Betriebsfreigabe

## Sicherungs- und Wiederherstellungsnachweise

- R3.11 wurde vollständig in `20261013_AMAVIO_One_CRM_R3_11_Sicherung_Pre_R3_12_G1_External_Technical_Readiness` gesichert.
- Die R3.12-Arbeitskopie ist `20261013_AMAVIO_One_CRM_R3_12_G1_External_Technical_Readiness_Working`.
- Quelle, Sicherung und Arbeitskopie hatten beim Kopiervorgang jeweils 6.803 Dateien; Quelle und Sicherung waren im read-only Vergleich identisch.
- Der SQLite-Integritätscheck ergab `ok`, Schema v7, WAL-Modus und aktivierte Fremdschlüssel.
- Vier lokale Zustands-Snapshots waren im geprüften Ausgangsstand vorhanden.
- Die isolierte Restore-Probe schreibt den aktuellen synthetischen Zustand in eine temporäre In-Memory-Datenbank, liest ihn zurück, validiert Schema und Synthetik und vergleicht die SHA-256-Prüfsumme. Der laufende Zustand wird nicht verändert.

## R3.12 Härtung

Die Arbeitskopie begrenzt Verzeichnis- und Dateirechte, schützt ändernde API-Operationen vor abweichender Browserherkunft und setzt restriktive Antwortheader. Diese Kontrollen sind Bestandteil des Persistenz- und Browser-QA, ersetzen aber keine verschlüsselte externe Sicherung.

## Beschlossene lokale Arbeitsziele

- RPO: 24 Stunden;
- RTO: 4 Stunden;
- Sicherung täglich und vor wesentlichen Änderungen;
- Rotationsprüfung nach 30 Tagen;
- Primärverantwortung: Zaki Amawi / CRM-Administration;
- kein automatisches Löschen und kein produktiver Wiederanlauf ohne kontrollierte Prüfung.

## Offene Betriebsnachweise

- verschlüsselter Sicherungsort und Nachweis der Wiederherstellbarkeit in der späteren Zielumgebung;
- benannte Vertretung mit Erreichbarkeit und Übergabe;
- realistisch gemessene Wiederherstellungsdauer gegen RTO 4 Stunden;
- dokumentierte tägliche Ausführung und Rotation;
- Geräteverschlüsselung, Bildschirmsperre und Firewall;
- juristisch geprüfte Melde-, Bewertungs- und Kommunikationsfristen;
- produktive Identität, Autorisierung, Monitoring und Alarmierung.

## Incident-Trockenlauf

Der synthetische Ablauf `Stoppen → Isolieren → Bewerten → Sicherung prüfen → kontrolliert wiederherstellen → dokumentieren → Wiederanlauf freigeben` ist lokal modelliert. Es wurden keine externen Meldungen, Nachrichten oder Wiederherstellungen ausgeführt.

## Gate-Entscheidung

G1-07 und G1-09 bleiben als lokale Product-Owner-Arbeitsbeschlüsse protokolliert, aber mit Fremdnachweisen offen. Diese Evidenz schließt weder den Produktivbetrieb noch G1-10.
