import type { FC } from 'hono/jsx';

export const Nav: FC = () => (
  <nav>
    <ul>
      <li>
        <a href='/'>
          <strong>Importarr</strong>
        </a>
      </li>
    </ul>
    <ul>
      <li>
        <a href='/files'>Files</a>
      </li>
      <li>
        <a href='/matching'>Matching</a>
      </li>
      <li>
        <a href='/import'>Import</a>
      </li>
    </ul>
  </nav>
);
