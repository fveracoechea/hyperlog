import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('./routes/Layout.tsx', [
    index('./routes/Home.tsx'),
    route('links', './routes/Links.tsx'),
    route('collections', './routes/Collections.tsx'),
    route('tags', './routes/Tags.tsx'),
  ]),
  route('login', './routes/Login.tsx'),
  route('sign-up', './routes/SignUp.tsx'),
] satisfies RouteConfig;
