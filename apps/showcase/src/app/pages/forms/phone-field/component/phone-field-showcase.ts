import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  SolarisPhoneFieldComponent,
  solarisPhoneValidator,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisPhoneFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './phone-field-showcase.html',
  styleUrls: ['./phone-field-showcase.scss'],
})
export class PhoneFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);

  protected get phoneDisplayValue(): string {
    return (
      this.formGroup.value.phone ||
      this.translateService.translate('phone-field.reactive-forms-empty')
    );
  }

  protected readonly formGroup = new FormGroup({
    phone: new FormControl('', [
      Validators.required,
      solarisPhoneValidator('BR'),
    ]),
  });
}
