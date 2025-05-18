import type { Route } from "./+types/TagPage";
import { data, Link } from "react-router";

import { LinkIcon, PencilIcon, TagIcon, TrashIcon } from "lucide-react";

import { Banner, SubBanner } from "@/components/Banner";
import { LinkCard } from "@/components/LinkCard";
import { Button } from "@/components/ui/button.tsx";
import { GoBackButton } from "@/components/GoBackButton.tsx";

import { client } from "@/utility/honoClient";
import { href } from "react-router";

export async function clientLoader({ params: { tagId } }: Route.ClientLoaderArgs) {
  const response = await client.api.tag[":tagId"].$get({ param: { tagId } });
  const json = await response.json();
  if (!json.success) throw data(null, { status: response.status });
  return json.data;
}

export default function TagPage({ loaderData }: Route.ComponentProps) {
  const { tag } = loaderData;
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Banner
          title={tag.name}
          subtitle={tag.description}
          Icon={TagIcon}
        />

        <div className="flex gap-2">
          <GoBackButton />

          <Button variant="outline" size="sm">
            <TrashIcon />
            <span>Delete tag</span>
          </Button>

          <Button size="sm" variant="outline" asChild>
            <Link to={href("/tags/:tagId", { tagId: tag.id })} replace>
              <PencilIcon />
              <span>Edit tag</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SubBanner title="Links" Icon={LinkIcon} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {tag.links.map((link) => <LinkCard key={link.id} link={link} />)}
        </div>
      </div>
    </>
  );
}
