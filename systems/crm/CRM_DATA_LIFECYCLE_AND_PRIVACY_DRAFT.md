# AMAVIO One CRM – Datenlebenszyklus und Privacy

## R3.12-Ergänzung – G1-03 und lokale Ablage

Das offizielle Quellen- und Review-Dossier, der Art.-13/14-Inhaltsentwurf, die LIA-/Kanalentscheidungsvorlage und der VVT-Entwurf konkretisieren die externe Prüfung. Sie erteilen keine Rechtsgrundlage und keine Kontaktfreigabe. Die lokale Datei-Härtung verbessert die Vertraulichkeitsgrenze des synthetischen Prototyps, ersetzt jedoch weder bestätigte Geräteverschlüsselung noch verschlüsselte Sicherung, Auftragsverarbeitungsvertrag oder produktive Lösch-/Betroffenenprozesse.

**Version:** Fachvertrag 1.0 · Product-Owner-Beschluss vom 09.10.2026  
**Status:** fachlicher Lifecycle-Grundsatz beschlossen; keine Rechts- oder Datenschutzfreigabe

> **C0-Fortschreibung 10.10.2026:** Für eine spätere C1-Planung wurden Datenklassen K0 bis K4 festgelegt. C1 dürfte nur ein getrenntes synthetisches Staging mit K1-Daten enthalten. Reale Kontakt-/Geschäftsdaten (K2), besonders sensible Inhalte (K3) und Secrets als Fachobjekte (K4) bleiben gesperrt. Siehe `CRM_C0_ARCHITECTURE_DECISION_RECORD_20261010.md`.

> **C1-Entry-Gate-Fortschreibung 10.10.2026:** Neben synthetischen CRM-Fachdaten entstehen bei einem späteren Providerzugang notwendige reale Verwaltungsdaten für Konto, Administratoren, MFA, Abrechnung und Support. Sie sind keine CRM-Fachdaten, benötigen aber vor C1 eine ausdrückliche Provider-/Datenschutzannahme. Die technische Vorprüfung steht in `CRM_C1_DATA_PROTECTION_AND_PROVIDER_DUE_DILIGENCE_20261010.md`; eine Rechts- oder Datenschutzfreigabe liegt nicht vor.

## Lebenszyklus

1. **Erfassung:** Quelle und Qualitätsstatus werden mitgeführt; im Core ausschließlich synthetisch.
2. **Prüfung:** Pflichtfelder, Beziehungen und Dublettenhinweis werden lokal geprüft.
3. **Nutzung:** nur innerhalb des lokalen CRM-Cores; keine externe Kommunikation.
4. **Änderung:** Audit-Ereignis und Zeitstempel; reversible Änderung kann rückgängig gemacht werden.
5. **Archivierung:** Datensatz wird ausgeblendet, Beziehungen bleiben erhalten.
6. **Wiederherstellung:** archivierter Datensatz kehrt kontrolliert zurück.
7. **Löschung:** im Prototyp nicht verfügbar. Physische Löschung darf erst nach einem qualifiziert geprüften Rechtsgrundlagen-, Fristen-, Referenz- und Nachweiskonzept spezifiziert oder implementiert werden.

Archivierung ist die beschlossene operative Standardaktion. Sie ist reversibel, erhält Beziehungen und ersetzt keine rechtlich erforderliche Löschung.

## Kontakt-, Beziehungs- und Rechtsstatus

- Beziehungsstatus, Kommunikationsstatus und Einwilligungs-/Rechtsgrundlagenstatus sind getrennte Informationen.
- `unknown` ist der Default, wenn kein belastbarer Nachweis vorliegt.
- `documented` darf nur mit Zweck, Quelle, Zeitpunkt und Nachweisreferenz verwendet werden.
- `withdrawn` und `blocked` müssen spätere Außenaktionen verhindern.
- Kein CRM-Status erzeugt oder ersetzt eine Rechtsgrundlage.

Die R3-Arbeitskopie verlangt bei `documented` lokal die synthetischen Felder Zweck, Quelle, Zeitpunkt und Nachweisreferenz. `withdrawn`, `blocked` und `do_not_contact` erzeugen eine sichtbare Sperranzeige. Da keinerlei Außenaktion existiert, ist dies eine fachliche Zustandsprüfung und keine produktive Kommunikationssperre.

## Datenschutzgrenzen

- Keine realen personenbezogenen Daten.
- Keine E-Mail-, Kalender-, Cloud-, Tracking- oder KI-Übertragung.
- Keine automatische Kontaktaufnahme.
- Keine Ableitung einer Rechtsgrundlage aus einem CRM-Status.
- `consentStatus: unknown` ist kein Einwilligungsnachweis.
- Archivierung ist keine rechtliche Löschung.
- Browser-`localStorage` ist kein freigegebener produktiver Speicher.

