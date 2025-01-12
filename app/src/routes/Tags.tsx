import { Tag } from 'lucide-react';

import { Typography } from '@/components/ui/typography';

export default function Tags() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Tag />
        <Typography as="h2" variant="lead">
          Tags
        </Typography>
      </div>
    </div>
  );
}
