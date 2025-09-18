import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import type z from 'zod';
import { CreateMatchBody, type SeasonEpisode } from '@/app/validators/CreateMatchBody';
import { prisma } from '@/infrastructure/prisma';
import { tmdb } from '@/infrastructure/tmdb';
import { getRelativePath } from '@/util/file';
import { isTvSeries } from '@/util/tmdb';

type Props = {
  fileId: string;
  isTv: boolean;
  tmdbId: number;
  seasonEpisode?: z.infer<typeof SeasonEpisode>;
};

export const ConfirmStep: FC<Props> = async ({ fileId, isTv, tmdbId, seasonEpisode }) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
  });
  const item = isTv
    ? await tmdb.tvSeriesDetails({ seriesId: tmdbId })
    : await tmdb.movieDetails({ movieId: tmdbId });

  const season = isTv
    ? await tmdb.tvSeasonDetails({ seriesId: tmdbId, seasonNumber: seasonEpisode?.season! })
    : undefined;
  const episode = season?.episodes?.find(
    (episode) => episode.episode_number === seasonEpisode?.episode,
  );

  return (
    <form method='post' action={`/files/${fileId}/match`}>
      <input type='hidden' name='isTv' value={CreateMatchBody.shape.isTv.encode(isTv)} />
      <input type='hidden' name='tmdbId' value={CreateMatchBody.shape.tmdbId.encode(tmdbId)} />
      <input
        type='hidden'
        name='seasonEpisode'
        value={CreateMatchBody.shape.seasonEpisode.encode(seasonEpisode)}
      />
      <h2 class='subtitle'>Are you sure?</h2>
      <div class='columns is-align-items-center'>
        <div class='column is-fullwidth-mobile'>
          <div class='card'>
            <div class='card-content'>
              <h2 class='subtitle'>{getRelativePath(file)}</h2>
              <table class='table'>
                <tbody>
                  <tr>
                    <th scope='col'>Size</th>
                    <td>{byteSize(Number(file.fileSize)).toString()}</td>
                  </tr>
                  <tr>
                    <th scope='col'>Type</th>
                    <td>{file.fileType}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class='column is-fullwidth-mobile'>
          <div class='card'>
            <div class='card-content'>
              <h2 class='subtitle'>
                {isTvSeries(item) ? item.name : item.title}
                {seasonEpisode && ` S${seasonEpisode.season} E${seasonEpisode.episode}`}
              </h2>
              {episode && <p class='subtitle is-size-5'>{episode.name}</p>}
              <table class='table'>
                <tbody>
                  <tr>
                    <th scope='col'>Release Date</th>
                    <td>
                      {isTvSeries(item)
                        ? (episode?.air_date ?? item.first_air_date)
                        : item.release_date}
                    </td>
                  </tr>
                  <tr>
                    <th scope='col'>Genres</th>
                    <td>
                      <div class='tags'>
                        {item.genres?.map(({ name }) => (
                          <div class='tag is-dark'>{name}</div>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>{item.overview}</p>
            </div>
          </div>
        </div>
      </div>
      <div class='buttons is-justify-content-center'>
        <button type='submit' class='button is-danger'>
          Confirm
        </button>
        <a href='/files' class='button is-secondary'>
          Cancel
        </a>
      </div>
    </form>
  );
};
