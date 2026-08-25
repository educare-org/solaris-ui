import type { ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

import type { SolarisCountryCode } from '../model/country.types';

export function solarisPhoneValidator(
  country?: SolarisCountryCode,
): ValidatorFn {
  return (control) => {
    const value = control.value;
    if (value == null || value === '') {
      return null;
    }
    const parsed = parsePhoneNumberFromString(
      String(value),
      country as CountryCode | undefined,
    );
    if (!parsed || !parsed.isValid()) {
      return { solarisPhoneInvalid: true };
    }
    return null;
  };
}
