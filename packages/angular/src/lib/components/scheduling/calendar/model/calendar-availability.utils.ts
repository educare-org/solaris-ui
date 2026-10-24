import {
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
} from './calendar-datetime.utils';
import type { SolarisCalendarEvent } from './calendar.types';

export interface SolarisFreeBusyRange {
  readonly start: string;
  readonly end: string;
}

function eventRangeMs(event: SolarisCalendarEvent): {
  startMs: number;
  endMs: number;
} | null {
  if (event.allDay === true) return null;
  const startMs = parseSolarisDateTimeMs(event.start);
  const endMs = parseSolarisDateTimeMs(event.end);
  if (startMs === null || endMs === null || endMs < startMs) return null;
  return { startMs, endMs };
}

function rangeOverlaps(
  first: { startMs: number; endMs: number },
  second: { startMs: number; endMs: number },
): boolean {
  return first.startMs < second.endMs && second.startMs < first.endMs;
}

// Why: room/equipment double-booking must be detected on pure instants,
// never on wall time, so DST transitions cannot create false free slots.
export function findSolarisConflicts(
  events: readonly SolarisCalendarEvent[],
  candidate: SolarisCalendarEvent,
  options?: { ignoreId?: string; resourceId?: string },
): SolarisCalendarEvent[] {
  const candidateRange = eventRangeMs(candidate);
  if (candidateRange === null) {
    return events.filter(
      (event) =>
        event.id !== options?.ignoreId &&
        event.allDay === true &&
        event.start === candidate.start &&
        (options?.resourceId === undefined ||
          (event.resources ?? []).includes(options.resourceId)),
    );
  }
  return events.filter((event) => {
    if (event.id === candidate.id || event.id === options?.ignoreId)
      return false;
    if (
      options?.resourceId !== undefined &&
      candidate.resources !== undefined &&
      candidate.resources.length > 0
    ) {
      const shared = (event.resources ?? []).some((resource) =>
        (candidate.resources ?? []).includes(resource),
      );
      const eventUsesResource = (event.resources ?? []).includes(
        options.resourceId,
      );
      if (!shared && !eventUsesResource) return false;
    }
    const range = eventRangeMs(event);
    if (range === null) return false;
    return rangeOverlaps(range, candidateRange);
  });
}

export function isSolarisFree(
  events: readonly SolarisCalendarEvent[],
  range: SolarisFreeBusyRange,
): boolean {
  const startMs =
    parseSolarisDateTimeMs(range.start) ??
    (parseSolarisDateParts(range.start) !== null
      ? Date.UTC(
          Number(range.start.slice(0, 4)),
          Number(range.start.slice(5, 7)) - 1,
          Number(range.start.slice(8, 10)),
        )
      : null);
  const endMs =
    parseSolarisDateTimeMs(range.end) ??
    (parseSolarisDateParts(range.end) !== null
      ? Date.UTC(
          Number(range.end.slice(0, 4)),
          Number(range.end.slice(5, 7)) - 1,
          Number(range.end.slice(8, 10)),
        )
      : null);
  if (startMs === null || endMs === null || endMs <= startMs) return false;
  return !events.some((event) => {
    const eventRange = eventRangeMs(event);
    if (eventRange === null) return false;
    return rangeOverlaps(eventRange, { startMs, endMs });
  });
}

export function filterSolarisByCalendars(
  events: readonly SolarisCalendarEvent[],
  visibleIds: readonly string[] | null | undefined,
): SolarisCalendarEvent[] {
  if (visibleIds === null || visibleIds === undefined) return [...events];
  const visible = new Set(visibleIds);
  return events.filter(
    (event) => event.calendarId === undefined || visible.has(event.calendarId),
  );
}
