# AMAVIO One CRM – Datenlebenszyklus und Privacy Draft

**Status:** technischer/fachlicher Entwurf, keine Rechtsfreigabe

## Lebenszyklus

1. **Erfassung:** Quelle und Qualitätsstatus werden mitgeführt; im Core ausschließlich synthetisch.
2. **Prüfung:** Pflichtfelder, Beziehungen und Dublettenhinweis werden lokal geprüft.
3. **Nutzung:** nur innerhalb des lokalen CRM-Cores; keine externe Kommunikation.
4. **Änderung:** Audit-Ereignis und Zeitstempel; reversible Änderung kann rückgängig gemacht werden.
5. **Archivierung:** Datensatz wird ausgeblendet, Beziehungen bleiben erhalten.
6. **Wiederherstellung:** archivierter Datensatz kehrt kontrolliert zurück.
7. **Löschung:** im Prototyp nicht verfügbar; produktive Fristen und Rechtsgrundlagen sind offen.

## Datenschutzgrenzen

- Keine realen personenbezogenen Daten.
- Keine E-Mail-, Kalender-, Cloud-, Tracking- oder KI-Übertragung.
- Keine automatische Kontaktaufnahme.
- Keine Ableitung einer Rechtsgrundlage aus einem CRM-Status.
- `consentStatus: unknown` ist kein Einwilligungsnachweis.
- Archivierung ist keine rechtliche Löschung.
- Browser-`localStorage` ist kein freigegebener produktiver Speicher.

## Produktive Blocker

Rechtsgrundlagen je Zweck, Informationspflichten, Aufbewahrungsfristen, Löschkonzept, Betroffenenrechte, AV-/DPA-Verträge, technische und organisatorische Maßnahmen, Hostingort, Backup-Schutz, Zugriffskontrolle, Incident-Prozess und Freigabe durch qualifizierte Beratung.
