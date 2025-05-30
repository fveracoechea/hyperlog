import { useNavigation, useSearchParams } from "react-router";

import { CheckIcon, LinkIcon } from "lucide-react";
import { jsonHash } from "remix-utils/json-hash";

import { PaginationSchema, zIdQueryParam } from "@hyperlog/schemas";
import { searchParamsToJson } from "@hyperlog/helpers";
import clsx from "clsx";

import type { Route } from "./+types/Links";

import { Banner } from "@/components/Banner";
import { LinkCard } from "@/components/LinkCard";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { PaginationForm } from "@/components/PaginationForm";
import { client } from "../utility/honoClient.ts";
import { Button } from "../components/ui/button.tsx";
import { NoLinks } from "../components/EmptyState.tsx";

export type LinkListData = Route.ComponentProps["loaderData"];

export const ErrorBoundary = PageErrorBoundary;

export function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = searchParamsToJson(url.searchParams);
  return jsonHash({
    params: PaginationSchema.extend({ tag: zIdQueryParam }).parse(query),
    async links() {
      const res = await client.api.link.$get({ query });
      return (await res.json()).data;
    },
    async tags() {
      const res = await client.api.tag.$get({});
      return (await res.json()).data.tags;
    },
  });
}

export default function Links({ loaderData }: Route.ComponentProps) {
  const { links: { links, totalRecords }, params, tags } = loaderData;
  const navigation = useNavigation();
  const [_, setSearchParams] = useSearchParams();

  return (
    <>
      <section className="flex flex-col gap-6">
        <Banner title="Links" Icon={LinkIcon} subtitle="All links from every collection" />

        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => {
            const isActive = tag.id === params.tag;
            return (
              <Button
                key={tag.id}
                size="sm"
                variant="outline"
                className={clsx(isActive && "border-muted-foreground border-2")}
                onClick={() => {
                  const newParams = new URLSearchParams();
                  if (!isActive) newParams.set("tag", tag.id);
                  setSearchParams(newParams);
                }}
              >
                {isActive && <CheckIcon className="stroke-foreground" />}
                <span>{tag.name}</span>
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4">
          <PaginationForm totalRecords={totalRecords} params={params} />
          {links.length > 0
            ? (
              <div className="grid-auto-fill">
                {links.map((link) => (
                  <LinkCard
                    isLoading={navigation.state === "loading"}
                    key={link.id}
                    link={link}
                  />
                ))}
              </div>
            )
            : <NoLinks />}
        </div>
      </section>
    </>
  );
}
