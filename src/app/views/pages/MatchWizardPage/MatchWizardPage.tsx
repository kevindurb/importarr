import type { FC } from 'hono/jsx';
import type z from 'zod';
import type { SeasonEpisode } from '@/app/validators/CreateMatchBody';
import { prisma } from '@/infrastructure/prisma';
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
  seasonEpisode?: z.infer<typeof SeasonEpisode>;
};

export const MatchWizardPage: FC<Props> = async ({
  fileId,
  isTv,
  search,
  tmdbId,
  seasonEpisode,
}) => {
  const file = await prisma.sourceFile.findUniqueOrThrow({
    where: { id: fileId },
  });
  const renderStep = () => {
    const atBeginning = isTv === undefined;
    const needsTmdbId = !tmdbId;
    const needsEpisodeChoice = isTv && !seasonEpisode;
    const isReady = isTv ? tmdbId && seasonEpisode : tmdbId;

    if (atBeginning) {
      return <ChooseMediaTypeStep fileId={fileId} />;
    } else if (needsTmdbId) {
      return <SearchTmdbStep fileId={fileId} isTv={isTv} search={search} />;
    } else if (needsEpisodeChoice) {
      return <ChooseEpisodeStep fileId={fileId} tmdbId={tmdbId} />;
    } else if (isReady) {
      return (
        <ConfirmStep fileId={fileId} isTv={isTv} tmdbId={tmdbId} seasonEpisode={seasonEpisode} />
      );
    }
  };

  return (
    <>
      <h1 class='title'>{getRelativePath(file)}</h1>
      {renderStep()}
    </>
  );
};
