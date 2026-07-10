import { Component } from '@angular/core';

import {
  SolarisIconButtonDirective,
  SolarisIconButtonBadgeDirective,
  SolarisIconComponent,
  SolarisBadgeComponent,
  SolarisVisuallyHiddenDirective,
  SolarisTranslatePipe,
} from '@educarehq/solaris-ui';

@Component({
  standalone: true,
  imports: [
    SolarisIconButtonDirective,
    SolarisIconButtonBadgeDirective,
    SolarisIconComponent,
    SolarisBadgeComponent,
    SolarisVisuallyHiddenDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './icon-button-showcase.html',
  styleUrls: ['./icon-button-showcase.scss'],
})
export class IconButtonShowcasePage {
  protected loading = false;

  protected toggleLoading(): void {
    this.loading = !this.loading;
  }
}
