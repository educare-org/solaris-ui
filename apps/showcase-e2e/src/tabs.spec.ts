import { test, expect } from '@playwright/test';

test.describe('Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tabs');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('activates tab on click', async ({ page }) => {
    const tablist = page.locator('app-basic-tabs-example').locator('[role="tablist"]');
    const tabs = tablist.locator('[role="tab"]');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(2);

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
  });

  test('switches panel content', async ({ page }) => {
    const section = page.locator('app-tabs-with-panels-example');
    const tabs = section.locator('[role="tab"]');
    const panels = section.locator('solaris-tab-panel');

    await tabs.nth(1).click();
    await expect(panels.nth(0)).toHaveAttribute('hidden', '');
    await expect(panels.nth(1)).not.toHaveAttribute('hidden');
  });
});
