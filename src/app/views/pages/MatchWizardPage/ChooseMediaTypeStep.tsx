import type { FC } from 'hono/jsx';
import { MatchPageState } from '@/app/validators/MatchPageState';

type Props = {
  fileId: string;
};

export const ChooseMediaTypeStep: FC<Props> = ({ fileId }) => {
  return (
    <form method='get' action={`/files/${fileId}/match`}>
      <h2 class='subtitle'>Movie or TV Series?</h2>
      <div class='buttons'>
        <button
          class='button is-primary'
          type='submit'
          name='isTv'
          value={MatchPageState.shape.isTv.encode(true)}
        >
          TV Series
        </button>
        <button
          class='button is-primary'
          type='submit'
          name='isTv'
          value={MatchPageState.shape.isTv.encode(false)}
        >
          Movie
        </button>
      </div>
    </form>
  );
};
