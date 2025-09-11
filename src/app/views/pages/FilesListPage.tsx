import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { getMetadataForSourceFile, isTv } from '../../../domain/metadata';
import { FileMatchStatus } from '../components/FileMatchStatus';
import { Layout } from '../layouts/Layout';

const prisma = new PrismaClient();

export const FilesListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany();

  const filesList = files.map(async (file) => {
    const metadata = getMetadataForSourceFile(file);
    return (
      <tr>
        <th scope='row'>{metadata.title}</th>
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
        <td></td>
      </tr>
    );
  });

  return (
    <Layout>
      <nav>
        <ul>
          <li>
            <h1>Files</h1>
          </li>
        </ul>
        <ul>
          <li>
            <details class='dropdown'>
              <summary>Actions</summary>
              <ul>
                <li>
                  <a href='/files/refresh'>Refresh Files</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Meta</th>
            <th>Type</th>
            <th>Size</th>
            <th>Match</th>
            <th />
          </tr>
        </thead>
        <tbody>{await Promise.all(filesList)}</tbody>
      </table>
    </Layout>
  );
};
