import z from 'zod';
import { stringToInt } from '../../util/zod';
import { SeasonEpisode } from './CreateMatchBody';

export const MatchPageState = z.object({
  isTv: z.stringbool().optional(),
  search: z.string().optional(),
  tmdbId: stringToInt.optional(),
  seasonEpisode: SeasonEpisode.optional(),
});
