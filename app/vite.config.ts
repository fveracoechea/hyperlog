import { defineConfig } from 'vite';

import { reactRouter } from '@react-router/dev/vite';
import autoprefixer from 'autoprefixer';
import path from 'node:path';
import tailwindcss from 'tailwindcss';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    reactRouter(),
    babel({
      filter: /\.tsx?$/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        presets: ['@babel/preset-typescript'],
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
