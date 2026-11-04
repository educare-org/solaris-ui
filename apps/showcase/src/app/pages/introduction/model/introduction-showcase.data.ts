import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../shell/docs-on-this-page/model/toc-item';

export const INTRODUCTION_SHOWCASE_SLUG = 'introduction';
export const INTRODUCTION_TRANSLATION_PREFIX = 'introduction';

export const INTRODUCTION_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    {
      labelKey: 'shell.sidebar.section.getting-started',
      route: '/introduction',
    },
    { labelKey: 'shell.sidebar.item.introduction' },
  ];

export const INTRODUCTION_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.installation',
  route: '/installation',
};

export const INTRODUCTION_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'principles', labelKey: 'introduction.section.principles' },
  { anchor: 'contracts', labelKey: 'introduction.section.contracts' },
  { anchor: 'next', labelKey: 'introduction.section.next' },
];

export interface IntroductionShowcaseItem {
  readonly titleKey: string;
  readonly descriptionKey: string;
}

export const INTRODUCTION_SHOWCASE_PRINCIPLES: readonly IntroductionShowcaseItem[] =
  [
    {
      titleKey: 'introduction.principles.trustTitle',
      descriptionKey: 'introduction.principles.trustDesc',
    },
    {
      titleKey: 'introduction.principles.contractTitle',
      descriptionKey: 'introduction.principles.contractDesc',
    },
    {
      titleKey: 'introduction.principles.docsTitle',
      descriptionKey: 'introduction.principles.docsDesc',
    },
  ];

export const INTRODUCTION_SHOWCASE_CONTRACTS: readonly IntroductionShowcaseItem[] =
  [
    {
      titleKey: 'introduction.contracts.standaloneTitle',
      descriptionKey: 'introduction.contracts.standaloneDesc',
    },
    {
      titleKey: 'introduction.contracts.signalsTitle',
      descriptionKey: 'introduction.contracts.signalsDesc',
    },
    {
      titleKey: 'introduction.contracts.tokensTitle',
      descriptionKey: 'introduction.contracts.tokensDesc',
    },
    {
      titleKey: 'introduction.contracts.a11yTitle',
      descriptionKey: 'introduction.contracts.a11yDesc',
    },
    {
      titleKey: 'introduction.contracts.motionTitle',
      descriptionKey: 'introduction.contracts.motionDesc',
    },
    {
      titleKey: 'introduction.contracts.i18nTitle',
      descriptionKey: 'introduction.contracts.i18nDesc',
    },
  ];

export interface IntroductionShowcaseNextItem extends IntroductionShowcaseItem {
  readonly route: string;
}

export const INTRODUCTION_SHOWCASE_NEXT_ITEMS: readonly IntroductionShowcaseNextItem[] =
  [
    {
      titleKey: 'introduction.next.installTitle',
      descriptionKey: 'introduction.next.installDesc',
      route: '/installation',
    },
    {
      titleKey: 'introduction.next.iconsTitle',
      descriptionKey: 'introduction.next.iconsDesc',
      route: '/icons',
    },
  ];
