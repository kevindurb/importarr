import type { FC } from 'hono/jsx';
import { MatchPageState } from '@/app/validators/matchPageState';
import { searchMovies, searchTv } from '@/infrastructure/tmdb/tmdbService';
import { isTvSeries } from '@/infrastructure/tmdb/types';

type Props = {
  fileId: number;
  isTv: boolean;
  search?: string;
};

export const SearchTmdbStep: FC<Props> = async ({ fileId, isTv, search }) => {
  const results = search ? (isTv ? await searchTv(search) : await searchMovies(search)) : undefined;

  const searchResultItems = results?.results.map((item) => {
    if (isTvSeries(item)) {
      return <div>{item.name}</div>;
    }
    return <div>{item.title}</div>;
  });

  return (
    <>
      <form method='get' action={`/files/${fileId}/match`}>
        <input type='hidden' name='isTv' value={MatchPageState.shape.isTv.encode(isTv)} />
        <h2 class='subtitle'>Search TMDB</h2>
        <div class='field has-addons'>
          <div class='control is-flex-grow-1'>
            <input
              class='input'
              type='text'
              name='search'
              value={MatchPageState.shape.search.encode(search)}
            />
          </div>
          <div class='control'>
            <button type='submit' class='button is-info'>
              Search
            </button>
          </div>
        </div>
      </form>
      {searchResultItems}
    </>
  );
};
