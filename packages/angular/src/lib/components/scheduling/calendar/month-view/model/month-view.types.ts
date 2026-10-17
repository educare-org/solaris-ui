import type { SolarisCalendarEventColor } from '../../model/calendar.types';

export type SolarisMonthViewDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisMonthViewSize = 'sm' | 'md' | 'lg';

export type SolarisMonthViewItemKind = 'event' | 'task' | 'holiday';

export interface SolarisMonthViewEventOpen {
  id: string;
  start: string;
}

export interface SolarisMonthViewItem {
  kind: SolarisMonthViewItemKind;
  id: string | null;
  title: string;
  time: string | null;
  sortKey: number;
  allDay: boolean;
  color: SolarisCalendarEventColor;
  completed: boolean;
  occurrenceStart: string;
}

export interface SolarisMonthRange {
  start: string;
  end: string;
}

export interface SolarisMonthEventSpan {
  occurrenceStart: string;
  startCivil: string;
  endCivil: string;
}

export type SolarisMonthDragOrigin = 'pointer' | 'keyboard';

export type SolarisMonthDragMode = 'create' | 'move';

export interface SolarisMonthDragSession {
  origin: SolarisMonthDragOrigin;
  mode: SolarisMonthDragMode;
  anchorDate: string;
  grabDate: string;
  currentDate: string;
  eventId: string | null;
  occurrenceStart: string | null;
  title: string;
  allDay: boolean;
}

export interface SolarisMonthDragCandidate {
  mode: SolarisMonthDragMode;
  anchorDate: string;
  grabDate: string;
  eventId: string | null;
  occurrenceStart: string | null;
  title: string;
  allDay: boolean;
  pointerId: number;
  startX: number;
  startY: number;
}
