import { test, expect } from '@playwright/test';
import { PopoverPageObject } from './pages/popover.po';

test.describe('Popover', () => {
  let popover: PopoverPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction/popover');
    await expect(page.locator('h1')).toBeVisible();
    popover = new PopoverPageObject(page);
  });

  test('opens and closes popover via trigger click', async () => {
    await popover.open('Open Popover');
    await popover.assertVisible();

    await popover.open('Open Popover');
    await popover.assertNotVisible();
  });

  test('closes popover via Escape', async () => {
    await popover.open('Open Popover');
    await popover.assertVisible();

    await popover.closeViaEscape();
    await popover.assertNotVisible();
  });
});
