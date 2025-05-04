import * as React from "react";

import { cva } from "@/lib/cva";
import { cn } from "@/lib/utils";
import clsx from "clsx";

const wrapper = cva({
  base: [
    "flex w-full justify-center items-center transition-shadow",
    "ring-offset-0 rounded-md text-foreground",
    "border hover:ring-1 focus-within:ring-1",
    "outline-none",
  ],
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "",
    },
    error: {
      true: ["ring-destructive/60", "border-destructive", "focus-within:!ring-destructive"],
      false: ["ring-input", "border-border", "hover:ring-ring/40", "focus-within:!ring-ring"],
    },
  },
  defaultVariants: {
    disabled: false,
    error: false,
  },
});

const input = clsx([
  "flex gap-2 w-full rounded-md bg-background text-foreground",
  "p-2 ring-offset-background transition-all appearance-none",
  "placeholder:text-muted-foreground placeholder:font-light",
  "text-sm md:text-base",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "autofill:!bg-background autofill:!text-foreground autofill:appearance-none",
]);

export type InputProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode;
  rightBtn?: React.ReactNode;
  error?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, icon, rightBtn, error = false, ...props }, ref) => {
    return (
      <div className={wrapper({ disabled, error })}>
        {icon && <span className="pl-2">{icon}</span>}
        <input
          type={type}
          className={cn(input, className)}
          ref={ref}
          {...props}
          style={{ lineHeight: "revert" }}
        />
        {rightBtn && rightBtn}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
