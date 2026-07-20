export const EN_US_DIALOG: Record<string, string> = {
  'dialog.title': 'Dialog',
  'dialog.description':
    'Dialog blocks the flow and demands user attention. Use for confirmations, alerts, forms, previews, terms, reviews, multi-step flows, onboarding, registration, password recovery, and short checkouts.',

  'dialog.basic': 'Basic dialogs',
  'dialog.basic-desc': 'Simple dialogs created via open() configuration.',
  'dialog.open-basic': 'Open basic dialog',
  'dialog.open-confirmation': 'Open confirmation dialog',
  'dialog.open-danger': 'Open danger/alert dialog',

  'dialog.actions-align': 'Actions alignment',
  'dialog.actions-align-desc':
    'Actions can be aligned to start, center, end, or space-between.',
  'dialog.align-start': 'Align start',
  'dialog.align-center': 'Align center',
  'dialog.align-end': 'Align end',
  'dialog.align-space-between': 'Space between',

  'dialog.sizes': 'Sizes',
  'dialog.sizes-desc': 'Dialog supports sm, md, lg, xl, and fullscreen sizes.',

  'dialog.appearance': 'Appearance',
  'dialog.appearance-desc':
    'Surface (default) has shadow. Outline has surface background with visible border.',
  'dialog.surface': 'Surface',
  'dialog.outline': 'Outline',

  'dialog.variants': 'Variants',
  'dialog.variants-desc': 'Variants affect icon and accent color.',

  'dialog.component': 'Component dialog',
  'dialog.component-desc':
    'Open a dialog with an external component via openComponent(). The component can inject SOLARIS_DIALOG_DATA and SolarisDialogRef.',
  'dialog.open-component': 'Open component dialog',

  'dialog.behavior': 'Behavior',
  'dialog.behavior-desc':
    'Control close button, Escape key, and backdrop click.',
  'dialog.not-closeable': 'Not closeable',
  'dialog.no-backdrop-close': 'Backdrop close disabled',
  'dialog.no-escape-close': 'Escape disabled',

  'dialog.flow': 'Dialog Flow',
  'dialog.flow-desc':
    'Multi-step dialog with slide transition between steps, without reopening the overlay.',
  'dialog.open-flow': 'Open dialog flow',

  'dialog.common.ok': 'OK',
  'dialog.common.close': 'Close',
  'dialog.common.cancel': 'Cancel',
  'dialog.common.confirm': 'Confirm',
  'dialog.common.save': 'Save',
  'dialog.common.delete': 'Delete',
  'dialog.common.discard': 'Discard',
  'dialog.common.submit': 'Submit',
  'dialog.common.understand': 'I understand',
  'dialog.common.learn-more': 'Learn more',
  'dialog.common.got-it': 'Got it',
  'dialog.common.previous': 'Previous',
  'dialog.common.next': 'Next',
  'dialog.common.finish': 'Finish',

  'dialog.size-sm': 'sm',
  'dialog.size-md': 'md',
  'dialog.size-lg': 'lg',
  'dialog.size-xl': 'xl',
  'dialog.size-fullscreen': 'fullscreen',

  'dialog.variant-neutral': 'neutral',
  'dialog.variant-info': 'info',
  'dialog.variant-success': 'success',
  'dialog.variant-warning': 'warning',
  'dialog.variant-danger': 'danger',

  'dialog.examples.basic.title': 'Dialog Title',
  'dialog.examples.basic.desc':
    'This is a basic dialog with title and description.',

  'dialog.examples.confirmation.title': 'Discard changes?',
  'dialog.examples.confirmation.desc':
    'You have unsaved changes. Do you want to continue?',

  'dialog.examples.danger.title': 'Delete account',
  'dialog.examples.danger.desc':
    'This action cannot be undone. All your data will be permanently deleted.',

  'dialog.examples.actions-start.title': 'Actions aligned start',
  'dialog.examples.actions-start.desc':
    'Actions are aligned to the start (left).',

  'dialog.examples.actions-center.title': 'Actions aligned center',
  'dialog.examples.actions-center.desc': 'Actions are aligned to the center.',

  'dialog.examples.actions-end.title': 'Actions aligned end',
  'dialog.examples.actions-end.desc': 'Actions are aligned to the end (right).',

  'dialog.examples.actions-space-between.title': 'Actions space between',
  'dialog.examples.actions-space-between.desc':
    'Actions are distributed with space between.',

  'dialog.examples.size-sm.title': 'Small dialog',
  'dialog.examples.size-sm.desc': 'Small size for quick confirmations.',
  'dialog.examples.size-md.title': 'Medium dialog',
  'dialog.examples.size-md.desc': 'Medium size is the default.',
  'dialog.examples.size-lg.title': 'Large dialog',
  'dialog.examples.size-lg.desc': 'Large size for forms and complex content.',
  'dialog.examples.size-xl.title': 'Extra large dialog',
  'dialog.examples.size-xl.desc': 'XL size for ample content.',
  'dialog.examples.size-fullscreen.title': 'Fullscreen dialog',
  'dialog.examples.size-fullscreen.desc':
    'Fullscreen dialog fills the entire viewport.',

  'dialog.examples.appearance-surface.title': 'Surface appearance',
  'dialog.examples.appearance-surface.desc':
    'Default surface appearance with shadow.',
  'dialog.examples.appearance-outline.title': 'Outline appearance',
  'dialog.examples.appearance-outline.desc':
    'Outline has surface background with visible border.',

  'dialog.examples.variant.title': '{{variant}} variant',
  'dialog.examples.variant.desc': 'This dialog uses the {{variant}} variant.',

  'dialog.examples.not-closeable.title': 'Not closeable',
  'dialog.examples.not-closeable.desc':
    'The close button is hidden and Escape is disabled.',

  'dialog.examples.no-backdrop-close.title': 'Backdrop click disabled',
  'dialog.examples.no-backdrop-close.desc':
    'Clicking outside will not close this dialog. Use the button below.',

  'dialog.examples.no-escape-close.title': 'Escape disabled',
  'dialog.examples.no-escape-close.desc':
    'Pressing Escape will not close this dialog.',

  'dialog.examples.component.desc-part1': 'This dialog was opened via ',
  'dialog.examples.component.desc-part2': '. The data was injected via ',
  'dialog.examples.component.desc-part3': ' token.',
  'dialog.examples.component.close-pizza': 'Close with "Pizza!"',

  'dialog.examples.flow.title': 'Multi-step Dialog',
  'dialog.examples.flow.step1-title': 'Step 1: Create account',
  'dialog.examples.flow.step1-desc':
    'Fill in your basic information to get started.',
  'dialog.examples.flow.step1-list1': 'Choose a username',
  'dialog.examples.flow.step1-list2': 'Set your email address',
  'dialog.examples.flow.step1-list3': 'Create a secure password',
  'dialog.examples.flow.step2-title': 'Step 2: Institution data',
  'dialog.examples.flow.step2-desc': 'Tell us about your institution.',
  'dialog.examples.flow.step2-list1': 'Institution name',
  'dialog.examples.flow.step2-list2': 'Registration number',
  'dialog.examples.flow.step2-list3': 'Address details',
  'dialog.examples.flow.step3-title': 'Step 3: Review',
  'dialog.examples.flow.step3-desc': 'Review all information before finishing.',
  'dialog.examples.flow.step3-list1': 'Check your account details',
  'dialog.examples.flow.step3-list2': 'Verify institution data',
  'dialog.examples.flow.step3-list3': 'Accept terms and conditions',
};
