export const EN_US_EVENT_EDITOR: Record<string, string> = {
  'event-editor.title': 'Event Editor',
  'event-editor.description':
    'Dialog-hosted event form with recurrence editor and scoped delete. The default way to create and edit events.',
  'event-editor.section.examples': 'Examples',
  'event-editor.section.locales': 'Locales',
  'event-editor.section.installation': 'Installation',
  'event-editor.section.props': 'Props',
  'event-editor.examples.note':
    'Open the editor through the dialog service. Save emits an immutable draft; delete emits a scope request resolved with resolveSolarisEventDelete; the consumer array is never mutated.',
  'event-editor.open.single': 'Edit single event',
  'event-editor.open.recurring': 'Edit recurring event',
  'event-editor.open.new': 'New event',
  'event-editor.dialog.new': 'New event',
  'event-editor.locales.note':
    'Title, dates, recurrence, and delete scope follow the selected locale.',
  'event-editor.installation.note':
    'Install the package and import the standalone event editor component.',
  'event-editor.props.note':
    'Pass the source event (never mutated), the edited occurrence, time zone, and locale. Outputs are eventSave, eventDelete(scope), and eventCancel.',
};
