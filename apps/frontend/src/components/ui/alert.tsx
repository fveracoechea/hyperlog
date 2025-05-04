import type { ReactNode } from "react";

import { cva, type VariantProps } from "@/lib/cva";
import { cn } from "@/lib/utils";
import { Info, TriangleAlert } from "lucide-react";

import { Typography } from "./typography";

const alert = cva({
  base: "flex gap-2 px-4 py-2 border rounded items-center",
  variants: {
    variant: {
      info: ["boorder-cpt-sky bg-cpt-sky/20"],
      destructive: ["border-destructive bg-destructive/20"],
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

type Props = VariantProps<typeof alert> & {
  className?: string;
  children: ReactNode;
};

export function Alert(props: Props) {
  const { variant = "info", className, children } = props;
  return (
    <div role="alert" className={cn(alert({ variant }), className)}>
      {variant === "info" && (
        <Info className="text-cpt-sky min-h-4 min-w-4" width="22" height="22" />
      )}
      {variant === "destructive" && (
        <TriangleAlert className="text-destructive min-h-4 min-w-4" width="22" height="22" />
      )}
      <Typography variant="small">{children}</Typography>
    </div>
  );
}
