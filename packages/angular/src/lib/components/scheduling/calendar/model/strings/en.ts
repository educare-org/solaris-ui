import type { SolarisCalendarStringKey } from './calendar-strings';

export const solarisCalendarStringsEn: Record<
  SolarisCalendarStringKey,
  string
> = {
  more: '{{count}} more',
  dayItems: '{{date}}, {{count}} items',
  moreItems: '{{count}} more items on {{date}}',
  task: '{{title}}, task {{state}}',
  taskCompleted: 'completed',
  taskOpen: 'not completed',
  allDay: 'All day',
  nowLine: 'Current time',
  timedEvent: '{{timeRange}}, {{title}}',
  timeSlot: '{{date}} at {{time}}',
  newEvent: 'New event',
  scheduleEmpty: 'No events scheduled',
  scheduleEmptyHint: 'Events in this window will appear here.',
  previousDays: 'Show previous {{count}} days',
  nextDays: 'Show next {{count}} days',
  today: 'Today',
  dragCreateStart:
    'Creating an event from {{start}} to {{end}}. Release to confirm, Escape to cancel.',
  dragMoveStart:
    'Moving {{title}} from {{start}}. Release to confirm, Escape to cancel.',
  dragResizeStart:
    'Resizing {{title}} from {{start}}. Release to confirm, Escape to cancel.',
  dragChange: '{{label}}',
  dragCreateCommit: 'Event created from {{start}} to {{end}}.',
  dragMoveCommit: '{{title}} moved to {{label}}.',
  dragResizeCommit: '{{title}} resized to {{label}}.',
  dragCancel: 'Drag cancelled. No changes were made.',
  shellPrevious: 'Previous',
  shellNext: 'Next',
  viewDay: 'Day',
  viewWeek: 'Week',
  viewMonth: 'Month',
  viewYear: 'Year',
  viewSchedule: 'Schedule',
  viewCustom: 'Custom',
  showWeekends: 'Show weekends',
  showHolidays: 'Show holidays',
  displayOptions: 'Display options',
  timeZone: 'Time zone',
  customDays: 'Displayed days',
  shellNavigation: 'Calendar navigation',
  miniCalendar: 'Mini calendar',
};
