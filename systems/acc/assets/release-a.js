(function(){
  'use strict';

  var root = document.querySelector('[data-ai-command-center]');
  if(!root) return;

  var SCENARIOS = {
    pflege: {
      id:'pflege',
      title:'Wohnraumfreigabe gefährdet den Start von Fall #A-2233.',
      summary:'Die Anreise ist in sieben Tagen vorgesehen. Eine offene Wohnraumfreigabe blockiert Schlüsselübergabe und Startklarheit. Der sichere nächste Schritt ist eine menschliche Entscheidung der Standortleitung bis heute 16:00 Uhr.',
      anchorCase:'A-2233',
      days:7,
      openCount:2,
      confidence:92,
      signals:[
        {tone:'risk', title:'Freigabe überfällig', meta:'Wohnraumkosten Erstmonat · seit 2 Tagen offen'},
        {tone:'warn', title:'Kritische Abhängigkeit', meta:'Ohne Freigabe keine Schlüsselübergabe'},
        {tone:'ok', title:'Arbeitsvertrag vollständig', meta:'Synthetischer Dokumentstatus geprüft'}
      ],
      evidence:[
        'Fall #A-2233 · geplante Anreise 13.09.2026',
        'Wohnraumfreigabe seit zwei Tagen ohne Entscheidung',
        'Verantwortung laut Demo-Rollenmodell: Standortleitung'
      ],
      missing:['Bestätigter Zeitpunkt der Schlüsselübergabe'],
      pathSummary:'Der kritische Pfad endet nicht bei der Anreise: Die Wohnraumfreigabe blockiert die Schlüsselübergabe und damit die dokumentierte Startklarheit.',
      path:[
        {label:'01', title:'Arbeitsvertrag', meta:'vollständig', state:'done'},
        {label:'02', title:'Wohnoption', meta:'identifiziert', state:'done'},
        {label:'03', title:'Kostenfreigabe', meta:'blockiert · heute', state:'blocked'},
        {label:'04', title:'Schlüsselübergabe', meta:'wartet auf Freigabe', state:'next'},
        {label:'05', title:'Startklarheit', meta:'noch nicht bestätigt', state:'open'}
      ],
      decision:{
        title:'Wie soll die Wohnraumfreigabe behandelt werden?',
        context:'Die Demo bereitet drei fachlich plausible Optionen vor. Keine Option erzeugt eine Bestellung, Buchung, Zahlung oder Nachricht.',
        options:[
          {id:'approve', title:'Freigabe lokal vormerken', detail:'Standortleitung bestätigt den synthetischen Kostenpfad.', effect:'Der Critical Path kann zur Schlüsselübergabe weitergeführt werden. Die Vormerkung bleibt ausschließlich in dieser Browser-Sitzung.'},
          {id:'clarify', title:'Rückfrage priorisieren', detail:'Fehlende Übergabezeit wird vor einer Entscheidung geklärt.', effect:'Die Entscheidung bleibt offen; die Standortleitung erhält in einem späteren Produkt einen strukturierten Klärungsauftrag. Hier wird nichts versendet.'},
          {id:'escalate', title:'An Sponsor eskalieren', detail:'Entscheidung wird wegen Frist und Startauswirkung hochgestuft.', effect:'Die Demo markiert den Sponsor als nächste Verantwortung. Es erfolgt keine Benachrichtigung oder verbindliche Eskalation.'}
        ]
      },
      events:[
        {id:'key_delay', label:'Schlüsselübergabe nicht bestätigt', daysDelta:-1, openDelta:1, confidenceDelta:-4, pathIndex:3, signal:{tone:'risk',title:'Übergabe ungeklärt',meta:'Zusätzliche Abhängigkeit vor Anreise'}, append:' Das neue Signal erhöht den Handlungsdruck; die Übergabezeit ist nun ausdrücklich ungeklärt.'},
        {id:'sponsor_ready', label:'Sponsor übernimmt Entscheidung', daysDelta:0, openDelta:0, confidenceDelta:3, pathIndex:2, signal:{tone:'warn',title:'Sponsor einbezogen',meta:'Menschliche Entscheidung bleibt offen'}, append:' Der Sponsor ist als nächste verantwortliche Rolle vorgemerkt; es wurde niemand benachrichtigt.'}
      ]
    },
    senioren: {
      id:'senioren',
      title:'Die Standortverantwortung für Fall #A-2214 ist noch nicht bestätigt.',
      summary:'Die Anreise ist in 14 Tagen geplant. Der fachliche Pfad ist grundsätzlich stabil, aber eine ungeklärte Ansprechperson verhindert eine belastbare Übergabe an den Standort.',
      anchorCase:'A-2214',
      days:14,
      openCount:2,
      confidence:88,
      signals:[
        {tone:'risk', title:'Verantwortung offen', meta:'Standortleitung hat noch nicht rückgemeldet'},
        {tone:'warn', title:'Übergabe nicht belastbar', meta:'Onboarding braucht eine benannte Person'},
        {tone:'ok', title:'Bedarfsbild abgestimmt', meta:'Synthetischer Vorbereitungsschritt erledigt'}
      ],
      evidence:[
        'Fall #A-2214 · geplante Anreise 20.09.2026',
        'Checkliste: Ansprechpartner benannt ist offen',
        'Verantwortung im Fall: HR Amalienhof'
      ],
      missing:['Name und Verfügbarkeit der verantwortlichen Standortperson'],
      pathSummary:'Die fehlende Standortverantwortung ist die einzige kritische Übergabe zwischen Vorbereitung und erstem Arbeitstag.',
      path:[
        {label:'01', title:'Bedarfsbild', meta:'abgestimmt', state:'done'},
        {label:'02', title:'HR-Vorbereitung', meta:'vollständig', state:'done'},
        {label:'03', title:'Standortperson', meta:'nicht bestätigt', state:'blocked'},
        {label:'04', title:'Onboardingplan', meta:'wartet auf Besitzer', state:'next'},
        {label:'05', title:'Erster Arbeitstag', meta:'in 14 Tagen', state:'open'}
      ],
      decision:{
        title:'Wer übernimmt die Standortverantwortung?',
        context:'Die Entscheidung betrifft nur das synthetische Demo-Rollenmodell und erzeugt keine produktive Rollenzuweisung.',
        options:[
          {id:'location', title:'Einrichtungsleitung vormerken', detail:'Die lokale Leitung wird als nächste Verantwortung gesetzt.', effect:'Die Vorbereitung kann im Demo-Pfad an die Einrichtungsleitung übergeben werden. Es entsteht kein Konto und keine Berechtigung.'},
          {id:'hr', title:'HR hält Verantwortung vorläufig', detail:'HR bleibt bis zur Rückmeldung operativ verantwortlich.', effect:'Der Pfad bleibt offen, aber die nächste Verantwortung ist eindeutig. Keine Nachricht wird versendet.'},
          {id:'sponsor', title:'Sponsor klärt Rollenlücke', detail:'Die fehlende Zuständigkeit wird als Managemententscheidung behandelt.', effect:'Die Rollenlücke wird im Demo-Audit sichtbar eskaliert. Keine produktive Eskalation findet statt.'}
        ]
      },
      events:[
        {id:'owner_absent', label:'Standortperson fällt kurzfristig aus', daysDelta:-2, openDelta:1, confidenceDelta:-5, pathIndex:2, signal:{tone:'risk',title:'Vertretung fehlt',meta:'Onboardingverantwortung erneut offen'}, append:' Durch den simulierten Ausfall wird zusätzlich eine Vertretungsentscheidung notwendig.'},
        {id:'hr_confirmed', label:'HR bestätigt Übergabefenster', daysDelta:0, openDelta:-1, confidenceDelta:5, pathIndex:2, signal:{tone:'ok',title:'Übergabefenster bestätigt',meta:'Verantwortliche Person bleibt noch zu benennen'}, append:' Das Übergabefenster ist geklärt; offen bleibt nur die namentliche Verantwortung.'}
      ]
    },
    industrie: {
      id:'industrie',
      title:'Der 30-Tage-Review von Fall #A-2198 ist überfällig.',
      summary:'Der operative Start ist erfolgt. Ohne strukturierten Review bleiben Einarbeitungsblocker und Lernpunkte für die nächste Kohorte unsichtbar. HR Metallwerk muss den Review heute terminieren.',
      anchorCase:'A-2198',
      days:0,
      openCount:1,
      confidence:90,
      signals:[
        {tone:'risk', title:'Review überfällig', meta:'30-Tage-Review ohne Termin'},
        {tone:'warn', title:'Lerntransfer blockiert', meta:'Keine strukturierte Beobachtung hinterlegt'},
        {tone:'ok', title:'Wohnraum bestätigt', meta:'Synthetischer Ankunftspfad abgeschlossen'}
      ],
      evidence:[
        'Fall #A-2198 · Anreise 02.08.2026',
        'Checkliste: 30-Tage-Review vorbereiten ist offen',
        'Verantwortung im Fall: HR Metallwerk'
      ],
      missing:['Termin und Teilnehmende des 30-Tage-Reviews'],
      pathSummary:'Der kritische Pfad liegt nach dem Start: Ohne Review gibt es weder einen belegten Unterstützungsbedarf noch einen Lerntransfer für die nächste Kohorte.',
      path:[
        {label:'01', title:'Anreise', meta:'abgeschlossen', state:'done'},
        {label:'02', title:'Wohnraum', meta:'bestätigt', state:'done'},
        {label:'03', title:'Einarbeitung', meta:'laufend', state:'done'},
        {label:'04', title:'30-Tage-Review', meta:'überfällig', state:'blocked'},
        {label:'05', title:'Lerntransfer', meta:'wartet auf Review', state:'next'}
      ],
      decision:{
        title:'Wie wird der überfällige Review geschlossen?',
        context:'Die Demo strukturiert den nächsten Schritt; sie führt keinen Terminabgleich und keine echte Einladung durch.',
        options:[
          {id:'schedule', title:'Review-Termin vormerken', detail:'HR übernimmt Terminierung und Agendaentwurf.', effect:'Der lokale Demo-Pfad erhält einen Review-Schritt und eine klare Verantwortung. Es wird kein Kalendertermin erstellt.'},
          {id:'manager', title:'Fachbereich einbeziehen', detail:'Beobachtungen aus der Einarbeitung werden vorab strukturiert.', effect:'Die Entscheidungsvorlage erhält einen zusätzlichen fachlichen Input. Es wird keine Nachricht versendet.'},
          {id:'defer', title:'Review begründet vertagen', detail:'Vertagung benötigt neue Frist und dokumentierten Grund.', effect:'Das Risiko bleibt sichtbar und erhält einen neuen synthetischen Eskalationspunkt.'}
        ]
      },
      events:[
        {id:'feedback_missing', label:'Fachbereichsfeedback fehlt', daysDelta:0, openDelta:1, confidenceDelta:-7, pathIndex:3, signal:{tone:'risk',title:'Beobachtung fehlt',meta:'Review-Grundlage unvollständig'}, append:' Das fehlende Fachbereichsfeedback reduziert die Belastbarkeit der Review-Vorbereitung.'},
        {id:'agenda_ready', label:'Review-Agenda vorbereitet', daysDelta:0, openDelta:-1, confidenceDelta:4, pathIndex:3, signal:{tone:'ok',title:'Agenda vorbereitet',meta:'Termin bleibt menschlich zu bestätigen'}, append:' Die Agenda ist lokal vorbereitet; Termin und Teilnehmende bleiben offen.'}
      ]
    }
  };

  var currentKey = 'pflege';
  var state = null;
  var selectedDecision = null;
  var appliedEvents = [];

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }
  function $(selector){ return document.querySelector(selector); }
  function all(selector){ return Array.prototype.slice.call(document.querySelectorAll(selector)); }
  function setText(selector,value){ var el=$(selector); if(el) el.textContent=value; }
  function clamp(value,min,max){ return Math.max(min,Math.min(max,value)); }

  function scenarioLabel(key){
    var select=$('[data-ai-scenario]');
    if(!select) return key;
    var option=select.querySelector('option[value="'+key+'"]');
    return option ? option.textContent : key;
  }

  function resetState(key){
    currentKey = SCENARIOS[key] ? key : 'pflege';
    state = clone(SCENARIOS[currentKey]);
    selectedDecision = null;
    appliedEvents = [];
    renderAll();
  }

  function publicSnapshot(){
    return clone({scenario:currentKey,state:state,selectedDecision:selectedDecision,appliedEvents:appliedEvents});
  }

  function emitState(){
    document.dispatchEvent(new CustomEvent('amavio:release-a-state',{detail:publicSnapshot()}));
  }

  function renderAll(){
    renderBrief();
    renderSituation();
    renderPath();
    renderDecision();
    setText('[data-ai-state-summary]', scenarioLabel(currentKey)+' · '+appliedEvents.length+' zusätzliche Signale · lokaler Zustand, jederzeit zurücksetzbar.');
    emitState();
  }

  function renderBrief(){
    setText('[data-ai-brief-title]',state.title);
    setText('[data-ai-brief-summary]',state.summary);
    var list=$('[data-ai-signals]');
    if(list){
      list.innerHTML=state.signals.slice(0,4).map(function(signal){
        return '<div class="ai-signal" data-tone="'+esc(signal.tone)+'"><b>'+esc(signal.title)+'</b><span>'+esc(signal.meta)+'</span></div>';
      }).join('');
    }
    all('[data-ai-open-case]').forEach(function(button){ button.setAttribute('data-case-id',state.anchorCase); });
  }

  function renderSituation(){
    setText('[data-ai-days]',state.days <= 0 ? 'heute' : String(state.days));
    setText('[data-ai-open-count]',String(Math.max(0,state.openCount)));
    setText('[data-ai-confidence]',String(clamp(state.confidence,0,99))+'%');
    var evidence=$('[data-ai-evidence]');
    if(evidence) evidence.innerHTML=state.evidence.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('');
    var eventSelect=$('[data-ai-event-select]');
    if(eventSelect){
      eventSelect.innerHTML='<option value="">Signal auswählen…</option>'+state.events.map(function(event){
        var disabled=appliedEvents.indexOf(event.id)!==-1 ? ' disabled' : '';
        return '<option value="'+esc(event.id)+'"'+disabled+'>'+esc(event.label)+(disabled?' · angewendet':'')+'</option>';
      }).join('');
    }
  }

  function renderPath(){
    setText('[data-ai-path-summary]',state.pathSummary);
    var path=$('[data-ai-path]');
    if(path){
      path.innerHTML=state.path.map(function(node){
        return '<div class="ai-path-node" data-state="'+esc(node.state)+'" role="listitem"><b>'+esc(node.label)+'</b><strong>'+esc(node.title)+'</strong><span>'+esc(node.meta)+'</span></div>';
      }).join('');
    }
  }

  function renderDecision(){
    setText('[data-ai-decision-title]',state.decision.title);
    setText('[data-ai-decision-context]',state.decision.context);
    var options=$('[data-ai-decision-options]');
    if(options){
      options.innerHTML=state.decision.options.map(function(option){
        return '<button type="button" class="ai-decision-option" data-ai-decision-option="'+esc(option.id)+'" aria-pressed="false"><b>'+esc(option.title)+'</b><span>'+esc(option.detail)+'</span></button>';
      }).join('');
      all('[data-ai-decision-option]').forEach(function(button){
        button.addEventListener('click',function(){ chooseDecision(button.getAttribute('data-ai-decision-option')); });
      });
    }
    selectedDecision=null;
    var confirm=$('[data-ai-decision-confirm]');
    if(confirm) confirm.disabled=true;
    var resetButton=$('[data-ai-decision-reset]');
    if(resetButton){ resetButton.disabled=false; resetButton.textContent='Auswahl zurücksetzen'; }
    var preview=$('[data-ai-decision-preview]');
    if(preview) preview.innerHTML='<b>Auswirkungsvorschau</b><p>Wählen Sie eine Option. Es wird noch nichts verändert.</p>';
    var status=$('[data-ai-decision-status]');
    if(status){ status.textContent='Noch keine lokale Demo-Entscheidung vorgemerkt.'; status.classList.remove('is-set'); }
  }

  function chooseDecision(id){
    var option=state.decision.options.filter(function(item){ return item.id===id; })[0];
    if(!option) return;
    selectedDecision=option;
    all('[data-ai-decision-option]').forEach(function(button){ button.setAttribute('aria-pressed',button.getAttribute('data-ai-decision-option')===id?'true':'false'); });
    var preview=$('[data-ai-decision-preview]');
    if(preview) preview.innerHTML='<b>Auswirkungsvorschau</b><p>'+esc(option.effect)+'</p>';
    var confirm=$('[data-ai-decision-confirm]');
    if(confirm) confirm.disabled=false;
  }

  function confirmDecision(){
    if(!selectedDecision) return;
    var status=$('[data-ai-decision-status]');
    if(status){
      status.textContent='Vorgemerkt: '+selectedDecision.title+' · menschliche Demo-Entscheidung · keine Systemanbindung.';
      status.classList.add('is-set');
    }
    all('[data-ai-decision-option]').forEach(function(button){ button.disabled=true; });
    var confirmButton=$('[data-ai-decision-confirm]');
    if(confirmButton) confirmButton.disabled=true;
    var resetButton=$('[data-ai-decision-reset]');
    if(resetButton){ resetButton.disabled=true; resetButton.textContent='Über AI-Reset zurücksetzen'; }
    var blocked=state.path.filter(function(node){ return node.state==='blocked'; })[0];
    if(blocked){ blocked.state='next'; blocked.meta='Entscheidung lokal vorgemerkt'; }
    state.signals.unshift({tone:'ok',title:'Entscheidung vorbereitet',meta:selectedDecision.title+' · lokale Vormerkung'});
    state.openCount=Math.max(0,state.openCount-1);
    state.confidence=clamp(state.confidence+2,0,99);
    state.evidence.push('Lokale menschliche Vormerkung: '+selectedDecision.title);
    renderBrief();
    renderSituation();
    renderPath();
    setText('[data-ai-state-summary]',scenarioLabel(currentKey)+' · Entscheidung lokal vorgemerkt · keine Außenwirkung.');
    emitState();
  }

  function applySelectedEvent(){
    var select=$('[data-ai-event-select]');
    if(!select || !select.value) return;
    var event=state.events.filter(function(item){ return item.id===select.value; })[0];
    if(!event || appliedEvents.indexOf(event.id)!==-1) return;
    appliedEvents.push(event.id);
    state.days=Math.max(0,state.days+(event.daysDelta||0));
    state.openCount=Math.max(0,state.openCount+(event.openDelta||0));
    state.confidence=clamp(state.confidence+(event.confidenceDelta||0),0,99);
    state.signals.unshift(clone(event.signal));
    state.summary+=event.append||'';
    state.evidence.push('Simuliertes neues Signal: '+event.label);
    if(state.path[event.pathIndex]){
      state.path[event.pathIndex].state=event.signal.tone==='ok'?'next':'blocked';
      state.path[event.pathIndex].meta=event.label;
    }
    renderAll();
    renderQueryAnswer('Was hat sich durch das neue Signal verändert?');
  }

  function buildAnswer(question){
    var q=String(question||'').toLowerCase();
    var blocked=state.path.filter(function(node){ return node.state==='blocked'; })[0] || state.path.filter(function(node){ return node.state==='next'; })[0];
    var commonEvidence=state.evidence.slice(0,3);
    if(/14|anreis|gefährd|nächsten/.test(q)){
      return {
        title:'Anreisebezogene Priorität erkannt',
        confidence:state.confidence,
        summary:state.title+' '+(state.days>0?'Das relevante Ereignis liegt in '+state.days+' Tagen.':'Die nächste Aktion ist heute fällig.'),
        evidence:commonEvidence,
        actions:['Fall '+state.anchorCase+' öffnen','Blockierende Abhängigkeit prüfen','Verantwortliche Rolle menschlich bestätigen'],
        gate:'Keine automatische Risikobewertung: AMAVIO beziehungsweise die Arbeitgeberrolle prüft Kontext und Entscheidung.'
      };
    }
    if(/pfad|abhängig|block/.test(q)){
      return {
        title:'Kritische Abhängigkeit erklärt',
        confidence:state.confidence,
        summary:(blocked?blocked.title+' ist der aktuelle Engpass. '+blocked.meta+'. ':state.pathSummary+' ')+state.pathSummary,
        evidence:commonEvidence.concat(state.missing.map(function(item){ return 'Noch offen: '+item; })),
        actions:['Evidenz auf Vollständigkeit prüfen','Auswirkungsvorschau im Decision Room lesen','Entscheidung nicht automatisieren'],
        gate:'Der Pfad ist eine lokale fachliche Simulation, keine Prognose oder Garantie.'
      };
    }
    if(/entscheidung|wer|sicher|aktion/.test(q)){
      return {
        title:'Nächste sichere Entscheidung vorbereitet',
        confidence:state.confidence,
        summary:state.decision.title+' Das System stellt Optionen und Folgen bereit; die verantwortliche Person entscheidet.',
        evidence:commonEvidence,
        actions:state.decision.options.map(function(option){ return option.title; }),
        gate:'Eine Auswahl wird nur lokal vorgemerkt und löst keine Nachricht, Zahlung, Buchung oder Freigabe aus.'
      };
    }
    if(/verändert|signal|neu/.test(q)){
      return {
        title:'Lokale Zustandsänderung ausgewertet',
        confidence:state.confidence,
        summary:appliedEvents.length ? 'Es wurden '+appliedEvents.length+' zusätzliche synthetische Signale angewendet. Briefing, Evidenz, Critical Path und Decision Room nutzen denselben aktualisierten Zustand.' : 'Es wurde noch kein zusätzliches Signal angewendet.',
        evidence:state.evidence.slice(-3),
        actions:['Aktualisierten Critical Path prüfen','Entscheidungsoption neu bewerten','AI Command Center bei Bedarf zurücksetzen'],
        gate:'Die Veränderung existiert nur in dieser Browser-Sitzung.'
      };
    }
    return {
      title:'Heutiges Entscheidungsbriefing',
      confidence:state.confidence,
      summary:state.summary,
      evidence:commonEvidence,
      actions:['Critical Path prüfen',state.decision.title,'Menschliche Entscheidung lokal dokumentieren'],
      gate:'Lokaler deterministischer Resolver: keine externe KI und keine autonome Ausführung.'
    };
  }

  function renderQueryAnswer(question){
    var answer=buildAnswer(question);
    setText('[data-ai-response-title]',answer.title);
    setText('[data-ai-response-confidence]','Konfidenz '+answer.confidence+'% · lokal');
    setText('[data-ai-response-summary]',answer.summary);
    setText('[data-ai-response-gate]',answer.gate);
    var evidence=$('[data-ai-response-evidence]');
    if(evidence) evidence.innerHTML=answer.evidence.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('');
    var actions=$('[data-ai-response-actions]');
    if(actions) actions.innerHTML=answer.actions.map(function(item){ return '<li>'+esc(item)+'</li>'; }).join('');
  }

  var presentationSteps=[
    {selector:'[data-ai-step="briefing"]',title:'AI Daily Brief',copy:'Vom Portfolio-Signal zur priorisierten heutigen Entscheidung.'},
    {selector:'[data-ai-step="situation"]',title:'Explainable Intelligence',copy:'Evidenz, Unsicherheit und neue Signale bleiben sichtbar.'},
    {selector:'[data-ai-step="query"]',title:'Natural-Language Command Center',copy:'Fragen werden lokal gegen das synthetische Domänenmodell aufgelöst.'},
    {selector:'[data-ai-step="path"]',title:'Critical Path',copy:'Abhängigkeiten zeigen, was den nächsten Meilenstein blockiert.'},
    {selector:'[data-ai-step="decision"]',title:'Decision Room',copy:'Das System bereitet Optionen und Folgen vor; ein Mensch entscheidet.'}
  ];
  var presentationIndex=0;

  function showPresentationStep(index){
    presentationIndex=clamp(index,0,presentationSteps.length-1);
    all('.ai-step-active').forEach(function(el){ el.classList.remove('ai-step-active'); });
    var step=presentationSteps[presentationIndex];
    var target=$(step.selector);
    if(target){
      target.classList.add('ai-step-active');
      target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
    }
    setText('[data-ai-presentation-count]',(presentationIndex+1)+' / '+presentationSteps.length);
    setText('[data-ai-presentation-title]',step.title);
    setText('[data-ai-presentation-copy]',step.copy);
    var next=$('[data-ai-presentation-next]');
    if(next) next.textContent=presentationIndex===presentationSteps.length-1?'Abschließen':'Weiter';
  }

  function startPresentation(){
    var bar=$('[data-ai-presentation-bar]');
    if(bar) bar.hidden=false;
    showPresentationStep(0);
  }
  function closePresentation(){
    var bar=$('[data-ai-presentation-bar]');
    if(bar) bar.hidden=true;
    all('.ai-step-active').forEach(function(el){ el.classList.remove('ai-step-active'); });
  }

  var scenarioSelect=$('[data-ai-scenario]');
  if(scenarioSelect) scenarioSelect.addEventListener('change',function(){ resetState(this.value); renderQueryAnswer('Was braucht heute meine Entscheidung und warum?'); });
  var eventButton=$('[data-ai-apply-event]');
  if(eventButton) eventButton.addEventListener('click',applySelectedEvent);
  var queryForm=$('[data-ai-query-form]');
  if(queryForm) queryForm.addEventListener('submit',function(event){ event.preventDefault(); var input=$('[data-ai-query-input]'); renderQueryAnswer(input?input.value:''); });
  all('[data-ai-question]').forEach(function(button){
    button.addEventListener('click',function(){ var question=button.getAttribute('data-ai-question')||''; var input=$('[data-ai-query-input]'); if(input) input.value=question; renderQueryAnswer(question); });
  });
  var focusDecision=$('[data-ai-focus-decision]');
  if(focusDecision) focusDecision.addEventListener('click',function(){ var panel=$('[data-ai-step="decision"]'); if(panel){ panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'}); var first=panel.querySelector('[data-ai-decision-option]'); if(first) first.focus(); } });
  var confirm=$('[data-ai-decision-confirm]');
  if(confirm) confirm.addEventListener('click',confirmDecision);
  var decisionReset=$('[data-ai-decision-reset]');
  if(decisionReset) decisionReset.addEventListener('click',function(){
    if(decisionReset.disabled) return;
    renderDecision();
  });
  var localReset=$('[data-ai-local-reset]');
  if(localReset) localReset.addEventListener('click',function(){ if(window.confirm('AI Command Center in den synthetischen Ausgangszustand zurücksetzen?')){ resetState(currentKey); renderQueryAnswer('Was braucht heute meine Entscheidung und warum?'); } });
  var presentationStart=$('[data-ai-presentation-start]');
  if(presentationStart) presentationStart.addEventListener('click',startPresentation);
  var presentationPrev=$('[data-ai-presentation-prev]');
  if(presentationPrev) presentationPrev.addEventListener('click',function(){ showPresentationStep(presentationIndex-1); });
  var presentationNext=$('[data-ai-presentation-next]');
  if(presentationNext) presentationNext.addEventListener('click',function(){ if(presentationIndex>=presentationSteps.length-1) closePresentation(); else showPresentationStep(presentationIndex+1); });
  var presentationClose=$('[data-ai-presentation-close]');
  if(presentationClose) presentationClose.addEventListener('click',closePresentation);
  document.addEventListener('keydown',function(event){ if(event.key==='Escape') closePresentation(); });

  window.AMAVIO_ACC_RELEASE_A={
    getState:publicSnapshot,
    setScenario:resetState,
    answer:buildAnswer
  };

  resetState('pflege');
  renderQueryAnswer('Was braucht heute meine Entscheidung und warum?');
})();
