import {
  addDaysToSolarisDate,
  getTimeZoneOffsetMinutes,
  getZonedWall,
  parseSolarisDateParts,
  parseSolarisDateTimeMs,
  resolveSolarisWallTimeMs,
  toSolarisDateTimeValue,
} from './calendar-datetime.utils';
import type {
  SolarisCalendarOccurrence,
  SolarisRecurrence,
  SolarisRecurrenceOverride,
} from './calendar.types';

const MS_PER_MINUTE = 60_000;
const MS_PER_DAY = 86_400_000;
const MAX_SCANNED_CANDIDATES = 2_000_000;
const MAX_GRID_CELLS = 50_000;

export const SOLARIS_RECURRENCE_MAX_RESULTS = 100_000;

export interface ExpandSolarisRecurrenceOptions {
  start: string;
  end?: string;
  recurrence: SolarisRecurrence;
  timeZone: string;
  rangeStart: string;
  rangeEnd: string;
  exceptionDates?: readonly string[];
  overrides?: readonly SolarisRecurrenceOverride[];
}

interface CivilDate {
  year: number;
  month: number;
  day: number;
}

interface CivilTime {
  hour: number;
  minute: number;
  second: number;
}

interface CollectedOccurrence {
  instant: number;
  offset: number;
  civil: string;
}

interface OffsetSegment {
  fromMs: number;
  offsetMinutes: number;
}

interface NormalizedOverrides {
  dropped: Set<string>;
  rescheduled: Map<string, { startMs: number; endMs: number }>;
}

interface ExpansionState {
  timeZone: string;
  allDay: boolean;
  anchorCivil: CivilDate;
  anchorTime: CivilTime;
  anchorInstant: number;
  durationMs: number;
  durationDays: number;
  rangeStartMs: number;
  rangeEndMs: number;
  count: number | null;
  untilMs: number | null;
  untilCivil: string | null;
  interval: number;
  monthDay: number;
  byMonthDay: number[];
  byMonth: number[];
  bySetPos: number[];
  freq: SolarisRecurrence['freq'];
  anchorWeekday: number;
  byWeekday: number[];
  anchorMonthIndex: number;
  exceptions: Set<string>;
  segments: OffsetSegment[];
  hintOffset: number;
  scanned: number;
  seriesCount: number;
}

const FAST_WALL_PATTERN =
  /^(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})$/;
const SEGMENT_GRID_MS = 7 * MS_PER_DAY;
const SEGMENT_PAD_MS = 8 * MS_PER_DAY;
const MAX_ZONE_SHIFT_MS = 14 * 3_600_000;

const fastFormatterCache = new Map<string, Intl.DateTimeFormat>();
let fastWallUsable: boolean | null = null;

function fastFormatterFor(timeZone: string): Intl.DateTimeFormat {
  const cached = fastFormatterCache.get(timeZone);
  if (cached) return cached;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  fastFormatterCache.set(timeZone, formatter);
  return formatter;
}

function probeOffsetMinutes(timeZone: string, instant: number): number {
  if (fastWallUsable === false) {
    return getTimeZoneOffsetMinutes(timeZone, instant);
  }
  const text = fastFormatterFor(timeZone).format(new Date(instant));
  const match = FAST_WALL_PATTERN.exec(text);
  if (match === null) {
    fastWallUsable = false;
    return getTimeZoneOffsetMinutes(timeZone, instant);
  }
  fastWallUsable = true;
  const wallAsUtc = Date.UTC(
    Number(match[3]),
    Number(match[1]) - 1,
    Number(match[2]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6]),
  );
  return Math.round((wallAsUtc - instant) / MS_PER_MINUTE);
}

function refineTransition(
  timeZone: string,
  loMs: number,
  hiMs: number,
  hiOffset: number,
): number {
  let lo = loMs;
  let hi = hiMs;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (probeOffsetMinutes(timeZone, mid) === hiOffset) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return hi;
}

