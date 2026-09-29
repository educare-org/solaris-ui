export const EN_US_ICON_BUTTON: Record<string, string> = {
  'icon-button.title': 'Icon Button',
  'icon-button.description':
    'Attribute directive that turns buttons and anchors into icon-only Solaris-themed action buttons.',
  'icon-button.appearances': 'Appearances',
  'icon-button.colors': 'Colors',
  'icon-button.shape': 'Shape',
  'icon-button.radius': 'Radius',
  'icon-button.density': 'Density',
  'icon-button.states': 'States',
  'icon-button.states-default': 'Default States',
  'icon-button.states-toggle': 'Interactive',
  'icon-button.anchor': 'Anchor (link)',
  'icon-button.accessible-name': 'Accessible Name',
  'icon-button.accessible-name-note':
    'Both aria-label and aria-labelledby provide an accessible name for screen readers. Use aria-label directly on the button, or aria-labelledby to reference an element with the label text elsewhere in the DOM.',
  'icon-button.badge': 'With Badge',
  'icon-button.badge-note':
    'The badge is visual only. The accessible name of the icon button must include the badge context when relevant.',
  'icon-button.custom': 'Custom Color (CSS variables)',
  'icon-button.button-group': 'Button Group (future)',
  'icon-button.button-group-note':
    'Button Group is planned for a future release. It will support horizontal and vertical layout, disabled states, badge integration, icon-only buttons, separators, and active/selected states.',

  'icon-button.section.appearances': 'Appearance and color',
  'icon-button.section.colors': 'Colors',
  'icon-button.section.sizes': 'Sizes',
  'icon-button.section.density': 'Density',
  'icon-button.section.size-density': 'Size and density',
  'icon-button.section.shape-radius': 'Shape and radius',
  'icon-button.section.radius': 'Radius',
  'icon-button.section.shape': 'Shape',
  'icon-button.section.chromeless': 'Chromeless',
  'icon-button.section.states': 'States',
  'icon-button.section.badge': 'Badge',
  'icon-button.section.custom': 'Custom color',
  'icon-button.section.installation': 'Installation',
  'icon-button.section.props': 'Props',

  'icon-button.appearances.note':
    'Combine an appearance with a color. Appearances cover every emphasis level, from the solid CTA to subtle ghost actions.',
  'icon-button.size-density.note':
    'Size and density combine into a 3×3 matrix, just like the standard button. The outer height always equals the control-height token of the combination.',
  'icon-button.shape-radius.note':
    'Radius controls corner rounding; the wide shape stretches the button horizontally.',
  'icon-button.chromeless.note':
    'Chromeless keeps the size box, removes background and border, and enlarges the icon (60% of the box). The whole scales with size × density. Hover or press to see the micro-interaction.',
  'icon-button.custom.note':
    'Custom is not an arbitrary input. Define the custom color tokens in CSS.',
  'icon-button.installation.note':
    'Install the single Solaris package and import the directive.',
  'icon-button.props.note':
    'Props table coming soon, with the table component.',

  'icon-button.appearance.solid': 'Solid',
  'icon-button.appearance.outline': 'Outline',
  'icon-button.appearance.ghost': 'Ghost',
  'icon-button.appearance.tonal': 'Tonal',
  'icon-button.appearance.surface': 'Surface',

  'icon-button.color.neutral': 'Neutral',
  'icon-button.color.primary': 'Primary',
  'icon-button.color.success': 'Success',
  'icon-button.color.warning': 'Warning',
  'icon-button.color.danger': 'Danger',
  'icon-button.color.info': 'Info',

  'icon-button.size.sm': 'Small',
  'icon-button.size.md': 'Medium',
  'icon-button.size.lg': 'Large',

  'icon-button.density.compact': 'Compact',
  'icon-button.density.normal': 'Normal',
  'icon-button.density.comfortable': 'Comfortable',

  'icon-button.shape.normal': 'Normal',
  'icon-button.shape.wide': 'Wide',

  'icon-button.states.tab.loading': 'Loading',
  'icon-button.states.tab.disabled': 'Disabled',

  'icon-button.states.toggle.loading.on': 'Activate loading',
  'icon-button.states.toggle.loading.off': 'Deactivate loading',
  'icon-button.states.toggle.disabled.on': 'Disable',
  'icon-button.states.toggle.disabled.off': 'Enable',
};
