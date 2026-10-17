import type { SolarisCalendarEvent, SolarisRecurrence } from './calendar.types';
import type {
  SolarisCalendarDragOccurrenceScope,
  SolarisCalendarEventCreateProposal,
  SolarisCalendarEventMoveProposal,
  SolarisCalendarEventResizeProposal,
  SolarisMonthMoveArgs,
  SolarisWeekCreateArgs,
  SolarisWeekMoveArgs,
  SolarisWeekResizeArgs,
} from './calendar-drag.types';
import {
  addDaysPreservingSolarisWall,
  addDaysToSolarisDate,
  addMinutesToSolarisDateTime,
  diffSolarisDateTimeMinutes,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  toSolarisDateInZone,
  toSolarisDateTimeValue,
} from './calendar-datetime.utils';

export const SOLARIS_CALENDAR_DRAG_DEFAULT_STEP = 30;
export const SOLARIS_CALENDAR_DRAG_MIN_STEP = 5;
export const SOLARIS_CALENDAR_DRAG_MAX_STEP = 120;
export const SOLARIS_DAY_MINUTES = 1_440;

export function normalizeDragSnapStep(step: unknown): number {
  if (typeof step !== 'number' || !Number.isFinite(step)) {
    return SOLARIS_CALENDAR_DRAG_DEFAULT_STEP;
  }
  const rounded = Math.round(step);
  if (rounded < SOLARIS_CALENDAR_DRAG_MIN_STEP) {
    return SOLARIS_CALENDAR_DRAG_MIN_STEP;
  }
  if (rounded > SOLARIS_CALENDAR_DRAG_MAX_STEP) {
    return SOLARIS_CALENDAR_DRAG_MAX_STEP;
  }
  return rounded;
}

export function snapMinutesToStep(minutes: number, step: number): number {
  const safeStep = normalizeDragSnapStep(step);
  if (!Number.isFinite(minutes)) return 0;
  const clamped = Math.min(
    SOLARIS_DAY_MINUTES,
    Math.max(0, Math.round(minutes)),
  );
  if (clamped >= SOLARIS_DAY_MINUTES) return SOLARIS_DAY_MINUTES;
  return Math.min(
    SOLARIS_DAY_MINUTES,
    Math.round(clamped / safeStep) * safeStep,
  );
}

export function resolveDragOccurrenceScope(event: {
  recurrence?: SolarisRecurrence;
}): SolarisCalendarDragOccurrenceScope {
  return event.recurrence === undefined ? 'single' : 'occurrence';
}

export function diffSolarisCivilDays(from: string, to: string): number | null {
  const first = parseSolarisDateParts(from);
  const second = parseSolarisDateParts(to);
  if (first === null || second === null) return null;
  const firstMs = Date.UTC(first.year, first.month - 1, first.day);
  const secondMs = Date.UTC(second.year, second.month - 1, second.day);
  return Math.round((secondMs - firstMs) / 86_400_000);
}

function occurrenceCivilDate(
  occurrenceStart: string,
  timeZone: string,
): string | null {
  if (parseSolarisDateTimeMs(occurrenceStart) !== null) {
    return toSolarisDateInZone(occurrenceStart, timeZone);
  }
  return parseSolarisDateParts(occurrenceStart) !== null
    ? occurrenceStart
    : null;
}

function orderDates(first: string, second: string): [string, string] {
  return first <= second ? [first, second] : [second, first];
}

export function buildMonthCreateProposal(
  anchorDate: string,
  targetDate: string,
): SolarisCalendarEventCreateProposal | null {
  if (
    parseSolarisDateParts(anchorDate) === null ||
    parseSolarisDateParts(targetDate) === null
  ) {
    return null;
  }
  const [start, end] = orderDates(anchorDate, targetDate);
  return { start, end, allDay: true };
}

export function buildMonthMoveProposal(
  args: SolarisMonthMoveArgs,
): SolarisCalendarEventMoveProposal | null {
  const dayDelta = monthMoveDayDelta(args);
  if (dayDelta === null) return null;
  const base = monthMoveBaseRange(
    args.event,
    args.occurrenceStart,
    args.timeZone,
  );
  if (base === null) return null;
  const shifted = shiftMonthSpan(base, dayDelta, args.timeZone);
  if (shifted === null) return null;
  return {
    id: args.event.id,
    start: shifted.start,
    end: shifted.end,
    occurrenceStart: args.occurrenceStart,
    occurrenceScope: resolveDragOccurrenceScope(args.event),
  };
}

interface MonthMoveBase {
  start: string;
  end: string;
  timed: boolean;
}

