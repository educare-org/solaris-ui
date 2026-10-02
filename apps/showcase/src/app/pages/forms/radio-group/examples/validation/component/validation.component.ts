import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisRadioComponent,
  SolarisRadioGroupComponent,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-validation-radio-group-example',
  imports: [
    ReactiveFormsModule,
    SolarisRadioComponent,
    SolarisRadioGroupComponent,
  ],
  templateUrl: './validation.component.html',
})
export class ValidationRadioGroupExample {
  protected readonly planControl = new FormControl<string | null>(
    null,
    Validators.required,
  );

  protected submit(): void {
    this.planControl.markAsTouched();
  }
}
