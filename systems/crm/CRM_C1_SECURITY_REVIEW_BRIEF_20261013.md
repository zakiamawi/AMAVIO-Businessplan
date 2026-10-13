# C1 – unabhängiges Security-Review-Briefing

**Datum:** 13.10.2026  
**Status:** prüfbereit; Reviewer nicht benannt; keine Sicherheitsfreigabe  
**Scope:** ausschließlich ein später gesondert freigegebenes synthetisches C1-Staging

## Auftrag

Die prüfende Person soll nicht bestätigen, dass Supabase allgemein „sicher“ ist. Zu prüfen ist, ob die konkrete enge AMAVIO-C1-Architektur die definierten Grenzen technisch erzwingt und negative Zugriffsversuche zuverlässig abweist. Die prüfende Person darf keine Secrets verlangen oder in den Prüfbericht übernehmen.

## Unabhängigkeit

- Name/Organisation: `[auszufüllen]`
- Rolle und Qualifikation: `[auszufüllen]`
- Beziehung zur Implementierung: `[auszufüllen]`
- Interessenkonflikt: `[kein / beschrieben]`
- Prüfdatum und Versionsstand: `[auszufüllen]`

Der kritische Abnahmeschritt darf nicht allein durch dieselbe Person erfolgen, die die kontrollierte C1-Implementierung vorgenommen hat. Falls der Product Owner ausnahmsweise eine Einpersonenregel beschließt, muss sie schriftlich befristet sein, ein Ablaufdatum, Synthetic-only, zusätzliche Negativtests, vollständige Logs ohne Secrets und eine spätere unabhängige Nachprüfung enthalten.

## Prüfbasis

- `CRM_C1_SECURITY_AND_THREAT_MODEL_DRAFT_20261010.md`
- `CRM_C1_API_AUTHORIZATION_AND_RLS_CONTRACT_20261010.md`
- `CRM_C1_OPERATING_MODEL_AND_RESPONSIBILITY_MATRIX_20261010.md`
- `CRM_C1_ENVIRONMENT_SECRET_AND_EXIT_STRATEGY_20261010.md`
- `CRM_C1_BACKUP_RESTORE_RPO_RTO_DRAFT_20261010.md`
- `CRM_C1_GATE_CLOSURE_REGISTER_20261013.md`

## Mindestprüfungen

| Bereich | Positivnachweis | zwingender Negativnachweis |
|---|---|---|
| Identität | nur administrativ angelegte Testidentität, TOTP, AAL2 | Selbstregistrierung, AAL1 und deaktivierte Identität erhalten keinen Fachzugriff |
| Autorisierung | erlaubte Rolle kann nur definierte Aktion ausführen | fremdes Objekt, Adminfunktion und Rollenwechsel werden serverseitig abgewiesen |
| RLS | explizite Policies je Fachtabelle | `anon`, direkter Browserzugriff und nicht berechtigte Rolle erhalten keine Daten |
| Secrets | nur serverseitige, lokale Laufzeitgrenze | kein Service-Key, Passwort oder TOTP-Seed in Browserbundle, Repository, Log oder Screenshot |
| Sitzung | Inaktivitäts-/Absolutgrenze und Widerruf | abgelaufene, widerrufene oder herabgestufte Sitzung bleibt wirkungslos |
| Eingaben | Schema-, Fach- und Übergangsvalidierung | Injection-, Manipulations-, unbekannte Feld- und ID-Versuche scheitern kontrolliert |
| Netzwerk | nur ausdrücklich notwendige Verbindungen | kein öffentlicher AMAVIO-Endpunkt, keine Drittanbieter-Callbacks oder unerwarteten Browserziele |
| Providerfläche | genau ein Projekt, konkrete Region, MFA und minimierte Rollen | Storage, Realtime, Edge, Webhooks, Social Login und externe Connectoren bleiben ungenutzt |
| Backup/Restore | synthetischer Export und isolierter Restore | Restore verändert keinen nicht freigegebenen Zustand und hebt keine Sperre auf |
| Audit | minimale Ereignismetadaten und nachvollziehbare Korrelation | keine Inhalte, personenbezogenen Testdetails oder Secrets im Audit |

## Severity und Stop-Regel

- **Kritisch:** Identitäts-/RLS-Bypass, Secret im Client/Log, öffentliche Erreichbarkeit, reale CRM-Daten oder Region nicht eindeutig. Sofortiges NO-GO.
- **Hoch:** fehlende MFA-Durchsetzung, unklare Admin-/Recovery-Rechte, ungetesteter Restore oder unkontrollierte Zusatzdienste. NO-GO bis geschlossen.
- **Mittel:** begrenzte Härtungs- oder Nachweislücke ohne unmittelbaren Bypass. Nur mit datierter Korrektur und Retest.
- **Niedrig:** dokumentarische oder UX-bezogene Abweichung ohne Schutzwirkung. In Restpunkteliste aufnehmen.

## Abgabeformat

Der Reviewbericht muss Version, Scope, Testumgebung, getestete Fälle, Ergebnis je Kontrolle, reproduzierbare Evidenz ohne Secrets, Findings mit Severity, Restrestrisiken sowie ein eindeutiges `GO`, `GO MIT AUFLAGEN` oder `NO-GO` enthalten. `GO MIT AUFLAGEN` darf weder reale Daten noch Produktion, Versand, App/ACC oder öffentliche Erreichbarkeit erlauben.

## Reviewerentscheidung

- Ergebnis: `[GO / GO MIT AUFLAGEN / NO-GO]`
- Kritische/hohe Findings offen: `[ja/nein + Referenzen]`
- Restrestrisiko akzeptabel ausschließlich für Synthetic-only-C1: `[ja/nein]`
- Name, Rolle, Datum, Bestätigung: `[auszufüllen]`

Ohne ausgefüllte Reviewerentscheidung bleibt `securityReviewer.assigned=false` und C1 gesperrt.
