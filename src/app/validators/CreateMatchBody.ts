import z from 'zod';
import { stringToInt } from '../../util/zod';

export const CreateMatchBody = z.union([
  z.object({
    tmdbId: stringToInt,
    isTv: z.stringbool(),
    seasonNumber: stringToInt,
    episodeNumber: stringToInt,
  }),
  z.object({
    tmdbId: stringToInt,
    isTv: z.stringbool(),
  }),
]);
