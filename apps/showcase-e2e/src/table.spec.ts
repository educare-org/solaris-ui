import { test, expect } from '@playwright/test';

test.describe('Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/tables/table');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with a working aside', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Table', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('solaris-table').first()).toBeVisible();
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await expect(aside).toBeVisible();
    const sortingLink = aside.getByRole('link', { name: 'Sorting' });
    await sortingLink.click();
    await expect(sortingLink).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#sorting h2')).toBeInViewport();
  });

  test('cycles sort with aria-sort updates', async ({ page }) => {
    const sortingSection = page.locator('#sorting');
    const nameHeader = sortingSection.locator(
      '.solaris-table__head-cell[data-column-id="name"]',
    );
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    // Keyboard path: the sticky header shifts under pointer scrolling, so
    // the sort button is driven via focus + Enter like keyboard users do.
    const sortButton = nameHeader.getByRole('button');
    await sortButton.focus();
    await page.keyboard.press('Enter');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await page.keyboard.press('Enter');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('selects rows through multiple selection tabs', async ({ page }) => {
    const selectionSection = page.locator('#selection');
    await selectionSection.getByRole('tab', { name: 'Multiple' }).click();
    // The native input is visually hidden; dispatch click like the label
    // does and assert the checked state afterwards.
    const firstInput = selectionSection
      .locator('tbody solaris-checkbox input')
      .first();
    await firstInput.dispatchEvent('click');
    await expect(firstInput).toBeChecked();
  });

  test('combines table and pagination', async ({ page }) => {
    const combinedSection = page.locator('#with-pagination');
    await expect(
      combinedSection.locator('.solaris-table__footer solaris-pagination'),
    ).toBeVisible();
    await expect(combinedSection.getByText('1–5 of 32')).toBeVisible();
    await combinedSection.getByRole('button', { name: 'Next page' }).click();
    await expect(combinedSection.getByText('6–10 of 32')).toBeVisible();
  });
});
