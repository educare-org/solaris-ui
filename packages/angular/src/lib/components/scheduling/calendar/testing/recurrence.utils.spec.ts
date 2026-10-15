import { describe, expect, it } from 'vitest';

import type { ExpandSolarisRecurrenceOptions } from '../model/recurrence.utils';
import { expandSolarisRecurrence } from '../model/recurrence.utils';

const SAO_PAULO = 'America/Sao_Paulo';
const NEW_YORK = 'America/New_York';

function base(
  overrides: Partial<ExpandSolarisRecurrenceOptions> = {},
): ExpandSolarisRecurrenceOptions {
  return {
    start: '2026-10-15T09:00:00-03:00',
    end: '2026-10-15T10:00:00-03:00',
    recurrence: { freq: 'daily', count: 3 },
    timeZone: SAO_PAULO,
    rangeStart: '2026-10-01T00:00:00-03:00',
    rangeEnd: '2026-11-01T00:00:00-03:00',
    ...overrides,
  };
}

describe('Solaris recurrence expansion', () => {
  it('expands a daily series preserving duration', () => {
    expect(expandSolarisRecurrence(base())).toEqual([
      { start: '2026-10-15T09:00:00-03:00', end: '2026-10-15T10:00:00-03:00' },
      { start: '2026-10-16T09:00:00-03:00', end: '2026-10-16T10:00:00-03:00' },
      { start: '2026-10-17T09:00:00-03:00', end: '2026-10-17T10:00:00-03:00' },
    ]);
  });

  it('treats count and until as equivalent bounds', () => {
    const byCount = expandSolarisRecurrence(base());
    const byUntilDate = expandSolarisRecurrence(
      base({ recurrence: { freq: 'daily', until: '2026-10-17' } }),
    );
    const byUntilInstant = expandSolarisRecurrence(
      base({
        recurrence: { freq: 'daily', until: '2026-10-17T09:00:00-03:00' },
      }),
    );
    expect(byUntilDate).toEqual(byCount);
    expect(byUntilInstant).toEqual(byCount);
  });

  it('expands weekly byWeekday across week boundaries', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        start: '2026-10-12T09:00:00-03:00',
        end: '2026-10-12T09:30:00-03:00',
        recurrence: { freq: 'weekly', byWeekday: [1, 3], count: 4 },
      }),
    );
    expect(occurrences.map((item) => item.start)).toEqual([
      '2026-10-12T09:00:00-03:00',
      '2026-10-14T09:00:00-03:00',
      '2026-10-19T09:00:00-03:00',
      '2026-10-21T09:00:00-03:00',
    ]);
  });

  it('skips months missing monthDay without consuming count', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        start: '2026-01-31T10:00:00Z',
        end: '2026-01-31T11:00:00Z',
        recurrence: { freq: 'monthly', monthDay: 31, count: 3 },
        timeZone: 'UTC',
        rangeStart: '2026-01-01T00:00:00Z',
        rangeEnd: '2026-07-01T00:00:00Z',
      }),
    );
    expect(occurrences.map((item) => item.start)).toEqual([
      '2026-01-31T10:00:00+00:00',
      '2026-03-31T10:00:00+00:00',
      '2026-05-31T10:00:00+00:00',
    ]);
  });

  it('expands yearly leap-day birthdays only on leap years', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        start: '2024-02-29T10:00:00-03:00',
        end: '2024-02-29T11:00:00-03:00',
        recurrence: { freq: 'yearly', count: 3 },
        rangeStart: '2024-01-01T00:00:00-03:00',
        rangeEnd: '2035-01-01T00:00:00-03:00',
      }),
    );
    expect(occurrences.map((item) => item.start)).toEqual([
      '2024-02-29T10:00:00-03:00',
      '2028-02-29T10:00:00-03:00',
      '2032-02-29T10:00:00-03:00',
    ]);
  });

  it('removes detached dates after count is applied', () => {
    const occurrences = expandSolarisRecurrence(
      base({ exceptionDates: ['2026-10-16'] }),
    );
    expect(occurrences.map((item) => item.start)).toEqual([
      '2026-10-15T09:00:00-03:00',
      '2026-10-17T09:00:00-03:00',
    ]);
  });

  it('applies single-occurrence overrides and cancellations', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        overrides: [
          { date: '2026-10-16', cancelled: true },
          {
            date: '2026-10-17',
            start: '2026-10-17T11:00:00-03:00',
            end: '2026-10-17T12:00:00-03:00',
          },
        ],
      }),
    );
    expect(occurrences).toEqual([
      { start: '2026-10-15T09:00:00-03:00', end: '2026-10-15T10:00:00-03:00' },
      {
        start: '2026-10-17T11:00:00-03:00',
        end: '2026-10-17T12:00:00-03:00',
        overriddenFrom: '2026-10-17T09:00:00-03:00',
      },
    ]);
  });

  it('keeps 09:00 wall time across the New York spring forward', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        start: '2026-03-06T09:00:00-05:00',
        end: '2026-03-06T10:00:00-05:00',
        recurrence: { freq: 'daily', count: 4 },
        timeZone: NEW_YORK,
        rangeStart: '2026-03-01T00:00:00-05:00',
        rangeEnd: '2026-04-01T00:00:00-04:00',
      }),
    );
    expect(occurrences.map((item) => item.start)).toEqual([
      '2026-03-06T09:00:00-05:00',
      '2026-03-07T09:00:00-05:00',
      '2026-03-08T09:00:00-04:00',
      '2026-03-09T09:00:00-04:00',
    ]);
  });

  it('keeps 09:00 wall time across the New York fall back', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        start: '2026-10-30T09:00:00-04:00',
        end: '2026-10-30T10:00:00-04:00',
        recurrence: { freq: 'daily', count: 4 },
        timeZone: NEW_YORK,
        rangeStart: '2026-10-01T00:00:00-04:00',
        rangeEnd: '2026-12-01T00:00:00-05:00',
      }),
    );
    expect(occurrences.map((item) => item.start)).toEqual([
      '2026-10-30T09:00:00-04:00',
      '2026-10-31T09:00:00-04:00',
      '2026-11-01T09:00:00-05:00',
      '2026-11-02T09:00:00-05:00',
    ]);
  });

  it('expands date-only series as date-only occurrences', () => {
    const occurrences = expandSolarisRecurrence(
      base({
        start: '2026-10-15',
        end: undefined,
        recurrence: { freq: 'daily', count: 3 },
      }),
    );
    expect(occurrences).toEqual([
      { start: '2026-10-15', end: '2026-10-15' },
      { start: '2026-10-16', end: '2026-10-16' },
      { start: '2026-10-17', end: '2026-10-17' },
    ]);
  });

  it('rejects invalid series input fail-fast', () => {
    expect(() => expandSolarisRecurrence(base({ start: 'bogus' }))).toThrow();
    expect(() =>
      expandSolarisRecurrence(
        base({
          rangeStart: '2026-11-01T00:00:00-03:00',
          rangeEnd: '2026-10-01T00:00:00-03:00',
        }),
      ),
    ).toThrow();
    expect(() =>
      expandSolarisRecurrence(
        base({ recurrence: { freq: 'daily', count: 0 } }),
      ),
    ).toThrow();
  });

  it('expands 10k daily occurrences within the DoD budget', () => {
    const started = performance.now();
    const occurrences = expandSolarisRecurrence(
      base({
        recurrence: { freq: 'daily', count: 10_000 },
        rangeStart: '2026-01-01T00:00:00-03:00',
        rangeEnd: '2060-01-01T00:00:00-03:00',
      }),
    );
    const elapsed = performance.now() - started;
    expect(occurrences).toHaveLength(10_000);
    expect(occurrences[9_999].start.slice(0, 10)).toBe('2054-03-01');
    expect(elapsed).toBeLessThan(50);
  });
});
