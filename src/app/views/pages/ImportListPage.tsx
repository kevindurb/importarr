import type { FC } from 'hono/jsx';
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { getRelativePath } from '../../../util/file';
import { Layout } from '../layouts/Layout';

const prisma = new PrismaClient();

export const ImportListPage: FC = async () => {
  const files = await prisma.sourceFile.findMany({
    where: { status: 'ReadyToMove' },
  });

  const filesList = files.map((file) => {
    return (
      <tr>
        <th scope='row'>{getRelativePath(file)}</th>
        <td>destination</td>
        <td>
          <div class='d-flex gap-2'>
            <form method='post' action={`/import/${file.id}`}>
              <button type='submit' class='btn btn-danger btn-sm'>
                <i class='bi bi-download' />
              </button>
            </form>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <Layout>
      <div class='d-flex justify-content-between align-items-center'>
        <h1>Import</h1>
        <details class='dropdown'>
          <summary class='btn btn-primary dropdown-toggle'>Actions</summary>
          <ul class='dropdown-menu show'>
            <li>
              <a class='dropdown-item' href='/import/all'>
                Import All
              </a>
            </li>
          </ul>
        </details>
      </div>
      <table class='table align-middle'>
        <thead>
          <tr>
            <th>Source</th>
            <th>Destination</th>
            <th />
          </tr>
        </thead>
        <tbody>{filesList}</tbody>
      </table>
    </Layout>
  );
};
