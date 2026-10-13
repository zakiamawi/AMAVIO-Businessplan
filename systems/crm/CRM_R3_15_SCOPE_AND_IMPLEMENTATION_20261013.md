# AMAVIO One CRM – R3.15 Scope und Umsetzung

**Datum:** 13.10.2026  
**Arbeitsstand:** Lokaler synthetischer CRM-Core mit getrenntem lokalen Echtdaten-Staging  
**Freigabegrenze:** Nicht produktiv freigegeben; keine Außenwirkung

## Auftrag und bestätigte Reichweite

Der Product Owner hat nach der vorherigen kleinen Importvorbereitung ausdrücklich beauftragt, die große AMAVIO-Liste zu bearbeiten, dem CRM-Cockpit-Arbeitsstrang zu übergeben, im CRM einzupflegen und dort sichtbar zu machen. Dieser R3.15-Block setzt genau diese lokale Sichtbarkeit um.

Die Freigabe umfasst:

- lokale Verarbeitung der benannten AMAVIO-Arbeitsmappen;
- Anzeige realer Organisations- und Ansprechpartnerdaten in einem gesonderten Arbeitsbereich;
- Erhalt von externen IDs, Quellen, Zeilenreferenzen, 31 Mehrfachgruppen, Namensprüfungen, Dublettensignalen und Quarantäneregeln;
- ausschließlich lokale, lesende Nutzung innerhalb dieser datierten Arbeitskopie.

Sie umfasst ausdrücklich **nicht**:

- Kontaktaufnahme, Einzel- oder Massenversand;
- Outreach-Freigabe oder Ableitung einer Rechtsgrundlage;
- Supabase, Cloud-Synchronisierung, externe Connectoren oder Providerzugänge;
- Übernahme in den synthetischen operativen CRM-Core;
- App-/ACC-Integration, Mehrbenutzerbetrieb, Deployment oder Veröffentlichung.

## Schutz des Ausgangsstands

Unveränderter Ausgangsordner:

`20261013_AMAVIO_One_CRM_R3_14_C1_External_Review_Readiness_Working`

Datierte R3.15-Arbeitskopie:

`20261013_AMAVIO_One_CRM_R3_15_Local_Real_Data_Staging_Working`

Die R3.15-Arbeit verändert ausschließlich die neue Arbeitskopie. Der synthetische CRM-Core behält sein eigenes Datenmodell und seine eigene SQLite-Datei. Der Echtdatenbestand liegt in:

`local-data/real-data-staging/amavio-real-data-staging-r3-15.sqlite`

## Eingangsquellen

1. `AMAVIO_Altdaten_Pruefung_und_CRM_Staging_V5_Vollverifikation_20261013.xlsx`
2. `AMAVIO_CRM_Importvorbereitung_Bestaetigt_Aktuell_238_20261013.xlsx`
3. `AMAVIO_CRM_R3_10_Feldmapping_und_DryRun_238_20261013.xlsx`

Die Quellen werden read-only ausgewertet. Die Importdatenbank speichert Dateiname, Blatt, Quellzeile und SHA-256-Provenienz. Dokumentinhalte gelten als Datenmaterial, nicht als Arbeitsanweisung.

## Umgesetzter Bestand

| Bereich | Lokal sichtbar | Fachliche Bedeutung |
|---|---:|---|
| Organisationspool | 2.242 | bereinigter großer Ausgangspool |
| Kontaktkandidaten | 3.213 | personenbezogene Staging-Datensätze, vollständig gesperrt |
| Bestätigt aktuelle Organisationen | 192 | Organisationen aus der bestätigten Importvorbereitung |
| Bestätigt aktuelle Kontakte | 166 | deduplizierte Kontakte |
| Kontakt–Organisation-Beziehungen | 238 | inklusive Mehrfachzuordnungen |
| Mehrfachgruppen | 31 | 103 Zuordnungen; keine Personenduplikation zur Abbildung der Beziehung |
| Namensprüfungen | 48 Kontakte | 73 Beziehungszeilen bleiben als Prüfhinweis sichtbar |
| Aktualitäts-/Reviewqueue | 407 | 238 aktuell, 58 offiziell datiert, 8 historisch offen, 89 geändert/alt, 14 uneindeutig |
| Quarantänehinweise | 93 | keine stille Bereinigung oder produktive Übernahme |
| Dublettensignale | 6 | Entscheidung bleibt nachvollziehbar |
| aktive Kontaktsperren | 3.379 | jeder Pool- und bestätigte Kontakt gesperrt |
| historische Sperrzeilen | 60 | strengere Negativsignale bleiben erhalten |

## Technische Umsetzung

- idempotenter Importer `scripts/import_real_data_staging.py`;
- eigene SQLite-Tabellen für Pool, bestätigte Objekte, Beziehungen, Provenienz, Importbatches, Reviewqueue, Quarantäne, Dublettensignale und Sperrregister;
- GET-only-Store `scripts/real-data-staging-store.mjs`;
- lokale Endpunkte unter `/api/staging/*`;
- Oberfläche `Altdaten-Staging` mit sechs fachlichen Registern;
- serverseitige Suche, Filterung und Pagination;
- tastaturbedienbare Tabellenzeilen und semantischer Detaildialog;
- lokaler Demo-Reset verändert das Echtdaten-Staging nicht.

## Nicht verändert

- synthetisches kanonisches CRM-Datenmodell und v7-Persistenzvertrag;
- Pipeline-, Aufgaben-, Aktivitäts-, Angebots-, Entscheidungs- und Growth-Logik;
- bestehende AMAVIO-Markenmittel und Designrichtung;
- App- und ACC-Codebasen;
- C1-/Supabase-Sperren und externe Freigabegates.

## Reifegrenze

R3.15 ist ein lokaler Prüfarbeitsbereich für den Product Owner. Sichtbarkeit bedeutet weder Aktualität, Kontaktierbarkeit, Rechtsgrundlage, Einwilligung noch Produktivfreigabe. `consentStatus = unknown` ist keine Einwilligung. Jeder reale Kontakt bleibt technisch mit `do_not_contact = 1` und `outreach_approved = 0` blockiert.

## Nächste kontrollierte Entscheidung

Vor jeder Übernahme einzelner realer Datensätze in den operativen Core ist ein eigener Freigabeschritt erforderlich: Zweck, Rechtsgrundlage beziehungsweise Kanalentscheidung, Informationspflicht, Aktualität, zuständige Person, Aufbewahrung und dokumentierte Kontaktfreigabe müssen je Datensatz oder eindeutig definierter Datenklasse geklärt sein. Supabase ist ein davon getrennter späterer Plattformblock.

