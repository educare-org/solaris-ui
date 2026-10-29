import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisSegmentedControlComponent,
  SolarisSegmentedItemComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSegmentedControlDensity,
  type SolarisSegmentedControlSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SEGMENTED_CONTROL_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  SEGMENTED_CONTROL_SHOWCASE_APPEARANCE_SURFACE_CODE,
  SEGMENTED_CONTROL_SHOWCASE_BASIC_CODE,
  SEGMENTED_CONTROL_SHOWCASE_BREADCRUMBS,
  SEGMENTED_CONTROL_SHOWCASE_DISABLED_GROUP_CODE,
  SEGMENTED_CONTROL_SHOWCASE_DISABLED_ITEM_CODE,
  SEGMENTED_CONTROL_SHOWCASE_EQUAL_WIDTH_CODE,
  SEGMENTED_CONTROL_SHOWCASE_FULL_WIDTH_CODE,
  SEGMENTED_CONTROL_SHOWCASE_ICON_ONLY_CODE,
  SEGMENTED_CONTROL_SHOWCASE_IMPORT_CODE,
  SEGMENTED_CONTROL_SHOWCASE_INSTALL_COMMANDS,
  SEGMENTED_CONTROL_SHOWCASE_INVALID_CODE,
  SEGMENTED_CONTROL_SHOWCASE_LONG_LABELS_CODE,
  SEGMENTED_CONTROL_SHOWCASE_MANY_OPTIONS_CODE,
  SEGMENTED_CONTROL_SHOWCASE_NEXT,
  SEGMENTED_CONTROL_SHOWCASE_NO_INDICATOR_CODE,
  SEGMENTED_CONTROL_SHOWCASE_PREV,
  SEGMENTED_CONTROL_SHOWCASE_RADIUS_FULL_CODE,
  SEGMENTED_CONTROL_SHOWCASE_RADIUS_NONE_CODE,
  SEGMENTED_CONTROL_SHOWCASE_RADIUS_LG_CODE,
  SEGMENTED_CONTROL_SHOWCASE_RADIUS_MD_CODE,
  SEGMENTED_CONTROL_SHOWCASE_RADIUS_SM_CODE,
  SEGMENTED_CONTROL_SHOWCASE_READONLY_CODE,
  SEGMENTED_CONTROL_SHOWCASE_REACTIVE_FORMS_CODE,
  SEGMENTED_CONTROL_SHOWCASE_SLUG,
  SEGMENTED_CONTROL_SHOWCASE_TOC_ITEMS,
  SEGMENTED_CONTROL_SHOWCASE_VERTICAL_CODE,
  SEGMENTED_CONTROL_SHOWCASE_WITH_BADGE_CODE,
  SEGMENTED_CONTROL_SHOWCASE_WITH_ICONS_CODE,
  SEGMENTED_CONTROL_TRANSLATION_PREFIX,
} from '../model/segmented-control-showcase.data';

