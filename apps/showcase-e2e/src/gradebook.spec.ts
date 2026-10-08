import { test, expect } from '@playwright/test';

test.describe('Gradebook', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/tables/gradebook');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with a working aside', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Gradebook', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('solaris-gradebook').first()).toBeVisible();
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await expect(aside).toBeVisible();
    const editingLink = aside.getByRole('link', { name: 'Editing' });
    await editingLink.click();
    await expect(editingLink).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#editing h2')).toBeInViewport();
  });

  test('cycles grade sort with nulls last', async ({ page }) => {
    const basicSection = page.locator('#basic');
    const gradeHeader = basicSection.locator(
      '.solaris-table__head-cell[data-column-id="gs1"]',
    );
    await expect(gradeHeader).toHaveAttribute('aria-sort', 'none');
    const sortButton = gradeHeader.getByRole('button');
    await sortButton.focus();
    await page.keyboard.press('Enter');
    await expect(gradeHeader).toHaveAttribute('aria-sort', 'ascending');
    const lastRow = basicSection.locator('tbody tr.solaris-table__row').last();
    await expect(lastRow.locator('td[data-column-id="gs1"]')).toContainText(
      '—',
    );
  });

  test('edits a grade inline and commits on change', async ({ page }) => {
    const editingSection = page.locator('#editing');
    const cell = editingSection
      .locator('tbody tr.solaris-table__row')
      .first()
      .locator('td[data-column-id="gs1"]');
    await cell.dblclick();
    const input = editingSection.locator('input.solaris-gradebook__editor');
    await expect(input).toBeVisible();
    await input.fill('19');
    await page.keyboard.press('Enter');
    await expect(cell).toContainText('19');
  });
});
