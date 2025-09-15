import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { getRelativePath } from '../../../util/file';
import { FileMatchStatus } from '../components/FileMatchStatus';
import { Layout } from '../layouts/Layout';

const prisma = new PrismaClient();

export const FilesListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany({
    where: { status: { notIn: ['Completed', 'ReadyToMove', 'Error'] } },
    orderBy: { filePath: 'asc' },
  });

  const filesList = files.map((file) => {
    const hasMatch = Boolean(file.movieId || file.tvEpisodeId);
    return (
      <tr>
        <th scope='row'>{getRelativePath(file)}</th>
        <td>{file.fileType}</td>
        <td>{byteSize(Number(file.fileSize)).toString()}</td>
        <td>
          <FileMatchStatus file={file} />
        </td>
        <td>
          <div class='buttons is-flex-wrap-nowrap'>
            <a href={`/files/${file.id}/match`} class='button is-warning'>
              <i class='material-symbols-outlined'>edit</i>
            </a>
            <form method='post' action={`/files/${file.id}/approve`}>
              <button class='button is-success' disabled={!hasMatch} type='submit'>
                <i class='material-symbols-outlined'>check</i>
              </button>
            </form>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <Layout>
      <div class='is-flex is-justify-content-space-between is-align-items-center'>
        <h1 class='title'>Matching</h1>
        <details class='dropdown is-active'>
          <summary class='dropdown-trigger button'>Actions</summary>
          <div class='dropdown-menu'>
            <div class='dropdown-content'>
              <a class='dropdown-item' href='/files/refresh'>
                Refresh Files
              </a>
            </div>
          </div>
        </details>
      </div>
      <table class='table is-vcentered'>
        <thead>
          <tr>
            <th>File</th>
            <th>Type</th>
            <th>Size</th>
            <th>Match</th>
            <th />
          </tr>
        </thead>
        <tbody>{filesList}</tbody>
      </table>
    </Layout>
  );
};
