import {
  buildCountries,
  getCountryFlag,
  flagEmojiFallback,
} from '../model/country';
import {
  formatAsYouType,
  toE164,
  detectCountry,
  formatE164,
  getExampleNumberFor,
  getMaxNationalNumberLength,
} from '../model/phone-format';

describe('country model', () => {
  it('builds a sorted list with calling codes', () => {
    const countries = buildCountries('en-US');
    expect(countries.length).toBeGreaterThan(100);
    const br = countries.find((c) => c.code === 'BR');
    expect(br).toBeTruthy();
    expect(br!.callingCode).toBe('55');
  });

  it('returns a flag for a known country', () => {
    expect(getCountryFlag('BR')).toBeTruthy();
  });

  it('falls back to emoji for an unknown country', () => {
    const fallback = flagEmojiFallback('BR');
    expect(fallback).toBe('🇧🇷');
  });

  it('localizes country names', () => {
    const pt = buildCountries('pt-BR');
    const br = pt.find((c) => c.code === 'BR');
    expect(br!.name).toBe('Brasil');
  });
});

describe('phone-format helpers', () => {
  it('formats as you type for a country', () => {
    const formatted = formatAsYouType('11999998888', 'BR');
    expect(formatted.replace(/\D/g, '')).toBe('11999998888');
  });

  it('converts to E.164', () => {
    expect(toE164('11999998888', 'BR')).toBe('+5511999998888');
  });

  it('detects country from E.164', () => {
    expect(detectCountry('+5511999998888')).toBe('BR');
  });

  it('formats E.164 to national display', () => {
    expect(formatE164('+5511999998888')).toContain('99999-8888');
  });

  it('returns an example number for a country', () => {
    const example = getExampleNumberFor('BR');
    expect(example).toBeTruthy();
  });

  it('returns the maximum national length for a country', () => {
    expect(getMaxNationalNumberLength('BR')).toBeGreaterThanOrEqual(10);
    expect(getMaxNationalNumberLength('US')).toBe(10);
  });
});
