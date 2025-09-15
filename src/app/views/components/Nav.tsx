import type { FC } from 'hono/jsx';

export const Nav: FC = () => (
  <nav class='navbar is-fixed-top'>
    <div class='navbar-brand'>
      <a class='navbar-item' href='/'>
        Importarr
      </a>
    </div>

    <div class='navbar-menu'>
      <div class='navbar-start'>
        <a class='navbar-item' href='/files'>
          Matching
        </a>
        <a class='navbar-item' href='/import'>
          Import
        </a>
      </div>
    </div>
  </nav>
);
