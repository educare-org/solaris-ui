import { test, expect } from '@playwright/test';

test.describe('Select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/select');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('opens dropdown and selects an option', async ({ page }) => {
    const trigger = page.locator('solaris-select').first().locator('.solaris-select__trigger');
    await trigger.click();

    const option = page.locator('solaris-option').first();
    await expect(option).toBeVisible();
    await option.click();

    await expect(trigger.locator('.solaris-select__value')).not.toBeEmpty();
  });

  test('supports keyboard navigation', async ({ page }) => {
    const trigger = page.locator('solaris-select').first().locator('.solaris-select__trigger');
    await trigger.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(trigger.locator('.solaris-select__value')).not.toBeEmpty();
  });
});
