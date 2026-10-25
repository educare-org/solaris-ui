import { expect, test } from '@playwright/test';

test.describe('Selection Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/selection-card');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('selects a plan through the card radio input', async ({ page }) => {
    const planInputs = page
      .locator('solaris-radio-group')
      .first()
      .locator('input[type="radio"]');

    await expect(planInputs.nth(1)).toBeChecked();
    await planInputs.nth(0).check();

    await expect(planInputs.nth(0)).toBeChecked();
    await expect(planInputs.nth(1)).not.toBeChecked();
  });

  test('supports native arrow-key radio navigation', async ({ page }) => {
    const planInputs = page
      .locator('solaris-radio-group')
      .first()
      .locator('input[type="radio"]');

    await planInputs.nth(1).focus();
    await page.keyboard.press('ArrowDown');

    await expect(planInputs.nth(2)).toBeChecked();
  });

  test('renders semantic and custom color examples', async ({ page }) => {
    await expect(
      page.locator('solaris-selection-card[data-color="neutral"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-color="primary"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-color="success"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-color="warning"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-color="danger"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-color="info"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-color="custom"]'),
    ).toHaveCount(1);
  });

  test('renders side media cards', async ({ page }) => {
    await expect(
      page.locator('solaris-selection-card[data-media-position="start"]'),
    ).toHaveCount(1);
  });
});
