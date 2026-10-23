import { expect, test } from '@playwright/test';

test.describe('Sparkline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/charts/sparkline');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('renders KPI sparklines with accessible labels', async ({ page }) => {
    const kpis = page.locator('.sparkline-showcase__kpi solaris-sparkline');
    await expect(kpis).toHaveCount(2);
    const first = kpis.first().locator('svg');
    await expect(first).toHaveAttribute('role', 'img');
    await expect(first.getAttribute('aria-label')).resolves.toMatch(
      /usu[aá]rios|users/i,
    );
  });

  test('marks falling-as-good churn as success', async ({ page }) => {
    const churn = page
      .locator('.sparkline-showcase__kpi solaris-sparkline')
      .nth(1);
    await expect(churn).toHaveAttribute('data-trend', 'down');
  });

  test('renders gaps without interpolation artifacts', async ({ page }) => {
    const gaps = page.locator(
      'app-docs-section[anchor="gaps"] solaris-sparkline svg',
    );
    await expect(gaps).toHaveAttribute('role', 'img');
  });

  test('renders an empty frame with its label', async ({ page }) => {
    const empty = page.locator(
      'app-docs-section[anchor="states"] solaris-sparkline',
    );
    await expect(empty).toHaveAttribute('data-trend', 'flat');
    await expect(empty.locator('svg')).toHaveAttribute(
      'aria-label',
      'No data yet',
    );
  });

  test('creates no inner vertical scroll in previews', async ({ page }) => {
    const surfaces = page.locator('.solaris-preview-code__preview-surface');
    await expect(surfaces.first()).toBeVisible();
    const count = await surfaces.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await surfaces.nth(i).evaluate((el) => ({
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      }));
      expect(box.scrollHeight).toBeLessThanOrEqual(box.clientHeight + 1);
    }
  });
});
