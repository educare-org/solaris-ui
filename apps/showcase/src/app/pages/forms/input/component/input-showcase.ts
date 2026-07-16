import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';

import {
  SolarisInputDirective,
  SolarisFormFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
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
  private readonly translateService = inject(SolarisTranslateService);

  protected emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  protected passwordVisible = false;

  protected get emailError(): string {
    if (this.emailControl.hasError('required')) {
      return this.translateService.translate('input.error.required');
    }
    if (this.emailControl.hasError('email')) {
      return this.translateService.translate('input.error.valid-email');
    }
    return '';
  }

  protected togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
