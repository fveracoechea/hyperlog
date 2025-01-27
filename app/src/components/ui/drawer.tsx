import * as React from 'react';

import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { Drawer as DrawerPrimitive } from 'vaul';

import { Typography } from './typography';

const Drawer = ({
  shouldScaleBackground = true,
  direction = 'right',
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    direction={direction}
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = 'Drawer';

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-cpt-overlay0/60', className)}
    {...props}
  />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'right-0 top-0 bottom-0 fixed z-10 outline-none w-full max-w-screen-md flex',
        'border-cpt-overlay1 border-l bg-cpt-mantle z-50',

        className,
      )}
      {...props}
    >
      <div
        className={clsx(
          'ml-2 my-auto w-2 h-40 rounded-full cursor-grab',
          'transition-colors bg-cpt-surface1 hover:bg-cpt-surface2',
        )}
      />
      <div className="w-full flex flex-col h-full flex-1">{children}</div>
    </DrawerPrimitive.Content>
  </DrawerPortal>
));
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-4 text-left', className)} {...props} />
);
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
);

const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-4 pb-0', className)} {...props} />
);

DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  { className?: string; children: React.ReactNode }
>((props, ref) => (
  <DrawerPrimitive.Title ref={ref} asChild>
    <Typography as="h2" variant="large" {...props} />
  </DrawerPrimitive.Title>
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  { className?: string; children: React.ReactNode }
>((props, ref) => (
  <DrawerPrimitive.Description ref={ref} asChild>
    <Typography variant="base" as="p" muted {...props} />
  </DrawerPrimitive.Description>
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerTitle,
  DrawerDescription,
};
