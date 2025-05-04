import { Typography } from "@/components/ui/typography";

import type { Route } from "./+types/TagPage";

export default function TagPage({ params }: Route.ComponentProps) {
  return (
    <div>
      <Typography>Tag {params.tagId}</Typography>
    </div>
  );
}
