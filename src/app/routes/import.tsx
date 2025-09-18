import { Hono } from 'hono';
import { ImportListPage } from '@/app/views/pages/ImportListPage';
import { importFileToLibrary } from '@/domain/libraryImporter';
import { prisma } from '@/infrastructure/prisma';
import { Layout } from '../views/layouts/Layout';

export const importRouter = new Hono();

importRouter.get('/', (c) =>
  c.html(
    <Layout c={c}>
      <ImportListPage />
    </Layout>,
  ),
);

importRouter.post('/:fileId', async (c) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({ where: { id: c.req.param('fileId') } });
  await importFileToLibrary(file);
  c.flash.set('SUCCESS', 'File Imported');
  return c.redirect('/import');
});
