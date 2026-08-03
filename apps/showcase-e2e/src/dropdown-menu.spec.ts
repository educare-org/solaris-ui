import { test, expect } from '@playwright/test';
import { DropdownMenuPageObject } from './pages/dropdown-menu.po';

test.describe('Dropdown Menu', () => {
  let menu: DropdownMenuPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/dropdown-menu');
    await expect(page.locator('h1')).toBeVisible();
    menu = new DropdownMenuPageObject(page);
  });

  test('opens menu and selects an item', async () => {
    await menu.open(0);
    await menu.selectItem('Edit');
  });
});
