import { Hono } from 'hono';
import { ImportListPage } from '@/app/views/pages/ImportListPage';
import { Layout } from '../views/layouts/Layout';

export const importRouter = new Hono();

importRouter.get('/', (c) =>
  c.html(
    <Layout req={c.req}>
      <ImportListPage />
    </Layout>,
  ),
);
