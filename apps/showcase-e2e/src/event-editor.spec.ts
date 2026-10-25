import { expect, test } from '@playwright/test';

test.describe('Event editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scheduling/event-editor');
    await expect(page.locator('h1')).toBeVisible();
    await page.waitForLoadState('networkidle');
  });

  test('opens the editor in a dialog and saves an immutable draft', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', { name: /Edit single event|Editar evento único/ })
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const active = document.activeElement;
          return Boolean(active && active.closest('.solaris-dialog-panel'));
        }),
      )
      .toBe(true);
    const title = panel.locator('input[type="text"]').first();
    await title.click();
    await expect(title).toBeFocused();
    await title.fill('Renamed planning');
    await panel.getByRole('button', { name: /Save|Salvar|Guardar/ }).click();
    await expect(panel).toBeHidden();
    await expect(page.getByTestId('event-log')).toHaveText(
      /save:planning:Renamed planning/,
    );
  });

  test('traps focus inside the dialog and closes on Escape', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', {
        name: /Edit recurring event|Editar evento recorrente/,
      })
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const title = panel.locator('input[type="text"]').first();
    await title.click();
    await expect(title).toBeFocused();
    for (let index = 0; index < 30; index += 1) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const active = document.activeElement;
        if (!active) return false;
        return Boolean(active.closest('.solaris-dialog-panel'));
      });
      expect(focused).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('deletes a recurring occurrence with scope this and following', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', {
        name: /Edit recurring event|Editar evento recorrente/,
      })
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const thisEvent = panel.locator('solaris-radio', {
      hasText: /This event|Este evento/,
    });
    await thisEvent.scrollIntoViewIfNeeded({ timeout: 10000 });
    await thisEvent.click({ timeout: 10000 });
    await panel
      .getByRole('button', { name: /Delete|Excluir|Eliminar/ })
      .click();
    await expect(panel).toBeHidden();
    await expect(page.getByTestId('event-log')).toHaveText(
      /delete:standup:this:2026-10-22/,
    );

    await examples
      .getByRole('button', {
        name: /Edit recurring event|Editar evento recorrente/,
      })
      .click();
    await expect(panel).toBeVisible();
    const following = panel.locator('solaris-radio', {
      hasText: /following|seguintes|siguientes/,
    });
    await following.scrollIntoViewIfNeeded({ timeout: 10000 });
    await following.click({ timeout: 10000 });
    await panel
      .getByRole('button', { name: /Delete|Excluir|Eliminar/ })
      .click();
    await expect(panel).toBeHidden();
    await expect(page.getByTestId('event-log')).toHaveText(
      /delete:standup:following:/,
    );
  });

  test('renders weekday chips in three locales', async ({ page }) => {
    const examples = page.locator('#examples');
    const locales = page.locator('#locales');
    const chips = examples.locator(
      'solaris-calendar-event-editor .solaris-calendar-event-editor__chips',
    );
    await locales.getByRole('tab', { name: 'en-US' }).click();
    await expect(chips).toContainText(/Thu/i);
    await locales.getByRole('tab', { name: 'pt-BR' }).click();
    await expect(chips).toContainText(/qui/i);
    await locales.getByRole('tab', { name: 'es' }).click();
    await expect(chips).toContainText(/jue/i);
  });

  test('picks separate time zones from the stacked dialog', async ({
    page,
  }) => {
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', {
        name: /Edit recurring event|Editar evento recorrente/,
      })
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    await panel
      .getByRole('button', { name: /Alterar fuso|Change time zone/ })
      .click();
    const picker = page.locator('solaris-event-editor-timezone-dialog');
    await expect(picker).toBeVisible();
    await picker.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /Europe\/Lisbon/ }).click();
    await picker.getByText(/Use separate start and end|Usar fusos/).click();
    await picker.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: /UTC/ }).click();
    await picker.getByRole('button', { name: /Save|Salvar|Guardar/ }).click();
    await expect(picker).toBeHidden();
    await expect(panel).toBeVisible();
    await expect(panel.locator('input[type="text"]').first()).toHaveValue(
      'Team standup',
    );
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('saves the selected tag color in the draft', async ({ page }) => {
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', { name: /Edit single event|Editar evento único/ })
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const colorSelect = panel.locator('solaris-select', {
      hasText: /Cor|Color/,
    });
    await colorSelect.getByRole('combobox').click();
    await page.getByRole('option', { name: /Violeta|Violet/ }).click();
    await panel.getByRole('button', { name: /Save|Salvar|Guardar/ }).click();
    await expect(panel).toBeHidden();
    await expect(page.getByTestId('event-log')).toHaveText(
      /save:planning:Sprint planning:violet/,
    );
  });

  test('keeps the dialog usable at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.evaluate(() => document.fonts.ready);
    const examples = page.locator('#examples');
    await examples
      .getByRole('button', {
        name: /Edit recurring event|Editar evento recorrente/,
      })
      .click();
    const panel = page.locator('.solaris-dialog-panel');
    await expect(panel).toBeVisible();
    const overflow = await panel.evaluate((element) => ({
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 40);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });
});
