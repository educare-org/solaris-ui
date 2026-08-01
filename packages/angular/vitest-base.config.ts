import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['packages/angular/src/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reportsDirectory: '../../coverage/packages/angular',
      include: ['src/lib/**'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/**/*.stories.ts',
        'src/**/*.d.ts',
        'src/index.ts',
        'src/lib/**/index.ts',
        'src/lib/**/*.tokens.ts',
        'src/lib/**/*.types.ts',
        'src/lib/**/*.interface.ts',
        'src/lib/**/testing/**',
      ],
      thresholds: {
        global: {
          statements: 85,
          branches: 83,
          functions: 85,
          lines: 85,
        },
      },
    },
  },
});
