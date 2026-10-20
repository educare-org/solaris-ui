export type SolarisCalendarItemKind = 'event' | 'task' | 'holiday';

export type SolarisCalendarEventColor =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent'
  | 'violet'
  | 'neutral';

export type SolarisRecurrenceFrequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export interface SolarisRecurrence {
  freq: SolarisRecurrenceFrequency;
  interval?: number;
  count?: number;
  until?: string;
  byWeekday?: number[];
  monthDay?: number;
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number[];
}

export interface SolarisEventReminder {
  minutesBefore: number;
}

export type SolarisEventVisibility = 'public' | 'private';

export type SolarisAttendeeStatus =
  | 'needsAction'
  | 'accepted'
  | 'declined'
  | 'tentative';

export interface SolarisEventAttendee {
  email: string;
  displayName?: string;
  status?: SolarisAttendeeStatus;
}

export type SolarisCalendarResourceKind = 'room' | 'equipment' | 'person';

export interface SolarisCalendarResource {
  id: string;
  kind: SolarisCalendarResourceKind;
  title: string;
}

export interface SolarisCalendarSource {
  id: string;
  title: string;
  color?: SolarisCalendarEventColor;
  visible?: boolean;
}

export interface SolarisCalendarEvent {
  id: string;
  kind: 'event';
  title: string;
  titleKey?: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: SolarisCalendarEventColor;
  recurrence?: SolarisRecurrence;
  recurrenceExceptionDates?: string[];
  calendarId?: string;
  visibility?: SolarisEventVisibility;
  reminders?: SolarisEventReminder[];
  description?: string;
  meetingUrl?: string;
  scheduleSlot?: boolean;
  attendees?: SolarisEventAttendee[];
  resources?: string[];
}

export interface SolarisCalendarTask {
  id: string;
  kind: 'task';
  title: string;
  titleKey?: string;
  due: string;
  completed: boolean;
  description?: string;
}

export interface SolarisHoliday {
  date: string;
  name: string;
  nameKey?: string;
}

export interface SolarisRecurrenceOverride {
  date: string;
  start?: string;
  end?: string;
  cancelled?: boolean;
}

export interface SolarisCalendarOccurrence {
  start: string;
  end: string;
  overriddenFrom?: string;
}

export type SolarisCalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
