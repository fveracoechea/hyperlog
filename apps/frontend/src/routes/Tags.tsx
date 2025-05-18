import { Tag } from "lucide-react";

import { Banner } from "@/components/Banner";
import { TagCard } from "@/components/TagCard";

import type { Route } from "./+types/Tags";
import { client } from "../utility/honoClient.ts";

export async function clientLoader({}: Route.ClientActionArgs) {
  const response = await client.api.tag.$get();
  const json = await response.json();
  return json.data;
}

export default function Tags({ loaderData }: Route.ComponentProps) {
  const { tags } = loaderData;
  return (
    <>
      <section className="flex flex-col gap-4">
        <Banner
          Icon={Tag}
          title="Tags"
          subtitle="Easily group and filter links for quicker access"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {tags.map((tag) => (
            <TagCard
              key={tag.id}
              tag={tag}
              linkCount={tag.links.length}
            />
          ))}
        </div>
      </section>
    </>
  );
}
