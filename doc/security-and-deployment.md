# Seguridad, privacidad y publicación

## Proteger `doc/`

`doc/` contiene documentación interna para agentes y debe mantenerse fuera del contenido web:

1. Guardar los archivos en la carpeta `doc/` de la raíz del proyecto. No moverlos a `public/`, no importarlos desde `src/` y no referenciarlos como recursos de la interfaz.
2. `vite.config.ts` aplica `block-private-documentation` tanto a `configureServer` como a `configurePreviewServer`. Las rutas HTTP con un segmento `doc` reciben `404 Not Found`, `Cache-Control: no-store` y un cuerpo genérico.
3. El filtro decodifica la ruta varias veces, normaliza `\` como `/` y compara nombres de segmento sin distinguir mayúsculas. También rechaza rutas mal codificadas. Protege `/doc/README.md`, rutas codificadas y la forma de acceso `/@fs/.../doc/...` del servidor de desarrollo.
4. `npm run build` emite la aplicación a `dist/`; Vite no copia la carpeta `doc/` a ese directorio. El servidor `npm run preview` sirve el build y también tiene el bloqueo.
5. Publicar **solo `dist/`**, no la raíz del repositorio. Un servidor independiente configurado para publicar todo el repo, un servidor de archivos configurado sobre la raíz, un artifact de CI o una copia/backup del repo no están bajo el control del middleware Vite. No uses esas opciones para desplegar.
6. No incluir documentos de `doc/` en artifacts públicos de CI, empaquetados web, imágenes de contenedor o rutas CDN.

La denegación usa 404, no expone la existencia ni el nombre de un recurso interno, y desactiva el almacenamiento en caché. Mantén pruebas de ruta para los servidores de desarrollo y preview al cambiar Vite.

Esta garantía es **protección frente al servidor web de esta app**, no control de acceso universal: no revoca acceso a la copia local o a un repositorio publicado. Si el repositorio se publica, sus documentos también serán legibles a través del hosting del repositorio.

## Publicación en GitHub Pages

- En **Settings → Pages → Build and deployment → Source**, seleccionar **GitHub Actions**. No usar la raíz de `main` como origen estático: su `index.html` referencia `/src/main.tsx`, una entrada de desarrollo que Pages no compila.
- [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) se ejecuta al subir cambios a `main` o manualmente. Usa Node.js 24, `npm ci`, `npm test` y `npm run build`; el único directorio que entrega a Pages es `dist/`.
- [`vite.config.ts`](../vite.config.ts) mantiene `base: './'` para generar URLs relativas de JavaScript y CSS. Con las rutas hash actuales, el mismo build funciona en la raíz y bajo `/DemoIAAgents/`, sin cambiar los enlaces del recorrido.
- La URL de la demo es https://ricarnicerogbm.github.io/DemoIAAgents/#/eventos. El despliegue no está aplicado hasta que los cambios estén en GitHub, la fuente sea GitHub Actions y termine correctamente el workflow.
- El middleware de documentación se conserva para desarrollo y preview. En Pages el aislamiento depende de publicar solo `dist/`, que no contiene `doc/`; Pages no ejecuta plugins de Vite.

## Datos y capacidades permitidas

- Los datos actuales son fixtures explícitamente ficticios y no incluyen cuentas, API keys ni acceso a clientes.
- No agregar endpoints de cotización, inferencia, login, tracking, telemetría o terceros sin aprobación.
- Evitar filtros de fuentes reales o afirmaciones que hagan pasar la fecha ficticia por un comunicado real.
- Las acciones de decisión son diálogos. No aceptar como autorización, ni generar ni transmitir instrucciones de operación.
- El almacenamiento del navegador solo admite pantalla y perspectiva. No agregar al storage filtros sensibles, mensajes o decisiones.
- El parámetro `cliente` del hash admite solo IDs sintéticos conocidos mediante `isClientId`. Conserva selección al recargar, pero no es identidad, autenticación ni autorización. Sin cliente válido se vuelve a Bandeja; no guardar el identificador en localStorage ni añadir clientes reales.
- Validar nuevamente los strings que se lean de `localStorage`; tratarlo como entrada no confiable, nunca como una fuente de identidad o autorización.
- No presentar la reserva ni otras verificaciones educativas como regla normativa, control de cumplimiento o recomendación idónea.

## Verificación de aislamiento

La suite `npm run test:e2e` prueba:

- `/doc`, `/doc/README.md`, una ruta codificada y la variante en mayúsculas devuelven 404 en el preview.
- Las mismas rutas no son servidas por el Vite de desarrollo; se cubre también `/@fs/.../doc/...`.
- El filtro no obstruye las cinco pantallas ni los otros flujos de usuario.
- La compilación coloca los assets web bajo `dist/`. No publicar artifacts distintos de ese directorio.
- El build carga sus assets bajo `/DemoIAAgents/`, permite navegar y recargar rutas hash y sigue bloqueando la documentación en el preview de esa subruta.

Probar una ruta nueva de documentación con el servidor objetivo si se agrega otro mecanismo de servir la aplicación. Un proxy, CDN, servidor estático u origen de hosting externo puede tener reglas independientes; no asumas que hereda middleware de Vite.
