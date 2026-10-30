import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';

export const CONTENT_CAROUSEL_SHOWCASE_SLUG = 'content-carousel';
export const CONTENT_CAROUSEL_TRANSLATION_PREFIX = 'content-carousel';

export const CONTENT_CAROUSEL_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.carousel' },
    { labelKey: 'shell.sidebar.item.content-carousel' },
  ];

export const CONTENT_CAROUSEL_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.media-carousel',
  route: '/interaction/media-carousel',
};

export const CONTENT_CAROUSEL_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.tabs',
  route: '/navigation/tabs',
};

export const CONTENT_CAROUSEL_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'content-carousel.section.examples' },
  { anchor: 'promo', labelKey: 'content-carousel.section.promo' },
  { anchor: 'mega-panel', labelKey: 'content-carousel.section.mega-panel' },
  { anchor: 'dividers', labelKey: 'content-carousel.section.dividers' },
  { anchor: 'progress', labelKey: 'content-carousel.section.progress' },
  { anchor: 'chrome', labelKey: 'content-carousel.section.chrome' },
  { anchor: 'installation', labelKey: 'content-carousel.section.installation' },
  { anchor: 'props', labelKey: 'content-carousel.section.props' },
];

export const CONTENT_CAROUSEL_SHOWCASE_IMPORT_CODE = `import { SolarisContentCarouselComponent, SolarisCarouselSlideDirective } from '@solaris-ui/angular';`;

export const CONTENT_CAROUSEL_SHOWCASE_BASIC_CODE = [
  '<solaris-content-carousel',
  '  align="end"',
  '  [showDivider]="true"',
  '  ariaLabel="Login highlights"',
  '  style="height: 320px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-login-qr />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-early-access-promo />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_PROMO_CODE = [
  '<solaris-content-carousel',
  '  align="end"',
  '  [showDivider]="true"',
  '  ariaLabel="Promotions"',
  '  style="height: 280px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-cashback-promo />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-travel-perks />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_MEGA_CODE = [
  '<solaris-content-carousel',
  '  align="none"',
  '  ariaLabel="Featured content"',
  '  style="height: 240px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-wellness-card />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-founder-stories />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_DIVIDERS_CODE = [
  '<solaris-content-carousel',
  '  align="center"',
  '  [showDivider]="true"',
  '  ariaLabel="Centered highlights"',
  '  style="height: 220px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-centered-one />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-centered-two />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_PROGRESS_CODE = [
  '<solaris-content-carousel',
  '  navigation="progress"',
  '  [autoplay]="true"',
  '  [duration]="4000"',
  '  ariaLabel="Rotating announcements"',
  '  style="height: 220px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-announcement-one />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-announcement-two />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_CHROME_MINIMAL_CODE = [
  '<solaris-content-carousel',
  '  navigation="none"',
  '  [showArrows]="false"',
  '  ariaLabel="Quiet rotator"',
  '  style="height: 220px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-first-panel />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-second-panel />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_CHROME_ARROWS_CODE = [
  '<solaris-content-carousel',
  '  navigation="none"',
  '  ariaLabel="Arrows only"',
  '  style="height: 220px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-first-panel />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-second-panel />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export const CONTENT_CAROUSEL_SHOWCASE_CHROME_DOTS_CODE = [
  '<solaris-content-carousel',
  '  [showArrows]="false"',
  '  ariaLabel="Dots only"',
  '  style="height: 220px"',
  '>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-first-panel />',
  '  </ng-template>',
  '  <ng-template solaris-carousel-slide>',
  '    <app-second-panel />',
  '  </ng-template>',
  '</solaris-content-carousel>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as CONTENT_CAROUSEL_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
