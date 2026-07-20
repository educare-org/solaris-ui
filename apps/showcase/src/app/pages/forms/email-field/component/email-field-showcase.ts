import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  SolarisEmailFieldComponent,
  solarisEmailValidator,
  SolarisFormFieldComponent,
  SolarisInputDirective,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisEmailFieldComponent,
    SolarisFormFieldComponent,
    SolarisInputDirective,
    SolarisTranslatePipe,
  ],
  templateUrl: './email-field-showcase.html',
  styleUrls: ['./email-field-showcase.scss'],
})
export class EmailFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);

  protected get emailDisplayValue(): string {
    return (
      this.formGroup.value.email ||
      this.translateService.translate('email-field.reactive-forms-empty')
    );
  }

  protected readonly formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, solarisEmailValidator()]),
  });
}
