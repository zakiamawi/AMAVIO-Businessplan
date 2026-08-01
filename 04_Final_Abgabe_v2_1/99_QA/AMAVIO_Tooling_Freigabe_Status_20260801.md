# AMAVIO Tooling-Freigabe Status - 2026-08-01

Ziel: Nur Tools als spaeter nutzbar markieren, wenn sie in dieser Runde live, ohne Secret-Ausgabe und mit klarer Funktion geprueft wurden. Haengende Tools werden nicht schoengeredet.

## Freigegeben

| Tool | Status | Live-Beleg | Einsatz fuer AMAVIO |
|---|---|---|---|
| RTK | Freigegeben | `rtk 0.44.1` in dieser Runde bestaetigt | Standard fuer Shell-/QA-Kommandos |
| GitHub CLI | Freigegeben | `gh version 2.96.0`, Login `zakiamawi`, Scopes `repo`, `workflow`, `read:org`, `gist` | Repo-/PR-/Workflow-Arbeit |
| GitHub Agentic Workflows | Freigegeben | `gh aw version v0.83.4` | Spaetere GitHub-Automationen und agentische Repo-Workflows |
| OpenCodex CLI | Freigegeben, aber nicht aktiviert | `opencodex 2.8.0`, Help-Ausgabe OK | Nur bewusst einsetzen; kein Standard-Proxy, solange Provider-Routing nicht gewollt ist |
| Scrapling | Freigegeben | `Scrapling 0.4.12` vorher in dieser Freigaberunde bestaetigt | Quellen-, Markt-, Foerder- und Wettbewerbsrecherche |
| Playwright MCP | Langsam, aber nutzbar | `http://127.0.0.1:3000/` geladen, Seitentitel `AMAVIO Living | Workforce Housing & Integration`, Mobile-Resize erfolgreich | Gezielte Browser-Smoke-Tests; keine breiten Massentests in einem Chat ohne Zeitbudget |

## Nicht 100 Prozent freigegeben

| Tool | Status | Warum nicht freigegeben | Naechster sinnvoller Schritt |
|---|---|---|---|
| Graphiti | Vorbereitet, nicht freigegeben | OpenAI-Key secret-sicher in `.env` und `mcp_server/.env`; Docker vorhanden. Root-Compose Buildfehler wegen unset `GRAPHITI_VERSION`; MCP/FalkorDB Compose/Status/Ports haengen bzw. nicht bestaetigt | Separater Docker-Fokuslauf: vorhandenes `zepai/knowledge-graph-mcp:latest` gezielt starten, Health `http://localhost:8000/health` und MCP `http://localhost:8000/mcp/` pruefen |
| Command Code | Installiert, nicht freigegeben | `command-code` ist im PATH, aber Version/Auth/MCP-Kommandos liefen in Timeouts | Spaeter einzeln in frischer Shell testen: `command-code --version`, Auth-Status, MCP-Liste |
| Penpot MCP | Tool vorhanden, nicht freigegeben | Penpot-Tools callable und Overview gelesen, aber selbst minimaler `return { ok: true }` timed out nach 30s | Erst nutzen, wenn Penpot-Projekt aktiv verbunden ist und ein Minimal-Kontexttest innerhalb 30s antwortet |
| Lokales Playwright npm-Paket | Nicht installiert im Website-Projekt | `@playwright/test`, `playwright`, `.bin/playwright.cmd` fehlen in `amavio-living-web/node_modules` | Falls lokale E2E-Suite gewuenscht: gezielt installieren und mit Smoke-Test absichern; aktuell MCP-Weg reicht fuer kurze QA |

## Arbeitsregel ab jetzt

- Freigegebene Tools duerfen fuer AMAVIO-Entwicklung genutzt werden.
- Nicht freigegebene Tools werden nicht als Kernprozess verwendet.
- Bei Haengern: maximal ein kurzer Retry, dann Status setzen und zur naechsten Aufgabe springen.
- Keine Secrets ausgeben. Key-Pruefungen nur formal oder als lokaler Kopiervorgang.
- Fuer Website: Playwright-MCP nur gezielt einsetzen; grosse visuelle Matrix separat planen.
- Fuer Graphiti: nicht nebenbei reparieren. Das braucht einen eigenen, engen Docker-Healthcheck-Lauf.

