import { parseSolarisDateTimeMs } from './calendar-datetime.utils';
import type { SolarisCalendarEvent } from './calendar.types';

export interface SolarisDueReminder {
  readonly eventId: string;
  readonly title: string;
  readonly eventStart: string;
  readonly minutesBefore: number;
  readonly triggerMs: number;
}

// Why: the lib computes due reminders as pure data; the consumer owns
// delivery (toast/push), so no timers or Notification API live in the lib.
export function getSolarisDueReminders(
  events: readonly SolarisCalendarEvent[],
  nowMs: number,
  windowMs = 60_000,
): SolarisDueReminder[] {
  if (!Number.isFinite(nowMs) || !Number.isFinite(windowMs) || windowMs <= 0) {
    return [];
  }
  const output: SolarisDueReminder[] = [];
  for (const event of events) {
    if (event.allDay === true) continue;
    const startMs = parseSolarisDateTimeMs(event.start);
    if (startMs === null) continue;
    for (const reminder of event.reminders ?? []) {
      if (
        !Number.isInteger(reminder.minutesBefore) ||
        reminder.minutesBefore < 0
      ) {
        continue;
      }
      const triggerMs = startMs - reminder.minutesBefore * 60_000;
      if (nowMs >= triggerMs && nowMs < triggerMs + windowMs) {
        output.push({
          eventId: event.id,
          title: event.title,
          eventStart: event.start,
          minutesBefore: reminder.minutesBefore,
          triggerMs,
        });
      }
    }
  }
  return output.sort((first, second) => first.triggerMs - second.triggerMs);
}

export function nextSolarisReminderMs(
  events: readonly SolarisCalendarEvent[],
  nowMs: number,
): number | null {
  let next: number | null = null;
  for (const event of events) {
    if (event.allDay === true) continue;
    const startMs = parseSolarisDateTimeMs(event.start);
    if (startMs === null) continue;
    for (const reminder of event.reminders ?? []) {
      if (
        !Number.isInteger(reminder.minutesBefore) ||
        reminder.minutesBefore < 0
      ) {
        continue;
      }
      const triggerMs = startMs - reminder.minutesBefore * 60_000;
      if (triggerMs > nowMs && (next === null || triggerMs < next)) {
        next = triggerMs;
      }
    }
  }
  return next;
}
