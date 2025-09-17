import querystring from 'node:querystring';
import type { BodyInit } from 'bun';
import { getTmdbApiKey } from '@/util/env';

type SearchParams = Dict<
  string | number | bigint | boolean | readonly (string | number | bigint | boolean)[] | null
>;

const buildUrl = (path: string, searchParams?: SearchParams) =>
  new URL(
    searchParams ? `/3${path}?${querystring.stringify(searchParams)}` : `/3${path}`,
    'https://api.themoviedb.org',
  );

const fetchTmdb = async <ResponseBody>(
  path: string,
  method = 'GET',
  searchParams?: SearchParams,
  body?: BodyInit,
): Promise<ResponseBody> => {
  const response = await fetch(buildUrl(path, searchParams), {
    method,
    headers: {
      Authorization: `Bearer ${getTmdbApiKey()}`,
    },
    body,
  });

  if (response.ok) return (await response.json()) as ResponseBody;
  throw response;
};

export const getTmdb = <ResponseBody>(path: string, searchParams?: SearchParams) =>
  fetchTmdb<ResponseBody>(path, 'GET', searchParams);

export const postTmdb = <ResponseBody>(
  path: string,
  searchParams?: SearchParams,
  body?: BodyInit,
) => fetchTmdb<ResponseBody>(path, 'POST', searchParams, body);
