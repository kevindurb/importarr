import type { Context, HonoRequest } from 'hono';
import { html } from 'hono/html';
import type { FC, PropsWithChildren } from 'hono/jsx';
import { Nav } from '@/app/views/components/Nav';
import { IconStylesheetLink } from '../elements/Icon';

type Props = PropsWithChildren & {
  c: Context;
};

export const Layout: FC<Props> = ({ children, c }) => {
  const notifications = c.flash.get();
  const successNotifications = notifications.SUCCESS ?? [];

  return html`
    <!doctype html>
    ${(
      <html lang='en' data-bs-theme='dark'>
        <head>
          <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='color-scheme' content='light dark' />
          <IconStylesheetLink />
          <link
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css'
          />
          <link
            rel='stylesheet'
            href='https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
          />
        </head>
        <body class='has-navbar-fixed-top'>
          <Nav req={c.req} />
          <main class='container my-4'>{children}</main>
          <div
            class='is-flex is-flex-direction-column'
            style={{ position: 'fixed', bottom: '16px', right: '16px' }}
          >
            {successNotifications.map((msg) => (
              <div
                class='notification is-success'
                style={{
                  animation: 'fadeOutRight forwards',
                  'animation-duration': '1s',
                  'animation-delay': '5s',
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        </body>
      </html>
    )}
  `;
};
