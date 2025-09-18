import assert from 'node:assert';
import path from 'node:path';
import type { SourceFile } from '@/generated/prisma';
import { prisma } from '@/infrastructure/prisma';
import { getLibraryMoviesPath, getLibraryTVShowsPath } from '@/util/env';

const buildDestinationPathForMovie = async (fileId: string) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
    include: { movie: true },
  });
  const movie = file.movie;
  assert(movie, 'Missing match for file import');

  const releaseDate = new Date(movie.releaseDate);

  const mediaName = `${movie.title} (${releaseDate.getFullYear()}) [tmdb=${movie.tmdbId}]`;

  return path.join(getLibraryMoviesPath(), mediaName, `${mediaName}${path.extname(file.filePath)}`);
};

const buildDestinationPathForTvEpisode = async (fileId: string) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
    include: {
      tvEpisode: {
        include: {
          series: true,
        },
      },
    },
  });
  const tvEpisode = file.tvEpisode;
  const tvSeries = file.tvEpisode?.series;
  assert(tvEpisode, 'Missing match for file import');
  assert(tvSeries, 'Missing match for file import');

  const releaseDate = new Date(tvSeries.seriesReleaseDate);

  return path.join(
    getLibraryTVShowsPath(),
    `${tvSeries.name} (${releaseDate.getFullYear()}) [tmdb=${tvSeries.tmdbId}]`,
    `Season ${tvEpisode.seasonNumber}`,
    `${tvSeries.name} (${releaseDate.getFullYear()}) S${tvEpisode.seasonNumber}E${tvEpisode.episodeNumber} ${tvEpisode.episodeName} [tmdb=${tvSeries.tmdbId}]${path.extname(file.filePath)}`,
  );
};

export const buildDestinationPathForFile = async (file: SourceFile): Promise<string> => {
  if (file.movieId) {
    return await buildDestinationPathForMovie(file.id);
  }

  if (file.tvEpisodeId) {
    return await buildDestinationPathForTvEpisode(file.id);
  }

  throw new Error('File not matched');
};
