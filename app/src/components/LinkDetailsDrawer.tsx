import { useSearchParams } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Typography } from './ui/typography';

export function LinkDetailsDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();

  const linkId = searchParams.get('link');

  return (
    <Drawer
      open={Boolean(linkId)}
      onOpenChange={() => {
        searchParams.delete('link');
        setSearchParams(searchParams, { preventScrollReset: true });
      }}
    >
      <DrawerContent>
        <div className="w-full">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Typography variant="lead">Link details</Typography>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
