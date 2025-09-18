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
import type { AppEnv } from '../types';
import { Layout } from '../views/layouts/Layout';

export const filesRouter = new Hono<AppEnv>();

filesRouter.get('/', (c) =>
  c.html(
    <Layout c={c}>
      <FilesListPage />
    </Layout>,
  ),
);

filesRouter.get('/refresh', async (c) => {
  await refreshFiles();
  await refreshUnmatchedFiles();
  c.get('session').flash('info', 'Files Refreshed');
  return c.redirect('/files');
});

filesRouter.post('/:fileId/approve', async (c) => {
  const id = c.req.param('fileId');
  await prisma.sourceFile.update({
    where: { id },
    data: { status: 'ReadyToMove' },
  });
  c.get('session').flash('success', 'File Approved');
  return c.redirect('/files');
});

filesRouter.get('/:fileId/match', zValidator('query', MatchPageState), async (c) => {
  const { isTv, search, tmdbId, seasonEpisode } = c.req.valid('query');

  return c.html(
    <Layout c={c}>
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
  c.get('session').flash('success', 'File Matched');
  return c.redirect('/files');
});
