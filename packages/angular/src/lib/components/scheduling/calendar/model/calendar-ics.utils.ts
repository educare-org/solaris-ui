import type { SolarisCalendarEvent, SolarisRecurrence } from './calendar.types';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function toIcsDateTime(value: string): string {
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) return value.replace(/[-:]/g, '');
  const date = new Date(ms);
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}

function toIcsDate(value: string): string {
  return value.replace(/-/g, '');
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function unescapeIcsText(value: string): string {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

const WEEKDAY_TO_ICS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const ICS_TO_WEEKDAY: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

function recurrenceToRrule(recurrence: SolarisRecurrence): string {
  const parts = [`FREQ=${recurrence.freq.toUpperCase()}`];
  if (recurrence.interval !== undefined)
    parts.push(`INTERVAL=${recurrence.interval}`);
  if (recurrence.count !== undefined) parts.push(`COUNT=${recurrence.count}`);
  if (recurrence.until !== undefined) {
    parts.push(
      recurrence.until.includes('T')
        ? `UNTIL=${toIcsDateTime(recurrence.until)}`
        : `UNTIL;VALUE=DATE:${toIcsDate(recurrence.until)}`,
    );
  }
  if (recurrence.byWeekday !== undefined) {
    parts.push(
      `BYDAY=${recurrence.byWeekday.map((day) => WEEKDAY_TO_ICS[day]).join(',')}`,
    );
  }
  if (recurrence.byMonthDay !== undefined) {
    parts.push(`BYMONTHDAY=${recurrence.byMonthDay.join(',')}`);
  }
  if (recurrence.byMonth !== undefined) {
    parts.push(`BYMONTH=${recurrence.byMonth.join(',')}`);
  }
  if (recurrence.bySetPos !== undefined) {
    parts.push(`BYSETPOS=${recurrence.bySetPos.join(',')}`);
  }
  return parts.join(';');
}

// Why: ERP customers exchange schedules with Outlook/Google via ICS;
// the lib owns a dependency-free subset writer so consumers never hand-roll it.
export function exportSolarisToIcs(
  events: readonly SolarisCalendarEvent[],
): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Solaris//Calendar//EN',
  ];
  for (const event of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id}`);
    lines.push(`SUMMARY:${escapeIcsText(event.title)}`);
    if (event.allDay === true) {
      lines.push(`DTSTART;VALUE=DATE:${toIcsDate(event.start)}`);
      lines.push(`DTEND;VALUE=DATE:${toIcsDate(event.end)}`);
    } else {
      lines.push(`DTSTART:${toIcsDateTime(event.start)}`);
      lines.push(`DTEND:${toIcsDateTime(event.end)}`);
    }
    if (event.description !== undefined) {
      lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
    }
    if (event.meetingUrl !== undefined) {
      lines.push(`URL:${escapeIcsText(event.meetingUrl)}`);
    }
    if (event.recurrence !== undefined) {
      lines.push(`RRULE:${recurrenceToRrule(event.recurrence)}`);
    }
    for (const date of event.recurrenceExceptionDates ?? []) {
      lines.push(`EXDATE;VALUE=DATE:${toIcsDate(date)}`);
    }
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

function parseIcsDateTime(value: string): string | null {
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/.exec(
    value.trim(),
  );
  if (match === null) return null;
  return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}+00:00`;
}

function parseIcsDate(value: string): string | null {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(value.trim());
  if (match === null) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseRrule(value: string): SolarisRecurrence | undefined {
  const params = new Map<string, string>();
  for (const part of value.split(';')) {
    const separator = part.indexOf('=');
    if (separator > 0) {
      params.set(part.slice(0, separator), part.slice(separator + 1));
    }
  }
  const freqRaw = (params.get('FREQ') ?? '').toLowerCase();
  if (
    freqRaw !== 'daily' &&
    freqRaw !== 'weekly' &&
    freqRaw !== 'monthly' &&
    freqRaw !== 'yearly'
  ) {
    return undefined;
  }
  const recurrence: SolarisRecurrence = { freq: freqRaw };
  const interval = Number(params.get('INTERVAL'));
  if (Number.isInteger(interval) && interval > 0)
    recurrence.interval = interval;
  const count = Number(params.get('COUNT'));
  if (Number.isInteger(count) && count > 0) recurrence.count = count;
  const until = params.get('UNTIL');
  if (until !== undefined) {
    recurrence.until = until.includes('T')
      ? (parseIcsDateTime(until) ?? undefined)
      : (parseIcsDate(until) ?? undefined);
  }
  const byDay = params.get('BYDAY');
  if (byDay !== undefined) {
    const days = byDay
      .split(',')
      .map((token) => ICS_TO_WEEKDAY[token.trim()])
      .filter((day) => day !== undefined);
    if (days.length > 0) recurrence.byWeekday = days;
  }
  const byMonthDay = params.get('BYMONTHDAY');
  if (byMonthDay !== undefined) {
    const days = byMonthDay
      .split(',')
      .map(Number)
      .filter((day) => Number.isInteger(day));
    if (days.length > 0) recurrence.byMonthDay = days;
  }
  const byMonth = params.get('BYMONTH');
  if (byMonth !== undefined) {
    const months = byMonth
      .split(',')
      .map(Number)
      .filter((month) => month >= 1 && month <= 12);
    if (months.length > 0) recurrence.byMonth = months;
  }
  const bySetPos = params.get('BYSETPOS');
  if (bySetPos !== undefined) {
    const positions = bySetPos
      .split(',')
      .map(Number)
      .filter((pos) => Number.isInteger(pos) && pos !== 0);
    if (positions.length > 0) recurrence.bySetPos = positions;
  }
  return recurrence;
}

export function parseSolarisFromIcs(ics: string): SolarisCalendarEvent[] {
  const output: SolarisCalendarEvent[] = [];
  const blocks = ics.split(/BEGIN:VEVENT/i).slice(1);
  for (const block of blocks) {
    const body = block.split(/END:VEVENT/i)[0] ?? '';
    const fields = new Map<string, string>();
    for (const rawLine of body.split(/\r?\n/)) {
      const separator = rawLine.indexOf(':');
      if (separator > 0) {
        fields.set(
          rawLine.slice(0, separator).split(';')[0].toUpperCase(),
          rawLine.slice(separator + 1),
        );
      }
    }
    const uid = fields.get('UID');
    const summary = fields.get('SUMMARY');
    if (uid === undefined || summary === undefined) continue;
    const dtStartRaw = fields.get('DTSTART');
    const dtEndRaw = fields.get('DTEND');
    if (dtStartRaw === undefined || dtEndRaw === undefined) continue;
    const allDay = !dtStartRaw.includes('T');
    const start = allDay
      ? (parseIcsDate(dtStartRaw) ?? dtStartRaw)
      : (parseIcsDateTime(dtStartRaw) ?? dtStartRaw);
    const end = allDay
      ? (parseIcsDate(dtEndRaw) ?? dtEndRaw)
      : (parseIcsDateTime(dtEndRaw) ?? dtEndRaw);
    const rrule = fields.get('RRULE');
    output.push({
      id: uid,
      kind: 'event',
      title: unescapeIcsText(summary),
      start,
      end,
      allDay,
      description:
        fields.get('DESCRIPTION') !== undefined
          ? unescapeIcsText(fields.get('DESCRIPTION') ?? '')
          : undefined,
      meetingUrl:
        fields.get('URL') !== undefined
          ? unescapeIcsText(fields.get('URL') ?? '')
          : undefined,
      recurrence: rrule !== undefined ? parseRrule(rrule) : undefined,
    });
  }
  return output;
}
