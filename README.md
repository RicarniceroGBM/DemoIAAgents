# Nexo · Inteligencia patrimonial

Prototipo visual en español de una plataforma patrimonial multiagente inspirada en GBM. Sin afiliación, logotipos oficiales, datos personales reales ni integraciones productivas.

## Ejecutar

Requiere Node.js 22.18 o posterior de la rama 22, o Node.js 24 o posterior, y npm. La demo fue validada con Node.js 24.

```powershell
npm install
npm run dev
```

Abrir la dirección local que imprime Vite, normalmente http://127.0.0.1:5173.

```powershell
npm run build
npm run preview
```

La compilación se genera en `dist`. Se puede servir desde un servidor estático; las rutas usan hash y no necesitan reglas de reescritura.

## Recorrido sugerido

1. **Centro de eventos:** abrir “Ver caso asociado” en la tarjeta Banxico.
2. **Bandeja del asesor:** seleccionar el caso ficticio de Mariana Torres.
3. **Detalle multiagente:** recorrer evento, agentes, hallazgos y síntesis con la guía de estaciones.
4. **Simulador:** comparar la asignación actual y propuesta y revisar el balance de movimientos.
5. **Aprobación y trazabilidad:** explorar aprobar, modificar, rechazar o solicitar revisión.

El selector global cambia entre **cliente, asesor, técnica y control** en cualquiera de las cinco pantallas. Las perspectivas cambian el contenido explicativo, no los permisos.

La navegación admite enlaces directos, recarga y atrás/adelante. Solo se conservan pantalla y perspectiva en la clave `nexo-demo-ui` de localStorage. Una ruta explícita tiene prioridad sobre la última pantalla guardada. **Reiniciar demo** restaura Eventos, vista asesor y filtros iniciales. Los errores de almacenamiento se muestran sin impedir navegar.

## Datos y límites

Todos los eventos, personas, fechas, fuentes, estados de agentes y registros son ficticios. El caso usa un recorte hipotético de Banxico de 7.50% a 7.25%, no una decisión real ni una observación vigente.

- Patrimonio: $2,500,000 MXN; perfil moderado; horizonte de cinco años.
- Actual → propuesta: corto plazo 40% → 30%; mediano plazo 20% → 30%; acciones y ETF 25% → 25%; Fibras 5% → 10%; efectivo 10% → 5%.
- Compras de $375,000 = ventas de $250,000 + uso de efectivo de $125,000.
- Reserva final: $125,000; supuesto del caso, no un mínimo regulatorio.
- Simulación fija: no hay edición, optimizador ni cálculo de rendimientos futuros.
- Riesgo y rendimiento son supuestos ilustrativos, no estimaciones de un modelo ni garantías.
- Sin comisiones, impuestos, spreads, precios, títulos ni disponibilidad de instrumentos.
- Las cuatro acciones finales solo abren explicaciones: no registran decisiones, no alteran la bitácora, no notifican y no ejecutan operaciones.
- La trazabilidad y las validaciones son contenido de ejemplo, no auditoría inmutable ni certificación de cumplimiento.
- Los eventos y clientes secundarios son vistas previas sin casos propios.
- No hay IA, backend, autenticación, conexión a sistemas GBM ni consultas de mercado.
- No se cargan fuentes, imágenes o datos desde servicios externos.

No constituye asesoría financiera.

## Estructura

- [src/data/demo.ts](src/data/demo.ts): datos tipados del caso y contenidos de las veinte combinaciones pantalla/perspectiva.
- [src/App.tsx](src/App.tsx): navegación, estructura compartida y preferencias.
- [src/components/Shared.tsx](src/components/Shared.tsx): estaciones, cartera, contexto y diálogos accesibles.
- [src/screens](src/screens): cinco pantallas.
- [src/styles.css](src/styles.css): diseño adaptable, sin fuentes o activos remotos.

## Validar

```powershell
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Las pruebas de datos usan el runner nativo de Node.js. Las de navegador usan Chromium con Playwright y levantan un servidor de preview temporal en el puerto 4173; lo cierran al terminar. El puerto debe estar libre.

Se verifican conciliación de cartera, veinte contextos diferenciados, recorrido, navegación e historial, filtros, reinicio, persistencia limitada, errores de almacenamiento, foco de diálogos y secciones, ausencia de peticiones externas y ausencia de desbordamiento a 320, 390, 768 y 1440 px. También se mide el contraste del texto sobre fondos sólidos (no sustituye una auditoría completa de accesibilidad). Las capturas generadas quedan en `test-results`, fuera del código fuente.

Si la descarga de Chromium falla por certificados corporativos, en Node.js 24 puedes usar las autoridades de certificación de Windows sin desactivar TLS:

```powershell
$env:NODE_USE_SYSTEM_CA = '1'
npx playwright install chromium
```
