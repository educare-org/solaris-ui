import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    dangerouslyIgnoreUnhandledErrors: true,
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
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
});
