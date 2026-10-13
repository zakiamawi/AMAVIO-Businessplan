# AMAVIO One CRM – C1 Umgebungs-, Secret- und Exit-Strategie

**Stand:** 10.10.2026  
**Status:** verbindlicher C1-Planungsvertrag; keine Umgebung angelegt

## Umgebungsmodell

| Umgebung | Zweck | Daten | Netzwerk/Erreichbarkeit | Status |
|---|---|---|---|---|
| R3.2 lokal | geschützter, geprüfter Produktprototyp und Rückfallstand | lokale synthetische Seeds und lokale Eingaben | nur localhost | bleibt unverändert |
| C1 lokal | AMAVIO Web/API, Migrationen und automatisierte Tests | ausschließlich synthetisch | nur localhost | erst nach C1-Beschluss anzulegen/anzupassen |
| C1 Managed Staging | genau ein Supabase-Projekt: PostgreSQL + Auth | synthetische CRM-Daten; notwendige Provider-Verwaltungsdaten getrennt | Providerplattform; kein öffentlicher AMAVIO-Web/API-Endpunkt | nicht angelegt |
| Produktion | reale Nutzung | nicht festgelegt | nicht festgelegt | vollständig gesperrt |

Der Begriff „Staging“ bezeichnet in C1 nur den verwalteten Datenbank-/Auth-Unterbau. AMAVIO Web und API bleiben lokal. Ein öffentliches Staging, Hosting, DNS oder Deployment ist nicht Teil von C1.

## Projekt- und Regionsvertrag

- exakt ein Projekt;
- Projektnamen enthalten keine Kunden-, Teilnehmer- oder realen Kontaktnamen;
- Region muss bei Anlage ausdrücklich `eu-central-1` Frankfurt sein und unabhängig kontrolliert werden;
- keine Verknüpfung mit ACC-, App-, Website- oder anderen AMAVIO-Projekten;
- keine gemeinsame Datenbank, Organisation, Auth-Tenant oder Secrets mit ACC/App;
- Storage, Realtime, Edge Functions, Webhooks, Social Provider und anonyme Anmeldung bleiben deaktiviert;
- Management API, MCP oder CI-Provisionierung werden in C1 nicht verwendet; initiale Einrichtung erfolgt nachvollziehbar und manuell nach Freigabe.

## Secret-Klassen

| Klasse | Beispiel | Zulässiger Ort | Unzulässig |
|---|---|---|---|
| S1 öffentlich | Projekt-URL, sofern technisch öffentlich | lokale nichtgeheime Konfiguration | keine fachliche Autorisierung daraus ableiten |
| S2 client-begrenzt | anon/publishable key | nur wenn RLS vollständig aktiv; lokale Laufzeitkonfiguration | keine privilegierten Rechte; nicht als Geheimnisersatz behandeln |
| S3 privilegiert | service-role/secret key, DB-Verbindung, Admin-Token | lokaler Secret Store/Laufzeitvariable des Servers; geringste Zugriffsgruppe | Browser, Repository, Buildartifact, Screenshot, Chat, Dokumentation, Log |
| S4 persönliche Faktoren | Passwort, Recoverycode, TOTP-Seed | persönlicher Passwort-/MFA-Speicher | Ticket, gemeinsame Datei, CRM, Quellcode |

## Secret-Verfahren

- Vor erstem C1-Zugriff: benannter Besitzer, Verwendungszweck, Erstellungsdatum und Rotationsereignis erfassen, niemals den Wert selbst.
- Secrets werden nicht in `.env`-Beispielen mit echten Werten, Browserbundle, Local Storage oder Testfixtures gespeichert.
- Log- und Fehlermeldungsredaktion wird vor API-Zugriff getestet.
- Rotation nach Verdacht, Personal-/Rollenwechsel, versehentlicher Offenlegung und spätestens beim C1-Ende.
- Privilegierte Schlüssel sind je Umgebung getrennt und werden nie zu ACC/App übertragen.
- Ein Secret-Scan ist Pflicht vor jeder C1-Abnahme.

## Migrations- und Konfigurationsvertrag

- jede Schemaänderung erhält eine geordnete, versionierte Migration;
- eine neue Datenbank muss vollständig aus Migrationen und synthetischem Seed reproduzierbar sein;
- RLS, Rollen, Constraints, Indizes und Auditdefinitionen sind Teil der Migration beziehungsweise versionierten Konfiguration;
- Dashboard-Änderungen werden nur genutzt, wenn sie als Konfigurationsschritt dokumentiert und reproduzierbar sind;
- Migrationen werden erst lokal/isoliert getestet, dann in C1 angewendet;
- kein `db push`, Projektlink oder Remote-Command ohne gesonderten C1-Beschluss und überprüften Zielkontext;
- keine automatische GitHub-/CI-Verbindung in C1.

## Exit- und Portabilitätsstrategie

### Portierbare Bestandteile

- standardnahes PostgreSQL-Schema;
- SQL-Migrationen und Constraints;
- synthetische Seed-Daten;
- Rollen-/RLS-Vertrag in menschenlesbarer und testbarer Form;
- Auth-Zuordnung über interne kanonische User-ID statt Provider-ID als Fachschlüssel;
- Export von Auditmetadaten ohne Geheimnisse.

### Exit-Ablauf

1. Änderungen einfrieren und verantwortliche Personen bestätigen.
2. Schema-/Migrationstand und aktivierte Dienste inventarisieren.
3. logischen PostgreSQL-Export erzeugen und Wiederimport in leerer Testdatenbank prüfen.
4. Auth-Identitäten nur als minimierte Mappingliste exportieren; Passwörter/TOTP-Seeds werden nicht portiert.
5. Secrets widerrufen und lokale Konfiguration entfernen.
6. Providerprojekt nach Product-Owner-Freigabe löschen oder begründet fortführen.
7. Provider-Lösch-/Retentionbedingungen und Frist dokumentieren.
8. Abschlussprüfung auf verbliebene Projekte, Nutzer, Schlüssel, Add-ons und Kosten.

## Exit-Abnahmekriterien

- Schema und synthetischer Seed laufen ohne Supabase-spezifischen Fachzwang in PostgreSQL;
- fachliche IDs referenzieren keine unverzichtbare Provider-ID;
- kein aktives Secret und keine laufende Rechnung bleiben unbemerkt zurück;
- Lösch-/Retentionnachweis und bekannte Providerfristen sind dokumentiert;
- der lokale R3.2-Prototyp ist unabhängig weiterhin startbar;
- keine ACC-/App-Artefakte sind betroffen.

## Nicht entschieden

- Hostingprovider für einen späteren AMAVIO-API-Dienst;
- Produktionsumgebung, Domain oder DNS;
- CI/CD, GitHub-Anbindung oder automatisches Deployment;
- reale Datenmigration und produktive Auth-Identitäten;
- Hochverfügbarkeit, produktives SLA oder mandantenfähige Architektur.

