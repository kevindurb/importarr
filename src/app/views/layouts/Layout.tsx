import type { FC } from 'hono/jsx';
import { Nav } from '../components/Nav';

export const Layout: FC = ({ children }) => (
  <>
    {'<!doctype html>'}
    <html lang='en'>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light dark' />
        <link
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css'
        />
      </head>
      <body>
        <main class='container'>
          <Nav />
          {children}
        </main>
      </body>
    </html>
  </>
);
