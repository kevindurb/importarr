import type { SourceFile, TVSeries } from '@/generated/prisma';
import { prisma } from '@/infrastructure/prisma';
import { tmdb } from '@/infrastructure/tmdb';

type TmdbMovieListItem = NonNullable<
  Awaited<ReturnType<typeof tmdb.searchMovie>>['results']
>[number];
type TmdbTvListItem = NonNullable<Awaited<ReturnType<typeof tmdb.searchTv>>['results']>[number];

export const createMatchForSourceFileToMovie = async (
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
        tmdbId: tmdbMovie.id!,
        title: tmdbMovie.title!,
        releaseDate: new Date(tmdbMovie.release_date!),
      },
    });

    await prisma.sourceFile.update({
      where: { id: sourceFile.id },
      data: { movieId: movie.id, status: 'NeedsConfirmation' },
    });
  }
};

const upsertAllEpisodesForSeries = async (tmdbId: number, tvSeries: TVSeries) => {
  const tvDetails = await tmdb.tvSeriesDetails({ seriesId: tmdbId });
  const seasons = await Promise.all(
    tvDetails?.seasons?.map((season) =>
      tmdb.tvSeasonDetails({
        seriesId: tmdbId,
        seasonNumber: season.season_number!,
      }),
    ) ?? [],
  );

  const allEpisodes = seasons.flatMap(({ episodes }) => episodes);

  await prisma.tVEpisode.createMany({
    data: allEpisodes.map((episode) => ({
      episodeName: episode?.name!,
      seasonNumber: episode?.season_number!,
      episodeNumber: episode?.episode_number!,
      tvSeriesId: tvSeries.id,
    })),
  });
};

export const createMatchForSourceFileToTVEpisode = async (
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
      tmdbId: tmdbTv.id!,
      name: tmdbTv.name!,
      seriesReleaseDate: new Date(tmdbTv.first_air_date!),
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
    await upsertAllEpisodesForSeries(tmdbTv.id!, series);
    episode = await prisma.tVEpisode.findFirstOrThrow({
      where: {
        seasonNumber,
        episodeNumber,
        tvSeriesId: series.id,
      },
    });
  }

  await prisma.sourceFile.update({
    where: { id: sourceFile.id },
    data: { tvEpisodeId: episode.id, status: 'NeedsConfirmation' },
  });
};

export const createMatchForSourceFile = async (
  file: SourceFile,
  tmdbId: number,
  isTv: boolean,
  season?: number,
  episode?: number,
) => {
  if (isTv) {
    if (!(season && episode)) throw new Error('TV match requires season and episode');
    const tvSeries = await tmdb.tvSeriesDetails({ seriesId: tmdbId });
    await createMatchForSourceFileToTVEpisode(file, tvSeries, season, episode);
  } else {
    const movie = await tmdb.movieDetails({ movieId: tmdbId });
    await createMatchForSourceFileToMovie(file, movie);
  }
};
