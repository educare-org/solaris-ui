export const EN_US_TABLE: Record<string, string> = {
  'table.title': 'Table',
  'table.description':
    'Lean data table with sorting, selection, and pluggable states.',

  'table.section.examples': 'Examples',
  'table.section.basic': 'Basic',
  'table.section.sorting': 'Sorting',
  'table.section.selection': 'Selection',
  'table.section.custom-cells': 'Custom cells',
  'table.section.people': 'People',
  'table.section.row-dialog': 'Row dialog',
  'table.section.responsive': 'Responsive',
  'table.section.cell-expand': 'Cell expansion',
  'table.section.appearance': 'Appearance',
  'table.section.wide': 'Many columns',
  'table.section.mobile': 'Mobile',
  'table.section.layout': 'Layout',
  'table.section.states': 'States',
  'table.section.server': 'Server data',
  'table.section.with-pagination': 'With pagination',
  'table.section.installation': 'Installation',
  'table.section.props': 'Props',

  'table.examples.note':
    'Start with the default table, then explore sorting, selection, and states below.',
  'table.basic.note': 'Text, number, and date columns with optional sorting.',
  'table.sorting.note':
    'Click a column header to cycle null, ascending, descending. Changes are announced to screen readers.',
  'table.selection.note':
    'Single swaps the selection, multiple toggles. The header checkbox is tri-state.',
  'table.custom-cells.note':
    'Cell and header templates render custom content with full row context.',
  'table.people.note':
    'Avatar and badge columns compose existing components through custom cell templates.',
  'table.row-dialog.note':
    'Cell buttons open a dialog for quick details without leaving the table.',
  'table.responsive.note':
    'On mobile (720px and below) priority columns collapse into an expandable detail row in the Actions column. Columns can also carry their own detail template with extra information.',
  'table.states.note':
    'Loading skeletons, empty text, and error alerts. Slots win over plain text.',
  'table.server.note':
    'A simulated server owns rows, total, and loading through SolarisTableDataSource.',
  'table.with-pagination.note':
    'Pagination is projected into the table footer slot, so it shares the table border.',
  'table.with-pagination.tab.default': 'Default',
  'table.with-pagination.tab.description': 'With description',
  'table.with-pagination.tab.mobile': 'Mobile',
  'table.installation.note':
    'Install the single Solaris package, then import the component.',
  'table.props.note': 'Props table coming soon.',

  'table.cell-expand.note':
    'Columns with expandable or a detail template render a chevron next to the value and open a detail row below with only that column.',
  'table.appearance.note':
    'Outline, surface, soft, and plain variants with even or odd striping.',
  'table.wide.note':
    'Wide tables scroll horizontally inside the viewport. Use fullWidth to distribute columns instead.',
  'table.mobile.note':
    'Phone-width table rendered as cards with no horizontal dragging. Sorting lives in the future filter bar; cards show plain labels.',
  'table.mobile-composed.note':
    'Cards compose avatar, badge, and action cells like the desktop table.',
  'table.layout.note':
    'Auto sizes columns to content. Full width distributes them across the container.',
  'table.layout.tab.auto': 'Auto',
  'table.layout.tab.full': 'Full width',

  'table.selection.tab.none': 'None',
  'table.selection.tab.single': 'Single',
  'table.selection.tab.multiple': 'Multiple',
  'table.states.tab.loading': 'Loading',
  'table.states.tab.empty': 'Empty',
  'table.states.tab.error': 'Error',

  'table.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
