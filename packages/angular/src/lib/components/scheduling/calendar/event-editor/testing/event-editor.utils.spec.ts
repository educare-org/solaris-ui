import { describe, expect, it } from 'vitest';

import {
  buildEditorRecurrence,
  defaultEditorWeekday,
  hydrateEditorDates,
  hydrateEditorRecurrence,
  hydrateEditorReminders,
  isEditorFreqValue,
  resolveEditorDraftRange,
  resolveEditorEffectiveFreq,
  resolveTimeZoneChoices,
} from '../model/event-editor.utils';

describe('event-editor utils', () => {
  it('guards frequency values and resolves the effective frequency', () => {
    expect(isEditorFreqValue('custom')).toBe(true);
    expect(isEditorFreqValue('hourly')).toBe(false);
    expect(resolveEditorEffectiveFreq('none', 'weekly')).toBeNull();
    expect(resolveEditorEffectiveFreq('custom', 'weekly')).toBe('weekly');
    expect(resolveEditorEffectiveFreq('daily', 'weekly')).toBe('daily');
  });

  it('derives a weekday default from the civil date', () => {
    expect(defaultEditorWeekday('2026-10-15')).toBe(4);
    expect(defaultEditorWeekday(null)).toBeGreaterThanOrEqual(0);
  });

  it('returns undefined recurrence for the none frequency', () => {
    expect(
      buildEditorRecurrence({
        freq: 'none',
        customFreq: 'daily',
        interval: 3,
        byWeekday: [4],
        endsMode: 'count',
        endsCount: 8,
        endsUntil: null,
        startDate: '2026-10-15',
      }),
    ).toBeUndefined();
  });

  it('builds simple recurrences with implied defaults', () => {
    expect(
      buildEditorRecurrence({
        freq: 'weekly',
        customFreq: 'daily',
        interval: 5,
        byWeekday: [4],
        endsMode: 'count',
        endsCount: 8,
        endsUntil: null,
        startDate: '2026-10-15',
      }),
    ).toEqual({ freq: 'weekly', interval: 1, byWeekday: [4] });
  });

  it('builds custom recurrences with interval, month day and end', () => {
    expect(
      buildEditorRecurrence({
        freq: 'custom',
        customFreq: 'monthly',
        interval: 2,
        byWeekday: [],
        endsMode: 'until',
        endsCount: 4,
        endsUntil: '2026-12-31',
        startDate: '2026-10-15',
      }),
    ).toEqual({
      freq: 'monthly',
      interval: 2,
      monthDay: 15,
      until: '2026-12-31',
    });
  });

  it('resolves all-day and timed draft ranges', () => {
    expect(
      resolveEditorDraftRange({
        allDay: true,
        startDate: '2026-10-20',
        endDate: '2026-10-18',
        startTime: '09:00',
        endTime: '10:00',
        startZone: 'America/Sao_Paulo',
        endZone: 'America/Sao_Paulo',
        fallbackStart: '2026-10-20',
        fallbackEnd: '2026-10-20',
      }),
    ).toEqual({ start: '2026-10-20', end: '2026-10-20' });

    const timed = resolveEditorDraftRange({
      allDay: false,
      startDate: '2026-10-15',
      endDate: '2026-10-15',
      startTime: '09:00',
      endTime: '10:00',
      startZone: 'America/Sao_Paulo',
      endZone: 'Europe/Lisbon',
      fallbackStart: 'x',
      fallbackEnd: 'y',
    });
    expect(timed.end > timed.start).toBe(true);
  });

  it('hydrates reminders with a default and custom flags', () => {
    expect(hydrateEditorReminders(undefined)[0].minutes).toBe(10);
    const rows = hydrateEditorReminders([
      { minutesBefore: 5 },
      { minutesBefore: 42 },
    ]);
    expect(rows.map((row) => row.custom)).toEqual([false, true]);
  });

  it('hydrates dates for all-day and timed events', () => {
    const allDay = hydrateEditorDates(
      { start: '2026-10-20', end: '2026-10-22', allDay: true },
      'America/Sao_Paulo',
      'America/Sao_Paulo',
    );
    expect(allDay).toMatchObject({
      allDay: true,
      startDate: '2026-10-20',
      endDate: '2026-10-22',
    });

    const timed = hydrateEditorDates(
      {
        start: '2026-10-15T10:00:00-03:00',
        end: '2026-10-15T12:00:00-03:00',
      },
      'America/Sao_Paulo',
      'Europe/Lisbon',
    );
    expect(timed.allDay).toBe(false);
    expect(timed.startTime).toBe('10:00');
    expect(timed.endTime).toBe('16:00');
  });

  it('resolves time-zone choices with the current zone included', () => {
    const choices = resolveTimeZoneChoices(
      ['Europe/Lisbon'],
      ['America/Sao_Paulo'],
      'UTC',
    );
    expect(choices.map((choice) => choice.zone)).toEqual([
      'UTC',
      'Europe/Lisbon',
    ]);
    expect(choices[0].label).toContain('UTC');
  });

  it('hydrates simple and complex recurrences', () => {
    expect(hydrateEditorRecurrence(undefined, 'UTC').freq).toBe('none');
    const simple = hydrateEditorRecurrence(
      { freq: 'weekly', byWeekday: [4] },
      'UTC',
    );
    expect(simple).toMatchObject({ freq: 'weekly', endsMode: 'never' });
    const complex = hydrateEditorRecurrence(
      { freq: 'weekly', interval: 2, count: 8 },
      'UTC',
    );
    expect(complex).toMatchObject({
      freq: 'custom',
      customFreq: 'weekly',
      interval: 2,
      endsMode: 'count',
      endsCount: 8,
    });
  });

  it('hydrates datetime until values through the display zone', () => {
    const state = hydrateEditorRecurrence(
      { freq: 'daily', until: '2026-12-31T10:00:00-03:00' },
      'America/Sao_Paulo',
    );
    expect(state).toMatchObject({ freq: 'custom', endsMode: 'until' });
    expect(state.endsUntil).toContain('2026-12-31');
  });
});
