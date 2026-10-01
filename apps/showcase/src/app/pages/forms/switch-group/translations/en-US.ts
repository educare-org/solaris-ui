export const EN_US_SWITCH_GROUP: Record<string, string> = {
  'switch-group.title': 'Switch Group',
  'switch-group.description':
    'Groups related boolean settings. Each child switch represents a named boolean option. Value is Record<string, boolean>.',
  'switch-group.section.examples': 'Examples',
  'switch-group.section.size-density': 'Size & density',
  'switch-group.section.sizes': 'Sizes',
  'switch-group.section.density': 'Density',
  'switch-group.section.layouts': 'Layouts',
  'switch-group.section.states': 'States',
  'switch-group.section.validation': 'Validation',
  'switch-group.section.form': 'Form integration',
  'switch-group.section.installation': 'Installation',
  'switch-group.section.props': 'Props',
  'switch-group.examples.note':
    'A set of independent toggles sharing one FormControl. Children inherit the group size and density unless they set their own.',
  'switch-group.size-density.note':
    'The group owns size and density; every child follows unless it overrides one of them.',
  'switch-group.size.sm': 'Small',
  'switch-group.size.md': 'Medium',
  'switch-group.size.lg': 'Large',
  'switch-group.density.compact': 'Compact',
  'switch-group.density.normal': 'Normal',
  'switch-group.density.comfortable': 'Comfortable',
  'switch-group.layout.vertical': 'Vertical',
  'switch-group.layout.horizontal': 'Horizontal',
  'switch-group.layout.grid': 'Grid',
  'switch-group.validation.note':
    'Bounds are validated live: at least one and at most two channels must be enabled.',
  'switch-group.form-field-label': 'Channels',
  'switch-group.form-field-hint': 'These options affect your account.',
  'switch-group.installation.note':
    'Install the Solaris UI package and import the switch group components.',
  'switch-group.props.note':
    'Props table coming soon with the table component.',
  'switch-group.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
