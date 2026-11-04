import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisMediaCarouselComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisMediaSlide,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  MEDIA_CAROUSEL_SHOWCASE_ARROWS_ONLY_CODE,
  MEDIA_CAROUSEL_SHOWCASE_AUTOPLAY_CODE,
  MEDIA_CAROUSEL_SHOWCASE_BASIC_CODE,
  MEDIA_CAROUSEL_SHOWCASE_BREADCRUMBS,
  MEDIA_CAROUSEL_SHOWCASE_DOTS_ONLY_CODE,
  MEDIA_CAROUSEL_SHOWCASE_IMPORT_CODE,
  MEDIA_CAROUSEL_SHOWCASE_INSTALL_COMMANDS,
  MEDIA_CAROUSEL_SHOWCASE_LOOP_CODE,
  MEDIA_CAROUSEL_SHOWCASE_MINIMAL_CODE,
  MEDIA_CAROUSEL_SHOWCASE_NEXT,
  MEDIA_CAROUSEL_SHOWCASE_OUTSIDE_CODE,
  MEDIA_CAROUSEL_SHOWCASE_PEEK_CODE,
  MEDIA_CAROUSEL_SHOWCASE_PREVIEW_CODE,
  MEDIA_CAROUSEL_SHOWCASE_PREV,
  MEDIA_CAROUSEL_SHOWCASE_PROGRESS_CODE,
  MEDIA_CAROUSEL_SHOWCASE_RATIO_PORTRAIT_CODE,
  MEDIA_CAROUSEL_SHOWCASE_RATIO_SQUARE_CODE,
  MEDIA_CAROUSEL_SHOWCASE_RATIO_STANDARD_CODE,
  MEDIA_CAROUSEL_SHOWCASE_RATIO_TALL_CODE,
  MEDIA_CAROUSEL_SHOWCASE_RATIO_WIDE_CODE,
  MEDIA_CAROUSEL_SHOWCASE_SLUG,
  MEDIA_CAROUSEL_SHOWCASE_TOC_ITEMS,
  MEDIA_CAROUSEL_TRANSLATION_PREFIX,
} from '../model/media-carousel-showcase.data';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisMediaCarouselComponent,
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
  templateUrl: './media-carousel-showcase.html',
  styleUrls: ['./media-carousel-showcase.scss'],
})
export class MediaCarouselShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = MEDIA_CAROUSEL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = MEDIA_CAROUSEL_SHOWCASE_PREV;
  protected readonly next = MEDIA_CAROUSEL_SHOWCASE_NEXT;
  protected readonly tocItems = MEDIA_CAROUSEL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = MEDIA_CAROUSEL_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = MEDIA_CAROUSEL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = MEDIA_CAROUSEL_SHOWCASE_BASIC_CODE;
  protected readonly outsideCode = MEDIA_CAROUSEL_SHOWCASE_OUTSIDE_CODE;
  protected readonly loopCode = MEDIA_CAROUSEL_SHOWCASE_LOOP_CODE;
  protected readonly autoplayCode = MEDIA_CAROUSEL_SHOWCASE_AUTOPLAY_CODE;
  protected readonly previewCode = MEDIA_CAROUSEL_SHOWCASE_PREVIEW_CODE;
  protected readonly minimalCode = MEDIA_CAROUSEL_SHOWCASE_MINIMAL_CODE;
  protected readonly arrowsOnlyCode = MEDIA_CAROUSEL_SHOWCASE_ARROWS_ONLY_CODE;
  protected readonly dotsOnlyCode = MEDIA_CAROUSEL_SHOWCASE_DOTS_ONLY_CODE;
  protected readonly progressCode = MEDIA_CAROUSEL_SHOWCASE_PROGRESS_CODE;
  protected readonly peekCode = MEDIA_CAROUSEL_SHOWCASE_PEEK_CODE;
  protected readonly ratioWideCode = MEDIA_CAROUSEL_SHOWCASE_RATIO_WIDE_CODE;
  protected readonly ratioStandardCode =
    MEDIA_CAROUSEL_SHOWCASE_RATIO_STANDARD_CODE;
  protected readonly ratioSquareCode =
    MEDIA_CAROUSEL_SHOWCASE_RATIO_SQUARE_CODE;
  protected readonly ratioPortraitCode =
    MEDIA_CAROUSEL_SHOWCASE_RATIO_PORTRAIT_CODE;
  protected readonly ratioTallCode = MEDIA_CAROUSEL_SHOWCASE_RATIO_TALL_CODE;

  protected readonly selectedChrome = signal('minimal');
  protected readonly selectedRatio = signal('16 / 9');

  protected readonly slides: readonly SolarisMediaSlide[] = [
    {
      type: 'image',
      src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%234282fb'/%3E%3C/svg%3E",
      alt: 'First story',
    },
    {
      type: 'image',
      src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%2316a34a'/%3E%3C/svg%3E",
      alt: 'Second story',
    },
    {
      type: 'image',
      src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23d97706'/%3E%3C/svg%3E",
      alt: 'Third story',
    },
  ];

  protected readonly previewSlides: readonly SolarisMediaSlide[] = [
    {
      type: 'image',
      src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%234282fb'/%3E%3C/svg%3E",
      alt: 'First story',
    },
    {
      type: 'video',
      src: 'tour.mp4',
      poster:
        "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%2316a34a'/%3E%3C/svg%3E",
      alt: 'Product tour',
    },
    {
      type: 'image',
      src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='800' height='450' fill='%23d97706'/%3E%3C/svg%3E",
      alt: 'Third story',
    },
  ];

  protected readonly current = signal(0);

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: MEDIA_CAROUSEL_TRANSLATION_PREFIX,
      slug: MEDIA_CAROUSEL_SHOWCASE_SLUG,
      importCode: MEDIA_CAROUSEL_SHOWCASE_IMPORT_CODE,
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
