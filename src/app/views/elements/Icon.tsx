import querystring from 'node:querystring';
import type { FC } from 'hono/jsx';

const iconNames = [
  'arrow_forward',
  'check',
  'delete',
  'download',
  'edit',
  'link_off',
  'movie',
  'refresh',
  'tv',
  'undo',
] as const;
type IconName = (typeof iconNames)[number];

type Props = {
  name: IconName;
};

export const Icon: FC<Props> = ({ name }) => <i class='material-symbols-outlined'>{name}</i>;

const iconQueryString = querystring.stringify({
  family: 'Material Symbols Outlined',
  icon_names: iconNames.join(','),
  display: 'block',
});

const ICON_BASE_URL = `https://fonts.googleapis.com/icon?&${iconQueryString}`;

export const IconStylesheetLink: FC = () => <link href={ICON_BASE_URL} rel='stylesheet' />;
