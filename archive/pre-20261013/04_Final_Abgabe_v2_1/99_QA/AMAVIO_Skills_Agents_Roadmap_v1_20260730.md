# AMAVIO Skills & Agents Roadmap v1

Datum: 2026-07-30

## Grundsatz

Nicht viele Agents sind wertvoll, sondern wenige wiederholbare Rollen mit klarer Aufgabe, Input, Output und QA-Gate.

## Definitiv sinnvoll

### 1. Source-of-Truth & QA Controller

Aufgabe:

- Dateiversionen, Seitenzahlen, Hashes, Renderchecks und Git-Status prüfen.

Input:

- Businessplan DOCX/PDF
- Finanzmodell
- Decks
- Website-Build
- QA-Ordner

Output:

- Freigabe/Nicht-Freigabe
- Widerspruchsliste
- QA-Log

Einsatz:

- vor jeder größeren Änderung
- vor finaler Abgabe

### 2. Businessplan Editorial Architect

Aufgabe:

- Langfassung erhalten, Prüferfassung auf 25–35 Seiten kürzen.
- Tabellenlast reduzieren und Story stärken.

Input:

- Businessplan Master
- Finanzmodell v1.8
- Anlagen

Output:

- Kürzungsplan
- neue Struktur
- Abschnitte: behalten/kürzen/anhängen/visualisieren

Einsatz:

- nächste Businessplan-Phase

### 3. Financial Evidence Controller

Aufgabe:

- Zahlenkonsistenz zwischen Excel, Businessplan und Decks prüfen.

Input:

- Excel v1.8
- Businessplan
- Investor/Employer Decks

Output:

- Zahlen-Mapping
- Widersprüche
- prüferfreundliche Finanzstory

Einsatz:

- vor Businessplan- und Pitch-Finalisierung

### 4. Website Creative Technologist

Aufgabe:

- Website in Next.js hochwertig bauen: Motion, 3D, Video, responsive, performant.

Input:

- Website-Repo
- Designsystem
- Content
- Asset-Briefs

Output:

- Codeänderungen
- Build/Lint
- Preview-/QA-Befund

Einsatz:

- sofort in der Website-Premiumphase

### 5. Brand & Motion Director

Aufgabe:

- Premiumlook, Farbwelt, 3D-/Video-Dramaturgie und Higgsfield-Prompts führen.

Input:

- AMAVIO Designsystem
- Businessplan/Decks
- Website

Output:

- Motion-Konzept
- Shotlist
- Asset-Briefs
- Prompt-Library

Einsatz:

- vor jedem Asset- oder Designschritt

### 6. Investor Pitch Strategist

Aufgabe:

- Investmentlogik schärfen: Risiko reduziert, Delivery bewiesen, Kapital sinnvoll eingesetzt.

Input:

- Investor Deck
- Businessplan
- Finanzmodell

Output:

- Slide-Story
- Redlines
- Investor-QA

Einsatz:

- nach Website-Designsystem

### 7. Client/Employer Pitch Strategist

Aufgabe:

- Arbeitgebernutzen und Kaufentscheidung schärfen.

Input:

- Employer Decision Deck
- One-Pager
- Website

Output:

- stärkere Sales-Narrative
- CTA/Angebotslogik
- Entscheidungsargumente

Einsatz:

- nach Website-Designsystem

### 8. Delivery & Export Engineer

Aufgabe:

- Word/PDF/PPTX/Website-Exporte, Build, Lint, Render und Übergabe prüfen.

Input:

- finale Artefakte

Output:

- finale Dateien
- Exportprotokoll
- technische Freigabe

Einsatz:

- Ende jeder Phase

## Eventuell sinnvoll

### AMAVIO Master Skill

Zweck:

- Dauerhaftes Projektgedächtnis für Codex: Prioritäten, Designsystem, QA-Regeln, führende Quellen.

Status:

- sinnvoll, sobald die nächste Website-/Businessplan-Phase bestätigt ist.

### AMAVIO Website Motion Skill

Zweck:

- wiederholbare Regeln für 3D, Motion, Video, Performance und responsive QA.

Status:

- sinnvoll, sobald der erste Motion-/3D-Prototyp steht.

### AMAVIO Finance Consistency Script

Zweck:

- wiederholbarer Check zentraler Umsatz-/Kosten-/Finanzwerte über Excel, Businessplan und Decks.

Status:

- sinnvoll vor finaler Businessplan-Kürzung.

## Nicht jetzt sinnvoll

- Figma Agent
- allgemeiner Marketing Agent
- Social-Media-Agent
- Legal Agent ohne konkrete Rechtsprüfung
- Prompt Agent ohne Umsetzungsverantwortung
- 3D-Agent ohne festgelegten 3D-Stack
- Notion/Slack/Teams/SharePoint-Connectoren ohne echte Projektquelle dort

## Arbeitsregel für Subagents

- Jeder Subagent bekommt eine enge Aufgabe.
- Kein Agent darf finale Dateien blind überschreiben.
- Hauptagent entscheidet über Integration.
- Ergebnisse müssen knapp und verwertbar sein.

