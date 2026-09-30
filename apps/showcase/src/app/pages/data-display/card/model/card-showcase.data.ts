import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const CARD_SHOWCASE_SLUG = 'card';
export const CARD_TRANSLATION_PREFIX = 'card';

export const CARD_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.card' },
];

export const CARD_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.badge',
  route: '/data-display/badge',
};

export const CARD_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.code-block',
  route: '/data-display/code-block',
};

export const CARD_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'card.section.examples' },
  { anchor: 'appearances', labelKey: 'card.section.appearances' },
  { anchor: 'padding-density', labelKey: 'card.section.padding-density' },
  { anchor: 'radius', labelKey: 'card.section.radius' },
  { anchor: 'media', labelKey: 'card.section.media' },
  { anchor: 'clickable', labelKey: 'card.section.clickable' },
  { anchor: 'composition', labelKey: 'card.section.composition' },
  { anchor: 'installation', labelKey: 'card.section.installation' },
  { anchor: 'props', labelKey: 'card.section.props' },
];

export const CARD_SHOWCASE_IMPORT_CODE =
  "import { SolarisCardComponent } from '@solaris-ui/angular';";

export const CARD_SHOWCASE_BASIC_CODE = [
  '<solaris-card padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Slack Integration</h3>',
  '    <p solaris-card-description>Connect your Slack account.</p>',
  '  </div>',
  '  <div solaris-card-content>',
  '    <solaris-badge color="primary">Development</solaris-badge>',
  '  </div>',
  '  <div solaris-card-footer>',
  '    <span>8 comments</span>',
  '    <span>Tomorrow</span>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_APPEARANCE_SURFACE_CODE = [
  '<solaris-card appearance="surface" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Surface</h3>',
  '    <p solaris-card-description>Default card appearance.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_APPEARANCE_OUTLINE_CODE = [
  '<solaris-card appearance="outline" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Outline</h3>',
  '    <p solaris-card-description>Card with visible border.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_APPEARANCE_TONAL_CODE = [
  '<solaris-card appearance="tonal" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Tonal</h3>',
  '    <p solaris-card-description>Subtle tinted card.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_APPEARANCE_GLASS_CODE = [
  '<solaris-card appearance="glass" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Glass</h3>',
  '    <p solaris-card-description>Translucent with blur.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_RADIUS_NONE_CODE = [
  '<solaris-card radius="none" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>None</h3>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_RADIUS_SM_CODE = [
  '<solaris-card radius="sm" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Small</h3>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_RADIUS_LG_CODE = [
  '<solaris-card radius="lg" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Large</h3>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_RADIUS_XL_CODE = [
  '<solaris-card radius="xl" padding="md">',
  '  <div solaris-card-header>',
  '    <h3 solaris-card-title>Extra large</h3>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_MEDIA_TOP_CODE = [
  '<solaris-card padding="md">',
  '  <figure solaris-card-media>',
  '    <img src="preview.jpg" alt="Preview of the feature" />',
  '  </figure>',
  '  <div solaris-card-content>',
  '    <h3 solaris-card-title>Card with Media</h3>',
  '    <p solaris-card-description>Content below the media area.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_MEDIA_START_CODE = [
  '<solaris-card mediaPosition="start" padding="md">',
  '  <figure solaris-card-media>',
  '    <img src="icon.png" alt="Module icon" />',
  '  </figure>',
  '  <div solaris-card-content>',
  '    <h3 solaris-card-title>Analytics</h3>',
  '    <p solaris-card-description>Side thumb, vertically centered.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export const CARD_SHOWCASE_CLICKABLE_CODE = [
  '<solaris-card href="/features/analytics" ariaLabel="Open the analytics feature" padding="md">',
  '  <div solaris-card-content>',
  '    <h3 solaris-card-title>Analytics</h3>',
  '    <p solaris-card-description>The whole surface is a single link.</p>',
  '  </div>',
  '</solaris-card>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as CARD_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
