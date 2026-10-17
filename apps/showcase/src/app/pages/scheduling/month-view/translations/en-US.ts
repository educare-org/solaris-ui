export const EN_US_MONTH_VIEW: Record<string, string> = {
  'month-view.title': 'Month View',
  'month-view.description':
    'Six-week grid with events, tasks, and holidays, keyboard navigation, and an overflow popover.',
  'month-view.section.examples': 'Examples',
  'month-view.section.size-density': 'Size and density',
  'month-view.section.locales': 'Locales',
  'month-view.section.drag': 'Drag and drop',
  'month-view.section.installation': 'Installation',
  'month-view.section.props': 'Props',
  'month-view.examples.note':
    'Use the toolbar to change months. The grid expands recurrences, holidays come from the built-in provider, and the log below shows emitted events.',
  'month-view.drag.note':
    'Drag an empty day span to propose a create, or drag a chip to another day to propose a move. Keyboard parity: arrows move the proposal, Enter confirms, Escape cancels. The lib never mutates the array — proposals land in the log below.',
  'month-view.toolbar.previous': 'Previous month',
  'month-view.toolbar.today': 'Today',
  'month-view.toolbar.next': 'Next month',
  'month-view.size-density.note':
    'Size and density drive the day circle, chip text, and cell height.',
  'month-view.locales.note':
    'Weekdays, months, and helper texts follow the selected locale.',
  'month-view.installation.note':
    'Install the package and import the standalone month view component.',
  'month-view.props.note':
    'Pass events (the lib expands recurrence without mutating the array), tasks, resolved holidays, and the display time zone.',
};
