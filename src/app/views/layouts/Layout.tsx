import { html } from 'hono/html';
import type { FC } from 'hono/jsx';
import { Nav } from '../components/Nav';

export const Layout: FC = ({ children }) => html`
  <!doctype html>
  ${(
    <html lang='en' data-bs-theme='dark'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light dark' />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/material-icons@1.13.14/iconfont/material-icons.min.css'
        />
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css' />
      </head>
      <body class='has-navbar-fixed-top'>
        <main class='container'>
          <Nav />
          {children}
        </main>
      </body>
    </html>
  )}
`;
