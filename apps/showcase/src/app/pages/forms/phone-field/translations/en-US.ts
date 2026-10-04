import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const phoneFieldEnUs: SolarisTranslationMap = {
  'phone-field.title': 'Phone Field',
  'phone-field.description':
    'Form Field preset for phone numbers with a searchable country selector, as-you-type formatting, and a single E.164 value. Composes Form Field + Input.',
  'phone-field.section.examples': 'Examples',
  'phone-field.section.size-density': 'Size & density',
  'phone-field.section.sizes': 'Sizes',
  'phone-field.section.density': 'Density',
  'phone-field.section.appearances': 'Appearances',
  'phone-field.section.radius': 'Radius',
  'phone-field.section.states': 'States',
  'phone-field.section.clearable': 'Clearable',
  'phone-field.section.affix': 'Suffix and actions',
  'phone-field.section.countries': 'Countries and search',
  'phone-field.section.form': 'Form integration',
  'phone-field.section.installation': 'Installation',
  'phone-field.section.props': 'Props',
  'phone-field.examples.note':
    'Type a number to see it formatted as you type. The value is normalized to E.164 when valid.',
  'phone-field.demo.label': 'Phone',
  'phone-field.size-density.note':
    'Size and density combine into a 3x3 matrix: the inner Form Field owns the outer height while the preset keeps font and padding in sync.',
  'phone-field.size.sm': 'Small',
  'phone-field.size.md': 'Medium',
  'phone-field.size.lg': 'Large',
  'phone-field.density.compact': 'Compact',
  'phone-field.density.normal': 'Normal',
  'phone-field.density.comfortable': 'Comfortable',
  'phone-field.appearance.outline': 'Outline',
  'phone-field.appearance.surface': 'Surface',
  'phone-field.appearance.filled': 'Filled',
  'phone-field.radius.note':
    'Radius follows the global scale: md maps to 4px, lg to 8px, and xl renders as a pill.',
  'phone-field.radius.none': 'None',
  'phone-field.radius.sm': 'Small',
  'phone-field.radius.md': 'Medium',
  'phone-field.radius.lg': 'Large',
  'phone-field.radius.xl': 'Pill',
  'phone-field.states.note':
    'Disabled and readonly are real, not visual-only. Loading renders a spinner overlay in the suffix slot without shifting the layout.',
  'phone-field.states.default': 'Default',
  'phone-field.states.invalid': 'Invalid',
  'phone-field.states.disabled': 'Disabled',
  'phone-field.states.readonly': 'Readonly',
  'phone-field.states.loading': 'Loading',
  'phone-field.clearable.note':
    'With clearable, a clear button appears when the field has a value and emits cleared on click. It stays hidden while disabled, readonly, or loading.',
  'phone-field.clearable.label': 'Phone',
  'phone-field.error.invalid': 'This field has an error.',
  'phone-field.affix.note':
    'The prefix slot is owned by the country selector. Suffix icons go through the suffix input; interactive content uses the suffix-action slot with both [solaris-form-suffix] and [solaris-form-suffix-action].',
  'phone-field.affix.suffix-label': 'Phone with suffix',
  'phone-field.affix.action-label': 'Phone with action',
  'phone-field.affix.action': 'Verify',
  'phone-field.countries.note':
    'Open the prefix button to search and pick a country. Pass countryList to restrict the options and [searchable]="false" to hide the search box.',
  'phone-field.countries.restricted-label': 'Phone with restricted countries',
  'phone-field.countries.plain-label': 'Phone without search',
  'phone-field.form.note':
    'Works with Reactive Forms through ControlValueAccessor. The model value is a single E.164 string; pair with solarisPhoneValidator.',
  'phone-field.form.label': 'Phone',
  'phone-field.form.hint': 'Prefer a mobile number.',
  'phone-field.installation.note':
    'Install the Solaris UI package and import the phone field component.',
  'phone-field.props.note': 'Props table coming soon with the table component.',
  'phone-field.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
  'solaris.phone-field.clear': 'Clear phone number',
};
