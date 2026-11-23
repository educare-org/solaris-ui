import { describe, expect, it } from 'vitest';

import type { SolarisCountry } from '../model/country.types';
import {
  buildCountryAnnouncementParams,
  formatCountryAnnouncementFallback,
  isPhoneValueValid,
  resolveInitialCountry,
} from '../functions/phone-field-country';

const ALLOWED = ['BR', 'US', 'PT'] as const;

describe('resolveInitialCountry', () => {
  it('prefers an explicit country even when it is not allowed', () => {
    expect(
      resolveInitialCountry({
        explicitCountry: 'XX',
        valueCountry: 'BR',
        defaultCountry: 'BR',
        lookupCountry: 'US',
        allowedCodes: [...ALLOWED],
        firstCountry: 'BR',
      }),
    ).toBe('XX');
  });

  it('prefers a detected E.164 country over the lookup result', () => {
    expect(
      resolveInitialCountry({
        valueCountry: 'BR',
        lookupCountry: 'US',
        defaultCountry: 'PT',
        allowedCodes: [...ALLOWED],
        firstCountry: 'BR',
      }),
    ).toBe('BR');
  });

  it('uses the lookup result when it is allowed', () => {
    expect(
      resolveInitialCountry({
        lookupCountry: 'US',
        defaultCountry: 'BR',
        allowedCodes: [...ALLOWED],
        firstCountry: 'BR',
      }),
    ).toBe('US');
  });

  it('falls back to default and first countries', () => {
    expect(
      resolveInitialCountry({
        defaultCountry: 'PT',
        allowedCodes: [...ALLOWED],
        firstCountry: 'BR',
      }),
    ).toBe('PT');
    expect(
      resolveInitialCountry({
        lookupCountry: 'XX',
        defaultCountry: 'XX',
        allowedCodes: [...ALLOWED],
        firstCountry: 'BR',
      }),
    ).toBe('BR');
  });

  it('ignores nullish and disallowed lookup results', () => {
    expect(
      resolveInitialCountry({
        lookupCountry: undefined,
        defaultCountry: 'BR',
        allowedCodes: [...ALLOWED],
        firstCountry: 'PT',
      }),
    ).toBe('BR');
    expect(
      resolveInitialCountry({
        lookupCountry: null,
        defaultCountry: 'BR',
        allowedCodes: [...ALLOWED],
        firstCountry: 'PT',
      }),
    ).toBe('BR');
    expect(
      resolveInitialCountry({
        valueCountry: 'XX',
        lookupCountry: 'US',
        allowedCodes: [...ALLOWED],
        firstCountry: 'BR',
      }),
    ).toBe('US');
  });
});

describe('isPhoneValueValid', () => {
  it('treats empty values as valid only when not required', () => {
    expect(isPhoneValueValid('', '', false)).toBe(true);
    expect(isPhoneValueValid('   ', '', false)).toBe(true);
    expect(isPhoneValueValid('', '', true)).toBe(false);
  });

  it('requires a valid E.164 value for non-empty displays', () => {
    expect(isPhoneValueValid('+55 11', '', false)).toBe(false);
    expect(
      isPhoneValueValid('+55 (11) 99999-8888', '+5511999998888', false),
    ).toBe(true);
    expect(
      isPhoneValueValid('+55 (11) 99999-8888', '+5511999998888', true),
    ).toBe(true);
  });
});

describe('country announcement helpers', () => {
  const country: SolarisCountry = {
    code: 'US',
    callingCode: '1',
    name: 'United States',
    flag: '',
  };

  it('builds translation params from the selected country', () => {
    expect(buildCountryAnnouncementParams(country)).toEqual({
      country: 'United States',
      code: '1',
    });
  });

  it('formats the English fallback announcement', () => {
    expect(formatCountryAnnouncementFallback('United States', '1')).toBe(
      'Country: United States (+1)',
    );
  });
});
