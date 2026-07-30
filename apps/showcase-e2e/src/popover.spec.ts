import { test, expect } from '@playwright/test';

test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/popover');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('opens and closes popover via trigger click', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Open Popover' });
    await trigger.click();

    const panel = page.locator('.solaris-popover-panel__container');
    await expect(panel).toBeVisible();

    await trigger.click();
    await expect(panel).not.toBeVisible();
  });

  test('closes popover via Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Popover' }).click();
    const panel = page.locator('.solaris-popover-panel__container');
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(panel).not.toBeVisible();
  });

  test('interactive popover has action buttons', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Interactive' });
    await trigger.click();

    const panel = page.locator('.solaris-popover-panel__container');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Cancel' })).toBeVisible();
  });
});
