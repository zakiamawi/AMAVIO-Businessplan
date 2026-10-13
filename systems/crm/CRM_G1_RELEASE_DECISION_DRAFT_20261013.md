# G1 Release Decision – Draft

**Entscheidungsgegenstand:** Nutzung realer Geschäftskontaktdaten im lokalen AMAVIO One CRM  
**Datum:** 13.10.2026  
**Aktuelle Empfehlung:** NO-GO

## Begründung

Die Fachobjekte, lokalen Beziehungen, Herkunftsfelder, Sperrkennzeichen, Archivierung, Audit-Ereignisse und versionierten Sicherungen zeigen, dass die CRM-Grundlage strukturell auf G1 vorbereitet werden kann. Das Entry-Gate-Closure-Paket ergänzt sechs Datenklassen, einen Fristen- und Importvertrag, Betroffenen- und Incident-Playbooks, eindeutige Verantwortlichkeiten sowie vier auditierbare synthetische Trockenläufe. Diese Nachweise ersetzen jedoch keine Zugriffskontrolle, Rechtsprüfung, reale Geräte-/Betriebsfreigabe oder Product-Owner-Entscheidung.

Folgende Blocker verhindern aktuell eine Freigabe:

- keine Authentifizierung und keine technisch erzwungene Berechtigung;
- keine freigegebene Rechts- und Informationspflichtenlogik für reale Kontaktgruppen und Kanäle;
- vorbereitete, aber nicht beschlossene Aufbewahrungs-, Auskunfts-, Berichtigungs- und Löschprozesse;
- synthetisch geprüfter, aber nicht produktiv freigegebener Import- und Rollbackprozess;
- synthetisch geprobter, aber nicht operativ besetzter Incident- und Wiederanlaufprozess;
- keine bestätigte verschlüsselte Ablage- und Geräteanforderung.

## Zulässiger nächster Block

Der intern ausführbare Gate-Closure-Block ist umgesetzt. Zulässig sind anschließend nur das Einholen der fehlenden fachlichen, rechtlichen, technischen und betrieblichen Nachweise sowie die gesonderte G1-Entscheidung. Nicht zulässig sind reale Daten, externe Connectoren, Versand oder eine stillschweigende Aktivierung.

## Spätere Entscheidungsoptionen

- **GO – eng begrenzt:** nur genau definierte Datenklassen, ein lokaler autorisierter Nutzer, dokumentierte Quelle und Zweck, geschlossene Gates und getestete Rückabwicklung.
- **GO mit Auflagen:** zeitlich und mengenmäßig begrenzter Pilot mit zusätzlichen Kontrollen.
- **NO-GO:** weitere Nutzung ausschließlich synthetisch.

Eine spätere Entscheidung muss den zulässigen Datenumfang, Speicherort, Verantwortlichen, Start- und Enddatum, Prüfintervall und Stop-Kriterien ausdrücklich benennen.

