import { ArrowRight, Info, MoveRight } from 'lucide-react';
import { amount, cashHolding, money, rebalanceFor } from '../data/demo.ts';
import { Badge, NextLink, PortfolioCard, SectionTitle } from '../components/Shared.tsx';
import { routeTo } from '../routes.ts';
import type { Scenario } from '../types.ts';

export default function Simulator({ scenario }: { scenario: Scenario }) {
  const { holdings } = scenario;
  const cash = cashHolding(scenario);
  const rebalance = rebalanceFor(scenario);
  const metrics = [
    { label: 'Volatilidad anual supuesta', current: `${scenario.estimatedRisk.current.toFixed(1)}%`, proposed: `${scenario.estimatedRisk.proposed.toFixed(1)}%`, note: 'No calculada por un modelo de riesgo', riskIncreased: scenario.estimatedRisk.proposed > scenario.estimatedRisk.current },
    { label: 'Rendimiento anual supuesto', current: `${scenario.estimatedReturn.current.toFixed(1)}%`, proposed: `${scenario.estimatedReturn.proposed.toFixed(1)}%`, note: 'Hipótesis, no pronóstico ni garantía' },
    { label: 'Reserva de liquidez', current: `${cash.current}%`, proposed: `${cash.proposed}%`, note: 'Supuesto del caso, no umbral regulatorio' },
  ];
  return <>
    <div className="simulation-intro"><div><p className="eyebrow">ANTES Y DESPUÉS</p><h2>El mismo patrimonio. Una asignación diferente.</h2><p className="body-copy">Comparación fija en MXN. No se editan ponderaciones ni se ejecuta un modelo financiero.</p></div><Badge tone="blue">Sin cambios reales</Badge></div>
    <div className="two-columns portfolio-comparison"><PortfolioCard scenario={scenario} /><PortfolioCard scenario={scenario} proposed /></div>
    <div className="metrics-comparison">{metrics.map((metric) => <div className="panel metric-card" key={metric.label}><span>{metric.label}</span><div><span>{metric.current}</span><ArrowRight size={18} /><strong className={metric.riskIncreased ? 'risk-increase' : undefined}>{metric.proposed}</strong></div><p>{metric.note}</p></div>)}</div>
    {holdings.every((holding) => holding.assetClass) && <section className="panel padded" aria-label="Composición y concentración">
      <SectionTitle title="Composición y concentración" />
      <dl className="data-list">{([['debt', 'Renta fija'], ['equity', 'Renta variable'], ['cash', 'Efectivo']] as const).map(([kind, label]) => <div key={kind}><dt>{label} · actual → propuesta</dt><dd>{holdings.filter((h) => h.assetClass === kind).reduce((sum, h) => sum + h.current, 0)}% → {holdings.filter((h) => h.assetClass === kind).reduce((sum, h) => sum + h.proposed, 0)}%</dd></div>)}</dl>
      <div className="table-wrap"><table><caption>Región del emisor y moneda son dimensiones distintas. Ponderaciones sobre el patrimonio total.</caption><thead><tr><th>Instrumento</th><th>Región</th><th>Moneda / cobertura supuesta</th><th>Actual</th><th>Propuesto</th></tr></thead><tbody>{holdings.map((h) => <tr key={h.id}><th>{h.name}</th><td>{h.region}</td><td>{h.currency}</td><td>{h.current}%</td><td>{h.proposed}%</td></tr>)}</tbody></table></div>
      <p className="body-copy">{scenario.riskNote}</p>
    </section>}
    <SectionTitle eyebrow="BORRADOR DE REBALANCEO" title="Movimientos del escenario"><Badge>Sin precios ni cantidades de títulos</Badge></SectionTitle>
    <div className="panel table-wrap"><table><caption className="sr-only">Cambios de asignación propuestos, calculados sobre {money(scenario.value)} MXN</caption><thead><tr><th>Clase / instrumento ilustrativo</th><th>Actual</th><th>Propuesto</th><th>Variación</th><th>Importe MXN</th><th>Acción</th></tr></thead><tbody>{holdings.map((h) => {
      const delta = h.proposed - h.current;
      return <tr key={h.id}><td><div className="instrument-cell"><i className="color-dot" style={{ background: h.color }} /><div><strong>{h.name}</strong><span>{h.instrument}</span></div></div></td><td>{h.current}%</td><td>{h.proposed}%</td><td className={delta > 0 ? 'positive-text' : ''}>{delta > 0 ? '+' : ''}{delta} pp</td><td className="numeric">{delta > 0 ? '+' : delta < 0 ? '−' : ''}{money(Math.abs(amount(delta, scenario.value)))}</td><td><Badge tone={delta > 0 ? 'green' : 'neutral'}>{delta === 0 ? 'Mantener' : h.id === 'efectivo' ? (delta < 0 ? 'Usar efectivo' : 'Aumentar efectivo') : delta > 0 ? 'Comprar' : 'Vender'}</Badge></td></tr>;
    })}</tbody><tfoot><tr><th>Total de asignación</th><td>100%</td><td>100%</td><td>0 pp</td><td>{money(0)}</td><td>Conciliado</td></tr></tfoot></table></div>
    <div className="balance-strip"><span>Ventas <strong>{money(rebalance.sales)}</strong></span><span>+</span><span>Uso de efectivo <strong>{money(rebalance.cashUsed)}</strong></span><MoveRight size={19} /><span>Compras <strong>{money(rebalance.buys)}</strong></span></div>
    <div className="warning-note"><Info size={19} /><p><strong>Alcance del escenario.</strong> No incluye comisiones, impuestos, spreads ni variaciones de precios. Las métricas son supuestos ficticios; no predicen resultados. Los montos no constituyen una boleta ejecutable.</p></div>
    <div className="page-actions"><a className="text-link" href={routeTo('detalle', scenario.clientId, 'sintesis')}>Volver a la síntesis</a><NextLink to="aprobacion" clientId={scenario.clientId}>Revisar propuesta y trazabilidad</NextLink></div>
  </>;
}