function buildOffsetSegments(
  timeZone: string,
  fromMs: number,
  toMs: number,
): OffsetSegment[] {
  if ((toMs - fromMs) / SEGMENT_GRID_MS > MAX_GRID_CELLS) {
    throw new Error('expandSolarisRecurrence window is too large to expand.');
  }
  const firstOffset = probeOffsetMinutes(timeZone, fromMs);
  const segments: OffsetSegment[] = [{ fromMs, offsetMinutes: firstOffset }];
  let prevT = fromMs;
  let prevOff = firstOffset;
  for (let t = fromMs + SEGMENT_GRID_MS; t < toMs; t += SEGMENT_GRID_MS) {
    const off = probeOffsetMinutes(timeZone, t);
    if (off !== prevOff) {
      segments.push({
        fromMs: refineTransition(timeZone, prevT, t, off),
        offsetMinutes: off,
      });
      prevOff = off;
    }
    prevT = t;
  }
  const endOff = probeOffsetMinutes(timeZone, toMs);
  if (endOff !== prevOff) {
    segments.push({
      fromMs: refineTransition(timeZone, prevT, toMs, endOff),
      offsetMinutes: endOff,
    });
  }
  return segments;
}

function offsetAt(segments: OffsetSegment[], instant: number): number {
  let lo = 0;
  let hi = segments.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (segments[mid].fromMs <= instant) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return segments[lo].offsetMinutes;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absolute = Math.abs(offsetMinutes);
  return `${sign}${pad2(Math.floor(absolute / 60))}:${pad2(absolute % 60)}`;
}

function formatInstant(
  instant: number,
  offsetMinutes: number,
  extraMs: number,
): string {
  const wall = new Date(instant + offsetMinutes * MS_PER_MINUTE + extraMs);
  const remainder = (((instant + extraMs) % 1000) + 1000) % 1000;
  const fraction =
    remainder === 0 ? '' : `.${String(remainder).padStart(3, '0')}`;
  return (
    `${String(wall.getUTCFullYear()).padStart(4, '0')}-${pad2(wall.getUTCMonth() + 1)}-${pad2(wall.getUTCDate())}` +
    `T${pad2(wall.getUTCHours())}:${pad2(wall.getUTCMinutes())}:${pad2(wall.getUTCSeconds())}${fraction}` +
    formatOffset(offsetMinutes)
  );
}

function formatEnd(
  instant: number,
  offsetMinutes: number,
  duration: number,
): string {
  if (duration === 0) return formatInstant(instant, offsetMinutes, 0);
  return formatInstant(instant, offsetMinutes, duration);
}

function civilToString(date: CivilDate): string {
  return `${String(date.year).padStart(4, '0')}-${pad2(date.month)}-${pad2(date.day)}`;
}

function compareCivil(first: CivilDate, second: CivilDate): number {
  if (first.year !== second.year) return first.year < second.year ? -1 : 1;
  if (first.month !== second.month) return first.month < second.month ? -1 : 1;
  if (first.day !== second.day) return first.day < second.day ? -1 : 1;
  return 0;
}

function addDaysCivil(date: CivilDate, days: number): CivilDate {
  const shifted = new Date(
    Date.UTC(date.year, date.month - 1, date.day + days),
  );
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  };
}

function daysInCivilMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function weekdayOfCivil(date: CivilDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

function normalizeInterval(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
}

function normalizeByWeekday(
  value: readonly number[] | undefined,
  fallback: number,
): number[] {
  const cleaned =
    value === undefined
      ? []
      : value.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  const unique = [...new Set(cleaned)].sort((a, b) => a - b);
  if (unique.length === 0) return [fallback];
  return unique;
}

function normalizeBySetPos(value: readonly number[] | undefined): number[] {
  if (value === undefined) return [];
  return [
    ...new Set(
      value.filter(
        (pos) => Number.isInteger(pos) && pos >= -5 && pos <= 5 && pos !== 0,
      ),
    ),
  ].sort((a, b) => a - b);
}

function normalizeByMonthDay(value: readonly number[] | undefined): number[] {
  if (value === undefined) return [];
  return [
    ...new Set(
      value.filter((day) => Number.isInteger(day) && day >= 1 && day <= 31),
    ),
  ].sort((a, b) => a - b);
}

function normalizeByMonth(value: readonly number[] | undefined): number[] {
  if (value === undefined) return [];
  return [
    ...new Set(
      value.filter(
        (month) => Number.isInteger(month) && month >= 1 && month <= 12,
      ),
    ),
  ].sort((a, b) => a - b);
}
function normalizeMonthDay(
  value: number | undefined,
  fallback: number,
): number {
  if (
    value === undefined ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 31
  ) {
    return fallback;
  }
  return value;
}

function normalizeCount(count: number | undefined): number | null {
  if (count === undefined) return null;
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(
      `expandSolarisRecurrence requires a positive count, got ${count}.`,
    );
  }
  return count;
}

