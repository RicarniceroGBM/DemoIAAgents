import { Activity, ArrowUpRight, BriefcaseBusiness, Check, ChevronDown, ChevronRight, CircleHelp, FlaskConical, GitBranch, LayoutDashboard, Menu, PanelLeftClose, RotateCcw, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { demoCase, isPerspective, isScreen, perspectives, screenList } from './data/demo.ts';
import { Badge, CaseHeader, DemoDialog, Journey, PerspectiveNote } from './components/Shared.tsx';
import Events from './screens/Events.tsx';
import Inbox from './screens/Inbox.tsx';
import AgentDetail from './screens/AgentDetail.tsx';
import Simulator from './screens/Simulator.tsx';
import Approval from './screens/Approval.tsx';
import type { Decision, Perspective, Screen } from './types.ts';

const storageKey = 'nexo-demo-ui';
const navIcons = [LayoutDashboard, BriefcaseBusiness, GitBranch, Scale, ShieldCheck];
const sections = ['evento', 'analisis', 'hallazgos', 'sintesis'];

function readRoute(fallback: Screen): { screen: Screen; section?: string; warning: string } {
  const hash = window.location.hash;
  if (!hash || hash === '#') return { screen: fallback, warning: '' };
  const parts = hash.replace(/^#\/?/, '').split('/');
  const [screen, section] = parts;
  if (isScreen(screen) && parts.length <= 2 && (!section || (screen === 'detalle' && sections.includes(section)))) {
    return { screen, section, warning: '' };
  }
  return { screen: 'eventos', warning: 'La ruta no existe en esta demo. Se muestra el Centro de eventos.' };
}

function readInitialState() {
  let screen: Screen = 'eventos';
  let perspective: Perspective = 'asesor';
  let warning = '';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data: unknown = JSON.parse(saved);
      if (typeof data === 'object' && data !== null && 'screen' in data && 'perspective' in data && isScreen(data.screen) && isPerspective(data.perspective)) {
        screen = data.screen;
        perspective = data.perspective;
      } else {
        warning = 'Las preferencias guardadas no son válidas. Se restauraron los valores iniciales.';
      }
    }
  } catch (error) {
    console.error('No se pudieron leer las preferencias de la demo.', error);
    warning = 'No se pudieron leer las preferencias. La demo sigue disponible sin restaurar la sesión.';
  }
  return { route: readRoute(screen), perspective, warning };
}

