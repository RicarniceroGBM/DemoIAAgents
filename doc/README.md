# Documentación técnica para agentes de IA

> **Uso interno del equipo de desarrollo.** Esta carpeta está fuera de `public/`, se omite en `dist/` y Vite responde `404 Not Found` a las rutas `/doc`. Sirve los archivos de `dist/` al desplegar; no publiques la raíz del repositorio como sitio web. La protección de ruta no es control de acceso de GitHub ni impide que una copia de seguridad, CDN, servidor externo o repositorio público publique los documentos por separado.

## Por dónde empezar

1. Lee [AGENTS.md](AGENTS.md) para las restricciones que deben seguir los agentes al trabajar con esta documentación.
2. Consulta [arquitectura y navegación](architecture.md) para orientarte en la aplicación y las cinco pantallas.
3. Consulta [dominio y contratos de datos](data-and-domain.md) antes de tocar los datos, la cartera, sus métricas o el copy por perspectiva.
4. Consulta [guía de trabajo para agentes](agent-workflow.md) antes de diseñar una modificación o escribir cambios de comportamiento.
5. Consulta [seguridad, privacidad y publicación](security-and-deployment.md) al cambiar configuración, servidores, datos o proceso de build.

## Mapa del repositorio

- `src/App.tsx`: rutas hash, estado de navegación, selector de perspectiva, preferencias del navegador y composición de la página.
- `src/routes.ts`: validación del cliente sintético en la URL, protección de pantallas del caso y construcción de enlaces.
- `src/data/demo.ts`: tres casos ficticios completos, entradas y salidas prefijadas, contenidos de perspectiva y cálculos monetarios derivados.
- `src/types.ts`: contratos TypeScript compartidos.
- `src/components/Shared.tsx`: navegación de estaciones, encabezado del caso, contexto de perspectiva, portafolio y diálogos.
- `src/screens/Events.tsx`: centro de eventos y filtros locales.
- `src/screens/Inbox.tsx`: selección explícita entre Mariana, Carlos y Ana; tres propuestas navegables.
- `src/screens/AgentDetail.tsx`: análisis, cuatro agentes, hallazgos, mapa causal y guion de conversación del asesor por cliente.
- `src/screens/Simulator.tsx`: comparación fija y balance por caso; región, moneda y composición para Carlos y Ana.
- `src/screens/Approval.tsx`: boleta no ejecutable, validaciones y trazabilidad estática.
- `src/styles.css`: tokens visuales, componentes y breakpoints.
- `vite.config.ts`: configuración de Vite y bloqueo HTTP de `/doc` en desarrollo y preview.
- `.github/workflows/deploy-pages.yml`: compilación y publicación exclusiva de `dist/` en GitHub Pages.
- `tests/demo.test.ts`: invariantes de los fixtures y los datos patrimoniales.
- `tests/browser/prototype.spec.ts`: pruebas Playwright de flujos, seguridad de rutas, accesibilidad y adaptación.

## Comandos de referencia

```powershell
npm install
npm run dev
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run preview
```

Node.js mínimo, scripts y demás instrucciones para iniciar la demo están en [README.md](../README.md). El servidor de pruebas de navegador usa el puerto local `4173`; debe estar libre.
