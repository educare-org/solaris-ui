import { test, expect } from '@playwright/test';

test.describe('Toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/toast');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('shows toast on trigger click', async ({ page }) => {
    await page.getByRole('button', { name: 'Neutral' }).click();
    const toast = page.locator('solaris-toast');
    await expect(toast).toBeVisible();
  });

  test('dismisses all toasts', async ({ page }) => {
    await page.getByRole('button', { name: 'Neutral' }).click();
    await expect(page.locator('solaris-toast')).toBeVisible();

    await page.getByRole('button', { name: 'Dismiss All Toasts' }).click();
    await expect(page.locator('solaris-toast')).not.toBeVisible();
  });
});
