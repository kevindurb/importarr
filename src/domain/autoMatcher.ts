import { PrismaClient, type SourceFile } from '@/../prisma/generated/prisma';
import { DefaultService as Tmdb } from '@/generated/tmdb';
import {
  createMatchForSourceFileToMovie,
  createMatchForSourceFileToTVEpisode,
} from './createMatch';
import { getMetadataForSourceFile, isTv, type ParsedMovie, type ParsedShow } from './metadata';

const prisma = new PrismaClient();

const autoMatchTv = async (metadata: ParsedShow, sourceFile: SourceFile) => {
  const { results } = await Tmdb.searchTv({ query: metadata.title });
  const match = results?.at(0);
  if (!match) return;
  const seasonNumber = metadata.seasons.at(0) ?? 1;
  const episodeNumber = metadata.episodeNumbers.at(0) ?? 1;
  await createMatchForSourceFileToTVEpisode(sourceFile, match, seasonNumber, episodeNumber);
};

const autoMatchMovie = async (metadata: ParsedMovie, sourceFile: SourceFile) => {
  const { results } = await Tmdb.searchMovie({ query: metadata.title });
  const match = results?.at(0);
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
