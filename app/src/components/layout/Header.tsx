import clsx from 'clsx';
import { Search, Unlink } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

export function Header() {
  return (
    <header
      className={clsx(
        'flex bg-cpt-mantle py-4 px-8 gap-8 items-center justify-between',
        'border-solid border-b border-muted sticky top-0 z-30',
      )}
    >
      <div className="flex gap-8 items-center">
        <div className="flex gap-2">
          <Unlink className="text-primary" />
          <Typography as="h1" variant="title">
            Hyperlog
          </Typography>
        </div>

        <nav>
          <ul className="flex items-center justify-center gap-6 list-none">
            <li>
              <Typography variant="nav" to="/">
                Home
              </Typography>
            </li>
            <li>
              <Typography variant="nav" to="/links">
                Links
              </Typography>
            </li>
            <li>
              <Typography variant="nav" to="/collections">
                Collections
              </Typography>
            </li>
            <li>
              <Typography variant="nav" to="/tags">
                Tags
              </Typography>
            </li>
          </ul>
        </nav>
      </div>

      <form method="GET" action="https://www.google.com/search" target="_blank">
        <Input
          autoComplete="off"
          autoFocus
          id="search-engine"
          icon={<Search className="stroke-primary" />}
          placeholder="Google search"
          name="q"
        />
      </form>
    </header>
  );
}
