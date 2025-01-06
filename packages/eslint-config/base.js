import js from '@eslint/js';
import onlyWarn from 'eslint-plugin-only-warn';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint base configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['**/build/**', '**/dist/**', '**/.react-router/**', '**/public/**'],
  },
  {
    plugins: {
      turbo: turboPlugin,
      'only-warn': onlyWarn,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
];
