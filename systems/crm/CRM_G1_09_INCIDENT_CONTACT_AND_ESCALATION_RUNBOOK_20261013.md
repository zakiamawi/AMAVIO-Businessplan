# G1-09 – Incident-Kontakt- und Eskalationsentwurf

**Status:** lokaler Runbook-Entwurf; keine rechtliche Frist- oder Meldefreigabe

## Rollen

- Primärkoordination: Zaki Amawi, Product Owner / CRM-Administration.
- Technische Ausführung in C1: `[zu bestätigen]`.
- Datenschutz-/Rechtsprüfung: `[externe Stelle und Erreichbarkeit zu bestätigen]`.
- Vertretung: `[Name, Rolle und Erreichbarkeit fehlen]`.

Eine nicht besetzte Rolle darf nicht stillschweigend von der Anwendung angenommen werden.

## Erste 15 Minuten

1. betroffene CRM-Arbeit stoppen;
2. keine Daten löschen, keine Spuren verändern und keine Kommunikation versenden;
3. lokalen Zugriff und betroffenen Datenpfad isolieren, soweit ohne Beweisverlust möglich;
4. Zeitpunkt, Beobachtung, betroffene Arbeitskopie und eigene Maßnahmen protokollieren;
5. Product Owner verständigen.

## Erste 60 Minuten

1. Umfang und Datenkategorien vorläufig bewerten;
2. reale versus ausschließlich synthetische Daten unterscheiden;
3. Integrität der letzten Sicherung prüfen, ohne den Ausgangszustand zu überschreiben;
4. externe Systeme nur nach bestehender Zuständigkeit und Freigabe einbeziehen;
5. Datenschutz-/Rechtsprüfung auslösen, wenn reale personenbezogene Daten betroffen sein könnten.

## Erste vier Stunden

1. Entscheidung über kontrollierte Wiederherstellung vorbereiten;
2. Ursache, Eindämmung, betroffene Personen/Organisationen und mögliche Folgen dokumentieren;
3. rechtlich zuständige Stelle entscheidet über Melde- und Benachrichtigungspflichten und deren Fristen;
4. Wiederanlauf nur nach dokumentiertem Product-Owner-Beschluss und erfolgreicher Negativ-/Integritätsprüfung;
5. Nachbereitung, Korrekturmaßnahme, Verantwortlicher und Fälligkeit erfassen.

## Unveränderliche Grenzen

Das CRM versendet keine automatische Incident-Meldung. Es berechnet keine Rechtsfrist und trifft keine rechtliche Meldeentscheidung. Es darf keinen Providerzugang, keine Sicherung und keine produktive Umgebung eigenmächtig verändern.

## Abschlussnachweis

Incident-ID, Zeitlinie, Datenklassen, Ursache, Eindämmung, Sicherungsreferenz, Freigabeperson, rechtliche Bewertung, Wiederanlaufzeit, offene Maßnahmen und Abschlussdatum sind Pflicht. Ein synthetischer Trockenlauf darf nicht als produktiver Incident-Nachweis bezeichnet werden.
