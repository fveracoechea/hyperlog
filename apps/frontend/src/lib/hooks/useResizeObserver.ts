import { type RefObject, useLayoutEffect, useState } from "react";

export function useResizeObserver<T extends Element>(
  ref: RefObject<T | null>,
  callback?: (entry: ResizeObserverEntry) => void,
) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    setSize({
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
    });

    const observer = new ResizeObserver(([entry]) => {
      if (callback) callback(entry);
      setSize({
        width: entry.target.clientWidth,
        height: entry.target.clientHeight,
      });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);

  return size;
}
