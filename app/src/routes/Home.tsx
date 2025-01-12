import { Typography } from '@/components/ui/typography';

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Typography as="h2" variant="lead">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Typography>

      <Typography as="p">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab magni tempora alias cumque,
        ratione assumenda reprehenderit consectetur ut, molestiae officia eum architecto
        repellendus aut corrupti voluptates unde obcaecati ex fugiat.
      </Typography>

      <Typography as="h3" variant="large">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </Typography>

      <Typography as="p">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab magni tempora alias cumque,
        ratione assumenda reprehenderit consectetur ut, molestiae officia eum architecto
        repellendus aut corrupti voluptates unde obcaecati ex fugiat. Lorem ipsum dolor sit
        amet consectetur, adipisicing elit. Eos eius consequatur numquam ducimus nesciunt,
        nulla impedit aut voluptas consequuntur voluptate dicta? Maxime exercitationem earum
        dicta atque. Quo labore magni dignissimos.
      </Typography>
    </div>
  );
}
