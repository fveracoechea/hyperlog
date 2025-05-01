import type { Config } from '@react-router/dev/config';

const config: Config = {
  appDirectory: 'src',
  ssr: false,
  future: {
    unstable_middleware: true,
    unstable_optimizeDeps: true,
    unstable_splitRouteModules: true,
  },
};

export default config;
