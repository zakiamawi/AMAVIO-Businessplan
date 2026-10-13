# G1 Vorfall und Rückabwicklung – Playbook-Entwurf

**Status:** lokal-synthetisch geprobt; operative Verantwortlichkeit und Meldewege offen

## Sofortfolge

1. **Stoppen:** Import, Bearbeitung und Außenaktionen anhalten; Outbound bleibt technisch aus.
2. **Isolieren:** betroffenen lokalen Zustand, Datei oder Snapshot kennzeichnen und nicht weiterverwenden.
3. **Bewerten:** Umfang, Datenklassen, mögliche Personen, Zeitraum, Ursache und Auswirkungen feststellen.
4. **Sichern:** Audit- und Snapshot-Nachweis erhalten; keine Beweise durch unkontrolliertes Löschen verändern.
5. **Entscheiden:** Product Owner, Datenschutz/Recht und technische Verantwortung nach noch zu beschließendem Meldeweg einbeziehen.
6. **Rückabwickeln:** letzten geprüften Snapshot wiederherstellen oder betroffene Daten kontrolliert berichtigen/sperren.
7. **Prüfen:** Integrität, Suche, Sperrstatus, Beziehungen und geschlossene Außenwirkung testen.
8. **Dokumentieren:** Ursache, Entscheidung, Maßnahmen, Restrestrisiko und Wiederanlauf festhalten.

## Lokaler Trockenlauf

Die G1-Kontrollsuite protokolliert diese Reihenfolge als synthetische Übung. Sie sendet keine Meldung, verändert keine externen Systeme und behauptet keine echte Incident-Reife. Ein realer Prozess benötigt benannte Verantwortliche, erreichbaren Meldeweg, Eskalationsfristen, Geräte-/Zugriffssperre und einen beobachteten Restore-Test.

## Wiederanlaufkriterium

Erst wenn Ursache eingegrenzt, betroffener Zustand isoliert, kontrollierter Datenstand geprüft, Sperren wirksam und Entscheidung dokumentiert sind. Ohne klare Evidenz gilt weiterhin Stop/NO-GO.

