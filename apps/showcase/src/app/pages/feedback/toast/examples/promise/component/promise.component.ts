import { Component, inject } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-toast-promise-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './promise.component.html',
})
export class ToastPromiseExample {
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  protected show(): void {
    const task = new Promise<string>((resolve) => {
      setTimeout(() => resolve('ok'), 1500);
    });
    this.toastService.promise(task, {
      loading: {
        title: this.translateService.translate('toast.loading-title'),
        description: this.translateService.translate('toast.loading-desc'),
      },
      success: {
        title: this.translateService.translate('toast.complete-title'),
        description: this.translateService.translate('toast.complete-desc'),
        variant: 'success',
        duration: 3000,
      },
      error: {
        title: 'Error',
        variant: 'danger',
        duration: 3000,
      },
    });
  }
}
