import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { refreshUnmatchedFiles } from '../../domain/autoMatcher';
import { refreshFiles } from '../../domain/sourceFileImporter';
import { stringToInt } from '../../util/zod';
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

filesRouter.get(
  '/:fileId/match',
  zValidator(
    'param',
    z.object({
      isTv: z.stringbool().optional(),
      search: z.string().optional(),
      tmdbId: stringToInt.optional(),
      seasonNumber: stringToInt.optional(),
      episodeNumber: stringToInt.optional(),
    }),
  ),
  async (c) => {
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
  },
);

filesRouter.post(
  '/:fileId/match',
  zValidator(
    'form',
    z.union([
      z.object({
        tmdbId: stringToInt,
        isTV: z.stringbool(),
        seasonNumber: stringToInt,
        episodeNumber: stringToInt,
      }),
      z.object({
        tmdbId: stringToInt,
        isTV: z.stringbool(),
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
