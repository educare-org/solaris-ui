import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisRadioComponent,
  SolarisRadioGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-radio-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisRadioComponent,
    SolarisRadioGroupComponent,
  ],
  templateUrl: './basic.component.html',
})
export class BasicRadioGroupExample {
  protected readonly planControl = new FormControl('basic');
}
