import { HomeIcon } from 'lucide-react';

import { Banner } from '@/components/Banner';

export default function Home() {
  return (
    <>
      <Banner icon={<HomeIcon width="32" height="32" />} title="Home" />
    </>
  );
}
