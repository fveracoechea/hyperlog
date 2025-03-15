import { type CSSProperties, useState } from 'react';

import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { CheckIcon } from 'lucide-react';

import { Button } from './ui/button';
import { Typography } from './ui/typography';

export const Colors = [
  ['Rosewater', '#f5e0dc'],
  ['Flamingo', '#f2cdcd'],
  ['Pink', '#f5c2e7'],
  ['Mauve', '#cba6f7'],
  ['Red', '#f38ba8'],
  ['Maroon', '#eba0ac'],
  ['Peach', '#fab387'],
  ['Yellow', '#f9e2af'],
  ['Green', '#a6e3a1'],
  ['Teal', '#94e2d5'],
  ['Sky', '#89dceb'],
  ['Sapphire', '#74c7ec'],
  ['Blue', '#89b4fa'],
  ['Lavender', '#b4befe'],
  ['Grey', '#9399b2'],
] as const;

export type ColorTuple = (typeof Colors)[number];

type Props = {
  onColorChange(color: ColorTuple): void;
};

export function ColorPicker({ onColorChange }: Props) {
  const [color, setColor] = useState<ColorTuple>();
  const [activeLabel] = color ?? [];

  return (
    <div className="flex w-full flex-col gap-1">
      <Typography as="label">Color</Typography>
      <div className="grid grid-cols-4 gap-2">
        {Colors.map(value => {
          const [label, code] = value;
          const isActive = label === activeLabel;
          return (
            <Button
              variant="outline"
              type="button"
              size="sm"
              key={label}
              className={clsx(
                'justify-start gap-1',
                isActive && 'border-muted-foreground border-2',
              )}
              style={{ '--active-color': code } as CSSProperties}
              onClick={() => {
                setColor(value);
                onColorChange(value);
              }}
            >
              <span
                className={cn(
                  'flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--active-color]',
                )}
              >
                {isActive && <CheckIcon className="stroke-cpt-mantle h-4 w-4" />}
              </span>
              <Typography variant="small">{label}</Typography>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
