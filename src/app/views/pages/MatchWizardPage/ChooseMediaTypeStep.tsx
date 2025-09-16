import type { FC } from 'hono/jsx';

export const ChooseMediaTypeStep: FC = () => {
  return (
    <>
      <h2 class='subtitle'>Movie or TV Series?</h2>
      <div class='buttons'>
        <button class='button is-primary' type='submit' name='isTv' value='1'>
          TV Series
        </button>
        <button class='button is-primary' type='submit' name='isTv' value='0'>
          Movie
        </button>
      </div>
    </>
  );
};
