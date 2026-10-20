import {
  addDaysToSolarisDate,
  getZonedWall,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  toSolarisDateInZone,
  toSolarisDateTimeValue,
} from '../../model/calendar-datetime.utils';
import type { SolarisCalendarEvent } from '../../model/calendar.types';
import type { SolarisEventDeleteScope } from './event-editor.types';

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

function isValidScope(value: unknown): value is SolarisEventDeleteScope {
  return value === 'this' || value === 'following' || value === 'all';
}

function durationDaysBetween(start: string, end: string): number | null {
  const first = parseSolarisDateParts(start);
  const second = parseSolarisDateParts(end);
  if (first === null || second === null) return null;
  const diff =
    Date.UTC(second.year, second.month - 1, second.day) -
    Date.UTC(first.year, first.month - 1, first.day);
  return Math.round(diff / 86_400_000);
}

function buildDetachedRange(
  draft: SolarisCalendarEvent,
  civil: string,
  timeZone: string,
): { start: string; end: string } | null {
  const draftStartCivil = parseSolarisDateParts(draft.start);
  const draftEndCivil = parseSolarisDateParts(draft.end);
  if (draftStartCivil !== null && draftEndCivil !== null) {
    const duration = durationDaysBetween(draft.start, draft.end);
    if (duration === null || duration < 0) return null;
    const end = addDaysToSolarisDate(civil, duration);
    if (end === null) return null;
    return { start: civil, end };
  }
  const startMs = parseSolarisDateTimeMs(draft.start);
  const endMs = parseSolarisDateTimeMs(draft.end);
  if (startMs === null || endMs === null) return null;
  if (endMs < startMs) return null;
  const durationMs = endMs - startMs;
  const wall = getZonedWall(timeZone, startMs);
  const civilParts = parseSolarisDateParts(civil);
  if (civilParts === null) return null;
  const resolved = resolveSolarisWallTimeMs(timeZone, {
    ...civilParts,
    hour: wall.hour,
    minute: wall.minute,
    second: wall.second,
  });
  return {
    start: toSolarisDateTimeValue(resolved, timeZone),
    end: toSolarisDateTimeValue(resolved + durationMs, timeZone),
  };
}

export function resolveSolarisEventSave(
  source: SolarisCalendarEvent,
  occurrenceStart: string | null,
  draft: SolarisCalendarEvent,
  scope: SolarisEventDeleteScope,
  timeZone = 'UTC',
): SolarisCalendarEvent[] | null {
  try {
    if (
      source === null ||
      typeof source !== 'object' ||
      draft === null ||
      typeof draft !== 'object'
    ) {
      return null;
    }
    if (typeof source.id !== 'string' || source.id.length === 0) return null;
    if (typeof draft.id !== 'string' || draft.id.length === 0) return null;
    if (typeof draft.start !== 'string' || typeof draft.end !== 'string') {
      return null;
    }
    if (!isValidScope(scope)) return null;
    if (typeof timeZone !== 'string' || timeZone.length === 0) return null;
    const draftClone = cloneEvent(draft);
    if (source.recurrence === undefined) return [draftClone];
    if (scope === 'all') return [draftClone];
    if (occurrenceStart === null) return null;
    if (typeof occurrenceStart !== 'string' || occurrenceStart.length === 0) {
      return null;
    }
    const civil = occurrenceCivilDate(occurrenceStart, timeZone);
    if (civil === null) return null;

    if (scope === 'this') {
      const range = buildDetachedRange(draft, civil, timeZone);
      if (range === null) return null;
      const series = cloneEvent(source);
      const current = series.recurrenceExceptionDates ?? [];
      if (!current.includes(civil)) {
        series.recurrenceExceptionDates = [...current, civil].sort();
      } else {
        series.recurrenceExceptionDates = [...current];
      }
      const detached = cloneEvent(draft);
      detached.id = `${source.id}--${civil}`;
      detached.start = range.start;
      detached.end = range.end;
      delete detached.recurrence;
      delete detached.recurrenceExceptionDates;
      return [series, detached];
    }

    const occurrenceInstant = parseSolarisDateTimeMs(occurrenceStart);
    if (occurrenceInstant !== null) {
      const untilInstant = occurrenceInstant - 60_000;
      const until = toSolarisDateTimeValue(untilInstant, timeZone);
      const range = buildDetachedRange(draft, civil, timeZone);
      if (range === null) return null;
      const startInstant = parseSolarisDateTimeMs(source.start);
      if (startInstant !== null && untilInstant < startInstant) {
        const following = cloneEvent(draft);
        following.id = `${source.id}--following-${civil}`;
        following.start = range.start;
        following.end = range.end;
        return [following];
      }
      const truncated = cloneEvent(source);
      truncated.recurrence = { ...source.recurrence, until };
      const following = cloneEvent(draft);
      following.id = `${source.id}--following-${civil}`;
      following.start = range.start;
      following.end = range.end;
      return [truncated, following];
    }

    const cutoff = addDaysToSolarisDate(civil, -1);
    if (cutoff === null) return null;
    const range = buildDetachedRange(draft, civil, timeZone);
    if (range === null) return null;
    const sourceStartCivil =
      parseSolarisDateParts(source.start) !== null
        ? source.start
        : toSolarisDateInZone(source.start, timeZone);
    if (sourceStartCivil !== null && cutoff < sourceStartCivil) {
      const following = cloneEvent(draft);
      following.id = `${source.id}--following-${civil}`;
      following.start = range.start;
      following.end = range.end;
      return [following];
    }
    const truncated = cloneEvent(source);
    truncated.recurrence = { ...source.recurrence, until: cutoff };
    const following = cloneEvent(draft);
    following.id = `${source.id}--following-${civil}`;
    following.start = range.start;
    following.end = range.end;
    return [truncated, following];
  } catch {
    return null;
  }
}
