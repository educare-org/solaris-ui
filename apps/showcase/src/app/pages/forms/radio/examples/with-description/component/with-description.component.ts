import { Component } from '@angular/core';

import { SolarisRadioComponent } from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-with-description-radio-example',
  imports: [SolarisRadioComponent],
  templateUrl: './with-description.component.html',
})
export class WithDescriptionRadioExample {}
