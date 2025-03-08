import { type CSSProperties, type PropsWithChildren, useRef } from 'react';
import { Form, Link, data, redirect, useFetcher, useNavigation } from 'react-router';

import {
  addToFavorites,
  deleteLink,
  getLinkDetails,
  removeFromFavorites,
} from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import clsx, { type ClassValue } from 'clsx';
import {
  FolderIcon,
  LinkIcon,
  LoaderCircle,
  type LucideProps,
  PencilIcon,
  StarIcon,
  StarOffIcon,
  TagIcon,
  TrashIcon,
} from 'lucide-react';

import { DeleteLinkDialog } from '@/components/DeleteLinkDialog';
import { GoBackButton } from '@/components/GoBackButton';
import { LinkHero } from '@/components/LinkHero';
import { PageErrorBoundary } from '@/components/PageErrorBoundary';
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
        <Typography muted>{title}</Typography>
      </div>
      <div className="flex items-center gap-2 p-2">
        {Icon && (
          <Icon
            className={clsx('h-5 w-5', iconClassName ?? 'stroke-muted-foreground')}
            style={iconStyle}
          />
        )}
        {children}
      </div>
    </div>
  );
}

export const ErrorBoundary = PageErrorBoundary;

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
  const navigation = useNavigation();

  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);

  const isTogglingFavorite =
    navigation.state !== 'idle' && Boolean(navigation.formData?.has('toggleFavorite'));

  return (
    <div className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2">
      <GoBackButton />

      <LinkHero
        link={link}
        actions={
          <>
            <DeleteLinkDialog
              link={link}
              trigger={
                <Button size="sm" variant="ghost">
                  <TrashIcon />
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
                  (link.isPinned ? (
                    <>
                      <StarOffIcon /> Remove from Favorites
                    </>
                  ) : (
                    <>
                      <StarIcon /> Add to Favorites
                    </>
                  ))}
              </Button>
            </Form>
            <Button size="sm" variant="ghost" asChild>
              <Link to={`/links/${link.id}/edit`} replace>
                <PencilIcon />
                Edit
              </Link>
            </Button>
          </>
        }
      />

      <div className="relative grid grid-cols-2 gap-6 pt-6">
        <fetcher.Form
          method="PUT"
          action={`/api/link/${link.id}`}
          ref={formRef}
          className="hidden"
        />
        <LineItem
          title="Link"
          Icon={LinkIcon}
          className="col-span-2"
          iconClassName="stroke-primary"
        >
          <Typography
            as="a"
            link
            rel="noreferrer"
            target="_blank"
            href={link.url}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {link.url}
          </Typography>
        </LineItem>

        <LineItem title="Tag" Icon={TagIcon} iconClassName={link.tag && 'stroke-primary'}>
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
        <LineItem title="Notes" className="col-span-2">
          {link.notes ? (
            <pre className="whitespace-pre-line font-sans">{link.notes}</pre>
          ) : (
            <Typography muted className="font-light">
              No notes yet
            </Typography>
          )}
        </LineItem>
      </div>
    </div>
  );
}
