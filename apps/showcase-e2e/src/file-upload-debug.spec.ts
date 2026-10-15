import { test, expect } from '@playwright/test';
import { FileUploadPageObject } from './pages/file-upload.po';

test.describe('File upload debug', () => {
  test('full chain in one run', async ({ page }) => {
    await page.goto('/forms/file-upload');
    await expect(page.locator('h1')).toBeVisible();
    const files = new FileUploadPageObject(page);

    const measure = (phase: string) =>
      page.evaluate((p) => {
        const host = document.querySelector('solaris-file-upload');
        const dz = host?.querySelector<HTMLElement>(
          '.solaris-file-upload__dropzone',
        );
        const example = host?.parentElement;
        if (!host || !dz || !example) return `${p}: MISSING`;
        const hostRuleFound: string[] = [];
        for (const sheet of Array.from(document.styleSheets)) {
          let rules: CSSRuleList | null = null;
          try {
            rules = sheet.cssRules;
          } catch {
            continue;
          }
          for (const rule of Array.from(rules ?? [])) {
            if (
              rule instanceof CSSStyleRule &&
              rule.selectorText.includes('app-basic-file-upload-example') &&
              !rule.selectorText.includes('file-upload-debug')
            ) {
              hostRuleFound.push(
                `${rule.selectorText} { ${rule.style.cssText} }`,
              );
            }
          }
        }
        const hcs = getComputedStyle(host);
        return (
          `${p}: example=${Math.round(example.getBoundingClientRect().width)}` +
          ` host=${Math.round(host.getBoundingClientRect().width)}` +
          ` hostCssWidth=${hcs.width}` +
          ` dz=${Math.round(dz.getBoundingClientRect().width)}` +
          ` dragover=${host.hasAttribute('data-dragover')}` +
          ` rules=${JSON.stringify(hostRuleFound)}`
        );
      }, phase);

    console.log(await measure('IDLE'));
    await files.dropzoneBody().dispatchEvent('dragenter');
    await expect(files.upload()).toHaveAttribute('data-dragover', '');
    console.log(await measure('ACTIVE'));
  });
});
