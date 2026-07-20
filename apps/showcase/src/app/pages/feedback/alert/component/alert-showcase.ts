import { Component } from '@angular/core';

import {
  SolarisAlertComponent,
  SolarisAlertActionsComponent,
  SolarisAlertTitleDirective,
  SolarisAlertDescriptionDirective,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisAlertComponent,
    SolarisAlertActionsComponent,
    SolarisAlertTitleDirective,
    SolarisAlertDescriptionDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './alert-showcase.html',
  styleUrls: ['./alert-showcase.scss'],
})
export class AlertShowcasePage {
  protected showClosableAlert = true;
  protected showClosableAlert2 = true;

  protected handleDismiss(): void {
    this.showClosableAlert = false;
  }

  protected handleDismiss2(): void {
    this.showClosableAlert2 = false;
  }

  protected showAgain(): void {
    this.showClosableAlert2 = true;
  }
}
