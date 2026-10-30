import { Component } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonGroupComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-loading-button-group-example',
  imports: [
    SolarisButtonDirective,
    SolarisButtonGroupComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './loading.component.html',
})
export class LoadingButtonGroupExample {}
