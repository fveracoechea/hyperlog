import { defineConfig } from 'tsup';

export default defineConfig(() => {
  return {
    format: ['esm', 'cjs'],
    entryPoints: ['src/index.ts'],
    dts: {
      // https://github.com/egoist/tsup/issues/571
      // Disable composite for DTS build
      compilerOptions: {
        composite: false,
      },
    },
  };
});
