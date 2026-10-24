import { Component } from '@angular/core';

import {
  SolarisOtpInputComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-masked-otp-input-example',
  imports: [SolarisOtpInputComponent, SolarisTranslatePipe],
  templateUrl: './masked.component.html',
})
export class MaskedOtpInputExample {}
