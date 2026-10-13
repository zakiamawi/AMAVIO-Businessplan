# AMAVIO ACC – Release P.2 Role Separation & Usable Work Products

## Status

**Datum:** 13.10.2026  
**Arbeitskopie:** `20261013_AMAVIO_ACC_Release_P2_Role_Separation_Work_Products_Working`  
**Rückfallbasis:** unveränderte Release P.1 auf Port 4217  
**Status:** lokal vollständig geprüft; nicht veröffentlicht und nicht produktiv integriert

## Anlass

Founder-Abnahme P.1:

1. Leistungsumfang verständlich: **Ja**.
2. Arbeitgeber und Operations klar getrennt: **Nein – beide Ansichten wirkten gleich**.
3. Arbeitsprodukte fachlich nutzbar: **Nicht wirklich**.

P.2 korrigiert deshalb die Informationsarchitektur und die Dokumentenverträge, nicht nur Beschriftung oder Styling.

## Geprüfte Änderung

- getrennte Navigationen und Startseiten;
- Arbeitgeber-Entscheidungsposteingang ohne Operations-Ausführung;
- Arbeitgeber-Auftrags- und Ergebnisregister;
- Operations-Arbeitsvorrat ohne Arbeitgeberoptionswahl;
- fokussierte Operations-Workbench mit aktuellem Arbeitsschritt und Nachweisformular;
- vier serverseitig rollengebundene Arbeitsprodukte;
- Rollenverweigerung für fremde Dokumenttypen;
- Desktop-, Tablet- und Mobilführung ohne horizontalen Seitenüberlauf.

## Prüfergebnisse

| Prüfung | Ergebnis |
|---|---:|
| vollständige Node-/Backend-Regression | 337/337 bestanden |
| fokussierte P.2-Rollen- und Dokumententests | 5/5 bestanden |
| Gate-02A-Assurance | 85 Routen und 51 Mutationen grün |
| Static QA | bestanden |
| Brandbook QA | bestanden |
| Browserjourney | bestanden |
| Desktop | 1440 × 1000 bestanden |
| Tablet | 820 × 1050 bestanden |
| Mobil | 390 × 844 bestanden |
| Browserkonsole | keine Fehler |
| externe Requests | keine |
| horizontaler Seitenüberlauf | keiner |

Der Browser-Skill war nicht als callable Werkzeug gelistet. Gemäß Frontend-Testing-Leitlinie wurde deshalb der vorhandene lokale Playwright-/Chromium-Workflow verwendet. Es wurden keine Abhängigkeiten installiert und keine externen Browserdienste angesprochen.

## Geprüfter Interaktionspfad

`Startübersicht → Entscheidung bearbeiten → Option wählen → Auftrag an AMAVIO übergeben → Operations → Auftrag übernehmen → drei Nachweise sichern → Ergebnis übergeben → Operations-Übergabedossier öffnen → Arbeitgeber-Ergebnisse → Ergebnisbrief öffnen`

## Fidelity Ledger

| Prüfpunkt | Konzept | Browserrendering | Ergebnis |
|---|---|---|---|
| Arbeitgeber-Hauptaufgabe | Entscheidungstabelle und kompaktes Auftragsdetail | Entscheidungsposteingang und ausgewählte Entscheidung | übereinstimmend |
| Operations-Hauptaufgabe | Auftragswarteschlange und tiefe Ausführungsfläche | Arbeitsvorrat und fokussierte Nachweis-Workbench | übereinstimmend |
| Rollenunterschied | Steuerung versus Ausführung | keine gemeinsame Kernseite mehr | übereinstimmend |
| Containerlogik | Tabellen, Register und offene Dokumentflächen | keine neue Kachel- oder CRM-Wand | übereinstimmend |
| Typografie und Farbe | Fraunces/Geist, Weiß/Navy/Gold | lokal gerendert, keine Verläufe | übereinstimmend |
| Arbeitsprodukte | getrennte Abnahme- und Nachweisdokumente | vier rollenspezifische Dokumenttypen | fachlich vertieft |
| Mobil | klare Stapelung | 390 Pixel ohne abgeschnittene Primäraktion oder Seitenüberlauf | übereinstimmend |

## Oberhalb-der-Falz-Copy-Diff

Bewusste Änderungen gegenüber P.1:

- Arbeitgeber: `Startfähigkeit` → `Startübersicht`;
- Operations: `Auftragslage` → `Arbeitsvorrat`;
- Arbeitgeber: `Arbeitsprodukte` → `Aufträge an AMAVIO` beziehungsweise `Ergebnisse`;
- Operations: `Ergebnisübergaben` → `Übergabebereit` beziehungsweise `Leistungsnachweise`.

Die Änderungen sind erforderlich, weil jede Bezeichnung jetzt eine konkrete Rollenaufgabe statt eines gemeinsamen Moduls benennt.

## Nicht berührt und offene Grenzen

- P.1-Dateien und lokaler Port 4217;
- separate Drei-Rollen-App, Website, Video und CRM;
- echte Personen-, Arbeitgeber-, Objekt- oder Partnerdaten;
- produktive Identity, Authentifizierung, Mandantentrennung, Hosting und Betrieb;
- externe KI, Providerkonto oder Providerkosten;
- CRM-/HRIS-/App-/Datei-/Messaging-/Buchungsintegration;
- Veröffentlichung, Deployment oder externe Validierung.

Die lokalen Dokumente und der SQLite-Zustand belegen ausschließlich die Konzept- und Demoimplementierung. Sie sind kein rechtlicher, betrieblicher oder produktiver Nachweis.

