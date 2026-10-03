import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const passwordFieldEnUs: SolarisTranslationMap = {
  'password-field.title': 'Password Field',
  'password-field.description':
    'Form Field preset for passwords with built-in visibility toggle, policy validation, requirements list, and strength indicator. Composes Form Field + Input.',
  'password-field.section.examples': 'Examples',
  'password-field.section.size-density': 'Size & density',
  'password-field.section.sizes': 'Sizes',
  'password-field.section.density': 'Density',
  'password-field.section.appearances': 'Appearances',
  'password-field.section.radius': 'Radius',
  'password-field.section.states': 'States',
  'password-field.section.affix': 'Prefix, suffix and actions',
  'password-field.section.toggle': 'Visibility toggle',
  'password-field.section.requirements': 'Requirements and strength',
  'password-field.section.installation': 'Installation',
  'password-field.section.props': 'Props',
  'password-field.examples.note':
    'Basic password field with autocomplete for the login context.',
  'password-field.demo.label': 'Password',
  'password-field.demo.placeholder': 'Enter your password',
  'password-field.size-density.note':
    'Size and density combine into a 3x3 matrix: the inner Form Field owns the outer height while the preset keeps font and padding in sync. The toggle icon scales with the same matrix.',
  'password-field.size.sm': 'Small',
  'password-field.size.md': 'Medium',
  'password-field.size.lg': 'Large',
  'password-field.density.compact': 'Compact',
  'password-field.density.normal': 'Normal',
  'password-field.density.comfortable': 'Comfortable',
  'password-field.appearance.outline': 'Outline',
  'password-field.appearance.surface': 'Surface',
  'password-field.appearance.filled': 'Filled',
  'password-field.radius.note':
    'Radius is delegated to the inner Form Field: md maps to 8px and lg renders as a pill.',
  'password-field.radius.none': 'None',
  'password-field.radius.sm': 'Small',
  'password-field.radius.md': 'Medium',
  'password-field.radius.lg': 'Large',
  'password-field.states.note':
    'Disabled and readonly are real, not visual-only. Loading renders a spinner overlay in the suffix slot without shifting the layout.',
  'password-field.states.default': 'Default',
  'password-field.states.invalid': 'Invalid',
  'password-field.states.disabled': 'Disabled',
  'password-field.states.readonly': 'Readonly',
  'password-field.states.loading': 'Loading',
  'password-field.error.invalid': 'This field has an error.',
  'password-field.affix.note':
    'Prefix and suffix icons via inputs. The built-in visibility toggle is already a suffix action; custom interactive content uses the same slot with both [solaris-form-suffix] and [solaris-form-suffix-action].',
  'password-field.affix.prefix-label': 'Password with prefix',
  'password-field.affix.action-label': 'Password with action',
  'password-field.affix.action': 'Generate',
  'password-field.toggle.note':
    'The built-in toggle is a suffix action: no divider, action variant, and an icon sized by the 9-combo size x density matrix. Hide it with [showToggle]="false" and bind [visible] for a controlled field.',
  'password-field.toggle.hidden-label': 'Password without toggle',
  'password-field.requirements.note':
    'Provide a policy with [showRequirements] for the checklist and [showStrength] for the heuristic meter. minLength and maxLength fold into the effective policy. Works with Reactive Forms through ControlValueAccessor and solarisPasswordValidator.',
  'password-field.requirements.registration-label': 'New password',
  'password-field.requirements.strength-label': 'Password with strength',
  'password-field.requirements.hint': 'Create a strong password.',
  'password-field.installation.note':
    'Install the Solaris UI package and import the password field component.',
  'password-field.props.note':
    'Props table coming soon with the table component.',
  'password-field.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
  'solaris.password-field.toggle.show': 'Show password',
  'solaris.password-field.toggle.hide': 'Hide password',
  'solaris.password-field.strength.weak': 'Weak',
  'solaris.password-field.strength.medium': 'Medium',
  'solaris.password-field.strength.strong': 'Strong',
  'solaris.password-field.requirement.minLength':
    'At least {{ count }} characters.',
  'solaris.password-field.requirement.maxLength':
    'At most {{ count }} characters.',
  'solaris.password-field.requirement.lowercase': 'One lowercase letter.',
  'solaris.password-field.requirement.uppercase': 'One uppercase letter.',
  'solaris.password-field.requirement.number': 'One number.',
  'solaris.password-field.requirement.symbol': 'One symbol.',
  'solaris.password-field.requirement.noWhitespace': 'No spaces.',
};
