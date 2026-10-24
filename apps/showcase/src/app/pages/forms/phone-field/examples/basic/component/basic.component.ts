import { Component } from '@angular/core';

import { SolarisPhoneFieldComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-phone-field-example',
  imports: [SolarisPhoneFieldComponent],
  templateUrl: './basic.component.html',
})
export class BasicPhoneFieldExample {}
