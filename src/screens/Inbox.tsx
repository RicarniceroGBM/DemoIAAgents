import { ArrowRight, BriefcaseBusiness, Check, Clock3, MessageSquareText } from 'lucide-react';
import { amount, cashHolding, clients, money } from '../data/demo.ts';
import { Badge, NextLink, SectionTitle } from '../components/Shared.tsx';
import { routeTo } from '../routes.ts';
import type { Scenario } from '../types.ts';

export default function Inbox({ scenario }: { scenario?: Scenario }) {
  return <>
    <section className="inbox-intro panel">
      <div className="intro-icon"><BriefcaseBusiness size={26} /></div><div><p className="eyebrow">DE LA SEÑAL A LA CONVERSACIÓN</p><h2>Una oportunidad para acompañar mejor.</h2><p>Tasas, refinación y diversificación regional. Selecciona un cliente para explorar su caso completo.</p></div>
      <Badge tone="green">{clients.length} propuestas disponibles</Badge>
    </section>
    <SectionTitle title="Clientes y oportunidades"><span className="subtle-label">3 perfiles ficticios</span></SectionTitle>
    <div className="panel table-wrap"><table className="clients-table"><caption className="sr-only">Clientes ficticios y estado de su propuesta</caption><thead><tr><th>Cliente / perfil</th><th>Patrimonio MXN</th><th>Evento asociado</th><th>Estado</th><th><span className="sr-only">Acción</span></th></tr></thead>
      <tbody>{clients.map((client) => <tr key={client.id} className={scenario?.clientId === client.id ? 'selected-client' : ''}>
        <td><div className="client-identity"><span className="avatar">{client.initials}</span><div><strong>{client.name}</strong><span>{client.profile} · {client.id}{scenario?.clientId === client.id ? ' · Seleccionado' : ''}</span></div></div></td>
        <td className="numeric">{money(client.value)}</td><td>{client.event}</td><td><Badge tone="green"><Check size={12} />{client.status}</Badge></td>
        <td><a href={routeTo('detalle', client.id)} className="text-link" aria-label={`Ver caso de ${client.name}`}>Ver caso<ArrowRight size={15} /></a></td>
      </tr>)}</tbody></table></div>
    <div className="two-columns inbox-bottom">
      <section className="panel padded"><SectionTitle eyebrow="CLIENTE SELECCIONADO" title={scenario?.client || 'Elige un cliente de la bandeja'} />
        {scenario ? <><p className="body-copy">{scenario.recommendation}</p><div className="key-value-grid"><div><span>Objetivo</span><strong>{scenario.goal}</strong></div><div><span>Horizonte</span><strong>{scenario.horizon}</strong></div><div><span>Efectivo actual</span><strong>{money(amount(cashHolding(scenario).current, scenario.value))}</strong></div><div><span>Perfil ilustrativo</span><strong>{scenario.profile}</strong></div></div><NextLink to="detalle" clientId={scenario.clientId}>Abrir análisis multiagente</NextLink></> : <p className="body-copy">Mariana: perfil moderado y tasas. Carlos: perfil dinámico ante señales contrapuestas. Ana: preservación de capital y diversificación regional. Las tres etapas del caso se habilitan al seleccionar un cliente.</p>}
      </section>
      <section className="panel padded conversation-card"><MessageSquareText size={24} /><p className="eyebrow">PARA INICIAR LA CONVERSACIÓN</p><h2>“{scenario?.conversation || '¿Cómo se conecta cada señal con las metas y el riesgo de cada persona?'}”</h2><p className="body-copy">Primero explica el contexto. Después, revisa las metas. La propuesta llega al final, no al principio.</p><div className="info-inline"><Clock3 size={16} />Lectura sugerida · sin notificación al cliente</div></section>
    </div>
  </>;
}