export default function App() {
  const [initial] = useState(readInitialState);
  const [route, setRoute] = useState(initial.route);
  const [perspective, setPerspective] = useState(initial.perspective);
  const [storageWarning, setStorageWarning] = useState(initial.warning);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [resetMessage, setResetMessage] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lastFocusedRoute = useRef(`${initial.route.screen}/${initial.route.section || ''}`);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const current = screenList.find((screen) => screen.id === route.screen)!;
  const isCase = ['detalle', 'simulador', 'aprobacion'].includes(route.screen);

  useEffect(() => {
    if (!window.location.hash) window.history.replaceState(null, '', `#/${initial.route.screen}`);
    function onHashChange() {
      setRoute(readRoute('eventos'));
      setMobileMenu(false);
      setDecision(null);
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [initial.route.screen]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ screen: route.screen, perspective }));
    } catch (error) {
      console.error('No se pudieron guardar las preferencias de la demo.', error);
      setStorageWarning('El almacenamiento del navegador no está disponible. Puedes navegar, pero las preferencias no se conservarán.');
    }
  }, [route.screen, perspective]);

  useEffect(() => {
    document.title = `${current.label} | Nexo`;
    const routeKey = `${route.screen}/${route.section || ''}`;
    if (lastFocusedRoute.current === routeKey && !route.section) return;
    lastFocusedRoute.current = routeKey;
    const target = route.section ? document.getElementById(route.section) : titleRef.current;
    target?.focus({ preventScroll: true });
    if (route.section) target?.scrollIntoView({ block: 'start', behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route.screen, route.section, current.label]);

  useEffect(() => {
    if (!mobileMenu) return;
    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileMenu(false);
        menuTrigger.current?.focus();
      }
    }
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [mobileMenu]);

  function resetDemo() {
    setPerspective('asesor');
    setMobileMenu(false);
    setDecision(null);
    setRoute({ screen: 'eventos', warning: '' });
    setResetKey((value) => value + 1);
    window.location.hash = '/eventos';
    setResetMessage('Demo reiniciada. Vista asesor y Centro de eventos restaurados.');
  }

  return <div className="app-shell">
    <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); titleRef.current?.focus(); }}>Ir al contenido</a>
    {mobileMenu && <button className="sidebar-backdrop" aria-label="Cerrar navegación" onClick={() => { setMobileMenu(false); menuTrigger.current?.focus(); }} />}
    <aside id="sidebar" className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`} aria-label="Navegación principal">
      <a href="#/eventos" className="brand" aria-label="Nexo, inicio"><span className="brand-mark"><GitBranch size={22} /></span><span>nexo<span className="brand-period">.</span><small>INTELIGENCIA PATRIMONIAL</small></span></a>
      <div className="workspace-label"><span className="workspace-symbol"><BriefcaseBusiness size={16} /></span><div><strong>Wealth Intelligence</strong><span>Espacio de demostración</span></div><Badge>DEMO</Badge></div>
      <p className="nav-label">ESPACIO DE TRABAJO</p>
      <nav className="main-nav">{screenList.map((screen, i) => { const Icon = navIcons[i]; return <a key={screen.id} href={`#/${screen.id}`} className={route.screen === screen.id ? 'active' : ''} aria-current={route.screen === screen.id ? 'page' : undefined} onClick={() => setMobileMenu(false)}><Icon size={18} /><span>{screen.label}</span>{screen.id === 'eventos' ? <span className="nav-count">4</span> : screen.id === 'bandeja' ? <span className="nav-notification" /> : null}</a>; })}</nav>
      <div className="sidebar-case"><span className="sidebar-case-icon"><Sparkles size={17} /></span><p>Una señal.<br /><strong>Una mejor perspectiva.</strong></p><span>Explora cómo cuatro agentes conectan el mercado con las metas de un cliente.</span><a href="#/detalle">Conocer el caso<ArrowUpRight size={15} /></a></div>
      <div className="sidebar-bottom"><div className="environment"><span className="status-dot" />Entorno ilustrativo<span>v1.0</span></div><button className="reset-button" onClick={resetDemo}><RotateCcw size={15} />Reiniciar demo</button><div className="user-profile"><span className="avatar avatar-small">AL</span><div><strong>Alex López</strong><span>Perfil ficticio · sin sesión real</span></div><span className="profile-check"><Check size={12} /></span></div></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumbs"><button ref={menuTrigger} className="icon-button mobile-menu-trigger" aria-label={mobileMenu ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileMenu} aria-controls="sidebar" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <PanelLeftClose size={20} /> : <Menu size={20} />}</button><span>Workspace</span><ChevronRight size={13} /><strong>{current.short}</strong></div>
        <div className="topbar-right"><span className="demo-pill"><FlaskConical size={13} />Prototipo interactivo</span><div className="topbar-divider" /><span className="topbar-avatar">AL</span></div>
      </header>
      <div className="demo-notice"><FlaskConical size={14} /><span><strong>Datos 100% ficticios.</strong> Sin IA conectada, asesoría financiera ni operaciones reales. Prototipo conceptual inspirado en GBM; sin afiliación.</span></div>
      <main id="main-content" className="main-content">
        {(storageWarning || route.warning) && <div className="warning-note" role="alert"><CircleHelp size={18} /><span>{storageWarning || route.warning}</span></div>}
        <span className="sr-only" role="status">{resetMessage}</span>
        <div className="page-heading"><div><p className="eyebrow">{current.eyebrow}</p><h1 ref={titleRef} tabIndex={-1}>{current.label}</h1><p>{current.description}</p></div>
          <label className="perspective-selector"><span className="selector-icon"><ShieldCheck size={17} /></span><span><span className="selector-label">TU PERSPECTIVA</span><select aria-label="Seleccionar perspectiva" value={perspective} onChange={(event) => { if (isPerspective(event.target.value)) setPerspective(event.target.value); }}>{Object.entries(perspectives).map(([id, copy]) => <option key={id} value={id}>{copy.label}</option>)}</select></span><ChevronDown size={15} /></label>
        </div>
        {isCase && <><CaseHeader /><Journey screen={route.screen} section={route.section} /></>}
        <div className="screen-content" key={resetKey}>
          {route.screen === 'eventos' && <Events />}
          <PerspectiveNote screen={route.screen} perspective={perspective} />
          {route.screen === 'bandeja' && <Inbox />}
          {route.screen === 'detalle' && <AgentDetail perspective={perspective} />}
          {route.screen === 'simulador' && <Simulator />}
          {route.screen === 'aprobacion' && <Approval onDecision={setDecision} />}
        </div>
        <footer className="page-footer"><span><span className="footer-brand">nexo.</span> Inteligencia que acompaña.</span><span><Activity size={12} />Prototipo visual · {demoCase.date} · fecha ficticia</span></footer>
      </main>
    </div>
    {decision && <DemoDialog decision={decision} onClose={() => setDecision(null)} />}
  </div>;
}
