import { test, expect } from '@playwright/test';

const ROUTES = [
  'configuration',
  'icons',
  'data-display/badge',
  'feedback/loading/skeleton',
  'feedback/loading/spinner',
  'feedback/loading/progress',
  'feedback/loading/loading-text',
  'data-display/card',
  'feedback/alert',
  'actions/button',
  'actions/icon-button',
  'actions/button-group',
  'forms/form-field',
  'forms/textarea',
  'forms/input',
  'forms/password-field',
  'forms/email-field',
  'forms/file-upload',
  'forms/checkbox',
  'forms/checkbox-group',
  'forms/radio',
  'forms/radio-group',
  'forms/selection-card',
  'forms/date-picker',
  'forms/switch',
  'forms/switch-group',
  'forms/option',
  'forms/select',
  'forms/multi-select',
  'interaction/popover',
  'interaction/tooltip',
  'feedback/toast',
  'overlay/dialog',
  'navigation/tabs',
  'navigation/breadcrumb',
  'navigation/stepper',
  'navigation/segmented-control',
  'content/divider',
  'interaction/dropdown-menu',
  'interaction/collapsible',
  'interaction/accordion',
  'navigation/editable-tabs',
];

for (const route of ROUTES) {
  test(`${route} page loads successfully`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveURL(`/${route}`);
  });
}
