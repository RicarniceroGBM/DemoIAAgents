import { ArrowRight, Info, MoveRight } from 'lucide-react';
import { amount, demoCase, holdings, money, rebalance } from '../data/demo.ts';
import { Badge, NextLink, PortfolioCard, SectionTitle } from '../components/Shared.tsx';

export default function Simulator() {
  const metrics = [
    { label: 'Volatilidad anual supuesta', current: `${demoCase.estimatedRisk.current.toFixed(1)}%`, proposed: `${demoCase.estimatedRisk.proposed.toFixed(1)}%`, note: 'No calculada por un modelo de riesgo' },
    { label: 'Rendimiento anual supuesto', current: `${demoCase.estimatedReturn.current.toFixed(1)}%`, proposed: `${demoCase.estimatedReturn.proposed.toFixed(1)}%`, note: 'Hipótesis, no pronóstico ni garantía' },
    { label: 'Reserva de liquidez', current: '10%', proposed: '5%', note: 'Supuesto del caso, no umbral regulatorio' },
  ];
  return <>
    <div className="simulation-intro"><div><p className="eyebrow">ANTES Y DESPUÉS</p><h2>El mismo patrimonio. Una asignación diferente.</h2><p className="body-copy">Comparación fija en MXN. No se editan ponderaciones ni se ejecuta un modelo financiero.</p></div><Badge tone="blue">Sin cambios reales</Badge></div>
    <div className="two-columns portfolio-comparison"><PortfolioCard /><PortfolioCard proposed /></div>
    <div className="metrics-comparison">{metrics.map((metric) => <div className="panel metric-card" key={metric.label}><span>{metric.label}</span><div><span>{metric.current}</span><ArrowRight size={18} /><strong>{metric.proposed}</strong></div><p>{metric.note}</p></div>)}</div>
    <SectionTitle eyebrow="BORRADOR DE REBALANCEO" title="Movimientos del escenario"><Badge>Sin precios ni cantidades de títulos</Badge></SectionTitle>
    <div className="panel table-wrap"><table><caption className="sr-only">Cambios de asignación propuestos, calculados sobre $2,500,000 MXN</caption><thead><tr><th>Clase / instrumento ilustrativo</th><th>Actual</th><th>Propuesto</th><th>Variación</th><th>Importe MXN</th><th>Acción</th></tr></thead><tbody>{holdings.map((h) => {
      const delta = h.proposed - h.current;
      return <tr key={h.id}><td><div className="instrument-cell"><i className="color-dot" style={{ background: h.color }} /><div><strong>{h.name}</strong><span>{h.instrument}</span></div></div></td><td>{h.current}%</td><td>{h.proposed}%</td><td className={delta > 0 ? 'positive-text' : ''}>{delta > 0 ? '+' : ''}{delta} pp</td><td className="numeric">{delta > 0 ? '+' : delta < 0 ? '−' : ''}{money(Math.abs(amount(delta)))}</td><td><Badge tone={delta > 0 ? 'green' : 'neutral'}>{h.id === 'efectivo' ? 'Usar efectivo' : delta > 0 ? 'Comprar' : delta < 0 ? 'Vender' : 'Mantener'}</Badge></td></tr>;
    })}</tbody><tfoot><tr><th>Total de asignación</th><td>100%</td><td>100%</td><td>0 pp</td><td>{money(0)}</td><td>Conciliado</td></tr></tfoot></table></div>
    <div className="balance-strip"><span>Ventas <strong>{money(rebalance.sales)}</strong></span><span>+</span><span>Uso de efectivo <strong>{money(rebalance.cashUsed)}</strong></span><MoveRight size={19} /><span>Compras <strong>{money(rebalance.buys)}</strong></span></div>
    <div className="warning-note"><Info size={19} /><p><strong>Alcance del escenario.</strong> No incluye comisiones, impuestos, spreads ni variaciones de precios. Las métricas son supuestos ficticios; no predicen resultados. Los montos no constituyen una boleta ejecutable.</p></div>
    <div className="page-actions"><a className="text-link" href="#/detalle/sintesis">Volver a la síntesis</a><NextLink to="aprobacion">Revisar propuesta y trazabilidad</NextLink></div>
  </>;
}
