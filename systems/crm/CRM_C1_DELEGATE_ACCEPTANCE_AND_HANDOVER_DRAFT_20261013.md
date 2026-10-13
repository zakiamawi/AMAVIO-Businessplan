# C1 – Vertretungsannahme und Betriebsübergabe

**Datum:** 13.10.2026  
**Benannte Vertretung:** Van Vardanian  
**Status:** durch Product Owner benannt; persönliche Annahme und Erreichbarkeit nicht bestätigt

## Zweck

Dieses Protokoll dokumentiert eine spätere belastbare Vertretung für Störung, Wiederherstellung und kontrollierten C1-Stopp. Es erteilt ohne Bestätigung keine Berechtigung und enthält keine Zugangsdaten.

## Zu bestätigender Umfang

- C1 bleibt ausschließlich synthetisch und nicht öffentlich;
- CRM, App und ACC bleiben getrennt;
- die Vertretung darf keine realen CRM-Daten importieren und keinen Versand aktivieren;
- kostenwirksame, destruktive, Provider-, Rollen-, Secret- oder Recovery-Aktionen benötigen den dokumentierten Freigabeweg;
- Secrets und Recovery-Codes werden nicht in diesem Dokument, Chat, Ticket oder Repository gespeichert;
- bei Scope-Verstoß, ungeklärtem Zugriff, realen Daten, Secret-Offenlegung oder Budgetrisiko gilt sofortiger Stopp.

## Übergabegegenstände

| Gegenstand | Erwarteter Nachweis | Status |
|---|---|---|
| Rolle und Zuständigkeit | schriftliche Annahme | offen |
| Erreichbarkeitsweg | getrennt und zugriffsgeschützt dokumentiert, nicht im CRM-Repository | offen |
| Reaktionsfenster | vereinbarte Geschäfts-/Notfallzeiten | offen |
| Runbook | `CRM_G1_09_INCIDENT_CONTACT_AND_ESCALATION_RUNBOOK_20261013.md` gelesen | offen |
| Restore | Ablauf und Stopkriterien verstanden; kein produktiver Restore | offen |
| Vier-Augen-Aktionen | Liste und Freigabereihenfolge verstanden | offen |
| Abwesenheit/Ende | Rückgabe, Rollenentzug und Sitzungswiderruf geklärt | offen |
| Test | moderierter synthetischer Übergabetrockenlauf | offen |

## Keine Secret-Übergabe in diesem Schritt

Eine spätere technische Berechtigung wird erst nach C1-Beschluss, Security Review und Providerfreigabe minimal eingerichtet. Zugang, MFA, Recovery und Schlüsselrotation werden ausschließlich über die dafür vorgesehene sichere Provider-/Secret-Grenze abgewickelt. Dieses Dokument darf keine Telefonnummer, private E-Mail, Passwort-, Token-, TOTP- oder Recovery-Daten aufnehmen.

## Annahmeerklärung

> Ich bestätige, dass ich die beschriebene Vertretungsrolle, ihren ausschließlich synthetischen Umfang, die Stopkriterien, das Vier-Augen-Prinzip und die Trennung von CRM, App und ACC verstanden habe. Die Annahme ist keine Freigabe für reale Daten, Produktion, Versand, Connectoren oder öffentliche Erreichbarkeit.

- Name: Van Vardanian
- Rolle: `[auszufüllen]`
- Annahme: `[ja/nein]`
- Erreichbarkeitsnachweis getrennt hinterlegt bei: `[Ort/Owner, keine Kontaktdaten hier]`
- Übergabetrockenlauf am: `[Datum]`
- Offene Punkte: `[auszufüllen]`
- Bestätigung Van Vardanian: `[Datum/Signatur oder dokumentierter digitaler Nachweis]`
- Gegenbestätigung Zaki Amawi: `[Datum/Signatur oder dokumentierter digitaler Nachweis]`

Bis zur beidseitigen Bestätigung bleiben `acceptanceVerified=false` und `contactRouteVerified=false`.
