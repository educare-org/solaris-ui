import { describe, expect, it } from 'vitest';

import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { resolveSolarisEventSave } from '../model/event-save.utils';

const ZONE = 'America/Sao_Paulo';

const RECURRING: SolarisCalendarEvent = {
  id: 'standup',
  kind: 'event',
  title: 'Team standup',
  start: '2026-10-15T09:00:00-03:00',
  end: '2026-10-15T09:30:00-03:00',
  color: 'info',
  recurrence: { freq: 'weekly', byWeekday: [4], count: 8 },
};

const ALL_DAY_RECURRING: SolarisCalendarEvent = {
  id: 'club',
  kind: 'event',
  title: 'Club',
  start: '2026-10-20',
  end: '2026-10-22',
  allDay: true,
  recurrence: { freq: 'weekly', count: 6 },
};

const SINGLE: SolarisCalendarEvent = {
  id: 'planning',
  kind: 'event',
  title: 'Sprint planning',
  start: '2026-10-15T10:00:00-03:00',
  end: '2026-10-15T12:00:00-03:00',
  color: 'primary',
};

function frozen<T extends object>(value: T): T {
  Object.freeze(value);
  for (const entry of Object.values(value)) {
    if (
      entry !== null &&
      typeof entry === 'object' &&
      !Object.isFrozen(entry)
    ) {
      Object.freeze(entry);
    }
  }
  return value;
}

