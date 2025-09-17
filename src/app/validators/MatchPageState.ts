import z from 'zod';
import { stringToInt } from '../../util/zod';

export const MatchPageState = z.object({
  isTv: z.stringbool().optional(),
  search: z.string().optional(),
  tmdbId: stringToInt.optional(),
  seasonNumber: stringToInt.optional(),
  episodeNumber: stringToInt.optional(),
});
