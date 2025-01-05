import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import reactCompilerPlugin from 'eslint-plugin-react-compiler';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/build/**', '**/dist/**', '**/.react-router/**', '**/public/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    plugins: {
      reactCompiler: reactCompilerPlugin,
    },
  },
  {
    rules: {
      'no-empty-pattern': 'off',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['backend/*.{js,mjs,cjs,ts,jsx,tsx}', 'backend/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'no-process-env': 'warn',
    },
  },
];
