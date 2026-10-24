import { Component } from '@angular/core';

import { SolarisPasswordFieldComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-password-field-example',
  imports: [SolarisPasswordFieldComponent],
  templateUrl: './basic.component.html',
})
export class BasicPasswordFieldExample {}