function normalizeUntil(until: string | undefined): {
  untilMs: number | null;
  untilCivil: string | null;
} {
  if (until === undefined) return { untilMs: null, untilCivil: null };
  const asInstant = parseSolarisDateTimeMs(until);
  if (asInstant !== null) return { untilMs: asInstant, untilCivil: null };
  if (parseSolarisDateParts(until) !== null) {
    return { untilMs: null, untilCivil: until };
  }
  throw new Error(
    `expandSolarisRecurrence requires a valid ISO until, got ${until}.`,
  );
}

function resolveAnchorCivil(
  start: string,
  parsedStart: number | null,
  timeZone: string,
): CivilDate {
  if (parsedStart !== null) {
    const wall = getZonedWall(timeZone, parsedStart);
    return { year: wall.year, month: wall.month, day: wall.day };
  }
  const parts = parseSolarisDateParts(start);
  if (parts === null) {
    throw new Error(
      `expandSolarisRecurrence requires a valid ISO start, got ${start}.`,
    );
  }
  return parts;
}

function resolveAnchorTime(
  parsedStart: number | null,
  allDay: boolean,
  timeZone: string,
): CivilTime {
  if (allDay || parsedStart === null) {
    return { hour: 0, minute: 0, second: 0 };
  }
  const wall = getZonedWall(timeZone, parsedStart);
  return { hour: wall.hour, minute: wall.minute, second: wall.second };
}

function resolveAllDayDuration(end: string, anchorCivil: CivilDate): number {
  const endCivil = parseSolarisDateParts(end);
  if (
    endCivil === null ||
    civilToString(endCivil) < civilToString(anchorCivil)
  ) {
    throw new Error(
      `expandSolarisRecurrence requires a valid date-only end on or after start, got ${end}.`,
    );
  }
  return (
    (Date.UTC(endCivil.year, endCivil.month - 1, endCivil.day) -
      Date.UTC(anchorCivil.year, anchorCivil.month - 1, anchorCivil.day)) /
    MS_PER_DAY
  );
}

function resolveDurations(
  end: string | undefined,
  allDay: boolean,
  anchorCivil: CivilDate,
  parsedStart: number | null,
): { durationMs: number; durationDays: number } {
  if (end === undefined) return { durationMs: 0, durationDays: 0 };
  if (allDay) {
    return {
      durationMs: 0,
      durationDays: resolveAllDayDuration(end, anchorCivil),
    };
  }
  const endInstant = parseSolarisDateTimeMs(end);
  if (endInstant === null || parsedStart === null || endInstant < parsedStart) {
    throw new Error(
      `expandSolarisRecurrence requires a valid ISO end on or after start, got ${end}.`,
    );
  }
  return { durationMs: endInstant - parsedStart, durationDays: 0 };
}

function boundToMs(value: string, timeZone: string, label: string): number {
  const asInstant = parseSolarisDateTimeMs(value);
  if (asInstant !== null) return asInstant;
  const parts = parseSolarisDateParts(value);
  if (parts !== null) {
    return resolveSolarisWallTimeMs(timeZone, {
      ...parts,
      hour: 0,
      minute: 0,
      second: 0,
    });
  }
  throw new Error(
    `expandSolarisRecurrence requires a valid ISO ${label}, got ${value}.`,
  );
}

function normalizeExceptionDates(
  values: readonly string[] | undefined,
  timeZone: string,
): Set<string> {
  const normalized = new Set<string>();
  if (!values) return normalized;
  for (const entry of values) {
    if (parseSolarisDateParts(entry) !== null) {
      normalized.add(entry);
    } else {
      const instant = parseSolarisDateTimeMs(entry);
      if (instant !== null) {
        const wall = getZonedWall(timeZone, instant);
        normalized.add(
          `${String(wall.year).padStart(4, '0')}-${pad2(wall.month)}-${pad2(wall.day)}`,
        );
      }
    }
  }
  return normalized;
}

