import {
  addDaysToSolarisDate,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  toSolarisDateInZone,
} from './calendar-datetime.utils';
import { expandSolarisRecurrence } from './recurrence.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
} from './calendar.types';
import type { SolarisCalendarEventSpan } from './calendar-span.types';

export const SOLARIS_CALENDAR_MAX_SPAN_DAYS = 500;

export function resolveSpanEndCivil(
  end: string,
  timeZone: string,
): string | null {
  if (parseSolarisDateTimeMs(end) !== null) {
    return toSolarisDateInZone(end, timeZone);
  }
  if (parseSolarisDateParts(end) !== null) return end;
  return null;
}

export function singleEventSpan(
  event: SolarisCalendarEvent,
  timeZone: string,
): SolarisCalendarEventSpan | null {
  const startMs = parseSolarisDateTimeMs(event.start);
  let startCivil: string | null = null;
  if (startMs !== null) {
    startCivil = toSolarisDateInZone(event.start, timeZone);
  } else if (parseSolarisDateParts(event.start) !== null) {
    startCivil = event.start;
  }
  if (startCivil === null) return null;
  if (event.end === undefined) {
    return { occurrenceStart: event.start, startCivil, endCivil: startCivil };
  }
  const endCivil = resolveSpanEndCivil(event.end, timeZone);
  if (endCivil === null || endCivil < startCivil) return null;
  return { occurrenceStart: event.start, startCivil, endCivil };
}

export function expandEventSpans(
  event: SolarisCalendarEvent,
  timeZone: string,
  rangeStart: string,
  rangeEnd: string,
): SolarisCalendarEventSpan[] {
  if (event.recurrence === undefined) {
    const single = singleEventSpan(event, timeZone);
    return single === null ? [] : [single];
  }
  const startMs = parseSolarisDateTimeMs(event.start);
  const startValid =
    startMs !== null || parseSolarisDateParts(event.start) !== null;
  if (!startValid) return [];
  const spans: SolarisCalendarEventSpan[] = [];
  for (const occurrence of expandSolarisRecurrence({
    start: event.start,
    end: event.end,
    recurrence: event.recurrence,
    timeZone,
    rangeStart,
    rangeEnd,
  })) {
    const occurrenceMs = parseSolarisDateTimeMs(occurrence.start);
    const startCivil =
      occurrenceMs === null
        ? occurrence.start
        : toSolarisDateInZone(occurrence.start, timeZone);
    if (startCivil === null) continue;
    const endMs = parseSolarisDateTimeMs(occurrence.end);
    const endCivil =
      endMs === null
        ? occurrence.start
        : (toSolarisDateInZone(occurrence.end, timeZone) ?? startCivil);
    spans.push({ occurrenceStart: occurrence.start, startCivil, endCivil });
  }
  return spans;
}

export function spanDates(from: string, to: string): string[] {
  const dates: string[] = [];
  let current: string | null = from;
  let guard = 0;
  while (
    current !== null &&
    current <= to &&
    guard < SOLARIS_CALENDAR_MAX_SPAN_DAYS
  ) {
    dates.push(current);
    current = addDaysToSolarisDate(current, 1);
    guard += 1;
  }
  return dates;
}

export function taskDueCivil(
  task: SolarisCalendarTask,
  timeZone: string,
): string | null {
  if (parseSolarisDateParts(task.due) !== null) return task.due;
  if (parseSolarisDateTimeMs(task.due) === null) return null;
  return toSolarisDateInZone(task.due, timeZone);
}

export function compareCivilDates(first: string, second: string): number {
  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}
