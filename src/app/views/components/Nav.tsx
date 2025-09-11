import type { FC } from 'hono/jsx';

export const Nav: FC = () => (
  <nav class='navbar navbar-expand fixed-top bg-body-tertiary'>
    <div class='container'>
      <a class='navbar-brand' href='/'>
        Importarr
      </a>

      <div class='navbar-nav'>
        <div class='nav-item'>
          <a class='nav-link' href='/files'>
            Matching
          </a>
        </div>
        <div class='nav-item'>
          <a class='nav-link' href='/import'>
            Import
          </a>
        </div>
      </div>
    </div>
  </nav>
);
