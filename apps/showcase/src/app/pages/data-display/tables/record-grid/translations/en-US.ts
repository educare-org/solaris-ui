export const EN_US_RECORD_GRID: Record<string, string> = {
  'record-grid.title': 'Record grid',
  'record-grid.description':
    'Launch sheet with sections, merged cells, and controlled editing with internal commit.',

  'record-grid.section.examples': 'Examples',
  'record-grid.section.basic': 'Basic',
  'record-grid.section.sections': 'Sections',
  'record-grid.section.merging': 'Merging',
  'record-grid.section.formulas': 'Formulas',
  'record-grid.section.editing': 'Editing',
  'record-grid.section.layout': 'Layout',
  'record-grid.section.installation': 'Installation',
  'record-grid.section.props': 'Props',

  'record-grid.examples.note':
    'Start with the default record grid, then explore sections, merging, and editing below.',
  'record-grid.basic.note':
    'Editable launch columns with a computed total; Enter or double-click a cell to edit.',
  'record-grid.sections.note':
    'Morning and evening shifts render as section dividers with per-group footer averages.',
  'record-grid.merging.note':
    'The shift cell spans its section rows and filled notes span the project column.',
  'record-grid.formulas.note':
    'Total and final columns react to edits; final weights total twice against project.',
  'record-grid.editing.note':
    'Values must stay between 0 and 10; every commit lands in the log below the grid.',
  'record-grid.editing.tabs.label': 'Editing mode',
  'record-grid.editing.tab.editable': 'Editable',
  'record-grid.editing.tab.readonly': 'Read-only',
  'record-grid.layout.note':
    'Auto sizes columns to content. Card collapses rows into consolidated fields.',
  'record-grid.installation.note':
    'Install the single Solaris package, then import the component.',
  'record-grid.props.note': 'Props table coming soon.',

  'record-grid.col.student': 'Student',
  'record-grid.col.shift': 'Shift',
  'record-grid.col.present': 'Present',
  'record-grid.col.project': 'Project',
  'record-grid.col.note': 'Note',
  'record-grid.col.total': 'Total',
  'record-grid.col.final': 'Final',
  'record-grid.shift.morning': 'Morning shift',
  'record-grid.shift.evening': 'Evening shift',

  'record-grid.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
