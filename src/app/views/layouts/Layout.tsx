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
        <link rel='stylesheet' href='/public/pico.css' />
        <script src='/public/lucide.js' />
      </head>
      <body>
        <main class='container'>
          <Nav />
          {children}
        </main>
        <script>lucide.createIcons()</script>
      </body>
    </html>
  )}
`;
