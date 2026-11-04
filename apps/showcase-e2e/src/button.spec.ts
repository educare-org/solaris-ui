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
    const section = page.locator('#shape-radius');
    const previewButton = section
      .locator('solaris-preview-code button[solaris-button]')
      .nth(1);

    await section.getByRole('tab', { name: 'normal' }).click();
    await expect(previewButton).toBeVisible();
    const normalBox = await previewButton.boundingBox();
    if (!normalBox) throw new Error('expected preview button to be measurable');
    const normalWidth = normalBox.width;

    await section.getByRole('tab', { name: 'wide' }).click();
    await expect(previewButton).toBeVisible();
    const wideBox = await previewButton.boundingBox();
    if (!wideBox) throw new Error('expected preview button to be measurable');
    const wideWidth = wideBox.width;

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

  test('async action shows busy state then succeeds', async ({ page }) => {
    const example = page.locator('#async app-async-button-example');
    const actionButton = example.locator('button[solaris-button]').first();
    await expect(actionButton).toBeVisible();

    await actionButton.click();
    await expect(actionButton).toHaveAttribute('aria-busy', 'true');

    await expect(
      example.getByText('Saved successfully.'),
      'async action should resolve and show the success message',
    ).toBeVisible({ timeout: 8000 });
    await expect(actionButton).not.toHaveAttribute('aria-busy', 'true');
  });
});
