import { describe, expect, it } from 'vitest';

import {
  addSolarisMonths,
  formatSolarisDate,
  getCalendarDays,
  getLocalizedSolarisDateInfo,
  localeFirstDay,
  maskLocalizedSolarisDateInput,
  parseLocalizedSolarisDate,
  parseSolarisDate,
} from '../model/date.utils';

describe('Solaris date utilities', () => {
  it('parses only valid canonical dates', () => {
    expect(parseSolarisDate('2025-02-28')).not.toBeNull();
    expect(parseSolarisDate('2025-02-30')).toBeNull();
    expect(parseSolarisDate('28/02/2025')).toBeNull();
  });

  it('formats and parses dates in the resolved locale', () => {
    expect(formatSolarisDate('2025-01-16', 'pt-BR')).toBe('16/01/2025');
    expect(parseLocalizedSolarisDate('16/01/2025', 'pt-BR')).toBe('2025-01-16');
    expect(parseLocalizedSolarisDate('01/16/2025', 'en-US')).toBe('2025-01-16');
  });

  it('builds a six-week grid and crosses year boundaries', () => {
    expect(getCalendarDays({ year: 2025, month: 0 }, 0)).toHaveLength(42);
    expect(addSolarisMonths({ year: 2025, month: 11 }, 1)).toEqual({
      year: 2026,
      month: 0,
    });
  });

  it('formats with 2-digit padding by default and numeric without it (P5 B/C)', () => {
    expect(formatSolarisDate('2025-01-05', 'en-US')).toBe('01/05/2025');
    expect(formatSolarisDate('2025-01-05', 'en-US', 'numeric')).toBe(
      '1/5/2025',
    );
  });

  it('offsets the grid by the first day of the week (P5 B/C)', () => {
    const sundayStart = getCalendarDays({ year: 2025, month: 6 }, 0);
    expect(sundayStart[0].value).toBe('2025-06-29');
    const mondayStart = getCalendarDays({ year: 2025, month: 6 }, 1);
    expect(mondayStart[0].value).toBe('2025-06-30');
  });

  it('resolves the locale first day with a Sunday fallback (P5 B/C)', () => {
    expect(localeFirstDay('en-US')).toBe(0);
    expect(localeFirstDay('invalid-locale-xyz')).toBe(0);
  });

  it('resolves the date order and separator per locale', () => {
    expect(getLocalizedSolarisDateInfo('pt-BR').order).toEqual([
      'day',
      'month',
      'year',
    ]);
    expect(getLocalizedSolarisDateInfo('pt-BR').separator).toBe('/');
    expect(getLocalizedSolarisDateInfo('en-US').order).toEqual([
      'month',
      'day',
      'year',
    ]);
  });

  it('masks continuous digits progressively following the locale', () => {
    expect(maskLocalizedSolarisDateInput('16102026', 'pt-BR')).toBe(
      '16/10/2026',
    );
    expect(maskLocalizedSolarisDateInput('161', 'pt-BR')).toBe('16/1');
    expect(maskLocalizedSolarisDateInput('1610', 'pt-BR')).toBe('16/10');
    expect(maskLocalizedSolarisDateInput('10162026', 'en-US')).toBe(
      '10/16/2026',
    );
    expect(maskLocalizedSolarisDateInput('', 'pt-BR')).toBe('');
  });

  it('parses eight continuous digits without separators', () => {
    expect(parseLocalizedSolarisDate('16102026', 'pt-BR')).toBe('2026-10-16');
    expect(parseLocalizedSolarisDate('10162026', 'en-US')).toBe('2026-10-16');
  });

  it('rejects partial years while typing', () => {
    expect(parseLocalizedSolarisDate('16/10/202', 'pt-BR')).toBeNull();
    expect(parseLocalizedSolarisDate('16/10/26', 'pt-BR')).toBeNull();
  });
});
