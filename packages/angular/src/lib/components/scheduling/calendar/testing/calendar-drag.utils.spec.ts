import { describe, expect, it } from 'vitest';

import type { SolarisCalendarEvent } from '../model/calendar.types';
import {
  buildMonthCreateProposal,
  buildMonthMoveProposal,
  buildWeekCreateProposal,
  buildWeekMoveProposal,
  buildWeekResizeProposal,
  diffSolarisCivilDays,
  normalizeDragSnapStep,
  resolveDragOccurrenceScope,
  snapMinutesToStep,
  SOLARIS_CALENDAR_DRAG_DEFAULT_STEP,
} from '../model/calendar-drag.utils';

const TIME_ZONE = 'America/Sao_Paulo';

const TIMED: SolarisCalendarEvent = {
  id: 'standup',
  kind: 'event',
  title: 'Team standup',
  start: '2026-10-15T09:00:00-03:00',
  end: '2026-10-15T09:30:00-03:00',
  color: 'info',
};

const ALL_DAY: SolarisCalendarEvent = {
  id: 'offsite',
  kind: 'event',
  title: 'Design offsite',
  start: '2026-10-20',
  end: '2026-10-22',
  allDay: true,
  color: 'accent',
};

const RECURRING: SolarisCalendarEvent = {
  ...TIMED,
  id: 'weekly',
  recurrence: { freq: 'weekly', count: 4 },
};