## Produktive Blocker – vollständig bestehen geblieben

Für C1 offen bleiben die qualifizierte DPA-/SCC-/TIA-/Subprozessorenbewertung, die Annahme realer Provider-Verwaltungsdaten, benannte Verantwortlichkeiten und der Nachweis der später implementierten Schutzmaßnahmen. Für jede produktive Nutzung bleiben zusätzlich Rechtsgrundlagen je Zweck, Informationspflichten, reale Aufbewahrungsfristen, Löschkonzept, Betroffenenrechte, Hosting-/Betriebsfreigabe und qualifizierte Rechts-/Datenschutzprüfung vollständig offen.

## R3.3 Research- und Outreach-Ergänzung

- Quellen-URL, Quellenart und Recherchezeitpunkt sind Pflicht, bevor ein Rechercheeintrag als Lead übernommen werden kann.
- Unternehmensdaten und personenbezogene Ansprechpartnerdaten werden fachlich getrennt bewertet; eine öffentliche Auffindbarkeit ist keine Versandfreigabe.
- Outreach-Entwürfe benötigen einen dokumentierten Kontakt-/Rechtsstatus und eine Versand-/Kanalprüfung für `approved_local`.
- Widerspruch, Abmeldung, `blocked` und `do_not_contact` erzeugen eine lokale Sperre und blockieren verbundene Entwürfe.
- R3.3 verarbeitet weiterhin ausschließlich synthetische Daten; SQLite ändert diese Freigabegrenze nicht.
- Vor realen Daten ist ein Operational-Activation-Gate mit Gerätezugang, Backupziel, Informationspflichten, Betroffenenrechten, Fristen und Lösch-/Sperrlogik notwendig.
- Vor produktivem E-Mail-Versand sind insbesondere § 7 UWG, Art. 14 und Art. 21 DSGVO sowie der konkrete Versandkanal qualifiziert zu prüfen. Ein CRM-Status ersetzt keine rechtliche Bewertung.
- Schutzumgehung bei Plattformen ist ausgeschlossen; erlaubte APIs und Exporte erhalten jeweils eigene Herkunfts- und Vertragsmetadaten.

## R3.15 – reale Daten ausschließlich im lokalen Staging

Die bisherige Aussage „keine realen personenbezogenen Daten“ gilt weiterhin für den operativen synthetischen CRM-Core. R3.15 führt daneben eine ausdrücklich freigegebene, getrennte lokale Staging-Zone für die benannten Altdaten ein. Daraus folgt keine Kontakt-, Rechts- oder Produktivfreigabe.

- Datenminimierung: angezeigt werden nur Felder aus den freigegebenen Arbeitsmappen, die für Identifikation, Zuordnung, Qualität, Herkunft und Prüfung erforderlich sind.
- Herkunft: Datei, Blatt, Zeile und Hash werden gespeichert; Ausgangsdateien bleiben unverändert.
- Zweck: lokale Bestandsprüfung, Deduplizierung, Zuordnung und Vorbereitung einer späteren Einzelfallentscheidung.
- Sperre: jeder reale Kontakt erhält `do_not_contact = 1` und `outreach_approved = 0`.
- Rechtsstatus: `unknown` ist keine Einwilligung; öffentliche Auffindbarkeit ist keine Kontaktfreigabe.
- Strengstes Signal: `blocked`, `withdrawn`, `no consent`, `bounced`, `archived` und vergleichbare Negativsignale dürfen nicht durch einen allgemeineren Status abgeschwächt werden.
- Isolation: separate SQLite-Datei, GET-only-Browseroberfläche, Bindung an `127.0.0.1`, kein Supabase-/Cloud-/Connectorpfad.
- Reset: der synthetische Demo-Reset berührt das Echtdaten-Staging nicht.
- Korrektur: keine freie UI-Änderung; nur neuer kontrollierter Import aus nachvollziehbarer Quelle.
- Löschung/Auskunft: noch kein produktiv freigegebener Workflow; Anfragen müssen nach dem vorhandenen G1-Playbook manuell behandelt werden.
- Aufbewahrung: noch keine Rechtsfreigabe; die lokale Datenzone darf nicht als dauerhafte produktive Archivlösung bezeichnet werden.

Vor einer Core-Übernahme, einer Kontaktaufnahme oder einem Cloudtransfer sind mindestens Zweck/Kanal, Rechtsgrundlage beziehungsweise qualifizierte Freigabe, Informationspflicht, Aktualität, Aufbewahrung, Zugriffsschutz und dokumentierte Product-Owner-Entscheidung erforderlich.
