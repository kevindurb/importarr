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
        <td></td>
      </tr>
    );
  });

  return (
    <Layout>
      <nav>
        <ul>
          <li>
            <h1>Import</h1>
          </li>
        </ul>
        <ul>
          <li>
            <details class='dropdown'>
              <summary>Actions</summary>
              <ul>
                <li>
                  <a href='/import/all'>Import All</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
      <table>
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
