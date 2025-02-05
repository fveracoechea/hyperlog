import clsx from 'clsx';
import { Search, Unlink } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';

export function Header() {
  return (
    <header
      className={clsx(
        'bg-cpt-mantle flex items-center justify-between gap-8 px-8 py-4',
        'border-muted sticky top-0 z-30 border-b border-solid',
      )}
    >
      <div className="flex items-center gap-8">
        <div className="flex gap-2">
          <Unlink className="text-primary" />
          <Typography as="h1" variant="title">
            Hyperlog
          </Typography>
        </div>

        <nav>
          <ul className="flex list-none items-center justify-center gap-6">
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
