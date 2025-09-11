import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { router } from './routes/router';

const app = new Hono();

app.use(
  '/public/bootstrap-icons/*',
  serveStatic({
    root: './node_modules/bootstrap-icons/',
    rewriteRequestPath: (path) => path.replace(/^\/public\/bootstrap-icons\//, ''),
  }),
);

app.use(
  '/public/@picocss/pico/*',
  serveStatic({
    root: './node_modules/@picocss/pico/',
    rewriteRequestPath: (path) => path.replace(/^\/public\/@picocss\/pico\//, ''),
  }),
);

app.route('/', router);

export default app;
