import { ArrowRight, BrainCircuit, Building2, Check, FileJson2, Globe2, Info, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';
import { amount, cashHolding, money, rebalanceFor } from '../data/demo.ts';
import { Badge, NextLink, SectionTitle } from '../components/Shared.tsx';
import { routeTo } from '../routes.ts';
import type { Perspective, Scenario } from '../types.ts';

const agentIcons = [Globe2, Building2, ShieldCheck, Sparkles];
const scriptSteps = [
  ['opening', 'Abrir la conversación'],
  ['event', 'Explicar el evento'],
  ['impact', 'Conectar con su cartera'],
  ['proposal', 'Presentar la alternativa y sus riesgos'],
  ['closing', 'Escuchar y acordar el siguiente paso'],
] as const;

export default function AgentDetail({ perspective, scenario }: { perspective: Perspective; scenario: Scenario }) {
  const { agents, holdings } = scenario;
  const cash = cashHolding(scenario);
  const rebalance = rebalanceFor(scenario);
  return <>
    <section id="evento" tabIndex={-1} className="panel event-summary">
      <span className="intro-icon"><Globe2 size={24} /></span><div><p className="eyebrow">EL ORIGEN DE LA PROPUESTA</p><h2>{scenario.event.title}</h2><p>{scenario.event.description}</p></div><Badge tone="amber">Fuente: {scenario.event.source} · ficticia</Badge>
    </section>
    <section className="panel padded" aria-label="Datos de entrada del escenario"><SectionTitle eyebrow="FIXTURES · NO SON DATOS DE MERCADO" title="Entradas de la simulación" /><dl className="event-inputs">{Object.entries(scenario.event.inputs).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl></section>
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
        <div className="panel padded"><h3 className="icon-title"><Building2 size={18} />Sensibilidad de instrumentos</h3><div className="sensitivity-list">{holdings.filter((h) => h.id !== 'efectivo').map((h) => <div key={h.id}><span><i className="color-dot" style={{ background: h.color }} /><strong>{h.name}</strong></span><span>{h.sensitivity}</span><p>{h.rationale}</p></div>)}</div><p className="fine-print">Fuente: {scenario.clientId === 'MT-1042' ? 'INSTR-01' : scenario.event.source} · ficticia. Estados financieros, deuda y vencimientos son supuestos; no se consultan emisoras reales.</p></div>
        <div className="panel padded"><h3 className="icon-title"><ShieldCheck size={18} />Perfil y capacidad de rebalanceo</h3><div className="risk-profile"><div><span>Perfil de riesgo</span><strong>{scenario.profile}</strong><Badge tone="green">KYC de ejemplo</Badge></div><div className="risk-scale" role="img" aria-label={`Perfil ${scenario.profile.toLowerCase()}, nivel ${scenario.riskLevel} de 5`}>{[1, 2, 3, 4, 5].map((level) => <i key={level} className={level === scenario.riskLevel ? 'selected' : undefined} />)}</div><div className="scale-labels"><span>Muy conservador</span><span>Dinámico</span></div></div>
          <dl className="data-list"><div><dt>Horizonte patrimonial</dt><dd>{scenario.horizon}</dd></div><div><dt>Efectivo actual</dt><dd>{money(amount(cash.current, scenario.value))}</dd></div><div><dt>Reserva propuesta</dt><dd>{money(amount(cash.proposed, scenario.value))}</dd></div><div><dt>Efectivo para reasignar</dt><dd>{money(rebalance.cashUsed)}</dd></div></dl>
          <div className="small-callout"><ShieldCheck size={17} /><p>La reserva de {cash.proposed}% es un supuesto del caso, no un mínimo regulatorio. No se consulta historial transaccional real ni se acredita capacidad de pérdida.</p></div>
        </div>
      </div>
    </section>
    <section id="sintesis" tabIndex={-1}>
      <SectionTitle eyebrow="SÍNTESIS EXPLICABLE" title="De la causa a la propuesta"/>
      <div className="causal-map">{scenario.causalSteps.map((item, i) => { const Icon = agentIcons[i]; return <div className="causal-step" key={item.title}><span className="causal-icon"><Icon size={21} /></span><span className="eyebrow">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p>{i < 3 && <ArrowRight className="causal-arrow" size={18} />}</div>; })}</div>
      <section className="recommendation"><span className="recommendation-icon"><BrainCircuit size={27} /></span><div><p className="eyebrow">PROPUESTA CONSOLIDADA · DEMO-1</p><h2>Ajustar la distribución. Mantener las metas.</h2><p>{scenario.recommendation} Compras: {money(rebalance.buys)}; ventas: {money(rebalance.sales)}; uso de efectivo: {money(rebalance.cashUsed)}. Reserva final: {money(amount(cash.proposed, scenario.value))}.</p><div className="recommendation-risk"><Info size={15} />{scenario.riskNote}</div></div></section>
      <section className="panel padded advisor-script" aria-labelledby="advisor-script-title">
        <p className="eyebrow">APOYO PARA EL ASESOR · {scenario.client}</p>
        <h2 id="advisor-script-title" className="icon-title"><MessageSquareText size={20} />Guion para conversar con el cliente</h2>
        <p className="body-copy">Ejemplo ficticio para adaptar a la conversación, no un mensaje enviado. Las referencias a ayer y hoy corresponden a la fecha del escenario: {scenario.date}.</p>
        <ol className="advisor-script-steps">{scriptSteps.map(([key, title]) => <li key={key}><h3>{title}</h3><blockquote>{scenario.advisorScript[key]}</blockquote></li>)}</ol>
        <p className="fine-print">Confirma objetivos, liquidez y capacidad de pérdida. No promete resultados, registra consentimiento ni ejecuta operaciones.</p>
      </section>
    </section>
    {perspective === 'tecnica' && <section className="panel padded"><h3 className="icon-title"><FileJson2 size={19} />Salida estructurada · fixture</h3><pre className="json-output">{JSON.stringify({ case_id: scenario.id, client_id: scenario.clientId, source: 'static_fixture', inputs: scenario.event.inputs, dependencies: ['macro', 'instrumentos', 'riesgo'], synthesizer: 'sintesis', proposed_weights: Object.fromEntries(holdings.map((h) => [h.id, h.proposed])), rebalance, execution_enabled: false }, null, 2)}</pre></section>}
    <div className="page-actions"><a className="text-link" href={routeTo('bandeja', scenario.clientId)}>Volver a la bandeja</a><NextLink to="simulador" clientId={scenario.clientId}>Comparar portafolios</NextLink></div>
  </>;
}
