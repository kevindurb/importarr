import { getSourcePath } from '@/util/env';

const worker = new Worker(new URL('../workers/refreshFiles.ts', import.meta.url).href);

export const refreshFiles = () => {
  const sourcePath = getSourcePath();
  worker.postMessage({ sourcePath });
};
