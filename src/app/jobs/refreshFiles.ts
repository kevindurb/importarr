import { Cron } from 'croner';
import { getSourcePath } from '@/util/env';

export const refreshFiles = () => {
  const worker = new Worker(new URL('../workers/refreshFiles.ts', import.meta.url).href);
  const sourcePath = getSourcePath();
  worker.postMessage({ sourcePath });
};

export const startSchedule = () => new Cron('0 * * * *', refreshFiles);
