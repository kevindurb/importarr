import { Hono } from 'hono';
import { refreshUnmatchedFiles } from '../../domain/autoMatcher';
import { refreshFiles } from '../../domain/sourceFileImporter';
import { FilesListPage } from '../views/pages/FilesListPage';

export const filesRouter = new Hono();

filesRouter.get('/', (c) => c.html(<FilesListPage />));
filesRouter.get('/refresh', async (c) => {
  await refreshFiles();
  await refreshUnmatchedFiles();
  return c.redirect('/files');
});
