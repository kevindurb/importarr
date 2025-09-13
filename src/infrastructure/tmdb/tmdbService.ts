import { getTmdb } from './tmdbFetch';
import type {
  TmdbMovieDetails,
  TmdbMovieListItem,
  TmdbPaginatedResponse,
  TmdbTvDetails,
  TmdbTvListItem,
  TmdbTvSeasonDetails,
} from './types';

export const searchMovies = (query: string) =>
  getTmdb<TmdbPaginatedResponse<TmdbMovieListItem>>('/search/movie', { query });

export const searchTv = (query: string) =>
  getTmdb<TmdbPaginatedResponse<TmdbTvListItem>>('/search/tv', { query });

export const getTvDetails = (seriesId: number) => getTmdb<TmdbTvDetails>(`/tv/${seriesId}`);

export const getMovieDetails = (movieId: number) => getTmdb<TmdbMovieDetails>(`/movie/${movieId}`);

export const getTvSeasonDetails = (seriesId: number, seasonNumber: number) =>
  getTmdb<TmdbTvSeasonDetails>(`/tv/${seriesId}/season/${seasonNumber}`);
