import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTooltipDirective,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  TOOLTIP_SHOWCASE_APPEARANCE_INVERSE_CODE,
  TOOLTIP_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  TOOLTIP_SHOWCASE_APPEARANCE_SURFACE_CODE,
  TOOLTIP_SHOWCASE_BASIC_CODE,
  TOOLTIP_SHOWCASE_BREADCRUMBS,
  TOOLTIP_SHOWCASE_CONTENT_ICON_CODE,
  TOOLTIP_SHOWCASE_CONTENT_TEMPLATE_CODE,
  TOOLTIP_SHOWCASE_CONTENT_TITLE_BODY_CODE,
  TOOLTIP_SHOWCASE_DELAYS_CODE,
  TOOLTIP_SHOWCASE_DISABLED_CODE,
  TOOLTIP_SHOWCASE_DISABLED_WRAPPER_CODE,
  TOOLTIP_SHOWCASE_IMPORT_CODE,
  TOOLTIP_SHOWCASE_INSTALL_COMMANDS,
  TOOLTIP_SHOWCASE_MAX_WIDTH_CODE,
  TOOLTIP_SHOWCASE_NEXT,
  TOOLTIP_SHOWCASE_PLACEMENT_BOTTOM_CODE,
  TOOLTIP_SHOWCASE_PLACEMENT_LEFT_CODE,
  TOOLTIP_SHOWCASE_PLACEMENT_RIGHT_CODE,
  TOOLTIP_SHOWCASE_PLACEMENT_TOP_CODE,
  TOOLTIP_SHOWCASE_PREV,
  TOOLTIP_SHOWCASE_RADIUS_LG_CODE,
  TOOLTIP_SHOWCASE_RADIUS_MD_CODE,
  TOOLTIP_SHOWCASE_RADIUS_SM_CODE,
  TOOLTIP_SHOWCASE_SIZE_LG_CODE,
  TOOLTIP_SHOWCASE_SIZE_MD_CODE,
  TOOLTIP_SHOWCASE_SIZE_SM_CODE,
  TOOLTIP_SHOWCASE_SLUG,
  TOOLTIP_SHOWCASE_TOC_ITEMS,
  TOOLTIP_SHOWCASE_TRIGGER_CLICK_CODE,
  TOOLTIP_SHOWCASE_TRIGGER_CLOSEABLE_CODE,
  TOOLTIP_SHOWCASE_TRIGGER_HOVER_CODE,
  TOOLTIP_SHOWCASE_TRIGGER_MANUAL_CODE,
  TOOLTIP_TRANSLATION_PREFIX,
} from '../model/tooltip-showcase.data';

import { TooltipBasicHoverExample } from '../examples/basic-hover/component/basic-hover.component';
import { TooltipClickCloseableExample } from '../examples/click-closeable/component/click-closeable.component';
import { TooltipDisabledWrapperExample } from '../examples/disabled-wrapper/component/disabled-wrapper.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTooltipDirective,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    TooltipBasicHoverExample,
    TooltipClickCloseableExample,
    TooltipDisabledWrapperExample,
  ],
  templateUrl: './tooltip-showcase.html',
  styleUrls: ['./tooltip-showcase.scss'],
})
export class TooltipShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = TOOLTIP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = TOOLTIP_SHOWCASE_PREV;
  protected readonly next = TOOLTIP_SHOWCASE_NEXT;
  protected readonly tocItems = TOOLTIP_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = TOOLTIP_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = TOOLTIP_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = TOOLTIP_SHOWCASE_BASIC_CODE;
  protected readonly triggerHoverCode = TOOLTIP_SHOWCASE_TRIGGER_HOVER_CODE;
  protected readonly triggerClickCode = TOOLTIP_SHOWCASE_TRIGGER_CLICK_CODE;
  protected readonly triggerCloseableCode =
    TOOLTIP_SHOWCASE_TRIGGER_CLOSEABLE_CODE;
  protected readonly triggerManualCode = TOOLTIP_SHOWCASE_TRIGGER_MANUAL_CODE;
  protected readonly contentTitleBodyCode =
    TOOLTIP_SHOWCASE_CONTENT_TITLE_BODY_CODE;
  protected readonly contentIconCode = TOOLTIP_SHOWCASE_CONTENT_ICON_CODE;
  protected readonly contentTemplateCode =
    TOOLTIP_SHOWCASE_CONTENT_TEMPLATE_CODE;
  protected readonly appearanceOutlineCode =
    TOOLTIP_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    TOOLTIP_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceInverseCode =
    TOOLTIP_SHOWCASE_APPEARANCE_INVERSE_CODE;
  protected readonly sizeSmCode = TOOLTIP_SHOWCASE_SIZE_SM_CODE;
  protected readonly sizeMdCode = TOOLTIP_SHOWCASE_SIZE_MD_CODE;
  protected readonly sizeLgCode = TOOLTIP_SHOWCASE_SIZE_LG_CODE;
  protected readonly radiusSmCode = TOOLTIP_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = TOOLTIP_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = TOOLTIP_SHOWCASE_RADIUS_LG_CODE;
  protected readonly placementTopCode = TOOLTIP_SHOWCASE_PLACEMENT_TOP_CODE;
  protected readonly placementBottomCode =
    TOOLTIP_SHOWCASE_PLACEMENT_BOTTOM_CODE;
  protected readonly placementRightCode = TOOLTIP_SHOWCASE_PLACEMENT_RIGHT_CODE;
  protected readonly placementLeftCode = TOOLTIP_SHOWCASE_PLACEMENT_LEFT_CODE;
  protected readonly delaysCode = TOOLTIP_SHOWCASE_DELAYS_CODE;
  protected readonly disabledCode = TOOLTIP_SHOWCASE_DISABLED_CODE;
  protected readonly disabledWrapperCode =
    TOOLTIP_SHOWCASE_DISABLED_WRAPPER_CODE;
  protected readonly maxWidthCode = TOOLTIP_SHOWCASE_MAX_WIDTH_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: TOOLTIP_TRANSLATION_PREFIX,
      slug: TOOLTIP_SHOWCASE_SLUG,
      importCode: TOOLTIP_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedTrigger = signal<string>('hover');
  protected readonly selectedContent = signal<string>('title-body');
  protected readonly selectedAppearance = signal<string>('outline');
  protected readonly selectedSize = signal<string>('sm');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedPlacement = signal<string>('top');

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
