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

  test('renders switch selection and end positions', async ({ page }) => {
    await expect(
      page.locator('solaris-selection-card[data-selection="switch"]'),
    ).toHaveCount(2);
    await expect(
      page.locator('solaris-selection-card[data-selection-position="end"]'),
    ).toHaveCount(2);
    await expect(
      page.locator(
        'solaris-selection-card[data-selection="switch"] input[role="switch"]',
      ),
    ).toHaveCount(2);

    const switchInput = page
      .locator('solaris-selection-card[data-selection="switch"] input')
      .first();
    await switchInput.scrollIntoViewIfNeeded();
    await expect(switchInput).toBeChecked();
    await switchInput.click();
    await expect(switchInput).not.toBeChecked();
  });

  test('renders side media cards', async ({ page }) => {
    await expect(
      page.locator('solaris-selection-card[data-media-position="start"]'),
    ).toHaveCount(1);
  });

  test('renders structured cards and appearances', async ({ page }) => {
    const deliveryInputs = page
      .locator('solaris-radio-group')
      .nth(1)
      .locator('input[type="radio"]');

    await expect(
      page.locator('solaris-selection-card[data-has-media]'),
    ).toHaveCount(3);
    await expect(
      page.locator(
        'solaris-selection-card[data-has-media][data-media-position="top"]',
      ),
    ).toHaveCount(2);
    await expect(
      page.locator('solaris-selection-card[data-appearance="surface"]'),
    ).not.toHaveCount(0);
    await expect(
      page.locator('solaris-selection-card[data-appearance="outline"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('solaris-selection-card[data-appearance="tonal"]'),
    ).toHaveCount(1);
    await expect(
      page.locator('solaris-selection-card[data-appearance="glass"]'),
    ).toHaveCount(1);

    const media = page
      .locator('.selection-card-showcase__media-placeholder')
      .first();
    await media.scrollIntoViewIfNeeded();
    const mediaBounds = await media.boundingBox();

    if (!mediaBounds) {
      throw new Error('Structured card media is not visible.');
    }

    await page.mouse.click(
      mediaBounds.x + mediaBounds.width / 2,
      mediaBounds.y + mediaBounds.height / 2,
    );

    await expect(deliveryInputs.nth(0)).toBeChecked();
    await expect(deliveryInputs.nth(1)).not.toBeChecked();
  });
});
