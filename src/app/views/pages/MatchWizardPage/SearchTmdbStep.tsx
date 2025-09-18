import type { FC } from 'hono/jsx';
import { MatchPageState } from '@/app/validators/MatchPageState';
import { getMetadataForSourceFile } from '@/domain/metadata';
import { prisma } from '@/infrastructure/prisma';
import { tmdb } from '@/infrastructure/tmdb';
import { isTvSeries } from '@/util/tmdb';

type Props = {
  fileId: string;
  isTv: boolean;
  search?: string;
};

export const SearchTmdbStep: FC<Props> = async ({ fileId, isTv, search: propsSearch }) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({ where: { id: fileId } });
  const metadata = getMetadataForSourceFile(file);
  const defaultSearch = metadata.title;

  const search = propsSearch === undefined ? defaultSearch : propsSearch;
  const results = search
    ? isTv
      ? await tmdb.searchTv({ query: search })
      : await tmdb.searchMovie({ query: search })
    : undefined;

  const renderChooseButton = (id?: number) => (
    <button
      class='button is-dark'
      type='submit'
      name='tmdbId'
      value={MatchPageState.shape.tmdbId.encode(id)}
    >
      Choose
    </button>
  );

  const searchResultItems = results?.results?.map((item) => {
    if (isTvSeries(item)) {
      return (
        <tr>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.first_air_date}</td>
          <td>{renderChooseButton(item.id)}</td>
        </tr>
      );
    }
    return (
      <tr>
        <td>{item.id}</td>
        <td>{item.title}</td>
        <td>{item.release_date}</td>
        <td>{renderChooseButton(item.id)}</td>
      </tr>
    );
  });

  return (
    <>
      <form method='get' action={`/files/${fileId}/match`}>
        <input type='hidden' name='isTv' value={MatchPageState.shape.isTv.encode(isTv)} />
        <h2 class='subtitle'>Search TMDB</h2>
        <div class='field has-addons'>
          <div class='control is-flex-grow-1'>
            <input
              autofocus
              required
              minlength={2}
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
      <form method='get' action={`/files/${fileId}/match`}>
        <input type='hidden' name='isTv' value={MatchPageState.shape.isTv.encode(isTv)} />
        <table class='table is-fullwidth'>
          <thead>
            <tr>
              <td>id</td>
              <td>Name</td>
              <td>Release Date</td>
              <td></td>
            </tr>
          </thead>
          <tbody>{searchResultItems}</tbody>
        </table>
      </form>
    </>
  );
};
