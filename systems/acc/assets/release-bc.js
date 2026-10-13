(function(){
  'use strict';

  function $(selector,scope){ return (scope||document).querySelector(selector); }
  function all(selector,scope){ return Array.prototype.slice.call((scope||document).querySelectorAll(selector)); }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function text(selector,value){ var el=$(selector); if(el) el.textContent=value; }
  function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }

  var state={
    auditCounter:0,
    audit:[{time:'Start',actor:'System',event:'Releases B + C bereit',detail:'Synthetischer Ausgangszustand; keine Außenwirkung.'}],
    linkedA:null,
    workflow:null,
    learningDraft:null,
    signals:[
      {id:'sig-worker',role:'Fachkraft',title:'Ankunftscheck als erledigt markiert',meta:'Fallreferenz A-2233 · Statussignal · 09:12',status:'new'},
      {id:'sig-housing',role:'Wohnanbieter',title:'Übergabefenster zur Prüfung bereit',meta:'Fallreferenz A-2233 · Zeitfenster · 09:18',status:'new'},
      {id:'sig-partner',role:'Lokaler Partner',title:'Auftrag kann am Zieltag ausgeführt werden',meta:'Fallreferenz A-2214 · Verfügbarkeitsstatus · 09:24',status:'new'}
    ]
  };

  var WHAT_IF={
    arrival_delay:{title:'Anreise +4 Tage',readiness:-6,open:1,level:'erhöht',owner:'AMAVIO Operations',explain:'Terminabhängige Aufgaben werden neu sequenziert. Wohnraum und Standortübergabe müssen auf das neue Fenster geprüft werden.'},
    housing_fails:{title:'Wohnoption fällt aus',readiness:-24,open:3,level:'kritisch',owner:'Wohnpfad + Arbeitgeberfreigabe',explain:'Die Wohnoption wird zum harten Blocker. Ein Ersatzpfad und eine erneute Kostenentscheidung sind vor Startklarheit erforderlich.'},
    owner_silent:{title:'Verantwortung ohne Rückmeldung',readiness:-13,open:2,level:'hoch',owner:'Sponsor / Vertretungsrolle',explain:'Die fachliche Aufgabe bleibt unverändert, aber die fehlende Verantwortung blockiert Entscheidung und dokumentierte Übergabe.'}
  };

  var WORKFLOWS={
    housing_recovery:[
      ['Trigger bestätigen','AMAVIO Operations · sofort · Signal und Quelle prüfen'],
      ['Ersatzpfad strukturieren','Wohnkoordination · innerhalb 4 h · zwei synthetische Optionen'],
      ['Kostenwirkung vorlegen','Budgetrolle · bis 16:00 · Entscheidungsvorlage'],
      ['Menschliches Gate','Standortleitung · Freigabe oder begründete Rückfrage'],
      ['Ergebnis dokumentieren','AMAVIO Operations · Audit aktualisieren; nichts extern versenden']
    ],
    arrival_delay:[
      ['Änderung validieren','AMAVIO Operations · neues Datum fachlich prüfen'],
      ['Abhängigkeiten neu takten','Wohnraum, Standort und Partner · nur als Entwurf'],
      ['Arbeitgeberauswirkung erklären','HR · Aufgaben und Fristen vergleichen'],
      ['Menschliches Gate','HR bestätigt den angepassten Ablauf'],
      ['Status lokal vormerken','Audit-Eintrag ohne Kalender- oder Nachrichtenausführung']
    ],
    review_closure:[
      ['Überfälligkeit bestätigen','HR · Review-Fälligkeit und Fallbezug prüfen'],
      ['Beobachtungen bündeln','Fachbereich · synthetische Review-Grundlage'],
      ['Agenda vorbereiten','AMAVIO Operations · offene Fragen sichtbar halten'],
      ['Menschliches Gate','HR bestätigt Terminverantwortung'],
      ['Lernpunkt ableiten','Nur nach dokumentiertem Review; lokal vormerken']
    ]
  };

  var DOCUMENTS={
    housing:{extracted:'Fall A-2233 · Objekt H-17 · Einzug 13.09.',missing:'Bestätigte Schlüsselzeit',risk:'Übergabezeit fehlt; Startpfad bleibt offen.'},
    arrival:{extracted:'Fall A-2214 · Anreise 20.09. · Standort Köln',missing:'Abholverantwortung',risk:'Ankunft und erster Standortkontakt sind nicht verbunden.'},
    review:{extracted:'Fall A-2198 · Review Tag 30 · HR zuständig',missing:'Termin und Teilnehmende',risk:'Lerntransfer kann nicht belastbar abgeschlossen werden.'}
  };

  var CHECKPOINTS={
    '30':['Tag 30 · Beobachtung','Frühe Klarheit zu Wohnraum und erster Standortperson reduziert offene Übergaben im synthetischen Vergleich.'],
    '60':['Tag 60 · Beobachtung','Eine feste Vertretungsrolle verhindert, dass fachlich fertige Aufgaben an fehlender Zuständigkeit hängen bleiben.'],
    '90':['Tag 90 · Beobachtung','Strukturierte Reviews machen wiederkehrende Einarbeitungsblocker sichtbar, ohne private App-Inhalte offenzulegen.'],
    '180':['Tag 180 · Transfer','Nur geprüfte, aggregierte Muster werden als Playbook-Vorschlag zurück in die Vorbereitung kommender Fälle geführt.']
  };

  var ROLE_LENSES={
    sponsor:{title:'Sponsor · Entscheidungsüberblick',summary:'Ein kritischer Startpfad und eine überfällige Freigabe benötigen heute eine Managemententscheidung.',metrics:[['Kritisch','1 Pfad'],['Entscheidung','bis 16:00'],['Portfolio','14 Fälle']],actions:['Verantwortung für Fall A-2233 bestätigen','Ausnahme oder Kostenpfad nachvollziehbar freigeben','Eskalationsgrund im Mandatsaudit prüfen'],permissions:[['Sichtbar','Verdichtete Risiken, Kostenfolgen und Entscheidungen'],['Ausgeblendet','Private App-Inhalte und interne Partnernotizen'],['Gate','Nur explizit zugewiesene Managemententscheidung']]},
    hr:{title:'HR · Operatives Arbeitgeberbriefing',summary:'Zwei Übergaben benötigen eine klare Verantwortung; der nächste Schritt ist fachlich vorbereitet.',metrics:[['Offen','2 Aufgaben'],['Nächster Termin','13.09.'],['Reviews','1 fällig']],actions:['Standortverantwortung für A-2214 benennen','Anreiseänderung gegen Aufgabenplan prüfen','Review-Grundlage für A-2198 vervollständigen'],permissions:[['Sichtbar','Zugewiesene Fälle, Termine und Aufgaben'],['Ausgeblendet','AMAVIO-interne Notizen und andere Mandate'],['Gate','Keine automatische Kontaktaufnahme']]},
    location:{title:'Standort · Heute am Einsatzort',summary:'Die Oberfläche reduziert den Mandatszustand auf Übergabe, ersten Arbeitstag und lokale Verantwortung.',metrics:[['Heute','1 Übergabe'],['Diese Woche','3 Aufgaben'],['Blocker','1 offen']],actions:['Schlüsselzeit für A-2233 bestätigen','Vertretung für den ersten Arbeitstag benennen','Lokale Abweichung an AMAVIO zurückgeben'],permissions:[['Sichtbar','Nur standortbezogene Aufgaben und Termine'],['Ausgeblendet','Kostenportfolio und andere Standorte'],['Gate','Keine mandatsweite Freigabeberechtigung']]},
    budget:{title:'Budget · Zugewiesene Entscheidung',summary:'Nur die konkrete Kostenentscheidung, ihre Begründung und die operative Auswirkung werden angezeigt.',metrics:[['Offen','1 Freigabe'],['Schwelle','Demo'],['Auswirkung','Startpfad']],actions:['Synthetische Kostenposition fachlich prüfen','Auswirkung auf Schlüsselübergabe nachvollziehen','Freigeben oder begründete Rückfrage dokumentieren'],permissions:[['Sichtbar','Zugewiesene Position und Auswirkung'],['Ausgeblendet','Private Fallkommunikation und nicht relevante Aufgaben'],['Gate','Keine Zahlung, Bestellung oder Buchung']]}
  };

  function getAState(){
    if(window.AMAVIO_ACC_RELEASE_A && typeof window.AMAVIO_ACC_RELEASE_A.getState==='function') return window.AMAVIO_ACC_RELEASE_A.getState();
    return null;
  }

  function addAudit(actor,event,detail){
    state.auditCounter+=1;
    state.audit.unshift({time:'T+'+String(state.auditCounter).padStart(2,'0')+':00',actor:actor,event:event,detail:detail});
    renderAudit();
  }

  function renderAudit(){
    var target=$('[data-bc-audit]');
    if(!target) return;
    target.innerHTML=state.audit.map(function(item){
      return '<div class="bc-audit-row"><time>'+esc(item.time)+'</time><b>'+esc(item.actor)+'</b><span>'+esc(item.event)+'</span><small>'+esc(item.detail)+'</small></div>';
    }).join('');
  }

  function runWhatIf(){
    var select=$('[data-bc-whatif-event]');
    var event=WHAT_IF[select ? select.value : 'arrival_delay'];
    if(!event) return;
    var linked=getAState();
    state.linkedA=linked;
    var baseConfidence=linked && linked.state ? linked.state.confidence : 92;
    var baseOpen=linked && linked.state ? linked.state.openCount : 2;
    var baseReadiness=clamp(baseConfidence-20,48,84);
    var after=clamp(baseReadiness+event.readiness,18,96);
    var caseId=linked && linked.state ? linked.state.anchorCase : 'A-2233';
    var result=$('[data-bc-whatif-result]');
    if(result){
      result.innerHTML='<div><span>Vorher · Fall '+esc(caseId)+'</span><strong>Startklarheit '+baseReadiness+'%</strong><small>'+baseOpen+' offene Abhängigkeiten · Eskalation mittel</small></div><div class="bc-compare-arrow" aria-hidden="true">→</div><div><span>Nachher · '+esc(event.title)+'</span><strong>Startklarheit '+after+'%</strong><small>'+(baseOpen+event.open)+' offene Abhängigkeiten · Eskalation '+esc(event.level)+'</small></div>';
    }
    text('[data-bc-whatif-explain]',event.explain+' Nächste menschliche Verantwortung: '+event.owner+'.');
    addAudit('What-if Copilot','Simulation: '+event.title,'Fall '+caseId+' · regelbasierte Wirkungsvorschau · keine Prognose und keine Zustandsänderung.');
  }

  function composeWorkflow(){
    var select=$('[data-bc-workflow-goal]');
    var key=select ? select.value : 'housing_recovery';
    state.workflow={key:key,steps:WORKFLOWS[key]||WORKFLOWS.housing_recovery};
    var target=$('[data-bc-workflow-output]');
    if(target){ target.innerHTML=state.workflow.steps.map(function(step){ return '<li><b>'+esc(step[0])+'</b><span>'+esc(step[1])+'</span></li>'; }).join(''); }
    var save=$('[data-bc-save-workflow]'); if(save) save.disabled=false;
    text('[data-bc-workflow-status]','Entwurf erzeugt · noch nicht vorgemerkt.');
    addAudit('Workflow Composer','Workflow-Entwurf erzeugt','Fünf kontrollierte Schritte einschließlich menschlichem Gate; keine Ausführung.');
  }

  function saveWorkflow(){
    if(!state.workflow) return;
    var status=$('[data-bc-workflow-status]');
    if(status){ status.textContent='Workflow lokal vorgemerkt · kein Auftrag und keine Nachricht ausgelöst.'; status.classList.add('is-set'); }
    var button=$('[data-bc-save-workflow]'); if(button) button.disabled=true;
    addAudit('AMAVIO Operations','Workflow lokal vorgemerkt','Nur in dieser Browser-Sitzung; produktive Ausführung bleibt gesperrt.');
  }

  function analyzeDocument(){
    var select=$('[data-bc-document-fixture]');
    var documentData=DOCUMENTS[select ? select.value : 'housing'];
    var target=$('[data-bc-document-output]');
    if(target){
      target.innerHTML='<div><span>Extrahiert</span><strong>'+esc(documentData.extracted)+'</strong></div><div><span>Fehlt</span><strong>'+esc(documentData.missing)+'</strong></div><div><span>Regelhinweis</span><strong>'+esc(documentData.risk)+'</strong></div>';
    }
    addAudit('Document Intelligence','Synthetische Struktur geprüft','Vordefinierte Demo-Felder; kein Upload, OCR oder externer Dokumentdienst.');
  }

  function scanQuality(){
    var issues=[
      ['Datumswiderspruch','Anreise 13.09., Übergabe im Demo-Datensatz 14.09.'],
      ['Verantwortung fehlt','Aufgabe Schlüsselübergabe hat noch keine bestätigte Rolle.'],
      ['Review überfällig','Fall A-2198 ohne dokumentierten 30-Tage-Termin.']
    ];
    var target=$('[data-bc-quality-output]');
    if(target){ target.innerHTML=issues.map(function(issue,index){ return '<div class="bc-issue" data-bc-issue="'+index+'"><span aria-hidden="true"></span><div><b>'+esc(issue[0])+'</b><small>'+esc(issue[1])+'</small></div><button type="button" data-bc-review-issue>Als geprüft markieren</button></div>'; }).join(''); }
    addAudit('Anomaly Assistant','Qualitätsscan abgeschlossen','3 regelbasierte Hinweise in synthetischen Daten; keine automatische Korrektur.');
  }

  function renderSignals(){
    var target=$('[data-bc-signal-inbox]');
    if(!target) return;
    target.innerHTML=state.signals.map(function(signal){
      var action=signal.status==='new' ? '<div class="bc-signal-actions"><button type="button" data-bc-signal-action="accepted">Für Prüfung annehmen</button><button type="button" data-bc-signal-action="returned">Zurückgeben</button></div>' : '<div class="bc-signal-actions"><small>'+(signal.status==='accepted'?'AMAVIO-Prüfung vorgemerkt':'Zur Klärung zurückgegeben')+'</small></div>';
      return '<div class="bc-signal-card" data-bc-signal-id="'+esc(signal.id)+'" data-status="'+esc(signal.status)+'"><span class="bc-signal-role">'+esc(signal.role)+'</span><div><b>'+esc(signal.title)+'</b><small>'+esc(signal.meta)+'</small></div>'+action+'</div>';
    }).join('');
  }

  function selectCheckpoint(day){
    var copy=CHECKPOINTS[day]||CHECKPOINTS['30'];
    all('[data-bc-checkpoint]').forEach(function(button){ button.setAttribute('aria-pressed',button.getAttribute('data-bc-checkpoint')===day?'true':'false'); });
    var target=$('[data-bc-learning-note]'); if(target) target.innerHTML='<b>'+esc(copy[0])+'</b><p>'+esc(copy[1])+'</p>';
  }

  function generateLearning(){
    var accepted=state.signals.filter(function(signal){ return signal.status==='accepted'; }).length;
    state.learningDraft={title:'Vertretungs- und Übergabefenster früher klären',detail:'Bei Vorbereitung neuer synthetischer Fälle sollen Standortvertretung und Schlüsselzeit spätestens sieben Tage vor Anreise als getrennte Prüfpunkte sichtbar sein.'};
    var target=$('[data-bc-learning-draft]');
    if(target) target.innerHTML='<b>'+esc(state.learningDraft.title)+'</b><p>'+esc(state.learningDraft.detail)+'</p><p>Grundlage: '+accepted+' angenommene Signale plus synthetischer Kohortenvergleich.</p>';
    var save=$('[data-bc-save-learning]'); if(save) save.disabled=false;
    addAudit('Learning Copilot','Playbook-Vorschlag erzeugt','Regelbasierter Text aus synthetischen Mustern; menschliche Prüfung ausstehend.');
  }

  function saveLearning(){
    if(!state.learningDraft) return;
    var status=$('[data-bc-learning-status]'); if(status){ status.textContent='Im lokalen Playbook vorgemerkt · nicht veröffentlicht oder produktiv übernommen.'; status.classList.add('is-set'); }
    var button=$('[data-bc-save-learning]'); if(button) button.disabled=true;
    addAudit('AMAVIO Operations','Lernpunkt lokal vorgemerkt','Kein produktives Regelwerk und keine automatische Prozessänderung.');
  }

  function renderRoleLens(key){
    var lens=ROLE_LENSES[key]||ROLE_LENSES.sponsor;
    all('[data-bc-role-lens]').forEach(function(button){ button.setAttribute('aria-pressed',button.getAttribute('data-bc-role-lens')===key?'true':'false'); });
    text('[data-bc-role-title]',lens.title); text('[data-bc-role-summary]',lens.summary);
    var metrics=$('[data-bc-role-metrics]'); if(metrics) metrics.innerHTML=lens.metrics.map(function(item){ return '<div><span>'+esc(item[0])+'</span><strong>'+esc(item[1])+'</strong></div>'; }).join('');
    var actions=$('[data-bc-role-actions]'); if(actions) actions.innerHTML=lens.actions.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('');
    var permissions=$('[data-bc-role-permissions]'); if(permissions) permissions.innerHTML=lens.permissions.map(function(item){ return '<div><b>'+esc(item[0])+'</b><span>'+esc(item[1])+'</span></div>'; }).join('');
  }

  var founderSteps=[
    {role:'admin',tab:'admin:uebersicht',selector:'[data-ai-step="briefing"]',title:'Systemlage verstehen',copy:'Der AI Daily Brief priorisiert die nächste menschliche Entscheidung.'},
    {role:'admin',tab:'admin:uebersicht',selector:'[data-ai-step="decision"]',title:'Entscheidung kontrollieren',copy:'Optionen und Auswirkungen werden vorbereitet; ein Mensch bestätigt.'},
    {role:'admin',tab:'admin:automation',selector:'[data-bc-step="whatif"]',title:'Auswirkungen simulieren',copy:'Der What-if Copilot macht Folgen erklärbar, ohne eine Prognose zu behaupten.'},
    {role:'admin',tab:'admin:automation',selector:'[data-bc-step="workflow"]',title:'Arbeit orchestrieren',copy:'Ein kontrollierter Workflow trennt Trigger, Rolle, Frist und menschliches Gate.'},
    {role:'admin',tab:'admin:automation',selector:'[data-bc-step="documents"]',title:'Evidenz prüfen',copy:'Dokument- und Datenhinweise bleiben transparent und synthetisch.'},
    {role:'admin',tab:'admin:learning',selector:'[data-bc-step="signals"]',title:'Produktgrenze sichern',copy:'Die separate App gibt nur minimierte Signale in eine AMAVIO-Prüfung.'},
    {role:'admin',tab:'admin:learning',selector:'[data-bc-step="copilot"]',title:'Lernen zurückführen',copy:'Aggregierte Muster werden zu einem prüfbaren Playbook-Vorschlag.'},
    {role:'arbeitgeber',tab:'arbeitgeber:intelligence',selector:'[data-bc-step="role-intelligence"]',title:'Rollenbezogen entscheiden',copy:'Der Arbeitgeber erhält nur die für seine Rolle erforderliche Sicht.'}
  ];
  var founderIndex=0;

  function navigate(role,tab){
    var roleButton=$('[data-role-btn="'+role+'"]'); if(roleButton) roleButton.click();
    var tabButton=$('[data-tab-target="'+tab+'"]'); if(tabButton) tabButton.click();
  }

  function showFounderStep(index){
    founderIndex=clamp(index,0,founderSteps.length-1);
    all('.bc-journey-focus').forEach(function(el){ el.classList.remove('bc-journey-focus'); });
    var step=founderSteps[founderIndex];
    navigate(step.role,step.tab);
    window.setTimeout(function(){
      var target=$(step.selector);
      if(target){ target.classList.add('bc-journey-focus'); target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'}); }
    },20);
    text('[data-bc-founder-count]',(founderIndex+1)+' / '+founderSteps.length);
    text('[data-bc-founder-title]',step.title);
    text('[data-bc-founder-copy]',step.copy);
    var prev=$('[data-bc-founder-prev]'); if(prev) prev.disabled=founderIndex===0;
    var next=$('[data-bc-founder-next]'); if(next) next.textContent=founderIndex===founderSteps.length-1?'Abschließen':'Weiter';
  }

  function startFounder(){ var bar=$('[data-bc-founder-bar]'); if(bar) bar.hidden=false; showFounderStep(0); }
  function closeFounder(){ var bar=$('[data-bc-founder-bar]'); if(bar) bar.hidden=true; all('.bc-journey-focus').forEach(function(el){ el.classList.remove('bc-journey-focus'); }); }

  var run=$('[data-bc-run-whatif]'); if(run) run.addEventListener('click',runWhatIf);
  var compose=$('[data-bc-compose-workflow]'); if(compose) compose.addEventListener('click',composeWorkflow);
  var saveWorkflowButton=$('[data-bc-save-workflow]'); if(saveWorkflowButton) saveWorkflowButton.addEventListener('click',saveWorkflow);
  var analyze=$('[data-bc-analyze-document]'); if(analyze) analyze.addEventListener('click',analyzeDocument);
  var scan=$('[data-bc-scan-quality]'); if(scan) scan.addEventListener('click',scanQuality);
  var quality=$('[data-bc-quality-output]'); if(quality) quality.addEventListener('click',function(event){ var button=event.target.closest('[data-bc-review-issue]'); if(!button) return; var issue=button.closest('[data-bc-issue]'); if(issue){ issue.classList.add('is-reviewed'); button.textContent='Geprüft'; button.disabled=true; addAudit('AMAVIO Operations','Datenhinweis geprüft','Lokale Markierung; Quelldaten wurden nicht automatisch verändert.'); } });
  var inbox=$('[data-bc-signal-inbox]'); if(inbox) inbox.addEventListener('click',function(event){ var button=event.target.closest('[data-bc-signal-action]'); if(!button) return; var card=button.closest('[data-bc-signal-id]'); var signal=card && state.signals.filter(function(item){ return item.id===card.getAttribute('data-bc-signal-id'); })[0]; if(!signal) return; signal.status=button.getAttribute('data-bc-signal-action'); renderSignals(); addAudit('AMAVIO Operations',signal.status==='accepted'?'Signal zur Prüfung angenommen':'Signal zur Klärung zurückgegeben',signal.role+' · '+signal.title+' · keine Nachricht oder Synchronisierung.'); });
  all('[data-bc-checkpoint]').forEach(function(button){ button.addEventListener('click',function(){ selectCheckpoint(button.getAttribute('data-bc-checkpoint')); }); });
  var generate=$('[data-bc-generate-learning]'); if(generate) generate.addEventListener('click',generateLearning);
  var saveLearningButton=$('[data-bc-save-learning]'); if(saveLearningButton) saveLearningButton.addEventListener('click',saveLearning);
  all('[data-bc-role-lens]').forEach(function(button){ button.addEventListener('click',function(){ renderRoleLens(button.getAttribute('data-bc-role-lens')); }); });
  all('[data-bc-founder-start]').forEach(function(button){ button.addEventListener('click',startFounder); });
  var founderPrev=$('[data-bc-founder-prev]'); if(founderPrev) founderPrev.addEventListener('click',function(){ showFounderStep(founderIndex-1); });
  var founderNext=$('[data-bc-founder-next]'); if(founderNext) founderNext.addEventListener('click',function(){ if(founderIndex>=founderSteps.length-1) closeFounder(); else showFounderStep(founderIndex+1); });
  var founderClose=$('[data-bc-founder-close]'); if(founderClose) founderClose.addEventListener('click',closeFounder);
  document.addEventListener('amavio:release-a-state',function(event){ state.linkedA=event.detail; });
  document.addEventListener('keydown',function(event){ if(event.key==='Escape') closeFounder(); });

  state.linkedA=getAState();
  renderAudit();
  renderSignals();
  selectCheckpoint('30');
  renderRoleLens('sponsor');

  window.AMAVIO_ACC_RELEASE_BC={
    getState:function(){ return JSON.parse(JSON.stringify(state)); },
    runWhatIf:runWhatIf,
    composeWorkflow:composeWorkflow,
    startFounderJourney:startFounder
  };
})();
