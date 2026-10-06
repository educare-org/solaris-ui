export const EN_US_PAGINATION: Record<string, string> = {
  'pagination.title': 'Pagination',
  'pagination.description':
    'Standalone pagination with page-size selection and unknown-total support.',

  'pagination.section.examples': 'Examples',
  'pagination.section.basic': 'Basic',
  'pagination.section.page-size': 'Page size',
  'pagination.section.unknown-total': 'Unknown total',
  'pagination.section.density': 'Density',
  'pagination.section.installation': 'Installation',
  'pagination.section.props': 'Props',

  'pagination.examples.note':
    'Start with known-total paging, then explore page size and cursor mode.',
  'pagination.basic.note':
    'First, previous, next, and last controls with a Page X of Y range.',
  'pagination.page-size.note':
    'Page sizes render through solaris-select. Changing size resets to the first page.',
  'pagination.unknown-total.note':
    'Without a total, the range is compact and next follows hasMore.',
  'pagination.density.note':
    'Density is inherited from the theme system unless overridden.',
  'pagination.installation.note':
    'Install the single Solaris package, then import the component.',
  'pagination.props.note': 'Props table coming soon.',

  'pagination.density.compact': 'Compact',
  'pagination.density.normal': 'Normal',
  'pagination.density.comfortable': 'Comfortable',

  'pagination.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
