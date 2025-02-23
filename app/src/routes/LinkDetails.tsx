import type { CSSProperties, PropsWithChildren } from 'react';
import {
  Form,
  Link,
  data,
  isRouteErrorResponse,
  redirect,
  useNavigate,
  useNavigation,
} from 'react-router';

import {
  addToFavorites,
  deleteLink,
  getLinkDetails,
  removeFromFavorites,
} from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import clsx, { type ClassValue } from 'clsx';
import { formatDate, formatDistanceToNow } from 'date-fns';
import {
  CalendarIcon,
  EyeIcon,
  FolderIcon,
  Link2OffIcon,
  LinkIcon,
  LoaderCircle,
  type LucideProps,
  SaveIcon,
  StarIcon,
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
      <div className="bg-cpt-base border-border flex items-center justify-between gap-2 rounded-md border px-4 py-2">
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
  let headline = 'Oops, an unexpected error occurred';
  let message =
    'We apologize for the inconvenience. Please try again later. If the issue persists, contact support.';

  if (isRouteErrorResponse(props.error) && props.error.status === 404) {
    headline = 'Link Not Found';
    message = 'The requested page could not be found';
  }

  return (
    <section className="mx-auto flex max-w-96 flex-1 items-center pb-10">
      <div className="flex flex-col items-center gap-4">
        <Link2OffIcon className="stroke-cpt-surface1 h-24 w-24" />
        <div className="flex flex-col justify-center gap-0 text-center">
          <Typography variant="large">{headline}</Typography>
          <Typography muted>{message}</Typography>
        </div>
        <Button asChild>
          <Link to="/" replace>
            Go to Homepage
          </Link>
        </Button>
      </div>
    </section>
  );
}

export async function action({ request, params: { linkId } }: Route.LoaderArgs) {
  const formData = await request.formData();

  if (request.method === 'DELETE') {
    await deleteLink(linkId);
    return redirect('/links');
  }

  if (request.method === 'PUT') {
    const value = String(formData.get('toggleFavorite'));
    if (value === 'true') await removeFromFavorites(linkId);
    if (value === 'false') await addToFavorites(linkId);
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
  const navigation = useNavigation();

  const isTogglingFavorite =
    navigation.state !== 'idle' && Boolean(navigation.formData?.has('toggleFavorite'));

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
      <section
        className="border-border flex overflow-hidden rounded-md border bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${link.previewImage}")` }}
      >
        <div className="bg-cpt-base/85 flex flex-1 flex-col justify-between gap-8 p-4">
          <div className="flex justify-between gap-8">
            {link.favicon ? (
              <img
                src={link.favicon}
                width="32"
                height="32"
                alt="favicon"
                className="z-[1] h-8 w-8 rounded"
              />
            ) : (
              <div role="presentation" />
            )}
            {link.isPinned ? (
              <StarIcon className="fill-primary stroke-primary h-6 w-6" />
            ) : (
              <div role="presentation" />
            )}
          </div>

          <div className="z-[1] flex flex-col gap-2 text-left">
            <Typography as="h2" variant="lead">
              {link.title}
            </Typography>
            <Typography as="p" variant="base">
              {link.description}
            </Typography>

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

            <div className="flex justify-end gap-2">
              <DeleteLinkDialog
                link={link}
                trigger={
                  <Button size="sm" variant="ghost">
                    Delete
                  </Button>
                }
              />
              <Form method="PUT">
                <Button
                  size="sm"
                  variant="ghost"
                  name="toggleFavorite"
                  value={String(Boolean(link.isPinned))}
                >
                  {isTogglingFavorite && (
                    <>
                      <LoaderCircle className="stroke-primary h-4 w-4 animate-spin" />
                      <span>Updating Favories</span>
                    </>
                  )}

                  {!isTogglingFavorite &&
                    (link.isPinned ? 'Remove from Favorites' : 'Add to Favorites')}
                </Button>
              </Form>
              <Button size="sm" variant="outline" asChild>
                <Link to={`/links/${link.id}/edit`}>Edit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="relative grid grid-cols-2 gap-6 pt-6">
        <LineItem title="Link" Icon={LinkIcon} className="col-span-2">
          <Typography as="a" link href={link.url}>
            {link.url}
          </Typography>
        </LineItem>
        <LineItem title="Tag" Icon={TagIcon}>
          {link.tag ? (
            <Typography
              as="link"
              className="text-foreground no-underline"
              to={`/tags/${link.tagId}`}
            >
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
          readOnly
          fieldClassName="col-span-2"
          className="min-h-36 resize-none"
          defaultValue={link.notes ?? undefined}
        />
      </div>
    </div>
  );
}
