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
}

export interface SolarisCalendarTask {
  id: string;
  kind: 'task';
  title: string;
  titleKey?: string;
  due: string;
  completed: boolean;
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
