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
