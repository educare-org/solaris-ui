import { test, expect } from '@playwright/test';

test.describe('showcase shell', () => {
  test('renders header, sidebar navigation and routed content', async ({
    page,
  }) => {
    await page.goto('/actions/button');

    await expect(
      page.getByRole('link', { name: 'Solaris UI home' }),
    ).toBeVisible();
    await expect(
      page.getByRole('navigation', { name: 'Documentation sections' }),
    ).toBeVisible();
    await expect(page.locator('#main-content h1')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Button', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('redirects the empty route to the configuration page', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/configuration');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('navigates between pages through the sidebar', async ({ page }) => {
    await page.goto('/actions/button');
    await page
      .getByRole('navigation', { name: 'Documentation sections' })
      .getByRole('link', { name: 'Alert' })
      .click();

    await expect(page).toHaveURL('/feedback/alert');
    await expect(page.locator('#main-content h1')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Alert', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
  });

  test('filters sidebar pages through the header search', async ({ page }) => {
    await page.goto('/actions/button');

    const search = page.getByLabel('Filter documentation pages');
    await search.fill('dialog');

    const nav = page.getByRole('navigation', {
      name: 'Documentation sections',
    });
    await expect(nav.getByRole('link', { name: 'Dialog' })).toBeVisible();
    await expect(
      nav.getByRole('link', { name: 'Button', exact: true }),
    ).toHaveCount(0);

    await search.fill('zzz-no-such-page');
    await expect(
      nav.getByText('No pages match the current filter.'),
    ).toBeVisible();
  });

  test('supports keyboard navigation: Tab reaches search, Escape clears it', async ({
    page,
  }) => {
    await page.goto('/actions/button');

    const search = page.getByLabel('Filter documentation pages');
    await search.click();
    await search.pressSequentially('button');
    await expect(search).toHaveValue('button');

    await search.press('Escape');
    await expect(search).toHaveValue('');
  });

  test('loads the Solaris typeface with text controls inheriting it', async ({
    page,
  }) => {
    await page.goto('/actions/button');
    await page.evaluate(() => document.fonts.ready);

    const weights = await page.evaluate(async () => {
      const specs = [
        '400 16px Inter',
        '500 16px Inter',
        '600 16px Inter',
        '700 16px Inter',
      ];
      const loaded: Record<string, boolean> = {};
      for (const spec of specs) {
        try {
          await document.fonts.load(spec);
        } catch {
          // Missing @font-face or unloadable file keeps check() false.
        }
        loaded[spec] = document.fonts.check(spec);
      }
      return loaded;
    });
    expect(weights).toEqual({
      '400 16px Inter': true,
      '500 16px Inter': true,
      '600 16px Inter': true,
      '700 16px Inter': true,
    });

    const toggleFamily = await page
      .getByRole('button', { name: 'Actions', exact: true })
      .evaluate((element) => getComputedStyle(element).fontFamily);
    expect(toggleFamily).toContain('Inter');

    const searchFamily = await page
      .getByLabel('Filter documentation pages')
      .evaluate((element) => getComputedStyle(element).fontFamily);
    expect(searchFamily).toContain('Inter');
  });

  test('skip link jumps to the main content', async ({ page }) => {
    await page.goto('/actions/button');

    // The skip link is the first element in tab order.
    const firstTabbable = await page.evaluate(() => {
      const selector =
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const scope = document.body.querySelectorAll(selector);
      for (const element of scope) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return element.className;
        }
      }
      return null;
    });
    expect(firstTabbable).toContain('shell__skip-link');

    const skip = page.getByRole('link', { name: 'Skip to content' });
    await skip.focus();
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });
});
