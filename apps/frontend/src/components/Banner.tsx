import type { ReactNode } from "react";

import type { LucideProps } from "lucide-react";

import { Typography } from "@/components/ui/typography";
import clsx from "npm:clsx@^2.1.1";

type Props = {
  Icon?: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
  iconNode?: ReactNode;
  title: string;
  subtitle?: string | null;
  parent?: string | null;
  variant?: "default" | "destructive";
};

export function Banner(props: Props) {
  const { title, parent, Icon, subtitle, iconNode } = props;
  return (
    <header className="flex flex-col gap-2">
      {parent && (
        <Typography variant="base" muted className="pb-4">
          Collections / {parent}
        </Typography>
      )}
      <div className="flex items-start gap-2">
        {Icon && <Icon className="stroke-primary h-7 w-7" />}
        {iconNode}
        <Typography as="h2" variant="lead" className="text-balance">
          {title}
        </Typography>
      </div>
      {subtitle && (
        <Typography variant="base" muted>
          {subtitle}
        </Typography>
      )}
    </header>
  );
}

export function SubBanner(props: Props) {
  const { title, Icon, subtitle, iconNode, variant = "default" } = props;
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            className={clsx(
              "h-5 w-5",
              variant === "default" ? "stroke-primary" : "stroke-destructive",
            )}
          />
        )}
        {iconNode}
        <Typography as="h3" muted variant="title">
          {title}
        </Typography>
      </div>
      {subtitle && (
        <Typography variant="small" muted>
          {subtitle}
        </Typography>
      )}
    </header>
  );
}
