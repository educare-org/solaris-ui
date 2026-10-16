import type { SolarisCalendarEventColor } from '../../model/calendar.types';

export type SolarisWeekViewDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisWeekViewSize = 'sm' | 'md' | 'lg';

export type SolarisWeekViewVisibleDays = 1 | 3 | 4 | 7;

export type SolarisWeekViewAllDayKind = 'event' | 'task' | 'holiday';

export interface SolarisWeekViewEventOpen {
  id: string;
  start: string;
}

export interface SolarisWeekViewSlotSelect {
  date: string;
  time: string;
}

export interface SolarisWeekViewAllDayItem {
  kind: SolarisWeekViewAllDayKind;
  id: string | null;
  title: string;
  time: string | null;
  allDay: boolean;
  color: SolarisCalendarEventColor;
  completed: boolean;
  occurrenceStart: string;
}

export interface SolarisWeekViewBlock {
  id: string;
  title: string;
  color: SolarisCalendarEventColor;
  occurrenceStart: string;
  startMs: number;
  endMs: number;
  column: number;
  columns: number;
}
