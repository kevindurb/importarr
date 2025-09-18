import { Hono } from 'hono';
import { filesRouter } from './files';
import { importRouter } from './import';

export const router = new Hono();

router.get('/', (c) => c.redirect('/files'));
router.route('/files', filesRouter);
router.route('/import', importRouter);
