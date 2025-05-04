import { useNavigation } from "react-router";

import { PaginationSchema } from "@hyperlog/schemas";
import { searchParamsToJson } from "@hyperlog/helpers";
import { LinkIcon } from "lucide-react";

import { Banner } from "@/components/Banner";
import { LinkCard } from "@/components/LinkCard";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { PaginationForm } from "@/components/PaginationForm";

import { type Route } from "./+types/Links";
import { client } from "../utility/honoClient.ts";

export const ErrorBoundary = PageErrorBoundary;

export async function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = searchParamsToJson(url.searchParams);
  const res = await client.api.link.$get({ query });
  const json = await res.json();
  return { ...json.data, params: PaginationSchema.parse(query) };
}

export default function Links({ loaderData }: Route.ComponentProps) {
  const navigation = useNavigation();

  return (
    <section className="flex flex-col gap-4">
      <Banner title="Links" Icon={LinkIcon} subtitle="All links from every collection" />

      <PaginationForm {...loaderData} />

      <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {loaderData.links.map((link) => (
          <LinkCard isLoading={navigation.state === "loading"} key={link.id} link={link} />
        ))}
      </div>
    </section>
  );
}
