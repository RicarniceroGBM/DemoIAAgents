import type { Agent, Client, ClientId, Decision, Holding, MarketEvent, Perspective, PerspectiveCopy, Scenario, Screen } from '../types.ts';

export const screenList: { id: Screen; label: string; short: string; eyebrow: string; description: string }[] = [
  { id: 'eventos', label: 'Centro de eventos', short: 'Eventos', eyebrow: 'INTELIGENCIA DE MERCADO', description: 'Del contexto de mercado a la oportunidad de cada cliente.' },
  { id: 'bandeja', label: 'Bandeja del asesor', short: 'Bandeja', eyebrow: 'GESTIÓN PATRIMONIAL', description: 'Prioriza conversaciones que pueden hacer una diferencia.' },
  { id: 'detalle', label: 'Detalle multiagente', short: 'Análisis', eyebrow: 'INTELIGENCIA COLABORATIVA', description: 'Cuatro especialidades. Una recomendación conectada.' },
  { id: 'simulador', label: 'Simulador de rebalanceo', short: 'Simulador', eyebrow: 'ESCENARIO ILUSTRATIVO', description: 'Una propuesta clara, antes de tomar cualquier decisión.' },
  { id: 'aprobacion', label: 'Aprobación y trazabilidad', short: 'Decisión', eyebrow: 'DECISIÓN INFORMADA', description: 'La inteligencia propone. Las personas deciden.' },
];

export const demoCase = {
  id: 'NX-2026-042',
  date: '22 oct 2026',
  client: 'Mariana Torres',
  value: 2_500_000,
  profile: 'Moderado',
  goal: 'Crecimiento patrimonial',
  horizon: '5 años',
  available: 250_000,
  minimumCash: 125_000,
  currentRate: 7.5,
  proposedRate: 7.25,
  cutBasisPoints: 25,
  estimatedRisk: { current: 8.4, proposed: 7.8 },
  estimatedReturn: { current: 8.1, proposed: 8.3 },
};

export const marketEvents: MarketEvent[] = [
  {
    id: 'banxico', category: 'Política monetaria', institution: 'BANXICO',
    title: 'Banxico recorta la tasa de referencia en 25 pb',
    description: 'Un nuevo escenario para la renta fija y los activos sensibles a tasas. Identificamos su posible impacto en cada portafolio.',
    time: 'Hace 12 min', impact: 'Impacto alto', tone: 'green', featured: true,
    tags: ['Renta fija', 'Fibras', 'Deuda corporativa'],
  },
  {
    id: 'petroleo', category: 'Energía y geopolítica', institution: 'ESCENARIO ENERGÉTICO',
    title: 'El crudo se dispara ante el escalamiento del conflicto con Irán',
    description: 'En este escenario ficticio, el crudo sube de USD 75 a USD 90 por barril tras una escalada de tensiones con Irán. El choque eleva la incertidumbre sobre suministro, inflación y márgenes del sector energético.',
    time: '22 oct 2026', impact: 'Riesgo elevado', tone: 'amber', featured: false,
    tags: ['Energía', 'Irán', 'Crudo', 'Suministro'],
  },
  {
    id: 'deuda-global', category: 'Renta fija global', institution: 'MERCADOS DE DEUDA',
    title: 'Los mercados de deuda muestran diferencias entre regiones',
    description: 'Escenario ficticio de condiciones de tasas y riesgos soberanos distintos en EUA, México y otros mercados desarrollados. La región del emisor, la duración y la moneda son dimensiones diferentes del riesgo en renta fija.',
    time: '22 oct 2026', impact: 'En observación', tone: 'blue', featured: false,
    tags: ['Renta fija', 'Tasas', 'Deuda soberana', 'Regiones'],
  },
  {
    id: 'fed', category: 'Política monetaria', institution: 'RESERVA FEDERAL',
    title: 'La FED mantiene su postura de cautela',
    description: 'El escenario de tasas estables invita a revisar la exposición a deuda en dólares.',
    time: 'Hace 48 min', impact: 'Impacto medio', tone: 'amber', featured: false,
    tags: ['ETF', 'Deuda USD'],
  },
  {
    id: 'inflacion', category: 'Inflación', institution: 'INFLACIÓN MX',
    title: 'La inflación subyacente modera su avance',
    description: 'Una lectura de ejemplo que abre la conversación sobre poder adquisitivo y duración.',
    time: 'Hace 2 h', impact: 'Impacto medio', tone: 'blue', featured: false,
    tags: ['Udibonos', 'Consumo'],
  },
  {
    id: 'divisas', category: 'Divisas', institution: 'TIPO DE CAMBIO',
    title: 'El peso presenta mayor volatilidad',
    description: 'Movimiento hipotético que destaca la importancia de diversificar la exposición cambiaria.',
    time: 'Hace 3 h', impact: 'En observación', tone: 'neutral', featured: false,
    tags: ['USD / MXN', 'Diversificación'],
  },
];

