import type { SolarisCalendarEvent } from './calendar.types';

export type SolarisCalendarDragOccurrenceScope = 'single' | 'occurrence';

export interface SolarisCalendarEventCreateProposal {
  start: string;
  end: string;
  allDay: boolean;
}

export interface SolarisCalendarEventMoveProposal {
  id: string;
  start: string;
  end: string;
  occurrenceStart: string;
  occurrenceScope: SolarisCalendarDragOccurrenceScope;
}

export interface SolarisCalendarEventResizeProposal {
  id: string;
  start: string;
  end: string;
  occurrenceStart: string;
  occurrenceScope: SolarisCalendarDragOccurrenceScope;
}

export interface SolarisMonthMoveArgs {
  event: SolarisCalendarEvent;
  occurrenceStart: string;
  targetDate: string;
  timeZone: string;
  originDate?: string;
}

export interface SolarisWeekCreateArgs {
  anchorDate: string;
  anchorMinutes: number;
  currentDate: string;
  currentMinutes: number;
  stepMinutes: number;
  timeZone: string;
}

export interface SolarisWeekMoveArgs {
  event: SolarisCalendarEvent;
  occurrenceStart: string;
  occurrenceEnd: string;
  dayDelta: number;
  minuteDelta: number;
  timeZone: string;
}

export interface SolarisWeekResizeArgs {
  event: SolarisCalendarEvent;
  occurrenceStart: string;
  occurrenceEnd: string;
  edge: 'start' | 'end';
  minuteDelta: number;
  dayDelta?: number;
  minMinutes: number;
  timeZone: string;
}