## Live-Status aktuelle ChatGPT/Codex-Sitzung

Zeitpunkt: 2026-08-01, Codex Desktop / ChatGPT-Toolkontext.

### Direkt aktiv und nutzbar

| Bereich | Live-Beleg | Status fuer AMAVIO |
|---|---|---|
| Codex Plugins | `codex.exe plugin list --json` meldet `installed=true` und `enabled=true` fuer `documents`, `pdf`, `spreadsheets`, `presentations`, `template-creator`, `browser`, `chrome`, `computer-use`, `visualize`, `ecc`, `superpowers` und `superpowers-chrome` | Aktiv; fuer Office-, Browser-, Review- und Skill-Arbeit nutzbar |
| Subagents | `multi_agent_v1.spawn_agent` ist in dieser Sitzung geladen; Rollen: `docs-researcher`, `explorer`, `reviewer`, `worker`, `default` | Aktiv; nur fuer klar getrennte Teilaufgaben einsetzen |
| Automationen | `codex_app.automation_update` ist geladen | Aktiv; bestehende AMAVIO-Morgen-/Abendlaufe koennen geprueft oder aktualisiert werden |
| Node/Browser-Steuerung | `mcp__node_repl.js` Smoke-Test erfolgreich; cwd zeigt auf AMAVIO-Repo | Aktiv; Browser/Chrome-Pfade koennen darueber gesteuert werden |
| Google Calendar / Google Drive | Tools sind geladen (`_list_calendars`, `_search_events`, `_list_drives`) | Aktiv geladen; Kontozugriff nicht unnoetig ausgelesen |
| Codex Document Control | `_list_document_sessions` ist geladen | Aktiv geladen; nur nutzen, wenn ein Excel/PowerPoint/Sheets-Dokument live verbunden ist |
| GitHub / Vercel / Stripe / Lovable / Linear / Higgsfield / Canva / Adobe | Tool-Namensraeume sind in dieser Sitzung sichtbar | Aktiv geladen; nur mit konkretem AMAVIO-Zweck verwenden |

### Konfiguriert, aber in dieser Sitzung nicht direkt als Tool sichtbar

| Bereich | Beleg | Konsequenz |
|---|---|---|
| Projekt-MCP `context7` | `.mcp.json` enthaelt `@upstash/context7-mcp` | Lokal konfiguriert, aber nicht als direktes ChatGPT-Tool geladen |
| Projekt-MCP `playwright` | `.mcp.json` enthaelt `@playwright/mcp@latest` | Lokal konfiguriert; aktuelle Sitzung nutzt Browser/Chrome eher ueber Node-REPL |
| Projekt-MCP `Sequential Thinking` | `.mcp.json` enthaelt `@modelcontextprotocol/server-sequential-thinking` | Lokal konfiguriert, aber nicht als direktes ChatGPT-Tool geladen |

### Nicht pauschal installieren

Die empfohlene Plugin-Liste aus dem Chat ist nicht gleichbedeutend mit "installiert und aktiv". Nicht pauschal installieren: Airtable, Apollo, Asana, Atlassian, Base44, Box, iOS/macOS/Web-App-Builder, Cloudflare, Codex Security, Creative Production, Figma, Granola, HeyGen/HyperFrames, HubSpot, Monday, Neon, Notion, Outlook, PostHog, Product Design, Remotion, Replit, Semrush, Sentry, SharePoint, Slack, Teams, Wix, Zotero.

Regel: Nur installieren oder verbinden, wenn ein konkreter AMAVIO-Use-Case besteht, z. B. echte Quelle, Deployment-Ziel, CRM, Kalender, Asset-Quelle oder Monitoring. Sonst warten.
