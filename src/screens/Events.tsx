import { ArrowDownRight, ArrowRight, ArrowUpRight, BellRing, Building2, CheckCircle2, Globe2, Landmark, Layers3, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { demoCase, marketEvents } from '../data/demo.ts';
import { Badge, SectionTitle } from '../components/Shared.tsx';

const categories = ['Todos los eventos', 'Política monetaria', 'Inflación', 'Divisas'];

export default function Events() {
  const [category, setCategory] = useState('Todos los eventos');
  const [search, setSearch] = useState('');
  const visible = marketEvents.filter((event) =>
    (category === 'Todos los eventos' || event.category === category)
    && `${event.title} ${event.institution} ${event.tags.join(' ')}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  return <>
    <section className="hero">
      <div className="hero-copy"><div className="hero-kicker"><span className="live-dot" />INTELIGENCIA QUE CONECTA</div>
        <h2>El mercado se mueve.<br /><span>Tu asesoría evoluciona.</span></h2>
        <p>Transforma señales de mercado en decisiones patrimoniales informadas, con una visión multiagente.</p>
        <a className="button button-light" href="#/detalle">Explorar el caso de ejemplo<ArrowUpRight size={16} /></a>
        <div className="hero-footnote"><ShieldIcon /> Análisis explicable. Decisiones humanas.</div>
      </div>
      <div className="hero-graphic" aria-hidden="true">
        <div className="orbit orbit-outer" /><div className="orbit orbit-inner" />
        <div className="graph-line line-one" /><div className="graph-line line-two" /><div className="graph-line line-three" /><div className="graph-line line-four" />
        <div className="graphic-center"><Layers3 size={30} /><span>NEXO</span></div>
        <div className="graphic-node node-macro"><Globe2 size={18} /><span>Contexto macro</span><i /></div>
        <div className="graphic-node node-assets"><Building2 size={18} /><span>Instrumentos</span><i /></div>
        <div className="graphic-node node-risk"><ShieldIcon /><span>Perfil y riesgo</span><i /></div>
        <div className="graphic-node node-advice"><Sparkles size={18} /><span>Una propuesta</span><i /></div>
        <div className="graphic-caption">4 agentes · 1 visión patrimonial</div>
      </div>
    </section>

    <div className="stats-grid">
      <Stat icon={<BellRing size={19} />} label="Eventos en el radar" value="04" detail="Escenarios de ejemplo" />
      <Stat icon={<Layers3 size={19} />} label="Agentes especializados" value="04" detail="Análisis predefinidos" />
      <Stat icon={<TrendingUp size={19} />} label="Caso listo para explorar" value="01" detail="De la señal a la decisión" />
      <Stat icon={<CheckCircle2 size={19} />} label="Control de la decisión" value="Tuyo" detail="Sin ejecución automática" />
    </div>

    <SectionTitle eyebrow="TU RADAR PATRIMONIAL" title="Señales que merecen atención"><span className="subtle-label">Escenario · {demoCase.date}</span></SectionTitle>
    <div className="event-toolbar"><div className="filter-tabs" role="group" aria-label="Categoría de eventos">{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
      <label className="search-field"><Search size={15} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar evento..." aria-label="Buscar evento" /></label>
    </div>
    <div className="event-grid">{visible.map((event) => <article key={event.id} className={`panel event-card ${event.featured ? 'featured-event' : ''}`}>
      <div className="event-top"><span className={`event-symbol ${event.featured ? 'event-symbol-featured' : ''}`}>{event.id === 'banxico' ? <Landmark size={21} /> : event.id === 'fed' ? <Globe2 size={21} /> : event.id === 'inflacion' ? <TrendingUp size={21} /> : <ArrowDownRight size={21} />}</span><Badge tone={event.tone}><span className="badge-dot" />{event.impact}</Badge></div>
      <div className="event-meta"><span>{event.institution}</span><span>{event.time} · ficticio</span></div>
      <h3>{event.title}</h3><p>{event.description}</p>
      {event.featured && <div className="rate-change"><div><span>Tasa anterior</span><strong>{demoCase.currentRate.toFixed(2)}<small>%</small></strong></div><ArrowRight size={21} /><div><span>Tasa del escenario</span><strong>{demoCase.proposedRate.toFixed(2)}<small>%</small></strong></div><span className="rate-delta">−25 pb</span></div>}
      <div className="event-tags">{event.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="event-bottom">{event.featured ? <><span className="agent-availability"><span className="mini-agent"><Layers3 size={13} /></span>4 análisis disponibles</span><a href="#/bandeja" className="text-link">Ver caso asociado<ArrowRight size={15} /></a></> : <><span className="muted">Fuente de ejemplo · sin conexión</span><Badge>Vista previa</Badge></>}</div>
    </article>)}</div>
    {visible.length === 0 && <div className="panel empty-state"><Search size={27} /><h3>No hay eventos con esos filtros</h3><p>Prueba otra palabra o vuelve a ver todos los escenarios.</p><button className="button button-secondary" onClick={() => { setSearch(''); setCategory('Todos los eventos'); }}>Limpiar filtros</button></div>}
    <div className="bottom-caption"><span className="small-line" />Una señal es el comienzo. El contexto del cliente hace la diferencia.<span className="small-line" /></div>
  </>;
}

function ShieldIcon() {
  return <CheckCircle2 size={15} />;
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{value}</strong><span className="stat-detail">{detail}</span></div>;
}
