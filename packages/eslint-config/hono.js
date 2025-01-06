import { config as baseConfig } from './base.js';

/**
 * A shared ESLint configuration for hono backend apps.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  ...baseConfig,
  {
    rules: {
      'no-process-env': 'warn',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions'],
        },
      ],
    },
  },
];
