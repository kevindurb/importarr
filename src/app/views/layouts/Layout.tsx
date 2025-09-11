import type { FC } from 'hono/jsx';
import { Nav } from '../components/Nav';

export const Layout: FC = ({ children }) => (
  <html lang='en'>
    <head>
      <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css' />
    </head>
    <body>
      <main class='container'>
        <Nav />
        {children}
      </main>
    </body>
  </html>
);
