import type { LucideProps } from 'lucide-react';

import { Typography } from '@/components/ui/typography';

type Props = {
  Icon: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
  title: string;
  subtitle?: string;
};

export function Banner(props: Props) {
  const { title, Icon, subtitle } = props;
  return (
    <header>
      <div className="flex gap-1 items-center">
        <Icon className="h-8 w-8 stroke-primary" />
        <Typography as="h2" variant="lead">
          {title}
        </Typography>
      </div>
      <Typography variant="small" muted>
        {subtitle}
      </Typography>
    </header>
  );
}
