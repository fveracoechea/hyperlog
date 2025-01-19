import { Star } from 'lucide-react';

import { Banner } from '@/components/Banner';

import type { Route } from './+types/Home';

export async function loader({ request }: Route.LoaderArgs) {}

export default function Home() {
  return (
    <>
      <section className="flex flex-col gap-4">
        <Banner title="Favorites" subtitle="Easily access your top picks" Icon={Star} />
      </section>
    </>
  );
}
