import { Component } from '@angular/core';

import {
  SolarisOptionComponent,
  SolarisSelectComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-select-example',
  imports: [
    SolarisSelectComponent,
    SolarisOptionComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './basic.component.html',
})
export class BasicSelectExample {}
