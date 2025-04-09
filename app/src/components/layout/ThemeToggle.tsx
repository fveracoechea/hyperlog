import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  const isDark = theme === Theme.DARK;

  return (
    <button
      onClick={() => {
        setTheme(isDark ? Theme.LIGHT : Theme.DARK);
      }}
      className={clsx(
        'group flex items-center transition-colors',
        'border-border bg-cpt-surface0 hover:border-cpt-blue w-12 rounded-full border',
      )}
      title="Toggle theme"
    >
      <span
        className={cn(
          'pointer-events-none flex items-center justify-center rounded-full bg-white transition-transform',
          'bg-background h-6 w-6',
          isDark ? 'translate-x-[22px]' : 'translate-x-[0px]',
        )}
      >
        {isDark ? (
          <Moon className="stroke-cpt-yellow group-hover:stroke-cpt-blue h-4 w-4" />
        ) : (
          <Sun className="stroke-cpt-yellow group-hover:stroke-cpt-blue h-4 w-4" />
        )}
      </span>
    </button>
  );
}
