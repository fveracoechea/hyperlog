import { Library } from 'lucide-react';

import { Banner } from '@/components/Banner';

export function HydrateFallback() {
  return <p>Loading Collections...</p>;
}

export default function Collections() {
  return (
    <>
      <Banner title="Collections" Icon={Library} />
    </>
  );
}
