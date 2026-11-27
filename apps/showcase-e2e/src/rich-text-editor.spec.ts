import { test, expect } from '@playwright/test';
import { RichTextEditorPageObject } from './pages/rich-text-editor.po';

test.describe('Rich Text Editor', () => {
  let richText: RichTextEditorPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/rich-text-editor');
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready.then(() => true));
    richText = new RichTextEditorPageObject(page);
  });

  test('renders document and composer variants with toolbars', async () => {
    await expect(richText.editor(0)).toHaveAttribute(
      'data-variant',
      'document',
    );
    await expect(richText.toolbarButton('bold', 0)).toBeVisible();
  });

  test('typing in the document editor updates the character count', async ({
    page,
  }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await expect(
      richText.editor(0).locator('.solaris-rich-text-count'),
    ).toContainText('5');
  });

  test('composer submits on Enter and logs the value', async ({ page }) => {
    const composer = page
      .locator('solaris-rich-text-editor[data-variant="composer"]')
      .first();
    const area = composer.locator('.solaris-rich-text-editor-area');
    await area.click();
    await page.keyboard.type('ping');
    await page.keyboard.press('Enter');
    await expect(richText.logEntries().first()).toContainText('ping');
  });

  test('keyboard shortcut ctrl+enter submits the document editor', async ({
    page,
  }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('note');
    await page.keyboard.press('Control+Enter');
    await expect(richText.logEntries()).toHaveCount(0);
  });

  test('toggling bold before typing formats subsequently typed text', async ({
    page,
  }) => {
    const area = richText.area(0);
    await area.click();
    await richText.toolbarButton('bold', 0).click();
    await page.keyboard.type('bold');
    await expect(area.locator('strong')).toContainText('bold');
  });

  test('color popover applies a data-color span to selected text', async ({
    page,
  }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('color', 0).click();
    await richText.colorPanel().locator('button[data-color="blue"]').click();
    await expect(area.locator('span[data-color="blue"]')).toContainText(
      'hello',
    );
  });

  test('Aa toggle preserves the visible text in both directions', async () => {
    const editor = richText.editor(0);
    const area = richText.area(0);
    await area.click();
    await editor.page().keyboard.type('plainme');
    await richText.toolbarButton('format', 0).click();
    await expect(editor).toHaveAttribute('data-format', 'plain');
    await expect(area).toContainText('plainme');
    await richText.toolbarButton('format', 0).click();
    await expect(editor).toHaveAttribute('data-format', 'rich');
    await expect(area).toContainText('plainme');
  });

  test('inserted table renders with tabular borders', async ({ page }) => {
    await richText.toolbarButton('table', 0).click();
    const table = richText.area(0).locator('table');
    await expect(table).toBeVisible();
    const borderCollapse = await table.evaluate(
      (el) => getComputedStyle(el).borderCollapse,
    );
    expect(borderCollapse).toBe('collapse');
    const cellBorder = await richText
      .area(0)
      .locator('th, td')
      .first()
      .evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(cellBorder).not.toBe('0px');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('toolbar dividers stretch to the full toolbar height', async ({
    page,
  }) => {
    const divider = richText
      .editor(0)
      .locator('solaris-divider[data-orientation="vertical"]')
      .first();
    await expect(divider).toBeVisible();
    const alignSelf = await divider.evaluate(
      (el) => getComputedStyle(el).alignSelf,
    );
    expect(alignSelf).toBe('stretch');
    const height = await divider.evaluate((el) =>
      parseFloat(getComputedStyle(el).height),
    );
    expect(height).toBeGreaterThan(28);
    const toolbarBox = await richText
      .editor(0)
      .locator('.solaris-rich-text-toolbar')
      .first()
      .boundingBox();
    const dividerBox = await divider.boundingBox();
    expect(toolbarBox).not.toBeNull();
    expect(dividerBox).not.toBeNull();
    if (toolbarBox && dividerBox) {
      expect(dividerBox.y).toBeGreaterThanOrEqual(toolbarBox.y - 1);
      expect(dividerBox.y + dividerBox.height).toBeLessThanOrEqual(
        toolbarBox.y + toolbarBox.height + 1,
      );
    }
    await expect(page.locator('h1')).toBeVisible();
  });

  test('color picked on an empty caret survives typing', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await richText.toolbarButton('color', 0).click();
    await richText.colorPanel().locator('button[data-color="blue"]').click();
    await page.keyboard.type('hello');
    await expect(area.locator('span[data-color="blue"]')).toContainText(
      'hello',
    );
  });

  test('align menu justifies the current block', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarCombobox(0, 0).click();
    await richText.listboxOption(1).click();
    await area.click();
    await richText.toolbarButton('align-more', 0).click();
    await richText.menuRadioItem(3).click();
    await expect(area.locator('h1')).toHaveCSS('text-align', 'justify');
  });

  test('fixed palette applies red to selected text', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('color', 0).click();
    await richText.colorPanel().locator('button[data-color="red"]').click();
    await expect(area.locator('span[data-color="red"]')).toContainText('hello');
  });

  test('color popover applies and removes highlight', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('color', 0).click();
    await richText
      .colorPanel()
      .locator('button[data-highlight="green"]')
      .click();
    await expect(area.locator('span[data-highlight="green"]')).toContainText(
      'hello',
    );
    await area.click();
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('color', 0).click();
    await richText
      .colorPanel()
      .locator('[data-action="remove-highlight"]')
      .click();
    await expect(area.locator('span[data-highlight]')).toHaveCount(0);
    await expect(area).toContainText('hello');
  });

  test('link popover applies a custom display text', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('link', 0).click();
    const panel = richText.linkPanel();
    await expect(panel).toBeVisible();
    await panel.locator('input[type="url"]').fill('https://example.com');
    await panel.locator('input[type="text"]').fill('Custom');
    await panel.locator('[data-action="apply-link"]').click();
    const anchor = area.locator('a');
    await expect(anchor).toHaveAttribute('href', 'https://example.com');
    await expect(anchor).toHaveAttribute('target', '_blank');
    await expect(anchor).toHaveAttribute('rel', 'noopener');
    await expect(anchor).toHaveText('Custom');
  });

  test('toolbar select shows translated labels, not raw keys', async () => {
    await expect(richText.toolbarCombobox(0, 0)).not.toContainText(
      'solaris.rich-text.',
    );
  });

  test('inline menu applies code to selected text', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('inline-more', 0).click();
    await richText.menuItem(4).click();
    await expect(area.locator('code')).toContainText('hello');
  });

  test('inline menu clears bold from selected text', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('bold', 0).click();
    await expect(area.locator('strong')).toContainText('hello');
    await area.click();
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    await richText.toolbarButton('inline-more', 0).click();
    await richText.menuItem(7).click();
    await expect(area.locator('strong')).toHaveCount(0);
    await expect(area).toContainText('hello');
  });

  test('lists menu inserts a task list with checkboxes', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await richText.toolbarButton('lists-more', 0).click();
    await richText.menuItem(2).click();
    await expect(
      area.locator('ul[data-task-list] input[type="checkbox"]'),
    ).toBeVisible();
  });

  test('undo and redo restore editor content', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await richText.toolbarButton('table', 0).click();
    await expect(area.locator('table')).toBeVisible();
    await richText.toolbarButton('undo', 0).click();
    await expect(area.locator('table')).toHaveCount(0);
    await richText.toolbarButton('redo', 0).click();
    await expect(area.locator('table')).toBeVisible();
  });

  test('fast typing coalesces into a single undo step', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('tentativa');
    await expect(area).toContainText('tentativa');
    await richText.toolbarButton('undo', 0).click();
    await expect(area).not.toContainText('tentativa');
  });

  test('typing across an idle pause splits into two undo steps', async ({
    page,
  }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('eu ');
    await page.waitForTimeout(1600);
    await page.keyboard.type('tentei');
    await expect(area).toContainText('eu tentei');
    await richText.toolbarButton('undo', 0).click();
    await expect(area).toContainText('eu');
    await expect(area).not.toContainText('tentei');
    await richText.toolbarButton('undo', 0).click();
    await expect(area).not.toContainText('eu');
  });

  test('composer send button logs the value', async ({ page }) => {
    const composer = page
      .locator('solaris-rich-text-editor[data-variant="composer"]')
      .first();
    const area = composer.locator('.solaris-rich-text-editor-area');
    await expect(area).toHaveCSS('min-height', '44px');
    await expect(area).toHaveCSS('max-height', '200px');
    await area.click();
    await page.keyboard.type('ping');
    await page.locator('[data-action="composer-send"]').click();
    await expect(richText.logEntries().first()).toContainText('ping');
  });

  test('composer shift+enter breaks the line without logging', async ({
    page,
  }) => {
    const composer = page
      .locator('solaris-rich-text-editor[data-variant="composer"]')
      .first();
    const area = composer.locator('.solaris-rich-text-editor-area');
    await area.click();
    await page.keyboard.type('one');
    await page.keyboard.press('Shift+Enter');
    await page.keyboard.type('two');
    await expect(richText.logEntries()).toHaveCount(0);
    await expect(area).toContainText('one');
    await expect(area).toContainText('two');
  });

  test('form-field integration drops the inner border', async ({ page }) => {
    const inField = page
      .locator('solaris-rich-text-editor[data-in-field]')
      .first();
    await expect(inField).toBeVisible();
    await expect(inField).toHaveCSS('border-top-style', 'none');
  });

  test('lists shortcut inserts a bulleted list', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hello');
    await page.keyboard.press('Control+Shift+8');
    await expect(area.locator('ul:not([data-task-list])')).toBeVisible();
  });

  test('toolbar tooltip text contrasts with its background', async ({
    page,
  }) => {
    const toRgb = (css: string): [number, number, number] | null => {
      const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
    };
    const luminance = ([r, g, b]: [number, number, number]): number => {
      const f = (v: number): number => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    await richText.toolbarButton('bold', 0).hover();
    const panel = page.locator('.solaris-tooltip-panel__container').first();
    await expect(panel).toBeVisible();
    const color = toRgb(
      await panel.evaluate((el) => getComputedStyle(el).color),
    );
    const background = toRgb(
      await panel.evaluate((el) => getComputedStyle(el).backgroundColor),
    );
    expect(color).not.toBeNull();
    expect(background).not.toBeNull();
    if (color && background) {
      const [l1, l2] = [luminance(color), luminance(background)].sort(
        (a, b) => b - a,
      );
      expect((l1 + 0.05) / (l2 + 0.05)).toBeGreaterThan(3);
    }
  });

  test('toolbar tooltip hides after its control is activated', async ({
    page,
  }) => {
    // Why: no re-hover happens after the click, so skipDelay cannot reopen
    // the panel and the hidden assertion stays deterministic.
    const button = richText.toolbarButton('bold', 0);
    await button.hover();
    const panel = page.locator('.solaris-tooltip-panel__container').first();
    await expect(panel).toBeVisible();
    await button.click();
    await expect(panel).toBeHidden();
  });

  test('image can be resized with the keyboard', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    // Why: the file input lives inside the image popover dialog, so open it
    // before uploading (the dialog closes itself on file selection).
    await richText.toolbarButton('image', 0).click();
    await page
      .locator('.solaris-rich-text-file-input')
      .first()
      .setInputFiles({ name: 'a.png', mimeType: 'image/png', buffer: png });
    const figure = area.locator('figure[data-image]');
    await expect(figure).toBeVisible();
    await figure.click();
    await page.keyboard.press('Shift+ArrowLeft');
    // Why: the figure exposes west (hidden) and east (focusable) handles.
    const handle = figure.locator('.solaris-image-resize-handle--east');
    await expect(handle).toBeVisible();
    await handle.click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(figure).toHaveAttribute('style', /width/);
  });

  test('image options panel aligns, borders and removes', async ({ page }) => {
    const area = richText.area(0);
    await area.click();
    await page.keyboard.type('hi');
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64',
    );
    // Why: the file input lives inside the image popover dialog, so open it
    // before uploading (the dialog closes itself on file selection).
    await richText.toolbarButton('image', 0).click();
    await page
      .locator('.solaris-rich-text-file-input')
      .first()
      .setInputFiles({ name: 'a.png', mimeType: 'image/png', buffer: png });
    const figure = area.locator('figure[data-image]');
    await expect(figure).toBeVisible();
    await figure.click();
    const panel = page.locator('.solaris-rich-text-image-panel').first();
    await expect(panel).toBeVisible();
    await panel.locator('[data-action="image-align-center"]').click();
    await expect(figure).toHaveAttribute('data-align', 'center');
    await panel.locator('[data-action="image-align-right"]').click();
    await expect(figure).toHaveAttribute('data-align', 'right');
    await panel.locator('[data-action="image-border"]').click();
    await expect(figure).toHaveAttribute('data-bordered', '');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(figure).toBeVisible();
    await figure.click();
    await expect(panel).toBeVisible();
    await area.click({ position: { x: 8, y: 8 } });
    await expect(panel).toBeHidden();
    await figure.click();
    await expect(panel).toBeVisible();
    await panel.locator('[data-action="image-more"]').click();
    await expect(richText.menuItem(5)).toBeVisible();
    await richText.menuItem(5).click();
    await expect(figure).toHaveCount(0);
    await expect(panel).toBeHidden();
  });

  test('toolbar tooltip keeps contrast with explicit light theme after reload', async ({
    page,
  }) => {
    // Why: reproduces a dark-OS device with an explicit light theme stored;
    // before the :host fix the panel text fell back to CanvasText (white on
    // white) while the default-scheme run stayed black-on-white and masked it.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.evaluate(() => localStorage.setItem('solaris-theme', 'light'));
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready.then(() => true));
    const appliedTheme = await page.evaluate(
      () => document.documentElement.dataset['theme'],
    );
    expect(appliedTheme).toBe('light');
    const toRgb = (css: string): [number, number, number] | null => {
      const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
    };
    const luminance = ([r, g, b]: [number, number, number]): number => {
      const f = (v: number): number => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    await richText.toolbarButton('bold', 0).hover();
    const panel = page.locator('.solaris-tooltip-panel__container').first();
    await expect(panel).toBeVisible();
    const colorCss = await panel.evaluate((el) => getComputedStyle(el).color);
    const bgCss = await panel.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    const tokenBody = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue(
        '--solaris-neutral-text-body',
      ),
    );
    const hexToRgb = (hex: string): [number, number, number] => [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
    const [tr, tg, tb] = hexToRgb(tokenBody.trim());
    expect(colorCss).toBe(`rgb(${tr}, ${tg}, ${tb})`);
    const color = toRgb(colorCss);
    const background = toRgb(bgCss);
    expect(color).not.toBeNull();
    expect(background).not.toBeNull();
    if (color && background) {
      const [l1, l2] = [luminance(color), luminance(background)].sort(
        (a, b) => b - a,
      );
      expect((l1 + 0.05) / (l2 + 0.05)).toBeGreaterThan(3);
    }
  });

  test('color panel flags inaccessible text and background pairs', async ({
    page,
  }) => {
    await richText.area(0).click();
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await expect(panel).toBeVisible();
    await panel.locator('button[data-color="yellowLight"]').click();
    await expect(
      panel.locator('.solaris-rich-text-color-panel-accessibility'),
    ).toBeVisible();
    await expect(
      panel.locator('.solaris-rich-text-color-panel-accessibility-level'),
    ).toContainText('Inaccessible');
    await expect(
      panel.locator('.solaris-rich-text-color-panel-accessibility-help'),
    ).toHaveAttribute('aria-label', /does not meet/);
    await panel.locator('button[data-color="blue"]').click();
    await expect(
      panel.locator('.solaris-rich-text-color-panel-accessibility-level'),
    ).toContainText('Partially accessible');
    await expect(
      panel.locator('.solaris-rich-text-color-panel-accessibility-help'),
    ).toHaveAttribute('aria-label', /large text only/);
    await panel.locator('button[data-color="default"]').click();
    await expect(
      panel.locator('.solaris-rich-text-color-panel-accessibility-level'),
    ).toContainText('Accessible');
  });

  test('tonal swatch applies a light variant span', async ({ page }) => {
    await richText.area(0).click();
    await page.keyboard.type('hello');
    await page.keyboard.press('ControlOrMeta+a');
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await panel.locator('button[data-color="blueLight"]').click();
    await expect(
      richText.area(0).locator('span[data-color="blueLight"]'),
    ).toContainText('hello');
    await expect(
      richText
        .toolbarButton('color', 0)
        .locator('.solaris-rich-text-color-preview'),
    ).toHaveAttribute('data-color', 'blueLight');
  });

  test('color panel renders ten hues with three tones each', async () => {
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await expect(panel).toBeVisible();
    await expect(
      panel.locator('.solaris-rich-text-color-grid--text button'),
    ).toHaveCount(30);
    await expect(
      panel.locator('.solaris-rich-text-color-grid--highlight button'),
    ).toHaveCount(10);
  });

  test('color and highlight chain without reopening the panel', async ({
    page,
  }) => {
    await richText.area(0).click();
    await page.keyboard.type('hello');
    await page.keyboard.press('ControlOrMeta+a');
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await panel.locator('button[data-color="blue"]').click();
    await expect(panel).toBeVisible();
    await panel.locator('button[data-highlight="green"]').click();
    await expect(panel).toBeVisible();
    const merged = richText.area(0).locator('span[data-color="blue"]');
    await expect(merged).toContainText('hello');
    await expect(merged).toHaveAttribute('data-highlight', 'green');
  });

  test('every text and highlight swatch applies its own color', async ({
    page,
  }) => {
    const textColors = [
      'default',
      'blueLight',
      'petrolLight',
      'greenLight',
      'limeLight',
      'yellowLight',
      'orangeLight',
      'redLight',
      'magentaLight',
      'purpleLight',
      'muted',
      'blue',
      'petrol',
      'green',
      'lime',
      'yellow',
      'orange',
      'red',
      'magenta',
      'purple',
      'neutralDark',
      'blueDark',
      'petrolDark',
      'greenDark',
      'limeDark',
      'yellowDark',
      'orangeDark',
      'redDark',
      'magentaDark',
      'purpleDark',
    ];
    const highlightColors = [
      'neutral',
      'blue',
      'petrol',
      'green',
      'lime',
      'yellow',
      'orange',
      'red',
      'magenta',
      'purple',
    ];
    await richText.area(0).click();
    await page.keyboard.type('hello');
    await page.keyboard.press('ControlOrMeta+a');
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await expect(panel).toBeVisible();
    for (const color of textColors) {
      await panel.locator(`button[data-color="${color}"]`).click();
      if (color === 'default') {
        await expect(richText.area(0).locator('span[data-color]')).toHaveCount(
          0,
        );
      } else {
        await expect(
          richText.area(0).locator(`span[data-color="${color}"]`),
        ).toContainText('hello');
      }
    }
    for (const color of highlightColors) {
      await panel.locator(`button[data-highlight="${color}"]`).click();
      await expect(
        richText.area(0).locator(`span[data-highlight="${color}"]`),
      ).toContainText('hello');
    }
  });

  test('color tooltip stays hidden while its panel is open', async ({
    page,
  }) => {
    await richText.toolbarButton('color', 0).click();
    await expect(richText.colorPanel()).toBeVisible();
    await richText.toolbarButton('color', 0).hover();
    await page.waitForTimeout(500);
    await expect(
      page.locator('.solaris-tooltip-panel__container'),
    ).toBeHidden();
  });

  test('color panel keeps a stable width with the footer on and off', async ({
    page,
  }) => {
    await richText.area(0).click();
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await expect(panel).toBeVisible();
    // Why: boundingBox reflects sub-pixel visual jitter; offsetWidth is the
    // layout width the grid must hold constant across footer states.
    const before = await panel.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    await panel.locator('button[data-color="yellowLight"]').click();
    const after = await panel.evaluate((el) => (el as HTMLElement).offsetWidth);
    expect(before).toBe(after);
  });

  test('form-field shell matches the standalone editor shell', async ({
    page,
  }) => {
    // The document demo starts as a preview (Jira-style click-to-edit), so
    // enter edit mode to get the standalone editor shell for comparison.
    await page.locator('[data-action="document-view"]').click();
    const standalone = richText
      .documentDemo()
      .locator('solaris-rich-text-editor');
    await expect(standalone).toBeVisible();
    // Blur again and wait out the border-color transition: a focused editor
    // uses the subtle border token, while the comparison target is the
    // resting default border.
    await page.locator('h1').click();
    const wrapper = page
      .locator(
        'solaris-form-field:has(solaris-rich-text-editor) .solaris-form-field__control-wrapper',
      )
      .first();
    await expect(wrapper).toBeVisible();
    const wrapperBorder = await wrapper.evaluate(
      (el) => getComputedStyle(el).borderTopColor,
    );
    await expect
      .poll(
        async () =>
          standalone.evaluate((el) => getComputedStyle(el).borderTopColor),
        { timeout: 5000 },
      )
      .toBe(wrapperBorder);
    const standaloneBorder = wrapperBorder;
    const inFieldToolbar = page
      .locator('solaris-rich-text-editor[data-in-field]')
      .first()
      .locator('.solaris-rich-text-toolbar');
    await expect(inFieldToolbar).toHaveCSS('border-bottom-width', '1px');
    await expect(inFieldToolbar).toHaveCSS(
      'border-bottom-color',
      standaloneBorder,
    );
  });

  test('color button exposes the text and highlight tooltip', async ({
    page,
  }) => {
    await expect(richText.toolbarButton('color', 0)).toHaveAttribute(
      'aria-label',
      'Text and highlight color',
    );
  });

  test('selected color swatch shows a check without an outline', async ({
    page,
  }) => {
    await richText.area(0).click();
    await richText.toolbarButton('color', 0).click();
    const panel = richText.colorPanel();
    await expect(panel).toBeVisible();
    const swatch = panel.locator('button[data-color="blue"]');
    await expect(swatch).toBeVisible();
    await swatch.click();
    await expect(swatch).toBeVisible();
    await expect(
      swatch.locator('.solaris-rich-text-swatch-check'),
    ).toBeVisible();
    await expect(swatch).toHaveCSS('outline-style', 'none');
  });

  test('360px layout keeps the editor usable', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(richText.area(0)).toBeVisible();
  });

  test('drags the last document block above the first with the grip', async ({
    page,
  }) => {
    await page.locator('[data-action="document-view"]').click();
    const area = richText.documentArea();
    await expect(area).toBeVisible();
    const last = richText.documentParagraph(1);
    await expect(last).toContainText('Detalhes');
    await last.hover();
    const grip = last.locator('.solaris-block-grip');
    await expect(grip).toBeVisible();
    const gripBox = await grip.boundingBox();
    const firstBox = await richText.documentParagraph(0).boundingBox();
    expect(gripBox).not.toBeNull();
    expect(firstBox).not.toBeNull();
    if (!gripBox || !firstBox) return;
    await page.mouse.move(
      gripBox.x + gripBox.width / 2,
      gripBox.y + gripBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      firstBox.x + firstBox.width / 2,
      firstBox.y + firstBox.height / 2,
      { steps: 12 },
    );
    await expect(richText.documentDropLine()).toBeVisible();
    await page.mouse.up();
    await expect(richText.documentParagraph(0)).toContainText('Detalhes');
    await expect(richText.documentDropLine()).toHaveCount(0);
  });

  test('drop indicator stays inside the editor while dragging', async ({
    page,
  }) => {
    await page.locator('[data-action="document-view"]').click();
    const area = richText.documentArea();
    await expect(area).toBeVisible();
    const last = richText.documentParagraph(1);
    await last.hover();
    const grip = last.locator('.solaris-block-grip');
    const gripBox = await grip.boundingBox();
    expect(gripBox).not.toBeNull();
    if (!gripBox) return;
    await page.mouse.move(
      gripBox.x + gripBox.width / 2,
      gripBox.y + gripBox.height / 2,
    );
    await page.mouse.down();
    const firstBox = await richText.documentParagraph(0).boundingBox();
    expect(firstBox).not.toBeNull();
    if (!firstBox) {
      await page.mouse.up();
      return;
    }
    await page.mouse.move(
      firstBox.x + firstBox.width / 2,
      firstBox.y + firstBox.height / 2,
      { steps: 12 },
    );
    const lineBox = await richText.documentDropLine().boundingBox();
    const areaBox = await area.boundingBox();
    expect(lineBox).not.toBeNull();
    expect(areaBox).not.toBeNull();
    if (lineBox && areaBox) {
      expect(lineBox.y).toBeGreaterThanOrEqual(areaBox.y - 1);
      expect(lineBox.y + lineBox.height).toBeLessThanOrEqual(
        areaBox.y + areaBox.height + 1,
      );
    }
    await page.mouse.up();
    await expect(richText.documentDropLine()).toHaveCount(0);
  });

  test('releasing outside the editor cancels the block move', async ({
    page,
  }) => {
    await page.locator('[data-action="document-view"]').click();
    const area = richText.documentArea();
    await expect(area).toBeVisible();
    const before = await area.locator(':scope > p').allTextContents();
    const last = richText.documentParagraph(1);
    await last.hover();
    const grip = last.locator('.solaris-block-grip');
    const gripBox = await grip.boundingBox();
    expect(gripBox).not.toBeNull();
    if (!gripBox) return;
    await page.mouse.move(
      gripBox.x + gripBox.width / 2,
      gripBox.y + gripBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(gripBox.x, gripBox.y - 300, { steps: 8 });
    await expect(richText.documentDropLine()).toHaveCount(0);
    await page.mouse.up();
    await expect(area.locator(':scope > p').allTextContents()).resolves.toEqual(
      before,
    );
  });

  test('composer Aa toggle stays reachable in plain mode', async ({ page }) => {
    const composer = page
      .locator('solaris-rich-text-editor[data-variant="composer"]')
      .first();
    const area = composer.locator('.solaris-rich-text-editor-area');
    await area.click();
    await page.keyboard.type('dsads');
    await page.keyboard.press(
      process.platform === 'darwin' ? 'Meta+A' : 'Control+A',
    );
    const toolbar = composer.locator('.solaris-rich-text-toolbar--floating');
    await expect(toolbar).toBeVisible();
    await composer.locator('[data-action="format"]').click();
    await expect(composer).toHaveAttribute('data-format', 'plain');
    // The toggle itself must survive the switch, otherwise composer users
    // are trapped in plain text with no way back to rich.
    await expect(toolbar).toBeVisible();
    await composer.locator('[data-action="format"]').click();
    await expect(composer).toHaveAttribute('data-format', 'rich');
  });
});
