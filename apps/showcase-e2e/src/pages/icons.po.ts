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
    return this.page.locator('.icons-showcase__usage');
  }

  usageSheet(): Locator {
    return this.page.locator('.icons-showcase__sheet');
  }

  usageCloseButton(): Locator {
    return this.page.getByRole('button', { name: 'Close usage panel' });
  }

  usageSnippet(): Locator {
    return this.page.locator('.icons-showcase__usage-code code');
  }

  copyButton(): Locator {
    return this.page.getByRole('button', { name: 'Copy', exact: true });
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
