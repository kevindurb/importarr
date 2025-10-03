import type { FC } from 'hono/jsx';
import { FileDestinationPath } from '@/app/views/components/FileDestinationPath';
import { prisma } from '@/infrastructure/prisma';
import { getRelativePath } from '@/util/file';
import { Icon } from '../elements/Icon';

export const ImportListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany({
    where: { status: 'ReadyToMove' },
    orderBy: { filePath: 'asc' },
  });

  const filesList = files.map((file) => {
    return (
      <tr>
        <th scope='row'>{getRelativePath(file)}</th>
        <td>
          <FileDestinationPath file={file} />
        </td>
        <td>
          <form method='post' action={`/import/${file.id}`}>
            <button type='submit' class='button is-danger'>
              <Icon name='download' />
            </button>
          </form>
        </td>
      </tr>
    );
  });

  return (
    <>
      <div class='is-flex is-justify-content-space-between is-align-items-center'>
        <h1 class='title'>Import</h1>
        <details class='dropdown is-active'>
          <summary class='dropdown-trigger button'>Actions</summary>
          <div class='dropdown-menu'>
            <div class='dropdown-content'>
              <form method='post' action='/import/all' class='dropdown-item'>
                <button type='submit'>Import All</button>
              </form>
            </div>
          </div>
        </details>
      </div>
      <table class='table is-vcentered is-fullwidth'>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th />
          </tr>
        </thead>
        <tbody>{filesList}</tbody>
      </table>
    </>
  );
};
