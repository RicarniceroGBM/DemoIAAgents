# Arquitectura y navegación

## Alcance

Aplicación cliente de demostración construida con React 19, TypeScript en modo estricto, Vite 7 y `lucide-react`. No hay API, backend, autenticación, runtime LLM, agentes reales ni integraciones de mercado. Las salidas que representan agentes son datos predefinidos, no llamadas de IA.

La app renderiza una única entrada React en `src/main.tsx`. `src/App.tsx` compone el encabezado y navegación común, selecciona una de cinco pantallas y añade los componentes compartidos pertinentes. Vite compila la SPA en `dist/`. La navegación usa hash, por lo que el servidor estático no requiere reglas de rewrite.

## Pantallas y rutas

| Pantalla | Ruta hash | Implementación | Responsabilidad |
|---|---|---|---|
| Centro de eventos | `#/eventos` | `src/screens/Events.tsx` | Filtrar seis señales globales ficticias, sin datos de clientes; consultar su impacto desde la bandeja. |
| Bandeja del asesor | `#/bandeja` | `src/screens/Inbox.tsx` | Seleccionar cualquiera de los tres clientes con caso completo. |
| Detalle multiagente | `#/detalle?cliente=CL-2086` | `src/screens/AgentDetail.tsx` | Inspeccionar entradas, evento, agentes, hallazgos y síntesis del cliente seleccionado. |
| Simulador de rebalanceo | `#/simulador?cliente=CL-2086` | `src/screens/Simulator.tsx` | Comparar las carteras del caso y sus movimientos; mostrar región y moneda cuando corresponda. |
| Aprobación y trazabilidad | `#/aprobacion?cliente=CL-2086` | `src/screens/Approval.tsx` | Revisar borrador, validaciones y registro estático propios del caso; abrir diálogos no operativos. |

El detalle reconoce las secciones `evento`, `analisis`, `hallazgos` y `sintesis`, siempre con cliente válido; por ejemplo `#/detalle/hallazgos?cliente=AG-3108`. `Journey`, en `src/components/Shared.tsx`, conserva el cliente al conectar las seis estaciones. Los enlaces son anchors normales para conservar navegación atrás/adelante.

`readRoute` en `src/routes.ts` valida pantalla, sección y un único parámetro `cliente` contra `ClientId`. Una ruta hash explícita tiene prioridad frente a la pantalla persistida. Una ruta de pantalla/sección inválida muestra una advertencia y Eventos. Un cliente inválido, duplicado o ausente en una pantalla de caso conduce a Bandeja con aviso; `App` normaliza la URL sin mostrar datos de otro caso. Sin selección, las tres etapas se representan con botones nativos `disabled` tanto en escritorio como en móvil, acompañados de una explicación.

La URL es la única fuente de selección. `routeTo` construye los enlaces compartidos; Eventos y Bandeja pueden conservar el parámetro sin entrar al detalle. Elegir una fila abre el caso y habilita las etapas. Los accesos del hero y tarjeta lateral llevan a seleccionar cliente si aún no hay uno, sin elegir Mariana automáticamente. El identificador sintético en URL no es una sesión ni autorización.

Eventos conserva las mismas tarjetas y contexto global con o sin cliente seleccionado. Cada caso referencia su señal mediante `Scenario.eventId`; los eventos no referencian clientes. Los enlaces de tarjetas “Ver impacto en carteras” y el hero llevan a Bandeja, conservando una selección previa sin personalizar el radar.

`cases` en `src/data/demo.ts` agrupa cada `Scenario`; `App` resuelve el cliente y pasa el escenario mediante props a encabezado, contexto, pantallas y carteras. No hay context global ni importación implícita del caso Mariana desde las pantallas del caso.

## Perspectivas

`perspectives` y `casePerspective` en `src/data/demo.ts` definen `asesor`, `cliente`, `tecnica` y `control`, con contexto para cada pantalla y cliente, o un mensaje de selección cuando falta cliente. `PerspectiveNote` representa ese contenido; la vista técnica del detalle presenta herramientas `.mock` y salida JSON con entradas y resultado del caso. No son roles autenticados ni permisos de acceso. Las cuatro perspectivas pueden recorrer todas las pantallas habilitadas.

El estado actual de filtros de eventos y apertura del diálogo vive en los componentes respectivos y no se persiste.

## Componentes compartidos

- `SectionTitle`, `Badge`, `NextLink` y `PerspectiveNote`: jerarquía, estado y navegación.
- `CaseHeader` y `Journey`: identidad ficticia del caso y ruta de sus estaciones.
- La sección Síntesis de `AgentDetail` incluye un guion de cinco pasos por cliente para el asesor: acercamiento, evento, impacto, alternativa con riesgos y cierre. Está disponible en las cuatro perspectivas y no envía mensajes ni registra decisiones.
- `AllocationBar` y `PortfolioCard`: representación visual derivada de `scenario.holdings` y `scenario.value`.
- `DemoDialog`: diálogos nativos de `<dialog>`, cierre con Escape y devolución del foco. El callback de cierre nunca guarda un resultado.
- `src/styles.css`: estilos sin sistema de UI externo. Gráficos del hero y distribución se representan con CSS/HTML; las tablas proporcionan acceso a valores textuales.

Los títulos y el contenido principal reciben foco al navegar; los anchors de estación enfocan su sección y hacen scroll al comienzo. En móviles el menú lateral tiene fondo para cerrar, etiqueta accesible y retorno de foco al botón al cerrar con Escape.

## Persistencia y ciclo de vida

`nexo-demo-ui` en `localStorage` guarda únicamente el objeto JSON `{ "screen": Screen, "perspective": Perspective }`. No almacenar filtros, casos, decisiones, resultados, datos de cuenta o autorizaciones. La lectura valida las dos propiedades con `isScreen` e `isPerspective`; si el JSON es inválido, muestra una alerta y usa los valores iniciales. Excepciones de acceso/escritura se registran en consola y se presentan al visitante sin deshabilitar la navegación.

`Reiniciar demo` vuelve al centro de eventos y a la perspectiva asesor, cierra diálogos, limpia filtros y elimina la selección mediante el hash `#/eventos`. Sobrescribe pantalla/perspectiva en preferencias. Recargar una URL con cliente conserva el caso; abrir la raíz con una pantalla de caso persistida, pero sin cliente en URL, conduce a Bandeja con aviso. El contenido no tiene estado operativo que reconciliar.

## Modificación del recorrido

Al añadir pantalla, mantener alineados:

1. El tipo unión `Screen` en `src/types.ts`.
2. `screenList`, el contexto de cada perspectiva y los fixtures en `src/data/demo.ts`.
3. Validación y enlaces en `src/routes.ts`, iconos y render condicional en `src/App.tsx`.
4. La navegación, pruebas, mapa de rutas e índice documental.

Si el detalle deja de admitir las mismas cuatro secciones, actualizar en conjunto `readRoute`, `Journey` y las pruebas. Mantener las rutas del caso central accesibles desde navegación de escritorio, navegación móvil y anchors internos.
