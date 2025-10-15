import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import { prisma } from '@/infrastructure/prisma';
import { getRelativePath } from '@/util/file';
import { Fab } from '../elements/Fab';
import { Icon } from '../elements/Icon';

export const FilesListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany({
    where: { status: { notIn: ['Completed', 'ReadyToMove', 'Error', 'Missing'] } },
    orderBy: { filePath: 'asc' },
    include: {
      movie: true,
      tvEpisode: {
        include: {
          series: true,
        },
      },
    },
  });

  const filesList = files.map((file) => {
    const hasMatch = Boolean(file.movieId || file.tvEpisodeId);
    return (
      <tr>
        <th scope='row'>{getRelativePath(file)}</th>
        <td>{file.fileType}</td>
        <td>{byteSize(Number(file.fileSize)).toString()}</td>
        <td>
          {file.movieId ? (
            <Icon name='movie' />
          ) : file.tvEpisodeId ? (
            <Icon name='tv' />
          ) : (
            <Icon name='link_off' />
          )}
        </td>
        <td>
          {file.movie ? (
            file.movie.title
          ) : file.tvEpisode?.series ? (
            <>
              {file.tvEpisode.series.name} {file.tvEpisode.episodeName}
              <span class='tag is-dark mx-1'>
                S{file.tvEpisode.seasonNumber}E{file.tvEpisode.episodeNumber}
              </span>
            </>
          ) : (
            'No Match Found'
          )}
        </td>
        <td>
          <div class='buttons is-flex-wrap-nowrap is-justify-content-flex-end'>
            <a href={`/files/${file.id}/match`} class='button is-dark'>
              <Icon name='edit' />
            </a>
            <form method='post' action={`/files/${file.id}/delete`}>
              <button class='button is-danger' type='submit'>
                <Icon name='delete' />
              </button>
            </form>
            <form method='post' action={`/files/${file.id}/approve`}>
              <button class='button is-success' disabled={!hasMatch} type='submit'>
                <Icon name='check' />
              </button>
            </form>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h1 class='title'>Matching</h1>
      <table class='table is-vcentered is-fullwidth'>
        <thead>
          <tr>
            <th>File</th>
            <th>Type</th>
            <th>Size</th>
            <th colspan={2}>Match</th>
            <th />
          </tr>
        </thead>
        <tbody>{filesList}</tbody>
      </table>
      <Fab href='/files/refresh'>
        <Icon name='refresh' />
      </Fab>
    </>
  );
};
