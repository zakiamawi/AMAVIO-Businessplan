import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, CircleUserRound, Compass, FileText, Home, ListChecks, Menu, ShieldCheck } from 'lucide-react'
import { externalProjections } from '../data/projections.js'
import { externalRoles, externalRoutes, findRoute } from '../data/routes.js'
import { localize } from '../localize.js'
import { normalizeState, stateContracts } from '../data/states.js'
import { ExternalWorkspace } from './ExternalWorkspace.jsx'
import { ArrivalProcessPanel } from './ArrivalProcessPanel.jsx'
import { FocusDialog } from './FocusDialog.jsx'
import { Brand, LanguageSwitch, RoleLock, SkipLink, SyntheticNotice, TrustNotice } from './Primitives.jsx'
import { QaPanel } from './QaPanel.jsx'
import { StatePanel } from './StatePanel.jsx'

const roleIcons = { professional: Compass, housing: Home, partner: CircleUserRound }
const navIcons = [Home, ListChecks, FileText, CalendarDays, CircleUserRound, Menu]

function readParams() {
  return new URLSearchParams(window.location.search)
}

export function ExternalApp() {
  const initial = useMemo(readParams, [])
  const requestedRole = initial.get('role')
  const role = externalRoles[requestedRole] ? requestedRole : 'professional'
  const routes = externalRoutes[role]
  const defaultRoute = role === 'professional' ? routes.find((item) => item.id === 'P-01') : routes[0]
  const requestedRoute = routes.find((item) => item.id === initial.get('route'))
  const [language, setLanguage] = useState(initial.get('lang') === 'en' ? 'en' : 'de')
  const [routeId, setRouteId] = useState(requestedRoute?.id || defaultRoute.id)
  const [state, setState] = useState(normalizeState(initial.get('state')))
  const [dialogOpen, setDialogOpen] = useState(false)
  const [localMessage, setLocalMessage] = useState('')
  const headingRef = useRef(null)
  const dialogTriggerRef = useRef(null)
  const route = findRoute(externalRoutes, role, routeId) || defaultRoute
  const projection = externalProjections[route.id]
  const RoleIcon = roleIcons[role]
  const qaMode = initial.has('qa')
  const blocking = ['ACCESS_DENIED', 'EXPIRED'].includes(state)
  const directIds = role === 'professional' ? ['P-01', 'P-02', 'P-03'] : role === 'housing' ? ['H-01', 'H-02', 'H-03', 'H-04'] : ['L-01', 'L-02', 'L-03', 'L-04']
  const directRoutes = routes.filter((item) => directIds.includes(item.id))
  const moreRoutes = routes.filter((item) => !directIds.includes(item.id))

  const syncUrl = useCallback((nextRoute, nextState, nextLanguage = language) => {
    const url = new URL(window.location.href)
    url.searchParams.set('role', role)
    url.searchParams.set('route', nextRoute)
    url.searchParams.set('state', nextState)
    url.searchParams.set('lang', nextLanguage)
    window.history.replaceState({}, '', url)
  }, [language, role])

  const changeRoute = useCallback((next) => {
    setRouteId(next)
    setLocalMessage('')
    syncUrl(next, state)
  }, [state, syncUrl])

  const changeState = useCallback((next) => {
    const normalized = normalizeState(next)
    setState(normalized)
    setLocalMessage('')
    syncUrl(route.id, normalized)
  }, [route.id, syncUrl])

  const openDialog = useCallback((event) => {
    dialogTriggerRef.current = event.currentTarget
    setDialogOpen(true)
  }, [])
  const closeDialog = useCallback(() => setDialogOpen(false), [])
  const confirmDialog = useCallback(() => {
    setDialogOpen(false)
    setLocalMessage(language === 'de' ? 'Synthetischer Schritt vorbereitet. Es wurde nichts eingereicht oder versendet.' : 'Synthetic step prepared. Nothing was submitted or sent.')
  }, [language])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = `AMAVIO One · ${localize(externalRoles[role].label, language)} · ${localize(route.title, language)}`
  }, [language, role, route])

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [route.id])

  function changeLanguage(next) {
    setLanguage(next)
    syncUrl(route.id, state, next)
  }

  return (
    <div className="external-shell">
      <SkipLink language={language} />
      <SyntheticNotice language={language} />
      <div className="external-layout">
        <aside className="app-sidebar">
          <Brand light />
          <nav className="desktop-route-nav" aria-label={language === 'de' ? 'Rollenbezogene Navigation' : 'Role navigation'}>
            {routes.map((item, index) => {
              const Icon = navIcons[index]
              return <button key={item.id} type="button" className={route.id === item.id ? 'active' : ''} aria-current={route.id === item.id ? 'page' : undefined} onClick={() => changeRoute(item.id)}><Icon aria-hidden="true" size={19} /><span>{localize(item.label, language)}</span></button>
            })}
          </nav>
          <div className="sidebar-role"><RoleIcon aria-hidden="true" size={22} /><div><strong>{localize(externalRoles[role].label, language)}</strong><span>{language === 'de' ? 'Rolle fest zugeordnet' : 'Role assigned'}</span></div></div>
          <p className="sidebar-note">{language === 'de' ? 'Ein sicherer Anfang. Mit klaren Verantwortungen.' : 'A safe beginning. With clear responsibilities.'}</p>
        </aside>

        <section className="app-surface">
          <header className="external-header">
            <span className="mobile-brand"><Brand compact /></span>
            <div className="header-actions"><LanguageSwitch language={language} onChange={changeLanguage} /><RoleLock label={localize(externalRoles[role].label, language)} /></div>
          </header>

          <main id="main-content" className="external-main" tabIndex="-1">
            {qaMode ? <QaPanel language={language} state={state} route={route} routes={routes} onState={changeState} onRoute={changeRoute} /> : null}
            <header className="route-heading">
              <h1 id="page-title" ref={headingRef} tabIndex="-1">{language === 'de' ? 'Guten Morgen.' : 'Good morning.'}</h1>
              <p>{localize(route.purpose, language)}</p>
              <span>{localize(route.title, language)}</span>
            </header>

            <div className="priority-layout">
              <StatePanel state={state} language={language} onAction={openDialog} item={projection.items[0]} />
              <TrustNotice language={language} nonEffect={localize(route.nonEffect, language)} />
            </div>
            {localMessage ? <p className="local-status" role="status"><ShieldCheck aria-hidden="true" size={18} />{localMessage}</p> : null}

            <ArrivalProcessPanel actorId={role} language={language} />
            {!blocking ? <ExternalWorkspace projection={projection} state={state} language={language} onOpen={openDialog} /> : null}

            <footer className="app-footer"><span>AMAVIO One</span><p>{language === 'de' ? 'Arbeitgeber- und Operationssteuerung bleibt vollständig im getrennten Arrival Control Center.' : 'Employer and operations control remains entirely in the separate Arrival Control Center.'}</p></footer>
          </main>

          <nav className="mobile-route-nav" aria-label={language === 'de' ? 'Hauptnavigation' : 'Main navigation'}>
            {directRoutes.map((item) => {
              const Icon = navIcons[routes.indexOf(item)]
              return <button key={item.id} type="button" className={route.id === item.id ? 'active' : ''} aria-current={route.id === item.id ? 'page' : undefined} onClick={() => changeRoute(item.id)}><Icon aria-hidden="true" size={20} /><span>{localize(item.label, language)}</span></button>
            })}
            <details className="more-navigation"><summary className={moreRoutes.some((item) => item.id === route.id) ? 'active' : ''}><Menu aria-hidden="true" size={20} /><span>{language === 'de' ? 'Mehr' : 'More'}</span></summary><div>{moreRoutes.map((item) => <button key={item.id} type="button" className={route.id === item.id ? 'active' : ''} aria-current={route.id === item.id ? 'page' : undefined} onClick={() => changeRoute(item.id)}>{localize(item.label, language)}</button>)}</div></details>
          </nav>
        </section>
      </div>

      <FocusDialog open={dialogOpen} language={language} variant={state === 'CONFLICT' ? 'conflict' : 'review'} title={localize(stateContracts[state].title, language)} description={`${localize(route.title, language)} · ${localize(stateContracts[state].body, language)}`} onClose={closeDialog} onConfirm={confirmDialog} returnFocusRef={dialogTriggerRef} />
    </div>
  )
}
