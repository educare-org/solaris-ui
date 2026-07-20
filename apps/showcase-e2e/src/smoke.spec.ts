import { test, expect } from '@playwright/test';

const ROUTES = [
  'configuration',
  'badge',
  'skeleton',
  'card',
  'alert',
  'button',
  'icon-button',
  'button-group',
  'form-field',
  'textarea',
  'input',
  'password-field',
  'email-field',
  'checkbox',
  'checkbox-group',
  'radio',
  'radio-group',
  'switch',
  'switch-group',
  'option',
  'select',
  'multi-select',
  'popover',
  'tooltip',
  'toast',
];

for (const route of ROUTES) {
  test(`${route} page loads successfully`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveURL(`/${route}`);
  });
}
