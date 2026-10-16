export const EN_US_SCHEDULE_VIEW: Record<string, string> = {
  'schedule-view.title': 'Schedule View',
  'schedule-view.description':
    'Chronological day-grouped agenda with windowed pagination. The default below 640px.',
  'schedule-view.section.examples': 'Examples',
  'schedule-view.section.size-density': 'Size and density',
  'schedule-view.section.locales': 'Locales',
  'schedule-view.section.installation': 'Installation',
  'schedule-view.section.props': 'Props',
  'schedule-view.examples.note':
    'Paginate with the toolbar inside the agenda. Only the visible window renders: switch to the 1000-event dataset and watch the DOM stay bounded.',
  'schedule-view.window.label': 'Window days',
  'schedule-view.dataset.label': 'Dataset',
  'schedule-view.dataset.sample': 'Sample',
  'schedule-view.dataset.stress': '1000 events',
  'schedule-view.size-density.note':
    'Size drives day badges and item text while density drives day padding.',
  'schedule-view.locales.note':
    'Days, times, and helper texts follow the selected locale.',
  'schedule-view.installation.note':
    'Install the package and import the standalone schedule view component.',
  'schedule-view.props.note':
    'Pass events (recurrence expands inside the window only, the array is never mutated), tasks, and resolved holidays. Day clicks never move the window anchor; pagination is explicit.',
};
