import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { IndexPage } from '../views/pages/IndexPage';
import { filesRouter } from './files';

export const router = new Hono();

router.get('/', (c) => c.html(<IndexPage />));
router.use(
  '/public/pico.css',
  serveStatic({ path: './node_modules/@picocss/pico/css/pico.min.css' }),
);
router.use(
  '/public/lucide.js',
  serveStatic({ path: './node_modules/lucide/dist/umd/lucide.min.js' }),
);
router.route('/files', filesRouter);
