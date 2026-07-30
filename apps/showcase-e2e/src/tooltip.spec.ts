import { test, expect } from '@playwright/test';

test.describe('Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tooltip');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('shows tooltip on click trigger', async ({ page }) => {
    const triggers = page.locator('[solarisTooltipTrigger="click"]');
    const count = await triggers.count();
    test.skip(count === 0, 'No click-trigger tooltips found');

    await triggers.first().click();
    await page.waitForTimeout(300);
    const tooltip = page.locator('.solaris-tooltip-panel');
    await expect(tooltip).toBeVisible({ timeout: 3000 });
  });
});
