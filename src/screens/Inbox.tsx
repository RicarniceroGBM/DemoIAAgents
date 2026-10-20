import { ArrowRight, BriefcaseBusiness, Check, Clock3, MessageSquareText } from 'lucide-react';
import { clients, demoCase, money } from '../data/demo.ts';
import { Badge, NextLink, SectionTitle } from '../components/Shared.tsx';

export default function Inbox() {
  return <>
    <section className="inbox-intro panel">
      <div className="intro-icon"><BriefcaseBusiness size={26} /></div><div><p className="eyebrow">DE LA SEÑAL A LA CONVERSACIÓN</p><h2>Una oportunidad para acompañar mejor.</h2><p>Banxico · recorte hipotético de 25 pb. Un caso completo y dos perfiles de contexto.</p></div>
      <Badge tone="green">1 propuesta disponible</Badge>
    </section>
    <SectionTitle title="Clientes y oportunidades"><span className="subtle-label">3 perfiles ficticios</span></SectionTitle>
    <div className="panel table-wrap"><table className="clients-table"><caption className="sr-only">Clientes ficticios y estado de su propuesta</caption><thead><tr><th>Cliente / perfil</th><th>Patrimonio MXN</th><th>Evento asociado</th><th>Estado</th><th><span className="sr-only">Acción</span></th></tr></thead>
      <tbody>{clients.map((client) => <tr key={client.id}>
        <td><div className="client-identity"><span className={`avatar ${client.main ? '' : 'avatar-muted'}`}>{client.initials}</span><div><strong>{client.name}</strong><span>{client.profile} · {client.id}</span></div></div></td>
        <td className="numeric">{money(client.value)}</td><td>{client.event}</td><td><Badge tone={client.main ? 'green' : 'neutral'}>{client.main && <Check size={12} />}{client.status}</Badge></td>
        <td>{client.main ? <a href="#/detalle" className="text-link" aria-label={`Ver caso de ${client.name}`}>Ver caso<ArrowRight size={15} /></a> : <span className="subtle-label">Sin detalle</span>}</td>
      </tr>)}</tbody></table></div>
    <div className="two-columns inbox-bottom">
      <section className="panel padded"><SectionTitle eyebrow="PRIORIDAD DEL ESCENARIO" title="Mariana Torres"/><p className="body-copy">El 40% de su cartera está en deuda de corto plazo. Un entorno de tasas menores abre una conversación sobre reinversión, sin perder de vista su liquidez.</p><div className="key-value-grid"><div><span>Objetivo</span><strong>{demoCase.goal}</strong></div><div><span>Horizonte</span><strong>{demoCase.horizon}</strong></div><div><span>Efectivo actual</span><strong>{money(demoCase.available)}</strong></div><div><span>Perfil ilustrativo</span><strong>{demoCase.profile}</strong></div></div><NextLink to="detalle">Abrir análisis multiagente</NextLink></section>
      <section className="panel padded conversation-card"><MessageSquareText size={24} /><p className="eyebrow">PARA INICIAR LA CONVERSACIÓN</p><h2>“¿Qué cambia para tus inversiones cuando bajan las tasas?”</h2><p className="body-copy">Primero explica el contexto. Después, revisa las metas. La propuesta llega al final, no al principio.</p><div className="info-inline"><Clock3 size={16} />Lectura sugerida · sin notificación al cliente</div></section>
    </div>
  </>;
}
