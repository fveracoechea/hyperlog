import { Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from 'remix-themes';

import { Button } from '../ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  const isDark = theme === Theme.DARK;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        setTheme(isDark ? Theme.LIGHT : Theme.DARK);
      }}
    >
      {isDark ? (
        <Moon className="stroke-cpt-flamingo group-hover:stroke-cpt-blue min-h-5 min-w-5" />
      ) : (
        <Sun className="stroke-cpt-flamingo group-hover:stroke-cpt-blue min-h-5 min-w-5" />
      )}
      <span>Theme</span>
    </Button>
  );
}
