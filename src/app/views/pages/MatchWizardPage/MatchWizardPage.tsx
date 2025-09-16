import type { FC } from 'hono/jsx';
import { PrismaClient } from '../../../../../prisma/generated/prisma';
import { getRelativePath } from '../../../../util/file';
import { Layout } from '../../layouts/Layout';
import { ChooseEpisodeStep } from './ChooseEpisodeStep';
import { ChooseMediaTypeStep } from './ChooseMediaTypeStep';
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
    if (isTv === undefined) {
      return <ChooseMediaTypeStep />;
    } else if (!tmdbId) {
      return <SearchTmdbStep isTv={isTv} search={search} />;
    } else if (isTv && !(seasonNumber && episodeNumber)) {
      return <ChooseEpisodeStep tmdbId={tmdbId} />;
    }
  };

  return (
    <Layout>
      <h1 class='title'>{getRelativePath(file)}</h1>
      <form method='get' action={`/files/${fileId}/match`}>
        <input type='hidden' name='isTv' value={isTv ? '1' : '0'} />
        {renderStep()}
      </form>
    </Layout>
  );
};
