import { Component, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisFormFieldComponent,
  SolarisInputDirective,
  SolarisLoadingZoneDirective,
  SolarisSpinnerComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-spinner-loading-zone-example',
  imports: [
    SolarisButtonDirective,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisLoadingZoneDirective,
    SolarisSpinnerComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './loading-zone.component.html',
  styleUrls: ['./loading-zone.component.scss'],
})
export class SpinnerLoadingZoneExample {
  protected readonly saving = signal(false);

  protected save(): void {
    if (this.saving()) {
      return;
    }
    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 2400);
  }
}
