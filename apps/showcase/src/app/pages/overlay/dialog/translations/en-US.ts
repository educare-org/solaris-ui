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

  'dialog.fullscreen': 'Fullscreen',
  'dialog.fullscreen-desc':
    'The panel adapts to its content by default. Use fullscreen for immersive flows.',
  'dialog.open-fullscreen': 'Open fullscreen dialog',

  'dialog.appearance': 'Appearance',
  'dialog.appearance-desc':
    'Outline (default) has surface background with visible border. Surface is borderless with shadow.',
  'dialog.surface': 'Surface',
  'dialog.outline': 'Outline',

  'dialog.variants': 'Variants',
  'dialog.variants-desc': 'Variants affect icon and accent color.',

  'dialog.layout': 'Layout',
  'dialog.layout-desc':
    'Placement, separators, density, and action button style.',
  'dialog.placement-top': 'Placement top',
  'dialog.placement-left': 'Placement left',
  'dialog.placement-right': 'Placement right',
  'dialog.placement-bottom': 'Placement bottom',
  'dialog.placement-bottom-left': 'Placement bottom-left',
  'dialog.no-separators': 'No separators',
  'dialog.actions-custom': 'Custom actions',

  'dialog.component': 'Component dialog',
  'dialog.component-desc':
    'Open a dialog with an external component via openComponent(). The component can inject SOLARIS_DIALOG_DATA and SolarisDialogRef.',
  'dialog.open-component': 'Open component dialog',
  'dialog.open-component-chrome': 'Open with header/footer',

  'dialog.behavior': 'Behavior',
  'dialog.behavior-desc':
    'Control close button, Escape key, and backdrop click.',
  'dialog.not-closeable': 'Not closeable',
  'dialog.no-backdrop-close': 'Backdrop close disabled',
  'dialog.no-escape-close': 'Escape disabled',

  'dialog.scroll': 'Scrollable content',
  'dialog.scroll-desc':
    'Long content keeps the header pinned with scrolled elevation. Scroll to see the shadow and the centered close button.',
  'dialog.open-scroll': 'Open scrollable dialog',

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

  'dialog.examples.fullscreen.title': 'Fullscreen dialog',
  'dialog.examples.fullscreen.desc':
    'Fullscreen dialog fills the entire viewport.',

  'dialog.examples.appearance-surface.title': 'Surface appearance',
  'dialog.examples.appearance-surface.desc':
    'Default surface appearance with shadow.',
  'dialog.examples.appearance-outline.title': 'Outline appearance',
  'dialog.examples.appearance-outline.desc':
    'Outline has surface background with visible border.',

  'dialog.examples.variant.title': '{{variant}} variant',
  'dialog.examples.variant.desc': 'This dialog uses the {{variant}} variant.',

  'dialog.examples.placement.title': 'Placed dialog',
  'dialog.examples.placement.desc':
    'This dialog is anchored to the selected placement.',

  'dialog.examples.no-separators.title': 'Dialog without separators',
  'dialog.examples.no-separators.desc':
    'Header and footer separators are disabled.',

  'dialog.examples.actions-custom.title': 'Dialog with custom actions',
  'dialog.examples.actions-custom.desc':
    'Wide full-radius buttons with comfortable density.',

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

  'dialog.examples.component-chrome.title': 'Component with chrome',
  'dialog.examples.component-chrome.desc':
    'Header and footer come from the openComponent config.',
  'dialog.examples.component-chrome.message':
    'This body is rendered by the custom component. Only the body scrolls.',
  'dialog.examples.component-chrome.hint':
    'Title, description and actions were provided via SolarisDialogComponentConfig.',

  'dialog.examples.scroll.title': 'Terms and conditions',
  'dialog.examples.scroll.desc':
    'Scroll to read everything. The header stays pinned with a shadow.',
  'dialog.examples.scroll.item-title': 'Section {{index}}',
  'dialog.examples.scroll.item-text':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',

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
