import { Component } from '@angular/core';

import {
  SolarisOtpInputComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-otp-input-example',
  imports: [SolarisOtpInputComponent, SolarisTranslatePipe],
  templateUrl: './basic.component.html',
})
export class BasicOtpInputExample {}
