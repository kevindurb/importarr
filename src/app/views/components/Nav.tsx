import clx from 'classnames';
import type { HonoRequest } from 'hono';
import type { FC } from 'hono/jsx';

type Props = {
  req: HonoRequest;
};

export const Nav: FC<Props> = ({ req }) => (
  <nav class='navbar is-fixed-top'>
    <div class='navbar-brand'>
      <a class='navbar-item is-size-5 has-text-weight-bold has-text-primary' href='/'>
        <i class='material-symbols-outlined'>download</i>
        Importarr
      </a>
    </div>

    <div class='navbar-menu'>
      <div class='navbar-start'>
        <a
          class={clx('navbar-item', { 'is-selected': req.path.startsWith('/files') })}
          href='/files'
        >
          Matching
        </a>
        <a
          class={clx('navbar-item', { 'is-selected': req.path.startsWith('/import') })}
          href='/import'
        >
          Import
        </a>
      </div>
    </div>
  </nav>
);
