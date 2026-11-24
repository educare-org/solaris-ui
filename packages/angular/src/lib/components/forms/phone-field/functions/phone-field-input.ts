import {
  AsYouType,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
} from 'libphonenumber-js';

import type { SolarisCountryCode } from '../model/country.types';
import { getMaxNationalNumberLength } from '../model/phone-format';

export interface SolarisParsedPhoneInput {
  country: SolarisCountryCode;
  nationalDigits: string;
  display: string;
  e164: string;
}

function callingCodeFor(country: SolarisCountryCode): string {
  try {
    return String(getCountryCallingCode(country as CountryCode));
  } catch {
    return '';
  }
}

function formatNational(country: SolarisCountryCode, digits: string): string {
  if (!digits) return '';
  return new AsYouType(country as CountryCode).input(digits);
}

function toValidE164For(
  nationalFormatted: string,
  country: SolarisCountryCode,
): string {
  if (!nationalFormatted) return '';
  const parsed = parsePhoneNumberFromString(
    nationalFormatted,
    country as CountryCode | undefined,
  );
  return parsed?.isValid() ? parsed.number : '';
}

export function formatInternationalDisplay(
  callingCode: string,
  nationalFormatted: string,
): string {
  if (!callingCode && !nationalFormatted) return '';
  if (!nationalFormatted) return `+${callingCode}`;
  return `+${callingCode} ${nationalFormatted}`;
}

function isAllowed(
  code: SolarisCountryCode | undefined,
  allowed: SolarisCountryCode[],
): code is SolarisCountryCode {
  return !!code && allowed.includes(code);
}

function longestCallingCodeMatch(
  digits: string,
  candidates: { code: SolarisCountryCode; callingCode: string }[],
): { code: SolarisCountryCode; callingCode: string } | undefined {
  let best: { code: SolarisCountryCode; callingCode: string } | undefined;
  for (const candidate of candidates) {
    if (
      digits.startsWith(candidate.callingCode) &&
      (!best || candidate.callingCode.length > best.callingCode.length)
    ) {
      best = candidate;
    }
  }
  return best;
}

function normalizeInternationalPrefix(trimmed: string): string {
  if (trimmed.startsWith('+')) {
    return trimmed;
  }
  if (!trimmed.startsWith('00')) {
    return trimmed;
  }
  return `+${trimmed.slice(2).trimStart()}`;
}

function parseInternationalNumber(
  normalized: string,
  currentCountry: SolarisCountryCode,
  allowedCountries: { code: SolarisCountryCode; callingCode: string }[],
  allowedCodes: SolarisCountryCode[],
  capFor: (country: SolarisCountryCode) => number,
): SolarisParsedPhoneInput {
  const detected = parsePhoneNumberFromString(normalized)?.country as
    | SolarisCountryCode
    | undefined;
  if (isAllowed(detected, allowedCodes)) {
    const callingCode = callingCodeFor(detected);
    let nationalDigits = normalized.replace(/\D+/g, '');
    if (callingCode && nationalDigits.startsWith(callingCode)) {
      nationalDigits = nationalDigits.slice(callingCode.length);
    }
    nationalDigits = nationalDigits.slice(0, capFor(detected));
    const nationalFormatted = formatNational(detected, nationalDigits);
    return {
      country: detected,
      nationalDigits,
      display: formatInternationalDisplay(callingCode, nationalFormatted),
      e164: toValidE164For(nationalFormatted, detected),
    };
  }
  const digitsAfterPlus = normalized.slice(1).replace(/\D+/g, '');
  if (!digitsAfterPlus) {
    return {
      country: currentCountry,
      nationalDigits: '',
      display: '',
      e164: '',
    };
  }
  const partial = longestCallingCodeMatch(digitsAfterPlus, allowedCountries);
  if (partial && isAllowed(partial.code, allowedCodes)) {
    const rest = digitsAfterPlus.slice(partial.callingCode.length);
    const nationalDigits = rest.slice(0, capFor(partial.code));
    const nationalFormatted = formatNational(partial.code, nationalDigits);
    return {
      country: partial.code,
      nationalDigits,
      display: formatInternationalDisplay(
        partial.callingCode,
        nationalFormatted,
      ),
      e164: toValidE164For(nationalFormatted, partial.code),
    };
  }
  return {
    country: currentCountry,
    nationalDigits: '',
    display: `+${digitsAfterPlus}`,
    e164: '',
  };
}

