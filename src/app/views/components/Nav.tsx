import clx from 'classnames';
import type { HonoRequest } from 'hono';
import type { FC } from 'hono/jsx';
import { prisma } from '@/infrastructure/prisma';
import { Icon } from '../elements/Icon';

type Props = {
  req: HonoRequest;
};

export const Nav: FC<Props> = async ({ req }) => {
  const countToMatch = await prisma.sourceFile.count({
    where: { status: { notIn: ['Completed', 'ReadyToMove', 'Error', 'Missing'] } },
  });
  const countToImport = await prisma.sourceFile.count({
    where: { status: 'ReadyToMove' },
  });

  return (
    <nav class='navbar is-fixed-top is-dark'>
      <div class='navbar-brand'>
        <a class='navbar-item is-size-5 has-text-weight-bold has-text-primary' href='/'>
          <Icon name='download' />
          Importarr
        </a>
      </div>

      <div class='navbar-menu'>
        <div class='navbar-start'>
          <a
            class={clx('navbar-item', { 'has-text-primary': req.path.startsWith('/files') })}
            href='/files'
          >
            Matching
            {!!countToMatch && <div class='tag is-danger'>{countToMatch}</div>}
          </a>
          <a
            class={clx('navbar-item', { 'has-text-primary': req.path.startsWith('/import') })}
            href='/import'
          >
            Import
            {!!countToImport && <div class='tag is-danger'>{countToImport}</div>}
          </a>
        </div>
      </div>
    </nav>
  );
};
