import type { CSSProperties, PropsWithChildren } from "react";

import { type ClassValue, clsx } from "clsx";
import type { LucideProps } from "lucide-react";

import { Typography } from "@/components/ui/typography";

type LinkItemProps = PropsWithChildren<{
  title: string;
  Icon?: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
  className?: ClassValue;
  iconClassName?: ClassValue;
  iconStyle?: CSSProperties;
}>;

export function LineItem(props: LinkItemProps) {
  const { className, Icon, iconClassName, iconStyle, title, children } = props;
  return (
    <div className={clsx("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <Typography muted>{title}</Typography>
      </div>
      <div className="flex items-center gap-2 rounded-md p-2">
        {Icon && (
          <Icon
            className={clsx("h-5 w-5", iconClassName ?? "stroke-muted-foreground")}
            style={iconStyle}
          />
        )}
        {children}
      </div>
    </div>
  );
}
