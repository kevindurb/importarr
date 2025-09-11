import { html } from 'hono/html';
import type { FC } from 'hono/jsx';
import { Nav } from '../components/Nav';

export const Layout: FC = ({ children }) => html`
  <!doctype html>
  ${(
    <html lang='en'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light dark' />
        <link rel='stylesheet' href='@picocss/pico/css/pico.min.css' />
        <link rel='stylesheet' href='bootstrap-icons/font/bootstrap-icons.min.css' />
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
