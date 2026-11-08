import { fileURLToPath, URL } from 'node:url';

import { defineConfig, type Connect, type Plugin } from 'vite';

const path = (file: string) => fileURLToPath(new URL(file, import.meta.url));

const ROUTES = ['phatta', 'glass', 'basant', 'ink-reed', 'darkroom'] as const;

// Serve /phatta (no trailing slash) as /phatta/ so every route answers 200 in dev and preview.
const cleanRoutes: Connect.NextHandleFunction = (req, _res, next) => {
  const [pathname, query] = (req.url ?? '').split('?');
  if ((ROUTES as readonly string[]).includes(pathname.slice(1))) {
    req.url = `${pathname}/${query ? `?${query}` : ''}`;
  }
  next();
};

const cleanRoutesPlugin = (): Plugin => ({
  name: 'panj-clean-routes',
  configureServer: (server) => void server.middlewares.use(cleanRoutes),
  configurePreviewServer: (server) => void server.middlewares.use(cleanRoutes),
});

// Vite multi-page app: one HTML entry per route, so each skin page ships only its own skin.
export default defineConfig({
  appType: 'mpa',
  plugins: [cleanRoutesPlugin()],
  build: {
    rolldownOptions: {
      input: {
        hub: path('./index.html'),
        ...Object.fromEntries(ROUTES.map((r) => [r, path(`./${r}/index.html`)])),
      },
    },
  },
});
