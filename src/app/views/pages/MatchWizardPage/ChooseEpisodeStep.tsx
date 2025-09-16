import type { FC } from 'hono/jsx';

type Props = {
  tmdbId: number;
};

export const ChooseEpisodeStep: FC<Props> = ({ tmdbId }) => {
  return <h2 class='subtitle'>Choose Episode: {tmdbId}</h2>;
};
