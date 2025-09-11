import type { FC } from 'hono/jsx';
import type { SourceFile } from '../../../../prisma/generated/prisma';
import { buildDestinationPathForFile } from '../../../domain/libraryImporter';

type Props = {
  file: SourceFile;
};

export const FileDestinationPath: FC<Props> = async ({ file }) => {
  const destinationPath = await buildDestinationPathForFile(file);
  return <>{destinationPath}</>;
};
