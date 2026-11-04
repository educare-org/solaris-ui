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
    const sortingLink = aside.getByRole('link', { name: 'Interaction' });
    await sortingLink.click();
    await expect(sortingLink).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('#interaction h2')).toBeInViewport();
  });

  test('cycles sort with aria-sort updates', async ({ page }) => {
    const sortingSection = page.locator('#interaction');
    const nameHeader = sortingSection
      .locator('.solaris-table__head-cell[data-column-id="name"]')
      .first();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    const sortButton = nameHeader.getByRole('button');
    await sortButton.focus();
    await page.keyboard.press('Enter');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await page.keyboard.press('Enter');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('selects rows through multiple selection tabs', async ({ page }) => {
    const selectionSection = page.locator('#interaction');
    await selectionSection.getByRole('tab', { name: 'Multiple' }).click();
    const firstInput = selectionSection
      .locator('tbody solaris-checkbox input')
      .first();
    await firstInput.dispatchEvent('click');
    await expect(firstInput).toBeChecked();
  });

  test('combines table and pagination', async ({ page }) => {
    const combinedSection = page.locator('#advanced');
    const combinedTable = combinedSection.locator(
      'app-with-pagination-table-example',
    );
    await expect(
      combinedTable.locator('.solaris-table__footer solaris-pagination'),
    ).toBeVisible();
    await expect(combinedTable.getByText('1–5 of 32')).toBeVisible();
    await combinedTable.getByRole('button', { name: 'Next page' }).click();
    await expect(combinedTable.getByText('6–10 of 32')).toBeVisible();
  });

  test('renders the props table as cards at 390px with no horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/data-display/tables/table');
    const propsSection = page.locator('#props');
    await expect(
      propsSection.locator('.solaris-table__cards-list'),
    ).toBeVisible();
    await expect(propsSection.locator('.solaris-table__table')).toHaveCount(0);
    const overflow = await propsSection.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });

  test('applies column reorder to cards in the selection demo', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/data-display/tables/table');
    const example = page.locator('app-with-selection-toolbar-table-example');
    await example.scrollIntoViewIfNeeded();
    await example.locator('solaris-table-toolbar button').first().click();
    await page.getByRole('dialog').waitFor();
    await page
      .getByRole('dialog')
      .first()
      .getByRole('button', { name: /colunas|columns|columnas/i })
      .click();
    const columnsDialog = page.getByRole('dialog').last();
    await columnsDialog
      .locator('.solaris-column-manager__item')
      .nth(0)
      .locator('.solaris-column-manager__moves button')
      .nth(1)
      .click();
    await columnsDialog
      .locator('.solaris-column-manager__item')
      .nth(1)
      .locator('.solaris-column-manager__moves button')
      .nth(1)
      .click();
    const managerOrder = await columnsDialog
      .locator('.solaris-column-manager__label')
      .allTextContents();
    await columnsDialog
      .getByRole('button', { name: /salvar|save|guardar/i })
      .click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      example
        .locator('.solaris-table__card')
        .first()
        .locator('.solaris-table__card-label'),
    ).toHaveText(managerOrder.map((text) => text.trim()));
  });
});
