# AMAVIO One CRM – R3.13 C1 Decision Closure

**Datum:** 13.10.2026  
**Status:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben  
**Entscheidungsreferenz:** PO-CRM-045

## Ziel

R3.13 übernimmt die vom Product Owner konkret benannten C1-Arbeitsentscheidungen in den lokalen synthetischen Governance-Vertrag, setzt die ausdrücklich freigegebene Bildschirmsperre um, aktiviert die macOS-Firewall über die Systemeinstellungen und dokumentiert alle verbleibenden Mehrdeutigkeiten ohne Provider- oder Produktivaktivierung.

## Gesicherter Ausgangsstand

- Quelle: `20261013_AMAVIO_One_CRM_R3_12_G1_External_Technical_Readiness_Working`
- Sicherung: `20261013_AMAVIO_One_CRM_R3_12_Sicherung_Pre_R3_13_C1_Decision_Closure`
- Arbeitskopie: `20261013_AMAVIO_One_CRM_R3_13_C1_Decision_Closure_Working`
- Quelle, Sicherung und Arbeitskopie enthielten beim Kopieren jeweils 6.895 Dateien.
- Quelle und Sicherung waren im `diff -qr` identisch.

## Übernommene Beschlüsse

- Technischer Betreiber: Zaki Amawi.
- Vertretung: Van Vardanian; Annahme, Erreichbarkeit und Übergabe müssen noch nachgewiesen werden.
- Datenschutz-/Vertragsverantwortung intern: Zaki Amawi, Gründer; externe Fachprüfung bleibt erforderlich.
- Budgetkorridor: 50–100 EUR brutto pro Monat; 100 EUR werden als harte Planungsobergrenze geführt.
- C1 bleibt ausschließlich synthetisch.
- macOS-Bildschirmsperre nach fünf Minuten mit sofortiger Passwortanforderung.
- macOS-Firewall-Konfiguration wurde freigegeben und über die Systemeinstellungen aktiviert.

## Nicht eindeutig beschlossen

- Security Reviewer: leer; keine Person und keine befristete Einpersonen-Ausnahme benannt.
- Provider/Region: „freigegeben/nicht freigegeben“ enthält keine eindeutige Auswahl; Supabase und Frankfurt `eu-central-1` bleiben Vorschlag, nicht Freigabe.
- Kauf: Der Budgetrahmen ist keine Kauf- oder Providerbeauftragung.

## Technische Wahrheitsgrenze

Die Firewall wird in den Systemeinstellungen nach erneutem Öffnen als aktiv angezeigt. Das Legacy-CLI `socketfilterfw --getglobalstate` meldet weiterhin `State = 0`. Bis dieser Widerspruch mit einem belastbaren zweiten technischen Nachweis geklärt ist, bleibt die Firewall-Kontrolle als `verification_conflict` offen. FileVault wird in den Systemeinstellungen als eingeschaltet angezeigt; es wurden keine Schlüssel oder Authentifizierungsdaten gelesen.

## Nicht umgesetzt

Kein Supabase-Login, kein Projekt, kein Kauf, keine Authentifizierung, keine MFA, keine RLS, keine realen Daten, kein Import, kein Versand, kein Deployment, keine App-/ACC-Verbindung und keine externe Übertragung. C1-Implementierung bleibt nicht autorisiert.
