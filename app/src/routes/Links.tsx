import { Link } from 'lucide-react';

import { Typography } from '@/components/ui/typography';

export default function Links() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Link />
        <Typography as="h2" variant="lead">
          Links
        </Typography>
      </div>
    </div>
  );
}
