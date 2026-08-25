import {
  AsYouType,
  parsePhoneNumberFromString,
  getExampleNumber,
  Metadata,
} from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/examples.mobile.json';

import type { SolarisCountryCode } from './country.types';

export function getMaxNationalNumberLength(
  country: SolarisCountryCode,
): number {
  const metadata = new Metadata();
  metadata.selectNumberingPlan(country as CountryCode);
  const lengths = metadata.numberingPlan?.possibleLengths() ?? [];
  return lengths.length > 0 ? Math.max(...lengths) : 0;
}

export function formatAsYouType(
  value: string,
  country: SolarisCountryCode,
): string {
  return new AsYouType(country as CountryCode).input(value);
}

export function toE164(value: string, country?: SolarisCountryCode): string {
  const parsed = parsePhoneNumberFromString(
    value,
    country as CountryCode | undefined,
  );
  return parsed?.number ?? '';
}

export function toValidE164(
  value: string,
  country?: SolarisCountryCode,
): string {
  const parsed = parsePhoneNumberFromString(
    value,
    country as CountryCode | undefined,
  );
  return parsed && parsed.isValid() ? parsed.number : '';
}

export function detectCountry(value: string): SolarisCountryCode | undefined {
  const parsed = parsePhoneNumberFromString(value);
  return parsed?.country;
}

export function formatE164(value: string): string {
  const parsed = parsePhoneNumberFromString(value);
  return parsed ? parsed.formatNational() : value;
}

export function getExampleNumberFor(country: SolarisCountryCode): string {
  const number = getExampleNumber(country as CountryCode, examples);
  return number ? number.formatNational() : '';
}
