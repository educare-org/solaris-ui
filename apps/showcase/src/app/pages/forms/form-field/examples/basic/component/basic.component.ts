import { Component } from '@angular/core';

import {
  SolarisFormFieldComponent,
  SolarisInputDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-form-field-example',
  imports: [SolarisFormFieldComponent, SolarisInputDirective],
  templateUrl: './basic.component.html',
})
export class BasicFormFieldExample {}
