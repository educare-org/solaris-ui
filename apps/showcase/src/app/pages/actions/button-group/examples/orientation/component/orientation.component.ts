import { Component, input } from '@angular/core';

import {
  SolarisButtonGroupComponent,
  SolarisIconButtonDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-orientation-button-group-example',
  imports: [
    SolarisButtonGroupComponent,
    SolarisIconButtonDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './orientation.component.html',
})
export class OrientationButtonGroupExample {
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
