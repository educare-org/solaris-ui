import { test, expect } from '@playwright/test';

test.describe('Code Block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/code-block');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Code block', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('solaris-code-block').first()).toBeVisible();
  });

  test('copies code through the copy action', async ({ page, browserName }) => {
    if (browserName === 'chromium') {
      await page.context().grantPermissions(['clipboard-write']);
    }
    const block = page.locator('solaris-code-block').first();
    await block.getByRole('button', { name: 'Copy code' }).click();
    await expect(
      block.getByRole('button', { name: 'Code copied' }),
    ).toBeVisible();
  });

  test('expands collapsed long content', async ({ page }) => {
    const expandable = page
      .locator('solaris-code-block[data-collapsible="true"]')
      .first();
    await expect(expandable).toHaveAttribute('data-expanded', 'false');
    await expandable.getByRole('button', { name: 'Expand code' }).click();
    await expect(expandable).toHaveAttribute('data-expanded', 'true');
  });
});
