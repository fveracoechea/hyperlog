import { Library } from 'lucide-react';

import { Typography } from '@/components/ui/typography';

export default function Collections() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Library />
        <Typography as="h2" variant="lead">
          Collections
        </Typography>
      </div>
    </div>
  );
}