function countHorizonMs(
  anchor: CivilDate,
  freq: SolarisRecurrence['freq'],
  count: number | null,
  interval: number,
): number {
  if (count === null) return Number.POSITIVE_INFINITY;
  switch (freq) {
    case 'daily':
      return Date.UTC(
        anchor.year,
        anchor.month - 1,
        anchor.day + count * interval,
      );
    case 'weekly':
      return Date.UTC(
        anchor.year,
        anchor.month - 1,
        anchor.day + count * interval * 7 + 7,
      );
    case 'monthly': {
      const index =
        anchor.year * 12 + (anchor.month - 1) + count * interval + 1;
      return Date.UTC(Math.floor(index / 12), index % 12, 1);
    }
    case 'yearly':
      return Date.UTC(anchor.year + count * interval + 1, 0, 1);
  }
}

function createExpansionState(
  options: ExpandSolarisRecurrenceOptions,
): ExpansionState {
  const { start, end, recurrence, timeZone } = options;
  const parsedStart = parseSolarisDateTimeMs(start);
  const allDay = parsedStart === null;
  const anchorCivil = resolveAnchorCivil(start, parsedStart, timeZone);
  const anchorTime = resolveAnchorTime(parsedStart, allDay, timeZone);
  const { durationMs, durationDays } = resolveDurations(
    end,
    allDay,
    anchorCivil,
    parsedStart,
  );
  const rangeStartMs = boundToMs(options.rangeStart, timeZone, 'rangeStart');
  const rangeEndMs = boundToMs(options.rangeEnd, timeZone, 'rangeEnd');
  if (rangeEndMs <= rangeStartMs) {
    throw new Error(
      'expandSolarisRecurrence requires rangeEnd after rangeStart.',
    );
  }
  const count = normalizeCount(recurrence.count);
  const { untilMs, untilCivil } = normalizeUntil(recurrence.until);
  const interval = normalizeInterval(recurrence.interval);
  const anchorWeekday = weekdayOfCivil(anchorCivil);
  const scanBase =
    parsedStart ??
    Date.UTC(anchorCivil.year, anchorCivil.month - 1, anchorCivil.day);
  const horizonMs = Math.min(
    rangeEndMs,
    untilMs ?? Number.POSITIVE_INFINITY,
    countHorizonMs(anchorCivil, recurrence.freq, count, interval),
  );
  const segments = buildOffsetSegments(
    timeZone,
    scanBase - SEGMENT_PAD_MS - MAX_ZONE_SHIFT_MS,
    horizonMs + SEGMENT_PAD_MS,
  );
  const state: ExpansionState = {
    timeZone,
    allDay,
    anchorCivil,
    anchorTime,
    anchorInstant: 0,
    durationMs,
    durationDays,
    rangeStartMs,
    rangeEndMs,
    count,
    untilMs,
    untilCivil,
    interval,
    freq: recurrence.freq,
    monthDay: normalizeMonthDay(recurrence.monthDay, anchorCivil.day),
    byMonthDay: normalizeByMonthDay(recurrence.byMonthDay),
    byMonth: normalizeByMonth(recurrence.byMonth),
    bySetPos: normalizeBySetPos(recurrence.bySetPos),
    anchorWeekday,
    byWeekday: normalizeByWeekday(recurrence.byWeekday, anchorWeekday),
    anchorMonthIndex: anchorCivil.year * 12 + (anchorCivil.month - 1),
    exceptions: normalizeExceptionDates(options.exceptionDates, timeZone),
    segments,
    hintOffset: 0,
    scanned: 0,
    seriesCount: 0,
  };
  state.anchorInstant =
    parsedStart ?? resolveCandidate(state, anchorCivil).instant;
  state.hintOffset = offsetAt(segments, state.anchorInstant);
  return state;
}

function resolveCandidate(
  state: ExpansionState,
  civil: CivilDate,
): { instant: number; offset: number } {
  const wallAsUtcMs = Date.UTC(
    civil.year,
    civil.month - 1,
    civil.day,
    state.anchorTime.hour,
    state.anchorTime.minute,
    state.anchorTime.second,
  );
  let assumed = state.hintOffset;
  let instant = wallAsUtcMs - assumed * MS_PER_MINUTE;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = offsetAt(state.segments, instant);
    if (actual === assumed) break;
    assumed = actual;
    instant = wallAsUtcMs - assumed * MS_PER_MINUTE;
  }
  state.hintOffset = offsetAt(state.segments, instant);
  return { instant, offset: state.hintOffset };
}