describe('calendar-drag.utils', () => {
  it('normalizes snap steps into a safe range', () => {
    expect(normalizeDragSnapStep(15)).toBe(15);
    expect(normalizeDragSnapStep(7.6)).toBe(8);
    expect(normalizeDragSnapStep(0)).toBe(5);
    expect(normalizeDragSnapStep(500)).toBe(120);
    expect(normalizeDragSnapStep(Number.NaN)).toBe(
      SOLARIS_CALENDAR_DRAG_DEFAULT_STEP,
    );
    expect(normalizeDragSnapStep(undefined)).toBe(
      SOLARIS_CALENDAR_DRAG_DEFAULT_STEP,
    );
  });

  it('snaps minutes to the step without going below it', () => {
    expect(snapMinutesToStep(562, 30)).toBe(570);
    expect(snapMinutesToStep(554, 30)).toBe(540);
    expect(snapMinutesToStep(1439, 30)).toBe(1440);
    expect(snapMinutesToStep(Number.NaN, 30)).toBe(0);
  });

  it('resolves occurrence scope for single and recurring events', () => {
    expect(resolveDragOccurrenceScope(TIMED)).toBe('single');
    expect(resolveDragOccurrenceScope(RECURRING)).toBe('occurrence');
  });

  it('diffs civil days across month boundaries', () => {
    expect(diffSolarisCivilDays('2026-10-15', '2026-10-16')).toBe(1);
    expect(diffSolarisCivilDays('2026-10-16', '2026-10-15')).toBe(-1);
    expect(diffSolarisCivilDays('2026-09-30', '2026-10-01')).toBe(1);
    expect(diffSolarisCivilDays('broken', '2026-10-01')).toBeNull();
  });

  it('builds inclusive all-day month create ranges in either direction', () => {
    expect(buildMonthCreateProposal('2026-10-15', '2026-10-17')).toEqual({
      start: '2026-10-15',
      end: '2026-10-17',
      allDay: true,
    });
    expect(buildMonthCreateProposal('2026-10-17', '2026-10-15')).toEqual({
      start: '2026-10-15',
      end: '2026-10-17',
      allDay: true,
    });
    expect(buildMonthCreateProposal('2026-10-15', '2026-10-15')).toEqual({
      start: '2026-10-15',
      end: '2026-10-15',
      allDay: true,
    });
    expect(buildMonthCreateProposal('broken', '2026-10-15')).toBeNull();
  });

  it('moves timed month occurrences preserving wall time', () => {
    const proposal = buildMonthMoveProposal({
      event: TIMED,
      occurrenceStart: TIMED.start,
      targetDate: '2026-10-16',
      timeZone: TIME_ZONE,
    });
    expect(proposal).not.toBeNull();
    expect(proposal?.id).toBe('standup');
    expect(proposal?.occurrenceStart).toBe(TIMED.start);
    expect(proposal?.occurrenceScope).toBe('single');
    expect(proposal?.start).toBe('2026-10-16T09:00:00-03:00');
    expect(proposal?.end).toBe('2026-10-16T09:30:00-03:00');
  });

  it('moves all-day month spans by whole days', () => {
    const proposal = buildMonthMoveProposal({
      event: ALL_DAY,
      occurrenceStart: '2026-10-20',
      targetDate: '2026-10-21',
      timeZone: TIME_ZONE,
    });
    expect(proposal?.start).toBe('2026-10-21');
    expect(proposal?.end).toBe('2026-10-23');
    expect(proposal?.occurrenceScope).toBe('single');
  });

  it('moves recurring occurrences as single instances', () => {
    const proposal = buildMonthMoveProposal({
      event: RECURRING,
      occurrenceStart: '2026-10-22T09:00:00-03:00',
      targetDate: '2026-10-23',
      timeZone: TIME_ZONE,
    });
    expect(proposal?.occurrenceScope).toBe('occurrence');
    expect(proposal?.occurrenceStart).toBe('2026-10-22T09:00:00-03:00');
    expect(proposal?.start).toBe('2026-10-23T09:00:00-03:00');
  });

  it('shifts multi-day spans from the grabbed day', () => {
    const proposal = buildMonthMoveProposal({
      event: ALL_DAY,
      occurrenceStart: '2026-10-20',
      targetDate: '2026-10-25',
      originDate: '2026-10-21',
      timeZone: TIME_ZONE,
    });
    expect(proposal?.start).toBe('2026-10-24');
    expect(proposal?.end).toBe('2026-10-26');
  });

  it('rejects no-op and invalid month moves', () => {
    expect(
      buildMonthMoveProposal({
        event: TIMED,
        occurrenceStart: TIMED.start,
        targetDate: '2026-10-15',
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
    expect(
      buildMonthMoveProposal({
        event: TIMED,
        occurrenceStart: 'not-a-date',
        targetDate: '2026-10-16',
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
  });

  it('builds snapped week create proposals with a minimum span', () => {
    const proposal = buildWeekCreateProposal({
      anchorDate: '2026-10-15',
      anchorMinutes: 570,
      currentDate: '2026-10-15',
      currentMinutes: 570,
      stepMinutes: 30,
      timeZone: TIME_ZONE,
    });
    expect(proposal?.allDay).toBe(false);
    expect(proposal?.start).toBe('2026-10-15T09:30:00-03:00');
    expect(proposal?.end).toBe('2026-10-15T10:00:00-03:00');
  });

  it('builds overnight week create ranges in either direction', () => {
    const forward = buildWeekCreateProposal({
      anchorDate: '2026-10-15',
      anchorMinutes: 1380,
      currentDate: '2026-10-16',
      currentMinutes: 60,
      stepMinutes: 30,
      timeZone: TIME_ZONE,
    });
    expect(forward?.start).toBe('2026-10-15T23:00:00-03:00');
    expect(forward?.end).toBe('2026-10-16T01:00:00-03:00');
    const backward = buildWeekCreateProposal({
      anchorDate: '2026-10-16',
      anchorMinutes: 60,
      currentDate: '2026-10-15',
      currentMinutes: 1380,
      stepMinutes: 30,
      timeZone: TIME_ZONE,
    });
    expect(backward).toEqual(forward);
    expect(
      buildWeekCreateProposal({
        anchorDate: 'broken',
        anchorMinutes: 60,
        currentDate: '2026-10-15',
        currentMinutes: 120,
        stepMinutes: 30,
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
  });

  it('moves week occurrences preserving duration in instant math', () => {
    const proposal = buildWeekMoveProposal({
      event: TIMED,
      occurrenceStart: TIMED.start,
      occurrenceEnd: TIMED.end,
      dayDelta: 1,
      minuteDelta: 30,
      timeZone: TIME_ZONE,
    });
    expect(proposal?.start).toBe('2026-10-16T09:30:00-03:00');
    expect(proposal?.end).toBe('2026-10-16T10:00:00-03:00');
    expect(proposal?.occurrenceScope).toBe('single');
  });

  it('rejects no-op and inverted week moves', () => {
    expect(
      buildWeekMoveProposal({
        event: TIMED,
        occurrenceStart: TIMED.start,
        occurrenceEnd: TIMED.end,
        dayDelta: 0,
        minuteDelta: 0,
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
    expect(
      buildWeekMoveProposal({
        event: TIMED,
        occurrenceStart: TIMED.end,
        occurrenceEnd: TIMED.start,
        dayDelta: 1,
        minuteDelta: 0,
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
  });

  it('resizes either edge enforcing the minimum span', () => {
    const grow = buildWeekResizeProposal({
      event: TIMED,
      occurrenceStart: TIMED.start,
      occurrenceEnd: TIMED.end,
      edge: 'end',
      minuteDelta: 30,
      minMinutes: 30,
      timeZone: TIME_ZONE,
    });
    expect(grow?.start).toBe(TIMED.start);
    expect(grow?.end).toBe('2026-10-15T10:00:00-03:00');
    const shrinkStart = buildWeekResizeProposal({
      event: TIMED,
      occurrenceStart: TIMED.start,
      occurrenceEnd: TIMED.end,
      edge: 'start',
      minuteDelta: 15,
      minMinutes: 15,
      timeZone: TIME_ZONE,
    });
    expect(shrinkStart?.start).toBe('2026-10-15T09:15:00-03:00');
    expect(
      buildWeekResizeProposal({
        event: TIMED,
        occurrenceStart: TIMED.start,
        occurrenceEnd: TIMED.end,
        edge: 'end',
        minuteDelta: -15,
        minMinutes: 30,
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
    expect(
      buildWeekResizeProposal({
        event: TIMED,
        occurrenceStart: TIMED.start,
        occurrenceEnd: TIMED.end,
        edge: 'start',
        minuteDelta: 0,
        minMinutes: 30,
        timeZone: TIME_ZONE,
      }),
    ).toBeNull();
  });

  it('resizes the end edge by whole days', () => {
    const proposal = buildWeekResizeProposal({
      event: TIMED,
      occurrenceStart: TIMED.start,
      occurrenceEnd: TIMED.end,
      edge: 'end',
      minuteDelta: 0,
      dayDelta: 1,
      minMinutes: 30,
      timeZone: TIME_ZONE,
    });
    expect(proposal?.start).toBe(TIMED.start);
    expect(proposal?.end).toBe('2026-10-16T09:30:00-03:00');
  });

  it('keeps proposals DST-safe across a spring-forward boundary', () => {
    const zone = 'America/New_York';
    const before = buildWeekMoveProposal({
      event: {
        id: 'dst',
        kind: 'event',
        title: 'DST check',
        start: '2026-03-07T09:00:00-05:00',
        end: '2026-03-07T10:00:00-05:00',
      },
      occurrenceStart: '2026-03-07T09:00:00-05:00',
      occurrenceEnd: '2026-03-07T10:00:00-05:00',
      dayDelta: 1,
      minuteDelta: 0,
      timeZone: zone,
    });
    expect(before?.start).toBe('2026-03-08T09:00:00-04:00');
    expect(before?.end).toBe('2026-03-08T10:00:00-04:00');
  });

  it('never mutates frozen consumer arrays while proposing', () => {
    const events = Object.freeze([Object.freeze({ ...TIMED })]);
    const snapshot = JSON.stringify(events);
    buildMonthMoveProposal({
      event: events[0],
      occurrenceStart: TIMED.start,
      targetDate: '2026-10-16',
      timeZone: TIME_ZONE,
    });
    buildWeekMoveProposal({
      event: events[0],
      occurrenceStart: TIMED.start,
      occurrenceEnd: TIMED.end,
      dayDelta: 1,
      minuteDelta: 0,
      timeZone: TIME_ZONE,
    });
    buildWeekResizeProposal({
      event: events[0],
      occurrenceStart: TIMED.start,
      occurrenceEnd: TIMED.end,
      edge: 'end',
      minuteDelta: 30,
      minMinutes: 30,
      timeZone: TIME_ZONE,
    });
    expect(JSON.stringify(events)).toBe(snapshot);
    expect(Object.isFrozen(events)).toBe(true);
  });
});
