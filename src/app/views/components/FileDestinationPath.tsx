import type { FC } from 'hono/jsx';
import { buildDestinationPathForFile } from '@/domain/destinationPath';
import type { SourceFile } from '@/generated/prisma';

type Props = {
  file: SourceFile;
};

export const FileDestinationPath: FC<Props> = async ({ file }) => {
  const destinationPath = await buildDestinationPathForFile(file);
  return <>{destinationPath}</>;
};
