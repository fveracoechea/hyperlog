import type { RefAttributes } from "react";

import { cva, type VariantProps } from "@/lib/cva";
import clsx from "clsx";
import { FolderIcon, type LucideProps } from "lucide-react";

const styles = cva({
  variants: {
    color: {
      rosewater: "fill-cpt-rosewater stroke-cpt-rosewater",
      flamingo: "fill-cpt-flamingo stroke-cpt-flamingo",
      pink: "fill-cpt-pink stroke-cpt-pink",
      mauve: "fill-cpt-mauve stroke-cpt-mauve",
      red: "fill-cpt-red stroke-cpt-red",
      maroon: "fill-cpt-maroon stroke-cpt-maroon",
      peach: "fill-cpt-peach stroke-cpt-peach",
      yellow: "fill-cpt-yellow stroke-cpt-yellow",
      green: "fill-cpt-green stroke-cpt-green",
      teal: "fill-cpt-teal stroke-cpt-teal",
      sky: "fill-cpt-sky stroke-cpt-sky",
      sapphire: "fill-cpt-sapphire stroke-cpt-sapphire",
      blue: "fill-cpt-blue stroke-cpt-blue",
      lavender: "fill-cpt-lavender stroke-cpt-lavender",
      grey: "fill-cpt-overlay2 stroke-cpt-overlay2",
    },
    size: {
      small: "h-5 w-5 ",
      medium: "h-6 w-6",
      large: "h-7 w-7",
    },
  },
});

export function CollectionIcon(
  props: VariantProps<typeof styles> & LucideProps & RefAttributes<SVGSVGElement>,
) {
  const { color, size, className } = props;
  return <FolderIcon {...props} className={clsx(className, styles({ color, size }))} />;
}
