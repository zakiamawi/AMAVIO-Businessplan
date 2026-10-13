# AMAVIO One CRM – R3.9 Informationsarchitektur- und Doppelungsprüfung

**Stand:** 13.10.2026  
**Prüfgegenstand:** R3.8-Arbeitskopie vor jeder R3.9-Änderung  
**Reifegrad:** Lokaler synthetischer CRM-Core-Prototyp – fachlich und technisch geprüft, nicht produktiv freigegeben

## Prüfziel

Die Prüfung beantwortet nicht, ob ähnliche Informationen mehrfach vorkommen, sondern ob dieselbe Information an mehreren Orten dieselbe Aufgabe auslöst. Verdichtung, Detailarbeit und Analyse dürfen dieselben CRM-Fakten unterschiedlich verwenden. Eine echte Doppelung liegt dagegen vor, wenn zwei Bereiche denselben Seitenzweck, dieselben Handlungen oder denselben Navigationsweg anbieten.

## Entscheidungsregeln

1. **Beibehalten**, wenn Übersicht und Arbeitsfläche verschiedene Entscheidungen unterstützen.
2. **Beibehalten und klarer benennen**, wenn zwei Ansichten denselben Datenbestand, aber unterschiedliche Verantwortung zeigen.
3. **Zusammenführen**, wenn derselbe Bereich gleichzeitig als Hauptnavigation und Unterregister erscheint.
4. **Reduzieren**, wenn identische Statusaussagen ohne zusätzlichen Handlungswert wiederholt werden.
5. **Nicht verändern**, wenn eine Zusammenlegung fachliche Tiefe oder eine bereits belastbare Funktion verlieren würde.

## Auditmatrix

| Bereich A | Bereich B | Befund | Entscheidung | R3.9-Maßnahme |
|---|---|---|---|---|
| Hauptnavigation „Daten & Sicherung“ | Unterregister „Daten & Sicherung“ in „Research & Outreach“ | **Echte strukturelle Doppelung.** Der Systembereich erschien an zwei Navigationsstufen und trug bei direktem Aufruf weiterhin die Überschrift „Recherche & Outreach“. | Zusammenführen und fachlich neu verorten. | Eigenständiger Hauptbereich **„System & Freigaben“**; kein gleichnamiges Growth-Unterregister mehr. |
| Growth-Kennzahlen und Growth-Reiter | Daten-, Backup- und G1-Funktionen | **Falscher Kontext.** Zielsegmente und Outreach-Kennzahlen rahmten System- und Freigabefunktionen ein. | Trennen. | Systemansicht besitzt eigene Überschrift und beginnt direkt mit Sicherung/Datenvertrag. |
| Aktiver Datenvertrag | Zugriff-&-Gerät-Register / globale Sperrhinweise | **Teilweise inhaltliche Wiederholung.** Reale Daten, Versand und Cloud wurden bereits in G1 und an den Außenaktionsgrenzen geführt. | Auf technischen Zweck reduzieren. | Datenvertrag zeigt nur Schema, Datentyp, Speichermodus und letzte lokale Änderung. |
| G1 „Eintrittsgates“ | G1 „Nachweise & Beschluss“ | Kein Funktionsduplikat, aber **missverständliche Benennung**: Statusübersicht und Prüfprotokoll wirkten wie zwei Zusammenfassungen. | Beibehalten, Zweck explizit machen. | Umbenennung in **„Gate-Übersicht“** und **„Prüfspur & Beschluss“**; Einleitung erläutert Statussicht versus Evidenzsicht. |
| Kontaktfreigabe | G1 „Recht & Quellen“ | **Notwendige Trennung.** Kontaktfreigabe bewertet einen konkreten Arbeitsfall; G1 führt generelle Quellen-, Zweck-, Kanal- und Informationspflichtregeln. | Beibehalten und Beziehung erklären. | Kontaktfreigabe benennt die Fallprüfung; verweist sprachlich auf die Grundsatzebene in „System & Freigaben“. |
| Mein Arbeitstag | Cockpit | **Keine Doppelung.** Arbeitstag priorisiert konkrete nächste Handlungen; Cockpit verdichtet die Geschäftslage. | Beibehalten. | Keine Funktionsänderung. |
| Cockpit „Pipeline-Lage“ | Pipeline-Arbeitsfläche | **Keine Doppelung.** Das Cockpit zeigt eine verdichtete Lage mit Sprung in die operative Pipeline; nur die Pipeline erlaubt Detailarbeit. | Beibehalten. | Keine Funktionsänderung. |
| Cockpit | Auswertungen | **Keine Doppelung.** Cockpit steuert den aktuellen Zustand; Auswertungen untersuchen Zeitraum, Verteilung, Quellen, Aktivität und Datenqualität. | Beibehalten. | Keine Funktionsänderung. |
| Mein Arbeitstag „Heute abschließen“ | Aufgaben | **Keine Doppelung.** Tagesansicht zeigt maximal fünf priorisierte offene Aufgaben; Aufgabenbereich verwaltet den Gesamtbestand. | Beibehalten. | Keine Funktionsänderung. |
| Mein Arbeitstag „Kontakt & Follow-up“ | Arbeitsjournal | **Keine Doppelung.** Tagesansicht ist eine begrenzte Wiedervorlage; Arbeitsjournal verwaltet Fachobjekte, Ansichten und Historie. | Beibehalten. | Keine Funktionsänderung. |
| Interne Analyse | Berichtsansicht | **Absichtliche Sichttrennung.** Die zweite Ansicht entfernt interne Details und ist kein Export. | Beibehalten. | Keine Funktionsänderung. |

