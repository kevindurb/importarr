import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { refreshUnmatchedFiles } from '../../domain/autoMatcher';
import { refreshFiles } from '../../domain/sourceFileImporter';
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

filesRouter.get('/:fileId/match', async (c) => {
  const isTv = c.req.query('isTv');
  return c.html(
    <MatchWizardPage
      fileId={c.req.param('fileId')}
      isTv={isTv === '1' ? true : isTv === '0' ? false : undefined}
      search={c.req.query('search')}
      tmdbId={Number.parseInt(c.req.query('tmdbId') ?? '0')}
      seasonNumber={Number.parseInt(c.req.query('seasonNumber') ?? '0')}
      episodeNumber={Number.parseInt(c.req.query('episodeNumber') ?? '0')}
    />,
  );
});

filesRouter.post(
  '/:fileId/match',
  zValidator(
    'form',
    z.union([
      z.object({
        tmdbId: z.string().transform((id) => Number.parseInt(id)),
        isTV: z.literal('1').transform(() => true as const),
        seasonNumber: z.string().transform((id) => Number.parseInt(id)),
        episodeNumber: z.string().transform((id) => Number.parseInt(id)),
      }),
      z.object({
        tmdbId: z.string().transform((id) => Number.parseInt(id)),
        isTV: z.literal('0').transform(() => false as const),
      }),
    ]),
  ),
  async (c) => {
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
  },
);
