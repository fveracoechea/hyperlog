import { useState } from 'react';

import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={clsx(
        'group flex items-center transition-colors',
        'border-border bg-cpt-surface0 hover:border-cpt-blue w-12 rounded-full border',
      )}
      title="Toggle theme"
    >
      <span
        className={cn(
          'pointer-events-none flex items-center justify-center rounded-full bg-white transition-transform',
          'h-6 w-6',
          isDark ? 'translate-x-[21px]' : 'translate-x-[0px]',
        )}
      >
        {isDark ? (
          <Moon className="group-hover:stroke-cpt-blue h-4 w-4" />
        ) : (
          <Sun className="group-hover:stroke-cpt-blue h-4 w-4" />
        )}
      </span>
    </button>
  );
}
