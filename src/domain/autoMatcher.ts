import { PrismaClient, type SourceFile, type TVSeries } from '../../prisma/generated/prisma';
import {
  getTvDetails,
  getTvSeasonDetails,
  searchMovies,
  searchTv,
} from '../infrastructure/tmdb/tmdbService';
import type { TmdbMovieListItem, TmdbTvListItem } from '../infrastructure/tmdb/types';
import { getMetadataForSourceFile, isTv, type ParsedMovie, type ParsedShow } from './metadata';

const prisma = new PrismaClient();

const createMatchForSourceFileToMovie = async (
  sourceFile: SourceFile,
  tmdbMovie: TmdbMovieListItem,
) => {
  const existingMovie = await prisma.movie.findUnique({
    where: { tmdbId: tmdbMovie.id },
  });

  if (existingMovie) {
    await prisma.sourceFile.update({
      where: { id: sourceFile.id },
      data: { movieId: existingMovie.id, status: 'NeedsConfirmation' },
    });
  } else {
    const movie = await prisma.movie.create({
      data: {
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        releaseDate: new Date(tmdbMovie.release_date),
      },
    });

    await prisma.sourceFile.update({
      where: { id: sourceFile.id },
      data: { movieId: movie.id, status: 'NeedsConfirmation' },
    });
  }
};

const upsertAllEpisodesForSeries = async (tmdbId: number, tvSeries: TVSeries) => {
  const tvDetails = await getTvDetails(tmdbId);
  const seasons = await Promise.all(
    tvDetails.seasons.map((season) => getTvSeasonDetails(tmdbId, season.season_number)),
  );

  const allEpisodes = seasons.flatMap(({ episodes }) => episodes);

  await prisma.tVEpisode.createMany({
    data: allEpisodes.map((episode) => ({
      episodeName: episode.name,
      seasonNumber: episode.season_number,
      episodeNumber: episode.episode_number,
      tvSeriesId: tvSeries.id,
    })),
  });
};

const createMatchForSourceFileToTVEpisode = async (
  sourceFile: SourceFile,
  tmdbTv: TmdbTvListItem,
  seasonNumber: number,
  episodeNumber: number,
) => {
  const series = await prisma.tVSeries.upsert({
    where: {
      tmdbId: tmdbTv.id,
    },
    update: {},
    create: {
      tmdbId: tmdbTv.id,
      name: tmdbTv.name,
      seriesReleaseDate: new Date(tmdbTv.first_air_date),
    },
  });

  let episode = await prisma.tVEpisode.findFirst({
    where: {
      seasonNumber,
      episodeNumber,
      tvSeriesId: series.id,
    },
  });

  if (!episode) {
    await upsertAllEpisodesForSeries(tmdbTv.id, series);
    episode = await prisma.tVEpisode.findFirst({
      where: {
        seasonNumber,
        episodeNumber,
        tvSeriesId: series.id,
      },
    });
  }

  if (!episode) throw new Error('error finding episode after creating');

  await prisma.sourceFile.update({
    where: { id: sourceFile.id },
    data: { tvEpisodeId: episode.id, status: 'NeedsConfirmation' },
  });
};

const autoMatchTv = async (metadata: ParsedShow, sourceFile: SourceFile) => {
  const { results } = await searchTv(metadata.title);
  const match = results.at(0);
  if (!match) return;
  const seasonNumber = metadata.seasons.at(0) ?? 1;
  const episodeNumber = metadata.episodeNumbers.at(0) ?? 1;
  await createMatchForSourceFileToTVEpisode(sourceFile, match, seasonNumber, episodeNumber);
};

const autoMatchMovie = async (metadata: ParsedMovie, sourceFile: SourceFile) => {
  const { results } = await searchMovies(metadata.title);
  const match = results.at(0);
  if (!match) return;
  await createMatchForSourceFileToMovie(sourceFile, match);
};

export const autoMatchFile = async (sourceFile: SourceFile) => {
  const metadata = getMetadataForSourceFile(sourceFile);
  if (isTv(metadata)) {
    await autoMatchTv(metadata, sourceFile);
  } else {
    await autoMatchMovie(metadata, sourceFile);
  }
};

export const refreshUnmatchedFiles = async () => {
  const unmatchedFiles = await prisma.sourceFile.findMany({
    where: {
      tvEpisodeId: null,
      movieId: null,
    },
  });

  console.log('Finding matches for unmatched files', unmatchedFiles.length);

  for (const sourceFile of unmatchedFiles) {
    await autoMatchFile(sourceFile);
  }
};
