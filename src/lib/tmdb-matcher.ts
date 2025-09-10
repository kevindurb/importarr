import path from "node:path";

import {
	PrismaClient,
	type SourceFile,
	type TVSeries,
} from "../../prisma/generated/prisma";
import { unique } from "./array";
import { getRelativePath } from "./file";
import {
	extractLeadingWords,
	looksLikeTVShow,
	parseEpisodeNumber,
	parseSeasonNumber,
	removeNonWordChars,
} from "./source-file";
import {
	getTvDetails,
	getTvSeasonDetails,
	searchMovies,
	searchTv,
	type TmdbMovieListItem,
	type TmdbTvListItem,
} from "./tmdb";

const prisma = new PrismaClient();

const getSearchStringsForSourceFile = (sourceFile: SourceFile) => {
	const parentDir = path.dirname(getRelativePath(sourceFile));
	const fileName = path.basename(
		sourceFile.filePath,
		path.extname(sourceFile.filePath),
	);
	return unique(
		[
			removeNonWordChars(parentDir),
			removeNonWordChars(fileName),
			extractLeadingWords(parentDir),
			extractLeadingWords(fileName),
		].filter(Boolean),
	);
};

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
			data: { movieId: existingMovie.id },
		});
	} else {
		const movie = await prisma.movie.create({
			data: {
				tmdbId: tmdbMovie.id,
				title: tmdbMovie.title,
				releaseDate: tmdbMovie.release_date,
			},
		});

		await prisma.sourceFile.update({
			where: { id: sourceFile.id },
			data: { movieId: movie.id },
		});
	}
};

const upsertAllEpisodesForSeries = async (
	tmdbId: number,
	tvSeries: TVSeries,
) => {
	const tvDetails = await getTvDetails(tmdbId);
	const seasons = await Promise.all(
		tvDetails.seasons.map((season) =>
			getTvSeasonDetails(tmdbId, season.season_number),
		),
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
			tmdbId: tmdbTv.id,
			name: tmdbTv.name,
			seriesReleaseDate: tmdbTv.first_air_date,
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

	if (!episode) throw new Error("error finding episode after creating");

	await prisma.sourceFile.update({
		where: { id: sourceFile.id },
		data: { tvEpisodeId: episode.id },
	});
};

export const findMovieMatchForSourceFile = async (sourceFile: SourceFile) => {
	const searchStrings = getSearchStringsForSourceFile(sourceFile);
	console.log("Search strings", searchStrings);

	const results = (
		await Promise.all(
			searchStrings.map(async (searchString) => {
				const response = await searchMovies(searchString);
				return response.results;
			}),
		)
	).flat();

	const match = results.at(0);
	if (!match) return;
	await createMatchForSourceFileToMovie(sourceFile, match);
};

export const findTvMatchForSourceFile = async (sourceFile: SourceFile) => {
	const searchStrings = getSearchStringsForSourceFile(sourceFile);
	console.log("Search strings", searchStrings);

	const results = (
		await Promise.all(
			searchStrings.map(async (searchString) => {
				const response = await searchTv(searchString);
				return response.results;
			}),
		)
	).flat();

	const match = results.at(0);
	if (!match) return;
	const seasonNumber = parseSeasonNumber(sourceFile) ?? 1;
	const episodeNumber = parseEpisodeNumber(sourceFile) ?? 1;
	await createMatchForSourceFileToTVEpisode(
		sourceFile,
		match,
		seasonNumber,
		episodeNumber,
	);
};

export const refreshUnmatchedFiles = async () => {
	const unmatchedFiles = await prisma.sourceFile.findMany({
		where: {
			tvEpisodeId: null,
			movieId: null,
		},
	});

	console.log("Finding matches for unmatched files", unmatchedFiles.length);

	for (const sourceFile of unmatchedFiles) {
		if (looksLikeTVShow(sourceFile)) {
			await findTvMatchForSourceFile(sourceFile);
		} else {
			await findMovieMatchForSourceFile(sourceFile);
		}
	}
};
