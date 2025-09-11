import type { FC } from 'hono/jsx';
import { PrismaClient, type SourceFile } from '../../../../prisma/generated/prisma';

type Props = {
  file: SourceFile;
};

const prisma = new PrismaClient();

export const FileMatchStatus: FC<Props> = async ({ file }) => {
  if (file.movieId) {
    const movie = await prisma.movie.findUnique({
      where: { id: file.movieId },
    });
    return <b>{movie?.title}</b>;
  }
  if (file.tvEpisodeId) {
    const tvEpisode = await prisma.tVEpisode.findUnique({
      where: { id: file.tvEpisodeId },
      include: {
        series: true,
      },
    });
    return (
      <b>
        {tvEpisode?.series.name} {tvEpisode?.episodeName} S{tvEpisode?.seasonNumber} E
        {tvEpisode?.episodeNumber}
      </b>
    );
  }
  return <i class='bi bi-ban'></i>;
};
