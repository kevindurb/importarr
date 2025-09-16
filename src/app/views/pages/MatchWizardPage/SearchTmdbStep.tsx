import type { FC } from 'hono/jsx';

type Props = {
  isTv: boolean;
  search?: string;
};

export const SearchTmdbStep: FC<Props> = ({ isTv, search }) => {
  console.log(isTv);
  return (
    <>
      <h2 class='subtitle'>Search TMDB</h2>
      <div class='field has-addons'>
        <div class='control is-flex-grow-1'>
          <input class='input' type='text' name='search' value={search} />
        </div>
        <div class='control'>
          <button type='submit' class='button is-info'>
            Search
          </button>
        </div>
      </div>
    </>
  );
};