export const agents: Agent[] = [
  { id: 'macro', number: '01', name: 'Analista macroeconómico', role: 'Lee el contexto', tool: 'macro_snapshot.mock', result: 'Sesgo monetario expansivo; menor tasa de reinversión y posible apoyo a activos de mayor duración.', duration: '2.4 s' },
  { id: 'instrumentos', number: '02', name: 'Analista de instrumentos', role: 'Conecta los activos', tool: 'instrument_matrix.mock', result: 'Renta fija de mediano plazo y Fibras con sensibilidad favorable; revisar riesgo de crédito y valuación.', duration: '3.1 s' },
  { id: 'riesgo', number: '03', name: 'Evaluador de riesgo y perfil', role: 'Entiende al cliente', tool: 'portfolio_kyc.mock', result: 'Perfil moderado, horizonte de 5 años y $250,000 de efectivo. Reserva objetivo: $125,000.', duration: '1.8 s' },
  { id: 'sintesis', number: '04', name: 'Asesor sintetizador', role: 'Construye la propuesta', tool: 'recommendation.mock', result: 'Reducir deuda de corto plazo y efectivo para aumentar mediano plazo y Fibras, sin cambiar renta variable.', duration: '2.2 s' },
];

export const holdings: Holding[] = [
  { id: 'corto', name: 'Deuda de corto plazo', instrument: 'CETES · canasta ilustrativa', color: '#254a52', current: 40, proposed: 30, sensitivity: 'Menor reinversión', rationale: 'Reducir la exposición a reinvertir a tasas menores.' },
  { id: 'medio', name: 'Deuda de mediano plazo', instrument: 'Bonos M · canasta ilustrativa', color: '#56968a', current: 20, proposed: 30, sensitivity: 'Favorable / duración', rationale: 'Aumentar duración de forma acotada; los precios pueden fluctuar.' },
  { id: 'acciones', name: 'Acciones y ETF', instrument: 'Canasta MX + ETF global', color: '#8bbcac', current: 25, proposed: 25, sensitivity: 'Mixta / mercado', rationale: 'Mantener la diversificación; no atribuir toda la variación a tasas.' },
  { id: 'fibras', name: 'Fibras', instrument: 'Canasta inmobiliaria ficticia', color: '#b7cba9', current: 5, proposed: 10, sensitivity: 'Favorable / financiamiento', rationale: 'Aumento limitado; persisten riesgos de ocupación y refinanciamiento.' },
  { id: 'efectivo', name: 'Efectivo', instrument: 'Saldo disponible MXN', color: '#d9e1e0', current: 10, proposed: 5, sensitivity: 'Liquidez', rationale: 'Conservar $125,000 como reserva del escenario, no como regla regulatoria.' },
];

export const timeline = [
  { time: '09:00:00', title: 'Evento identificado', body: 'Se incorpora el comunicado ficticio de Banxico. Fuente: fixture MACRO-01.' },
  { time: '09:00:02', title: 'Análisis especializados completados', body: 'Salidas predefinidas de macro, instrumentos y perfil vinculadas al caso.' },
  { time: '09:00:06', title: 'Propuesta sintetizada', body: 'Se registra el borrador ilustrativo de asignación. Versión DEMO-1.' },
  { time: '09:00:08', title: 'Validaciones de ejemplo revisadas', body: 'Consistencia de montos, reserva y perfil del escenario. Sin certificación regulatoria.' },
];

export const decisionCopy: Record<Decision, { title: string; body: string; label: string }> = {
  aprobar: { title: 'Aprobación ilustrativa', body: 'En una plataforma productiva, este paso requeriría consentimiento y validaciones adicionales. Esta demo no registra una autorización, no envía órdenes y no cambia la cartera.', label: 'Aprobar propuesta' },
  modificar: { title: 'Modificación ilustrativa', body: 'La edición de ponderaciones no está incluida en este prototipo visual. Puedes volver al simulador para consultar la comparación fija, sin modificar el escenario.', label: 'Modificar propuesta' },
  rechazar: { title: 'Rechazo ilustrativo', body: 'En un entorno real se documentaría el motivo del rechazo. Aquí no se guarda una decisión ni se modifica la trazabilidad del caso.', label: 'Rechazar propuesta' },
  revision: { title: 'Solicitud de revisión ilustrativa', body: 'Este paso mostraría una derivación al asesor. La demo no envía notificaciones ni abre solicitudes reales; todos los datos permanecen sin cambios.', label: 'Solicitar revisión' },
};

