import { describe, expect, it } from 'vitest';

import type { SolarisCountryCode } from '../model/country.types';
import {
  adjustRawForTrailingFormatDeletion,
  formatE164ForDisplay,
  formatInternationalDisplay,
  getPhoneLengthReason,
  mapCaretToFormatted,
  parseEditablePhoneInput,
} from '../functions/phone-field-input';

const COUNTRIES = [
  { code: 'BR' as SolarisCountryCode, callingCode: '55' },
  { code: 'US' as SolarisCountryCode, callingCode: '1' },
  { code: 'PT' as SolarisCountryCode, callingCode: '351' },
];

describe('parseEditablePhoneInput', () => {
  it('returns empty display and value for empty input', () => {
    expect(parseEditablePhoneInput('', 'BR', COUNTRIES)).toEqual({
      country: 'BR',
      nationalDigits: '',
      display: '',
      e164: '',
    });
    expect(parseEditablePhoneInput('+', 'BR', COUNTRIES).display).toBe('');
  });

  it('formats national digits with the current country prefix', () => {
    const parsed = parseEditablePhoneInput('11999998888', 'BR', COUNTRIES);
    expect(parsed.country).toBe('BR');
    expect(parsed.display.startsWith('+55')).toBe(true);
    expect(parsed.display).toContain('99999-8888');
    expect(parsed.e164).toBe('+5511999998888');
  });

  it('detects the country from a full international number', () => {
    const parsed = parseEditablePhoneInput('+14155552671', 'BR', COUNTRIES);
    expect(parsed.country).toBe('US');
    expect(parsed.e164).toBe('+14155552671');
    expect(parsed.display.startsWith('+1')).toBe(true);
  });

  it('keeps partially typed calling codes without emitting a value', () => {
    const parsed = parseEditablePhoneInput('+5', 'BR', COUNTRIES);
    expect(parsed.display).toBe('+5');
    expect(parsed.e164).toBe('');
  });

  it('resolves a 00-prefixed international number', () => {
    const parsed = parseEditablePhoneInput('0014155552671', 'BR', COUNTRIES);
    expect(parsed.country).toBe('US');
    expect(parsed.e164).toBe('+14155552671');
  });
});

describe('formatE164ForDisplay', () => {
  it('returns empty display for empty E.164', () => {
    expect(formatE164ForDisplay('')).toEqual({
      country: undefined,
      display: '',
    });
  });

  it('prefixes the national format with the calling code', () => {
    const { country, display } = formatE164ForDisplay('+5511999998888');
    expect(country).toBe('BR');
    expect(display.startsWith('+55')).toBe(true);
    expect(display).toContain('99999-8888');
  });
});

describe('formatInternationalDisplay', () => {
  it('returns empty for empty parts and bare prefix otherwise', () => {
    expect(formatInternationalDisplay('', '')).toBe('');
    expect(formatInternationalDisplay('55', '')).toBe('+55');
    expect(formatInternationalDisplay('55', '(11) 99999-8888')).toBe(
      '+55 (11) 99999-8888',
    );
  });
});

describe('adjustRawForTrailingFormatDeletion', () => {
  it('drops the last digit when backspace removes trailing formatting', () => {
    // BR `(11)` keeps its `)` on reformat: deleting just `)` must also
    // drop the `1`, otherwise backspace looks stuck at `+55 (11)`.
    expect(adjustRawForTrailingFormatDeletion('+55 (11', '+55 (11)')).toBe(
      '+55 (1',
    );
  });

  it('leaves digit deletions and insertions alone', () => {
    expect(adjustRawForTrailingFormatDeletion('+55 ', '+55 1')).toBe('+55 ');
    expect(adjustRawForTrailingFormatDeletion('+55 11', '+55 1')).toBe(
      '+55 11',
    );
    expect(adjustRawForTrailingFormatDeletion('9', '+55 (11)')).toBe('9');
    expect(adjustRawForTrailingFormatDeletion('', '')).toBe('');
  });
});

describe('getPhoneLengthReason', () => {
  it('explains short, long and unknown-country values', () => {
    expect(getPhoneLengthReason('+55 1', 'BR')).toBe('TOO_SHORT');
    expect(getPhoneLengthReason('+551199999888812345678', 'BR')).toBe(
      'TOO_LONG',
    );
    expect(getPhoneLengthReason('+999123', 'BR')).toBe('INVALID_COUNTRY');
  });

  it('returns undefined for empty values and acceptable lengths', () => {
    expect(getPhoneLengthReason('', 'BR')).toBeUndefined();
    expect(getPhoneLengthReason('+14155552671', 'US')).toBeUndefined();
    // Right length but not a real number: generic invalid, no length reason.
    expect(getPhoneLengthReason('+550000000000', 'BR')).toBeUndefined();
  });
});

describe('mapCaretToFormatted', () => {
  it('maps digit positions from raw to formatted values', () => {
    expect(mapCaretToFormatted('+5511', 5, '+55 (11')).toBe(7);
    expect(mapCaretToFormatted('', 0, '')).toBe(0);
    expect(mapCaretToFormatted('+5', 2, '+5')).toBe(2);
  });

  it('lands at the end when appending national digits from an empty field', () => {
    // Regression: typing "5" from empty produced "+5|5 5" (cursor inside
    // the auto-filled DDI). The auto-prepended prefix shifts the target.
    expect(mapCaretToFormatted('5', 1, '+55 5', 2)).toBe(5);
    expect(mapCaretToFormatted('51', 2, '+52 51', 2)).toBe(6);
  });
});