function monthWeekdayMatches(
  year: number,
  month: number,
  weekdays: number[],
): CivilDate[] {
  const total = daysInCivilMonth(year, month);
  const output: CivilDate[] = [];
  for (let day = 1; day <= total; day += 1) {
    const weekday = weekdayOfCivil({ year, month, day });
    if (weekdays.includes(weekday)) output.push({ year, month, day });
  }
  return output;
}

function applySetPos(dates: CivilDate[], positions: number[]): CivilDate[] {
  if (positions.length === 0) return dates;
  const picked: CivilDate[] = [];
  for (const pos of positions) {
    const index = pos > 0 ? pos - 1 : dates.length + pos;
    const match = dates[index];
    if (match !== undefined) picked.push(match);
  }
  return picked.sort(compareCivil);
}

function dailyCandidates(state: ExpansionState, ordinal: number): CivilDate[] {
  return [addDaysCivil(state.anchorCivil, ordinal * state.interval)];
}

function weeklyCandidates(state: ExpansionState, ordinal: number): CivilDate[] {
  const base = addDaysCivil(state.anchorCivil, ordinal * state.interval * 7);
  return state.byWeekday
    .map((day) => addDaysCivil(base, (day - state.anchorWeekday + 7) % 7))
    .filter((date) => compareCivil(date, state.anchorCivil) >= 0);
}

