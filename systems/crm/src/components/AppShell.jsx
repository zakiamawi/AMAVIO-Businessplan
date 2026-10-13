import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckSquare2,
  ContactRound,
  Database,
  Handshake,
  LayoutDashboard,
  Menu,
  NotebookTabs,
  Radar,
  Plus,
  RotateCcw,
  Route,
  Search,
  Undo2,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { id: "today", label: "Mein Arbeitstag", icon: CalendarDays },
  { id: "cockpit", label: "Cockpit", icon: LayoutDashboard },
  { id: "pipeline", label: "Pipeline", icon: BriefcaseBusiness },
  { id: "organizations", label: "Organisationen", icon: Building2 },
  { id: "contacts", label: "Kontakte", icon: ContactRound },
  { id: "growth", label: "Research & Outreach", icon: Radar },
  { id: "leads", label: "Leads", icon: Route, nested: true },
  { id: "partners", label: "Partner", icon: Handshake },
  { id: "tasks", label: "Aufgaben", icon: CheckSquare2 },
  { id: "worklog", label: "Arbeitsjournal", icon: NotebookTabs },
  { id: "reports", label: "Auswertungen", icon: BarChart3 },
];

const mobileNavItems = [
  navItems[0],
  navItems[2],
  navItems[4],
  navItems[8],
  { id: "more", label: "Mehr", icon: Menu },
];

export function AppShell({ children, page, onPageChange, searchQuery, onSearchQueryChange, onSearchOpen, onCreate, onResetRequest, notice, canUndo, onUndo, onNoticeClose }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate(id) {
    if (id === "more") {
      setMobileOpen(true);
      return;
    }
    onPageChange(id);
    setMobileOpen(false);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Zum Hauptinhalt</a>
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Hauptnavigation">
        <div className="brand-block">
          <img src="/assets/brand/amavio-logo-light.svg" alt="AMAVIO One" />
          <span>CRM</span>
          <button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Menü schließen"><X /></button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ id, label, icon: Icon, nested }) => (
            <button key={id} className={`${page === id ? "active" : ""} ${nested ? "nested" : ""}`} onClick={() => navigate(id)} aria-current={page === id ? "page" : undefined}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button className={page === "data" ? "active" : ""} onClick={() => navigate("data")}><Database aria-hidden="true" /> System & Freigaben</button>
          <p>Sicherung, Datenvertrag und Gates</p>
          <button onClick={onResetRequest}><RotateCcw aria-hidden="true" /> Demo zurücksetzen</button>
        </div>
      </aside>

      <div className="work-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Menü öffnen"><Menu /></button>
          <div className="global-search">
            <Search aria-hidden="true" />
            <input
              value={searchQuery}
              onClick={(event) => onSearchOpen(event.currentTarget)}
              onKeyDown={(event) => { if (event.key === "Enter") onSearchOpen(event.currentTarget); }}
              onChange={(event) => { onSearchQueryChange(event.target.value); onSearchOpen(event.currentTarget); }}
              aria-label="CRM durchsuchen"
              data-search-trigger="true"
              placeholder="CRM durchsuchen …"
            />
            <kbd>⌘ K</kbd>
          </div>
          <button className="icon-button mobile-search-open" onClick={(event) => onSearchOpen(event.currentTarget)} aria-label="CRM durchsuchen" data-search-trigger="true"><Search aria-hidden="true" /></button>
          <button className="primary-action" onClick={() => onCreate("opportunities")}><Plus aria-hidden="true" /> Neue Chance</button>
          <div className="profile" aria-label="Profil">
            <span className="avatar">ZA</span>
            <span><strong>Zaki Amawi</strong><small>CRM-Administration</small></span>
          </div>
        </header>
        <div className="arrival-line" />
        <main id="main-content" tabIndex="-1">{children}</main>
        {notice ? <div className={`status-toast ${notice.type}`} role={notice.type === "error" ? "alert" : "status"}><span>{notice.message}</span>{canUndo ? <button onClick={onUndo}><Undo2 aria-hidden="true" /> Rückgängig</button> : null}<button className="icon-button" onClick={onNoticeClose} aria-label="Hinweis schließen"><X aria-hidden="true" /></button></div> : null}
        <nav className="mobile-bottom" aria-label="Mobile Navigation">
          {mobileNavItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => navigate(id)}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
