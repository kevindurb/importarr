import path from 'node:path';
import {
  type Movie,
  PrismaClient,
  type SourceFile,
  type TVEpisode,
} from '../../prisma/generated/prisma';
import { getLibraryMoviesPath, getLibraryTVShowsPath } from '../util/env';

const prisma = new PrismaClient();

const buildDestinationPathForMovie = (file: SourceFile, movie: Movie) => {
  const releaseDate = new Date(movie.releaseDate);

  const mediaName = `${movie.title} (${releaseDate.getFullYear()}) [tmdb=${movie.tmdbId}]`;

  return path.join(getLibraryMoviesPath(), mediaName, `${mediaName}${path.extname(file.filePath)}`);
};

const buildDestinationPathForTvEpisode = async (file: SourceFile, tvEpisode: TVEpisode) => {
  const tvSeries = await prisma.tVSeries.findUniqueOrThrow({
    where: { id: tvEpisode.tvSeriesId },
  });
  const releaseDate = new Date(tvSeries.seriesReleaseDate);

  return path.join(
    getLibraryTVShowsPath(),
    `${tvSeries.name} (${releaseDate.getFullYear()}) [tmdb=${tvSeries.tmdbId}]`,
    `Season ${tvEpisode.seasonNumber}`,
    `${tvSeries.name} (${releaseDate.getFullYear()}) S${tvEpisode.seasonNumber}E${tvEpisode.episodeNumber} ${tvEpisode.episodeName} [tmdb=${tvSeries.tmdbId}]${path.extname(file.filePath)}`,
  );
};

export const buildDestinationPathForFile = async (
  file: SourceFile,
): Promise<string | undefined> => {
  if (file.movieId) {
    const movie = await prisma.movie.findUniqueOrThrow({
      where: { id: file.movieId },
    });
    return buildDestinationPathForMovie(file, movie);
  }

  if (file.tvEpisodeId) {
    const tvEpisode = await prisma.tVEpisode.findUniqueOrThrow({
      where: { id: file.tvEpisodeId },
    });
    return await buildDestinationPathForTvEpisode(file, tvEpisode);
  }
};
