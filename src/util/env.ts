export const getSourcePath = () => {
  const sourcePath = process.env.SOURCE_PATH;
  if (!sourcePath) throw new Error('SOURCE_PATH env var missing');
  return sourcePath;
};

export const getTmdbApiKey = () => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) throw new Error('TMDB_API_KEY env var missing');
  return apiKey;
};
