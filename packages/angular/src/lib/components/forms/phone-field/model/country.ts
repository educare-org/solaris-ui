import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import * as FLAG_3X2 from 'country-flag-icons/string/3x2';
import { hasFlag } from 'country-flag-icons';

import type { SolarisCountry, SolarisCountryCode } from './country.types';

const FLAG_INDEX = FLAG_3X2 as unknown as Record<string, string>;

export function flagEmojiFallback(code: SolarisCountryCode): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(0x1f1e6 + (char.charCodeAt(0) - 65)),
    );
}

export function getCountryFlag(code: SolarisCountryCode): string {
  if (hasFlag(code)) {
    return FLAG_INDEX[code] ?? flagEmojiFallback(code);
  }
  return flagEmojiFallback(code);
}

export function buildCountries(locale = 'en-US'): SolarisCountry[] {
  const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
  return getCountries()
    .map((code) => {
      const cc = code as CountryCode;
      const name = displayNames.of(code) ?? code;
      return {
        code,
        callingCode: String(getCountryCallingCode(cc)),
        name,
        flag: getCountryFlag(code),
      } satisfies SolarisCountry;
    })
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
