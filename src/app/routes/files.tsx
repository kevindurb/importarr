import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { PrismaClient } from '../../../prisma/generated/prisma';
import { refreshUnmatchedFiles } from '../../domain/autoMatcher';
import { refreshFiles } from '../../domain/sourceFileImporter';
import { FileMatchEditor } from '../views/pages/FileMatchEditor';
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

filesRouter.get('/:fileId/match', async (c) =>
  c.html(<FileMatchEditor fileId={c.req.param('fileId')} query={c.req.query('query')} />),
);

filesRouter.post(
  '/:fileId/match',
  zValidator(
    'form',
    z.union([
      z.object({
        tmdbId: z.string().transform((id) => Number.parseInt(id)),
        isTV: z.literal('1').transform(() => true as const),
        season: z.number(),
        episode: z.number(),
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
