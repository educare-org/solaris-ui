import type {
  SolarisCalendarEvent,
  SolarisCalendarTask,
  SolarisRecurrenceFrequency,
} from '../../model/calendar.types';

export type SolarisEventEditorSize = 'sm' | 'md' | 'lg';

export type SolarisEventEditorDensity = 'compact' | 'normal' | 'comfortable';

export type SolarisEventDeleteScope = 'this' | 'following' | 'all';

export type SolarisEventEditorFreq =
  | 'none'
  | SolarisRecurrenceFrequency
  | 'custom';

export type SolarisEventEditorEndsMode = 'never' | 'count' | 'until';

export type SolarisEventEditorItemKind = 'event' | 'task' | 'schedule';

export interface SolarisEventEditorReminderRow {
  readonly key: number;
  minutes: number;
  custom: boolean;
}

export interface SolarisEventDeleteRequest {
  readonly scope: SolarisEventDeleteScope;
  readonly eventId: string;
  readonly occurrenceStart: string | null;
}

export interface SolarisEventSaveRequest {
  readonly scope: SolarisEventDeleteScope;
  readonly occurrenceStart: string | null;
  readonly event: SolarisCalendarEvent | SolarisCalendarTask;
}

export interface SolarisEventEditorData {
  readonly event: SolarisCalendarEvent;
  readonly occurrenceStart?: string | null;
  readonly timeZone?: string;
  readonly locale?: string;
  readonly timeZoneOptions?: readonly string[];
}
