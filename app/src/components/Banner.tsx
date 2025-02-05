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
      <div className="flex items-center gap-1">
        <Icon className="stroke-primary h-8 w-8" />
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
