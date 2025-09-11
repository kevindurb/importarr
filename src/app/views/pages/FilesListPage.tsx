import byteSize from 'byte-size';
import type { FC } from 'hono/jsx';
import { PrismaClient, type SourceFile } from '../../../../prisma/generated/prisma';
import { getMetadataForSourceFile, isTv } from '../../../domain/metadata';
import { Layout } from '../layouts/Layout';

const prisma = new PrismaClient();

export const FilesListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany();

  const renderMatch = (file: SourceFile) => {
    if (file.movieId) {
      return <h6>Movie Match!</h6>;
    }
    if (file.tvEpisodeId) {
      return <h6>TV Episode Match!</h6>;
    }
    return <i>No Match</i>;
  };

  const filesList = files.map((file) => {
    const metadata = getMetadataForSourceFile(file);
    return (
      <tr>
        <td>{metadata.title}</td>
        <td>
          {isTv(metadata)
            ? `S${metadata.seasons.join('')}E${metadata.episodeNumbers.join('')}`
            : ''}
        </td>
        <td>{file.fileType}</td>
        <td>{byteSize(Number(file.fileSize)).toString()}</td>
        <td>{renderMatch(file)}</td>
      </tr>
    );
  });

  return (
    <Layout>
      <h1>Files</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Meta</th>
            <th>Type</th>
            <th>Size</th>
            <th>Match</th>
          </tr>
        </thead>
        <tbody>{filesList}</tbody>
      </table>
    </Layout>
  );
};
