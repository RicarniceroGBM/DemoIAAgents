import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

function isPrivateDocumentationRequest(requestUrl: string | undefined): boolean {
  if (!requestUrl) return false;

  let pathname: string;
  try {
    pathname = new URL(requestUrl, 'http://vite.local').pathname;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) break;
      pathname = decoded;
    }
  } catch {
    return true;
  }

  return pathname
    .replace(/\\/g, '/')
    .split('/')
    .some((segment) => segment.toLowerCase() === 'doc');
}

function blockPrivateDocumentation() {
  const middleware = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: Error) => void,
  ) => {
    if (!isPrivateDocumentationRequest(request.url)) {
      next();
      return;
    }

    response.statusCode = 404;
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end('Not Found');
  };

  return {
    name: 'block-private-documentation',
    configureServer(server: { middlewares: { use: (handler: typeof middleware) => void } }) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server: { middlewares: { use: (handler: typeof middleware) => void } }) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), blockPrivateDocumentation()],
});
