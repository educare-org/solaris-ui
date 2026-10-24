import { test, expect } from '@playwright/test';

test.describe('RecordGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-display/tables/record-grid');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('renders inside the shell with a working aside', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: 'Record grid', exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('solaris-record-grid').first()).toBeVisible();
    const aside = page.getByRole('navigation', { name: 'On this page' });
    await expect(aside).toBeVisible();
    const editingLink = aside.getByRole('link', { name: 'Editing' });
    await editingLink.click();
    await expect(editingLink).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#editing h2')).toBeInViewport();
  });

  test('cycles record sort with nulls last', async ({ page }) => {
    const basicSection = page.locator('#basic');
    const presentHeader = basicSection.locator(
      '.solaris-record-grid__head-cell[data-column-id="present"]',
    );
    await expect(presentHeader).toHaveAttribute('aria-sort', 'none');
    const sortButton = presentHeader.getByRole('button');
    await sortButton.focus();
    await page.keyboard.press('Enter');
    await expect(presentHeader).toHaveAttribute('aria-sort', 'ascending');
    const lastRow = basicSection
      .locator('tbody tr.solaris-record-grid__row')
      .last();
    await expect(lastRow.locator('td[data-column-id="present"]')).toContainText(
      '—',
    );
  });

  test('edits a record inline and commits on change', async ({ page }) => {
    const basicSection = page.locator('#basic');
    const cell = basicSection
      .locator('tbody tr.solaris-record-grid__row')
      .first()
      .locator('td[data-column-id="present"]');
    await cell.dblclick();
    const input = basicSection.locator('input.solaris-record-grid__editor');
    await expect(input).toBeVisible();
    await input.fill('9');
    await page.keyboard.press('Enter');
    await expect(cell).toContainText('9');
  });

  test('merges section cells with rowspan', async ({ page }) => {
    const mergingSection = page.locator('#merging');
    const shiftCell = mergingSection
      .locator('tbody tr.solaris-record-grid__row')
      .first()
      .locator('td[data-column-id="shift"]');
    await expect(shiftCell).toHaveAttribute('rowspan', '3');
  });
});
