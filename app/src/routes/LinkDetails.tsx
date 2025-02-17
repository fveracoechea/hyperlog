import type { CSSProperties, PropsWithChildren } from 'react';
import { Link, data, isRouteErrorResponse, redirect, useNavigate } from 'react-router';

import { deleteLink, getLinkDetails } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import clsx, { type ClassValue } from 'clsx';
import { formatDate, formatDistanceToNow } from 'date-fns';
import {
  CalendarIcon,
  EyeIcon,
  FolderIcon,
  Link2OffIcon,
  LinkIcon,
  type LucideProps,
  SaveIcon,
  TagIcon,
  Undo2Icon,
} from 'lucide-react';

import { DeleteLinkDialog } from '@/components/DeleteLinkDialog';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

import { type Route } from './+types/LinkDetails';

type LinkItemProps = PropsWithChildren<{
  title: string;
  Icon?: React.FunctionComponent<LucideProps & React.RefAttributes<SVGSVGElement>>;
  className?: ClassValue;
  iconClassName?: ClassValue;
  iconStyle?: CSSProperties;
}>;

function LineItem(props: LinkItemProps) {
  const { className, Icon, iconClassName, iconStyle, title, children } = props;
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        <Typography>{title}</Typography>
      </div>
      <div className="bg-cpt-base border-border flex items-center justify-between gap-2 rounded-lg border px-4 py-2">
        {children}
        {Icon && (
          <Icon
            className={clsx('stroke-muted-foreground h-5 w-5', iconClassName)}
            style={iconStyle}
          />
        )}
      </div>
    </div>
  );
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(props.error) && props.error.status === 404)
    return (
      <div className="flex h-full w-full flex-col">
        <Typography>Link Not Found</Typography>
        <Link2OffIcon className="stroke-cpt-surface2 h-24 w-24" />
        <Button variant="outline">Bo gack</Button>
      </div>
    );

  return <div>Oops</div>;
}

export async function action({ request, params: { linkId } }: Route.LoaderArgs) {
  const formData = await request.formData();
  const redirectTo = String(formData.get('redirect'));

  if (request.method === 'DELETE') {
    await deleteLink(linkId);
    return redirect(redirectTo);
  }

  return null;
}

export async function loader({ request, params: { linkId } }: Route.LoaderArgs) {
  const { headers } = await getSessionOrRedirect(request);
  const link = await getLinkDetails(linkId);
  if (!link) throw data(null, { status: 404 });

  return data({ link }, { headers });
}

export default function LinkDetailsPage({ loaderData: { link } }: Route.ComponentProps) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
      <div>
        <Button asChild variant="ghost" size="sm">
          <Link
            to="/"
            onClick={e => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            <Undo2Icon /> Go Back
          </Link>
        </Button>
      </div>
      <section className="bg-base">
        <header className="relative flex flex-col justify-between gap-8 overflow-y-hidden p-4">
          {link.previewImage && (
            <img
              src={link.previewImage}
              width="1200"
              height="630"
              alt="favicon"
              className="absolute inset-0 rounded-t"
            />
          )}

          <div className="from-cpt-base/65 to-cpt-base absolute inset-0 bg-gradient-to-b" />

          {link.favicon && (
            <img
              src={link.favicon}
              width="32"
              height="32"
              alt="favicon"
              className="z-[1] rounded"
            />
          )}

          <div className="z-[1] flex flex-col gap-2 text-left">
            <Typography variant="lead">{link.title}</Typography>
            <Typography variant="base">{link.description}</Typography>

            <div className="flex gap-2" title="Last Saved">
              <SaveIcon className="h-4 w-4" />
              <Typography variant="small">
                {formatDate(link.updatedAt ?? new Date(), 'PPPp')}
              </Typography>
            </div>

            <div className="flex gap-2" title="Last Visit">
              <CalendarIcon className="h-4 w-4" />
              <Typography variant="small">
                {formatDistanceToNow(link.lastVisit ?? new Date(), { addSuffix: true })}
              </Typography>
            </div>

            <div className="flex gap-2" title="Views">
              <EyeIcon className="h-4 w-4" />
              <Typography variant="small">{link.views}</Typography>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-6 p-4">
          <LineItem title="Link" Icon={LinkIcon} className="col-span-2">
            <Typography as="a" link href={link.url}>
              {link.url}
            </Typography>
          </LineItem>
          <LineItem title="Tag" Icon={TagIcon}>
            {link.tag ? (
              <Typography as="link" className="font-light" to={`/tags/${link.tagId}`}>
                {link.tag?.name}
              </Typography>
            ) : (
              <Typography muted className="font-light">
                No tag
              </Typography>
            )}
          </LineItem>
          <LineItem
            title="Collection"
            Icon={FolderIcon}
            iconStyle={{
              stroke: link.collection?.color ?? undefined,
              fill: link.collection?.color ?? undefined,
            }}
          >
            {link.collection ? (
              <Typography
                as="link"
                className="text-foreground no-underline"
                to={`/collections/${link.collectionId}`}
              >
                {link.collection?.name}
              </Typography>
            ) : (
              <Typography muted className="font-light">
                No collection
              </Typography>
            )}
          </LineItem>
          {/* TODO: add rich markdown editor */}
          <FormField
            label="Notes"
            variant="textarea"
            fieldClassName="col-span-2"
            className="min-h-36 resize-none"
            defaultValue={link.notes ?? undefined}
          />

          {/* <div className="col-span-2 flex justify-between gap-4"> */}
          <div className="col-span-2 flex justify-end gap-4">
            <DeleteLinkDialog link={link} />
            <Button variant="outline">Add to Favorites</Button>
            <Button>Save Changes</Button>
          </div>
          {/* </div> */}
        </div>
      </section>
    </div>
  );
}
