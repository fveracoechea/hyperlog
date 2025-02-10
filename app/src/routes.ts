import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes';

export default [
  ...prefix('api', [
    route('link/:linkId', './routes/api/link.ts'),
    route('auth/*', './routes/api/auth.ts'),
  ]),

  layout('./routes/Layout.tsx', { id: 'layout' }, [
    index('./routes/Home.tsx'),
    route('links', './routes/Links.tsx'),
    route('collections', './routes/Collections.tsx'),
    route('collections/:collectionId', './routes/CollectionPage.tsx'),
    route('tags', './routes/Tags.tsx'),
    route('tags/:tagId', './routes/TagPage.tsx'),
  ]),

  layout('./routes/PlublicLayout.tsx', [
    route('login', './routes/Login.tsx'),
    route('sign-up', './routes/SignUp.tsx'),
  ]),
] satisfies RouteConfig;
