import { test, expect } from '@playwright/test';
import { IconsPageObject } from './pages/icons.po';

test.describe('Icons', () => {
  let icons: IconsPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/icons');
    await expect(
      page.getByRole('heading', { name: 'Icons', exact: true }),
    ).toBeVisible();
    icons = new IconsPageObject(page);
  });

  test('lists all built-in icons', async () => {
    await expect(icons.gridItems()).toHaveCount(209);
  });

  test('filters icons by search', async () => {
    await icons.search('bookmark');
    await expect(icons.gridItems()).toHaveCount(2);
    await expect(icons.iconItem('bookmark')).toBeVisible();
  });

  test('finds icons by keyword in another language', async () => {
    await icons.search('save');
    await expect(icons.gridItems()).toHaveCount(2);
    await expect(icons.iconItem('bookmark')).toBeVisible();
    await expect(icons.iconItem('save')).toBeVisible();
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
    await expect(icons.gridItems()).toHaveCount(12);
    await expect(icons.iconItem('mail')).toBeVisible();
    await expect(icons.iconItem('inbox')).toBeVisible();
    await expect(icons.iconItem('message-square')).toBeVisible();
  });

  test('filters icons by brands category', async () => {
    await icons.category('Brands').click();
    await expect(icons.gridItems()).toHaveCount(7);
    await expect(icons.iconItem('google')).toBeVisible();
    await expect(icons.iconItem('microsoft')).toBeVisible();
    await expect(icons.iconItem('github')).toBeVisible();
  });

  test('customizer changes width for all icons', async () => {
    const slider = icons.widthSlider();
    await slider.fill('48');

    await expect(icons.widthValue()).toHaveText('48px');

    const icon = icons.itemIcon('check');
    await expect(icon).toHaveCSS('width', '48px');
  });

  test('customizer changes color for all icons', async () => {
    await icons.colorSwatch('Primary').click();

    const icon = icons.itemIcon('check');
    await expect(icon).toHaveCSS('color', 'rgb(63, 93, 202)');
    await expect(icons.colorPicker()).toHaveCSS(
      'background-color',
      'rgb(63, 93, 202)',
    );
  });

  test('customizer shows hex value for standard swatch', async () => {
    await icons.colorSwatch('Warning').click();
    await expect(icons.colorHexInput()).toBeVisible();
    await expect(icons.colorHexInput()).toHaveValue(/#[0-9a-fA-F]{6}/);
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
    await expect(icon).not.toHaveCSS('color', 'rgb(63, 93, 202)');
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
    await expect(icons.copyButtonCopiedState()).toBeVisible();
    await expect(icons.copyButtonIcon()).toBeVisible();

    if (browserName === 'chromium') {
      const clipboard = await page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboard).toBe('<solaris-icon name="check" />');
    }
  });

  test('usage sheet copy button reverts to copy icon after a delay', async ({
    page,
    browserName,
  }) => {
    await icons.iconItem('check').click();

    if (browserName === 'chromium') {
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);
    }

    await icons.copyButton().click();
    await expect(icons.copyButtonCopiedState()).toBeVisible();

    await expect(icons.copyButtonCopiedState()).toHaveCount(0, {
      timeout: 5000,
    });
  });

  test('usage dialog is centered with spacing', async () => {
    await icons.iconItem('check').click();
    const panel = icons.usagePanel();
    await expect(panel).toBeVisible();

    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeLessThanOrEqual(720);

    const viewport = await icons.page.viewportSize();
    expect(box!.x).toBeGreaterThan(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  });

  test('usage dialog enables the backdrop', async () => {
    await icons.iconItem('check').click();
    const container = icons.usageDialogContainer();
    await expect(container).toHaveAttribute('data-backdrop', 'true');
  });

  test('usage sheet shows a square preview beside the title', async () => {
    await icons.iconItem('check').click();

    const main = icons.page.locator('.icon-usage-sheet__main');
    const preview = icons.page.locator('.icon-usage-sheet__preview');
    const info = icons.page.locator('.icon-usage-sheet__info');

    await expect(main).toBeVisible();
    await expect(preview).toBeVisible();
    await expect(info).toBeVisible();

    const previewBox = await preview.boundingBox();
    expect(previewBox).not.toBeNull();
    expect(previewBox!.width).toBeCloseTo(previewBox!.height, 0);
  });

  test('usage sheet uses the standard dialog close button', async () => {
    await icons.iconItem('check').click();
    await expect(icons.usageStandardCloseButton()).toBeVisible();
    await expect(icons.usageCloseButton()).toBeVisible();
  });

  test('usage sheet closes via close button', async () => {
    await icons.iconItem('check').click();
    await expect(icons.usageSheet()).toBeVisible();

    await icons.usageCloseButton().click();
    await expect(icons.usageSheet()).toHaveCount(0);
  });

  test('locks background scroll while the usage dialog is open', async () => {
    await icons.iconItem('check').click();
    await expect(icons.usageSheet()).toBeVisible();

    await icons.page.evaluate(() => window.scrollBy(0, 200));
    const scrollY = await icons.page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test('selecting another icon updates the single usage sheet', async () => {
    await icons.iconItem('chevron-down').click();
    await expect(icons.usageSnippet()).toHaveText(
      '<solaris-icon name="chevron-down" />',
    );

    await icons.usageCloseButton().click();
    await icons.iconItem('chevron-right').click();

    await expect(icons.usageSheet()).toHaveCount(1);
    await expect(icons.usageSnippet()).toHaveText(
      '<solaris-icon name="chevron-right" />',
    );
  });

  test('switching variant keeps all icons visible without badges', async () => {
    await icons.variantTab('Solid').click();
    await expect(icons.iconItem('bookmark')).toBeVisible();
    await expect(icons.iconItem('chart-spline')).toBeVisible();

    await icons.variantTab('Outline').click();
    await expect(icons.iconItem('bookmark')).toBeVisible();
  });

  test('stroke customizer changes stroke width', async () => {
    await icons.strokeSlider().fill('3');

    await expect(icons.itemSvg('check')).toHaveAttribute('stroke-width', '3');
  });

  test('usage dialog offers angular and svg snippets', async () => {
    await icons.iconItem('check').click();

    await expect(icons.usageSnippet()).toHaveText(
      '<solaris-icon name="check" />',
    );
    const svg = await icons.svgSnippet().textContent();
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 24 24"');
  });
});
