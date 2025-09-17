import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { PrismaClient } from '@/../prisma/generated/prisma';
import { CreateMatchBody } from '@/app/validators/CreateMatchBody';
import { MatchPageState } from '@/app/validators/MatchPageState';
import { FilesListPage } from '@/app/views/pages/FilesListPage';
import { MatchWizardPage } from '@/app/views/pages/MatchWizardPage/MatchWizardPage';
import { refreshUnmatchedFiles } from '@/domain/autoMatcher';
import { refreshFiles } from '@/domain/sourceFileImporter';

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

filesRouter.get('/:fileId/match', zValidator('query', MatchPageState), async (c) => {
  const { isTv, search, tmdbId, seasonNumber, episodeNumber } = c.req.valid('query');

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
  if (data.isTv) {
    console.log('match tv', file);
  } else {
    console.log('match movie', file);
  }
  return c.redirect('/files');
});
