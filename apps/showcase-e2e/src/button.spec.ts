import { test, expect } from '@playwright/test';
import { ButtonPageObject } from './pages/button.po';

test.describe('Button', () => {
  let button: ButtonPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/actions/button');
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

  test('wide shape renders wider than normal', async ({ page }) => {
    const shapeTabs = page.locator('solaris-tabs', {
      has: page.locator('solaris-tab[value="wide"]'),
    });
    const normalButton = page.locator(
      'solaris-tab-panel[value="normal"] button[solaris-button]',
    );
    const wideButton = page.locator(
      'solaris-tab-panel[value="wide"] button[solaris-button]',
    );

    await shapeTabs.locator('solaris-tab[value="normal"]').click();
    await expect(normalButton).toBeVisible();
    const normalWidth = (await normalButton.boundingBox())!.width;

    await shapeTabs.locator('solaris-tab[value="wide"]').click();
    await expect(wideButton).toBeVisible();
    const wideWidth = (await wideButton.boundingBox())!.width;

    expect(wideWidth).toBeGreaterThan(normalWidth + 8);
  });

  test('provider icon updates when switching provider', async ({ page }) => {
    const providerTabs = page.locator('solaris-tabs', {
      has: page.locator('solaris-tab[value="github"]'),
    });
    const preview = providerTabs.locator(
      'xpath=following-sibling::solaris-preview-code[1]',
    );
    const icon = preview.locator('button[solaris-button] solaris-icon');

    await providerTabs.locator('solaris-tab[value="google"]').click();
    await expect(icon).toBeVisible();
    const googleHtml = await icon.innerHTML();

    await providerTabs.locator('solaris-tab[value="microsoft"]').click();
    await expect
      .poll(async () => await icon.innerHTML(), { timeout: 5000 })
      .not.toBe(googleHtml);
  });

  test('full-width button occupies available width', async ({ page }) => {
    const example = page.locator('app-full-width-button-example').first();
    const fullBtn = example
      .locator('button[solaris-button][data-full-width]')
      .first();
    await expect(fullBtn).toBeVisible();
    const exampleBox = (await example.boundingBox())!;
    const btnBox = (await fullBtn.boundingBox())!;
    expect(Math.abs(btnBox.width - exampleBox.width)).toBeLessThan(4);
  });
});
