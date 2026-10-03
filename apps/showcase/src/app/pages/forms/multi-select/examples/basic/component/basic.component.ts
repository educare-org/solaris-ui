import { Component } from '@angular/core';

import {
  SolarisMultiSelectComponent,
  SolarisOptionComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-multi-select-example',
  imports: [
    SolarisMultiSelectComponent,
    SolarisOptionComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic.component.html',
})
export class BasicMultiSelectExample {}
