import clsx from 'clsx';

import { Typography } from '../ui/typography';

export function Sidebar() {
  return (
    <aside
      className={clsx(
        'h-screen w-60',
        'bg-cpt-surface0 py-4 px-6 flex gap-4',
        'border-solid border-r border-cpt-surface1',
      )}
    >
      <div className="flex flex-col gap-4">
        <nav>
          <Typography>Collections</Typography>
          <ul className="flex flex-col gap-4">
            <li>Lorem</li>
            <li>Lorem</li>
            <li>Lorem</li>
          </ul>
        </nav>
        <nav className="flex flex-col gap-4">
          <Typography>Tags</Typography>
          <ul>
            <li>Lorem</li>
            <li>Lorem</li>
            <li>Lorem</li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
