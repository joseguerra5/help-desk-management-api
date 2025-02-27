
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from "vite-tsconfig-paths"
import path from 'path';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    environment: 'node',
    setupFiles: ["/test/setup-e2e.ts"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@domain": path.resolve(__dirname, "src/domain"),
    }
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
