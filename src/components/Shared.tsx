import { ArrowRight, Check, CheckCircle2, ChevronRight, CircleDot, GitBranch, ShieldCheck, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { amount, decisionCopy, demoCase, holdings, money, perspectives } from '../data/demo.ts';
import type { Decision, Perspective, Screen, Tone } from '../types.ts';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{children}</div>;
}

export function NextLink({ to, children, secondary = false }: { to: string; children: ReactNode; secondary?: boolean }) {
  return <a className={`button ${secondary ? 'button-secondary' : 'button-primary'}`} href={`#/${to}`}>{children}<ArrowRight size={16} /></a>;
}

export function PerspectiveNote({ screen, perspective }: { screen: Screen; perspective: Perspective }) {
  const copy = perspectives[perspective].screens[screen];
  return <section className="perspective-note" aria-label={`Contexto: ${perspectives[perspective].label}`} data-testid="perspective-note">
    <span className="note-icon"><GitBranch size={20} /></span>
    <div className="note-content"><p className="eyebrow">{perspectives[perspective].label} · ENFOQUE</p><h2>{copy.title}</h2><p>{copy.body}</p>
      <div className="note-points">{copy.points.map((point) => <span key={point}><Check size={12} />{point}</span>)}</div>
    </div>
  </section>;
}

export function CaseHeader() {
  return <div className="case-header">
    <div className="client-identity"><span className="avatar">MT</span><div><strong>{demoCase.client}</strong><span>{demoCase.profile} · {demoCase.goal}</span></div></div>
    <div className="case-fact"><span>Patrimonio</span><strong>{money(demoCase.value)} <small>MXN</small></strong></div>
    <div className="case-fact"><span>Horizonte</span><strong>{demoCase.horizon}</strong></div>
    <div className="case-reference"><Badge tone="green">Caso de demostración</Badge><span>{demoCase.id}</span></div>
  </div>;
}

const stations = [
  { label: 'Evento', to: 'detalle/evento' },
  { label: 'Análisis', to: 'detalle/analisis' },
  { label: 'Hallazgos', to: 'detalle/hallazgos' },
  { label: 'Síntesis', to: 'detalle/sintesis' },
  { label: 'Simulación', to: 'simulador' },
  { label: 'Decisión', to: 'aprobacion' },
];

export function Journey({ screen, section }: { screen: Screen; section?: string }) {
  const index = screen === 'simulador' ? 4 : screen === 'aprobacion' ? 5
    : Math.max(0, stations.findIndex((station) => station.to === `detalle/${section || 'evento'}`));
  return <nav className="journey" aria-label="Estaciones del caso">{stations.map((station, i) => (
    <a key={station.to} href={`#/${station.to}`} className={`${i === index ? 'current' : ''} ${i < index ? 'visited' : ''}`} aria-current={i === index ? 'step' : undefined}>
      <span className="station-number">{i < index ? <Check size={13} /> : String(i + 1).padStart(2, '0')}</span><span>{station.label}</span>{i < 5 && <ChevronRight size={13} className="station-arrow" />}
    </a>
  ))}</nav>;
}

export function AllocationBar({ proposed = false }: { proposed?: boolean }) {
  return <div className="allocation-bar" role="img" aria-label={holdings.map((h) => `${h.name}: ${proposed ? h.proposed : h.current}%`).join(', ')}>
    {holdings.map((h) => <span key={h.id} style={{ width: `${proposed ? h.proposed : h.current}%`, backgroundColor: h.color }} />)}
  </div>;
}

export function PortfolioCard({ proposed = false }: { proposed?: boolean }) {
  const kind = proposed ? 'proposed' : 'current';
  return <section className={`panel portfolio-card ${proposed ? 'proposed-card' : ''}`}>
    <div className="portfolio-heading"><span className="eyebrow">{proposed ? 'PORTAFOLIO PROPUESTO' : 'PORTAFOLIO ACTUAL'}</span>{proposed ? <Badge tone="green">Escenario fijo</Badge> : <Badge>Base del caso</Badge>}</div>
    <div className="portfolio-value">{money(demoCase.value)} <small>MXN</small></div><p className="muted">Mismo patrimonio · nueva distribución</p>
    <AllocationBar proposed={proposed} />
    <div className="allocation-rows">{holdings.map((h) => <div className="allocation-row" key={h.id}>
      <span><i className="color-dot" style={{ background: h.color }} />{h.name}</span><strong>{h[kind]}%</strong><span>{money(amount(h[kind]))}</span>
    </div>)}</div>
    <div className="portfolio-footer"><ShieldCheck size={16} /><span>Reserva de liquidez</span><strong>{money(amount(holdings.find((h) => h.id === 'efectivo')![kind]))}</strong></div>
  </section>;
}

export function DemoDialog({ decision, onClose }: { decision: Decision; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const copy = decisionCopy[decision];
  useEffect(() => {
    const trigger = document.activeElement;
    const dialog = ref.current!;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger instanceof HTMLElement) trigger.focus();
    };
  }, []);
  return <dialog ref={ref} className="demo-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <button className="icon-button dialog-close" aria-label="Cerrar diálogo" onClick={onClose}><X size={20} /></button>
    <span className="dialog-icon"><CircleDot size={25} /></span><Badge tone="amber">Solo demostración</Badge>
    <h2 id="dialog-title">{copy.title}</h2><p id="dialog-description">{copy.body}</p>
    <div className="dialog-callout"><CheckCircle2 size={18} /><span>No se ha registrado ninguna decisión.</span></div>
    <div className="dialog-actions">{decision === 'modificar' && <a className="button button-secondary" href="#/simulador" onClick={onClose}>Ver comparación</a>}<button className="button button-primary" onClick={onClose}>Entendido<Check size={16} /></button></div>
  </dialog>;
}
