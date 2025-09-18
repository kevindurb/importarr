import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { CreateMatchBody } from '@/app/validators/CreateMatchBody';
import { MatchPageState } from '@/app/validators/MatchPageState';
import { FilesListPage } from '@/app/views/pages/FilesListPage';
import { MatchWizardPage } from '@/app/views/pages/MatchWizardPage/MatchWizardPage';
import { refreshUnmatchedFiles } from '@/domain/autoMatcher';
import { createMatchForSourceFile } from '@/domain/createMatch';
import { refreshFiles } from '@/domain/sourceFileImporter';
import { prisma } from '@/infrastructure/prisma';
import { Layout } from '../views/layouts/Layout';

export const filesRouter = new Hono();

filesRouter.get('/', (c) =>
  c.html(
    <Layout req={c.req}>
      <FilesListPage />
    </Layout>,
  ),
);

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
  const { isTv, search, tmdbId, seasonEpisode } = c.req.valid('query');

  return c.html(
    <Layout req={c.req}>
      <MatchWizardPage
        fileId={c.req.param('fileId')}
        isTv={isTv}
        search={search}
        tmdbId={tmdbId}
        seasonEpisode={seasonEpisode}
      />
    </Layout>,
  );
});

filesRouter.post('/:fileId/match', zValidator('form', CreateMatchBody), async (c) => {
  const fileId = c.req.param('fileId');
  const { tmdbId, isTv, seasonEpisode } = c.req.valid('form');
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
  });
  await createMatchForSourceFile(file, tmdbId, isTv, seasonEpisode?.season, seasonEpisode?.episode);
  return c.redirect('/files');
});
