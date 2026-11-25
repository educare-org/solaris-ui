import { ComponentHarness } from '@angular/cdk/testing';

export class SolarisRichTextEditorHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-rich-text-editor';

  private readonly editorArea = this.locatorFor(
    '.solaris-rich-text-editor-area',
  );
  private readonly toolbar = this.locatorForOptional(
    '.solaris-rich-text-toolbar',
  );

  async getVariant(): Promise<string | null> {
    return (await this.host()).getAttribute('data-variant');
  }

  async getFormat(): Promise<string | null> {
    return (await this.host()).getAttribute('data-format');
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-focused')) !== null
      ? false
      : (await (await this.editorArea()).getAttribute('contenteditable')) ===
          'false';
  }

  async getText(): Promise<string | null> {
    return (await this.editorArea()).text();
  }

  async getCharCount(): Promise<string | null> {
    const count = await this.locatorForOptional('.solaris-rich-text-count')();
    return count ? count.text() : null;
  }

  async hasToolbar(): Promise<boolean> {
    return (await this.toolbar()) !== null;
  }

  async clickToolbarAction(action: string): Promise<void> {
    const button = await this.locatorFor(`[data-action="${action}"]`)();
    await button.click();
  }

  async focus(): Promise<void> {
    await (await this.editorArea()).focus();
  }

  async blur(): Promise<void> {
    await (await this.editorArea()).blur();
  }
}
