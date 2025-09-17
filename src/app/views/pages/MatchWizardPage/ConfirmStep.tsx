import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import { PrismaClient } from '@/../prisma/generated/prisma';
import { MatchPageState } from '@/app/validators/MatchPageState';
import { DefaultService as Tmdb } from '@/generated/tmdb';
import { getRelativePath } from '@/util/file';
import { isTvSeries } from '@/util/tmdb';

type Props = {
  fileId: string;
  isTv: boolean;
  tmdbId: number;
  episodeNumber?: number;
  seasonNumber?: number;
};

const prisma = new PrismaClient();

export const ConfirmStep: FC<Props> = async ({
  fileId,
  isTv,
  tmdbId,
  episodeNumber,
  seasonNumber,
}) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
  });
  const item = isTv
    ? await Tmdb.tvSeriesDetails({ seriesId: tmdbId })
    : await Tmdb.movieDetails({ movieId: tmdbId });

  return (
    <form method='post' action={`/files/${fileId}/match`}>
      <input type='hidden' name='isTv' value={MatchPageState.shape.isTv.encode(isTv)} />
      <input type='hidden' name='tmdbId' value={MatchPageState.shape.tmdbId.encode(tmdbId)} />
      <input
        type='hidden'
        name='episodeNumber'
        value={MatchPageState.shape.episodeNumber.encode(episodeNumber)}
      />
      <input
        type='hidden'
        name='seasonNumber'
        value={MatchPageState.shape.seasonNumber.encode(seasonNumber)}
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
              <h2 class='subtitle'>{isTvSeries(item) ? item.name : item.title}</h2>
              <table class='table'>
                <tbody>
                  <tr>
                    <th scope='col'>Release Date</th>
                    <td>{isTvSeries(item) ? item.first_air_date : item.release_date}</td>
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
