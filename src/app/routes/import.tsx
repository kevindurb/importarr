import { Hono } from 'hono';
import { ImportListPage } from '@/app/views/pages/ImportListPage';

export const importRouter = new Hono();

importRouter.get('/', (c) => c.html(<ImportListPage />));
