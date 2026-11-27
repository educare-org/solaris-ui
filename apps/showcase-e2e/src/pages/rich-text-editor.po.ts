import type { Page, Locator } from '@playwright/test';

export class RichTextEditorPageObject {
  constructor(private readonly page: Page) {}

  editor(index = 0): Locator {
    return this.page.locator('solaris-rich-text-editor').nth(index);
  }

  area(index = 0): Locator {
    return this.editor(index).locator('.solaris-rich-text-editor-area');
  }

  toolbarButton(action: string, editorIndex = 0): Locator {
    return this.editor(editorIndex).locator(`[data-action="${action}"]`);
  }

  toolbarCombobox(comboboxIndex = 0, editorIndex = 0): Locator {
    return this.editor(editorIndex)
      .locator('[role="combobox"]')
      .nth(comboboxIndex);
  }

  listboxOption(optionIndex = 0): Locator {
    return this.page
      .locator('[role="listbox"] [role="option"]')
      .nth(optionIndex);
  }

  colorPanel(): Locator {
    return this.page.locator('.solaris-rich-text-color-panel');
  }

  linkPanel(): Locator {
    return this.page.locator('.solaris-rich-text-link-panel');
  }

  menuItem(optionIndex = 0): Locator {
    // Why: the live menu renders its content template into the overlay
    // without the role=menu host ancestor, so match items directly.
    return this.page.locator('[role="menuitem"]').nth(optionIndex);
  }

  menuRadioItem(optionIndex = 0): Locator {
    // Why: radio menu items (e.g. the align menu) render as menuitemradio.
    return this.page.locator('[role="menuitemradio"]').nth(optionIndex);
  }

  logEntries(): Locator {
    return this.page.locator('.rich-text-editor-showcase__log li');
  }

  documentDemo(): Locator {
    return this.page.locator('.rich-text-editor-showcase__document');
  }

  documentArea(): Locator {
    return this.documentDemo().locator('.solaris-rich-text-editor-area');
  }

  documentParagraph(index: number): Locator {
    return this.documentArea().locator(':scope > p').nth(index);
  }

  documentDropLine(): Locator {
    return this.documentArea().locator('.solaris-block-drop-line');
  }
}
