import type { FC } from 'hono/jsx';
import { PrismaClient, type SourceFile } from '@/generated/prisma';

type Props = {
  file: SourceFile;
};

const prisma = new PrismaClient();

export const FileMatchStatus: FC<Props> = async ({ file }) => {
  if (file.movieId) {
    const movie = await prisma.movie.findUniqueOrThrow({
      where: { id: file.movieId },
    });
    return (
      <>
        <b>{movie.title}</b>
        <a href={`/files/${file.id}/match`}>Change Match</a>
      </>
    );
  }
  if (file.tvEpisodeId) {
    const tvEpisode = await prisma.tVEpisode.findUniqueOrThrow({
      where: { id: file.tvEpisodeId },
      include: {
        series: true,
      },
    });
    return (
      <>
        <a href={`/files/${file.id}/match`}>
          {tvEpisode.series.name} {tvEpisode.episodeName}
        </a>
        <span class='tag is-info mx-1'>S{tvEpisode.seasonNumber}</span>
        <span class='tag is-info mx-1'>E{tvEpisode.episodeNumber}</span>
      </>
    );
  }
  return <a href={`/files/${file.id}/match`}>Create Match</a>;
};
