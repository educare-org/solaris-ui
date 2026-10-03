import type { SolarisTranslationMap } from '@solaris-ui/angular';

export const otpInputEnUs: SolarisTranslationMap = {
  'otp-input.title': 'OTP Input',
  'otp-input.description':
    'A form control for one-time passwords with configurable min/max length, keyboard navigation, paste support, masking and visual grouping.',
  'otp-input.section.examples': 'Examples',
  'otp-input.section.sizes': 'Sizes',
  'otp-input.section.density': 'Density',
  'otp-input.section.size-density': 'Size & density',
  'otp-input.section.appearance': 'Appearance',
  'otp-input.section.states': 'States',
  'otp-input.section.length': 'Length',
  'otp-input.section.char-type': 'Character type',
  'otp-input.section.masking': 'Masking',
  'otp-input.section.separator': 'Separator',
  'otp-input.section.form': 'Form integration',
  'otp-input.section.installation': 'Installation',
  'otp-input.section.props': 'Props',
  'otp-input.examples.note':
    'Type a code to see boxes fill and focus advance. There is no loading state: boxes render immediately.',
  'otp-input.basic.label': 'Verification code',
  'otp-input.basic.hint': 'Enter the 6-digit code we sent you.',
  'otp-input.size-density.note':
    'Size and density scale the boxes together through the shared Form Field contract.',
  'otp-input.size-density.label': 'Verification code',
  'otp-input.size.sm': 'Small',
  'otp-input.size.md': 'Medium',
  'otp-input.size.lg': 'Large',
  'otp-input.density.compact': 'Compact',
  'otp-input.density.normal': 'Normal',
  'otp-input.density.comfortable': 'Comfortable',
  'otp-input.appearance.note':
    'The boxes carry the appearance themselves while the Form Field control wrapper stays clean.',
  'otp-input.appearance.label': 'Verification code',
  'otp-input.appearance.outline': 'Outline',
  'otp-input.appearance.surface': 'Surface',
  'otp-input.appearance.filled': 'Filled',
  'otp-input.states.note':
    'Disabled and readonly block editing; manual invalid forces the error style with a custom message.',
  'otp-input.states.disabled.label': 'Disabled code',
  'otp-input.states.invalid.label': 'Invalid code',
  'otp-input.states.invalid.error': 'Enter a valid code.',
  'otp-input.states.readonly.label': 'Confirmed code',
  'otp-input.length.note':
    'The number of boxes follows maxLength. Min length is enforced by validation, not by the layout.',
  'otp-input.length.label': 'Verification code',
  'otp-input.length.4': '4 digits',
  'otp-input.length.6': '6 digits',
  'otp-input.length.8': '8 digits',
  'otp-input.char-type.note':
    'Numeric accepts digits only; alphanumeric accepts uppercase letters and digits, including on paste.',
  'otp-input.char-type.label': 'Verification code',
  'otp-input.char-type.numeric': 'Numeric',
  'otp-input.char-type.alphanumeric': 'Alphanumeric',
  'otp-input.masking.note':
    'Masked boxes display a bullet while the value keeps the real characters.',
  'otp-input.masking.label': 'Masked code',
  'otp-input.masking.hint': 'Characters are hidden as you type.',
  'otp-input.separator.note':
    'A decorative separator groups boxes visually every N characters without affecting the value.',
  'otp-input.separator.label': 'Grouped code',
  'otp-input.separator.hint': 'Grouped every 3 digits for readability.',
  'otp-input.form.note':
    'Uses formControlName with Validators.required and solarisOtpValidator(4, 6). Completed fires when the value reaches maxLength.',
  'otp-input.form.label': 'Reactive code',
  'otp-input.form.hint': 'Enter a code between 4 and 6 digits.',
  'otp-input.form.status':
    'Valid: {{valid}} | Touched: {{touched}} | Value: {{value}}',
  'otp-input.form.empty': '(empty)',
  'otp-input.form.completed': 'Code completed!',
  'otp-input.installation.note':
    'Install the Solaris UI package and import the OTP input component with its validator.',
  'otp-input.props.note': 'Props table coming soon with the table component.',
  'otp-input.ai.prompt':
    "I'm looking at the Solaris UI documentation for {{component}} ({{url}}). Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.",
};
