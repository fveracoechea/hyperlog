import clsx from 'clsx';

import { Typography } from '../ui/typography';

export function Sidebar() {
  return (
    <aside
      className={clsx(
        'min-h-[calc(100vh-75px)] h-full w-72 sticky top-[75px]',
        'bg-cpt-mantle py-4 px-6 flex gap-4',
        'border-solid border-r border-muted',
      )}
    >
      <div className="flex flex-col gap-4">
        <nav>
          <Typography variant="base" className="font-light">
            Collections
          </Typography>
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
