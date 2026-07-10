import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';

import {
  SolarisInputDirective,
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisInputDirective,
    SolarisFormFieldComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './input-showcase.html',
  styleUrls: ['./input-showcase.scss'],
})
export class InputShowcasePage {
  protected emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  protected passwordVisible = false;

  protected togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
