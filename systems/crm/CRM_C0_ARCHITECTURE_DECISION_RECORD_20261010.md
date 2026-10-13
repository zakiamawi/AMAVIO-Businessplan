# ADR C0-001 – Kontrollierte Plattformgrundlage für AMAVIO One CRM

**Status:** fachlich beschlossen für die C1-Planung; Umsetzung nicht freigegeben  
**Datum:** 10.10.2026  
**Entscheidende Stelle:** Product Owner im Rahmen des Beschlusses „R3.2 umsetzen; parallel nur C0 fachlich entscheiden; C1 erst danach kontrolliert freigeben“

## Kontext

Der lokale R3.2-Core bildet AMAVIO-spezifische CRM-Abläufe ausschließlich synthetisch ab. Für einen späteren C1-Block werden eine dauerhafte Datenhaltung, Identitäten und technische Berechtigungen benötigt. Diese Fähigkeiten sind aktuell nicht vorhanden und dürfen durch C0 nicht aktiviert werden.

## Entscheidung

Für die C1-Planung wird folgende Zielarchitektur beschlossen:

```text
AMAVIO CRM Weboberfläche
          |
          | HTTPS, authentifizierte Sitzung
          v
AMAVIO CRM Server/API
  - Geschäftsregeln und Validierung
  - Rollen- und Objektberechtigung
  - Audit-Ereignisse
  - Rate-/Fehlergrenzen
          |
          | minimierte, parametrisierte Datenzugriffe
          v
Supabase Managed PostgreSQL + Auth
  - spezifische Region eu-central-1 Frankfurt
  - restriktive RLS als zweite Schutzschicht
  - TOTP-MFA, nur Einladungen
  - tägliche Backups im synthetischen C1-Staging
```

### Verbindliche Architekturentscheidungen

| ID | Entscheidung |
|---|---|
| C0-ADR-01 | Primärer Datenspeicher bleibt standardnahes PostgreSQL; Anbieterfunktionen dürfen das kanonische Modell nicht unportierbar machen. |
| C0-ADR-02 | Supabase Managed Platform in der spezifischen Region `eu-central-1` ist die bevorzugte C1-Plattform. Es wird in C0 kein Projekt angelegt. |
| C0-ADR-03 | Die Weboberfläche erhält keinen privilegierten Service-Schlüssel und keinen ungeprüften direkten Schreibpfad in kanonische Tabellen. |
| C0-ADR-04 | Jede Mutation läuft durch eine AMAVIO-eigene serverseitige Geschäftslogik. RLS ist zusätzliche `deny by default`-Absicherung. |
| C0-ADR-05 | Nutzer werden nur intern eingeladen. Selbstregistrierung, Social Login, Partnerlogin und anonyme Sitzungen bleiben deaktiviert. |
| C0-ADR-06 | TOTP-MFA ist für alle Nutzer des späteren C1-Stagings verpflichtend. Recovery und Admin-Wechsel benötigen einen dokumentierten Vier-Augen-Prozess. |
| C0-ADR-07 | Zunächst existiert genau ein interner AMAVIO-Arbeitsbereich; `tenantCapable` bleibt fachlich und technisch `false`. |
| C0-ADR-08 | Rollenvertrag: CRM-Administration, Vertriebsverantwortung, Vertriebsbearbeitung, operative Lesesicht, Datenschutzprüfung. Frontend-Sichtbarkeit allein gilt nie als Berechtigung. |
| C0-ADR-09 | Umgebungen: lokaler Prototyp; später getrenntes synthetisches C1-Staging; Produktion erst nach eigenem Gate. Identitäten, Schlüssel und Daten werden nicht zwischen Umgebungen kopiert. |
| C0-ADR-10 | Audit protokolliert Akteur, Objekt, Aktion, Zeitpunkt und notwendige Statusänderung; keine pauschalen Inhaltskopien oder Secrets. |
| C0-ADR-11 | E-Mail, Kalender, Storage, Realtime, Webhooks, Import, ACC, App und KI bleiben technisch deaktiviert. |
| C0-ADR-12 | CRM, ACC und App teilen weder Datenbank noch Auth-Tenant noch Service-Schlüssel. Spätere Verträge verwenden minimale Referenzen und versionierte APIs. |

