# Guía de trabajo para agentes de IA

## Antes de editar

1. Lee [AGENTS.md](../AGENTS.md), este índice y el tema técnico que cubre la tarea.
2. Verifica el código y las pruebas reales; estos documentos describen la rama actual, no una arquitectura futura.
3. Define si el cambio toca tipos, fixtures, navegación, una pantalla, accesibilidad, compilación o protección del directorio privado.
4. Conserva cambios que ya existan en el worktree. No sobrescribas trabajo ajeno.

## Principios de implementación

- Sigue el patrón React/TypeScript existente y las uniones tipadas; mantén `strict` y no agregues casts inseguros para evadir errores de tipos.
- Conserva los datos de presentación centralizados en `src/data/demo.ts`. Usa la misma fuente para los totales visibles.
- Mantén las cinco pantallas, las veinte combinaciones de perspectiva por cada uno de los tres clientes y la coherencia de las seis estaciones. Las pantallas de caso reciben un `Scenario` validado por props; no importes implícitamente datos de Mariana para los otros clientes.
- Usa `routeTo` y `readRoute` de `src/routes.ts`: los enlaces conservan `cliente` y ninguna pantalla del caso debe abrirse sin identificador válido. Mantén los botones deshabilitados y el aviso de selección en escritorio y móvil.
- Usa etiquetas, nombres accesibles y estados de foco. Preserva Escape, devolución de foco y movimiento al encabezado/sección en navegación.
- Si cambias preferencias, persiste exclusivamente `{ screen, perspective }` y maneja fallos de almacenamiento explícitamente sin bloquear navegación.
- Mantén `doc/` fuera de `public/`, `src/` y los artefactos de producción. No retires, eludas ni debilites el bloqueo Vite.
- No añadas dependencias sin una razón concreta y no incorpores fuentes, imágenes, telemetría ni llamadas de red para fixtures.

## Límites de producto y seguridad

El producto presente es una demo cliente, no una herramienta de inversión. No implementes por iniciativa propia:

- Agentes LLM, proveedores de IA, servidores MCP, backend o conectores.
- Cotizaciones, indicadores o decisiones macroeconómicas reales.
- Importación de KYC, carteras reales, credenciales u órdenes.
- Aprobaciones, notificaciones, auditoría, consentimiento o almacenamiento de decisiones operativos.
- Reglas que se presenten como idoneidad o cumplimiento regulatorio.

Estos cambios requieren requisitos y revisión humana explícitos. En cualquier nueva propuesta, di con claridad si sus datos, cálculos, validaciones o estados son ficticios y si producen algún efecto real.

## Validación mínima

```powershell
npm test
npm run build
npm run test:e2e
```

Añade pruebas dirigidas para el comportamiento nuevo; por ejemplo:

- Importes, ponderaciones, reserva y balance de caja → `tests/demo.test.ts`.
- Navegación, perspectivas, acciones y foco → `tests/browser/prototype.spec.ts`.
- Nuevos escenarios → movimientos exactos, entradas, perfiles, reservas y salidas JSON de cada cliente; regiones y monedas diferenciadas para Ana y mayor exposición/riesgo para Carlos.
- Selección → sin caso automático, bloqueo de enlaces directos, recarga con cliente en URL, cambio de cliente, historial y reinicio que elimina selección. No rebajes pruebas que entran al caso para que pasen únicamente sobre la bandeja redirigida.
- Aislamiento de documentación → pruebas de rutas HTTP de `doc/` en servidor de desarrollo y preview.

Comprueba que la prueba de build produce `dist/` sin la carpeta ni el contenido de `doc/`; no debe requerirse una configuración especial para ignorar la documentación en el navegador.

## Actualizar documentación

Mantén una documentación breve y específica:

- Mapa de archivos o rutas públicas internas → `doc/README.md`, `doc/architecture.md`.
- Cambios de contratos, datos, fórmulas o fixtures → `doc/data-and-domain.md`.
- Restricciones del agente, UX o verificaciones → este archivo.
- Vite, exposición de rutas, build y publicación → `doc/security-and-deployment.md`.

Corrige las afirmaciones desactualizadas en `README.md` cuando afecten a la ejecución o a los límites visibles para quien pruebe la demo.