export const perspectives: Record<Perspective, PerspectiveCopy> = {
  asesor: {
    label: 'Vista asesor', role: 'Asesor patrimonial', description: 'Evidencia para una mejor conversación',
    screens: {
      eventos: { title: 'Una señal de mercado. Una conversación oportuna.', body: 'El recorte hipotético de Banxico conecta el contexto macro con la cartera de Mariana. Revisa la propuesta antes de conversar con ella.', points: ['Caso listo para revisión', 'Talking points disponibles', 'Sin operaciones automáticas'] },
      bandeja: { title: 'Prioriza a Mariana Torres', body: 'Su cartera mantiene 40% en deuda de corto plazo. La conversación se centra en el riesgo de reinversión y la reserva de liquidez.', points: ['Patrimonio: $2.5 M MXN', 'Horizonte: 5 años', 'Perfil moderado'] },
      detalle: { title: 'Tu argumento, de principio a fin', body: 'Explica que el recorte no obliga a operar: abre la oportunidad de revisar duración y Fibras, conservando la diversificación y una reserva.', points: ['Hablar de reinversión', 'Explicar riesgo de duración', 'Confirmar necesidades de liquidez'] },
      simulador: { title: 'Una comparación para conversar', body: 'La propuesta desplaza $250,000 de corto a mediano plazo y $125,000 de efectivo a Fibras. Es un borrador, no una instrucción de operación.', points: ['Compras: $375,000', 'Ventas: $250,000', 'Uso de efectivo: $125,000'] },
      aprobacion: { title: 'Borrador listo, decisión pendiente', body: 'Antes de una operación real sería necesario confirmar perfil, precios, consentimiento y condiciones de ejecución con el cliente.', points: ['Boleta sin precios ni títulos', 'No ejecutable', 'Sin consentimiento registrado'] },
    },
  },
  cliente: {
    label: 'Vista cliente', role: 'Experiencia del cliente', description: 'Lo que significa para tu patrimonio',
    screens: {
      eventos: { title: 'Las tasas cambian. Tus metas siguen al centro.', body: 'Cuando baja la tasa de referencia, parte de tu ahorro podría generar menos al reinvertirse. Te mostramos una alternativa para revisar con tu asesor.', points: ['Entiende el cambio', 'Conoce el impacto', 'Tú decides'] },
      bandeja: { title: 'Una propuesta pensada para Mariana', body: 'Este ejemplo usa un patrimonio de $2.5 millones y una meta de crecimiento a cinco años. No utiliza información personal real.', points: ['Datos ficticios', 'Sin acceso a cuentas', 'Sin permisos de operación'] },
      detalle: { title: 'Por qué se sugiere este cambio', body: 'Cuatro análisis de ejemplo conectan el recorte con tus inversiones, tu tolerancia al riesgo y el dinero que necesitas mantener disponible.', points: ['No necesitas actuar de inmediato', 'Hay riesgos de mercado', 'Consulta a tu asesor'] },
      simulador: { title: 'Así se vería el cambio en tu cartera', body: 'Tu patrimonio total se mantiene en $2.5 millones. Cambia la distribución y se conservan $125,000 disponibles. Las cifras futuras no están garantizadas.', points: ['Mismo patrimonio inicial', 'Reserva: $125,000', 'Comparación fija'] },
      aprobacion: { title: 'La última palabra es tuya', body: 'Puedes explorar qué significaría aprobar, modificar o rechazar. Ninguno de estos botones mueve tu dinero ni registra una autorización.', points: ['Sin compromiso', 'Sin movimientos reales', 'Decisión solo ilustrativa'] },
    },
  },
  tecnica: {
    label: 'Vista técnica', role: 'Arquitectura multiagente', description: 'Orquestación explicable, sin ejecución real',
    screens: {
      eventos: { title: 'Entrada estructurada: macro_event', body: 'Fixture MACRO-01 → normalización predefinida → asociación con el caso NX-2026-042. No existe ingesta de mercado ni un modelo conectado.', points: ['source: fixture', 'delta_bps: -25', 'currency: MXN'] },
      bandeja: { title: 'Asociación de caso y perfil', body: 'Tres clientes se enlazan con sus escenarios mediante identificadores locales validados en la URL. Cada caso tiene entradas y salidas predefinidas, sin pipeline ejecutándose.', points: ['cases: 3', 'selection: URL', 'execution: mocked'] },
      detalle: { title: 'Tres análisis → una síntesis', body: 'Las salidas de macro, instrumentos y riesgo alimentan la síntesis. Las herramientas .mock y sus duraciones son datos estáticos, no llamadas reales.', points: ['Entradas tipadas', 'Sin inferencia LLM', 'Sin backend'] },
      simulador: { title: 'Comparación determinista de fixtures', body: 'Los importes se obtienen de patrimonio × ponderación / 100. Riesgo y rendimiento son supuestos estáticos, sin optimizador ni modelo predictivo.', points: ['allocation_total: 100%', 'portfolio_value: 2500000', 'optimizer: none'] },
      aprobacion: { title: 'Interfaz sin command handler operativo', body: 'Las acciones abren diálogos locales. No hay endpoint de órdenes, escritura de decisiones ni mutación del registro de trazabilidad.', points: ['orders: disabled', 'audit: static fixture', 'decision_storage: none'] },
    },
  },
  control: {
    label: 'Vista control', role: 'Control y trazabilidad', description: 'Evidencia visible y límites explícitos',
    screens: {
      eventos: { title: 'Origen identificado, no verificado en producción', body: 'Los eventos son ficticios y no provienen de comunicados reales. No se presenta la fecha del escenario como una observación vigente de mercado.', points: ['Fuente simulada', 'Sin datos personales', 'Sin monitoreo real'] },
      bandeja: { title: 'Perfil ilustrativo, no KYC certificado', body: 'Nombre, patrimonio y perfil son ficticios. No se consulta información transaccional ni se certifica la vigencia de un expediente de cliente.', points: ['KYC de ejemplo', 'Sin consulta a sistemas', 'Sin datos sensibles reales'] },
      detalle: { title: 'Trazar la causa no elimina el riesgo', body: 'Cada hallazgo tiene una fuente de ejemplo. La síntesis debe entenderse como material demostrativo y no como dictamen de idoneidad.', points: ['Evidencia simulada', 'Supuestos visibles', 'Supervisión humana conceptual'] },
      simulador: { title: 'Validaciones de consistencia, no regulatorias', body: 'Se revisan sumas, balance de efectivo y reserva del caso. No se modelan comisiones, impuestos, spreads, precios ni disponibilidad de instrumentos.', points: ['Reserva del caso: 5%', 'Sin costos de ejecución', 'No certifica cumplimiento'] },
      aprobacion: { title: 'Sin autorización ni registro operativo', body: 'La línea temporal es predefinida. Los botones no agregan eventos ni acreditan consentimiento, firma, auditoría inmutable o revisión regulatoria.', points: ['Trazabilidad ficticia', 'No hay firma', 'No hay envío de órdenes'] },
    },
  },
};

