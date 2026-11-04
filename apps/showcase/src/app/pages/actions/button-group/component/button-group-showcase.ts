import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisButtonGroupComponent,
  SolarisButtonDirective,
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTableCellDirective,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisButtonGroupDensity,
  type SolarisButtonGroupOrientation,
  type SolarisButtonGroupSize,
  type SolarisPreviewCodeFile,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import { BasicButtonGroupExample } from '../examples/basic/component/basic.component';
import { DisabledButtonGroupExample } from '../examples/disabled/component/disabled.component';
import { FullWidthButtonGroupExample } from '../examples/full-width/component/full-width.component';
import { LoadingButtonGroupExample } from '../examples/loading/component/loading.component';
import { MixedButtonGroupExample } from '../examples/mixed/component/mixed.component';
import { MotionButtonGroupExample } from '../examples/motion/component/motion.component';
import { OrientationButtonGroupExample } from '../examples/orientation/component/orientation.component';
import {
  BUTTON_GROUP_SHOWCASE_BASIC_CODE,
  BUTTON_GROUP_SHOWCASE_BREADCRUMBS,
  BUTTON_GROUP_SHOWCASE_FULL_WIDTH_CODE,
  BUTTON_GROUP_SHOWCASE_IMPORT_CODE,
  BUTTON_GROUP_SHOWCASE_INSTALL_COMMANDS,
  BUTTON_GROUP_SHOWCASE_MIXED_CODE,
  BUTTON_GROUP_SHOWCASE_MOTION_HTML_CODE,
  BUTTON_GROUP_SHOWCASE_MOTION_TS_CODE,
  BUTTON_GROUP_SHOWCASE_NEXT,
  BUTTON_GROUP_SHOWCASE_PREV,
  BUTTON_GROUP_SHOWCASE_SLUG,
  BUTTON_GROUP_SHOWCASE_STATES_DISABLED_CODE,
  BUTTON_GROUP_SHOWCASE_STATES_LOADING_CODE,
  BUTTON_GROUP_SHOWCASE_TOC_ITEMS,
  BUTTON_GROUP_TRANSLATION_PREFIX,
} from '../model/button-group-showcase.data';
import {
  buildButtonGroupAttachedCode,
  buildButtonGroupOrientationCode,
  buildButtonGroupSizeDensityCode,
} from '../functions/button-group-showcase-snippets';
import { BUTTON_GROUP_PROP_ROWS } from '../model/button-group-showcase-props.data';
import {
  buildActionPropsColumns,
  type ActionPropRow,
} from '../../model/action-props-table.data';

@Component({
  standalone: true,
  imports: [
    SolarisButtonGroupComponent,
    SolarisButtonDirective,
    SolarisCodeBlockComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTableCellDirective,
    SolarisTableComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicButtonGroupExample,
    DisabledButtonGroupExample,
    FullWidthButtonGroupExample,
    LoadingButtonGroupExample,
    MixedButtonGroupExample,
    MotionButtonGroupExample,
    OrientationButtonGroupExample,
  ],
  templateUrl: './button-group-showcase.html',
  styleUrls: ['./button-group-showcase.scss'],
})
export class ButtonGroupShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BUTTON_GROUP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BUTTON_GROUP_SHOWCASE_PREV;
  protected readonly next = BUTTON_GROUP_SHOWCASE_NEXT;
  protected readonly tocItems = BUTTON_GROUP_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = BUTTON_GROUP_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = BUTTON_GROUP_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = BUTTON_GROUP_SHOWCASE_BASIC_CODE;
  protected readonly mixedCode = BUTTON_GROUP_SHOWCASE_MIXED_CODE;
  protected readonly statesDisabledCode =
    BUTTON_GROUP_SHOWCASE_STATES_DISABLED_CODE;
  protected readonly statesLoadingCode =
    BUTTON_GROUP_SHOWCASE_STATES_LOADING_CODE;
  protected readonly fullWidthCode = BUTTON_GROUP_SHOWCASE_FULL_WIDTH_CODE;

  protected readonly motionFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: BUTTON_GROUP_SHOWCASE_MOTION_HTML_CODE,
    },
    {
      id: 'ts',
      label: 'TypeScript',
      language: 'ts',
      code: BUTTON_GROUP_SHOWCASE_MOTION_TS_CODE,
    },
  ];

  protected readonly propsRows = BUTTON_GROUP_PROP_ROWS;

  protected readonly propsColumns = computed<
    SolarisTableColumn<ActionPropRow>[]
  >(() =>
    buildActionPropsColumns({
      prop: this.translateService.translate('button-group.props.colProp'),
      type: this.translateService.translate('button-group.props.colType'),
      values: this.translateService.translate('button-group.props.colValues'),
      default: this.translateService.translate('button-group.props.colDefault'),
    }),
  );

  protected readonly motionLoading = signal(false);

  protected toggleMotionLoading(): void {
    this.motionLoading.update((value) => !value);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BUTTON_GROUP_TRANSLATION_PREFIX,
      slug: BUTTON_GROUP_SHOWCASE_SLUG,
      importCode: BUTTON_GROUP_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedSize = signal<SolarisButtonGroupSize>('md');
  protected readonly selectedDensity =
    signal<SolarisButtonGroupDensity>('normal');
  protected readonly selectedOrientation =
    signal<SolarisButtonGroupOrientation>('horizontal');
  protected readonly selectedAttached = signal<'attached' | 'separated'>(
    'attached',
  );

  protected readonly attached = computed(
    () => this.selectedAttached() === 'attached',
  );

  protected readonly sizeDensityCode = computed(() =>
    buildButtonGroupSizeDensityCode(
      this.selectedSize(),
      this.selectedDensity(),
    ),
  );

  protected readonly orientationCode = computed(() =>
    buildButtonGroupOrientationCode(this.selectedOrientation()),
  );

  protected readonly attachedCode = computed(() =>
    buildButtonGroupAttachedCode(this.attached()),
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
