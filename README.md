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

La compilación se genera en `dist`. Se puede servir desde un servidor estático; las rutas usan hash y no necesitan reglas de reescritura. Publica **solo `dist/`**, no la raíz del repositorio; `doc/` es documentación interna bloqueada por los servidores Vite del proyecto.

## Publicar en GitHub Pages

1. En el repositorio, abre **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**, no **Deploy from a branch**.
2. Sube los cambios a `main`, incluido [el workflow de publicación](.github/workflows/deploy-pages.yml). También puedes ejecutarlo desde **Actions → Deploy to GitHub Pages → Run workflow** cuando ya esté en GitHub.
3. Espera a que termine correctamente y abre https://ricarnicerogbm.github.io/DemoIAAgents/#/eventos.

El workflow usa Node.js 24, instala con `npm ci`, ejecuta `npm test` y `npm run build`, y publica únicamente `dist/`. No subas el build manualmente ni publiques la raíz del repositorio.

`base: './'` en [vite.config.ts](vite.config.ts) genera referencias relativas a los assets, compatibles tanto con el preview local como con la subruta `/DemoIAAgents/`. La navegación sigue usando hash.

Una página en blanco con un 404 al solicitar `/src/main.tsx` indica que se está sirviendo el HTML de desarrollo, no el compilado. Cambiar la fuente de Pages a GitHub Actions y completar el workflow sustituye ese HTML por el build de producción.

## Recorrido sugerido

1. **Centro de eventos:** consultar señales generales y abrir “Ver impacto en carteras” para pasar a la bandeja.
2. **Bandeja del asesor:** seleccionar a Mariana Torres (moderada), Carlos López (dinámico) o Ana García (muy conservadora). Los tres tienen un caso completo.
3. **Detalle multiagente:** recorrer evento, agentes, hallazgos y síntesis con la guía de estaciones. En Síntesis, consultar el guion por cliente para saludar, explicar el evento, conectar con su cartera, presentar la alternativa con riesgos y acordar el siguiente paso. Es un ejemplo para el asesor, no un mensaje enviado.
4. **Simulador:** comparar la asignación actual y propuesta y revisar el balance de movimientos.
5. **Aprobación y trazabilidad:** explorar aprobar, modificar, rechazar o solicitar revisión.

El selector global cambia entre **cliente, asesor, técnica y control** en cualquiera de las cinco pantallas. Las perspectivas cambian el contenido explicativo, no los permisos.

La navegación admite enlaces directos, recarga y atrás/adelante. El cliente seleccionado viaja en el hash, por ejemplo `#/detalle?cliente=CL-2086` o `#/detalle/hallazgos?cliente=AG-3108`, y se conserva al volver a Eventos o Bandeja. Sin cliente válido, las pestañas Detalle, Simulador y Aprobación están deshabilitadas; acceder directamente conduce a la bandeja con un aviso. No se selecciona Mariana automáticamente.

Solo se conservan pantalla y perspectiva en la clave `nexo-demo-ui` de localStorage, nunca el cliente ni decisiones. Una ruta explícita tiene prioridad sobre la última pantalla guardada; restaurar una pantalla de caso sin cliente conduce a la bandeja. **Reiniciar demo** elimina la selección y restaura Eventos, vista asesor y filtros iniciales. Los errores de almacenamiento se muestran sin impedir navegar.

## Datos y límites

Todos los eventos, personas, fechas, fuentes, estados de agentes y registros son ficticios. Hay seis eventos globales de mercado, independientes de los clientes, y tres casos completos con entradas, cuatro análisis predefinidos, propuesta, comparación y trazabilidad. El radar no incluye nombres, perfiles ni asignaciones de clientes; el impacto personalizado se presenta en la bandeja y en cada caso. Las noticias fechadas no son observaciones vigentes de mercado.

### Mariana · moderada

Recorte hipotético de Banxico de 7.50% a 7.25%, no una decisión real.

- Patrimonio: $2,500,000 MXN; perfil moderado; horizonte de cinco años.
- Actual → propuesta: corto plazo 40% → 30%; mediano plazo 20% → 30%; acciones y ETF 25% → 25%; Fibras 5% → 10%; efectivo 10% → 5%.
- Compras de $375,000 = ventas de $250,000 + uso de efectivo de $125,000.
- Reserva final: $125,000; supuesto del caso, no un mínimo regulatorio.

