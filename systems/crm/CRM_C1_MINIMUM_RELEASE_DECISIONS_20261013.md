# C1 – Minimale Freigabeentscheidungen

> **PO-CRM-045-Fortschreibung:** Technischer Betreiber, benannte Vertretung, internes Datenschutz-/Vertrags-Ownership, Budgetkorridor und Synthetic-only sind protokolliert. Security Review, Vertreterannahme, externe Fachprüfung sowie eindeutige Provider-/Regionsfreigabe bleiben offen. Maßgeblich ist `CRM_C1_PRODUCT_OWNER_DECISION_RECORD_20261013.md`.

**Status:** Rollen- und Reviewpakete vorbereitet; C1 bleibt bis zur vollständigen Beantwortung gesperrt

## 1. Verantwortlichkeit

- Technischer Betreiber: Zaki Amawi, bestätigt
- Product Owner: Zaki Amawi
- Vertretung für Störung/Wiederherstellung: Van Vardanian, benannt; Annahme/Erreichbarkeit/Übergabe offen
- unabhängige Sicherheitsprüfung: `[Person/Stelle]` oder ausdrücklich befristete Einpersonen-Ausnahme mit Ablaufdatum und Kompensationsmaßnahmen

## 2. Anbieter- und Vertragsfreigabe

- Provider: Supabase oder alternative Entscheidung
- konkrete Region: Frankfurt `eu-central-1` bestätigen/ablehnen
- DPA/AVV, Subprozessoren, Transfer, Speicher-/Löschbedingungen und Supportzugriff geprüft durch: `[Stelle/Datum]`
- zunächst ausschließlich synthetische Daten: ja/nein

## 3. Budget

- Planungskorridor: 50–100 EUR brutto/Monat; harte Obergrenze 100 EUR
- Kaufberechtigte Person:
- Alarmgrenze:
- automatische Kostensteigerung erlaubt: nein
- PITR oder sonstige Zusatzleistung erlaubt: nein, sofern nicht separat beschlossen
- Stop-/Kündigungsregel:

## 4. Enge technische Grenze

Zur Freigabe empfohlen:

- genau ein Projekt und eine festgelegte Region;
- nur Postgres und Auth;
- nur synthetische Testdaten;
- Einladungs-/Admin-Testidentitäten;
- TOTP-MFA mit AAL2-Durchsetzung;
- serverseitige Autorisierung und RLS mit Positiv- und Negativtests;
- kein anonymer oder öffentlicher Datenzugriff;
- keine Storage-, Realtime-, Edge-, Webhook-, Social-Login- oder Connector-Funktion;
- keine App-/ACC-Verbindung;
- keine echten Kontakte und kein produktiver Versand.

## 5. Abnahme und Rückfall

- Abnahmeperson außerhalb der Implementierung oder begründete Ausnahme:
- Testprotokoll und Mindesttests:
- Export-/Restore- und Rückfallverfahren:
- maximale Testdauer:
- Löschung/Stilllegung bei nicht bestandener Abnahme:

## Beschlussformel

`C1 wird ausschließlich im oben festgelegten synthetischen Minimalumfang freigegeben. Die Freigabe umfasst weder Echtdaten noch produktive Kommunikation, App/ACC, Mehrbenutzerbetrieb oder Deployment. Jede Erweiterung benötigt einen neuen Beschluss.`

Die ausstehenden Entscheidungen und Nachweise sind in `CRM_C1_GATE_CLOSURE_REGISTER_20261013.md` konsolidiert. Ohne Security Review, Vertreterannahme, externe Vertrags-/Datenschutzprüfung, eindeutige Provider-/Regionsauswahl und Abnahme bleibt C1 gesperrt. Das Anlegen eines Providerprojekts ist eine externe Änderung und erfordert zusätzlich die unmittelbare Nutzerfreigabe zum Zeitpunkt der Ausführung.
