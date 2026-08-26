import type { ValidatorFn } from '@angular/forms';

export function solarisOtpValidator(
  minLength: number,
  maxLength: number,
): ValidatorFn {
  return (control) => {
    const value = control.value;
    if (value == null || value === '') {
      return null;
    }
    const length = String(value).length;
    if (length < minLength || length > maxLength) {
      return {
        solarisOtpLength: {
          requiredLength: maxLength,
          actualLength: length,
        },
      };
    }
    return null;
  };
}
