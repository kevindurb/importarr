import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { refreshUnmatchedFiles } from '../../domain/autoMatcher';
import { refreshFiles } from '../../domain/sourceFileImporter';
import { CreateMatchBody } from '../validators/CreateMatchBody';
import { MatchPageState } from '../validators/matchPageState';
import { FilesListPage } from '../views/pages/FilesListPage';
import { MatchWizardPage } from '../views/pages/MatchWizardPage/MatchWizardPage';

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

filesRouter.get('/:fileId/match', zValidator('param', MatchPageState), async (c) => {
  const { isTv, search, tmdbId, seasonNumber, episodeNumber } = c.req.valid('param');

  return c.html(
    <MatchWizardPage
      fileId={c.req.param('fileId')}
      isTv={isTv}
      search={search}
      tmdbId={tmdbId}
      seasonNumber={seasonNumber}
      episodeNumber={episodeNumber}
    />,
  );
});

filesRouter.post('/:fileId/match', zValidator('form', CreateMatchBody), async (c) => {
  const fileId = c.req.param('fileId');
  const data = c.req.valid('form');
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
  });
  if (data.isTV) {
    console.log('match tv', file);
  } else {
    console.log('match movie', file);
  }
});