function monthMoveDayDelta(args: SolarisMonthMoveArgs): number | null {
  const originDate =
    args.originDate ?? occurrenceCivilDate(args.occurrenceStart, args.timeZone);
  if (originDate === null) return null;
  if (parseSolarisDateParts(originDate) === null) return null;
  if (parseSolarisDateParts(args.targetDate) === null) return null;
  const dayDelta = diffSolarisCivilDays(originDate, args.targetDate);
  if (dayDelta === null || dayDelta === 0) return null;
  return dayDelta;
}

function monthMoveBaseRange(
  event: SolarisCalendarEvent,
  occurrenceStart: string,
  timeZone: string,
): MonthMoveBase | null {
  const startIsInstant = parseSolarisDateTimeMs(event.start) !== null;
  if (startIsInstant !== (parseSolarisDateTimeMs(occurrenceStart) !== null)) {
    return null;
  }
  if (event.recurrence === undefined) {
    return singleMonthBase(event, startIsInstant);
  }
  if (startIsInstant) {
    return recurringTimedBase(event, occurrenceStart, timeZone);
  }
  return recurringAllDayBase(event, occurrenceStart);
}

function singleMonthBase(
  event: SolarisCalendarEvent,
  timed: boolean,
): MonthMoveBase | null {
  if (!timed) {
    if (parseSolarisDateParts(event.start) === null) return null;
    const end = event.end ?? event.start;
    if (parseSolarisDateParts(end) === null) return null;
    return { start: event.start, end, timed: false };
  }
  if (event.end === undefined) return null;
  if (parseSolarisDateTimeMs(event.end) === null) return null;
  return { start: event.start, end: event.end, timed: true };
}

function recurringTimedBase(
  event: SolarisCalendarEvent,
  occurrenceStart: string,
  timeZone: string,
): MonthMoveBase | null {
  const duration = diffSolarisDateTimeMinutes(event.start, event.end);
  if (duration === null || duration < 0) return null;
  const end = addMinutesToSolarisDateTime(occurrenceStart, duration, timeZone);
  if (end === null) return null;
  return { start: occurrenceStart, end, timed: true };
}

function recurringAllDayBase(
  event: SolarisCalendarEvent,
  occurrenceStart: string,
): MonthMoveBase | null {
  if (parseSolarisDateParts(occurrenceStart) === null) return null;
  const spanDays = eventSpanDays(event);
  if (spanDays === null) return null;
  const end = addDaysToSolarisDate(occurrenceStart, spanDays);
  if (end === null) return null;
  return { start: occurrenceStart, end, timed: false };
}

function eventSpanDays(event: SolarisCalendarEvent): number | null {
  const startCivil =
    parseSolarisDateParts(event.start) !== null ? event.start : null;
  const endValue = event.end ?? event.start;
  const endCivil = parseSolarisDateParts(endValue) !== null ? endValue : null;
  if (startCivil === null || endCivil === null) return null;
  const spanDays = diffSolarisCivilDays(startCivil, endCivil);
  if (spanDays === null || spanDays < 0) return null;
  return spanDays;
}

function shiftMonthSpan(
  base: MonthMoveBase,
  dayDelta: number,
  timeZone: string,
): { start: string; end: string } | null {
  if (!base.timed) {
    const start = addDaysToSolarisDate(base.start, dayDelta);
    const end = addDaysToSolarisDate(base.end, dayDelta);
    if (start === null || end === null) return null;
    return { start, end };
  }
  const start = addDaysPreservingSolarisWall(base.start, dayDelta, timeZone);
  const end = addDaysPreservingSolarisWall(base.end, dayDelta, timeZone);
  if (start === null || end === null) return null;
  return { start, end };
}

function minutesToWallParts(
  date: string,
  minutes: number,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} | null {
  const parts = parseSolarisDateParts(date);
  if (parts === null) return null;
  const clamped = Math.min(
    SOLARIS_DAY_MINUTES,
    Math.max(0, Math.floor(minutes)),
  );
  const capped =
    clamped >= SOLARIS_DAY_MINUTES ? SOLARIS_DAY_MINUTES - 1 : clamped;
  return {
    ...parts,
    hour: Math.floor(capped / 60),
    minute: capped % 60,
  };
}

