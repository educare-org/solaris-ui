import { test, expect } from '@playwright/test';
import { TooltipPageObject } from './pages/tooltip.po';

test.describe('Tooltip', () => {
  let tooltip: TooltipPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/tooltip');
    await expect(page.locator('h1')).toBeVisible();
    tooltip = new TooltipPageObject(page);
  });

  test('shows tooltip on click trigger', async () => {
    const count = await tooltip.clickTrigger().count();
    test.skip(count === 0, 'No click-trigger tooltips found');

    await tooltip.showViaClick(0);
    await tooltip.assertVisible();
  });
});
