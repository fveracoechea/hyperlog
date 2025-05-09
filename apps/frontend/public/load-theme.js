const root = globalThis.document.documentElement;
const theme = localStorage.getItem("ui-theme");

if (theme === "dark" || theme === "light") {
  root.classList.add(theme);
} else {
  const system = globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  localStorage.setItem("ui-theme", system);
  root.classList.add(system);
}
