import pluginReact from 'eslint-plugin-react';
import pluginReactCompiler from 'eslint-plugin-react-compiler';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for React apps.
 *
 * @type {import("eslint").Linter.Config} */
export const config = [
  ...baseConfig,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-compiler': pluginReactCompiler,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'react-compiler/react-compiler': 'error',
      ...pluginReactHooks.configs.recommended.rules,
    },
  },
];
