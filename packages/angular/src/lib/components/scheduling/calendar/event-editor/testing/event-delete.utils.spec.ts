import { describe, expect, it } from 'vitest';

import type { SolarisCalendarEvent } from '../../model/calendar.types';
import { resolveSolarisEventDelete } from '../model/event-delete.utils';

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

const SINGLE: SolarisCalendarEvent = {
  id: 'planning',
  kind: 'event',
  title: 'Sprint planning',
  start: '2026-10-15T10:00:00-03:00',
  end: '2026-10-15T12:00:00-03:00',
  color: 'primary',
};

const ALL_DAY_RECURRING: SolarisCalendarEvent = {
  id: 'holiday-club',
  kind: 'event',
  title: 'Club',
  start: '2026-10-20',
  end: '2026-10-20',
  allDay: true,
  recurrence: { freq: 'weekly', count: 6 },
};

describe('resolveSolarisEventDelete', () => {
  it('removes non-recurring events for every scope', () => {
    for (const scope of ['this', 'following', 'all'] as const) {
      expect(
        resolveSolarisEventDelete(SINGLE, SINGLE.start, scope, ZONE),
      ).toEqual({ action: 'remove' });
    }
  });

  it('removes the whole series when scope is all', () => {
    expect(
      resolveSolarisEventDelete(
        RECURRING,
        '2026-10-22T09:00:00-03:00',
        'all',
        ZONE,
      ),
    ).toEqual({ action: 'remove' });
  });

  it('resolves delete-this to an exDate without mutating the source', () => {
    const source = {
      ...RECURRING,
      recurrenceExceptionDates: ['2026-10-29'],
    };
    Object.freeze(source.recurrenceExceptionDates);
    const resolved = resolveSolarisEventDelete(
      source,
      '2026-10-22T09:00:00-03:00',
      'this',
      ZONE,
    );
    expect(resolved.action).toBe('update');
    if (resolved.action !== 'update') return;
    expect(resolved.event.recurrenceExceptionDates).toEqual([
      '2026-10-22',
      '2026-10-29',
    ]);
    expect(source.recurrenceExceptionDates).toEqual(['2026-10-29']);
    expect(resolved.event).not.toBe(source);
  });

  it('dedupes delete-this when the occurrence is already detached', () => {
    const resolved = resolveSolarisEventDelete(
      { ...RECURRING, recurrenceExceptionDates: ['2026-10-22'] },
      '2026-10-22T09:00:00-03:00',
      'this',
      ZONE,
    );
    expect(resolved.action).toBe('update');
    if (resolved.action !== 'update') return;
    expect(resolved.event.recurrenceExceptionDates).toEqual(['2026-10-22']);
  });

  it('resolves delete-following to until before the occurrence', () => {
    const resolved = resolveSolarisEventDelete(
      RECURRING,
      '2026-10-29T09:00:00-03:00',
      'following',
      ZONE,
    );
    expect(resolved.action).toBe('update');
    if (resolved.action !== 'update') return;
    expect(resolved.event.recurrence?.until).toBeDefined();
    expect(Date.parse(resolved.event.recurrence?.until ?? '')).toBeLessThan(
      Date.parse('2026-10-29T09:00:00-03:00'),
    );
    expect(RECURRING.recurrence?.until).toBeUndefined();
  });

  it('resolves delete-following from the first occurrence to remove', () => {
    expect(
      resolveSolarisEventDelete(RECURRING, RECURRING.start, 'following', ZONE),
    ).toEqual({ action: 'remove' });
  });

  it('resolves date-only delete-following to the previous civil day', () => {
    const resolved = resolveSolarisEventDelete(
      ALL_DAY_RECURRING,
      '2026-10-27',
      'following',
      ZONE,
    );
    expect(resolved.action).toBe('update');
    if (resolved.action !== 'update') return;
    expect(resolved.event.recurrence?.until).toBe('2026-10-26');
  });

  it('resolves date-only delete-following from the anchor to remove', () => {
    expect(
      resolveSolarisEventDelete(
        ALL_DAY_RECURRING,
        '2026-10-20',
        'following',
        ZONE,
      ),
    ).toEqual({ action: 'remove' });
  });

  it('resolves date-only delete-this to an exDate', () => {
    const resolved = resolveSolarisEventDelete(
      ALL_DAY_RECURRING,
      '2026-10-27',
      'this',
      ZONE,
    );
    expect(resolved.action).toBe('update');
    if (resolved.action !== 'update') return;
    expect(resolved.event.recurrenceExceptionDates).toEqual(['2026-10-27']);
  });

  it('removes when the occurrence is missing on a recurring series', () => {
    for (const scope of ['this', 'following'] as const) {
      expect(resolveSolarisEventDelete(RECURRING, null, scope, ZONE)).toEqual({
        action: 'remove',
      });
    }
  });

  it('removes delete-this when the occurrence value is invalid', () => {
    expect(
      resolveSolarisEventDelete(RECURRING, 'not-a-date', 'this', ZONE),
    ).toEqual({ action: 'remove' });
  });

  it('removes delete-following when the occurrence value is invalid', () => {
    expect(
      resolveSolarisEventDelete(RECURRING, 'not-a-date', 'following', ZONE),
    ).toEqual({ action: 'remove' });
  });
});
