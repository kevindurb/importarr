import type { FC } from 'hono/jsx';
import type { SourceFile } from '@/generated/prisma';
import { prisma } from '@/infrastructure/prisma';

type Props = {
  file: SourceFile;
};

export const FileMatchStatus: FC<Props> = async ({ file }) => {
  if (file.movieId) {
    const movie = await prisma.movie.findUniqueOrThrow({
      where: { id: file.movieId },
    });
    return <>{movie.title}</>;
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
        {tvEpisode.series.name} {tvEpisode.episodeName}
        <span class='tag is-dark mx-1'>
          S{tvEpisode.seasonNumber}E{tvEpisode.episodeNumber}
        </span>
      </>
    );
  }
  return <>No Match Found</>;
};
