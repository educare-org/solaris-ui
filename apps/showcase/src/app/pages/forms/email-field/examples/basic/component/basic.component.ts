import { Component } from '@angular/core';

import { SolarisEmailFieldComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-email-field-example',
  imports: [SolarisEmailFieldComponent],
  templateUrl: './basic.component.html',
})
export class BasicEmailFieldExample {}
