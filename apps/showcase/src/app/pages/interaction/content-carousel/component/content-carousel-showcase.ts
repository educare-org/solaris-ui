import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCarouselSlideDirective,
  SolarisCodeBlockComponent,
  SolarisContentCarouselComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  CONTENT_CAROUSEL_SHOWCASE_BASIC_CODE,
  CONTENT_CAROUSEL_SHOWCASE_BREADCRUMBS,
  CONTENT_CAROUSEL_SHOWCASE_CHROME_ARROWS_CODE,
  CONTENT_CAROUSEL_SHOWCASE_CHROME_DOTS_CODE,
  CONTENT_CAROUSEL_SHOWCASE_CHROME_MINIMAL_CODE,
  CONTENT_CAROUSEL_SHOWCASE_DIVIDERS_CODE,
  CONTENT_CAROUSEL_SHOWCASE_IMPORT_CODE,
  CONTENT_CAROUSEL_SHOWCASE_INSTALL_COMMANDS,
  CONTENT_CAROUSEL_SHOWCASE_MEGA_CODE,
  CONTENT_CAROUSEL_SHOWCASE_NEXT,
  CONTENT_CAROUSEL_SHOWCASE_PREV,
  CONTENT_CAROUSEL_SHOWCASE_PROGRESS_CODE,
  CONTENT_CAROUSEL_SHOWCASE_PROMO_CODE,
  CONTENT_CAROUSEL_SHOWCASE_SLUG,
  CONTENT_CAROUSEL_SHOWCASE_TOC_ITEMS,
  CONTENT_CAROUSEL_TRANSLATION_PREFIX,
} from '../model/content-carousel-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisCarouselSlideDirective,
    SolarisCodeBlockComponent,
    SolarisContentCarouselComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
  ],
  templateUrl: './content-carousel-showcase.html',
  styleUrls: ['./content-carousel-showcase.scss'],
})
export class ContentCarouselShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CONTENT_CAROUSEL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CONTENT_CAROUSEL_SHOWCASE_PREV;
  protected readonly next = CONTENT_CAROUSEL_SHOWCASE_NEXT;
  protected readonly tocItems = CONTENT_CAROUSEL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands =
    CONTENT_CAROUSEL_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = CONTENT_CAROUSEL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CONTENT_CAROUSEL_SHOWCASE_BASIC_CODE;
  protected readonly promoCode = CONTENT_CAROUSEL_SHOWCASE_PROMO_CODE;
  protected readonly megaCode = CONTENT_CAROUSEL_SHOWCASE_MEGA_CODE;
  protected readonly dividersCode = CONTENT_CAROUSEL_SHOWCASE_DIVIDERS_CODE;
  protected readonly progressCode = CONTENT_CAROUSEL_SHOWCASE_PROGRESS_CODE;
  protected readonly chromeMinimalCode =
    CONTENT_CAROUSEL_SHOWCASE_CHROME_MINIMAL_CODE;
  protected readonly chromeArrowsCode =
    CONTENT_CAROUSEL_SHOWCASE_CHROME_ARROWS_CODE;
  protected readonly chromeDotsCode =
    CONTENT_CAROUSEL_SHOWCASE_CHROME_DOTS_CODE;

  protected readonly current = signal(0);
  protected readonly selectedChrome = signal('minimal');

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CONTENT_CAROUSEL_TRANSLATION_PREFIX,
      slug: CONTENT_CAROUSEL_SHOWCASE_SLUG,
      importCode: CONTENT_CAROUSEL_SHOWCASE_IMPORT_CODE,
    },
  );

  protected copyPageAsMarkdown(): void {
    this.pageActions.copyPageAsMarkdown();
  }

  protected downloadPageAsMarkdown(): void {
    this.pageActions.downloadPageAsMarkdown();
  }

  protected openInChatGpt(): void {
    this.pageActions.openInChatGpt();
  }

  protected openInClaude(): void {
    this.pageActions.openInClaude();
  }
}
