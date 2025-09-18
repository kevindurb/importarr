import z from 'zod';
import { stringToInt } from '../../util/zod';

export const SeasonEpisode = z.codec(
  z.string(),
  z
    .object({
      season: z.number(),
      episode: z.number(),
    })
    .optional(),
  {
    encode: (value) => (value ? `${value.season}|${value.episode}` : ''),
    decode: (value) => {
      if (!value) return;
      const [season, episode] = value.split('|');
      return {
        season: Number.parseInt(season ?? '0'),
        episode: Number.parseInt(episode ?? '0'),
      };
    },
  },
);

export const CreateMatchBody = z.object({
  tmdbId: stringToInt,
  isTv: z.stringbool(),
  seasonEpisode: SeasonEpisode.optional(),
});
