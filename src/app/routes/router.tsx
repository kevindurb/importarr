import { Hono } from 'hono';
import { IndexPage } from '@/app/views/pages/IndexPage';
import { filesRouter } from './files';
import { importRouter } from './import';

export const router = new Hono();

router.get('/', (c) => c.html(<IndexPage />));
router.route('/files', filesRouter);
router.route('/import', importRouter);