import { SegmentedBasicExample } from '../examples/basic/component/basic.component';
import { SegmentedVerticalExample } from '../examples/vertical/component/vertical.component';
import { SegmentedFullWidthExample } from '../examples/full-width/component/full-width.component';
import { SegmentedEqualWidthExample } from '../examples/equal-width/component/equal-width.component';
import { SegmentedManyOptionsExample } from '../examples/many-options/component/many-options.component';
import { SegmentedLongLabelsExample } from '../examples/long-labels/component/long-labels.component';
import { SegmentedWithIconsExample } from '../examples/with-icons/component/with-icons.component';
import { SegmentedWithBadgeExample } from '../examples/with-badge/component/with-badge.component';
import { SegmentedIconOnlyExample } from '../examples/icon-only/component/icon-only.component';
import { SegmentedNoIndicatorExample } from '../examples/no-indicator/component/no-indicator.component';
import { SegmentedDisabledGroupExample } from '../examples/disabled-group/component/disabled-group.component';
import { SegmentedDisabledItemExample } from '../examples/disabled-item/component/disabled-item.component';
import { SegmentedReadonlyExample } from '../examples/readonly/component/readonly.component';
import { SegmentedInvalidExample } from '../examples/invalid/component/invalid.component';
import { SegmentedReactiveFormsExample } from '../examples/reactive-forms/component/reactive-forms.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisSegmentedControlComponent,
    SolarisSegmentedItemComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    SegmentedBasicExample,
    SegmentedVerticalExample,
    SegmentedFullWidthExample,
    SegmentedEqualWidthExample,
    SegmentedManyOptionsExample,
    SegmentedLongLabelsExample,
    SegmentedWithIconsExample,
    SegmentedWithBadgeExample,
    SegmentedIconOnlyExample,
    SegmentedNoIndicatorExample,
    SegmentedDisabledGroupExample,
    SegmentedDisabledItemExample,
    SegmentedReadonlyExample,
    SegmentedInvalidExample,
    SegmentedReactiveFormsExample,
  ],
  templateUrl: './segmented-control-showcase.html',
  styleUrls: ['./segmented-control-showcase.scss'],
})
export class SegmentedControlShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SEGMENTED_CONTROL_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SEGMENTED_CONTROL_SHOWCASE_PREV;
  protected readonly next = SEGMENTED_CONTROL_SHOWCASE_NEXT;
  protected readonly tocItems = SEGMENTED_CONTROL_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands =
    SEGMENTED_CONTROL_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SEGMENTED_CONTROL_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SEGMENTED_CONTROL_SHOWCASE_BASIC_CODE;
  protected readonly appearanceSurfaceCode =
    SEGMENTED_CONTROL_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    SEGMENTED_CONTROL_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly radiusSmCode = SEGMENTED_CONTROL_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = SEGMENTED_CONTROL_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = SEGMENTED_CONTROL_SHOWCASE_RADIUS_LG_CODE;
  protected readonly radiusFullCode =
    SEGMENTED_CONTROL_SHOWCASE_RADIUS_FULL_CODE;
  protected readonly radiusNoneCode =
    SEGMENTED_CONTROL_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly verticalCode = SEGMENTED_CONTROL_SHOWCASE_VERTICAL_CODE;
  protected readonly fullWidthCode = SEGMENTED_CONTROL_SHOWCASE_FULL_WIDTH_CODE;
  protected readonly equalWidthCode =
    SEGMENTED_CONTROL_SHOWCASE_EQUAL_WIDTH_CODE;
  protected readonly manyOptionsCode =
    SEGMENTED_CONTROL_SHOWCASE_MANY_OPTIONS_CODE;
  protected readonly longLabelsCode =
    SEGMENTED_CONTROL_SHOWCASE_LONG_LABELS_CODE;
  protected readonly withIconsCode = SEGMENTED_CONTROL_SHOWCASE_WITH_ICONS_CODE;
  protected readonly withBadgeCode = SEGMENTED_CONTROL_SHOWCASE_WITH_BADGE_CODE;
  protected readonly iconOnlyCode = SEGMENTED_CONTROL_SHOWCASE_ICON_ONLY_CODE;
  protected readonly noIndicatorCode =
    SEGMENTED_CONTROL_SHOWCASE_NO_INDICATOR_CODE;
  protected readonly disabledGroupCode =
    SEGMENTED_CONTROL_SHOWCASE_DISABLED_GROUP_CODE;
  protected readonly disabledItemCode =
    SEGMENTED_CONTROL_SHOWCASE_DISABLED_ITEM_CODE;
  protected readonly readonlyCode = SEGMENTED_CONTROL_SHOWCASE_READONLY_CODE;
  protected readonly invalidCode = SEGMENTED_CONTROL_SHOWCASE_INVALID_CODE;
  protected readonly reactiveFormsCode =
    SEGMENTED_CONTROL_SHOWCASE_REACTIVE_FORMS_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SEGMENTED_CONTROL_TRANSLATION_PREFIX,
      slug: SEGMENTED_CONTROL_SHOWCASE_SLUG,
      importCode: SEGMENTED_CONTROL_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedSize = signal<SolarisSegmentedControlSize>('md');
  protected readonly selectedDensity =
    signal<SolarisSegmentedControlDensity>('normal');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedLayout = signal<string>('full-width');
  protected readonly selectedFeature = signal<string>('with-icons');
  protected readonly selectedState = signal<string>('disabled-group');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-segmented-control size="${this.selectedSize()}" density="${this.selectedDensity()}" defaultValue="m" aria-label="Size and density">`,
      '  <solaris-segmented-item value="s">Small</solaris-segmented-item>',
      '  <solaris-segmented-item value="m">Medium</solaris-segmented-item>',
      '  <solaris-segmented-item value="l">Large</solaris-segmented-item>',
      '</solaris-segmented-control>',
    ].join('\n'),
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
