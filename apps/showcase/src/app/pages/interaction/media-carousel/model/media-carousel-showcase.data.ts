import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const MEDIA_CAROUSEL_SHOWCASE_SLUG = 'media-carousel';
export const MEDIA_CAROUSEL_TRANSLATION_PREFIX = 'media-carousel';

export const MEDIA_CAROUSEL_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.group.interaction', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.media-carousel' },
  ];

export const MEDIA_CAROUSEL_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.accordion',
  route: '/interaction/accordion',
};

export const MEDIA_CAROUSEL_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tabs',
  route: '/navigation/tabs',
};

export const MEDIA_CAROUSEL_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'media-carousel.section.examples' },
  { anchor: 'dots-outside', labelKey: 'media-carousel.section.dots-outside' },
  { anchor: 'loop', labelKey: 'media-carousel.section.loop' },
  { anchor: 'autoplay', labelKey: 'media-carousel.section.autoplay' },
  { anchor: 'preview', labelKey: 'media-carousel.section.preview' },
  { anchor: 'installation', labelKey: 'media-carousel.section.installation' },
  { anchor: 'props', labelKey: 'media-carousel.section.props' },
];

export const MEDIA_CAROUSEL_SHOWCASE_IMPORT_CODE = `import { SolarisMediaCarouselComponent } from '@solaris-ui/angular';`;

export const MEDIA_CAROUSEL_SHOWCASE_BASIC_CODE = [
  '<solaris-media-carousel',
  '  [slides]="slides"',
  '  [(activeIndex)]="current"',
  '  ariaLabel="Featured stories"',
  '/>',
].join('\n');

export const MEDIA_CAROUSEL_SHOWCASE_OUTSIDE_CODE = [
  '<solaris-media-carousel',
  '  [slides]="slides"',
  '  dotsPosition="outside"',
  '  ariaLabel="Featured stories"',
  '/>',
].join('\n');

export const MEDIA_CAROUSEL_SHOWCASE_LOOP_CODE = [
  '<solaris-media-carousel',
  '  [slides]="slides"',
  '  [loop]="false"',
  '  ariaLabel="Featured stories"',
  '/>',
].join('\n');

export const MEDIA_CAROUSEL_SHOWCASE_AUTOPLAY_CODE = [
  '<solaris-media-carousel',
  '  [slides]="slides"',
  '  [autoplay]="true"',
  '  [duration]="4000"',
  '  ariaLabel="Featured stories"',
  '/>',
].join('\n');

export const MEDIA_CAROUSEL_SHOWCASE_PREVIEW_CODE = [
  '<solaris-media-carousel',
  '  [slides]="previewSlides"',
  '  navigation="preview"',
  '  (slideActivate)="openPlayer($event)"',
  '  ariaLabel="Featured stories"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as MEDIA_CAROUSEL_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
