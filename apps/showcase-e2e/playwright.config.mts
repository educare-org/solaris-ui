import { defineConfig, devices } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4200';
const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './src',
  timeout: 30000,
  expect: {
    timeout: 8000,
  },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? undefined : undefined,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
  reporter: isCI
    ? [['blob'], ['list']]
    : [['html', { open: 'never' }], ['list']],
  webServer: {
    command: 'node apps/showcase-e2e/serve-e2e.mjs',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    cwd: workspaceRoot,
    timeout: 180000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      timeout: 45000,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      timeout: 45000,
    },
  ],
});
