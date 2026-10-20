import { Check, CheckCircle2, FileCheck2, MessageSquareText, PencilLine, ShieldCheck, X } from 'lucide-react';
import { amount, demoCase, holdings, money, timeline } from '../data/demo.ts';
import { Badge, SectionTitle } from '../components/Shared.tsx';
import type { Decision } from '../types.ts';

export default function Approval({ onDecision }: { onDecision: (decision: Decision) => void }) {
  return <>
    <div className="approval-state"><span className="approval-state-icon"><FileCheck2 size={26} /></span><div><p className="eyebrow">BORRADOR DE PROPUESTA</p><h2>Lista para una decisión informada.</h2><p>No hay autorización registrada. Explora las acciones sin generar operaciones.</p></div><Badge tone="amber">Pendiente · escenario ficticio</Badge></div>
    <div className="approval-grid">
      <div className="approval-main"><section className="panel padded"><SectionTitle eyebrow="BOLETA ILUSTRATIVA · NO EJECUTABLE" title="Resumen de la propuesta"/><div className="ticket-details"><div><span>Cliente ficticio</span><strong>{demoCase.client}</strong></div><div><span>Referencia</span><strong>{demoCase.id} / DEMO-1</strong></div></div>
        <div className="ticket-movements">{holdings.filter((h) => h.id !== 'efectivo' && h.current !== h.proposed).map((h) => <div key={h.id}><Badge tone={h.proposed > h.current ? 'green' : 'neutral'}>{h.proposed > h.current ? 'Compra' : 'Venta'}</Badge><span>{h.name}</span><strong>{money(Math.abs(amount(h.proposed - h.current)))}</strong></div>)}</div>
        <div className="ticket-total"><span>Efectivo final del escenario</span><strong>{money(demoCase.minimumCash)} MXN</strong></div><p className="fine-print">Sin precios, títulos, vigencia operativa ni confirmación de disponibilidad. No se transmite a ningún intermediario.</p></section>
        <section className="panel padded"><SectionTitle title="Validaciones de ejemplo"/><ul className="validation-list">{[
          ['Asignaciones conciliadas', 'Actual y propuesta suman 100% del mismo patrimonio.'],
          ['Efectivo suficiente', 'Ventas más uso de efectivo cubren las compras del escenario.'],
          ['Reserva del caso preservada', '$125,000 de efectivo; supuesto ilustrativo de 5%.'],
          ['Perfil visible', 'Moderado y horizonte de 5 años; expediente KYC ficticio.'],
        ].map(([title, body]) => <li key={title}><CheckCircle2 size={18} /><div><strong>{title}</strong><p>{body}</p></div></li>)}</ul><div className="small-callout"><ShieldCheck size={18} /><p>Estas validaciones no certifican idoneidad, cumplimiento regulatorio ni autorización del cliente.</p></div></section>
        <section className="panel padded decision-panel"><p className="eyebrow">EL SIGUIENTE PASO ES HUMANO</p><h2>¿Cómo continuarías?</h2><p className="body-copy">Todas las acciones son ilustrativas. No guardan decisiones ni modifican esta línea temporal.</p><div className="decision-buttons"><button className="button button-primary" onClick={() => onDecision('aprobar')}><Check size={17} />Aprobar propuesta</button><button className="button button-secondary" onClick={() => onDecision('modificar')}><PencilLine size={16} />Modificar propuesta</button><button className="button button-secondary" onClick={() => onDecision('revision')}><MessageSquareText size={16} />Solicitar revisión</button><button className="button button-danger" onClick={() => onDecision('rechazar')}><X size={16} />Rechazar propuesta</button></div></section>
      </div>
      <aside className="panel padded trace-panel"><p className="eyebrow">TRAZABILIDAD DEL ESCENARIO</p><h2>Un recorrido visible.</h2><p className="body-copy">Registro predefinido · {demoCase.date}<br />No es una bitácora operativa.</p><ol className="timeline">{timeline.map((item) => <li key={item.time}><span className="timeline-dot"><Check size={10} /></span><time>{item.time}</time><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol><div className="trace-end"><span className="hollow-dot" /><div><strong>Decisión pendiente</strong><p>No hay firma ni consentimiento.</p></div></div><div className="trace-reference">FIXTURE AUDIT-01 · SOLO LECTURA</div></aside>
    </div>
    <div className="page-actions"><a className="text-link" href="#/simulador">Volver a la comparación</a><a className="text-link" href="#/eventos">Volver al centro de eventos</a></div>
  </>;
}
