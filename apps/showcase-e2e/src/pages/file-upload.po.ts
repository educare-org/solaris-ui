import type { Page, Locator } from '@playwright/test';

export class FileUploadPageObject {
  constructor(private readonly page: Page) {}

  upload(index = 0): Locator {
    return this.page.locator('solaris-file-upload').nth(index);
  }

  dropzone(index = 0): Locator {
    return this.upload(index).locator('.solaris-file-upload__dropzone');
  }

  dropzoneBody(index = 0): Locator {
    return this.upload(index).locator('.solaris-file-upload__body');
  }

  fileItems(index = 0): Locator {
    return this.upload(index).locator('solaris-file-list-item');
  }

  removeButton(itemName: string): Locator {
    return this.page.locator(
      `.solaris-file-list-item__action[aria-label="Remove ${itemName}"]`,
    );
  }

  variantTab(name: 'Dropzone' | 'Button' | 'Avatar' | 'Field'): Locator {
    return this.page.locator('solaris-tab', { hasText: name });
  }

  urlInput(): Locator {
    return this.page.locator('.solaris-file-upload__url-input').first();
  }

  urlAddButton(): Locator {
    return this.page.locator('.solaris-file-upload__url-button').first();
  }

  nativeInput(index = 0): Locator {
    return this.upload(index).locator('input[type="file"]');
  }
}
