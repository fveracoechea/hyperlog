import type { ComponentPropsWithRef } from "react";

import { cva, type VariantProps } from "@/lib/cva";
import clsx from "clsx";
import { CheckIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

export const ColorNames = [
  "rosewater",
  "flamingo",
  "pink",
  "mauve",
  "red",
  "maroon",
  "peach",
  "yellow",
  "green",
  "teal",
  "sky",
  "sapphire",
  "blue",
  "lavender",
  "grey",
] as const;

const colorPicker = cva({
  base: "flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full",
  variants: {
    color: {
      rosewater: "bg-cpt-rosewater",
      flamingo: "bg-cpt-flamingo",
      pink: "bg-cpt-pink",
      mauve: "bg-cpt-mauve",
      red: "bg-cpt-red",
      maroon: "bg-cpt-maroon",
      peach: "bg-cpt-peach",
      yellow: "bg-cpt-yellow",
      green: "bg-cpt-green",
      teal: "bg-cpt-teal",
      sky: "bg-cpt-sky",
      sapphire: "bg-cpt-sapphire",
      blue: "bg-cpt-blue",
      lavender: "bg-cpt-lavender",
      grey: "bg-cpt-overlay2",
    },
  },
});

export type ColorVariant = VariantProps<typeof colorPicker>["color"] | null;

type Props = {
  value: ColorVariant;
  onChange(color: NonNullable<ColorVariant>): void;
} & Omit<ComponentPropsWithRef<"button">, "value">;

export function ColorPicker({ onChange, value, ...otherProps }: Props) {
  return (
    <div className="flex w-full flex-col gap-1">
      <Typography as="label">Color</Typography>
      <div className="grid grid-cols-4 gap-2">
        {ColorNames.map((color) => {
          const isActive = color === value;
          return (
            <Button
              variant="outline"
              type="button"
              size="sm"
              key={color}
              onClick={() => onChange(color)}
              className={clsx(
                "justify-start gap-1",
                isActive && "border-muted-foreground border-2",
              )}
              {...otherProps}
            >
              <span className={colorPicker({ color })}>
                {isActive && <CheckIcon className="stroke-cpt-mantle h-4 w-4" />}
              </span>
              <Typography variant="small" className="capitalize">
                {color}
              </Typography>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