## Datenklassen für C1

| Klasse | Beispiele | C1-Staging |
|---|---|---|
| K0 öffentlich | keine CRM-Arbeitsdaten | nicht relevant |
| K1 intern synthetisch | synthetische Organisationen, `.invalid`-Kontakte, Chancen, Aufgaben, Arbeitsjournal | **zulässig nach C1-Freigabe** |
| K2 reale Geschäfts- und Kontaktdaten | reale Organisationen, Namen, Kommunikationsdaten, Gesprächsnotizen | **gesperrt** |
| K3 besonders sensible oder risikoreiche Inhalte | Gesundheitsbezug, Ausweisdaten, Vertrags-/Abrechnungsunterlagen, Bewerbungs-/Research-Daten | **nicht Teil des CRM-Cores; gesperrt** |
| K4 Geheimnisse | Passwörter, API-Schlüssel, Service-Role-Key, Recovery-Geheimnisse | ausschließlich späterer Secret Store; nie CRM-Fachobjekt |

## Folgen

### Positiv

- kleinerer C1-Aufbau als eine vollständig selbst betriebene Plattform;
- standardnahes relationales Modell und klarer Migrationspfad;
- integrierte Auth-/MFA-Fähigkeit bei dennoch eigener Geschäftslogik;
- klare Trennung zwischen lokaler R3.2-Produktarbeit und späterem Plattformblock.

### Negativ / bewusst akzeptiert

- zusätzlicher API-Dienst erhöht gegenüber direktem Supabase-Clientzugriff den Implementierungsaufwand, ist aber für konsistente Statusverträge und Berechtigungen erforderlich;
- Anbieter- und Transferprüfung bleibt trotz Frankfurter Region nötig;
- Backup, Restore, Monitoring, Kosten und Incident-Verantwortung müssen aktiv konfiguriert und getestet werden;
- Supabase-spezifische Auth-Identitäten benötigen eine Exit-Strategie.

## Verwarfene Ansätze

- **Direkter Browserzugriff auf alle Tabellen:** verworfen, weil kanonische Statusübergänge und rollenbezogene Mutationen nicht allein der Oberfläche überlassen werden dürfen.
- **AWS-Komplettstack als Erstwahl:** technisch geeignet, für den aktuellen kleinen internen Scope jedoch zu komplex und betriebsintensiv.
- **Selbsthosting auf Hetzner als Erstwahl:** günstige Infrastruktur reicht ohne nachgewiesene 24/7-Betriebs-, Patch-, Backup- und Security-Verantwortung nicht aus.
- **gemeinsame Plattform mit ACC/App:** verworfen, weil Produkt-, Daten- und Releasegrenzen ausdrücklich getrennt bleiben.

## Aktivierungskriterium

Dieser ADR erlaubt keine C1-Umsetzung. C1 darf erst beginnen, wenn der Product Owner nach Vorlage von AVV/DPA-, TOM-, Kosten-, Verantwortungs-, Bedrohungsmodell- und Restore-Evidenz ausdrücklich freigibt:

> „Ich gebe ausschließlich C1 als getrenntes synthetisches Staging auf Grundlage des C0-ADR frei. Reale Daten und C2 bis C7 bleiben gesperrt.“

**Fortschreibung 10.10.2026:** Das Entry-Gate-Paket präzisiert C1 auf ein Managed-PostgreSQL/Auth-Staging bei weiterhin lokaler AMAVIO-Web/API-Ausführung. Threat Model, API-/RLS-Testvertrag, RPO/RTO und Exit sind spezifiziert. Datenschutz-/Vertragsannahme, namentliche Betriebs-/Prüfverantwortung, Budget und der enge C1-Beschluss bleiben offen. Maßgeblich ist `CRM_C1_RELEASE_DECISION_DRAFT_20261010.md`; der ältere Kurzsatz allein genügt nicht mehr als Freigabe.
