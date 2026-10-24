import { todaySolarisDate } from '../../../../forms/date/model/date.utils';
import {
  addDaysToSolarisDate,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  toSolarisDateInZone,
} from '../../model/calendar-datetime.utils';
import { expandSolarisRecurrence } from '../../model/recurrence.utils';
import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
} from '../../model/calendar.types';
import type {
  SolarisMonthEventSpan,
  SolarisMonthRange,
  SolarisMonthViewItem,
} from './month-view.types';

export const MONTH_VIEW_MAX_SPAN_DAYS = 500;

export const MONTH_VIEW_DRAG_ACTIVATION_PX = 4;

export function isMonthArrowKey(key: string): boolean {
  return (
    key === 'ArrowLeft' ||
    key === 'ArrowRight' ||
    key === 'ArrowUp' ||
    key === 'ArrowDown'
  );
}

export function isMonthDragKey(key: string): boolean {
  return (
    isMonthArrowKey(key) || key === 'Enter' || key === ' ' || key === 'Escape'
  );
}

export function monthViewMonthOf(value: string): {
  year: number;
  month: number;
} {
  const parts = parseSolarisDateParts(value);
  if (parts !== null) return { year: parts.year, month: parts.month - 1 };
  const today = parseSolarisDateParts(todaySolarisDate());
  if (today !== null) return { year: today.year, month: today.month - 1 };
  return { year: 1970, month: 0 };
}

export function resolveSpanEndCivil(
  end: string,
  timeZone: string,
): string | null {
  if (parseSolarisDateTimeMs(end) !== null) {
    return toSolarisDateInZone(end, timeZone);
  }
  return parseSolarisDateParts(end) !== null ? end : null;
}

export function singleEventSpan(
  event: SolarisCalendarEvent,
  timeZone: string,
): SolarisMonthEventSpan | null {
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
  range: SolarisMonthRange,
): SolarisMonthEventSpan[] {
  if (event.recurrence === undefined) {
    const single = singleEventSpan(event, timeZone);
    return single === null ? [] : [single];
  }
  const startMs = parseSolarisDateTimeMs(event.start);
  const startValid =
    startMs !== null || parseSolarisDateParts(event.start) !== null;
  if (!startValid) return [];
  const occurrences = expandSolarisRecurrence({
    start: event.start,
    end: event.end,
    recurrence: event.recurrence,
    timeZone,
    rangeStart: range.start,
    rangeEnd: range.end,
  });
  const spans: SolarisMonthEventSpan[] = [];
  for (const occurrence of occurrences) {
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
    guard < MONTH_VIEW_MAX_SPAN_DAYS
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
  if (!parseSolarisDateTimeMs(task.due)) return null;
  return toSolarisDateInZone(task.due, timeZone);
}

export function itemWeight(item: SolarisMonthViewItem): number {
  if (item.kind === 'holiday') return 0;
  if (item.kind === 'event' && item.allDay) return 1;
  if (item.kind === 'event') return 2;
  return 3;
}

export function compareMonthItems(
  first: SolarisMonthViewItem,
  second: SolarisMonthViewItem,
): number {
  const weight = itemWeight(first) - itemWeight(second);
  if (weight !== 0) return weight;
  if (first.sortKey !== second.sortKey) {
    if (first.sortKey < second.sortKey) return -1;
    return 1;
  }
  if (first.title < second.title) return -1;
  if (first.title > second.title) return 1;
  return 0;
}
