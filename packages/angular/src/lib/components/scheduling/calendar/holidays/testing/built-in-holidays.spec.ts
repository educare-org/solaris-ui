import { beforeAll, describe, expect, it, vi } from 'vitest';

import type { SolarisHoliday } from '../../model/calendar.types';
import {
  builtInHolidays,
  isBuiltInHolidaysLoaded,
  preloadBuiltInHolidays,
} from '../builtin/built-in-holidays';
import type { SolarisHolidayProvider } from '../model/holidays.types';

function yearRange(year: number): { start: string; end: string } {
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

function byKey(holidays: SolarisHoliday[]): Map<string, string> {
  return new Map(
    holidays.map((holiday) => [holiday.nameKey ?? holiday.name, holiday.date]),
  );
}

describe('Solaris built-in holidays', () => {
  beforeAll(async () => {
    await preloadBuiltInHolidays('pt-BR');
    await preloadBuiltInHolidays('en-US');
    await preloadBuiltInHolidays('es');
  });

  it('loads the bundled locales once', async () => {
    expect(isBuiltInHolidaysLoaded('pt-BR')).toBe(true);
    expect(isBuiltInHolidaysLoaded('en-US')).toBe(true);
    await preloadBuiltInHolidays('pt-BR');
    expect(isBuiltInHolidaysLoaded('pt-BR')).toBe(true);
  });

  it('serves pt-BR fixed holidays across three years', () => {
    const provider = builtInHolidays();
    for (const year of [2024, 2025, 2026]) {
      const found = byKey(provider.holidays(yearRange(year), 'pt-BR'));
      expect(found.get('solaris.calendar.holidays.tiradentes')).toBe(
        `${year}-04-21`,
      );
      expect(found.get('solaris.calendar.holidays.independence-day')).toBe(
        `${year}-09-07`,
      );
      expect(found.get('solaris.calendar.holidays.christmas')).toBe(
        `${year}-12-25`,
      );
    }
  });

  it('serves pt-BR movable holidays from the Easter computus', () => {
    const provider = builtInHolidays();
    const expected: Record<number, { carnival: string; goodFriday: string }> = {
      2024: { carnival: '2024-02-13', goodFriday: '2024-03-29' },
      2025: { carnival: '2025-03-04', goodFriday: '2025-04-18' },
      2026: { carnival: '2026-02-17', goodFriday: '2026-04-03' },
    };
    for (const year of [2024, 2025, 2026]) {
      const found = byKey(provider.holidays(yearRange(year), 'pt-BR'));
      expect(found.get('solaris.calendar.holidays.carnival')).toBe(
        expected[year].carnival,
      );
      expect(found.get('solaris.calendar.holidays.good-friday')).toBe(
        expected[year].goodFriday,
      );
    }
  });

  it('serves en-US fixed and weekday-rule holidays across three years', () => {
    const provider = builtInHolidays();
    const thanksgiving = ['2024-11-28', '2025-11-27', '2026-11-26'];
    const memorial = ['2024-05-27', '2025-05-26', '2026-05-25'];
    [2024, 2025, 2026].forEach((year, index) => {
      const found = byKey(provider.holidays(yearRange(year), 'en-US'));
      expect(found.get('solaris.calendar.holidays.christmas')).toBe(
        `${year}-12-25`,
      );
      expect(found.get('solaris.calendar.holidays.new-year')).toBe(
        `${year}-01-01`,
      );
      expect(found.get('solaris.calendar.holidays.thanksgiving')).toBe(
        thanksgiving[index],
      );
      expect(found.get('solaris.calendar.holidays.memorial-day')).toBe(
        memorial[index],
      );
    });
  });

  it('shifts en-US weekend holidays to observed days', () => {
    const provider = builtInHolidays();
    const found2026 = byKey(provider.holidays(yearRange(2026), 'en-US'));
    expect(found2026.get('solaris.calendar.holidays.independence-day')).toBe(
      '2026-07-03',
    );
    const found2023 = byKey(provider.holidays(yearRange(2023), 'en-US'));
    expect(found2023.get('solaris.calendar.holidays.veterans-day')).toBe(
      '2023-11-10',
    );
  });

  it('serves en-US movable observances across three years', () => {
    const provider = builtInHolidays();
    const easter = ['2024-03-31', '2025-04-20', '2026-04-05'];
    [2024, 2025, 2026].forEach((year, index) => {
      const found = byKey(provider.holidays(yearRange(year), 'en-US'));
      expect(found.get('solaris.calendar.holidays.easter')).toBe(easter[index]);
      expect(found.has('solaris.calendar.holidays.good-friday')).toBe(true);
    });
  });

  it('serves es fixed holidays across three years', () => {
    const provider = builtInHolidays();
    for (const year of [2024, 2025, 2026]) {
      const found = byKey(provider.holidays(yearRange(year), 'es'));
      expect(found.get('solaris.calendar.holidays.hispanic-day')).toBe(
        `${year}-10-12`,
      );
      expect(found.get('solaris.calendar.holidays.constitution-day')).toBe(
        `${year}-12-06`,
      );
      expect(found.get('solaris.calendar.holidays.epiphany')).toBe(
        `${year}-01-06`,
      );
    }
  });

  it('serves es movable holidays across three years', () => {
    const provider = builtInHolidays();
    const goodFriday = ['2024-03-29', '2025-04-18', '2026-04-03'];
    const easter = ['2024-03-31', '2025-04-20', '2026-04-05'];
    [2024, 2025, 2026].forEach((year, index) => {
      const found = byKey(provider.holidays(yearRange(year), 'es'));
      expect(found.get('solaris.calendar.holidays.good-friday')).toBe(
        goodFriday[index],
      );
      expect(found.get('solaris.calendar.holidays.easter')).toBe(easter[index]);
    });
  });

  it('spans multi-year ranges in date order', () => {
    const provider = builtInHolidays();
    const holidays = provider.holidays(
      { start: '2024-01-01', end: '2026-12-31' },
      'pt-BR',
    );
    const tiradentes = holidays.filter(
      (holiday) => holiday.nameKey === 'solaris.calendar.holidays.tiradentes',
    );
    expect(tiradentes.map((holiday) => holiday.date)).toEqual([
      '2024-04-21',
      '2025-04-21',
      '2026-04-21',
    ]);
    const dates = holidays.map((holiday) => holiday.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it('extends the built-in provider without mutating it', () => {
    const provider = builtInHolidays();
    const municipal = {
      date: '2026-01-20',
      name: 'São Sebastião',
      nameKey: 'custom.sao-sebastiao',
    };
    const extended = provider.extend([municipal]);
    const range = yearRange(2026);
    expect(
      extended
        .holidays(range, 'pt-BR')
        .some((holiday) => holiday.date === '2026-01-20'),
    ).toBe(true);
    expect(
      provider
        .holidays(range, 'pt-BR')
        .some((holiday) => holiday.date === '2026-01-20'),
    ).toBe(false);
  });

  it('accepts a fully custom provider', () => {
    const custom: SolarisHolidayProvider = {
      holidays: () => [
        { date: '2026-07-09', name: 'Custom Day', nameKey: 'custom.day' },
      ],
      extend: (more) => ({
        holidays: () => [
          { date: '2026-07-09', name: 'Custom Day', nameKey: 'custom.day' },
          ...more,
        ],
        extend: () => custom,
      }),
    };
    expect(custom.holidays(yearRange(2026), 'xx').at(0)?.date).toBe(
      '2026-07-09',
    );
  });

  it('falls back to an empty list with a warning for unsupported locales', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const provider = builtInHolidays();
      await preloadBuiltInHolidays('fr-FR');
      expect(provider.holidays(yearRange(2026), 'fr-FR')).toEqual([]);
      expect(provider.holidays(yearRange(2026), 'fr-FR')).toEqual([]);
      expect(warn).toHaveBeenCalledTimes(1);
    } finally {
      warn.mockRestore();
    }
  });

  it('returns an empty list for invalid ranges instead of throwing', () => {
    const provider = builtInHolidays();
    expect(
      provider.holidays({ start: 'bogus', end: '2026-12-31' }, 'pt-BR'),
    ).toEqual([]);
    expect(
      provider.holidays({ start: '2026-12-31', end: '2026-01-01' }, 'pt-BR'),
    ).toEqual([]);
  });
});
