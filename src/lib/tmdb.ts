import querystring from "node:querystring";
import type { BodyInit } from "bun";

type SearchParams = Dict<
	| string
	| number
	| bigint
	| boolean
	| readonly (string | number | bigint | boolean)[]
	| null
>;

export type TmdbPaginatedResponse<Item> = {
	page: number;
	results: Item[];
};

export type TmdbMovieListItem = {
	id: number;
	title: string;
	release_date: string;
	poster_path: string;
};

export type TmdbTvListItem = {
	id: number;
	name: string;
	first_air_date: string;
	poster_path: string;
};

export type TmdbTvSeasonListItem = {
	id: number;
	name: string;
	overview: string;
	season_number: number;
};

export type TmdbTvSeasonDetails = TmdbTvSeasonListItem & {
	air_date: string;
	episodes: TmdbTvEpisode[];
};

export type TmdbTvEpisode = {
	air_date: string;
	episode_number: number;
	id: number;
	name: string;
	overview: string;
	season_number: number;
};

export type TmdbTvDetails = TmdbTvListItem & {
	number_of_episodes: number;
	number_of_seasons: number;
	seasons: TmdbTvSeasonListItem[];
};

const buildUrl = (path: string, searchParams?: SearchParams) =>
	new URL(
		searchParams
			? `/3${path}?${querystring.stringify(searchParams)}`
			: `/3${path}`,
		"https://api.themoviedb.org",
	);

const getApiKey = () => process.env.TMDB_API_KEY;

const fetchTmdb = async (
	path: string,
	method = "GET",
	searchParams?: SearchParams,
	body?: BodyInit,
): Promise<any> => {
	const response = await fetch(buildUrl(path, searchParams), {
		method,
		headers: {
			Authorization: `Bearer ${getApiKey()}`,
		},
		body,
	});

	if (response.ok) return response.json();
	throw response;
};

export const getTmdb = (path: string, searchParams?: SearchParams) =>
	fetchTmdb(path, "GET", searchParams);
export const postTmdb = (
	path: string,
	searchParams?: SearchParams,
	body?: BodyInit,
) => fetchTmdb(path, "POST", searchParams, body);

export const searchMovies = (
	query: string,
): Promise<TmdbPaginatedResponse<TmdbMovieListItem>> =>
	getTmdb("/search/movie", { query });

export const searchTv = (
	query: string,
): Promise<TmdbPaginatedResponse<TmdbTvListItem>> =>
	getTmdb("/search/tv", { query });

export const getTvDetails = (seriesId: number): Promise<TmdbTvDetails> =>
	getTmdb(`/tv/${seriesId}`);

export const getTvSeasonDetails = (
	seriesId: number,
	seasonNumber: number,
): Promise<TmdbTvSeasonDetails> =>
	getTmdb(`/tv/${seriesId}/season/${seasonNumber}`);
