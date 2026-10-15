import { ComponentHarness } from '@angular/cdk/testing';

export class SolarisFileListItemHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-file-list-item';

  async getName(): Promise<string> {
    return (await this.locatorFor('.solaris-file-list-item__name')()).text();
  }

  async getStatus(): Promise<string | null> {
    return (await this.host()).getAttribute('data-status');
  }

  async remove(): Promise<void> {
    const buttons = await this.locatorForAll(
      '.solaris-file-list-item__action',
    )();
    await buttons[buttons.length - 1].click();
  }

  async retry(): Promise<void> {
    const buttons = await this.locatorForAll(
      '.solaris-file-list-item__action',
    )();
    await buttons[0].click();
  }

  async canRetry(): Promise<boolean> {
    const buttons = await this.locatorForAll(
      '.solaris-file-list-item__action',
    )();
    return buttons.length > 1;
  }

  async getRemoveLabel(): Promise<string | null> {
    const buttons = await this.locatorForAll(
      '.solaris-file-list-item__action',
    )();
    return buttons[buttons.length - 1].getAttribute('aria-label');
  }
}

export class SolarisFileListHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-file-list';

  async getItems(): Promise<SolarisFileListItemHarness[]> {
    return this.locatorForAll(SolarisFileListItemHarness)();
  }

  async getItemNames(): Promise<string[]> {
    const items = await this.getItems();
    return Promise.all(items.map((item) => item.getName()));
  }
}

export class SolarisFileUploadHarness extends ComponentHarness {
  static readonly hostSelector = 'solaris-file-upload';

  private readonly dropzone = this.locatorForOptional(
    '.solaris-file-upload__dropzone',
  );
  private readonly trigger = this.locatorForOptional(
    '.solaris-file-upload__trigger',
  );
  private readonly avatar = this.locatorForOptional(
    '.solaris-file-upload__avatar',
  );
  private readonly field = this.locatorForOptional(
    '.solaris-file-upload__field',
  );
  private readonly list = this.locatorForOptional(SolarisFileListHarness);

  async getVariant(): Promise<string | null> {
    return (await this.host()).getAttribute('data-variant');
  }

  async openPicker(): Promise<void> {
    const dropzone = await this.dropzone();
    if (dropzone) {
      await dropzone.click();
      return;
    }
    const trigger = await this.trigger();
    if (trigger) {
      await trigger.click();
      return;
    }
    const avatar = await this.avatar();
    if (avatar) {
      await avatar.click();
      return;
    }
    const field = await this.field();
    if (field) {
      await field.click();
    }
  }

  async getList(): Promise<SolarisFileListHarness | null> {
    return this.list();
  }

  async getItemNames(): Promise<string[]> {
    const list = await this.list();
    if (!list) {
      return [];
    }
    return list.getItemNames();
  }

  async isDisabled(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-disabled')) !== null;
  }

  async isInvalid(): Promise<boolean> {
    return (await (await this.host()).getAttribute('data-invalid')) !== null;
  }

  async getAnnouncement(): Promise<string> {
    return (
      await this.locatorFor('.solaris-file-upload__announcement')()
    ).text();
  }
}
