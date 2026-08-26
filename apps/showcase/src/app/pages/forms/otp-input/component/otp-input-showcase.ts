import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import {
  SolarisOtpInputComponent,
  solarisOtpValidator,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisOtpInputComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './otp-input-showcase.html',
  styleUrls: ['./otp-input-showcase.scss'],
})
export class OtpInputShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);

  protected completed = false;

  protected get codeDisplayValue(): string {
    return (
      this.formGroup.value.code ||
      this.translateService.translate('otp-input.reactive-forms-empty')
    );
  }

  protected readonly formGroup = new FormGroup({
    code: new FormControl('', [Validators.required, solarisOtpValidator(4, 6)]),
  });

  protected onCompleted(): void {
    this.completed = true;
  }
}
