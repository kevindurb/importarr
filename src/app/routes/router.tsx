import { Hono } from 'hono';
import { IndexPage } from '../views/pages/IndexPage';
import { filesRouter } from './files';

export const router = new Hono();

router.get('/', (c) => c.html(<IndexPage />));
router.route('/files', filesRouter);
