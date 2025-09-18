import type { HonoRequest } from 'hono';
import { html } from 'hono/html';
import type { FC, PropsWithChildren } from 'hono/jsx';
import { Nav } from '@/app/views/components/Nav';
import { IconStylesheetLink } from '../elements/Icon';

type Props = PropsWithChildren & {
  req: HonoRequest;
};

export const Layout: FC<Props> = ({ children, req }) => html`
  <!doctype html>
  ${(
    <html lang='en' data-bs-theme='dark'>
      <head>
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='color-scheme' content='light dark' />
        <IconStylesheetLink />
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css' />
      </head>
      <body class='has-navbar-fixed-top'>
        <Nav req={req} />
        <main class='container my-4'>{children}</main>
      </body>
    </html>
  )}
`;
