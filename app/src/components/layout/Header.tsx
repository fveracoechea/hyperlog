import clsx from 'clsx';
import { Unlink } from 'lucide-react';

import { Typography } from '../ui/typography';

export function Header() {
  return (
    <header
      className={clsx(
        'bg-cpt-mantle py-6 px-8 flex gap-8 justify-between',
        'border-solid border-b border-cpt-surface1',
      )}
    >
      <div className="flex gap-2">
        <Unlink className="text-primary" />
        <Typography variant="title">Hyperlog</Typography>
      </div>
      <nav>
        <ul className="flex items-center justify-center gap-6 list-none">
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
