import { Link } from 'react-router';

import clsx from 'clsx';

import { Typography } from '../ui/typography';

export function Header() {
  return (
    <header
      className={clsx(
        'bg-cpt-surface0 py-4 px-6 flex gap-4',
        'border-solid border-b border-cpt-surface1',
      )}
    >
      <Typography variant="title">Hyperlog</Typography>
      <nav>
        <ul className="flex items-center justify-center gap-4 list-none">
          <li>
            <Typography variant="nav" to="/">
              Links
            </Typography>
          </li>
          <li>
            <Typography variant="nav" to="/">
              Collections
            </Typography>
          </li>
          <li>
            <Typography variant="nav" to="/">
              Tags
            </Typography>
          </li>
        </ul>
      </nav>
    </header>
  );
}
