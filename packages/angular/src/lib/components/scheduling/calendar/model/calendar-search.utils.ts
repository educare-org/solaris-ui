import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
} from './calendar.types';

export interface SolarisCalendarSearchHit {
  readonly kind: 'event' | 'task';
  readonly id: string;
  readonly title: string;
  readonly date: string;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function searchSolarisCalendar(
  events: readonly SolarisCalendarEvent[],
  tasks: readonly SolarisCalendarTask[],
  query: string,
  limit = 50,
): SolarisCalendarSearchHit[] {
  const needle = normalizeText(query.trim());
  if (needle.length === 0) return [];
  const output: SolarisCalendarSearchHit[] = [];
  const push = (hit: SolarisCalendarSearchHit): void => {
    if (output.length < limit) output.push(hit);
  };
  for (const event of events) {
    const haystack = normalizeText(
      `${event.title} ${event.description ?? ''} ${event.meetingUrl ?? ''} ${(event.attendees ?? []).map((attendee) => `${attendee.displayName ?? ''} ${attendee.email}`).join(' ')}`,
    );
    if (haystack.includes(needle)) {
      push({
        kind: 'event',
        id: event.id,
        title: event.title,
        date: event.start,
      });
    }
    if (output.length >= limit) return output;
  }
  for (const task of tasks) {
    const haystack = normalizeText(`${task.title} ${task.description ?? ''}`);
    if (haystack.includes(needle)) {
      push({ kind: 'task', id: task.id, title: task.title, date: task.due });
    }
    if (output.length >= limit) return output;
  }
  return output;
}

export interface SolarisCalendarInsights {
  readonly totalEvents: number;
  readonly totalTasks: number;
  readonly completedTasks: number;
  readonly busiestDay: string | null;
  readonly totalHours: number;
}

export function inspectSolarisCalendar(
  events: readonly SolarisCalendarEvent[],
  tasks: readonly SolarisCalendarTask[],
): SolarisCalendarInsights {
  const perDay = new Map<string, number>();
  let totalHours = 0;
  for (const event of events) {
    const day = event.start.slice(0, 10);
    perDay.set(day, (perDay.get(day) ?? 0) + 1);
    const startMs = Date.parse(event.start);
    const endMs = Date.parse(event.end);
    if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs > startMs) {
      totalHours += (endMs - startMs) / 3_600_000;
    }
  }
  let busiestDay: string | null = null;
  let busiestCount = 0;
  for (const [day, count] of perDay) {
    if (count > busiestCount) {
      busiestCount = count;
      busiestDay = day;
    }
  }
  return {
    totalEvents: events.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.completed).length,
    busiestDay,
    totalHours: Math.round(totalHours * 100) / 100,
  };
}
