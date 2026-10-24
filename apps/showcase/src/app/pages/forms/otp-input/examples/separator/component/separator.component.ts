import { Component } from '@angular/core';

import {
  SolarisOtpInputComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-separator-otp-input-example',
  imports: [SolarisOtpInputComponent, SolarisTranslatePipe],
  templateUrl: './separator.component.html',
})
export class SeparatorOtpInputExample {}
