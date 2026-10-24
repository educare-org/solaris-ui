import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const OTP_INPUT_SHOWCASE_SLUG = 'otp-input';
export const OTP_INPUT_TRANSLATION_PREFIX = 'otp-input';

export const OTP_INPUT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.forms', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.otp-input' },
  ];

export const OTP_INPUT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.phone-field',
  route: '/forms/phone-field',
};

export const OTP_INPUT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.file-upload',
  route: '/forms/file-upload',
};

export const OTP_INPUT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'otp-input.section.examples' },
  { anchor: 'size-density', labelKey: 'otp-input.section.size-density' },
  { anchor: 'appearance', labelKey: 'otp-input.section.appearance' },
  { anchor: 'states', labelKey: 'otp-input.section.states' },
  { anchor: 'length', labelKey: 'otp-input.section.length' },
  { anchor: 'char-type', labelKey: 'otp-input.section.char-type' },
  { anchor: 'masking', labelKey: 'otp-input.section.masking' },
  { anchor: 'separator', labelKey: 'otp-input.section.separator' },
  { anchor: 'suffix-action', labelKey: 'otp-input.section.suffix-action' },
  { anchor: 'form', labelKey: 'otp-input.section.form' },
  { anchor: 'installation', labelKey: 'otp-input.section.installation' },
  { anchor: 'props', labelKey: 'otp-input.section.props' },
];

export const OTP_INPUT_SHOWCASE_IMPORT_CODE =
  "import { SolarisOtpInputComponent, solarisOtpValidator } from '@solaris-ui/angular';";

export const OTP_INPUT_SHOWCASE_BASIC_CODE = [
  '<solaris-otp-input',
  '  label="Verification code"',
  '  hint="Enter the 6-digit code we sent you."',
  '  [maxLength]="6"',
  '/>',
].join('\n');

export const OTP_INPUT_SHOWCASE_STATES_CODE = [
  '<solaris-otp-input label="Disabled code" [maxLength]="6" [disabled]="true" />',
  '<solaris-otp-input label="Invalid code" [maxLength]="6" [invalid]="true" error="Enter a valid code." />',
  '<solaris-otp-input label="Readonly code" [maxLength]="6" [readonly]="true" value="123456" />',
].join('\n');

export const OTP_INPUT_SHOWCASE_MASKED_CODE = [
  '<solaris-otp-input label="Masked code" [maxLength]="6" [masked]="true" />',
].join('\n');

export const OTP_INPUT_SHOWCASE_SEPARATOR_CODE = [
  '<solaris-otp-input label="Grouped code" [maxLength]="6" [separatorEvery]="3" />',
].join('\n');

export const OTP_INPUT_SHOWCASE_SUFFIX_ACTION_CODE = [
  '<solaris-otp-input label="Code" [maxLength]="6">',
  '  <button type="button" solaris-form-suffix solaris-form-suffix-action aria-label="Resend code">',
  '    Resend',
  '  </button>',
  '</solaris-otp-input>',
].join('\n');

export const OTP_INPUT_SHOWCASE_REACTIVE_CODE = [
  '<solaris-otp-input',
  '  formControlName="code"',
  '  label="Reactive code"',
  '  [maxLength]="6"',
  '  [required]="true"',
  '  (completed)="onCompleted()"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as OTP_INPUT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
