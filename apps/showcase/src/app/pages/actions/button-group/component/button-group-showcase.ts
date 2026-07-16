import { Component } from '@angular/core';

import {
  SolarisButtonGroupComponent,
  SolarisButtonDirective,
  SolarisIconButtonDirective,
  SolarisIconButtonBadgeDirective,
  SolarisIconComponent,
  SolarisBadgeComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    SolarisButtonGroupComponent,
    SolarisButtonDirective,
    SolarisIconButtonDirective,
    SolarisIconButtonBadgeDirective,
    SolarisIconComponent,
    SolarisBadgeComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './button-group-showcase.html',
  styleUrls: ['./button-group-showcase.scss'],
})
export class ButtonGroupShowcasePage {
  protected loading = false;

  protected toggleLoading(): void {
    this.loading = !this.loading;
  }
}