function parseNationalNumber(
  normalized: string,
  currentCountry: SolarisCountryCode,
  capFor: (country: SolarisCountryCode) => number,
): SolarisParsedPhoneInput {
  const nationalDigits = normalized
    .replace(/\D+/g, '')
    .slice(0, capFor(currentCountry));
  const nationalFormatted = formatNational(currentCountry, nationalDigits);
  return {
    country: currentCountry,
    nationalDigits,
    display: nationalDigits
      ? formatInternationalDisplay(
          callingCodeFor(currentCountry),
          nationalFormatted,
        )
      : '',
    e164: toValidE164For(nationalFormatted, currentCountry),
  };
}

export function parseEditablePhoneInput(
  raw: string,
  currentCountry: SolarisCountryCode,
  allowedCountries: { code: SolarisCountryCode; callingCode: string }[],
  maxNationalLength?: number,
): SolarisParsedPhoneInput {
  const allowedCodes = allowedCountries.map((country) => country.code);
  const capFor = (country: SolarisCountryCode): number => {
    return maxNationalLength ?? getMaxNationalNumberLength(country);
  };
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '+') {
    return {
      country: currentCountry,
      nationalDigits: '',
      display: '',
      e164: '',
    };
  }
  const normalized = normalizeInternationalPrefix(trimmed);
  if (normalized.startsWith('+')) {
    return parseInternationalNumber(
      normalized,
      currentCountry,
      allowedCountries,
      allowedCodes,
      capFor,
    );
  }
  return parseNationalNumber(normalized, currentCountry, capFor);
}

function resolveE164CallingCode(
  countryCallingCode: string | undefined,
  country: SolarisCountryCode | undefined,
): string {
  if (countryCallingCode) {
    return String(countryCallingCode);
  }
  if (country) {
    return callingCodeFor(country);
  }
  return '';
}

export function formatE164ForDisplay(e164: string): {
  country: SolarisCountryCode | undefined;
  display: string;
} {
  if (!e164) return { country: undefined, display: '' };
  const parsed = parsePhoneNumberFromString(e164);
  if (!parsed) return { country: undefined, display: e164 };
  const country = parsed.country as SolarisCountryCode | undefined;
  const national = parsed.formatNational();
  const callingCode = resolveE164CallingCode(
    parsed.countryCallingCode ? String(parsed.countryCallingCode) : undefined,
    country,
  );
  if (!callingCode) return { country, display: national };
  const nationalWithoutCode = national.startsWith(`+${callingCode} `)
    ? national.slice(callingCode.length + 2)
    : national;
  return {
    country,
    display: formatInternationalDisplay(callingCode, nationalWithoutCode),
  };
}

export function adjustRawForTrailingFormatDeletion(
  raw: string,
  prevDisplay: string,
): string {
  if (raw !== prevDisplay?.slice(0, -1)) {
    return raw;
  }
  if (!/\D/.test(prevDisplay.slice(-1))) {
    return raw;
  }
  const lastDigit = raw.search(/\d(?=\D*$)/);
  if (lastDigit < 0) {
    return raw;
  }
  return raw.slice(0, lastDigit) + raw.slice(lastDigit + 1);
}

export type SolarisPhoneLengthReason =
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'INVALID_COUNTRY';

export function getPhoneLengthReason(
  display: string,
  country: SolarisCountryCode,
): SolarisPhoneLengthReason | undefined {
  if (!display?.trim()) {
    return undefined;
  }
  const reason = validatePhoneNumberLength(
    display,
    country as CountryCode | undefined,
  );
  if (
    reason === 'TOO_SHORT' ||
    reason === 'TOO_LONG' ||
    reason === 'INVALID_COUNTRY'
  ) {
    return reason;
  }
  return undefined;
}

export function mapCaretToFormatted(
  rawValue: string,
  rawCaret: number,
  formattedValue: string,
  autoPrefixDigits = 0,
): number {
  const clampedCaret = Math.max(0, Math.min(rawCaret, rawValue.length));
  if (clampedCaret >= rawValue.length) {
    return formattedValue.length;
  }
  const digitsBefore = rawValue
    .slice(0, clampedCaret)
    .replace(/\D/g, '').length;
  const target = digitsBefore + Math.max(0, autoPrefixDigits);
  if (target <= 0) {
    const firstDigit = formattedValue.search(/\d/);
    return firstDigit < 0 ? formattedValue.length : firstDigit;
  }
  let seen = 0;
  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index] ?? '')) {
      seen += 1;
      if (seen === target) return index + 1;
    }
  }
  return formattedValue.length;
}
