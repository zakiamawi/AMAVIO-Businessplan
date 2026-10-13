import { localize } from '../localize.js'
import { stateContracts } from '../data/states.js'
import { StepRow } from './Primitives.jsx'

export function ExternalWorkspace({ projection, state, language, onOpen }) {
  const visibleItems = state === 'EMPTY' ? [] : projection.items

  return (
    <section className="journey-section" aria-labelledby="journey-title">
      <header className="section-heading">
        <div>
          <h2 id="journey-title">{localize(projection.title, language)}</h2>
          <p>{localize(projection.intro, language)}</p>
        </div>
        <span className="section-count">{language === 'de' ? `${visibleItems.length} Vorgänge` : `${visibleItems.length} items`}</span>
      </header>

      <dl className="route-context-grid" aria-label={language === 'de' ? 'Kontext dieses Bereichs' : 'Context for this area'}>
        {projection.facts.map((entry) => <div key={entry.label.de}><dt>{localize(entry.label, language)}</dt><dd>{localize(entry.value, language)}</dd></div>)}
      </dl>

      {state === 'LOADING' ? <div className="loading-list" aria-label={language === 'de' ? 'Inhalte werden geladen' : 'Loading content'}><span /><span /><span /></div> : visibleItems.length ? <ol className="step-list">
        {visibleItems.map((entry, index) => <StepRow key={entry.id} index={index + 1} title={localize(entry.title, language)} detail={localize(entry.detail, language)} status={localize(stateContracts[entry.state]?.title, language)} language={language} onOpen={onOpen} />)}
      </ol> : <p className="empty-copy">{localize(stateContracts.EMPTY.body, language)}</p>}
    </section>
  )
}
