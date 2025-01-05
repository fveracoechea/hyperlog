import honoConfig from '@hono/eslint-config';

import { config as baseConfig } from './base.js';

/**
 * A shared ESLint configuration for hono backend apps.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  ...baseConfig,
  ...honoConfig,
  {
    rules: {
      'no-process-env': 'warn',
    },
  },
];
