import type { SolarisCalendarEventColor } from '../../model/calendar.types';

export const SOLARIS_EVENT_EDITOR_COLOR_OPTIONS: readonly SolarisCalendarEventColor[] =
  [
    'primary',
    'success',
    'warning',
    'danger',
    'info',
    'accent',
    'violet',
    'neutral',
  ];

export const SOLARIS_EVENT_EDITOR_REMINDER_PRESETS: readonly number[] = [
  0, 5, 10, 15, 30, 60, 1440,
];

export const SOLARIS_EVENT_EDITOR_MAX_REMINDERS = 5;

export const SOLARIS_EVENT_EDITOR_CURATED_TIME_ZONES: readonly string[] = [
  'America/Sao_Paulo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Mexico_City',
  'America/Buenos_Aires',
  'America/Santiago',
  'Atlantic/Azores',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Lagos',
  'Africa/Cairo',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];
