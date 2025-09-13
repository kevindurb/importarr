import type { FC } from 'hono/jsx';
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { getMetadataForSourceFile } from '../../../domain/metadata';
import { searchMovies, searchTv } from '../../../infrastructure/tmdb/tmdbService';
import { isTvSeries } from '../../../infrastructure/tmdb/types';
import { getRelativePath } from '../../../util/file';
import { Layout } from '../layouts/Layout';

type Props = {
  fileId: string;
  query?: string;
  isTv?: boolean;
};

const prisma = new PrismaClient();

export const FileMatchEditor: FC<Props> = async ({ fileId, query, isTv }) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
    include: {
      movie: true,
      tvEpisode: true,
    },
  });
  const metadata = getMetadataForSourceFile(file);

  let resultCards: Element[] = [];
  if (query) {
    const { results } = await (isTv ? searchTv : searchMovies)(query);
    resultCards = results.map((result) => {
      const title = isTvSeries(result) ? result.name : result.title;

      return (
        <div class='col d-flex align-items-stretch'>
          <div class='card bg-secondary'>
            <img
              src={
                result.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                  : `https://placehold.co/500x750?text=${encodeURIComponent(title)}`
              }
              class='card-img-top ratio overflow-hidden'
              style='--bs-aspect-ratio: 150%'
              alt={title}
            />
            <form
              method='post'
              action={`/files/${fileId}/match`}
              class='card-img-overlay d-flex justify-content-end align-items-start'
            >
              <input type='hidden' name='isTv' value={isTv ? '1' : '0'} />
              <input type='hidden' name='tmdbId' value={result.id} />
              <button type='submit' class='btn btn-primary'>
                <i class='bi bi-check' />
              </button>
            </form>
          </div>
        </div>
      );
    });
  }

  return (
    <Layout>
      <div class='d-flex justify-content-between align-items-center'>
        <h1>{getRelativePath(file)}</h1>
      </div>
      <form method='get' action={`/files/${fileId}/match`}>
        <div class='input-group'>
          <input
            placeholder={metadata.title}
            type='text'
            class='form-control'
            name='query'
            value={query}
            required
          />
          <button type='submit' class='btn btn-primary'>
            <i class='bi bi-search' />
          </button>
        </div>
      </form>
      <div class='row row-cols-sm-1 row-cols-md-3 g-4 my-2'>{resultCards}</div>
    </Layout>
  );
};
