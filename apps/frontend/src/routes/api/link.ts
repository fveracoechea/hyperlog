import type { FieldErrors } from 'react-hook-form';
import { data, redirect } from 'react-router';

import { PaginationSchema, searchParamsToJson } from '@/.server/pagination';
import { createLink, getAllLinks, increateViewCount } from '@/.server/resources/link';
import { getSessionOrRedirect } from '@/.server/session';
import { type CreateLinkFormFields, CreateLinkSchema } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as cheerio from 'cheerio';
import { getValidatedFormData } from 'remix-hook-form';

import type { Route } from './+types/link';

const resolver = zodResolver(CreateLinkSchema);

async function fetchLinkData(url: string) {
  const { origin } = new URL(url);
  try {
    const $ = await cheerio.fromURL(url);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || null;

    const descriptionNode = $('head meta[property="og:description"]') ||
      $('head meta[name="description"]');

    const image = $('head meta[property="og:image"]').attr('content') ||
      $('head meta[property="twitter:image"]').attr('content');

    // Look for favicon link tags
    let faviconUrl = $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href');

    // Ensure the URL is absolute
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      faviconUrl = new URL(faviconUrl, origin).href;
    }

    return {
      title,
      favicon: faviconUrl || `${origin}/favicon.ico`,
      previewImage: image ? (image.startsWith('http') ? image : `${origin}${image}`) : null,
      description: descriptionNode.attr('content') ?? null,
    };
  } catch (error) {
    console.warn('ERROR LOADING LINK DATA  ', url);
    console.error(error);
    return {
      title: null,
      favicon: `${origin}/favicon.ico`,
      previewImage: null,
      description: null,
    };
  }
}

export async function action({ request, params: { linkId } }: Route.ActionArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);

  if (request.method === 'PUT' && linkId) {
    await increateViewCount(linkId);
  }

  if (request.method === 'POST') {
    const {
      errors,
      data,
      receivedValues: defaultValues,
    } = await getValidatedFormData<CreateLinkFormFields>(request, resolver);

    if (errors) return { errors, defaultValues };

    const linkData = await fetchLinkData(data.url);

    const title = data.title || linkData.title;

    if (!title) {
      return {
        defaultValues,
        errors: {
          title: { type: 'required', message: 'No page Title found. Please provide one.' },
        } satisfies FieldErrors<CreateLinkFormFields>,
      };
    }

    const link = await createLink({ ...data, ...linkData, title, ownerId: user.id });
    return redirect(`/links/${link.id}`, { headers });
  }

  return null;
}

export type LinkApiData = Route.ComponentProps['loaderData'];

export async function loader({ request }: Route.LoaderArgs) {
  const {
    headers,
    data: { user },
  } = await getSessionOrRedirect(request);
  const { searchParams } = new URL(request.url);
  const params = PaginationSchema.parse(searchParamsToJson(searchParams));
  const results = await getAllLinks(user.id, params);
  return data(results, { headers });
}