### Carlos · dinámico

- Patrimonio: $1,800,000 MXN; horizonte de siete años y alta tolerancia al riesgo, sin acreditar capacidad real de pérdida.
- Refinadora Horizonte es ficticia. Reporte del 20 oct 2026: utilidad por acción de USD 2.40 frente a consenso de USD 2.00. Nota ficticia del 21 oct: escalamiento con Irán. El 22 oct, crudo de USD 75 a 90 por barril (+20%).
- Un supuesto posterior al choque mantiene márgenes de refinación resistentes (USD 18 → 19 por barril). No se deduce del reporte anterior ni de que suba el petróleo.
- Refinadora 15% → 20%; acciones globales que excluyen la refinadora 40% → 45%; deuda local 20% → 15%; deuda global de alta calidad 15% → 10%; efectivo 10% sin cambio.
- Compras de $180,000 = ventas de $180,000, sin uso de efectivo. Cada movimiento es de $90,000; reserva constante de $180,000.
- Renta variable 55% → 65% y mayor volatilidad supuesta (14.2% → 17.1%). El 20% en una sola emisora es una concentración del fixture, no un límite regulatorio ni garantía de riesgo bajo.

### Ana · muy conservadora

- Patrimonio: $4,200,000 MXN; preservación de capital y horizonte de tres años.
- Deuda EUA 95% → 60%; deuda gubernamental mexicana 0% → 20%; deuda desarrollada excluyendo EUA 0% → 15%; efectivo 5% sin cambio.
- Venta de $1,470,000 de deuda EUA; compras de $840,000 en México y $630,000 en otros mercados desarrollados. Reserva constante de $210,000.
- Mantiene 95% de renta fija soberana ficticia de alta calidad y duración hasta dos años; no agrega acciones ni deuda de alto rendimiento.
- Región del emisor y moneda se muestran por separado. La cobertura a MXN en deuda extranjera es un supuesto con costos excluidos y riesgos residuales, no una operación real ni eliminación del riesgo.

### Límites compartidos

- Simulación fija: no hay edición, optimizador ni cálculo de rendimientos futuros.
- Riesgo y rendimiento son supuestos ilustrativos, no estimaciones de un modelo ni garantías.
- Sin comisiones, impuestos, spreads, precios, títulos ni disponibilidad de instrumentos.
- Las cuatro acciones finales solo abren explicaciones: no registran decisiones, no alteran la bitácora, no notifican y no ejecutan operaciones.
- La trazabilidad y las validaciones son contenido de ejemplo, no auditoría inmutable ni certificación de cumplimiento.
- Tres eventos tienen casos asociados; los otros tres eventos siguen siendo vistas previas sin caso propio.
- No hay IA, backend, autenticación, conexión a sistemas GBM ni consultas de mercado.
- No se cargan fuentes, imágenes o datos desde servicios externos.

No constituye asesoría financiera.

## Estructura

- [Documentación técnica para agentes de IA](doc/README.md): arquitectura, contratos, guía de trabajo y publicación. Se mantiene fuera del contenido de la aplicación; consulta también [seguridad y publicación](doc/security-and-deployment.md).
- [src/data/demo.ts](src/data/demo.ts): tres casos tipados, entradas y resultados prefijados, cálculos y contextos por caso/pantalla/perspectiva.
- [src/routes.ts](src/routes.ts): validación de cliente y rutas, protección de etapas y construcción compartida de enlaces.
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

Se verifican conciliación y movimientos exactos de los tres casos, perfiles y concentraciones, contextos por caso y perspectiva, salidas técnicas, selección y bloqueo de rutas, recarga e historial, filtros, reinicio, persistencia limitada, errores de almacenamiento, foco de diálogos y secciones y ausencia de peticiones externas. Los tres casos se recorren a 320, 390, 768 y 1440 px sin desbordamiento global. También se mide el contraste del texto sobre fondos sólidos (no sustituye una auditoría completa de accesibilidad). Las capturas generadas quedan en `test-results`, fuera del código fuente.

Si la descarga de Chromium falla por certificados corporativos, en Node.js 24 puedes usar las autoridades de certificación de Windows sin desactivar TLS:

```powershell
$env:NODE_USE_SYSTEM_CA = '1'
npx playwright install chromium
```
