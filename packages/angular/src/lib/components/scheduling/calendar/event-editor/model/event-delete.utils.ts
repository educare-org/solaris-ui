import {
  addDaysToSolarisDate,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  toSolarisDateInZone,
  toSolarisDateTimeValue,
} from '../../model/calendar-datetime.utils';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import type { SolarisEventDeleteScope } from './event-editor.types';

export type SolarisEventDeleteResolution =
  | { readonly action: 'remove' }
  | { readonly action: 'update'; readonly event: SolarisCalendarEvent };

function cloneEvent(event: SolarisCalendarEvent): SolarisCalendarEvent {
  return {
    ...event,
    recurrence: event.recurrence ? { ...event.recurrence } : undefined,
    recurrenceExceptionDates: event.recurrenceExceptionDates
      ? [...event.recurrenceExceptionDates]
      : undefined,
  };
}

function occurrenceCivilDate(
  occurrenceStart: string,
  timeZone: string,
): string | null {
  if (parseSolarisDateParts(occurrenceStart) !== null) return occurrenceStart;
  if (parseSolarisDateTimeMs(occurrenceStart) === null) return null;
  return toSolarisDateInZone(occurrenceStart, timeZone);
}

function occurrenceMs(occurrenceStart: string): number | null {
  return parseSolarisDateTimeMs(occurrenceStart);
}

function eventStartMs(event: SolarisCalendarEvent): number | null {
  return parseSolarisDateTimeMs(event.start);
}

function eventStartCivil(
  event: SolarisCalendarEvent,
  timeZone: string,
): string | null {
  if (parseSolarisDateParts(event.start) !== null) return event.start;
  if (parseSolarisDateTimeMs(event.start) === null) return null;
  return toSolarisDateInZone(event.start, timeZone);
}

export function resolveSolarisEventDelete(
  event: SolarisCalendarEvent,
  occurrenceStart: string | null,
  scope: SolarisEventDeleteScope,
  timeZone = 'UTC',
): SolarisEventDeleteResolution {
  if (event.recurrence === undefined) return { action: 'remove' };
  if (scope === 'all') return { action: 'remove' };
  if (occurrenceStart === null) return { action: 'remove' };

  if (scope === 'this') {
    const civil = occurrenceCivilDate(occurrenceStart, timeZone);
    if (civil === null) return { action: 'remove' };
    const next = cloneEvent(event);
    const current = next.recurrenceExceptionDates ?? [];
    if (!current.includes(civil)) {
      next.recurrenceExceptionDates = [...current, civil].sort();
    } else {
      next.recurrenceExceptionDates = [...current];
    }
    return { action: 'update', event: next };
  }

  const occurrenceInstant = occurrenceMs(occurrenceStart);
  const occurrenceCivil = occurrenceCivilDate(occurrenceStart, timeZone);
  if (occurrenceInstant !== null) {
    const untilInstant = occurrenceInstant - 60_000;
    const until = toSolarisDateTimeValue(untilInstant, timeZone);
    const startInstant = eventStartMs(event);
    if (startInstant !== null && untilInstant < startInstant) {
      return { action: 'remove' };
    }
    const recurrence = event.recurrence;
    if (recurrence === undefined) return { action: 'remove' };
    const next = cloneEvent(event);
    next.recurrence = { ...recurrence, until };
    return { action: 'update', event: next };
  }

  if (occurrenceCivil !== null) {
    const cutoff = addDaysToSolarisDate(occurrenceCivil, -1);
    const startCivil = eventStartCivil(event, timeZone);
    if (cutoff === null) return { action: 'remove' };
    if (startCivil !== null && cutoff < startCivil) {
      return { action: 'remove' };
    }
    const recurrence = event.recurrence;
    if (recurrence === undefined) return { action: 'remove' };
    const next = cloneEvent(event);
    next.recurrence = { ...recurrence, until: cutoff };
    return { action: 'update', event: next };
  }

  return { action: 'remove' };
}
