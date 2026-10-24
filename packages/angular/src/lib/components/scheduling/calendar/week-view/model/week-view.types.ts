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
  occurrenceEnd: string;
  startMs: number;
  endMs: number;
  column: number;
  columns: number;
}

export interface SolarisWeekDayColumn {
  date: string;
  blocks: SolarisWeekViewBlock[];
  allDay: SolarisWeekViewAllDayItem[];
  nowTop: number | null;
}

export interface SolarisWeekTimedPart {
  id: string;
  title: string;
  color: SolarisWeekViewBlock['color'];
  occurrenceStart: string;
  occurrenceEnd: string;
  startMs: number;
  endMs: number;
}

export interface SolarisWeekFocusedSlot {
  date: string;
  hour: number;
}

export type SolarisWeekDragMode = 'create' | 'move' | 'resize';

export type SolarisWeekDragOrigin = 'pointer' | 'keyboard';

export type SolarisWeekResizeEdge = 'start' | 'end';

export interface SolarisWeekDragSession {
  origin: SolarisWeekDragOrigin;
  mode: SolarisWeekDragMode;
  allDay: boolean;
  anchorDate: string;
  anchorMinutes: number;
  currentDate: string;
  currentMinutes: number;
  edge: SolarisWeekResizeEdge | null;
  eventId: string | null;
  occurrenceStart: string | null;
  occurrenceEnd: string | null;
  title: string;
}

export interface SolarisWeekDragCandidate extends SolarisWeekDragSession {
  pointerId: number;
  startX: number;
  startY: number;
}

export interface SolarisWeekGhostSegment {
  date: string;
  top: number;
  height: number;
}
