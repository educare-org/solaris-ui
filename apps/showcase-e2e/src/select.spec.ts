import { test, expect } from '@playwright/test';
import { SelectPageObject } from './pages/select.po';

test.describe('Select', () => {
  let select: SelectPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/select');
    await expect(page.locator('h1')).toBeVisible();
    select = new SelectPageObject(page);
  });

  test('opens dropdown and selects an option', async () => {
    await select.openAndSelect(0, 0);
    await select.assertHasValue(0);
  });

  test('supports keyboard navigation', async () => {
    await select.keyboardNavigateAndSelect(0);
    await select.assertHasValue(0);
  });
});
