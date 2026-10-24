import { Component, inject } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisToastService,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-toast-basic-example',
  imports: [SolarisButtonDirective, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class ToastBasicExample {
  private readonly toastService = inject(SolarisToastService);
  private readonly translateService = inject(SolarisTranslateService);

  protected show(): void {
    this.toastService.success({
      title: this.translateService.translate('toast.basic-title'),
      description: this.translateService.translate('toast.basic-desc'),
    });
  }
}
