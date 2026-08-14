import type { Page, Locator } from '@playwright/test';

export class IconsPageObject {
  constructor(private readonly page: Page) {}

  searchInput(): Locator {
    return this.page.getByRole('searchbox');
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
    return this.page.locator('.solaris-dialog-header__close');
  }

  copyButtonIcon(): Locator {
    return this.page.locator('.icon-usage-sheet__copy solaris-icon');
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
    return this.page.locator('.icon-usage-sheet__code code');
  }

  copyButton(): Locator {
    return this.page.locator('.icon-usage-sheet__copy');
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

  colorValue(): Locator {
    return this.page.locator('.icons-showcase__customizer-value').nth(1);
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
