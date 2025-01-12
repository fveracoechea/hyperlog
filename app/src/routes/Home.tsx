import { HomeIcon } from 'lucide-react';

import { Typography } from '@/components/ui/typography';

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex gap-2 items-center">
          <HomeIcon />
          <Typography as="h2" variant="lead">
            Home
          </Typography>
        </div>
      </div>
    </div>
  );
}
