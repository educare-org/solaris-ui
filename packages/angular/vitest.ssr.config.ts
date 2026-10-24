import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@educarehq\/solaris-ui$/,
        replacement: fileURLToPath(
          new URL(
            '../../dist/packages/angular/fesm2022/educarehq-solaris-ui.mjs',
            import.meta.url,
          ),
        ),
      },
    ],
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['packages/angular/src/**/*.ssr.spec.ts'],
    coverage: {
      enabled: false,
    },
  },
});
