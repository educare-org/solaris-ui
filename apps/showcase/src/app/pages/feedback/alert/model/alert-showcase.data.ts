import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const ALERT_SHOWCASE_SLUG = 'alert';
export const ALERT_TRANSLATION_PREFIX = 'alert';

export const ALERT_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.feedback', route: '/feedback/alert' },
  { labelKey: 'shell.sidebar.item.alert' },
];

export const ALERT_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.preview-code',
  route: '/data-display/preview-code',
};

export const ALERT_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.toast',
  route: '/feedback/toast',
};

export const ALERT_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'alert.section.examples' },
  { anchor: 'variants', labelKey: 'alert.section.variants' },
  { anchor: 'size-density', labelKey: 'alert.section.size-density' },
  { anchor: 'anatomy', labelKey: 'alert.section.anatomy' },
  { anchor: 'closable', labelKey: 'alert.section.closable' },
  { anchor: 'live', labelKey: 'alert.section.live' },
  { anchor: 'announcement', labelKey: 'alert.section.announcement' },
  { anchor: 'installation', labelKey: 'alert.section.installation' },
  { anchor: 'props', labelKey: 'alert.section.props' },
];

export const ALERT_SHOWCASE_IMPORT_CODE = `import {
    SolarisAlertComponent,
    SolarisAlertTitleDirective,
    SolarisAlertDescriptionDirective,
    SolarisAlertActionsComponent
  }
  from '@solaris-ui/angular';`;

export const ALERT_SHOWCASE_BASIC_CODE = [
  '<solaris-alert variant="info">',
  '  Changes are saved automatically.',
  '</solaris-alert>',
].join('\n');

export const ALERT_SHOWCASE_ANATOMY_CODE = [
  '<solaris-alert variant="warning" [closable]="true">',
  '  <h3 solaris-alert-title>Attention</h3>',
  '  <p solaris-alert-description>',
  '    This configuration may affect active users.',
  '  </p>',
  '  <solaris-alert-actions>',
  '    <a href="#">Review changes</a>',
  '  </solaris-alert-actions>',
  '</solaris-alert>',
].join('\n');

export const ALERT_SHOWCASE_CLOSABLE_CODE = [
  '@if (showAlert) {',
  '  <solaris-alert variant="warning" [closable]="true" (dismissed)="showAlert = false">',
  '    This alert can be dismissed.',
  '  </solaris-alert>',
  '}',
].join('\n');

export const ALERT_SHOWCASE_LIVE_CODE = [
  '<solaris-alert variant="danger" live="assertive">',
  '  Payment failed. Try again.',
  '</solaris-alert>',
].join('\n');

export const ALERT_SHOWCASE_ANNOUNCEMENT_BASIC_CODE = [
  '<solaris-announcement align="center" (dismissed)="dismissAnnouncement()">',
  '  New features just dropped in September Early Access.',
  '  <a href="/changelog">See what\'s new →</a>',
  '</solaris-announcement>',
].join('\n');

export const ALERT_SHOWCASE_ANNOUNCEMENT_PERSISTENT_CODE = [
  '<solaris-announcement',
  '  dismissKey="site-announcement-sep-2026"',
  '  (dismissed)="dismissAnnouncement()"',
  '>',
  '  Sign up before July 31 and get a gift card.',
  '</solaris-announcement>',
].join('\n');

export const ALERT_SHOWCASE_ANNOUNCEMENT_IMAGE_BG_CODE = [
  '<solaris-announcement variant="custom" class="hero-announcement">',
  '  Limited offer — ends Sunday. <a href="/sale">Shop now</a>',
  '</solaris-announcement>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as ALERT_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
