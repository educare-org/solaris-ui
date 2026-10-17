export const EN_US_WEEK_VIEW: Record<string, string> = {
  'week-view.title': 'Week View',
  'week-view.description':
    'Time-grid with one to seven visible days, an all-day row, overlapping event blocks, and a time-zone now-line.',
  'week-view.section.examples': 'Examples',
  'week-view.section.size-density': 'Size and density',
  'week-view.section.locales': 'Locales',
  'week-view.section.drag': 'Drag and drop',
  'week-view.section.installation': 'Installation',
  'week-view.section.props': 'Props',
  'week-view.examples.note':
    'Use the toolbar to move the visible range and switch between day, 3-day, 4-day, and week layouts. Clicking an hour slot emits the wall time in the display zone; the log below shows emitted events.',
  'week-view.drag.note':
    'Drag an empty slot span to propose a create, drag a block to propose a move, or drag its top/bottom edges to propose a resize. Keyboard parity: arrows move, Shift+arrows resize, Enter confirms, Escape cancels. The lib never mutates the array — proposals land in the log below.',
  'week-view.toolbar.previous': 'Previous',
  'week-view.toolbar.today': 'Today',
  'week-view.toolbar.next': 'Next',
  'week-view.days.label': 'Visible days',
  'week-view.allday.label': 'All-day row',
  'week-view.allday.on': 'On',
  'week-view.allday.off': 'Off',
  'week-view.size-density.note':
    'Size drives block text while density drives the hour height.',
  'week-view.locales.note':
    'Weekdays, hours, and helper texts follow the selected locale.',
  'week-view.installation.note':
    'Install the package and import the standalone week view component.',
  'week-view.props.note':
    'Pass events (the lib expands recurrence without mutating the array), tasks, resolved holidays, and the display time zone. Drag proposes creates, moves, and resizes with a snap step; year and schedule views stay click and keyboard only.',
};
