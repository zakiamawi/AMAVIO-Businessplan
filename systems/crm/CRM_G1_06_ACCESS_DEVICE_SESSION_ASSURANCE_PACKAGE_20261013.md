# G1-06 – Zugriff, Gerät und Sitzung: Assurance-Paket

Stand: 13.10.2026  
Status: **lokale Grenzen geprüft; produktiver Zugriffsschutz nicht implementiert**

## Aktuell belastbar

- der lokale Server bindet an `127.0.0.1`;
- Schema v7 akzeptiert ausschließlich synthetische Zustände;
- produktive Daten- und Versandflags bleiben aus;
- externe Adapter bleiben deaktiviert;
- Kosten- und Versandkontingente bleiben null;
- lokale Änderungen und Kontrollläufe werden auditierbar dokumentiert.

## Nicht vorhanden

- Login oder Identitätsanbieter;
- technisch erzwungene Benutzer- und Rollenberechtigungen;
- serverseitige Sitzung mit Ablauf, Widerruf und erneuter Authentifizierung;
- Mehrbenutzer- oder Mandantenisolation;
- produktive Geheimnisverwaltung;
- nachgewiesene Verschlüsselung der lokalen Datenbank und Sicherungen;
- bestätigter Gerätehärtungs- und Patchprozess.

## Sicherheitsbedeutung

Der lokale Port ist kein Login. Ein Browser-Tab, eine UI-Sperre oder ein Sichtschutz wären ebenfalls keine Authentifizierung. Die fachlichen Rollenverträge beschreiben Zielrechte, erzwingen sie aber aktuell nicht. Deshalb bleibt G1-06 `technical_blocked`.

## Mindestschritte vor produktiver Freigabe

1. Betriebsgerät und zulässiger Benutzerkontext festlegen.
2. Geräteverschlüsselung, Betriebssystem-Sperre, Patchstatus und Backupverschlüsselung datiert nachweisen.
3. Authentifizierungsverfahren mit Wiederherstellungs- und Sperrweg beschließen.
4. Rollen und Objekt-/Feldrechte technisch erzwingen.
5. positive und negative Autorisierungstests durchführen.
6. Sitzungsablauf, erneute Authentifizierung und Abmeldung testen.
7. Audit- und Incident-Verantwortung benennen.
8. erst danach G1-10 als engen PO-Beschluss vorlegen.

Amtliche Arbeitsgrundlage: [Art. 25 und 32 DSGVO bei EUR-Lex](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679) sowie die [BfDI-Information zur DSGVO](https://www.bfdi.bund.de/SharedDocs/Downloads/DE/Broschueren/INFO6.pdf?__blob=publicationFile&v=9).

