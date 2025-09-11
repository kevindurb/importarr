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
  '/@picocss/pico/*',
  serveStatic({
    root: './node_modules/@picocss/pico/',
    rewriteRequestPath: (path) => path.replace(/^\/@picocss\/pico\//, ''),
  }),
);

app.route('/', router);

export default app;
