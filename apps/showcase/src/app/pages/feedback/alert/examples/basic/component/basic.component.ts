import { Component } from '@angular/core';

import {
  SolarisAlertComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-alert-example',
  imports: [SolarisAlertComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicAlertExample {}
