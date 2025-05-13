import { type ComponentPropsWithRef, useEffect, useRef, useState } from "react";

import clsx from "clsx";
import { Link2OffIcon } from "lucide-react";

type Status = "error" | "success";

export function LazyFavicon(props: ComponentPropsWithRef<"img">) {
  const { src, ...imageProps } = props;

  const [status, setStatus] = useState<Status>("success");
  const targetRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (src && status === "success" && !loadedRef.current) {
      loadedRef.current = true;
      const img = new Image();

      img.onerror = () => {
        setStatus("error");
      };

      img.src = src;
    }
  }, [src, status]);

  return (
    <div ref={targetRef} style={{ height: imageProps.height, width: imageProps.width }}>
      {!src || (status === "error" && <Link2OffIcon className="stroke-cpt-overlay0" />)}
      {src && status === "success" && (
        <img
          alt="Favicon"
          role="presentation"
          loading="lazy"
          src={src}
          {...imageProps}
          className={clsx("rounded", imageProps.className)}
        />
      )}
    </div>
  );
}
