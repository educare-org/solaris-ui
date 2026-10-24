import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const STEPPER_SHOWCASE_SLUG = 'stepper';
export const STEPPER_TRANSLATION_PREFIX = 'stepper';

export const STEPPER_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.navigation', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.stepper' },
];

export const STEPPER_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.mega-menu',
  route: '/navigation/mega-menu',
};

export const STEPPER_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.segmented-control',
  route: '/navigation/segmented-control',
};

export const STEPPER_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'stepper.section.examples' },
  { anchor: 'orientation', labelKey: 'stepper.section.orientation' },
  { anchor: 'appearances', labelKey: 'stepper.section.appearances' },
  { anchor: 'size-density', labelKey: 'stepper.section.size-density' },
  { anchor: 'linear', labelKey: 'stepper.section.linear' },
  { anchor: 'status', labelKey: 'stepper.section.status' },
  { anchor: 'validation', labelKey: 'stepper.section.validation' },
  { anchor: 'wizard', labelKey: 'stepper.section.wizard' },
  { anchor: 'installation', labelKey: 'stepper.section.installation' },
  { anchor: 'props', labelKey: 'stepper.section.props' },
];

export const STEPPER_SHOWCASE_IMPORT_CODE =
  "import { SolarisStepperComponent, SolarisStepComponent } from '@solaris-ui/angular';";

export const STEPPER_SHOWCASE_BASIC_HORIZONTAL_CODE = [
  '<solaris-stepper [activeIndex]="1">',
  '  <solaris-step label="Account" status="completed" />',
  '  <solaris-step label="Institution" status="active" />',
  '  <solaris-step label="Modules" status="pending" />',
  '  <solaris-step label="Review" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_BASIC_VERTICAL_CODE = [
  '<solaris-stepper [activeIndex]="1" orientation="vertical">',
  '  <solaris-step label="Profile" status="completed" />',
  '  <solaris-step',
  '    label="Preferences"',
  '    status="active"',
  '    description="Set your preferences"',
  '  />',
  '  <solaris-step label="Review" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_CARD_CODE = [
  '<solaris-stepper [activeIndex]="0" appearance="card">',
  '  <solaris-step',
  '    label="Personal Info"',
  '    status="active"',
  '    description="Enter your details"',
  '  />',
  '  <solaris-step label="Address" status="pending" description="Where you live" />',
  '  <solaris-step label="Payment" status="pending" description="Payment method" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_DASHED_CODE = [
  '<solaris-stepper [activeIndex]="2" appearance="dashed" size="sm">',
  '  <solaris-step label="Step 1" status="completed" />',
  '  <solaris-step label="Step 2" status="completed" />',
  '  <solaris-step label="Step 3" status="active" />',
  '  <solaris-step label="Step 4" status="pending" />',
  '  <solaris-step label="Step 5" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_LINEAR_CODE = [
  '<solaris-stepper [(activeIndex)]="activeIndex" [linear]="true">',
  '  <solaris-step label="Step 1" status="completed" />',
  '  <solaris-step label="Step 2" status="completed" />',
  '  <solaris-step label="Step 3" status="active" />',
  '  <solaris-step label="Step 4" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_NON_LINEAR_CODE = [
  '<solaris-stepper [(activeIndex)]="activeIndex">',
  '  <solaris-step label="Step 1" status="completed" />',
  '  <solaris-step label="Step 2" status="completed" />',
  '  <solaris-step label="Step 3" status="active" />',
  '  <solaris-step label="Step 4" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_ERROR_CODE = [
  '<solaris-stepper [activeIndex]="1">',
  '  <solaris-step label="Account" status="completed" />',
  '  <solaris-step label="Institution" status="error" />',
  '  <solaris-step label="Modules" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_WARNING_CODE = [
  '<solaris-stepper [activeIndex]="2">',
  '  <solaris-step label="Cart" status="completed" />',
  '  <solaris-step label="Shipping" status="warning" statusText="Delayed" />',
  '  <solaris-step label="Payment" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_OPTIONAL_CODE = [
  '<solaris-stepper [(activeIndex)]="activeIndex">',
  '  <solaris-step label="Required Info" status="completed" />',
  '  <solaris-step label="Optional Details" status="active" [optional]="true" />',
  '  <solaris-step label="Review" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_ICON_CODE = [
  '<solaris-stepper [activeIndex]="1">',
  '  <solaris-step label="Cart" status="completed" icon="check" />',
  '  <solaris-step label="Payment" status="active" icon="info" />',
  '  <solaris-step label="Confirmation" status="pending" icon="shield-check" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_VALIDATION_CODE = [
  '<solaris-stepper',
  '  [(activeIndex)]="activeStep"',
  '  [linear]="true"',
  '  (stepBlocked)="onBlocked($event)"',
  '>',
  '  <solaris-step',
  '    label="Account"',
  '    [canExit]="canLeaveAccount"',
  '    [error]="accountError()"',
  '  >',
  '    <solaris-stepper-content>',
  '      <solaris-checkbox',
  '        label="I confirm my details"',
  '        [(ngModel)]="confirmed"',
  '      />',
  '    </solaris-stepper-content>',
  '  </solaris-step>',
  '  <solaris-step label="Review" />',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_WIZARD_CODE = [
  '<solaris-stepper [(activeIndex)]="activeStep" [linear]="true">',
  '  <solaris-step label="Account" [completed]="activeStep() > 0">',
  '    <solaris-stepper-content>',
  '      <p>Step 1 content</p>',
  '    </solaris-stepper-content>',
  '  </solaris-step>',
  '  <solaris-step label="Institution" [completed]="activeStep() > 1">',
  '    <solaris-stepper-content>',
  '      <p>Step 2 content</p>',
  '    </solaris-stepper-content>',
  '  </solaris-step>',
  '',
  '  <solaris-stepper-actions align="space-between">',
  '    <button type="button" solaris-button appearance="ghost" (click)="prev()">',
  '      Back',
  '    </button>',
  '    <button type="button" solaris-button color="primary" (click)="next()">',
  '      Next',
  '    </button>',
  '  </solaris-stepper-actions>',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_TRANSITION_CODE = [
  '<solaris-stepper [(activeIndex)]="activeStep" [contentTransition]="transition()">',
  '  <solaris-step label="Step 1">',
  '    <solaris-stepper-content>Content for step 1</solaris-stepper-content>',
  '  </solaris-step>',
  '  <solaris-step label="Step 2">',
  '    <solaris-stepper-content>Content for step 2</solaris-stepper-content>',
  '  </solaris-step>',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_ACTIONS_CODE = [
  '<solaris-stepper [activeIndex]="0">',
  '  <solaris-step label="Step 1" status="completed" />',
  '  <solaris-step label="Step 2" status="active" />',
  '  <solaris-step label="Step 3" status="pending" />',
  '  <solaris-stepper-actions [align]="align()">',
  '    <button type="button" solaris-button appearance="ghost">Cancel</button>',
  '    <button type="button" solaris-button color="primary">Continue</button>',
  '  </solaris-stepper-actions>',
  '</solaris-stepper>',
].join('\n');

export const STEPPER_SHOWCASE_RESPONSIVE_CODE = [
  '<solaris-stepper [activeIndex]="0">',
  '  <solaris-step label="Getting Started" status="completed" />',
  '  <solaris-step',
  '    label="Configuration"',
  '    status="active"',
  '    description="Set up your environment"',
  '  />',
  '  <solaris-step label="Validation" status="pending" />',
  '  <solaris-step label="Publish" status="pending" />',
  '</solaris-stepper>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as STEPPER_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
