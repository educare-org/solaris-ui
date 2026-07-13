import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import type { SolarisPasswordPolicy } from '../model/password-policy.types';

export function solarisPasswordValidator(
  policy: SolarisPasswordPolicy,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || typeof value !== 'string') {
      return null;
    }

    const errors: ValidationErrors = {};

    if (policy.minLength !== undefined && value.length < policy.minLength) {
      errors['solarisPasswordMinLength'] = {
        requiredLength: policy.minLength,
        actualLength: value.length,
      };
    }

    if (policy.maxLength !== undefined && value.length > policy.maxLength) {
      errors['solarisPasswordMaxLength'] = {
        requiredLength: policy.maxLength,
        actualLength: value.length,
      };
    }

    if (policy.requireLowercase && !/[a-z]/.test(value)) {
      errors['solarisPasswordLowercase'] = true;
    }

    if (policy.requireUppercase && !/[A-Z]/.test(value)) {
      errors['solarisPasswordUppercase'] = true;
    }

    if (policy.requireNumber && !/[0-9]/.test(value)) {
      errors['solarisPasswordNumber'] = true;
    }

    if (policy.requireSymbol && !/[^a-zA-Z0-9]/.test(value)) {
      errors['solarisPasswordSymbol'] = true;
    }

    if (policy.disallowWhitespace && /\s/.test(value)) {
      errors['solarisPasswordWhitespace'] = true;
    }

    if (policy.forbiddenValues && policy.forbiddenValues.length > 0) {
      const lowerValue = value.toLowerCase();
      const found = policy.forbiddenValues.some((fv) =>
        lowerValue.includes(fv.toLowerCase()),
      );
      if (found) {
        errors['solarisPasswordForbiddenValue'] = true;
      }
    }

    return Object.keys(errors).length > 0 ? errors : null;
  };
}
