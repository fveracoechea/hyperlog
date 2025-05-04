import { Moon, Sun } from "lucide-react";

import { Button } from "../ui/button";

export function ThemeToggle() {
  const isDark = true;

  return (
    <Button variant="ghost" size="sm" onClick={() => {}}>
      {isDark
        ? <Moon className="stroke-cpt-flamingo group-hover:stroke-cpt-blue min-h-5 min-w-5" />
        : <Sun className="stroke-cpt-flamingo group-hover:stroke-cpt-blue min-h-5 min-w-5" />}
      <span>Theme</span>
    </Button>
  );
}