export const money = (value: number) => new Intl.NumberFormat('es-MX', {
  style: 'currency', currency: 'MXN', maximumFractionDigits: 0,
}).format(value);

export const amount = (weight: number, value = demoCase.value) => value * weight / 100;
export const isScreen = (value: unknown): value is Screen => screenList.some((screen) => screen.id === value);
export const isPerspective = (value: unknown): value is Perspective =>
  typeof value === 'string' && Object.hasOwn(perspectives, value);

const carlosHoldings: Holding[] = [
  { id: 'refinadora', name: 'Refinadora Horizonte', instrument: 'Emisora ficticia de refinación · no extracción', color: '#254a52', current: 15, proposed: 20, assetClass: 'equity', region: 'EUA', currency: 'USD sin cobertura', sensitivity: 'Márgenes y suministro', rationale: 'Aumentar solo bajo el supuesto de márgenes resistentes; el crudo caro no garantiza mejores resultados.' },
  { id: 'global', name: 'Acciones globales diversificadas', instrument: 'Canasta ficticia que excluye Refinadora Horizonte', color: '#56968a', current: 40, proposed: 45, assetClass: 'equity', region: 'Global', currency: 'Multimoneda sin cobertura', sensitivity: 'Volatilidad de mercado', rationale: 'Diversificar la exposición accionaria; la canasta excluye la posición directa en la refinadora.' },
  { id: 'local', name: 'Deuda gubernamental local', instrument: 'Canasta soberana MX ilustrativa', color: '#8bbcac', current: 20, proposed: 15, assetClass: 'debt', region: 'México', currency: 'MXN', sensitivity: 'Tasas locales', rationale: 'Financiar parte del aumento accionario, aceptando una menor proporción defensiva.' },
  { id: 'deuda-global', name: 'Deuda global de alta calidad', instrument: 'Canasta ficticia de grado de inversión', color: '#b7cba9', current: 15, proposed: 10, assetClass: 'debt', region: 'Global', currency: 'Multimoneda; cobertura MXN supuesta', sensitivity: 'Crédito, tasas y cobertura', rationale: 'Reducir cinco puntos para financiar renta variable; permanecen riesgos de crédito y cobertura.' },
  { id: 'efectivo', name: 'Efectivo', instrument: 'Saldo disponible MXN', color: '#d9e1e0', current: 10, proposed: 10, assetClass: 'cash', region: 'México', currency: 'MXN', sensitivity: 'Liquidez', rationale: 'Mantener la reserva de 10% sin financiar compras con efectivo.' },
];

const anaHoldings: Holding[] = [
  { id: 'eua', name: 'Deuda de EUA', instrument: 'Canasta soberana estadounidense · duración corta', color: '#254a52', current: 95, proposed: 60, assetClass: 'debt', region: 'EUA', currency: 'USD; cobertura MXN supuesta', sensitivity: 'Concentración regional y tasas', rationale: 'Reducir la concentración en un solo país, conservando deuda de alta calidad y duración corta.' },
  { id: 'mexico', name: 'Deuda gubernamental mexicana', instrument: 'Canasta soberana MX · duración corta', color: '#56968a', current: 0, proposed: 20, assetClass: 'debt', region: 'México', currency: 'MXN', sensitivity: 'Tasas y riesgo soberano local', rationale: 'Incorporar deuda local; diversificar no elimina el riesgo soberano ni de tasas.' },
  { id: 'desarrollados', name: 'Deuda desarrollada excluyendo EUA', instrument: 'Canasta soberana ficticia · alta calidad y duración corta', color: '#8bbcac', current: 0, proposed: 15, assetClass: 'debt', region: 'Desarrollados excl. EUA', currency: 'EUR y JPY; cobertura MXN supuesta', sensitivity: 'Tasas, regiones y cobertura', rationale: 'Añadir otras regiones sin acciones ni deuda de alto rendimiento. La cobertura tiene costos y riesgo residual.' },
  { id: 'efectivo', name: 'Efectivo', instrument: 'Saldo disponible MXN', color: '#d9e1e0', current: 5, proposed: 5, assetClass: 'cash', region: 'México', currency: 'MXN', sensitivity: 'Liquidez', rationale: 'Conservar la reserva de 5% del caso; no es un mínimo regulatorio.' },
];

