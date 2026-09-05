import { describe, expect, it } from 'vitest';

import {
  addSolarisMonths,
  formatSolarisDate,
  getCalendarDays,
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
});
