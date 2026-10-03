import { Component } from '@angular/core';

import {
  SolarisOptionComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-option-example',
  imports: [SolarisOptionComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicOptionExample {}
