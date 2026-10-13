import { Settings2 } from 'lucide-react'
import { stateOrder } from '../data/states.js'

export function QaPanel({ language, state, route, routes, onState, onRoute }) {
  return (
    <details className="qa-panel">
      <summary><Settings2 aria-hidden="true" size={17} />{language === 'de' ? 'Synthetische QA-Steuerung' : 'Synthetic QA controls'}</summary>
      <div>
        <label><span>{language === 'de' ? 'Route' : 'Route'}</span><select value={route.id} onChange={(event) => onRoute(event.target.value)}>{routes.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.title[language]}</option>)}</select></label>
        <label><span>{language === 'de' ? 'Zustand' : 'State'}</span><select value={state} onChange={(event) => onState(event.target.value)}>{stateOrder.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <p>{language === 'de' ? 'Nur lokale Darstellung. Keine Daten- oder Prozessmutation.' : 'Local display only. No data or process mutation.'}</p>
      </div>
    </details>
  )
}
