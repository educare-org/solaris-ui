import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisBadgeComponent,
  SolarisButtonDirective,
  SolarisCardActionsDirective,
  SolarisCardComponent,
  SolarisCardContentDirective,
  SolarisCardDescriptionDirective,
  SolarisCardHeaderDirective,
  SolarisCardTitleDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisSkeletonComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCardAppearance,
  type SolarisCardDensity,
  type SolarisCardMediaPosition,
  type SolarisCardPadding,
  type SolarisCardRadius,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  CARD_SHOWCASE_APPEARANCE_GLASS_CODE,
  CARD_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  CARD_SHOWCASE_APPEARANCE_SURFACE_CODE,
  CARD_SHOWCASE_APPEARANCE_TONAL_CODE,
  CARD_SHOWCASE_BASIC_CODE,
  CARD_SHOWCASE_BREADCRUMBS,
  CARD_SHOWCASE_CLICKABLE_CODE,
  CARD_SHOWCASE_IMPORT_CODE,
  CARD_SHOWCASE_INSTALL_COMMANDS,
  CARD_SHOWCASE_MEDIA_START_CODE,
  CARD_SHOWCASE_MEDIA_TOP_CODE,
  CARD_SHOWCASE_NEXT,
  CARD_SHOWCASE_PREV,
  CARD_SHOWCASE_RADIUS_LG_CODE,
  CARD_SHOWCASE_RADIUS_NONE_CODE,
  CARD_SHOWCASE_RADIUS_SM_CODE,
  CARD_SHOWCASE_RADIUS_XL_CODE,
  CARD_SHOWCASE_SLUG,
  CARD_SHOWCASE_TOC_ITEMS,
  CARD_TRANSLATION_PREFIX,
} from '../model/card-showcase.data';

import { BasicCardExample } from '../examples/basic/component/basic.component';
import { ClickableCardExample } from '../examples/clickable/component/clickable.component';
import { MediaCardExample } from '../examples/media/component/media.component';
import { SideMediaCardExample } from '../examples/side-media/component/side-media.component';

@Component({
  standalone: true,
  imports: [
    SolarisBadgeComponent,
    SolarisButtonDirective,
    SolarisCardActionsDirective,
    SolarisCardComponent,
    SolarisCardContentDirective,
    SolarisCardDescriptionDirective,
    SolarisCardHeaderDirective,
    SolarisCardTitleDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisSkeletonComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicCardExample,
    ClickableCardExample,
    MediaCardExample,
    SideMediaCardExample,
  ],
  templateUrl: './card-showcase.html',
  styleUrls: ['./card-showcase.scss'],
})
export class CardShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CARD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CARD_SHOWCASE_PREV;
  protected readonly next = CARD_SHOWCASE_NEXT;
  protected readonly tocItems = CARD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = CARD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = CARD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CARD_SHOWCASE_BASIC_CODE;
  protected readonly appearanceSurfaceCode =
    CARD_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    CARD_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceTonalCode = CARD_SHOWCASE_APPEARANCE_TONAL_CODE;
  protected readonly appearanceGlassCode = CARD_SHOWCASE_APPEARANCE_GLASS_CODE;
  protected readonly radiusNoneCode = CARD_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = CARD_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusLgCode = CARD_SHOWCASE_RADIUS_LG_CODE;
  protected readonly radiusXlCode = CARD_SHOWCASE_RADIUS_XL_CODE;
  protected readonly mediaTopCode = CARD_SHOWCASE_MEDIA_TOP_CODE;
  protected readonly mediaStartCode = CARD_SHOWCASE_MEDIA_START_CODE;
  protected readonly clickableCode = CARD_SHOWCASE_CLICKABLE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CARD_TRANSLATION_PREFIX,
      slug: CARD_SHOWCASE_SLUG,
      importCode: CARD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance =
    signal<SolarisCardAppearance>('surface');
  protected readonly selectedRadius = signal<SolarisCardRadius>('lg');
  protected readonly selectedPadding = signal<SolarisCardPadding>('md');
  protected readonly selectedDensity = signal<SolarisCardDensity>('normal');
  protected readonly selectedMedia = signal<SolarisCardMediaPosition>('top');

  protected readonly paddingDensityCode = computed(() =>
    [
      `<solaris-card padding="${this.selectedPadding()}" density="${this.selectedDensity()}">`,
      '  <div solaris-card-header>',
      '    <h3 solaris-card-title>Slack Integration</h3>',
      '    <p solaris-card-description>Connect your Slack account.</p>',
      '  </div>',
      '  <div solaris-card-content>',
      '    <solaris-badge color="primary">Development</solaris-badge>',
      '  </div>',
      '</solaris-card>',
    ].join('\n'),
  );

  protected readonly compositionLoading = signal(false);

  protected toggleCompositionLoading(): void {
    this.compositionLoading.update((value) => !value);
  }

  protected readonly compositionCode = computed(() => {
    if (this.compositionLoading()) {
      return [
        '<solaris-card padding="md">',
        '  <div solaris-card-header [separator]="false">',
        '    <solaris-skeleton variant="rectangular" height="28px" width="45%"></solaris-skeleton>',
        '    <solaris-skeleton [lines]="2"></solaris-skeleton>',
        '  </div>',
        '  <div solaris-card-actions>',
        '    <solaris-skeleton variant="rectangular" height="32px" width="96px"></solaris-skeleton>',
        '    <solaris-skeleton variant="rectangular" height="32px" width="112px"></solaris-skeleton>',
        '  </div>',
        '</solaris-card>',
      ].join('\n');
    }
    return [
      '<solaris-card padding="md">',
      '  <div solaris-card-header [separator]="false">',
      '    <h3 solaris-card-title>Slack Integration</h3>',
      '    <p solaris-card-description>Connect your Slack account.</p>',
      '  </div>',
      '  <div solaris-card-actions>',
      '    <button solaris-button>Connect</button>',
      '    <button solaris-button appearance="outline">Learn more</button>',
      '  </div>',
      '</solaris-card>',
    ].join('\n');
  });

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
