import { ArrowDown, ArrowRight, BrainCircuit, Building2, Check, FileJson2, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import { agents, demoCase, holdings, money, rebalance } from '../data/demo.ts';
import { Badge, NextLink, SectionTitle } from '../components/Shared.tsx';
import type { Perspective } from '../types.ts';

const agentIcons = [Globe2, Building2, ShieldCheck, Sparkles];

export default function AgentDetail({ perspective }: { perspective: Perspective }) {
  return <>
    <section id="evento" tabIndex={-1} className="panel event-summary">
      <span className="intro-icon"><Globe2 size={24} /></span><div><p className="eyebrow">EL ORIGEN DE LA PROPUESTA</p><h2>Banxico: un recorte hipotético de 25 pb</h2><p>Tasa de referencia del escenario: 7.50% → 7.25%. Menor costo de financiamiento, con efectos distintos según el activo.</p></div><Badge tone="amber">Fuente: MACRO-01 · ficticia</Badge>
    </section>
    <section id="analisis" tabIndex={-1}>
      <SectionTitle eyebrow="ANÁLISIS EN EQUIPO" title="Cuatro agentes, una visión conectada"><Badge tone="green"><Check size={12} />Salidas predefinidas</Badge></SectionTitle>
      <div className="agent-grid">{agents.map((agent, i) => { const Icon = agentIcons[i]; return <article className={`panel agent-card ${i === 3 ? 'synthesizer-card' : ''}`} key={agent.id}>
        <div className="agent-top"><span className="agent-icon"><Icon size={22} /></span><span className="agent-number">{agent.number}</span></div><span className="agent-role">{agent.role}</span><h3>{agent.name}</h3><p>{agent.result}</p><div className="agent-footer"><span><span className="status-dot" />Completado · ejemplo</span><span>{agent.duration}*</span></div>
        {perspective === 'tecnica' && <code className="tool-name">{agent.tool}</code>}
      </article>; })}</div><p className="fine-print">* Estados y duraciones ilustrativos. No hay agentes ejecutándose ni herramientas conectadas.</p>
    </section>
    <section id="hallazgos" tabIndex={-1}>
      <SectionTitle eyebrow="EVIDENCIA DEL ESCENARIO" title="Lo que encontramos"/>
      <div className="two-columns">
        <div className="panel padded"><h3 className="icon-title"><Building2 size={18} />Sensibilidad de instrumentos</h3><div className="sensitivity-list">{holdings.filter((h) => h.id !== 'efectivo').map((h) => <div key={h.id}><span><i className="color-dot" style={{ background: h.color }} /><strong>{h.name}</strong></span><span>{h.sensitivity}</span><p>{h.rationale}</p></div>)}</div><p className="fine-print">Fuente: matriz INSTR-01 ficticia. Estados financieros, deuda y vencimientos son supuestos; no se consultan emisoras reales.</p></div>
        <div className="panel padded"><h3 className="icon-title"><ShieldCheck size={18} />Perfil y capacidad de rebalanceo</h3><div className="risk-profile"><div><span>Perfil de riesgo</span><strong>Moderado</strong><Badge tone="green">KYC de ejemplo</Badge></div><div className="risk-scale" role="img" aria-label="Perfil moderado, nivel 3 de 5"><i /><i /><i className="selected" /><i /><i /></div><div className="scale-labels"><span>Conservador</span><span>Dinámico</span></div></div>
          <dl className="data-list"><div><dt>Horizonte patrimonial</dt><dd>{demoCase.horizon}</dd></div><div><dt>Efectivo actual</dt><dd>{money(demoCase.available)}</dd></div><div><dt>Reserva propuesta</dt><dd>{money(demoCase.minimumCash)}</dd></div><div><dt>Efectivo para reasignar</dt><dd>{money(demoCase.available - demoCase.minimumCash)}</dd></div></dl>
          <div className="small-callout"><ShieldCheck size={17} /><p>La reserva de 5% es un supuesto del caso, no un mínimo regulatorio. No se consulta historial transaccional real.</p></div>
        </div>
      </div>
    </section>
    <section id="sintesis" tabIndex={-1}>
      <SectionTitle eyebrow="SÍNTESIS EXPLICABLE" title="De la causa a la propuesta"/>
      <div className="causal-map">{[
        { icon: Globe2, title: 'Baja la tasa', text: 'Recorte ficticio de 25 pb en la referencia de Banxico.' },
        { icon: Building2, title: 'Cambia el escenario', text: 'Menor reinversión a corto plazo; posible apoyo a duración y Fibras.' },
        { icon: ShieldCheck, title: 'Se cruza con el perfil', text: 'Cartera moderada, horizonte de 5 años y reserva de liquidez.' },
        { icon: Sparkles, title: 'Se propone un ajuste', text: 'Más mediano plazo y Fibras, sin cambiar acciones y ETF.' },
      ].map((item, i) => <div className="causal-step" key={item.title}><span className="causal-icon"><item.icon size={21} /></span><span className="eyebrow">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p>{i < 3 && <ArrowRight className="causal-arrow" size={18} />}</div>)}</div>
      <section className="recommendation"><span className="recommendation-icon"><BrainCircuit size={27} /></span><div><p className="eyebrow">PROPUESTA CONSOLIDADA · DEMO-1</p><h2>Ajustar la distribución. Mantener las metas.</h2><p>Reasignar {money(rebalance.buys)}: reducir {money(rebalance.sales)} de deuda de corto plazo y utilizar {money(rebalance.cashUsed)} de efectivo para aumentar deuda de mediano plazo y Fibras. Mantener {money(demoCase.minimumCash)} de efectivo y la exposición actual a acciones y ETF.</p><div className="recommendation-risk"><ArrowDown size={15} />Los beneficios no están garantizados. Mayor duración también implica sensibilidad si las tasas suben.</div></div></section>
    </section>
    {perspective === 'tecnica' && <section className="panel padded"><h3 className="icon-title"><FileJson2 size={19} />Salida estructurada · fixture</h3><pre className="json-output">{JSON.stringify({ case_id: demoCase.id, source: 'static_fixture', dependencies: ['macro', 'instrumentos', 'riesgo'], synthesizer: 'sintesis', proposed_weights: Object.fromEntries(holdings.map((h) => [h.id, h.proposed])), execution_enabled: false }, null, 2)}</pre></section>}
    <div className="page-actions"><a className="text-link" href="#/bandeja">Volver a la bandeja</a><NextLink to="simulador">Comparar portafolios</NextLink></div>
  </>;
}
