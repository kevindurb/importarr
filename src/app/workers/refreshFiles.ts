import { refreshUnmatchedFiles } from '@/domain/autoMatcher';
import { type File, getAllFilesInDir } from '@/infrastructure/filesService';
import { prisma } from '@/infrastructure/prisma';

declare var self: Worker;

const addNewFiles = async (files: File[]) => {
  console.log('Creating new files...');
  for (const { filePath, fileSize, fileType } of files) {
    const existingSourceFile = await prisma.sourceFile.findUnique({
      where: { filePath },
    });
    if (!existingSourceFile) {
      console.log('Creating source file', {
        filePath,
        fileSize,
        fileType,
      });
      await prisma.sourceFile.create({
        data: {
          filePath,
          fileSize,
          fileType,
          status: 'PendingIdentification',
        },
      });
    }
  }
};

const markMissingFiles = async (files: File[]) => {
  console.log('Deleting missing files...');

  await prisma.sourceFile.updateMany({
    where: {
      filePath: {
        notIn: files.map(({ filePath }) => filePath),
      },
      status: {
        not: 'Completed',
      },
    },
    data: {
      status: 'Missing',
    },
  });
};

self.onmessage = async (event: MessageEvent<{ sourcePath: string }>) => {
  console.log('Starting refresh');
  const files = await getAllFilesInDir(event.data.sourcePath);
  await addNewFiles(files);
  await markMissingFiles(files);
  console.log('Found files', files);
  await refreshUnmatchedFiles();
  console.log('Done refreshing files');
};
