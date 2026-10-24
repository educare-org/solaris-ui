import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  SolarisOtpInputComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  solarisOtpValidator,
} from '@solaris-ui/angular';

@Component({
  standalone: true,
  selector: 'app-reactive-otp-input-example',
  imports: [
    ReactiveFormsModule,
    SolarisOtpInputComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss'],
})
export class ReactiveOtpInputExample {
  private readonly translateService = inject(SolarisTranslateService);

  protected completed = false;

  protected readonly formGroup = new FormGroup({
    code: new FormControl('', [Validators.required, solarisOtpValidator(4, 6)]),
  });

  protected get codeDisplayValue(): string {
    return (
      this.formGroup.value.code ||
      this.translateService.translate('otp-input.form.empty')
    );
  }

  protected onCompleted(): void {
    this.completed = true;
  }
}
