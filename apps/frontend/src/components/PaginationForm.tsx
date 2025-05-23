import type { ComponentProps, FC } from "react";
import { Form, Link, type To, useNavigation, useSearchParams } from "react-router";

import type { PaginationSchemaType } from "@/.server/pagination";
import clsx from "clsx";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  type LucideProps,
} from "lucide-react";

import { SearchInput } from "./SearchInput";
import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

type BtnPaginationVariant = "first" | "previous" | "next" | "last";

const PaginationProps: Record<
  BtnPaginationVariant,
  { Icon: FC<LucideProps & React.RefAttributes<SVGSVGElement>>; title: string }
> = {
  first: { Icon: ChevronFirstIcon, title: "First Page" },
  previous: { Icon: ChevronLeftIcon, title: "Previous Page" },
  next: { Icon: ChevronRightIcon, title: "Next Page" },
  last: { Icon: ChevronLastIcon, title: "Last Page" },
};

export function PaginationButton(
  props: {
    to?: To;
    variant: BtnPaginationVariant;
    loading?: boolean;
  } & ComponentProps<"button">,
) {
  const { disabled, to, loading, variant, ...btnProps } = props;
  const { title, Icon } = PaginationProps[variant];
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      title={title}
      className={clsx("px-1.5", loading && "cursor-wait")}
      asChild
    >
      {disabled || !to
        ? (
          <button {...btnProps}>
            <Icon className="min-h-5 min-w-5" />
          </button>
        )
        : (
          <Link to={to}>
            <Icon className="min-h-5 min-w-5" />
          </Link>
        )}
    </Button>
  );
}

// TODO: ADD SorBy and Direction dropdowns
export function PaginationForm(props: { params: PaginationSchemaType; totalRecords: number }) {
  const { params, totalRecords } = props;
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const loading = navigation.state === "loading";
  const lastPage = Math.ceil(totalRecords / params.pageSize);

  function getPaginationLink(page: number) {
    const pagination = new URLSearchParams(searchParams);
    pagination.set("page", String(page));
    return `/links?${pagination}`;
  }

  return (
    <div className="flex gap-5 items-center justify-between  py-0">
      <div>
        <Typography>
          {totalRecords} results found.
        </Typography>
      </div>
      <div className="flex items-center gap-0">
        <PaginationButton
          variant="first"
          disabled={params.page === 1}
          to={getPaginationLink(1)}
          loading={loading}
        />
        <PaginationButton
          variant="previous"
          disabled={params.page === 1}
          to={getPaginationLink(Math.max(1, params.page - 1))}
          loading={loading}
        />
        <Typography muted variant="small" className="px-2">
          Page {params.page} of {lastPage}
        </Typography>
        <PaginationButton
          variant="next"
          disabled={params.page === lastPage}
          to={getPaginationLink(Math.min(lastPage, params.page + 1))}
          loading={loading}
        />
        <PaginationButton
          variant="last"
          disabled={params.page === lastPage}
          to={getPaginationLink(lastPage)}
          loading={loading}
        />
      </div>
    </div>
  );
}
