import type { ReactNode } from 'react';

import { Typography } from '@/components/ui/typography';

type Props = {
  icon: ReactNode;
  title: string;
};

export function Banner(props: Props) {
  const { title, icon } = props;
  return (
    <section className="flex flex-col gap-4">
      <header className="flex gap-2 items-center">
        {icon}
        <Typography as="h2" variant="lead">
          {title}
        </Typography>
      </header>
    </section>
  );
}