function scenarioAgents(results: [string, string, string, string]): Agent[] {
  return agents.map((agent, index) => ({ ...agent, result: results[index] }));
}

function scenarioTimeline(source: string, summary: string): Scenario['timeline'] {
  return [
    { time: '09:00:00', title: 'Entradas del caso identificadas', body: `Fuentes ficticias: ${source}. No hay ingesta de datos reales.` },
    { time: '09:00:02', title: 'Análisis especializados completados', body: 'Salidas predefinidas de macro, instrumentos y perfil del cliente de este caso.' },
    { time: '09:00:06', title: 'Propuesta sintetizada', body: `${summary} Versión DEMO-1; no es una operación.` },
    { time: '09:00:08', title: 'Validaciones de ejemplo revisadas', body: 'Asignación, patrimonio y reserva conciliados. Sin certificación regulatoria ni consentimiento.' },
  ];
}

export const cases: Record<ClientId, Scenario> = {
  'MT-1042': {
    ...demoCase, eventId: 'banxico', clientId: 'MT-1042', initials: 'MT', riskLevel: 3, holdings, agents, timeline,
    event: {
      title: 'Banxico: un recorte hipotético de 25 pb',
      description: 'Tasa de referencia del escenario: 7.50% → 7.25%. Menor costo de financiamiento, con efectos distintos según el activo.',
      source: 'MACRO-01',
      inputs: { scenario_date: '2026-10-22', previous_rate_pct: 7.5, reference_rate_pct: 7.25, cut_basis_points: 25 },
    },
    causalSteps: [
      { title: 'Baja la tasa', text: 'Recorte ficticio de 25 pb en la referencia de Banxico.' },
      { title: 'Cambia el escenario', text: 'Menor reinversión a corto plazo; posible apoyo a duración y Fibras.' },
      { title: 'Se cruza con el perfil', text: 'Cartera moderada, horizonte de 5 años y reserva de liquidez.' },
      { title: 'Se propone un ajuste', text: 'Más mediano plazo y Fibras, sin cambiar acciones y ETF.' },
    ],
    recommendation: 'Reducir deuda de corto plazo y efectivo para aumentar mediano plazo y Fibras, manteniendo acciones y ETF.',
    riskNote: 'Los beneficios no están garantizados. Mayor duración también implica sensibilidad si las tasas suben.',
    conversation: '¿Qué cambia para tus inversiones cuando bajan las tasas?',
    advisorScript: {
      opening: 'Hola Mariana, ¿cómo estás? ¿Tienes unos minutos para que revisemos qué significa el cambio de tasas para tus inversiones?',
      event: 'En este escenario, Banxico acaba de bajar la tasa de 7.50% a 7.25%. Eso puede hacer que, al vencer tus inversiones de corto plazo, tengas que reinvertir a una tasa menor.',
      impact: 'Hoy tienes 40% de tu cartera en deuda de corto plazo. No significa que debamos mover todo: queremos revisar cómo seguir buscando crecimiento a cinco años, sin perder de vista el dinero que necesitas disponible.',
      proposal: 'Te propongo comparar una alternativa: bajar deuda de corto plazo de 40% a 30%, subir mediano plazo de 20% a 30% y Fibras de 5% a 10%, usando parte del efectivo, que pasaría de 10% a 5%. Mantendríamos acciones y ETF sin cambios. No hay rendimientos garantizados: aumentar duración también puede generar pérdidas si las tasas suben, y las Fibras conservan riesgos de ocupación y financiamiento.',
      closing: 'Antes de considerar cualquier movimiento, ¿han cambiado tus metas o tus necesidades de liquidez? Podemos revisar juntos la comparación y sus riesgos, o mantener la cartera actual. Esta conversación no autoriza ninguna operación.',
    },
    auditSource: 'AUDIT-01',
  },
  'CL-2086': {
    id: 'NX-2026-043', eventId: 'petroleo', clientId: 'CL-2086', initials: 'CL', date: '22 oct 2026', client: 'Carlos López',
    value: 1_800_000, profile: 'Dinámico', riskLevel: 5, goal: 'Crecimiento con alta tolerancia al riesgo', horizon: '7 años',
    estimatedRisk: { current: 14.2, proposed: 17.1 }, estimatedReturn: { current: 9.2, proposed: 10.1 },
    event: {
      title: 'Refinadora Horizonte: resultados sólidos y tensión con Irán',
      description: 'El reporte ficticio del 20 oct supera el consenso. Ayer, 21 oct 2026, una nota ficticia señaló escalamiento del conflicto con Irán; hoy, 22 oct, el crudo salta de USD 75 a USD 90 (+20%). Un supuesto posterior de márgenes resistentes permite ilustrar una mayor exposición, sin garantizarla.',
      source: 'ENERGY-01 · REPORT-CL-01 · MARGIN-CL-01',
      inputs: {
        report_date: '2026-10-20', eps_actual_usd: 2.4, eps_consensus_usd: 2,
        conflict_news_date: '2026-10-21', scenario_date: '2026-10-22',
        oil_previous_usd_per_barrel: 75, oil_scenario_usd_per_barrel: 90,
        refining_margin_before_usd_per_barrel: 18, refining_margin_assumed_after_usd_per_barrel: 19,
        margin_assumption_date: '2026-10-22',
        margin_basis: 'Supuesto: el precio de productos refinados compensa el mayor costo del crudo. No es un dato observado.',
      },
    },
    holdings: carlosHoldings,
    agents: scenarioAgents([
      'Nota ENERGY-01 del 21 oct: escalamiento ficticio con Irán. El 22 oct el crudo pasa de USD 75 a 90 (+20%); aumentan incertidumbre e interrupciones potenciales.',
      'REPORT-CL-01: utilidad por acción USD 2.40 frente a consenso USD 2.00. MARGIN-CL-01 supone margen posterior de USD 19/barril frente a 18; no se deduce del reporte histórico ni del crudo caro.',
      'Perfil dinámico y alta tolerancia al riesgo; esto no acredita capacidad para absorber pérdidas. Renta variable 55% → 65%; refinadora 15% → 20%, tope del fixture, no límite regulatorio.',
      'Aumentar cinco puntos en refinadora y cinco en acciones globales, financiados con reducciones de cinco puntos en cada canasta de deuda. Conservar efectivo 10%; riesgo supuesto mayor.',
    ]),
    causalSteps: [
      { title: 'Dos señales contrapuestas', text: 'Reporte superior al consenso frente al escalamiento con Irán y al crudo +20%.' },
      { title: 'Márgenes bajo supuesto', text: 'El margen de refinación resistente se añade como hipótesis, no como efecto automático del petróleo.' },
      { title: 'Perfil dinámico', text: 'Carlos acepta volatilidad; tolerancia no equivale a capacidad de pérdida certificada.' },
      { title: 'Más exposición accionaria', text: 'Renta variable 55% → 65%; la refinadora concentra 20% y aumenta el riesgo.' },
    ],
    recommendation: 'Aumentar la refinadora y las acciones globales cinco puntos cada una, reduciendo cinco puntos en cada canasta de deuda. La canasta global excluye a Refinadora Horizonte.',
    riskNote: 'Mayor riesgo, no menor: volatilidad anual supuesta 14.2% → 17.1%. Concentrar 20% en una emisora puede causar pérdidas importantes. Si fallan los márgenes supuestos o se interrumpe el suministro, la tesis debe revisarse. Sin garantía ni cobertura cambiaria en acciones.',
    conversation: '¿Cuánta volatilidad aceptarías si los buenos resultados conviven con un choque geopolítico?',
    advisorScript: {
      opening: 'Hola Carlos, ¿cómo estás? ¿Viste la noticia de ayer sobre el conflicto con Irán? Te quería comentar cómo se conecta con Refinadora Horizonte, que tienes en tu portafolio. ¿Tienes unos minutos?',
      event: 'Hay dos noticias que conviene separar: la refinadora reportó por encima de lo esperado el 20 de octubre; ayer, 21 de octubre, se intensificó el conflicto con Irán y hoy, 22 de octubre, el crudo subió de 75 a 90 dólares por barril. Estas fechas corresponden al escenario ficticio, no a noticias actuales.',
      impact: 'La refinadora representa 15% de tu cartera. Que suba el petróleo no garantiza que le vaya mejor: también encarece su materia prima. Lo importante es cuánto gana entre comprar crudo y vender productos refinados, y si puede mantener el suministro. En esta simulación suponemos que ese margen resiste, pero no es un resultado observado ni una garantía.',
      proposal: 'Como te interesa asumir riesgo para buscar crecimiento, podemos evaluar subir la refinadora de 15% a 20% y las acciones globales de 40% a 45%, bajando cinco puntos en cada canasta de deuda y conservando 10% de efectivo. Las acciones globales excluyen esta refinadora. Es una alternativa más arriesgada: la renta variable subiría de 55% a 65% y una sola emisora concentraría 20%. Si fallan los márgenes o se interrumpe el suministro, podrías enfrentar pérdidas importantes; no compraríamos solo porque subió el crudo.',
      closing: '¿Sigues cómodo con esa posibilidad de pérdida y sin necesitar ese dinero en el corto plazo? Antes de decidir, revisemos la simulación, tu capacidad para absorber pérdidas y qué haríamos si cambia el escenario. También podemos mantener la asignación actual. Esta conversación no autoriza ninguna operación.',
    },
    auditSource: 'AUDIT-CL-01',
    timeline: scenarioTimeline('REPORT-CL-01 (20 oct), ENERGY-01 (21–22 oct), MARGIN-CL-01 (22 oct)', 'Borrador condicionado a márgenes ficticios resistentes y perfil dinámico.'),
  },
  'AG-3108': {
    id: 'NX-2026-044', eventId: 'deuda-global', clientId: 'AG-3108', initials: 'AG', date: '22 oct 2026', client: 'Ana García',
    value: 4_200_000, profile: 'Muy conservador', riskLevel: 1, goal: 'Preservación de capital', horizon: '3 años',
    estimatedRisk: { current: 3.2, proposed: 3.2 }, estimatedReturn: { current: 4.1, proposed: 4.1 },
    event: {
      title: 'Ana: renta fija conservadora con concentración regional',
      description: 'Revisión ficticia del 22 oct 2026: 95% del patrimonio está en deuda de EUA y 5% en efectivo. Se propone diversificar emisores por región conservando 95% en deuda de alta calidad y duración corta, sin añadir acciones.',
      source: 'PORTFOLIO-AG-01 · REGIONS-AG-01',
      inputs: { scenario_date: '2026-10-22', debt_weight_pct: 95, us_debt_current_pct: 95, us_debt_proposed_pct: 60, mexico_debt_proposed_pct: 20, developed_ex_us_debt_proposed_pct: 15, cash_pct: 5, duration_assumption: 'Corta: hasta 2 años en las canastas de deuda', fx_assumption: 'Cobertura a MXN supuesta en deuda extranjera; costos excluidos y riesgo residual presente' },
    },
    holdings: anaHoldings,
    agents: scenarioAgents([
      'La revisión REGIONS-AG-01 identifica deuda de un solo país: EUA 95% del patrimonio. La concentración regional es distinta de la clase de activo y de la moneda.',
      'Deuda soberana ficticia de alta calidad y duración hasta 2 años. Añadir México y mercados desarrollados excluyendo EUA; no añadir acciones ni deuda de alto rendimiento.',
      'Perfil muy conservador, preservación de capital y horizonte de 3 años. Deuda total 95% antes y después; efectivo 5% constante. Cobertura a MXN supuesta, con riesgo residual.',
      'Reducir deuda EUA a 60%; añadir 20% de deuda mexicana y 15% de deuda desarrollada excluyendo EUA. Mantener liquidez y priorizar regiones, no mayor riesgo o rendimiento prometido.',
    ]),
    causalSteps: [
      { title: 'Detectar concentración', text: '95% del patrimonio en deuda de EUA, aunque la clase de activo sea conservadora.' },
      { title: 'Separar región y moneda', text: 'La cobertura cambiaria no cambia el país del emisor ni elimina todos los riesgos.' },
      { title: 'Preservar el perfil', text: 'Mantener deuda de alta calidad, duración corta y 5% de efectivo; sin acciones.' },
      { title: 'Diversificar regiones', text: 'Deuda EUA 60%, México 20% y desarrollados excluyendo EUA 15%.' },
    ],
    recommendation: 'Diversificar regiones dentro de renta fija: reducir deuda EUA y añadir deuda gubernamental mexicana y desarrollada excluyendo EUA. Mantener 95% en deuda y 5% en efectivo.',
    riskNote: 'Diversificar no elimina riesgo de tasas, crédito o pérdidas de capital. Cobertura a MXN supuesta para deuda extranjera: persisten riesgo de base, contraparte y costos de renovación. Los costos no se descuentan en esta comparación; no se promete menor volatilidad.',
    conversation: '¿Tu cartera puede ser conservadora y aun así depender demasiado de un solo país?',
    advisorScript: {
      opening: 'Hola Ana, ¿cómo estás? Quería proponerte una revisión tranquila de tu cartera, pensando en tu prioridad de preservar el capital. ¿Te parece si lo vemos juntas?',
      event: 'Las condiciones de tasas y los riesgos de los mercados de deuda pueden ser distintos entre EUA, México y otros países desarrollados. No te llamo por una emergencia ni por una noticia específica de tu cuenta; es una oportunidad para revisar de qué regiones depende tu ahorro.',
      impact: 'Aunque tu cartera es conservadora por estar casi toda en renta fija, 95% de tu patrimonio está en deuda de EUA. Eso concentra la exposición en un país. Tener cobertura de moneda no cambia el país del emisor ni elimina todos los riesgos.',
      proposal: 'La alternativa es mantener 95% en deuda de alta calidad y duración corta, sin añadir acciones: deuda de EUA bajaría de 95% a 60%, incorporaríamos 20% en deuda gubernamental mexicana y 15% en otros mercados desarrollados. Conservaríamos el 5% de efectivo. La cobertura a pesos de la deuda extranjera es un supuesto de esta simulación; tiene costos no incluidos y riesgos residuales. Diversificar no garantiza el capital ni elimina riesgos de tasas o crédito.',
      closing: '¿Siguen siendo tu prioridad la preservación del capital y tener ese efectivo disponible? Revisemos con calma costos, cobertura y riesgos antes de decidir; también podemos mantener la cartera actual. Esta conversación no autoriza ninguna operación.',
    },
    auditSource: 'AUDIT-AG-01',
    timeline: scenarioTimeline('PORTFOLIO-AG-01 · REGIONS-AG-01', 'Borrador de diversificación regional, sin incorporar renta variable.'),
  },
};

