# Dominio, fixtures y contratos de datos

## Tipos principales

Los contratos compartidos están declarados en `src/types.ts`.

- `Screen`, `Perspective`, `Tone` y `Decision` son uniones de valores permitidos. Validar entradas externas con `isScreen` o `isPerspective` antes de usarlas.
- `ClientId` permite únicamente `MT-1042`, `CL-2086` y `AG-3108`; validar strings externos con `isClientId`.
- `MarketEvent` contiene categoría, institución, descripción, hora, impacto, etiquetas e indicador de evento destacado. Son señales globales: no incluyen `clientId`, nombres, perfiles ni asignaciones de clientes.
- `Client` contiene identidad sintética, perfil, importe, evento y estado; se deriva de `cases`. Los tres tienen propuesta completa, sin indicador de caso principal.
- `Scenario` agrupa identidad, objetivo, horizonte, nivel de perfil, `eventId` para referenciar una señal global, evento contextualizado con entradas estructuradas, holdings, cuatro agentes, mapa causal, propuesta, riesgos, conversación, métricas supuestas y fuentes/timeline por caso. La relación va del caso al evento; no limita la señal a un solo cliente.
- `Agent` especifica ID y orden del agente, especialidad, herramienta de ejemplo, resultado y duración de presentación.
- `Holding` expresa ponderación actual/propuesta, sensibilidad y rationale educativo. Sus valores de tipo `number` son puntos porcentuales, no fracciones. Los casos nuevos añaden `assetClass`, `region` y `currency` para distinguir clase de activo, país del emisor y exposición/cobertura cambiaria; esos campos son opcionales para preservar la cartera base.
- `PerspectiveCopy.screens` debe tener contexto diferenciado para cada miembro de `Screen`.

`src/data/demo.ts` es la fuente única para eventos, clientes, agentes, cartera, perspectivas, textos de decisión y línea de tiempo. No duplicar importes o tasas en una pantalla cuando puedan derivarse del fixture común.

## Caso base (ficticio)

- Caso `NX-2026-042`, cliente ficticio Mariana Torres, perfil moderado, MXN 2,500,000 y horizonte de cinco años.
- El escenario de tasas cambia de 7.50% a 7.25%, o 25 puntos base. No describe una decisión monetaria ni una lectura real del mercado.
- Efectivo inicial: MXN 250,000. Efectivo final: MXN 125,000; la reserva final de 5% es un supuesto de este ejemplo, nunca un mínimo normativo.
- Metas de cartera actual → propuesta: deuda corto plazo 40% → 30%; mediano plazo 20% → 30%; acciones y ETF 25% → 25%; Fibras 5% → 10%; efectivo 10% → 5%.
- Activos actuales y propuestos mantienen el total en 100% y el valor conceptual en MXN 2,500,000.
- Operaciones conceptuales: venta de MXN 250,000 en deuda de corto plazo; compras de MXN 250,000 en mediano plazo y MXN 125,000 en Fibras; se utilizan MXN 125,000 del efectivo existente.

Los holdings también explican sensibilidad y riesgos cualitativos. Los nombres de instrumentos son categorías/canastas ilustrativas: no seleccionan emisiones, títulos, precios ni ofertas.

## Carlos: exposición dinámica ante señales contrapuestas

- Caso `NX-2026-043` / `CL-2086`, MXN 1,800,000, perfil dinámico, nivel 5 de 5 y horizonte de siete años.
- Fuentes: `REPORT-CL-01`, reporte del 20 oct 2026 con utilidad por acción USD 2.40 contra consenso USD 2.00; `ENERGY-01`, nota del 21 oct sobre escalamiento ficticio con Irán y choque del 22 oct con crudo USD 75 → 90 por barril.
- `MARGIN-CL-01` agrega un supuesto posterior al choque: margen USD 18 → 19 por barril porque el precio de productos refinados compensa el mayor costo. No es una observación ni una consecuencia del reporte histórico; petróleo más caro no beneficia automáticamente a una refinadora.
- Cartera actual → propuesta: Refinadora Horizonte 15% → 20%; acciones globales 40% → 45%; deuda local 20% → 15%; deuda global de alta calidad 15% → 10%; efectivo 10% → 10%. La canasta global excluye la refinadora ficticia para evitar duplicar su exposición.
- Salida: vender MXN 90,000 de cada canasta de deuda y comprar MXN 90,000 en cada posición accionaria. Compras = ventas = MXN 180,000; uso de efectivo cero; reserva MXN 180,000.
- Renta variable 55% → 65%; volatilidad anual supuesta 14.2% → 17.1%, rendimiento anual supuesto 9.2% → 10.1%. Son hipótesis de presentación, no cálculos ni pronósticos.
- El tope de 20% en una emisora es del fixture, no regulatorio. La tolerancia al riesgo no acredita capacidad de pérdida. Mostrar concentración, suministro, márgenes, divisas y pérdidas potenciales; no describir el resultado como de bajo riesgo.
- Trazabilidad estática: `AUDIT-CL-01`, con fechas de las entradas y propuesta condicionada al supuesto de márgenes.

## Ana: diversificación regional sin añadir renta variable