## Neue eindeutige Seitenzwecke

| Bereich | Primäre Frage | Erlaubte Kernhandlungen | Nicht sein Zweck |
|---|---|---|---|
| Mein Arbeitstag | Was muss ich heute entscheiden oder abschließen? | priorisierte Chance öffnen, Aufgabe abschließen, Termin/Wiedervorlage öffnen | Pipeline-Gesamtlage oder Langzeitanalyse |
| Cockpit | Wo entstehen Bewegung, Risiko und Entscheidungsreife? | Managementthema öffnen, in Pipeline oder Auswertungen springen | Tagesagenda oder vollständige Datensatzpflege |
| Pipeline | Welche Chance bearbeite oder bewege ich? | filtern, öffnen, anlegen, Status prüfen | Bericht oder Systemverwaltung |
| Research & Outreach | Welche Zielkunden, Quellen und Entwürfe bereite ich kontrolliert vor? | Recherche, Lead-Übernahme, Entwurf, konkrete Kontaktfreigabe | Backup, Systembetrieb oder Freigabepolitik |
| Arbeitsjournal | Welche fachlichen Ereignisse und Folgeobjekte dokumentiere ich? | Notiz, Gespräch, Termin, Wiedervorlage, Angebot, Entscheidung, Dokumentreferenz | Tagespriorisierung oder Managementanalyse |
| Auswertungen | Welche Muster zeigt der dokumentierte CRM-Zustand? | Zeitraum/Modus wählen, Diagramme lesen, operative Fläche öffnen | Exportfreigabe oder externe Veröffentlichung |
| System & Freigaben | Ist der lokale Zustand gesichert und welche produktiven Gates sind offen? | Sicherung, synthetischer Import/Export, Datenvertrag, G1-Prüfung | Kontaktarbeit, Versand oder Produktivaktivierung |

## Nicht verändert

- keine kanonischen CRM-Objekte, Beziehungen oder Statusübergänge;
- keine bestehenden synthetischen Datensätze;
- keine lokale SQLite-/Browser-Fallback-Migration;
- keine Such-, Detail-, Archiv-, Undo- oder Resetlogik;
- keine Produktivdaten, Authentifizierung, Connectoren, externe Kommunikation, App-/ACC-Integration oder Berechtigungsdurchsetzung;
- kein Deployment, kein Push und keine Veröffentlichung.

## Ergebnis

Die Prüfung bestätigt mehrere **ähnliche**, aber fachlich notwendige Ansichten. Genau eine Navigationsdoppelung und eine redundante Statuswiederholung erforderten eine Änderung. R3.9 reduziert diese beiden Probleme, ohne belastbare Funktionen zusammenzulegen oder den Datenvertrag zu verändern.

