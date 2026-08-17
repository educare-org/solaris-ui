import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  SolarisPasswordFieldComponent,
  solarisPasswordValidator,
  SolarisPasswordPolicy,
  SolarisFormFieldComponent,
  SolarisInputDirective,
  SolarisIconButtonDirective,
  SolarisFormSuffixDirective,
  SolarisFormLabelActionDirective,
  SolarisIconComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisPasswordFieldComponent,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisIconButtonDirective,
    SolarisFormSuffixDirective,
    SolarisFormLabelActionDirective,
    SolarisIconComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './password-field-showcase.html',
  styleUrls: ['./password-field-showcase.scss'],
})
export class PasswordFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  protected manualVisible = false;

  protected get passwordDisplayValue(): string {
    return (
      this.formGroup.value.password ||
      this.translateService.translate('password-field.reactive-forms-empty')
    );
  }

  protected readonly passwordPolicy: SolarisPasswordPolicy = {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumber: true,
    requireSymbol: true,
    disallowWhitespace: true,
  };

  protected readonly formGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      solarisPasswordValidator(this.passwordPolicy),
    ]),
  });

  protected toggleManualVisibility(): void {
    this.manualVisible = !this.manualVisible;
  }
}
