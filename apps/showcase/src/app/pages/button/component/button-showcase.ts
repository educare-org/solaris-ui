import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonIconDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@educarehq/solaris-ui';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisButtonIconDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './button-showcase.html',
  styleUrls: ['./button-showcase.scss'],
})
export class ButtonShowcasePage {
  protected loading = false;

  protected toggleLoading(): void {
    this.loading = !this.loading;
  }
}
