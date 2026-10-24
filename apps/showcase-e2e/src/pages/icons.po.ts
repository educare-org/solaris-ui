import type { Page, Locator } from '@playwright/test';

export class IconsPageObject {
  constructor(private readonly page: Page) {}

  searchInput(): Locator {
    return this.page.getByRole('searchbox', { name: 'Search icons' });
  }

  category(category: string): Locator {
    return this.page.getByRole('tab', { name: category });
  }

  iconItem(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  gridItems(): Locator {
    return this.page.locator('.icons-showcase__item');
  }

  resultCount(): Locator {
    return this.page.locator('.icons-showcase__count');
  }

  usageSection(): Locator {
    return this.page.locator('.icon-usage-sheet');
  }

  usageSheet(): Locator {
    return this.page.locator('.solaris-dialog-container');
  }

  usagePanel(): Locator {
    return this.page.locator('.solaris-dialog-panel');
  }

  usageDialogContainer(): Locator {
    return this.page.locator('.solaris-dialog-container');
  }

  usageStandardCloseButton(): Locator {
    return this.page.locator('[data-dialog-close]');
  }

  copyButtonIcon(): Locator {
    return this.page
      .locator('.icon-usage-sheet__copy')
      .first()
      .locator('solaris-icon');
  }

  copyButtonCopiedState(): Locator {
    return this.page.locator('.icon-usage-sheet__copy[data-copied="true"]');
  }

  usageCloseButton(): Locator {
    return this.page.getByRole('button', { name: 'Close', exact: true });
  }

  grid(): Locator {
    return this.page.locator('.icons-showcase__grid');
  }

  usageSnippet(): Locator {
    return this.page.locator('.icon-usage-sheet__code code').first();
  }

  svgSnippet(): Locator {
    return this.page.locator('.icon-usage-sheet__code code').nth(1);
  }

  copyButton(): Locator {
    return this.page.locator('.icon-usage-sheet__copy').first();
  }

  copySvgButton(): Locator {
    return this.page.locator('.icon-usage-sheet__copy').nth(1);
  }

  variantTab(name: string): Locator {
    return this.page
      .locator('.icons-showcase__customizer')
      .getByRole('tab', { name });
  }

  strokeSlider(): Locator {
    return this.page.getByRole('slider', { name: 'Icon stroke width' });
  }

  itemSvg(name: string): Locator {
    return this.iconItem(name).locator('svg');
  }

  widthSlider(): Locator {
    return this.page.getByRole('slider', { name: 'Icon width' });
  }

  widthValue(): Locator {
    return this.page.locator('.icons-showcase__customizer-value').first();
  }

  colorSwatch(name: string): Locator {
    return this.page
      .locator('.icons-showcase__customizer')
      .getByRole('button', { name });
  }

  colorPicker(): Locator {
    return this.page.locator('.icons-showcase__customizer-picker');
  }

  colorHexInput(): Locator {
    return this.page.locator('.icons-showcase__customizer-hex');
  }

  itemIcon(name: string): Locator {
    return this.iconItem(name).locator('solaris-icon');
  }

  async search(query: string): Promise<void> {
    await this.searchInput().fill(query);
  }
}
