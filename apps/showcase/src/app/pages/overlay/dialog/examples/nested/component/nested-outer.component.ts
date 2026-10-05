import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisDialogService,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './nested-outer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestedOuterExampleComponent {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly dialogService = inject(SolarisDialogService);

  openInner(): void {
    this.dialogService.open({
      title: this.translateService.translate(
        'dialog.examples.nested.inner-title',
      ),
      description: this.translateService.translate(
        'dialog.examples.nested.inner-desc',
      ),
      variant: 'warning',
      role: 'alertdialog',
      actions: [
        {
          label: this.translateService.translate('dialog.common.cancel'),
          appearance: 'ghost',
          close: true,
          result: 'cancel',
        },
        {
          label: this.translateService.translate('dialog.common.discard'),
          color: 'danger',
          close: true,
          result: 'discard',
        },
      ],
    });
  }
}
