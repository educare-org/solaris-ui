import { describe, expect, it } from 'vitest';

import {
  addDaysPreservingSolarisWall,
  addDaysToSolarisDate,
  addMinutesToSolarisDateTime,
  compareSolarisDateTimes,
  diffSolarisDateTimeMinutes,
  getTimeZoneOffsetMinutes,
  getWeekdayInZone,
  isSolarisDateTimeValue,
  isSolarisDateValue,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  startOfSolarisDay,
  startOfSolarisMonth,
  startOfSolarisWeek,
  toSolarisDateTimeValue,
} from '../model/calendar-datetime.utils';

const NEW_YORK = 'America/New_York';
const BERLIN = 'Europe/Berlin';
const SAO_PAULO = 'America/Sao_Paulo';

describe('Solaris calendar datetime utilities', () => {
  it('validates date-only and datetime shapes', () => {
    expect(isSolarisDateValue('2026-10-15')).toBe(true);
    expect(isSolarisDateValue('2026-02-30')).toBe(false);
    expect(isSolarisDateTimeValue('2026-10-15T14:30:00-03:00')).toBe(true);
    expect(isSolarisDateTimeValue('2026-10-15')).toBe(false);
    expect(parseSolarisDateTimeMs('not-a-date')).toBeNull();
  });

  it('adds instants across the New York spring forward (02:00 vanishes)', () => {
    expect(
      addMinutesToSolarisDateTime('2026-03-08T01:30:00-05:00', 90, NEW_YORK),
    ).toBe('2026-03-08T04:00:00-04:00');
    expect(
      diffSolarisDateTimeMinutes(
        '2026-03-08T01:30:00-05:00',
        '2026-03-08T03:30:00-04:00',
      ),
    ).toBe(60);
  });

  it('adds instants across the New York fall back (01:00-02:00 repeats)', () => {
    expect(
      addMinutesToSolarisDateTime('2026-11-01T00:30:00-04:00', 90, NEW_YORK),
    ).toBe('2026-11-01T01:00:00-05:00');
    expect(
      resolveSolarisWallTimeMs(NEW_YORK, {
        year: 2026,
        month: 11,
        day: 1,
        hour: 1,
        minute: 30,
        second: 0,
      }),
    ).toBe(Date.UTC(2026, 10, 1, 5, 30));
  });

  it('adds instants across Berlin spring forward and fall back', () => {
    expect(
      addMinutesToSolarisDateTime('2026-03-29T01:30:00+01:00', 60, BERLIN),
    ).toBe('2026-03-29T03:30:00+02:00');
    expect(
      addMinutesToSolarisDateTime('2026-10-25T02:30:00+02:00', 60, BERLIN),
    ).toBe('2026-10-25T02:30:00+01:00');
  });

  it('keeps civil dates DST-free, including leap day', () => {
    expect(addDaysToSolarisDate('2024-02-28', 1)).toBe('2024-02-29');
    expect(addDaysToSolarisDate('2024-02-29', 1)).toBe('2024-03-01');
    expect(startOfSolarisDay('2024-02-29', SAO_PAULO)).toBe(
      '2024-02-29T00:00:00-03:00',
    );
    expect(
      addDaysPreservingSolarisWall('2024-02-28T10:00:00-03:00', 1, SAO_PAULO),
    ).toBe('2024-02-29T10:00:00-03:00');
    expect(getTimeZoneOffsetMinutes(SAO_PAULO, Date.UTC(2026, 9, 15))).toBe(
      -180,
    );
  });

  it('resolves starts of day, week, and month in zone', () => {
    expect(startOfSolarisMonth('2026-10-15', 'UTC')).toBe(
      '2026-10-01T00:00:00+00:00',
    );
    expect(startOfSolarisWeek('2026-10-15', NEW_YORK, 0)).toBe(
      '2026-10-11T00:00:00-04:00',
    );
    expect(startOfSolarisWeek('2026-10-15', NEW_YORK, 1)).toBe(
      '2026-10-12T00:00:00-04:00',
    );
    expect(getWeekdayInZone('2026-10-15T12:00:00-03:00', SAO_PAULO)).toBe(4);
  });

  it('compares and round-trips instants through zones', () => {
    expect(
      compareSolarisDateTimes(
        '2026-10-15T14:30:00-03:00',
        '2026-10-15T17:30:00Z',
      ),
    ).toBe(0);
    expect(
      toSolarisDateTimeValue(Date.UTC(2026, 9, 15, 17, 30), SAO_PAULO),
    ).toBe('2026-10-15T14:30:00-03:00');
    expect(compareSolarisDateTimes('bogus', '2026-10-15T17:30:00Z')).toBeNull();
  });
});