function monthIndexToYearMonth(index: number): { year: number; month: number } {
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

function monthlyCandidates(
  state: ExpansionState,
  ordinal: number,
): CivilDate[] {
  const { year, month } = monthIndexToYearMonth(
    state.anchorMonthIndex + ordinal * state.interval,
  );
  if (state.byMonth.length > 0 && !state.byMonth.includes(month)) return [];
  if (state.byMonthDay.length > 0) {
    return state.byMonthDay
      .filter((day) => day <= daysInCivilMonth(year, month))
      .map((day) => ({ year, month, day }));
  }
  if (state.bySetPos.length > 0) {
    return applySetPos(
      monthWeekdayMatches(year, month, state.byWeekday),
      state.bySetPos,
    );
  }
  if (state.monthDay > daysInCivilMonth(year, month)) return [];
  return [{ year, month, day: state.monthDay }];
}

function yearlyMonthCandidates(
  state: ExpansionState,
  year: number,
  month: number,
): CivilDate[] {
  if (state.byMonthDay.length > 0) {
    return state.byMonthDay
      .filter((day) => day <= daysInCivilMonth(year, month))
      .map((day) => ({ year, month, day }));
  }
  if (state.bySetPos.length > 0) {
    return applySetPos(
      monthWeekdayMatches(year, month, state.byWeekday),
      state.bySetPos,
    );
  }
  if (state.monthDay > daysInCivilMonth(year, month)) return [];
  return [{ year, month, day: state.monthDay }];
}

function yearlyCandidates(state: ExpansionState, ordinal: number): CivilDate[] {
  const year = state.anchorCivil.year + ordinal * state.interval;
  const months =
    state.byMonth.length > 0 ? state.byMonth : [state.anchorCivil.month];
  return months
    .flatMap((month) => yearlyMonthCandidates(state, year, month))
    .sort(compareCivil);
}

function candidatesForOrdinal(
  state: ExpansionState,
  ordinal: number,
): CivilDate[] {
  switch (state.freq) {
    case 'daily':
      return dailyCandidates(state, ordinal);
    case 'weekly':
      return weeklyCandidates(state, ordinal);
    case 'monthly':
      return monthlyCandidates(state, ordinal);
    case 'yearly':
      return yearlyCandidates(state, ordinal);
  }
}

function processCandidate(
  state: ExpansionState,
  civil: CivilDate,
  collected: CollectedOccurrence[],
): boolean {
  const civilStr = civilToString(civil);
  if (state.untilCivil !== null && civilStr > state.untilCivil) return true;
  const { instant, offset } = resolveCandidate(state, civil);
  if (instant < state.anchorInstant) return false;
  if (state.untilMs !== null && instant > state.untilMs) return true;
  state.seriesCount += 1;
  if (state.count !== null && state.seriesCount > state.count) return true;
  if (instant >= state.rangeEndMs) return true;
  if (collected.length >= SOLARIS_RECURRENCE_MAX_RESULTS) {
    throw new Error('expandSolarisRecurrence exceeded the result budget.');
  }
  if (instant < state.rangeStartMs || state.exceptions.has(civilStr)) {
    return false;
  }
  collected.push({ instant, offset, civil: civilStr });
  return false;
}

function collectOccurrences(state: ExpansionState): CollectedOccurrence[] {
  const collected: CollectedOccurrence[] = [];
  let ordinal = 0;
  for (;;) {
    if (state.scanned >= MAX_SCANNED_CANDIDATES) {
      throw new Error(
        'expandSolarisRecurrence exceeded the candidate scan budget.',
      );
    }
    const batch = candidatesForOrdinal(state, ordinal);
    ordinal += 1;
    if (batch.length > 0) {
      for (const civil of batch) {
        state.scanned += 1;
        if (processCandidate(state, civil, collected)) {
          return collected;
        }
      }
    }
  }
}

function applyOverride(
  override: SolarisRecurrenceOverride,
  durationMs: number,
  dropped: Set<string>,
  rescheduled: Map<string, { startMs: number; endMs: number }>,
): void {
  if (parseSolarisDateParts(override.date) === null) {
    throw new Error(
      `expandSolarisRecurrence requires date-only override dates, got ${override.date}.`,
    );
  }
  if (override.cancelled === true) {
    dropped.add(override.date);
    return;
  }
  if (override.start === undefined) return;
  const startMs = parseSolarisDateTimeMs(override.start);
  if (startMs === null) {
    throw new Error(
      `expandSolarisRecurrence requires valid ISO override start, got ${override.start}.`,
    );
  }
  const endMs =
    override.end === undefined
      ? startMs + durationMs
      : parseSolarisDateTimeMs(override.end);
  if (endMs === null || endMs < startMs) {
    throw new Error(
      `expandSolarisRecurrence requires valid ISO override end, got ${override.end}.`,
    );
  }
  rescheduled.set(override.date, { startMs, endMs });
}

function normalizeOverrides(
  overrides: readonly SolarisRecurrenceOverride[],
  durationMs: number,
): NormalizedOverrides {
  const dropped = new Set<string>();
  const rescheduled = new Map<string, { startMs: number; endMs: number }>();
  for (const override of overrides) {
    applyOverride(override, durationMs, dropped, rescheduled);
  }
  return { dropped, rescheduled };
}

function formatOccurrence(
  state: ExpansionState,
  item: CollectedOccurrence,
  dropped: Set<string>,
  rescheduled: Map<string, { startMs: number; endMs: number }>,
): SolarisCalendarOccurrence | null {
  if (dropped.has(item.civil)) return null;
  if (state.allDay) {
    const endCivil = addDaysToSolarisDate(item.civil, state.durationDays);
    return { start: item.civil, end: endCivil ?? item.civil };
  }
  const moved = rescheduled.get(item.civil);
  if (moved === undefined) {
    return {
      start: formatInstant(item.instant, item.offset, 0),
      end: formatEnd(item.instant, item.offset, state.durationMs),
    };
  }
  return {
    start: toSolarisDateTimeValue(moved.startMs, state.timeZone),
    end: toSolarisDateTimeValue(moved.endMs, state.timeZone),
    overriddenFrom: formatInstant(item.instant, item.offset, 0),
  };
}

function formatCollected(
  state: ExpansionState,
  overrides: readonly SolarisRecurrenceOverride[],
  items: CollectedOccurrence[],
): SolarisCalendarOccurrence[] {
  const { dropped, rescheduled } = normalizeOverrides(
    overrides,
    state.durationMs,
  );
  const output: SolarisCalendarOccurrence[] = [];
  for (const item of items) {
    const formatted = formatOccurrence(state, item, dropped, rescheduled);
    if (formatted !== null) output.push(formatted);
  }
  return output;
}

export function expandSolarisRecurrence(
  options: ExpandSolarisRecurrenceOptions,
): SolarisCalendarOccurrence[] {
  const state = createExpansionState(options);
  const collected = collectOccurrences(state);
  return formatCollected(state, options.overrides ?? [], collected);
}
