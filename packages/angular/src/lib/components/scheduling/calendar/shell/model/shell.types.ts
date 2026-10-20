import type {
  SolarisCalendarEvent,
  SolarisCalendarEventColor,
  SolarisCalendarTask,
  SolarisCalendarWeekStart,
} from '../../model/calendar.types';
import type { SolarisEventDeleteRequest } from '../../event-editor/model/event-editor.types';

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

export interface SolarisCalendarEditorDialogData {
  readonly event: SolarisCalendarEvent;
  readonly occurrenceStart: string | null;
  readonly timeZone: string;
  readonly timeZoneOptions: readonly string[];
  readonly locale: string;
  readonly size: SolarisCalendarSize;
  readonly density: SolarisCalendarDensity;
}

export interface SolarisCalendarEditorDialogResult {
  readonly kind: 'save' | 'delete' | 'cancel';
  readonly event?: SolarisCalendarEvent | SolarisCalendarTask;
  readonly request?: SolarisEventDeleteRequest;
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
