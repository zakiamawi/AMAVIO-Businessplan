(function () {
  "use strict";
  const tasks = [
    ["Aktives Ankunftsprogramm finden", "Öffnen Sie das aktive Pflegeprogramm und erklären Sie in einem Satz, was bis zum Arbeitsstart geliefert werden muss.", ["Programmraum gefunden", "Programmstatus verstanden", "Arbeitsstart benannt"]],
    ["Blockade und Verantwortung erkennen", "Finden Sie die aktuell blockierte Lieferstufe und nennen Sie die verantwortliche Rolle.", ["Unterkunft und Übergabe erkannt", "Arbeitgeber Standort genannt"]],
    ["Auswirkung einer Verschiebung prüfen", "Simulieren Sie eine Verschiebung um sieben Tage und erklären Sie, was dadurch noch nicht automatisch passiert.", ["Simulation ausgeführt", "betroffene Pakete erkannt", "keine automatische Anwendung verstanden"]],
    ["Anpassung bewusst prüfen", "Prüfen Sie die Anpassungsvorlage fachlich. Beschreiben Sie den Unterschied zwischen Prüfung und Anwendung.", ["Human Gate gefunden", "fachliche Prüfung dokumentiert", "Null-Außenwirkung verstanden"]],
    ["Arbeitgeberperspektive einordnen", "Wechseln Sie in die Sponsorrolle und benennen Sie, welche internen Informationen dort bewusst nicht sichtbar sind.", ["Rollenwechsel gelungen", "nur Sponsorentscheidung sichtbar", "interne Planung als verborgen erkannt"]],
    ["Outcome-Rückmeldung übergeben", "Erfassen Sie eine synthetische Service-Rückmeldung und erklären Sie, wohin sie geht.", ["Rückmeldung erfasst", "lokale Übergabe erkannt", "kein Versand behauptet"]],
    ["Belege abgleichen", "Öffnen Sie die interne Planungsentscheidung, erzeugen Sie einen Evidenzabgleich und finden Sie den Klärungsauftrag.", ["interne Seite gefunden", "Evidenzabgleich ausgeführt", "Klärungsauftrag verstanden"]],
    ["Qualitätsnachweis verstehen", "Führen Sie die 36 lokalen Szenarien aus und erklären Sie, was das Ergebnis beweist – und was nicht.", ["36/36 erkannt", "0 Provideraufrufe erkannt", "keine Produktivfreigabe abgeleitet"]],
  ].map(([title, goal, success]) => ({ title, goal, success }));
  const q = (selector) => document.querySelector(selector);
  const state = { started: false, index: 0, observations: [] };

  function renderResults() {
    q("[data-results]").innerHTML = state.observations.length
      ? state.observations.map((item, index) => `<article><b>${index + 1}. ${tasks[index].title}</b><span>${item.outcome} · ${item.severity}</span></article>`).join("")
      : "<p>Noch keine Beobachtung erfasst.</p>";
    q("[data-export]").disabled = !state.observations.length;
  }

  function render() {
    q("[data-progress]").textContent = `${state.observations.length} von ${tasks.length} Aufgaben`;
    q("[data-progress-bar]").style.width = `${state.observations.length / tasks.length * 100}%`;
    if (!state.started) return;
    const task = tasks[state.index];
    q("[data-task-card]").innerHTML = `<span>Aufgabe ${state.index + 1} von ${tasks.length}</span><h2>${task.title}</h2><p>${task.goal}</p><ol>${task.success.map((item) => `<li>${item}</li>`).join("")}</ol>`;
    q("[data-observation-fields]").disabled = false; q("[data-next]").disabled = false; q("[data-prev]").disabled = state.index === 0; renderResults();
  }

  q("[data-start]").addEventListener("click", () => { state.started = true; state.index = 0; state.observations = []; render(); });
  q("[data-observation-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    state.observations[state.index] = { taskId: state.index + 1, outcome: q("[data-outcome]").value, severity: q("[data-severity]").value, observation: q("[data-observation]").value.trim(), evidence: q("[data-evidence]").value.trim() };
    q("[data-observation]").value = ""; q("[data-evidence]").value = "";
    if (state.index < tasks.length - 1) { state.index += 1; render(); return; }
    q("[data-progress]").textContent = `${tasks.length} von ${tasks.length} Aufgaben`; q("[data-progress-bar]").style.width = "100%";
    q("[data-task-card]").innerHTML = '<span>Abgeschlossen</span><h2>Moderierte Sitzung vollständig</h2><p>Prüfen Sie P0/P1-Beobachtungen vor jeder weiteren Produktentscheidung. Dieser lokale Abschluss ist keine externe Markt- oder Produktivfreigabe.</p>';
    q("[data-observation-fields]").disabled = true; q("[data-next]").disabled = true; renderResults();
  });
  q("[data-prev]").addEventListener("click", () => { if (state.index > 0) { state.index -= 1; render(); } });
  q("[data-export]").addEventListener("click", () => {
    const payload = { schema: "amavio.usability.program.v1", createdAt: new Date().toISOString(), participant: q("[data-participant]").value, role: q("[data-role]").value, syntheticOnly: true, externalValidation: false, tasks: tasks.map((task, index) => ({ ...task, observation: state.observations[index] || null })) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `AMAVIO_synthetischer_Programmtest_${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href);
  });
  q("[data-reset]").addEventListener("click", () => location.reload());
}());
