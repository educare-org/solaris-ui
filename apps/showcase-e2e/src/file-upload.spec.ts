import { test, expect } from '@playwright/test';
import { FileUploadPageObject } from './pages/file-upload.po';

test.describe('File upload', () => {
  let files: FileUploadPageObject;

  test.beforeEach(async ({ page }) => {
    await page.goto('/forms/file-upload');
    await expect(page.locator('h1')).toBeVisible();
    files = new FileUploadPageObject(page);
  });

  test('renders the dropzone with browse affordance', async () => {
    await expect(files.dropzone()).toBeVisible();
    await expect(files.dropzone()).toContainText('Browse files');
  });

  test('switches between dropzone and button modes', async ({ page }) => {
    await files.variantTab('Button').click();
    await expect(
      page.locator('.solaris-file-upload__trigger').first(),
    ).toBeVisible();
  });

  test('renders the avatar trigger', async ({ page }) => {
    await files.variantTab('Avatar').click();
    await expect(
      page.locator('.solaris-file-upload__avatar').first(),
    ).toBeVisible();
  });

  test('lists a file attached through the native input', async ({ page }) => {
    await files.nativeInput().setInputFiles({
      name: 'contract.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 demo'),
    });
    await expect(files.fileItems().first()).toContainText('contract.pdf');
    await expect(page.locator('[role="status"]').first()).toContainText(
      '1 file added.',
    );
  });

  test('removes a listed file', async () => {
    await files.nativeInput().setInputFiles({
      name: 'contract.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 demo'),
    });
    await files.removeButton('contract.pdf').click();
    await expect(files.fileItems()).toHaveCount(0);
  });

  test('keeps a stable dropzone size while dragging over', async () => {
    const idle = await files.dropzone().boundingBox();
    await files.dropzoneBody().dispatchEvent('dragenter');
    await expect(files.upload()).toHaveAttribute('data-dragover', '');
    const active = await files.dropzone().boundingBox();
    expect(active?.width).toBe(idle?.width);
    expect(active?.height).toBe(idle?.height);
    await files.dropzoneBody().dispatchEvent('dragleave');
    await expect(files.upload()).not.toHaveAttribute('data-dragover', '');
  });
});
