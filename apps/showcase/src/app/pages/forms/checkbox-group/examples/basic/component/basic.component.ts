import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCheckboxComponent,
  SolarisCheckboxGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-basic-checkbox-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxComponent,
    SolarisCheckboxGroupComponent,
  ],
  templateUrl: './basic.component.html',
})
export class BasicCheckboxGroupExample {
  protected readonly interestsControl = new FormControl(['sports']);
}
