// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => void;

interface DebouncedCallback<Fn extends Callback> {
  (...args: Parameters<Fn>): void;
  cancel(): void;
}

export function debounce<Fn extends Callback>(wait: number, func: Fn) {
  let timeout: null | NodeJS.Timeout = null;

  function debounced(...args: Parameters<Fn>) {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  }
  debounced.cancel = () => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = null;
  };
  return debounced as DebouncedCallback<Fn>;
}
