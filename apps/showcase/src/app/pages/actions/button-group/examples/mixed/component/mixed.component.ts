import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonGroupComponent,
  SolarisIconButtonDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-mixed-button-group-example',
  imports: [
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './mixed.component.html',
})
export class MixedButtonGroupExample {}
