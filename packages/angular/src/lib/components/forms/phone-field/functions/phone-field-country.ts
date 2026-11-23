import type {
  SolarisCountry,
  SolarisCountryCode,
} from '../model/country.types';

export interface SolarisInitialCountryOptions {
  explicitCountry?: SolarisCountryCode | undefined;
  valueCountry?: SolarisCountryCode | undefined;
  defaultCountry?: SolarisCountryCode | undefined;
  lookupCountry?: SolarisCountryCode | null | undefined;
  allowedCodes: readonly SolarisCountryCode[];
  firstCountry?: SolarisCountryCode | undefined;
}

/**
 * Resolve the initial country with the same precedence the component uses:
 * explicit `country` wins, then the country detected from an already-filled
 * E.164 value, then the async lookup result, then `defaultCountry`, then the
 * first allowed country. Lookup and default candidates only apply when they
 * belong to the allowed list; the explicit country is returned as-is to mirror
 * the controlled behavior of `effectiveCountry`.
 */
export function resolveInitialCountry(
  options: SolarisInitialCountryOptions,
): SolarisCountryCode | undefined {
  const {
    explicitCountry,
    valueCountry,
    defaultCountry,
    lookupCountry,
    allowedCodes,
    firstCountry,
  } = options;
  if (explicitCountry) {
    return explicitCountry;
  }
  const allowed = new Set(allowedCodes);
  if (valueCountry && allowed.has(valueCountry)) {
    return valueCountry;
  }
  if (lookupCountry && allowed.has(lookupCountry)) {
    return lookupCountry;
  }
  if (defaultCountry && allowed.has(defaultCountry)) {
    return defaultCountry;
  }
  return firstCountry;
}

/**
 * Report whether the current field value counts as valid.
 * An empty display is valid only when the field is not required; a
 * non-empty display is valid only when it normalized to a valid E.164 value
 * (the component stores `''` while the number is incomplete or invalid).
 */
export function isPhoneValueValid(
  display: string,
  e164: string,
  required: boolean,
): boolean {
  const empty = !display || display.trim().length === 0;
  if (empty) {
    return !required;
  }
  return e164.length > 0;
}

/**
 * English fallback for the screen-reader country announcement, used when the
 * `solaris.phone-field.countryAnnounced` key cannot be resolved.
 */
export function formatCountryAnnouncementFallback(
  countryName: string,
  callingCode: string,
): string {
  return `Country: ${countryName} (+${callingCode})`;
}

/**
 * Build the interpolation params for the `countryAnnounced` translation key.
 */
export function buildCountryAnnouncementParams(country: SolarisCountry): {
  country: string;
  code: string;
} {
  return { country: country.name, code: country.callingCode };
}
