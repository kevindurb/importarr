import fs from 'node:fs/promises';
import path from 'node:path';
import type { SourceFile } from '@/generated/prisma';
import { prisma } from '@/infrastructure/prisma';
import { buildDestinationPathForFile } from './destinationPath';

export const importFileToLibrary = async (file: SourceFile) => {
  const destinationPath = await buildDestinationPathForFile(file);
  console.log('Moving file', {
    src: file.filePath,
    dest: destinationPath,
  });
  const createdPath = await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  console.log('Created path', createdPath);

  await fs.rename(file.filePath, destinationPath);
  console.log('Done moving file');

  await prisma.sourceFile.update({ where: { id: file.id }, data: { status: 'Completed' } });
};
