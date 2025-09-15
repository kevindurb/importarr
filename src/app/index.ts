import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { router } from './routes/router';

const app = new Hono();

app.use(
  '/bootstrap-icons/*',
  serveStatic({
    root: './node_modules/bootstrap-icons/',
    rewriteRequestPath: (path) => path.replace(/^\/bootstrap-icons\//, ''),
  }),
);

app.use(
  '/bootstrap/*',
  serveStatic({
    root: './node_modules/bootstrap/',
    rewriteRequestPath: (path) => path.replace(/^\/bootstrap\//, ''),
  }),
);

app.use(
  '/bulma/*',
  serveStatic({
    root: './node_modules/bulma/',
    rewriteRequestPath: (path) => path.replace(/^\/bulma\//, ''),
  }),
);

app.route('/', router);

export default app;