export function buildWeekCreateProposal(
  args: SolarisWeekCreateArgs,
): SolarisCalendarEventCreateProposal | null {
  const { timeZone } = args;
  const step = normalizeDragSnapStep(args.stepMinutes);
  const firstEarlier =
    args.anchorDate < args.currentDate ||
    (args.anchorDate === args.currentDate &&
      args.anchorMinutes <= args.currentMinutes);
  const lowDate = firstEarlier ? args.anchorDate : args.currentDate;
  const lowMinutes = firstEarlier ? args.anchorMinutes : args.currentMinutes;
  const highDate = firstEarlier ? args.currentDate : args.anchorDate;
  let highMinutes = firstEarlier ? args.currentMinutes : args.anchorMinutes;
  if (lowDate === highDate && highMinutes - lowMinutes < step) {
    highMinutes = lowMinutes + step;
  }
  const startParts = minutesToWallParts(lowDate, lowMinutes);
  const endParts = minutesToWallParts(highDate, highMinutes);
  if (startParts === null || endParts === null) return null;
  const startMs = resolveSolarisWallTimeMs(timeZone, {
    ...startParts,
    second: 0,
  });
  const endMs = resolveSolarisWallTimeMs(timeZone, {
    ...endParts,
    second: 0,
  });
  if (endMs <= startMs) return null;
  return {
    start: toSolarisDateTimeValue(startMs, timeZone),
    end: toSolarisDateTimeValue(endMs, timeZone),
    allDay: false,
  };
}

export function buildWeekMoveProposal(
  args: SolarisWeekMoveArgs,
): SolarisCalendarEventMoveProposal | null {
  const {
    event,
    occurrenceStart,
    occurrenceEnd,
    dayDelta,
    minuteDelta,
    timeZone,
  } = args;
  if (!Number.isInteger(dayDelta) || !Number.isFinite(minuteDelta)) {
    return null;
  }
  const startMs = parseSolarisDateTimeMs(occurrenceStart);
  const endMs = parseSolarisDateTimeMs(occurrenceEnd);
  if (startMs === null || endMs === null || endMs <= startMs) return null;
  if (dayDelta === 0 && minuteDelta === 0) return null;
  const shiftedStart =
    dayDelta === 0
      ? occurrenceStart
      : addDaysPreservingSolarisWall(occurrenceStart, dayDelta, timeZone);
  if (shiftedStart === null) return null;
  const movedStart =
    minuteDelta === 0
      ? shiftedStart
      : addMinutesToSolarisDateTime(shiftedStart, minuteDelta, timeZone);
  if (movedStart === null) return null;
  const movedStartMs = parseSolarisDateTimeMs(movedStart);
  if (movedStartMs === null) return null;
  const durationMs = endMs - startMs;
  const movedEnd = toSolarisDateTimeValue(movedStartMs + durationMs, timeZone);
  return {
    id: event.id,
    start: movedStart,
    end: movedEnd,
    occurrenceStart,
    occurrenceScope: resolveDragOccurrenceScope(event),
  };
}

export function buildWeekResizeProposal(
  args: SolarisWeekResizeArgs,
): SolarisCalendarEventResizeProposal | null {
  const { event, occurrenceStart, occurrenceEnd, edge, minuteDelta, timeZone } =
    args;
  const dayDelta = args.dayDelta ?? 0;
  if (!Number.isFinite(minuteDelta)) return null;
  if (!Number.isInteger(dayDelta)) return null;
  if (minuteDelta === 0 && dayDelta === 0) return null;
  const minMinutes = Math.max(1, normalizeDragSnapStep(args.minMinutes));
  const startMs = parseSolarisDateTimeMs(occurrenceStart);
  const endMs = parseSolarisDateTimeMs(occurrenceEnd);
  if (startMs === null || endMs === null || endMs <= startMs) return null;
  const shiftEdge = (value: string): string | null => {
    const dayShifted =
      dayDelta === 0
        ? value
        : addDaysPreservingSolarisWall(value, dayDelta, timeZone);
    if (dayShifted === null) return null;
    if (minuteDelta === 0) return dayShifted;
    return addMinutesToSolarisDateTime(dayShifted, minuteDelta, timeZone);
  };
  if (edge === 'start') {
    const moved = shiftEdge(occurrenceStart);
    const movedMs = moved === null ? null : parseSolarisDateTimeMs(moved);
    if (moved === null || movedMs === null) return null;
    if (endMs - movedMs < minMinutes * 60_000) return null;
    return {
      id: event.id,
      start: moved,
      end: occurrenceEnd,
      occurrenceStart,
      occurrenceScope: resolveDragOccurrenceScope(event),
    };
  }
  const moved = shiftEdge(occurrenceEnd);
  const movedMs = moved === null ? null : parseSolarisDateTimeMs(moved);
  if (moved === null || movedMs === null) return null;
  if (movedMs - startMs < minMinutes * 60_000) return null;
  return {
    id: event.id,
    start: occurrenceStart,
    end: moved,
    occurrenceStart,
    occurrenceScope: resolveDragOccurrenceScope(event),
  };
}
