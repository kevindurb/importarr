import type { FC } from 'hono/jsx';
import { PrismaClient } from '@/../prisma/generated/prisma';
import { Layout } from '@/app/views/layouts/Layout';
import { getRelativePath } from '@/util/file';
import { ChooseEpisodeStep } from './ChooseEpisodeStep';
import { ChooseMediaTypeStep } from './ChooseMediaTypeStep';
import { ConfirmStep } from './ConfirmStep';
import { SearchTmdbStep } from './SearchTmdbStep';

type Props = {
  fileId: string;
  isTv?: boolean;
  search?: string;
  tmdbId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
};

const prisma = new PrismaClient();

export const MatchWizardPage: FC<Props> = async ({
  fileId,
  isTv,
  search,
  tmdbId,
  seasonNumber,
  episodeNumber,
}) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
  });
  const renderStep = () => {
    const atBeginning = isTv === undefined;
    const needsTmdbId = !tmdbId;
    const needsEpisodeChoice = isTv && !(seasonNumber && episodeNumber);
    const isReady = isTv ? tmdbId && episodeNumber && seasonNumber : tmdbId;

    if (atBeginning) {
      return <ChooseMediaTypeStep fileId={fileId} />;
    } else if (needsTmdbId) {
      return <SearchTmdbStep fileId={fileId} isTv={isTv} search={search} />;
    } else if (needsEpisodeChoice) {
      return <ChooseEpisodeStep tmdbId={tmdbId} />;
    } else if (isReady) {
      return (
        <ConfirmStep
          fileId={fileId}
          isTv={isTv}
          tmdbId={tmdbId}
          episodeNumber={episodeNumber}
          seasonNumber={seasonNumber}
        />
      );
    }
  };

  return (
    <Layout>
      <h1 class='title'>{getRelativePath(file)}</h1>
      {renderStep()}
    </Layout>
  );
};
