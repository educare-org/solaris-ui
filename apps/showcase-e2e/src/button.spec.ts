import { test, expect } from '@playwright/test';
import { ButtonPageObject } from './pages/button.po';

test.describe('Button', () => {
  let button: ButtonPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/button');
    await expect(page.locator('h1')).toBeVisible();
    button = new ButtonPageObject(page);
  });

  test('renders all appearance variants', async () => {
    const count = await button.buttons().count();
    expect(count).toBeGreaterThan(10);
  });

  test('disabled button is not clickable', async () => {
    await button.assertDisabled();
    await expect(button.disabledButton()).toBeDisabled();
  });

  test('anchor button renders', async () => {
    await button.assertAnchorVisible();
  });
});
