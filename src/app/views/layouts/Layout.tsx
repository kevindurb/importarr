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
        <link rel='stylesheet' href='bootstrap/dist/css/bootstrap.min.css' />
        <link rel='stylesheet' href='bootstrap-icons/font/bootstrap-icons.min.css' />
        <style>{`
          body {
            padding-top: 56px;
          }
        `}</style>
      </head>
      <body>
        <main class='container'>
          <Nav />
          {children}
        </main>
      </body>
    </html>
  )}
`;
