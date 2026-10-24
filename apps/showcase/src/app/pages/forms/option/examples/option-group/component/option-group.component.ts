import { Component } from '@angular/core';

import {
  SolarisOptionComponent,
  SolarisOptionGroupComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-option-group-example',
  imports: [
    SolarisOptionComponent,
    SolarisOptionGroupComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './option-group.component.html',
})
export class OptionGroupExample {}
