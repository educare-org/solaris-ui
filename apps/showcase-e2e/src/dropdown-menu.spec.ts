import { test, expect } from '@playwright/test';

test.describe('Dropdown Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dropdown-menu');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('opens menu and selects an item', async ({ page }) => {
    const trigger = page.locator('[solaris-dropdown-menu-trigger]').first();
    await trigger.click();
    const menu = page.locator('.solaris-dropdown-menu__wrapper');
    await expect(menu).toBeVisible();

    await page.getByRole('menuitem', { name: 'Edit' }).click();
  });
});
