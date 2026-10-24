import { describe, expect, it } from 'vitest';

import { addDaysToSolarisDate } from '../model/calendar-datetime.utils';
import { computeEasterSunday } from '../model/easter.utils';

describe('Solaris Easter computus', () => {
  it('matches known Gregorian Easter Sundays', () => {
    expect(computeEasterSunday(2019)).toBe('2019-04-21');
    expect(computeEasterSunday(2022)).toBe('2022-04-17');
    expect(computeEasterSunday(2023)).toBe('2023-04-09');
    expect(computeEasterSunday(2024)).toBe('2024-03-31');
    expect(computeEasterSunday(2025)).toBe('2025-04-20');
    expect(computeEasterSunday(2026)).toBe('2026-04-05');
    expect(computeEasterSunday(2027)).toBe('2027-03-28');
    expect(computeEasterSunday(2000)).toBe('2000-04-23');
    expect(computeEasterSunday(2030)).toBe('2030-04-21');
  });

  it('derives movable feasts by offset for the holidays provider', () => {
    expect(addDaysToSolarisDate(computeEasterSunday(2025), -2)).toBe(
      '2025-04-18',
    );
    expect(addDaysToSolarisDate(computeEasterSunday(2026), 60)).toBe(
      '2026-06-04',
    );
  });

  it('rejects non-Gregorian input', () => {
    expect(() => computeEasterSunday(1500)).toThrow(RangeError);
    expect(() => computeEasterSunday(2026.5)).toThrow(RangeError);
  });
});
