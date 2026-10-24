import { test, expect } from '@playwright/test';

test.describe('Preview Code', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/preview-code');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with preview panel first', async ({
    page,
  }) => {
    await expect(
      page.getByRole('link', { name: 'Preview code', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    const preview = page.locator('solaris-preview-code').first();
    await expect(preview).toBeVisible();
    await expect(preview).toHaveAttribute('data-active-tab', 'preview');
    await expect(
      preview.locator('.solaris-preview-code__panel--preview'),
    ).toBeVisible();
  });

  test('switches to the code panel on tab change', async ({ page }) => {
    const preview = page.locator('solaris-preview-code').first();
    await preview.getByRole('radio', { name: 'Code', exact: true }).click();
    await expect(preview).toHaveAttribute('data-active-tab', 'code');
    await expect(preview.locator('solaris-code-block').first()).toBeVisible();
  });
});
