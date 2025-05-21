import { Moon, Sun } from "lucide-react";

import { Button } from "../ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark
        ? <Moon className="stroke-cpt-mauve group-hover:stroke-cpt-blue min-h-5 min-w-5" />
        : <Sun className="stroke-cpt-mauve group-hover:stroke-cpt-blue min-h-5 min-w-5" />}
      <span>Theme</span>
    </Button>
  );
}
