# G1 Import, Mapping, Dubletten und Quarantäne – Vertrag

**Status:** lokal-synthetisch getestet; produktiver Import und reale Quellen bleiben gesperrt

## Kontrollfolge

1. Quelle und Freigabereferenz bestimmen.
2. Datei nur in einem isolierten Prüfbereich lesen.
3. Schema, Größe, Datentypen und synthetische Kennzeichnung validieren.
4. Felder ausdrücklich auf kanonische Objekte abbilden; unbekannte Felder nicht still übernehmen.
5. Dubletten anhand Organisation, Domain, Name, geschäftlicher E-Mail und Organisationsbezug als Hinweise ausweisen.
6. Konflikte, unzulässige Datenklassen, fehlende Quelle und unbekanntes Schema in Quarantäne halten.
7. Vor Übernahme versionierten Rollback-Snapshot erzeugen.
8. Importmenge, Ablehnungen, Zusammenführungen, Verantwortlichen und Zeitpunkt protokollieren.
9. Stichprobe und Suchtest durchführen; erst danach den Vorgang schließen.

## Harte technische Grenze

Die aktuelle API akzeptiert ausschließlich Zustände, die den synthetischen v6-Vertrag erfüllen. Nicht-synthetische Zustände und unbekannte Schemata werden abgewiesen. Der lokale Trockenlauf prüft Vorschau, Quarantäneentscheidung und Rollback-Vertrag; er verarbeitet keine reale Importdatei und genehmigt keine Quelle.

## Nicht erlaubt

Kein stilles Überschreiben, kein automatisches Zusammenführen, kein Entfernen von Kontaktsperren, keine Annahme fehlender Rechtsgrundlagen, kein produktiver CSV-/Providerimport und keine Übertragung an App oder ACC.

