import { test, expect } from '@playwright/test';
import { IconsPageObject } from './pages/icons.po';

test.describe('Icons', () => {
  let icons: IconsPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/icons');
    await expect(page.locator('h1')).toBeVisible();
    icons = new IconsPageObject(page);
  });

  test('lists all built-in icons', async () => {
    await expect(icons.gridItems()).toHaveCount(108);
  });

  test('filters icons by search', async () => {
    await icons.search('bookmark');
    await expect(icons.gridItems()).toHaveCount(1);
    await expect(icons.iconItem('bookmark')).toBeVisible();
  });

  test('shows empty state when no icon matches', async () => {
    await icons.search('nonexistent-icon');
    await expect(icons.gridItems()).toHaveCount(0);
    await expect(icons.page.locator('.icons-showcase__empty')).toBeVisible();
  });

  test('filters icons by category', async () => {
    await icons.category('Theme').click();
    await expect(icons.gridItems()).toHaveCount(3);
    await expect(icons.iconItem('sun')).toBeVisible();
    await expect(icons.iconItem('monitor')).toBeVisible();
  });

  test('filters icons by new communication category', async () => {
    await icons.category('Communication').click();
    await expect(icons.gridItems()).toHaveCount(11);
    await expect(icons.iconItem('mail')).toBeVisible();
    await expect(icons.iconItem('inbox')).toBeVisible();
    await expect(icons.iconItem('message-square')).toBeVisible();
  });

  test('customizer changes width for all icons', async () => {
    const slider = icons.widthSlider();
    await slider.fill('3');

    await expect(icons.widthValue()).toHaveText('3rem');

    const icon = icons.itemIcon('check');
    await expect(icon).toHaveCSS('width', '48px');
  });

  test('customizer changes color for all icons', async () => {
    await icons.colorSwatch('Primary').click();

    const icon = icons.itemIcon('check');
    await expect(icon).toHaveCSS('color', 'rgb(66, 130, 251)');
    await expect(icons.colorPicker()).toHaveCSS(
      'background-color',
      'rgb(66, 130, 251)',
    );
  });

  test('customizer shows swatch color name in value', async () => {
    await icons.colorSwatch('Warning').click();
    await expect(icons.colorValue()).toHaveText('Warning');
  });

  test('customizer shows hex input for custom color', async () => {
    await icons.colorPicker().evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '#ff0000';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await expect(icons.colorHexInput()).toHaveValue('#ff0000');
    await expect(icons.itemIcon('check')).toHaveCSS('color', 'rgb(255, 0, 0)');
  });

  test('customizer edits color via hex input', async () => {
    await icons.colorPicker().evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '#00ff00';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await icons.colorHexInput().fill('#0000ff');
    await icons.colorHexInput().press('Enter');
    await expect(icons.itemIcon('check')).toHaveCSS('color', 'rgb(0, 0, 255)');
  });

  test('customizer inherit color resets styling', async () => {
    await icons.colorSwatch('Primary').click();
    await icons.colorSwatch('Inherit').click();

    const icon = icons.itemIcon('check');
    await expect(icon).not.toHaveCSS('color', 'rgb(66, 130, 251)');
  });

  test('reveals usage snippet and copies it on click', async ({
    page,
    browserName,
  }) => {
    await icons.iconItem('check').click();
    await expect(icons.usageSection()).toBeVisible();
    await expect(icons.usageSnippet()).toHaveText(
      '<solaris-icon name="check" />',
    );

    if (browserName === 'chromium') {
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);
    }

    await icons.copyButton().click();
    await expect(
      icons.page.getByRole('button', { name: 'Copied!' }),
    ).toBeVisible();

    if (browserName === 'chromium') {
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboard).toBe('<solaris-icon name="check" />');
    }
  });

  test('usage sheet is fixed to the bottom of the viewport', async () => {
    await icons.iconItem('check').click();
    const sheet = icons.usageSheet();
    await expect(sheet).toBeVisible();

    const box = await sheet.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(640);

    const viewport = await icons.page.viewportSize();
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
    expect(box!.y + box!.height).toBeGreaterThan(viewport!.height - 80);
  });

  test('usage sheet closes via close button', async () => {
    await icons.iconItem('check').click();
    await expect(icons.usageSheet()).toBeVisible();

    await icons.usageCloseButton().click();
    await expect(icons.usageSheet()).toHaveCount(0);
  });
});
