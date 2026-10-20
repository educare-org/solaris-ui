import { describe, expect, it } from 'vitest';

import { expandSolarisRecurrence } from '../model/recurrence.utils';
import {
  searchSolarisCalendar,
  inspectSolarisCalendar,
} from '../model/calendar-search.utils';
import {
  findSolarisConflicts,
  isSolarisFree,
  filterSolarisByCalendars,
} from '../model/calendar-availability.utils';
import {
  exportSolarisToIcs,
  parseSolarisFromIcs,
} from '../model/calendar-ics.utils';
import {
  getSolarisDueReminders,
  nextSolarisReminderMs,
} from '../model/calendar-reminders.utils';
import {
  mergeSolarisHolidays,
  withAsyncHolidays,
  clearSolarisHolidayCache,
  fetchSolarisHolidays,
} from '../holidays/model/holiday-async.utils';
import { builtInHolidays } from '../holidays/builtin/built-in-holidays';
import type { SolarisCalendarEvent } from '../model/calendar.types';

const event = (
  overrides: Partial<SolarisCalendarEvent> = {},
): SolarisCalendarEvent => ({
  id: 'e1',
  kind: 'event',
  title: 'Standup',
  start: '2026-10-20T09:00:00-03:00',
  end: '2026-10-20T09:30:00-03:00',
  ...overrides,
});

describe('calendar extensions', () => {
  it('expands monthly nth weekday via bySetPos', () => {
    const occurrences = expandSolarisRecurrence({
      start: '2026-10-01T09:00:00-03:00',
      end: '2026-10-01T10:00:00-03:00',
      recurrence: { freq: 'monthly', byWeekday: [2], bySetPos: [3] },
      timeZone: 'America/Sao_Paulo',
      rangeStart: '2026-10-01',
      rangeEnd: '2026-12-31',
    });
    expect(occurrences.length).toBeGreaterThan(0);
    expect(occurrences[0].start.slice(0, 10)).toBe('2026-10-20');
  });

  it('expands byMonthDay list', () => {
    const occurrences = expandSolarisRecurrence({
      start: '2026-01-01',
      end: '2026-01-01',
      recurrence: { freq: 'monthly', byMonthDay: [1, 15] },
      timeZone: 'UTC',
      rangeStart: '2026-01-01',
      rangeEnd: '2026-02-01',
    });
    expect(occurrences.map((item) => item.start)).toEqual([
      '2026-01-01',
      '2026-01-15',
    ]);
  });

  it('searches with diacritics and limits results', () => {
    const hits = searchSolarisCalendar(
      [event({ title: 'Reunião de planejamento' })],
      [
        {
          id: 't1',
          kind: 'task',
          title: 'Comprar café',
          due: '2026-10-21',
          completed: false,
        },
      ],
      'reuniao',
    );
    expect(hits).toHaveLength(1);
    expect(inspectSolarisCalendar([event()], []).totalEvents).toBe(1);
  });

  it('detects room conflicts and free slots', () => {
    const room = event({ id: 'r1', resources: ['room-a'] });
    const candidate = event({
      id: 'r2',
      start: '2026-10-20T09:15:00-03:00',
      end: '2026-10-20T10:00:00-03:00',
      resources: ['room-a'],
    });
    expect(
      findSolarisConflicts([room], candidate, { resourceId: 'room-a' }),
    ).toHaveLength(1);
    expect(
      isSolarisFree([room], {
        start: '2026-10-20T10:00:00-03:00',
        end: '2026-10-20T11:00:00-03:00',
      }),
    ).toBe(true);
    expect(
      filterSolarisByCalendars(
        [event({ calendarId: 'work' }), event({})],
        ['work'],
      ).map((item) => item.id),
    ).toEqual(['e1', 'e1']);
  });

  it('round-trips ICS with RRULE BYSETPOS', () => {
    const ics = exportSolarisToIcs([
      event({
        id: 'x',
        recurrence: { freq: 'monthly', byWeekday: [2], bySetPos: [3] },
      }),
    ]);
    expect(ics).toContain('BYSETPOS=3');
    const parsed = parseSolarisFromIcs(ics);
    expect(parsed[0].recurrence?.bySetPos).toEqual([3]);
  });

  it('computes due and next reminders', () => {
    const startMs = Date.parse('2026-10-20T09:00:00-03:00');
    const timed = event({ reminders: [{ minutesBefore: 10 }] });
    const due = getSolarisDueReminders([timed], startMs - 10 * 60_000);
    expect(due).toHaveLength(1);
    expect(nextSolarisReminderMs([timed], startMs - 60_000 * 60)).toBe(
      startMs - 10 * 60_000,
    );
  });

  it('merges municipal holidays and supports async provider', async () => {
    clearSolarisHolidayCache();
    const merged = mergeSolarisHolidays(
      [{ date: '2026-01-01', name: 'Ano Novo' }],
      [
        { date: '2026-01-01', name: 'Ano Novo' },
        { date: '2026-01-20', name: 'São Sebastião' },
      ],
    );
    expect(merged.map((item) => item.date)).toEqual([
      '2026-01-01',
      '2026-01-20',
    ]);
    const provider = withAsyncHolidays(builtInHolidays(), async () => [
      { date: '2026-01-20', name: 'Local' },
    ]);
    const asyncHolidays = await provider.holidaysAsync?.(
      { start: '2026-01-01', end: '2026-01-31' },
      'pt-BR',
    );
    expect(asyncHolidays?.some((item) => item.date === '2026-01-20')).toBe(
      true,
    );
    const fetched = await fetchSolarisHolidays(
      'https://erp.test/holidays',
      { start: '2026-01-01', end: '2026-01-31' },
      'pt-BR',
      async () => [{ date: '2026-01-20', name: 'Local' }],
    );
    expect(fetched).toHaveLength(1);
  });
});
