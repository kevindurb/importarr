import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { getMetadataForSourceFile, isTv } from '../../../domain/metadata';
import { getRelativePath } from '../../../util/file';
import { FileMatchStatus } from '../components/FileMatchStatus';
import { Layout } from '../layouts/Layout';

const prisma = new PrismaClient();

export const FilesListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany({
    where: { status: { notIn: ['Completed', 'ReadyToMove', 'Error'] } },
  });

  const filesList = files.map((file) => {
    const metadata = getMetadataForSourceFile(file);
    const hasMatch = Boolean(file.movieId || file.tvEpisodeId);
    return (
      <tr>
        <th scope='row'>{getRelativePath(file)}</th>
        <td>
          {isTv(metadata)
            ? `S${metadata.seasons.join('')}E${metadata.episodeNumbers.join('')}`
            : ''}
        </td>
        <td>{file.fileType}</td>
        <td>{byteSize(Number(file.fileSize)).toString()}</td>
        <td>
          <FileMatchStatus file={file} />
        </td>
        <td>
          <div class='d-flex gap-2'>
            <a href={`/files/${file.id}/match`} class='btn btn-warning btn-sm'>
              <i class='bi bi-pencil' />
            </a>
            <form method='post' action={`/files/${file.id}/approve`}>
              <button type='submit' class='btn btn-success btn-sm' disabled={!hasMatch}>
                <i class='bi bi-check' />
              </button>
            </form>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <Layout>
      <div class='d-flex justify-content-between align-items-center'>
        <h1>Matching</h1>
        <details class='dropdown'>
          <summary class='btn btn-primary dropdown-toggle'>Actions</summary>
          <ul class='dropdown-menu show'>
            <li>
              <a class='dropdown-item' href='/files/refresh'>
                Refresh Files
              </a>
            </li>
          </ul>
        </details>
      </div>
      <table class='table align-middle'>
        <thead>
          <tr>
            <th>File</th>
            <th>Meta</th>
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
