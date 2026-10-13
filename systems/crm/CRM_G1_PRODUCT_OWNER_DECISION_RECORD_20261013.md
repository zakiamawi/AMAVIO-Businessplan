# G1 Product-Owner Decision Record – PO-CRM-043

**Datum:** 13.10.2026  
**Entscheider:** Zaki Amawi, Product Owner  
**Status:** Lokaler fachlicher Arbeitsbeschluss; keine G1-10- oder Produktivfreigabe

## Beschlussgrundlage

Der Product Owner hat den empfohlenen nächsten Schritt freigegeben. Die in `CRM_G1_01_05_07_09_DECISION_RECOMMENDATION_20261013.md` vorgeschlagenen lokalen Arbeitsregeln werden für G1-01, G1-05, G1-07 und G1-09 angenommen und im synthetischen Core technisch angeglichen.

## Beschlossene lokale Fachlogik

### G1-01 – Datenumfang und Zweck

Zulässig sind Unternehmensstammdaten, geschäftliche Kontaktdaten, sachliche Beziehungs- und Verlaufsdaten, kommerzielle Chancen-/Angebotsdaten sowie Herkunfts- und Qualitätsnachweise. Besondere Kategorien, Ausweis-, Bank-, Gesundheits- und private Lebensdaten bleiben ausgeschlossen. Zwecke sind eng auf B2B-Beziehungsarbeit, Bedarfsqualifizierung, Chancensteuerung, Partnerarbeit, Aufgaben-/Gesprächsdokumentation und Nachweisführung begrenzt. Eine produktive Kontaktaufnahme ist nicht beschlossen.

### G1-05 – Lebenszyklus

Die Intervalle 90, 180, 365, 365, 730 und 30 Tage gelten als Wiedervorlage- und Reviewintervalle. Sie sind keine automatischen Löschfristen. Minimierung, Archivierung oder spätere Löschung benötigen einen dokumentierten Anlass, verantwortliche Bearbeitung und Abschlussnachweis. Datenschutz- und Aufbewahrungsprüfung bleiben offen.

### G1-07 – Sicherung und Wiederherstellung

Arbeitsziele sind RPO 24 Stunden, RTO 4 Stunden, tägliche Sicherung sowie eine zusätzliche Sicherung vor wesentlichen Änderungen und eine 30-tägige Rotationsprüfung. Hauptverantwortung liegt bei CRM-Administration. Eine Vertretung ist noch nicht benannt. Verschlüsselung, tatsächlicher Speicherort und ein Restore in der später freigegebenen Zielumgebung müssen vor G1-10 extern beziehungsweise betrieblich nachgewiesen werden.

### G1-09 – Vorfall und Rückabwicklung

Product Owner beziehungsweise CRM-Administration koordiniert den Erstablauf: stoppen, isolieren, bewerten, Sicherung prüfen, kontrolliert wiederherstellen, dokumentieren und Wiederanlauf freigeben. Vertretung, Erreichbarkeit sowie rechtliche Meldewege und Fristen bleiben offen. Ein produktiver Wiederanlauf ist nicht freigegeben.

## Ausdrücklich nicht beschlossen

- G1-10 und Echtdatennutzung;
- produktiver Import, Versand oder externe Kommunikation;
- Authentifizierung, Mehrbenutzerbetrieb oder Mandantenfähigkeit;
- Connector, Cloud, Hosting, Deployment, C1, App- oder ACC-Integration;
- automatische Löschung oder ein produktiver Recovery-Betrieb.

## Technische Wirkung

Die vier Gates erhalten `po_decided_local`. Die Freigabeflags bleiben unverändert aus. Restnachweise werden nicht durch Annahmen geschlossen. Der Beschluss ist in Auditspur, UI, Migration und Tests nachvollziehbar.
