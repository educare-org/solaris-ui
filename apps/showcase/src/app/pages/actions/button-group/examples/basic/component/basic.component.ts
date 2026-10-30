import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonGroupComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-button-group-example',
  imports: [
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic.component.html',
})
export class BasicButtonGroupExample {}
