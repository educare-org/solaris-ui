import { test, expect } from '@playwright/test';

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/navigation/pagination');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with a working aside', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Pagination', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('solaris-pagination').first()).toBeVisible();
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await expect(aside).toBeVisible();
    const densityLink = aside.getByRole('link', { name: 'Density' });
    await densityLink.click();
    await expect(densityLink).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#density h2')).toBeInViewport();
  });

  test('navigates pages with first/prev/next/last', async ({ page }) => {
    const basicSection = page.locator('#basic');
    await expect(basicSection.getByText('1–10 of 95')).toBeVisible();
    await basicSection.getByRole('button', { name: 'Next page' }).click();
    await expect(basicSection.getByText('11–20 of 95')).toBeVisible();
    await basicSection.getByRole('button', { name: 'Last page' }).click();
    await expect(basicSection.getByText('91–95 of 95')).toBeVisible();
    await basicSection.getByRole('button', { name: 'First page' }).click();
    await expect(basicSection.getByText('1–10 of 95')).toBeVisible();
  });

  test('renders the compact range for unknown totals', async ({ page }) => {
    const unknownSection = page.locator('#unknown-total');
    await expect(unknownSection.getByText('21–30')).toBeVisible();
    await expect(
      unknownSection.getByRole('button', { name: 'Next page' }),
    ).toBeEnabled();
  });

  test('switches density through tabs', async ({ page }) => {
    const densitySection = page.locator('#density');
    await densitySection.getByRole('tab', { name: 'Compact' }).click();
    await expect(
      densitySection.locator('solaris-pagination[data-density="compact"]'),
    ).toBeVisible();
  });
});
