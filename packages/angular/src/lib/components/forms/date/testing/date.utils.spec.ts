import { describe, expect, it } from 'vitest';

import {
  addSolarisMonths,
  formatSolarisDate,
  getCalendarDays,
  localeFirstDay,
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
});
