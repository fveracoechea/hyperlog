import { Typography } from '@/components/ui/typography';

export default function Home() {
  return (
    <div>
      <Typography as="h1">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Typography>

      <Typography as="p">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab magni tempora alias cumque,
        ratione assumenda reprehenderit consectetur ut, molestiae officia eum architecto
        repellendus aut corrupti voluptates unde obcaecati ex fugiat.
      </Typography>

      <Typography as="p">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab magni tempora alias cumque,
        ratione assumenda reprehenderit consectetur ut, molestiae officia eum architecto
        repellendus aut corrupti voluptates unde obcaecati ex fugiat.
      </Typography>

      <Typography as="label" variant="muted" className>
        Lorem ipsum dolor sit amet
      </Typography>

      <Typography as="h2" variant="lead">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Typography>
    </div>
  );
}
