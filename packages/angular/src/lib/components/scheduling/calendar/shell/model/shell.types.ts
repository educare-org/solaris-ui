import type {
  SolarisCalendarEventColor,
  SolarisCalendarWeekStart,
} from '../../model/calendar.types';

export type SolarisCalendarView =
  | 'day'
  | 'week'
  | 'month'
  | 'year'
  | 'schedule'
  | 'custom';

export type SolarisCalendarDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisCalendarSize = 'sm' | 'md' | 'lg';

export type SolarisCalendarResponsiveFallback = 'schedule' | null;

export interface SolarisCalendarShellEventOpen {
  id: string;
  start: string;
}

export interface SolarisCalendarShellSlotSelect {
  date: string;
  hour: number;
}

export const SOLARIS_CALENDAR_VIEWS: readonly SolarisCalendarView[] = [
  'day',
  'week',
  'month',
  'year',
  'schedule',
  'custom',
];

export const SOLARIS_CALENDAR_CUSTOM_DAYS_MIN = 1;

export const SOLARIS_CALENDAR_CUSTOM_DAYS_MAX = 7;

export const SOLARIS_CALENDAR_NARROW_BREAKPOINT_PX = 640;

export type { SolarisCalendarEventColor, SolarisCalendarWeekStart };
