import { Hono } from 'hono';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { refreshUnmatchedFiles } from '../../domain/autoMatcher';
import { refreshFiles } from '../../domain/sourceFileImporter';
import { FilesListPage } from '../views/pages/FilesListPage';

const prisma = new PrismaClient();
export const filesRouter = new Hono();

filesRouter.get('/', (c) => c.html(<FilesListPage />));
filesRouter.get('/refresh', async (c) => {
  await refreshFiles();
  await refreshUnmatchedFiles();
  return c.redirect('/files');
});

filesRouter.post('/:fileId/approve', async (c) => {
  const id = c.req.param('fileId');
  await prisma.sourceFile.update({
    where: { id },
    data: { status: 'ReadyToMove' },
  });
  return c.redirect('/files');
});
