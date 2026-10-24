import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPopoverDirective,
  SolarisPopoverTriggerDirective,
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
  POPOVER_SHOWCASE_ACCESSIBILITY_CODE,
  POPOVER_SHOWCASE_ALIGN_CENTER_CODE,
  POPOVER_SHOWCASE_ALIGN_END_CODE,
  POPOVER_SHOWCASE_ALIGN_START_CODE,
  POPOVER_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  POPOVER_SHOWCASE_APPEARANCE_SURFACE_CODE,
  POPOVER_SHOWCASE_BASIC_CODE,
  POPOVER_SHOWCASE_BREADCRUMBS,
  POPOVER_SHOWCASE_CLOSE_BEHAVIOR_CODE,
  POPOVER_SHOWCASE_IMPORT_CODE,
  POPOVER_SHOWCASE_INSTALL_COMMANDS,
  POPOVER_SHOWCASE_INTERACTIVE_CODE,
  POPOVER_SHOWCASE_MATCH_WIDTH_CODE,
  POPOVER_SHOWCASE_MAX_HEIGHT_CODE,
  POPOVER_SHOWCASE_MIN_MAX_WIDTH_CODE,
  POPOVER_SHOWCASE_NEXT,
  POPOVER_SHOWCASE_PADDING_LG_CODE,
  POPOVER_SHOWCASE_PADDING_MD_CODE,
  POPOVER_SHOWCASE_PADDING_NONE_CODE,
  POPOVER_SHOWCASE_PADDING_SM_CODE,
  POPOVER_SHOWCASE_PLACEMENT_BOTTOM_CODE,
  POPOVER_SHOWCASE_PLACEMENT_LEFT_CODE,
  POPOVER_SHOWCASE_PLACEMENT_RIGHT_CODE,
  POPOVER_SHOWCASE_PLACEMENT_TOP_CODE,
  POPOVER_SHOWCASE_PREV,
  POPOVER_SHOWCASE_RADIUS_LG_CODE,
  POPOVER_SHOWCASE_RADIUS_MD_CODE,
  POPOVER_SHOWCASE_RADIUS_NONE_CODE,
  POPOVER_SHOWCASE_RADIUS_SM_CODE,
  POPOVER_SHOWCASE_RADIUS_XL_CODE,
  POPOVER_SHOWCASE_REACTIVE_CODE,
  POPOVER_SHOWCASE_SLUG,
  POPOVER_SHOWCASE_TOC_ITEMS,
  POPOVER_TRANSLATION_PREFIX,
} from '../model/popover-showcase.data';

import { PopoverBasicExample } from '../examples/basic/component/basic.component';
import { PopoverInteractiveExample } from '../examples/interactive/component/interactive.component';
import { PopoverMatchWidthExample } from '../examples/match-width/component/match-width.component';
import { PopoverMaxHeightExample } from '../examples/max-height/component/max-height.component';
import { PopoverReactiveExample } from '../examples/reactive/component/reactive.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPopoverDirective,
    SolarisPopoverTriggerDirective,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    PopoverBasicExample,
    PopoverInteractiveExample,
    PopoverMatchWidthExample,
    PopoverMaxHeightExample,
    PopoverReactiveExample,
  ],
  templateUrl: './popover-showcase.html',
  styleUrls: ['./popover-showcase.scss'],
})
export class PopoverShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = POPOVER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = POPOVER_SHOWCASE_PREV;
  protected readonly next = POPOVER_SHOWCASE_NEXT;
  protected readonly tocItems = POPOVER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = POPOVER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = POPOVER_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = POPOVER_SHOWCASE_BASIC_CODE;
  protected readonly placementTopCode = POPOVER_SHOWCASE_PLACEMENT_TOP_CODE;
  protected readonly placementRightCode = POPOVER_SHOWCASE_PLACEMENT_RIGHT_CODE;
  protected readonly placementBottomCode =
    POPOVER_SHOWCASE_PLACEMENT_BOTTOM_CODE;
  protected readonly placementLeftCode = POPOVER_SHOWCASE_PLACEMENT_LEFT_CODE;
  protected readonly alignStartCode = POPOVER_SHOWCASE_ALIGN_START_CODE;
  protected readonly alignCenterCode = POPOVER_SHOWCASE_ALIGN_CENTER_CODE;
  protected readonly alignEndCode = POPOVER_SHOWCASE_ALIGN_END_CODE;
  protected readonly appearanceSurfaceCode =
    POPOVER_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    POPOVER_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly paddingNoneCode = POPOVER_SHOWCASE_PADDING_NONE_CODE;
  protected readonly paddingSmCode = POPOVER_SHOWCASE_PADDING_SM_CODE;
  protected readonly paddingMdCode = POPOVER_SHOWCASE_PADDING_MD_CODE;
  protected readonly paddingLgCode = POPOVER_SHOWCASE_PADDING_LG_CODE;
  protected readonly radiusNoneCode = POPOVER_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = POPOVER_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = POPOVER_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = POPOVER_SHOWCASE_RADIUS_LG_CODE;
  protected readonly radiusXlCode = POPOVER_SHOWCASE_RADIUS_XL_CODE;
  protected readonly matchWidthCode = POPOVER_SHOWCASE_MATCH_WIDTH_CODE;
  protected readonly minMaxWidthCode = POPOVER_SHOWCASE_MIN_MAX_WIDTH_CODE;
  protected readonly maxHeightCode = POPOVER_SHOWCASE_MAX_HEIGHT_CODE;
  protected readonly closeBehaviorCode = POPOVER_SHOWCASE_CLOSE_BEHAVIOR_CODE;
  protected readonly interactiveCode = POPOVER_SHOWCASE_INTERACTIVE_CODE;
  protected readonly reactiveCode = POPOVER_SHOWCASE_REACTIVE_CODE;
  protected readonly accessibilityCode = POPOVER_SHOWCASE_ACCESSIBILITY_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: POPOVER_TRANSLATION_PREFIX,
      slug: POPOVER_SHOWCASE_SLUG,
      importCode: POPOVER_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedPlacement = signal<string>('bottom');
  protected readonly selectedAlign = signal<string>('start');
  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedPadding = signal<string>('md');
  protected readonly selectedRadius = signal<string>('md');

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
