import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

import {
  SolarisFormFieldComponent,
  SolarisFormLabelComponent,
  SolarisFormHintComponent,
  SolarisFormErrorComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisTranslatePipe, SolarisInputDirective,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisFormFieldComponent,
    SolarisFormLabelComponent,
    SolarisFormHintComponent,
    SolarisFormErrorComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
    SolarisInputDirective,
  ],
  templateUrl: './form-field-showcase.html',
  styleUrls: ['./form-field-showcase.scss'],
})
export class FormFieldShowcasePage {
  protected emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  protected passwordVisible = false;

  protected togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
