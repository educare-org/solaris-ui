import { test, expect } from '@playwright/test';

test.describe('Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/button');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders all appearance variants', async ({ page }) => {
    const buttons = page.locator('button[solaris-button]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(10);
  });

  test('disabled button is not clickable', async ({ page }) => {
    const disabledBtn = page
      .locator('button[solaris-button][disabled]')
      .first();
    await expect(disabledBtn).toBeDisabled();
  });

  test('anchor button renders', async ({ page }) => {
    const anchor = page.locator('a[solaris-button]').first();
    await expect(anchor).toBeVisible();
  });
});
