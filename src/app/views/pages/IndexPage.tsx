import type { FC } from 'hono/jsx';
import { Layout } from '../layouts/Layout';

export const IndexPage: FC = () => (
  <Layout>
    <h1 class='title'>Importarr</h1>
  </Layout>
);
