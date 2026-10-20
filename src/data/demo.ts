import type { Agent, Client, Decision, Holding, MarketEvent, Perspective, PerspectiveCopy, Screen } from '../types.ts';

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

export const clients: Client[] = [
  { id: 'MT-1042', name: demoCase.client, initials: 'MT', profile: 'Moderado', value: demoCase.value, event: 'Recorte Banxico · −25 pb', status: 'Propuesta lista', main: true },
  { id: 'CL-2086', name: 'Carlos López', initials: 'CL', profile: 'Conservador', value: 1_800_000, event: 'Recorte Banxico · −25 pb', status: 'Vista previa', main: false },
  { id: 'AG-3108', name: 'Ana García', initials: 'AG', profile: 'Dinámico', value: 4_200_000, event: 'Volatilidad USD / MXN', status: 'Vista previa', main: false },
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
      bandeja: { title: 'Asociación de caso y perfil', body: 'El cliente MT-1042 se enlaza al evento Banxico mediante identificadores locales. Los otros clientes son vistas previas sin pipeline propio.', points: ['client_id: MT-1042', 'case_id: NX-2026-042', 'execution: mocked'] },
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

export const amount = (weight: number) => demoCase.value * weight / 100;
export const rebalance = {
  buys: holdings.filter((h) => h.id !== 'efectivo').reduce((total, h) => total + Math.max(0, amount(h.proposed - h.current)), 0),
  sales: holdings.filter((h) => h.id !== 'efectivo').reduce((total, h) => total + Math.max(0, amount(h.current - h.proposed)), 0),
  cashUsed: amount(holdings.filter((h) => h.id === 'efectivo').reduce((total, h) => total + h.current - h.proposed, 0)),
};
export const isScreen = (value: unknown): value is Screen => screenList.some((screen) => screen.id === value);
export const isPerspective = (value: unknown): value is Perspective =>
  typeof value === 'string' && Object.hasOwn(perspectives, value);
