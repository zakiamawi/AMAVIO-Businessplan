# G1 Dateninventar und Klassifikation – Entwurf

**Datum:** 13.10.2026  
**Hinweis:** fachlich-technischer Entwurf, keine Rechtsberatung und keine Freigabe realer Daten

| Datenklasse | Beispiele im CRM | Geschäftlicher Zweck | Sensitivität | Minimierung / Standard | G1-Status |
|---|---|---|---|---|---|
| Organisationsstammdaten | Name, Branche, Region, Website | Account- und Vertriebssteuerung | niedrig bis mittel | nur geschäftlich erforderliche Felder | teilweise dokumentiert |
| Geschäftskontaktdaten | Name, geschäftliche Funktion, geschäftliche E-Mail/Telefon | Beziehungs- und Vertriebsarbeit | personenbezogen | Kanal und Zweck müssen je Kontakt dokumentiert sein | gesperrt |
| Kontaktstatus | Quelle, Aktualität, Widerspruch, Sperre, Informationsstatus | zulässige und respektvolle Kontaktsteuerung | hoch relevant | Sperrstatus darf nie überschrieben werden | teilweise modelliert |
| Chancen- und Bedarfsdaten | Bedarf, Potenzial, Phase, Entscheidungsweg | Vertriebssteuerung | geschäftlich vertraulich | keine unbelegten Aussagen als Fakten | synthetisch nutzbar |
| Gesprächs- und Notizinhalte | Gesprächsergebnis, offene Fragen, nächste Schritte | Nachvollziehbarkeit | potenziell sensibel | sachlich, zweckgebunden, keine unnötigen Personendetails | G1-Regel offen |
| Termine und Aufgaben | Zeitpunkt, Titel, Zuständigkeit | Arbeitsorganisation | mittel | keine privaten Kalenderinhalte | synthetisch nutzbar |
| Angebote und Entscheidungen | Betrag, Leistungsrahmen, Status, Begründung | kommerzielle Steuerung | vertraulich | Version, Herkunft und Freigabestatus sichtbar | synthetisch nutzbar |
| Recherchemetadaten | öffentliche Quelle, Datum, Qualitätsstatus, Organisation | Zielkundenprüfung | variabel | keine Schutzumgehung, keine unkontrollierte Personenübernahme | produktiv gesperrt |
| Auditdaten | Aktion, Zeitpunkt, Objekt, Verantwortlicher | Nachvollziehbarkeit | vertraulich | keine Geheimnisse oder vollständigen Inhaltskopien | lokal vorbereitet |
| Sicherungsdateien | vollständiger CRM-Zustand | Wiederherstellung | sehr hoch | verschlüsselte Ablage, Zugriff und Fristen erforderlich | technisch lokal, G1 offen |

## Nicht in CRM aufzunehmen

- Passwörter, API-Schlüssel, Tokens oder Authentifizierungsartefakte;
- private Kontaktdaten ohne beschlossenen Zweck;
- besondere Kategorien personenbezogener Daten ohne gesonderten, belegten Bedarf und Freigabe;
- Research-Teilnehmerdaten aus Rollentests;
- operative ACC-Falldaten oder App-Nutzerdaten;
- unkontrollierte Datenkopien aus geschützten Plattformen.

## Offene Product-Owner-Entscheidungen

- Welche realen Kontaktgruppen sind zuerst zulässig: bestehende Geschäftskontakte, Empfehlungen, öffentlich recherchierte Funktionen oder weitere Gruppen?
- Welche Pflichtnachweise gelten je Quelle und Kontaktkanal?
- Welche Aufbewahrungsfrist gilt je Datenklasse?
- Welche Inhalte dürfen in Gesprächsnotizen ausdrücklich nicht erfasst werden?
- Wo wird die lokale Datenbank verschlüsselt gespeichert und wie wird der Gerätezugriff abgesichert?

