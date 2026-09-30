import { Component, inject } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-toast-actions-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './actions.component.html',
})
export class ToastActionsExample {
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  protected show(): void {
    this.toastService.warning({
      title: this.translateService.translate('toast.actions-title'),
      description: this.translateService.translate('toast.actions-description'),
      actions: [
        {
          label: this.translateService.translate('toast.actions-undo'),
          appearance: 'outline',
          action: (ref) => {
            ref.dismiss();
          },
        },
        {
          label: this.translateService.translate('toast.actions-dismiss'),
          appearance: 'solid',
          color: 'primary',
          closeOnClick: true,
          action: (ref) => {
            ref.dismiss();
          },
        },
      ],
    });
  }
}