export const clients: Client[] = Object.values(cases).map((scenario) => ({
  id: scenario.clientId, name: scenario.client, initials: scenario.initials, profile: scenario.profile,
  value: scenario.value, event: scenario.event.title, status: 'Propuesta lista',
}));

export const isClientId = (value: unknown): value is ClientId =>
  typeof value === 'string' && Object.hasOwn(cases, value);

export function cashHolding(scenario: Scenario) {
  return scenario.holdings.find((holding) => holding.id === 'efectivo')!;
}

export function rebalanceFor(scenario: Scenario) {
  const assets = scenario.holdings.filter((holding) => holding.id !== 'efectivo');
  return {
    buys: assets.reduce((total, h) => total + Math.max(0, amount(h.proposed - h.current, scenario.value)), 0),
    sales: assets.reduce((total, h) => total + Math.max(0, amount(h.current - h.proposed, scenario.value)), 0),
    cashUsed: amount(cashHolding(scenario).current - cashHolding(scenario).proposed, scenario.value),
  };
}

export const rebalance = rebalanceFor(cases['MT-1042']);

export function casePerspective(screen: Screen, perspective: Perspective, scenario?: Scenario) {
  const base = perspectives[perspective].screens[screen];
  if (screen === 'eventos') {
    const globalCopy: Record<Perspective, { title: string; body: string; points: string[] }> = {
      asesor: { title: 'Señales globales, impacto por evaluar', body: 'Revisa tasas, energía, divisas y renta fija global. El impacto sobre cada cliente se evalúa después en la bandeja y en su análisis.', points: ['Contexto de mercado', 'Sin enfoque en un cliente', 'Impacto en la bandeja'] },
      cliente: { title: 'Entender el mercado antes de revisar la cartera', body: 'Estos eventos describen escenarios generales, no una recomendación personal. Su relevancia depende de los objetivos y riesgos de cada cartera.', points: ['Eventos ficticios', 'Sin recomendación personal', 'Consulta a tu asesor'] },
      tecnica: { title: 'Eventos independientes de los clientes', body: 'Los fixtures de mercado no contienen identificadores de cliente. Los casos referencian eventos mediante eventId; la asociación no personaliza el radar.', points: ['source: fixture', 'scope: market', 'ingestion: none'] },
      control: { title: 'Contexto global con fuentes ficticias', body: 'Las señales no provienen de fuentes de mercado conectadas. No contienen información de carteras ni constituyen dictámenes de idoneidad.', points: ['Sin datos de clientes', 'Sin monitoreo real', 'Sin recomendación individual'] },
    };
    return globalCopy[perspective];
  }
  if (scenario?.clientId === 'MT-1042' && !['eventos', 'bandeja'].includes(screen)) return base;
  const titles: Record<Perspective, string> = {
    asesor: 'Evidencia para la conversación',
    cliente: 'Tus metas antes de cualquier movimiento',
    tecnica: 'Entradas y salidas estáticas por caso',
    control: 'Supuestos visibles, sin autorización',
  };
  if (!scenario) return {
    title: titles[perspective],
    body: 'Tres casos ficticios: Mariana moderada, Carlos dinámico y Ana muy conservadora. Selecciona un cliente en la bandeja para abrir su análisis, simulación y trazabilidad.',
    points: ['Tres escenarios completos', 'Sin selección automática', 'Sin operaciones reales'],
  };
  const cash = cashHolding(scenario);
  const movements = rebalanceFor(scenario);
  const bodies: Record<Perspective, string> = {
    asesor: `${scenario.client}: ${scenario.recommendation} Confirma metas y capacidad de pérdida antes de cualquier operación real.`,
    cliente: `${scenario.goal}. ${scenario.conversation} Esta comparación es ficticia y requiere una conversación con tu asesor, no una acción inmediata.`,
    tecnica: `${scenario.id} / ${scenario.clientId}. Fuente: ${scenario.event.source}. Importes = patrimonio × ponderación / 100; salidas predefinidas, sin LLM ni optimizador.`,
    control: `${scenario.riskNote} No hay KYC certificado, aprobación registrada ni validación regulatoria.`,
  };
  return {
    title: `${titles[perspective]} · ${scenario.client}`,
    body: bodies[perspective],
    points: screen === 'simulador'
      ? [`Compras: ${money(movements.buys)}`, `Ventas: ${money(movements.sales)}`, `Uso de efectivo: ${money(movements.cashUsed)}`]
      : [`Perfil: ${scenario.profile}`, `Patrimonio: ${money(scenario.value)} MXN`, `Reserva propuesta: ${cash.proposed}%`],
  };
}
