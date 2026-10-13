(function () {
  "use strict";
  const STORAGE_KEY = "amavio-acc-usability-v1";
  const tasks = [
    { id:"T1", title:"Blockade und Produktzweck erkennen", target:90, prompt:"Bitte verschaffen Sie sich einen Überblick. Was verhindert beim ausgewählten Fall den sicheren Start – und wozu dient diese Arbeitsoberfläche?", criteria:["Wohnraumfreigabe als Blockade erkannt","harte Abhängigkeit beziehungsweise kritischen Pfad benannt","Arbeitgeber-/AMAVIO-Steuerung statt Recruiting oder Fachkraft-App verstanden"] },
    { id:"T2", title:"Evidenzkonflikt erklären", target:120, prompt:"Öffnen Sie die Evidenz. Welche Angaben widersprechen sich, und was dürfte das System daraus keinesfalls selbst entscheiden?", criteria:["Formularadresse und Vertragsadresse gefunden","Konflikt und Quellenstatus erklärt","menschliche Prüfung statt automatischer Entscheidung gefordert"] },
    { id:"T3", title:"Nächste Verantwortung bestimmen", target:90, prompt:"Wer muss als Nächstes handeln, was ist konkret zu tun und bis wann?", criteria:["AMAVIO Operations beziehungsweise ausgewiesene Rolle erkannt","Adressabweichung als nächste Aufgabe benannt","Frist aus der Aufgabenliste verwendet"] },
    { id:"T4", title:"Simulation ohne versehentliche Übernahme", target:150, prompt:"Simulieren Sie eine Verschiebung der Anreise um drei Tage. Erklären Sie die Auswirkungen, ohne den Originalfall unbeabsichtigt zu verändern.", criteria:["Simulationsmodus gefunden","neues Datum als Variante berechnet","Vorher/Nachher und Folgefristen verstanden","Original bleibt bis Human Gate unverändert"] },
    { id:"T5", title:"Menschliche Entscheidung dokumentieren", target:150, prompt:"Dokumentieren Sie eine fachlich begründete Entscheidung zur Wohnungsadresse. Welche Verantwortung bleibt beim Menschen?", criteria:["zulässige Option gewählt","nachvollziehbare synthetische Begründung eingegeben","lokale Wirkung und fehlende Außenwirkung verstanden"] },
    { id:"T6", title:"Arbeitsprodukt und Wirkungsgrenze verstehen", target:120, prompt:"Erzeugen Sie ein Arrival Readiness Brief. Woran erkennen Sie Quellenbezug, Entwurfsstatus und fehlende Außenwirkung?", criteria:["Arbeitsprodukte gefunden","Arrival Readiness Brief erzeugt","Quellenreferenzen erkannt","sink_only beziehungsweise keine Außenwirkung erklärt"] },
  ];
  const q = (selector, root=document) => root.querySelector(selector);
  const qa = (selector, root=document) => [...root.querySelectorAll(selector)];
  const blankRecord = (task) => ({ taskId:task.id, seconds:0, outcome:"not_tested", assistance:0, ease:"", errors:0, observation:"", quote:"", interpretation:"", severity:"none" });
  let state = { active:false, participantCode:"SYN-UT-01", role:"employer_hr", mode:"moderated_local", startedAt:null, current:0, records:tasks.map(blankRecord) };
  let taskStartedAt = null; let interval = null;

  function safeLoad() { try { const value=JSON.parse(localStorage.getItem(STORAGE_KEY)); if (value?.records?.length===tasks.length) state=value; } catch {} }
  function persist() { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
  function formatTime(seconds) { const value=Math.max(0,Number(seconds)||0); return `${String(Math.floor(value/60)).padStart(2,"0")}:${String(value%60).padStart(2,"0")}`; }
  function announce(message) { q("[data-live]").textContent=message; }
  function currentRecord() { return state.records[state.current]; }
  function captureForm() {
    const record=currentRecord(); if (!record) return;
    qa("[data-field]").forEach((field) => { const key=field.dataset.field; record[key] = ["assistance","errors"].includes(key) ? Number(field.value) : field.value; });
    persist();
  }
  function populateForm() {
    const record=currentRecord();
    qa("[data-field]").forEach((field) => { field.value=String(record[field.dataset.field] ?? ""); });
  }
  function elapsedSession() { return state.startedAt ? Math.floor((Date.now()-new Date(state.startedAt).getTime())/1000) : 0; }
  function updateTimes() {
    q("[data-session-time]").textContent=formatTime(elapsedSession());
    const extra=taskStartedAt ? Math.floor((Date.now()-taskStartedAt)/1000) : 0;
    q("[data-task-time]").textContent=formatTime(currentRecord().seconds+extra);
  }
  function stopTimer() {
    if (!taskStartedAt) return;
    currentRecord().seconds += Math.floor((Date.now()-taskStartedAt)/1000); taskStartedAt=null;
    q("[data-toggle-timer]").textContent="Aufgabe fortsetzen"; persist(); updateTimes();
  }
  function renderNav() {
    q("[data-task-nav]").innerHTML=tasks.map((task,index) => `<li><button type="button" data-task-index="${index}" aria-current="${index===state.current?"step":"false"}" class="${state.records[index].outcome!=="not_tested"?"is-complete":""}"><span>${index+1}</span><span>${task.title}</span><small>${formatTime(state.records[index].seconds)}</small></button></li>`).join("");
  }
  function renderTask() {
    const task=tasks[state.current];
    q("[data-task-number]").textContent=`Aufgabe ${state.current+1} von ${tasks.length}`;
    q("[data-task-target]").textContent=`Ziel ≤ ${task.target} Sek.`;
    q("[data-task-title]").textContent=task.title; q("[data-task-prompt]").textContent=task.prompt;
    q("[data-task-criteria]").innerHTML=task.criteria.map((item)=>`<li>${item}</li>`).join("");
    q("[data-task-time]").textContent=formatTime(currentRecord().seconds); populateForm(); renderNav();
    q("[data-prev-task]").disabled=state.current===0;
    q("[data-save-next]").textContent=state.current===tasks.length-1?"Speichern und auswerten":"Speichern und weiter";
    announce(`${task.title} geöffnet.`);
  }
  function renderWorkspace() {
    q("[data-session-state]").textContent=state.active?"Session aktiv":"Nicht gestartet";
    q("[data-session-state]").classList.toggle("is-ready",state.active);
    q("[data-test-workspace]").hidden=!state.active; q("[data-summary]").hidden=true;
    if (state.active) renderTask();
  }
  function metrics() {
    const tested=state.records.filter((item)=>item.outcome!=="not_tested");
    const successes=tested.filter((item)=>item.outcome==="success").length;
    const ease=tested.map((item)=>Number(item.ease)).filter(Boolean);
    return { tested:tested.length, successRate:tested.length?Math.round(successes/tested.length*100):0, avgEase:ease.length?(ease.reduce((a,b)=>a+b,0)/ease.length).toFixed(1):"–", assistance:tested.reduce((sum,item)=>sum+Number(item.assistance||0),0), totalSeconds:state.records.reduce((sum,item)=>sum+Number(item.seconds||0),0) };
  }
  function showSummary() {
    stopTimer(); captureForm(); const value=metrics();
    q("[data-test-workspace]").hidden=true; q("[data-summary]").hidden=false;
    q("[data-metrics]").innerHTML=[
      ["Bearbeitet",`${value.tested}/6`],["Erfolgsquote",`${value.successRate}%`],["Ø SEQ",value.avgEase],["Hilfepunkte",String(value.assistance)],["Aufgabenzeit",formatTime(value.totalSeconds)],["Sessionzeit",formatTime(elapsedSession())],
    ].map(([label,result])=>`<article><span>${label}</span><strong>${result}</strong></article>`).join("");
    const findings=state.records.filter((item)=>item.severity!=="none");
    q("[data-findings]").innerHTML=findings.length?findings.map((item)=>`<div class="finding-row"><b>${item.severity.toUpperCase()}</b><span>${tasks.find((task)=>task.id===item.taskId).title}<br><small>${item.observation||item.interpretation||"Befund ohne Notiz"}</small></span><span>${item.outcome}</span></div>`).join(""):"<p>Keine priorisierten Befunde dokumentiert.</p>";
    announce("Lokale Auswertung geöffnet.");
  }
  function download(name,type,content) { const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.href=url; link.download=name; link.click(); setTimeout(()=>URL.revokeObjectURL(url),500); }
  function exportPayload() { captureForm(); return { schemaVersion:"amavio.acc.usability.v1", syntheticOnly:true, externalEffect:false, exportedAt:new Date().toISOString(), session:{ participantCode:state.participantCode, role:state.role, mode:state.mode, startedAt:state.startedAt }, metrics:metrics(), records:state.records }; }
  function csv() { const columns=["participantCode","role","taskId","seconds","outcome","assistance","ease","errors","severity","observation","quote","interpretation"]; const esc=(value)=>`"${String(value??"").replaceAll('"','""')}"`; return [columns.join(","),...state.records.map((record)=>columns.map((column)=>esc(column==="participantCode"?state.participantCode:column==="role"?state.role:record[column])).join(","))].join("\n"); }

  q("[data-start-session]").addEventListener("click",()=>{
    const checked=qa("[data-scope]").every((item)=>item.checked); const code=q("[data-participant-code]").value.trim();
    if (!checked) { q("[data-setup-message]").textContent="Bitte alle vier Scope-Grenzen bestätigen."; return; }
    if (!/^SYN-UT-[0-9]{2}$/.test(code)) { q("[data-setup-message]").textContent="Bitte einen synthetischen Code im Format SYN-UT-01 verwenden."; return; }
    state={ active:true,participantCode:code,role:q("[data-role]").value,mode:q("[data-mode]").value,startedAt:new Date().toISOString(),current:0,records:tasks.map(blankRecord) };
    persist(); q("[data-setup-message]").textContent="Session lokal gestartet. Keine Daten werden übertragen."; renderWorkspace();
    q("[data-test-workspace]").scrollIntoView({behavior:"smooth"}); interval=setInterval(updateTimes,1000);
  });
  q("[data-reset-session]").addEventListener("click",()=>{ if (!confirm("Nur die lokalen synthetischen Beobachtungen dieser Testkonsole zurücksetzen?")) return; localStorage.removeItem(STORAGE_KEY); location.reload(); });
  q("[data-task-nav]").addEventListener("click",(event)=>{ const button=event.target.closest("[data-task-index]"); if (!button) return; stopTimer(); captureForm(); state.current=Number(button.dataset.taskIndex); persist(); renderTask(); });
  q("[data-toggle-timer]").addEventListener("click",(event)=>{ if (taskStartedAt) { stopTimer(); return; } taskStartedAt=Date.now(); event.currentTarget.textContent="Aufgabe pausieren"; updateTimes(); });
  q("[data-reset-timer]").addEventListener("click",()=>{ taskStartedAt=null; currentRecord().seconds=0; persist(); q("[data-toggle-timer]").textContent="Aufgabe starten"; updateTimes(); });
  q("[data-prev-task]").addEventListener("click",()=>{ stopTimer(); captureForm(); state.current=Math.max(0,state.current-1); persist(); renderTask(); });
  q("[data-save-next]").addEventListener("click",()=>{ stopTimer(); captureForm(); if (state.current===tasks.length-1) showSummary(); else { state.current+=1; persist(); renderTask(); } });
  q("[data-observation-form]").addEventListener("input",()=>captureForm());
  q("[data-export-json]").addEventListener("click",()=>download(`${state.participantCode}-usability.json`,"application/json",JSON.stringify(exportPayload(),null,2)));
  q("[data-export-csv]").addEventListener("click",()=>download(`${state.participantCode}-usability.csv`,"text/csv;charset=utf-8",csv()));
  q("[data-return-task]").addEventListener("click",()=>{ q("[data-summary]").hidden=true; q("[data-test-workspace]").hidden=false; renderTask(); });

  safeLoad();
  q("[data-participant-code]").value=state.participantCode; q("[data-role]").value=state.role; q("[data-mode]").value=state.mode;
  renderWorkspace(); if (state.active) interval=setInterval(updateTimes,1000);
}());
