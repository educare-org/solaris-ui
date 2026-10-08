export const EN_US_GRADEBOOK: Record<string, string> = {
  'gradebook.title': 'Gradebook',
  'gradebook.description':
    'Grade matrix with semester groups, result badges, and inline grade editing.',

  'gradebook.section.examples': 'Examples',
  'gradebook.section.basic': 'Basic',
  'gradebook.section.semesters': 'Semesters',
  'gradebook.section.scales': 'Scales',
  'gradebook.section.statuses': 'Cell status',
  'gradebook.section.totals': 'Totals',
  'gradebook.section.editing': 'Editing',
  'gradebook.section.breakdown': 'Grade breakdown',
  'gradebook.section.layout': 'Layout',
  'gradebook.section.server': 'Server data',
  'gradebook.section.composed': 'With pagination',
  'gradebook.section.legend': 'Legend',
  'gradebook.section.installation': 'Installation',
  'gradebook.section.props': 'Props',

  'gradebook.examples.note':
    'Start with the default gradebook, then explore semesters, editing, and server data below.',
  'gradebook.basic.note':
    'Identity column with sticky first cell, grade columns with maxima, and footer averages.',
  'gradebook.semesters.note':
    'Consecutive grade columns merge under semester groups (1st and 2nd); the result group carries MP and SITUAÇÃO. Use the tabs to pin the first column, both edges, or none.',
  'gradebook.semesters.sticky.label': 'Sticky columns',
  'gradebook.semesters.sticky.both': 'First and last',
  'gradebook.semesters.sticky.first': 'First only',
  'gradebook.semesters.sticky.none': 'None',
  'gradebook.semesters.scroll.hint':
    'Scroll the table sideways to see the sticky columns in action.',
  'gradebook.statuses.note':
    'Each cell carries a status (graded, late, missing, excused) with a subtle dot next to the number and a screen-reader label; never color-only.',
  'gradebook.totals.note':
    'The footer can be computed inside the gradebook with aggregate (average, sum, min, max, median, or weighted); an explicit footerValueOf always wins. The MP column is computed per row from GS1 and GS2, with no typing. Enable the MÁX columns and switch rounding to see the footer effect.',
  'gradebook.totals.aggregate.label': 'Footer aggregation',
  'gradebook.totals.aggregate.average': 'Average',
  'gradebook.totals.aggregate.sum': 'Sum',
  'gradebook.totals.aggregate.max': 'Max',
  'gradebook.totals.max.label': 'Show MÁX columns',
  'gradebook.totals.rounding.label': 'Rounding',
  'gradebook.totals.rounding.standard': 'Scale default',
  'gradebook.totals.rounding.up': 'Always up',
  'gradebook.totals.rounding.down': 'Always down',
  'gradebook.scales.note':
    'Switch the grade scale; formatting, parsing, and sorting follow the active scale.',
  'gradebook.scales.label': 'Grade scale',
  'gradebook.scales.tab.concept': 'Concept',
  'gradebook.scales.tab.banded': 'Banded',
  'gradebook.editing.note':
    'Enter or double-click a grade to edit; committing updates the rows owned by the consumer. With multiple selection use bulk commit; with paste enabled you can paste values from Excel.',
  'gradebook.editing.bulk.assignment': 'Assignment',
  'gradebook.editing.bulk.value': 'Grade',
  'gradebook.editing.bulk.apply': 'Apply to {{ count }} selected',
  'gradebook.editing.bulk.hint':
    'Select rows, enter the grade, and apply it in bulk. You can also paste an Excel column straight into the editor.',
  'gradebook.editor.label': 'Edit grade',
  'gradebook.breakdown.note':
    'MP combines FT+AT, GS1 and GS2; “+” opens a dialog with the parts and the result.',
  'gradebook.breakdown.open.label': 'View grade breakdown',
  'gradebook.breakdown.dialog.title': 'Grade breakdown',
  'gradebook.breakdown.dialog.result': 'Final MP',
  'gradebook.breakdown.dialog.close': 'Close',
  'gradebook.layout.note':
    'Auto sizes columns to content. Full width distributes them across the container.',
  'gradebook.layout.label': 'Column layout',
  'gradebook.layout.tab.auto': 'Auto',
  'gradebook.layout.tab.full': 'Full width',
  'gradebook.server.note':
    'A simulated server owns rows, total, and loading through SolarisTableDataSource.',
  'gradebook.composed.note':
    'Pagination is projected into the table footer slot, so it shares the gradebook border.',
  'gradebook.legend.note':
    'A dotted legend explains result and status badges at a glance.',
  'gradebook.legend.label': 'Result legend',
  'gradebook.legend.approved': 'Approved',
  'gradebook.legend.exam': 'Exam',
  'gradebook.legend.missing': 'Missing grade',
  'gradebook.installation.note':
    'Install the single Solaris package, then import the component.',
  'gradebook.props.note': 'Props table coming soon.',

  'gradebook.col.subject': 'Subject',
  'gradebook.col.ftat': 'FT + AT',
  'gradebook.col.gs1': 'GS1',
  'gradebook.col.gs2': 'GS2',
  'gradebook.col.mp': 'MP',
  'gradebook.col.result': 'SITUAÇÃO',
  'gradebook.group.semester1': '1º Semestre',
  'gradebook.group.semester2': '2º Semestre',
  'gradebook.group.result': 'Resultado',
  'gradebook.hint.gs1': 'Global Solution, project grade up to 20 points.',
  'gradebook.hint.gs2':
    'Second-semester Global Solution, project grade up to 20 points.',
  'gradebook.status.missing': 'Missing',
  'gradebook.status.late': 'Late',
  'gradebook.status.excused': 'Excused',

  'gradebook.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