- Caso `NX-2026-044` / `AG-3108`, MXN 4,200,000, perfil muy conservador, nivel 1 de 5, preservación de capital y horizonte de tres años.
- Fuentes `PORTFOLIO-AG-01` y `REGIONS-AG-01`: revisión ficticia del 22 oct 2026, no noticia de mercado.
- El caso referencia `deuda-global`, señal general sobre diferencias regionales en mercados de deuda. El hallazgo de concentración en EUA pertenece al análisis de Ana, nunca al evento global.
- Deuda EUA 95% → 60%; deuda gubernamental mexicana 0% → 20%; deuda desarrollada excluyendo EUA 0% → 15%; efectivo 5% → 5%.
- Venta MXN 1,470,000 de deuda EUA; compras MXN 840,000 de deuda mexicana y MXN 630,000 de desarrollados excluyendo EUA. Compras = ventas = MXN 1,470,000; uso de efectivo cero; reserva MXN 210,000.
- Deuda total 95% antes y después, soberana ficticia de alta calidad y duración hasta dos años. Sin acciones ni deuda de alto rendimiento.
- EUA pasa de 95% a 60% del patrimonio, no de la porción de deuda; la concentración inicial de EUA dentro de la deuda es 100%.
- `region` representa el país/bloque del emisor: una cobertura a MXN no convierte un bono estadounidense en deuda mexicana. Deuda EUA denominada en USD y desarrollada en EUR/JPY con cobertura a MXN supuesta; deuda mexicana y efectivo en MXN.
- Explicitar costos de cobertura excluidos, renovación, riesgo de base y contraparte. Todos los importes comparativos son MXN, sin conversiones en vivo. Diversificar no garantiza capital ni elimina riesgo soberano/de tasas.
- Volatilidad anual supuesta 3.2% → 3.2% y rendimiento supuesto 4.1% → 4.1%; no prometer mejora de métricas por cambiar regiones.
- Trazabilidad estática: `AUDIT-AG-01`, sin firma, consentimiento ni acciones operativas.

## Fórmulas e invariantes

`amount(weight, value)` calcula `value * weight / 100`; redondea solo al presentar con `money`, un formateador `es-MX` sin decimales. El segundo argumento conserva por compatibilidad el valor de Mariana como predeterminado; las pantallas pasan explícitamente `scenario.value`.

`cashHolding(scenario)` obtiene la única posición `efectivo`, cuya existencia se comprueba en las pruebas. `rebalanceFor(scenario)` calcula:

- `buys`: suma positiva de la variación de todos los activos excepto efectivo.
- `sales`: suma absoluta de la variación negativa de esos activos.
- `cashUsed`: reducción de ponderación de efectivo multiplicada por el valor base.

Invariante de cada caso: `buys = sales + cashUsed`; la variación total de ponderaciones es cero y el valor de todos los activos propuestos, incluido efectivo, coincide con el patrimonio inicial. No confundir compras incrementales con valor de cartera. Mantener coherentes síntesis, tabla, boleta y pruebas de `tests/demo.test.ts`. Los exports históricos `demoCase`, `holdings`, `agents`, `rebalance` y `timeline` corresponden a Mariana; las pantallas del caso consumen `Scenario` por props.

Los números de `scenario.estimatedRisk` y `estimatedReturn` son supuestos fijos. No hay cálculo financiero, simulación probabilística, proyección ni garantías de rendimiento.

## Perspectivas y datos de presentación

Cada objeto en `perspectives` tiene `label`, `role`, `description` y cinco textos base. `casePerspective(screen, perspective, scenario?)` es la fuente efectiva de `PerspectiveNote`: conserva el contexto base de las etapas de Mariana, genera contenido por cliente para los casos nuevos y ofrece orientación general sin selección. Cada contexto tiene `title`, `body` y tres `points`. El contenido cambia el énfasis, no el resultado ni los permisos.

En Eventos, `casePerspective` siempre entrega contexto global independiente de la selección. Las tarjetas y búsqueda tampoco muestran ni indexan clientes; los enlaces “Ver impacto en carteras” conducen a Bandeja sin seleccionar automáticamente un caso.

Cada `scenario.timeline` contiene cuatro hitos prefabricados de solo presentación. No añadir resultados de acciones ilustrativas: no es una bitácora real.

La vista técnica de `AgentDetail` muestra JSON derivado con `case_id`, `client_id`, `inputs`, dependencias de agentes, sintetizador, ponderaciones propuestas, `rebalance` y `execution_enabled: false`. Las propuestas están guardadas como ponderaciones prefijadas en los fixtures, no las genera un algoritmo.

`Scenario.advisorScript` guarda cinco intervenciones conversacionales por cliente: `opening` (saludo), `event` (contexto), `impact` (efecto en su cartera), `proposal` (alternativa y riesgos) y `closing` (escucha y siguiente paso). `src/screens/AgentDetail.tsx` las presenta como lista ordenada dentro de Síntesis, en todas las perspectivas, bajo “Guion para conversar con el cliente”. Son ejemplos para el asesor, no mensajes enviados ni consentimiento. Las referencias temporales usan la fecha ficticia del escenario. Los textos de Carlos separan reporte, conflicto y márgenes supuestos; los de Ana no sugieren añadir acciones. Mantener cifras y riesgos alineados con los holdings si cambian los fixtures.

`decisionCopy` establece las cuatro respuestas no operativas. `Decision` se valida en TypeScript en `Approval`/`DemoDialog`. Ninguna acción crea persistencia ni cambia el estado del caso.

## Cuando cambien fixtures

1. Mantener cliente, patrimonio y cantidades del caso consistentes en todos los componentes.
2. Actualizar `tests/demo.test.ts` para ponderaciones, importes, compras, ventas, reserva, tasas y estado de trazabilidad.
3. Actualizar textos que expresen cifras calculadas; preferir valores derivados como `rebalance.buys` y `rebalance.sales`.
4. Verificar las veinte combinaciones de perspectiva/pantalla para cada caso y el estado sin selección, sin referencias cruzadas ni afirmaciones de operación real.
5. Actualizar [README.md](../README.md) y la documentación técnica cuando cambien datos de ejemplo o límites funcionales.