describe('resolveSolarisEventSave', () => {
  it('returns the draft as-is for non-recurring events', () => {
    const draft = { ...SINGLE, title: 'Renamed' };
    const resolved = resolveSolarisEventSave(
      SINGLE,
      SINGLE.start,
      draft,
      'this',
      ZONE,
    );
    expect(resolved).not.toBeNull();
    expect(resolved).toHaveLength(1);
    expect(resolved?.[0].title).toBe('Renamed');
    expect(resolved?.[0]).not.toBe(draft);
    expect(draft.title).toBe('Renamed');
  });

  it('returns the draft as-is for scope all on a recurring series', () => {
    const draft = { ...RECURRING, title: 'Whole series renamed' };
    const resolved = resolveSolarisEventSave(
      RECURRING,
      '2026-10-22T09:00:00-03:00',
      draft,
      'all',
      ZONE,
    );
    expect(resolved).toHaveLength(1);
    expect(resolved?.[0].title).toBe('Whole series renamed');
    expect(resolved?.[0].id).toBe(RECURRING.id);
    expect(resolved?.[0].recurrence).toEqual(RECURRING.recurrence);
  });

  it('splits a timed this-save into series plus detached single', () => {
    const draft = { ...RECURRING, title: 'Edited once' };
    const resolved = resolveSolarisEventSave(
      RECURRING,
      '2026-10-22T09:00:00-03:00',
      draft,
      'this',
      ZONE,
    );
    expect(resolved).toHaveLength(2);
    const [series, detached] = resolved ?? [];
    expect(series.recurrenceExceptionDates).toEqual(['2026-10-22']);
    expect(series.id).toBe(RECURRING.id);
    expect(detached.id).toBe('standup--2026-10-22');
    expect(detached.title).toBe('Edited once');
    expect(detached.recurrence).toBeUndefined();
    expect(detached.recurrenceExceptionDates).toBeUndefined();
    expect(detached.start).toContain('2026-10-22T09:00');
    expect(detached.end).toContain('2026-10-22T09:30');
  });

  it('dedupes this-save when the occurrence already has an exDate', () => {
    const source = { ...RECURRING, recurrenceExceptionDates: ['2026-10-22'] };
    const resolved = resolveSolarisEventSave(
      source,
      '2026-10-22T09:00:00-03:00',
      { ...RECURRING, title: 'Again' },
      'this',
      ZONE,
    );
    expect(resolved?.[0].recurrenceExceptionDates).toEqual(['2026-10-22']);
    expect(resolved).toHaveLength(2);
  });

  it('splits an all-day this-save onto the occurrence civil date', () => {
    const draft = { ...ALL_DAY_RECURRING, title: 'One club day' };
    const resolved = resolveSolarisEventSave(
      ALL_DAY_RECURRING,
      '2026-10-27',
      draft,
      'this',
      ZONE,
    );
    expect(resolved).toHaveLength(2);
    expect(resolved?.[0].recurrenceExceptionDates).toEqual(['2026-10-27']);
    expect(resolved?.[1].id).toBe('club--2026-10-27');
    expect(resolved?.[1].start).toBe('2026-10-27');
    expect(resolved?.[1].end).toBe('2026-10-29');
    expect(resolved?.[1].recurrence).toBeUndefined();
  });

  it('truncates a timed following-save via until one minute before', () => {
    const draft = { ...RECURRING, title: 'New direction' };
    const resolved = resolveSolarisEventSave(
      RECURRING,
      '2026-10-29T09:00:00-03:00',
      draft,
      'following',
      ZONE,
    );
    expect(resolved).toHaveLength(2);
    const [truncated, following] = resolved ?? [];
    expect(truncated.recurrence?.until).toBeDefined();
    expect(Date.parse(truncated.recurrence?.until ?? '')).toBeLessThan(
      Date.parse('2026-10-29T09:00:00-03:00'),
    );
    expect(following.id).toBe('standup--following-2026-10-29');
    expect(following.title).toBe('New direction');
    expect(following.start).toContain('2026-10-29T09:00');
  });

  it('returns only the following part when splitting from the first timed occurrence', () => {
    const resolved = resolveSolarisEventSave(
      RECURRING,
      RECURRING.start,
      { ...RECURRING, title: 'From start' },
      'following',
      ZONE,
    );
    expect(resolved).toHaveLength(1);
    expect(resolved?.[0].id).toContain('--following-');
  });

  it('truncates an all-day following-save to the previous civil day', () => {
    const resolved = resolveSolarisEventSave(
      ALL_DAY_RECURRING,
      '2026-10-27',
      { ...ALL_DAY_RECURRING, title: 'Rest of club' },
      'following',
      ZONE,
    );
    expect(resolved).toHaveLength(2);
    expect(resolved?.[0].recurrence?.until).toBe('2026-10-26');
    expect(resolved?.[1].start).toBe('2026-10-27');
  });

  it('returns only the following part from the all-day anchor', () => {
    const resolved = resolveSolarisEventSave(
      ALL_DAY_RECURRING,
      '2026-10-20',
      { ...ALL_DAY_RECURRING, title: 'Restart' },
      'following',
      ZONE,
    );
    expect(resolved).toHaveLength(1);
    expect(resolved?.[0].id).toContain('--following-');
  });

  it('never mutates frozen inputs', () => {
    const source: SolarisCalendarEvent = frozen({
      ...RECURRING,
      recurrence: frozen({ freq: 'weekly', byWeekday: [4], count: 8 }),
      recurrenceExceptionDates: Object.freeze(['2026-10-29']),
    } as SolarisCalendarEvent);
    const draft: SolarisCalendarEvent = frozen({
      ...RECURRING,
      recurrence: frozen({ freq: 'weekly', byWeekday: [4], count: 8 }),
    } as SolarisCalendarEvent);
    const resolved = resolveSolarisEventSave(
      source,
      '2026-10-22T09:00:00-03:00',
      draft,
      'this',
      ZONE,
    );
    expect(resolved).toHaveLength(2);
    expect(source.recurrenceExceptionDates).toEqual(['2026-10-29']);
  });

  it('returns null for invalid inputs without throwing', () => {
    expect(
      resolveSolarisEventSave(
        null as unknown as SolarisCalendarEvent,
        '2026-10-22T09:00:00-03:00',
        RECURRING,
        'this',
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        null as unknown as SolarisCalendarEvent,
        'this',
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(RECURRING, null, RECURRING, 'this', ZONE),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(RECURRING, 'not-a-date', RECURRING, 'this', ZONE),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        RECURRING,
        'bogus' as never,
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        { ...RECURRING, id: '' },
        '2026-10-22T09:00:00-03:00',
        RECURRING,
        'this',
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        { ...RECURRING, id: '' },
        'this',
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(RECURRING, '', RECURRING, 'this', ZONE),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        RECURRING,
        'this',
        '',
      ),
    ).toBeNull();
  });

  it('returns null for non-string draft ranges without throwing', () => {
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        { ...RECURRING, start: 42 as never, end: 42 as never },
        'this',
        ZONE,
      ),
    ).toBeNull();
  });

  it('returns null for invalid draft ranges without throwing', () => {
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        {
          ...RECURRING,
          start: '2026-10-22T10:00:00-03:00',
          end: '2026-10-22T09:00:00-03:00',
        },
        'this',
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        { ...RECURRING, start: 'nope', end: 'also-nope' },
        'following',
        ZONE,
      ),
    ).toBeNull();
    expect(
      resolveSolarisEventSave(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        RECURRING,
        'this',
        'Invalid/Zone',
      ),
    ).toBeNull();
  });
});
