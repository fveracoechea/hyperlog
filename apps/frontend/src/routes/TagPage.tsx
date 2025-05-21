import type { Route } from "./+types/TagPage";
import { data, Link, redirect } from "react-router";

import { LinkIcon, PencilIcon, TagIcon, TrashIcon } from "lucide-react";

import { Banner, SubBanner } from "@/components/Banner";
import { LinkCard } from "@/components/LinkCard";
import { Button } from "@/components/ui/button.tsx";
import { GoBackButton } from "@/components/GoBackButton.tsx";

import { client } from "@/utility/honoClient";
import { href } from "react-router";
import { DeleteTagDialog } from "../components/DeleteTagDialog.tsx";

export async function clientLoader({ params: { tagId } }: Route.ClientLoaderArgs) {
  const response = await client.api.tag[":tagId"].$get({ param: { tagId } });
  const json = await response.json();
  if (!json.success) throw data(null, { status: response.status });
  return json.data;
}

export async function clientAction({ params: { tagId }, request }: Route.ClientActionArgs) {
  if (request.method === "DELETE") {
    const res = await client.api.tag[":tagId"].$delete({ param: { tagId } });
    const json = await res.json();
    if (!json.success) throw data(json.error.message, { status: res.status });

    return redirect(href("/tags"));
  }
}

export default function TagPage({ loaderData }: Route.ComponentProps) {
  const { tag } = loaderData;
  return (
    <>
      <div className="flex flex-col gap-4">
        <Banner
          title={tag.name}
          subtitle={tag.description}
          Icon={TagIcon}
        />

        <div className="flex gap-2">
          <GoBackButton />
          <DeleteTagDialog
            tag={tag}
            trigger={
              <Button variant="outline" size="sm">
                <TrashIcon />
                <span>Delete tag</span>
              </Button>
            }
          />
          <Button size="sm" variant="outline" asChild>
            <Link to={href("/tags/:tagId/edit", { tagId: tag.id })} replace>
              <PencilIcon />
              <span>Edit tag</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SubBanner title="Links" Icon={LinkIcon} />
        <div className="grid-auto-fill">
          {tag.links.map((link) => <LinkCard key={link.id} link={link} />)}
        </div>
      </div>
    </>
  );
}
