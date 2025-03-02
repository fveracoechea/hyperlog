import { type RefObject, useEffect, useRef, useState } from 'react';

export interface IntersectionObserverArgs<E extends Element> extends IntersectionObserverInit {
  ref: RefObject<E | null>;
  triggerOnce?: boolean;
  disconnectOnceVisible?: boolean;
  callback?: (entry: IntersectionObserverEntry) => void;
}

export function useIntersectionObserver<E extends Element>(args: IntersectionObserverArgs<E>) {
  const { ref, triggerOnce, disconnectOnceVisible, callback, root, rootMargin, threshold } =
    args;

  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const shouldDisconnecRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    if (triggerOnce && shouldDisconnecRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        if (callback) callback(entry);

        if (triggerOnce) {
          shouldDisconnecRef.current = true;
          observer.disconnect();
        } else if (disconnectOnceVisible && entry.isIntersecting) {
          shouldDisconnecRef.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback, triggerOnce, root, rootMargin, threshold, disconnectOnceVisible]);

  const isVisible = entry?.isIntersecting ?? false;

  return { isVisible, entry };
}
