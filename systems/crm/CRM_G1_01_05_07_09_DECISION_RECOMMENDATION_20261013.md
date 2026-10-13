# G1-01, G1-05, G1-07 und G1-09 – Entscheidungsempfehlung

**Status:** Mit `PO-CRM-043` am 13.10.2026 als lokale Arbeitslogik angenommen; keine G1-10- oder Produktivfreigabe  
**Datum:** 13.10.2026

Diese Empfehlungen sind bewusst keine produktive Freigabe. Sie machen die noch offenen Entscheidungen konkret, ohne Datenschutz-, Rechts-, Security- oder Betriebsnachweise zu fingieren.

## G1-01 Datenumfang und Zweck – Empfehlung

Erlaubter Erstumfang: Unternehmensstammdaten, geschäftliche Kontaktdaten, sachliche Beziehungs- und Verlaufsdaten, kommerzielle Chancen-/Angebotsdaten sowie Herkunfts- und Qualitätsnachweise. Besondere Kategorien, Ausweis-, Bank-, Gesundheits- und private Lebensdaten bleiben ausgeschlossen. Erlaubte Zwecke: B2B-Beziehungsarbeit, Bedarfsqualifizierung, Chancensteuerung, Partnerarbeit, Aufgaben-/Gesprächsdokumentation und Nachweisführung. Produktive Ansprache bleibt je Quelle und Kanal separat zu prüfen.

## G1-05 Lebenszyklus – Empfehlung

Die vorhandenen Prüffristen von 90, 180, 365, 365, 730 und 30 Tagen sollen zunächst als Wiedervorlage- und Prüfintervalle bestätigt werden, nicht als automatische Löschfristen. Jede Minimierung, Archivierung oder spätere Löschung braucht Anlass, verantwortliche Person, betroffene Objekte und Abschlussnachweis. Gesetzliche Aufbewahrung, Rechtsgrundlage und Betroffenenprozesse bleiben extern zu prüfen.

## G1-07 Sicherung und Wiederherstellung – Empfehlung

- Ziel-RPO: höchstens 24 Stunden für freigegebene CRM-Daten.
- Ziel-RTO: höchstens 4 Stunden für den lokalen Einzelplatzbetrieb.
- Rhythmus: tägliche versionierte Sicherung sowie zusätzliche Sicherung vor Import, Migration oder größerer Änderung.
- Rotation: zunächst 30 Tage mit dokumentierter monatlicher Prüfung; verbindliche Frist erst nach Datenschutz-/Betriebsabgleich.
- Verantwortung: CRM-Administration als Hauptverantwortung; namentliche Vertretung vor Freigabe ergänzen.
- Mindestnachweise: Geräte- und Sicherungsverschlüsselung, Speicherort, Zugriffsschutz, mindestens eine beobachtete Wiederherstellung in der später freigegebenen Betriebsumgebung.

Die R3.10-In-Memory-Probe erfüllt nur den lokalen technischen Round-Trip; sie bestätigt nicht die vorgenannten Betriebsnachweise.

## G1-09 Vorfall und Rückabwicklung – Empfehlung

Product Owner beziehungsweise benannte CRM-Administration übernimmt die Erstkoordination; eine namentliche Vertretung bleibt einzutragen. Mindestablauf: Nutzung stoppen, Zustand isolieren, Umfang bewerten, Sicherung prüfen, kontrolliert wiederherstellen, Maßnahmen dokumentieren und Freigabe zum Wiederanlauf festhalten. Interne Eskalationswege, Erreichbarkeit, rechtliche Meldepflichten und Fristen müssen vor Echtdatennutzung fachlich und rechtlich bestätigt werden.

## Beschlusswirkung und weiterhin erforderliche Nachweise

Die empfohlenen Arbeitsregeln sind für G1-01, G1-05, G1-07 und G1-09 angenommen. Offen bleiben insbesondere Vertretung, externe Rechts-/Datenschutzprüfung, Geräte- und Sicherungsverschlüsselung, Zielumgebungs-Restore, Meldewege und Rechtsfristen. Die Annahme aktiviert weder G1-10 noch C1, Echtdaten, Import, Versand oder externe Verbindungen. Maßgeblich ist `CRM_G1_PRODUCT_OWNER_DECISION_RECORD_20261013.md`.
