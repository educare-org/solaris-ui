import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCheckboxComponent,
  SolarisCheckboxGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-validation-checkbox-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxComponent,
    SolarisCheckboxGroupComponent,
  ],
  templateUrl: './validation.component.html',
})
export class ValidationCheckboxGroupExample {
  protected readonly interestsControl = new FormControl<string[]>([]);
}
