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

  test('full-width button occupies available section width', async ({
    page,
  }) => {
    const card = page
      .locator('.button-showcase__section')
      .filter({ has: page.locator('button[data-full-width]') })
      .first();
    const fullBtn = card
      .locator('button[solaris-button][data-full-width]')
      .first();
    await expect(fullBtn).toBeVisible();
    const cardBox = (await card.boundingBox())!;
    const btnBox = (await fullBtn.boundingBox())!;
    const cardPadding = 24; // --solaris-spacing-6
    const expected = cardBox.width - cardPadding * 2;
    expect(Math.abs(btnBox.width - expected)).toBeLessThan(4);
    expect(btnBox.width).toBeGreaterThan(384);
  });
});
