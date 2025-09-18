import { PrismaClient, type SourceFile, type TVSeries } from '@/generated/prisma';
import { DefaultService as Tmdb } from '@/generated/tmdb';

const prisma = new PrismaClient();

type TmdbMovieListItem = NonNullable<
  Awaited<ReturnType<typeof Tmdb.searchMovie>>['results']
>[number];
type TmdbTvListItem = NonNullable<Awaited<ReturnType<typeof Tmdb.searchTv>>['results']>[number];

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
  const tvDetails = await Tmdb.tvSeriesDetails({ seriesId: tmdbId });
  const seasons = await Promise.all(
    tvDetails?.seasons?.map((season) =>
      Tmdb.tvSeasonDetails({
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
