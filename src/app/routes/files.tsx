import { Hono } from 'hono';
import { FilesListPage } from '../views/pages/FilesListPage';

export const filesRouter = new Hono();

filesRouter.get('/', (c) => c.html(<FilesListPage />));
