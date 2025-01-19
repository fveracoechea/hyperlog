import { Typography } from '@/components/ui/typography';

import type { Route } from './+types/CollectionPage';

export default function CollectionPage({ params }: Route.ComponentProps) {
  return (
    <div>
      <Typography>Collection {params.collectionId}</Typography>
    </div>
  );
}
