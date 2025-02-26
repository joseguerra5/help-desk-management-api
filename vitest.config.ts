import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';


export default defineConfig(async () => {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
  return {
    test: {
      globals: true,
      root: './',
      environment: 'node',
    },
    plugins: [
      tsconfigPaths(),
      swc.vite({
        module: { type: "es6" }
      })
    ],
  };
});
