(function () {
  "use strict";

  const APPLICATION_SCRIPTS = [
    "assets/calm-capable-v2.js?v=20261013n",
    "assets/release-g.js?v=20261010",
    "assets/release-i.js?v=20261010",
    "assets/release-j.js?v=20261010",
    "assets/release-j-focus.js?v=20261010",
    "assets/release-j5.js?v=20261013n",
    "assets/release-k.js?v=20261013n",
    "assets/release-l.js?v=20261012",
    "assets/release-m.js?v=20261013",
    "assets/release-n.js?v=20261013",
  ];
  const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
  const gate = document.querySelector("[data-runtime-gate]");
  const title = document.querySelector("[data-runtime-title]");
  const message = document.querySelector("[data-runtime-message]");
  const guide = document.querySelector("[data-runtime-guide]");
  const actions = document.querySelector("[data-runtime-actions]");
  const status = document.querySelector("[data-runtime-status]");
  const state = { phase: "checking", protocol: location.protocol, host: location.hostname, health: null, scriptsLoaded: false, error: null };

  function setGate(phase, heading, copy, actionMarkup = "", guideMarkup = "") {
    state.phase = phase;
    document.body.dataset.runtime = phase;
    gate.hidden = false;
    title.textContent = heading;
    message.textContent = copy;
    actions.innerHTML = actionMarkup;
    guide.innerHTML = guideMarkup;
    guide.hidden = !guideMarkup;
  }

  function renderUnsupportedProtocol() {
    setGate(
      "blocked",
      "Lokale Demo starten",
      "Diese Datei ist nur der Einstieg. Die vollständige Demo läuft über den lokalen AMAVIO-Demoserver.",
      '<a href="http://127.0.0.1:4214/?page=cases">Demo auf Port 4214 öffnen</a><button type="button" class="secondary-action" data-runtime-help>Startbefehl anzeigen</button>',
      '<div class="runtime-guide-row"><span>1</span><div><strong>Demoserver starten</strong><small>Falls er noch nicht läuft: im Projektordner <code>npm start</code> ausführen.</small></div></div><div class="runtime-guide-row"><span>2</span><div><strong>Demo im Browser öffnen</strong><small>Danach führt der Hauptbutton direkt zur zweiseitigen Fallsteuerung.</small></div></div>',
    );
    status.textContent = "Server erforderlich";
    actions.querySelector("[data-runtime-help]")?.addEventListener("click", () => {
      message.textContent = "Im Ordner dieser Arbeitskopie ein Terminal öffnen, „npm start“ ausführen und anschließend den Hauptbutton wählen.";
    });
  }

  function renderUnsupportedHost() {
    setGate("blocked", "Öffentliche Ansicht nicht freigegeben", "Diese Konzeptdemo ist ausschließlich für die lokale Founder-Abnahme vorgesehen. Verwenden Sie 127.0.0.1 oder localhost.");
    status.textContent = "Host gesperrt";
  }

  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = source;
      script.async = false;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", () => reject(new Error(`Oberflächenmodul konnte nicht geladen werden: ${source.split("?")[0]}`)), { once: true });
      document.body.append(script);
    });
  }

  async function loadApplication() {
    if (state.scriptsLoaded) return;
    for (const source of APPLICATION_SCRIPTS) await loadScript(source);
    state.scriptsLoaded = true;
  }

  async function verifyHealth() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch("/api/health", { cache: "no-store", signal: controller.signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.status !== "ok" || payload.syntheticOnly !== true || payload.externalEffects !== false) {
        throw new Error("Die lokale Sicherheits- oder Datenbankprüfung war nicht erfolgreich.");
      }
      state.health = payload;
      return payload;
    } finally { clearTimeout(timer); }
  }

  async function start() {
    if (!['http:', 'https:'].includes(location.protocol)) { renderUnsupportedProtocol(); return; }
    if (!LOCAL_HOSTS.has(location.hostname)) { renderUnsupportedHost(); return; }
    setGate(
      "checking",
      "Lokale Demo wird vorbereitet",
      "Die lokale Arbeitsumgebung wird kurz geprüft. Danach öffnet sich die Demo automatisch.",
      "",
      '<div class="runtime-guide-row"><span>1</span><div><strong>Lokale Verbindung</strong><small>Demoserver und Datenbank werden erreicht.</small></div></div><div class="runtime-guide-row"><span>2</span><div><strong>Sicherer Demorahmen</strong><small>Synthetische Daten und Null-Außenwirkung werden bestätigt.</small></div></div>',
    );
    status.textContent = "System wird geprüft";
    try {
      await verifyHealth();
      message.textContent = "Die geprüfte Bedienoberfläche wird geladen.";
      await loadApplication();
      state.error = null;
      state.phase = "ready";
      document.body.dataset.runtime = "ready";
      gate.hidden = true;
      status.textContent = "Lokales System bereit";
      window.dispatchEvent(new CustomEvent("amavio:runtime-ready", { detail: { health: state.health } }));
    } catch (error) {
      state.error = error instanceof Error ? error.message : "Unbekannter Laufzeitfehler";
      setGate(
        "error",
        "Demo ist noch nicht erreichbar",
        "Der lokale Demoserver antwortet gerade nicht. Es wurden keine Daten verändert.",
        '<button type="button" data-runtime-retry>Erneut versuchen</button><button type="button" class="secondary-action" data-runtime-help>Startbefehl anzeigen</button>',
        '<div class="runtime-guide-row"><span>1</span><div><strong>Demoserver starten</strong><small>Im Projektordner <code>npm start</code> ausführen.</small></div></div><div class="runtime-guide-row"><span>2</span><div><strong>Verbindung erneut prüfen</strong><small>Danach „Erneut versuchen“ wählen. Die Demo öffnet sich automatisch.</small></div></div>',
      );
      status.textContent = "System nicht bereit";
      actions.querySelector("[data-runtime-retry]")?.addEventListener("click", start, { once: true });
      actions.querySelector("[data-runtime-help]")?.addEventListener("click", () => {
        message.textContent = "Im Ordner dieser Arbeitskopie ein Terminal öffnen, „npm start“ ausführen und anschließend erneut versuchen.";
      });
    }
  }

  window.AMAVIO_RUNTIME = { getState: () => JSON.parse(JSON.stringify(state)), retry: start };
  start();
}());
