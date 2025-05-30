import { FolderXIcon, Link2OffIcon, SquareXIcon, StarOffIcon } from "lucide-react";
import { Typography } from "./ui/typography.tsx";
import { href } from "react-router";

export function NoLinks() {
  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("create-new-button")?.click();
  }

  return (
    <div className="flex flex-col p-6 gap-2 justify-center border border-border rounded-md">
      <div className="flex gap-4 items-center">
        <Link2OffIcon className="w-7 h-7 stroke-cpt-surface1" />
        <Typography variant="large" muted>
          No bookmarks found
        </Typography>
      </div>
      <Typography muted>
        Try changing your filters or add new ones to begin.
      </Typography>
      <Typography muted>
        Start by creating a{" "}
        <Typography as="link" variant="base" onClick={onClick}>
          new link
        </Typography>{" "}
        or importing your existing bookmarks in{" "}
        <Typography variant="base" as="link" to={href("/settings/account")}>
          account settings
        </Typography>
      </Typography>
    </div>
  );
}

export function NoFavorites() {
  return (
    <div className="flex flex-col p-6 gap-2 justify-center border border-border rounded-md">
      <div className="flex gap-4 items-center">
        <StarOffIcon className="w-7 h-7 stroke-cpt-surface1" />
        <Typography variant="large" muted>
          Your favorites list is empty
        </Typography>
      </div>

      <Typography variant="base" muted>
        Highlight your go-to links by marking them as favorites.
      </Typography>

      <Typography muted>
        Open “View Details” on any link and click “Add to Favorites” to pin it here.
      </Typography>
    </div>
  );
}

export function NoCollections() {
  return (
    <div className="flex flex-col p-6 gap-2 justify-center border border-border rounded-md">
      <div className="flex gap-4 items-center">
        <FolderXIcon className="w-7 h-7 stroke-cpt-surface1" />
        <Typography variant="large" muted>
          No collections found
        </Typography>
      </div>

      <Typography variant="base" muted>
        Use collections to group and manage your bookmarks more efficiently.
      </Typography>
    </div>
  );
}

export function NoTags() {
  return (
    <div className="flex flex-col p-6 gap-2 justify-center border border-border rounded-md">
      <div className="flex gap-4 items-center">
        <SquareXIcon className="w-7 h-7 stroke-cpt-surface1" />
        <Typography variant="large" muted>
          No tags found
        </Typography>
      </div>

      <Typography variant="base" muted>
        Start tagging your bookmarks to keep things organized and searchable.
      </Typography>
    </div>
  );
}
