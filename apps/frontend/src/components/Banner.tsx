import type { ReactNode } from 'react';

import type { LucideProps } from 'lucide-react';

import { Typography } from '@/components/ui/typography';

type Props = {
  Icon?: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
  iconNode?: ReactNode;
  title: string;
  subtitle?: string | null;
};

export function Banner(props: Props) {
  const { title, Icon, subtitle, iconNode } = props;
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="stroke-primary h-7 w-7" />}
        {iconNode}
        <Typography as="h2" variant="lead" className="text-balance">
          {title}
        </Typography>
      </div>
      {subtitle && (
        <Typography variant="small" muted>
          {subtitle}
        </Typography>
      )}
    </header>
  );
}

export function SubBanner(props: Props) {
  const { title, Icon, subtitle, iconNode } = props;
  return (
    <header>
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="stroke-primary h-5 w-5" />}
        {iconNode}
        <Typography as="h3" muted variant="title">
          {title}
        </Typography>
      </div>
      {subtitle && (
        <Typography variant="small" muted>
          {subtitle}
        </Typography>
      )}
    </header>
  );
}
