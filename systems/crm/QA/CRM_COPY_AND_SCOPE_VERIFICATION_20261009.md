# AMAVIO One CRM – Sicherungs- und Scope-Verifikation

**Datum:** 09.10.2026  
**Arbeitsweise:** nicht destruktiv, lokal, ausschließlich synthetisch

## Pfade

- unveränderter Ausgangsordner: `20261008_AMAVIO_One_CRM_Cockpit_Working`
- vollständige Sicherung vor Änderungen: `20261009_AMAVIO_One_CRM_Cockpit_Sicherung_Pre_Canonical_Core`
- bearbeitete Arbeitskopie: `20261009_AMAVIO_One_CRM_Canonical_Core_Working`

Alle drei Ordner liegen unter `09_Unternehmenssystem/07_AMAVIO_One_CRM/`. Änderungen dieses Pakets erfolgten ausschließlich in der datierten Arbeitskopie. Es gab kein Deployment, keinen Git-Push, keinen Upload und keine externe Übertragung.

## Verifikation der Sicherung

- `diff -qr` zwischen Ausgangsordner und Sicherung: Exit 0, keine Differenzen.
- Dateianzahl Ausgangsordner: 6.005 reguläre Dateien.
- Dateianzahl Sicherung: 6.005 reguläre Dateien.
- Symlinks Ausgangsordner: 14.
- Symlinks Sicherung: 14.
- zusätzlicher `rsync -nrc --delete`-Prüflauf: keine Dateiänderungen gemeldet; die ausgegebenen Hinweise betrafen ausschließlich identische `node_modules/.bin`-Symlinks, die durch `diff -qr` und die Symlinkzählung separat bestätigt wurden.

## Scope-Schutz

- vorhandene Markenassets, Konzeptbilder, Layoutgrundlage und synthetische Seed-Idee wurden erhalten;
- der v1-LocalStorage-Schlüssel `amavio-one-crm-cockpit-v1` wird nicht importiert, überschrieben oder gelöscht;
- die Arbeitskopie verwendet den getrennten Schlüssel `amavio-one-crm-canonical-core-v2`;
- keine realen Kontakt- oder Research-Teilnehmerdaten wurden verwendet;
- App, CRM und Arrival Control Center wurden weder im Code noch in Datenbeständen verbunden;
- ACC-Handoff ist ausschließlich ein lokaler Review-Marker und Dokumententwurf.

## Wiederherstellbarkeit

Der gesicherte Vorzustand bleibt vollständig im Sicherungsordner erhalten. Die Arbeitskopie kann verworfen werden, ohne Ausgangsordner oder Sicherung zu verändern. Eine Lösch- oder Bereinigungsaktion wurde nicht ausgeführt.
