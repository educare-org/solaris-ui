import { Component, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  SolarisIconButtonDirective,
  SolarisButtonDirective,
  SolarisIconButtonBadgeDirective,
  SolarisBadgeComponent,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTableCellDirective,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisIconButtonAppearance,
  type SolarisIconButtonColor,
  type SolarisIconButtonDensity,
  type SolarisIconButtonRadius,
  type SolarisIconButtonShape,
  type SolarisIconButtonSize,
  type SolarisPreviewCodeFile,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  ICON_BUTTON_SHOWCASE_APPEARANCES,
  ICON_BUTTON_SHOWCASE_ASYNC_HTML_CODE,
  ICON_BUTTON_SHOWCASE_ASYNC_TS_CODE,
  ICON_BUTTON_SHOWCASE_BADGE_CODE,
  ICON_BUTTON_SHOWCASE_BREADCRUMBS,
  ICON_BUTTON_SHOWCASE_COLORS,
  ICON_BUTTON_SHOWCASE_CUSTOM_HTML_CODE,
  ICON_BUTTON_SHOWCASE_CUSTOM_SCSS_CODE,
  ICON_BUTTON_SHOWCASE_IMPORT_CODE,
  ICON_BUTTON_SHOWCASE_INSTALL_COMMANDS,
  ICON_BUTTON_SHOWCASE_MOTION_HTML_CODE,
  ICON_BUTTON_SHOWCASE_MOTION_TS_CODE,
  ICON_BUTTON_SHOWCASE_NEXT,
  ICON_BUTTON_SHOWCASE_PREV,
  ICON_BUTTON_SHOWCASE_RADII,
  ICON_BUTTON_SHOWCASE_SLUG,
  ICON_BUTTON_SHOWCASE_TOC_ITEMS,
  ICON_BUTTON_TRANSLATION_PREFIX,
} from '../model/icon-button-showcase.data';
import { BadgeIconButtonExample } from '../examples/badge/component/badge.component';
import { AsyncIconButtonExample } from '../examples/async/component/async.component';
import { CustomIconButtonExample } from '../examples/custom/component/custom.component';
import { MotionIconButtonExample } from '../examples/motion/component/motion.component';
import {
  buildIconButtonAppearanceColorCode,
  buildIconButtonChromelessCode,
  buildIconButtonRadiusCode,
  buildIconButtonShapeCode,
  buildIconButtonSizeDensityCode,
  buildIconButtonStateCode,
} from '../functions/icon-button-showcase-snippets';
import { ICON_BUTTON_PROP_ROWS } from '../model/icon-button-showcase-props.data';
import {
  buildActionPropsColumns,
  type ActionPropRow,
} from '../../model/action-props-table.data';

@Component({
  standalone: true,
  imports: [
    SolarisIconButtonDirective,
    SolarisButtonDirective,
    SolarisIconButtonBadgeDirective,
    SolarisBadgeComponent,
    SolarisCodeBlockComponent,
    SolarisIconComponent,
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
    AsyncIconButtonExample,
    BadgeIconButtonExample,
    CustomIconButtonExample,
    MotionIconButtonExample,
  ],
  templateUrl: './icon-button-showcase.html',
  styleUrls: ['./icon-button-showcase.scss'],
})
export class IconButtonShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = ICON_BUTTON_SHOWCASE_BREADCRUMBS;
  protected readonly prev = ICON_BUTTON_SHOWCASE_PREV;
  protected readonly next = ICON_BUTTON_SHOWCASE_NEXT;
  protected readonly tocItems = ICON_BUTTON_SHOWCASE_TOC_ITEMS;

  protected readonly appearances = ICON_BUTTON_SHOWCASE_APPEARANCES;
  protected readonly colors = ICON_BUTTON_SHOWCASE_COLORS;
  protected readonly radii = ICON_BUTTON_SHOWCASE_RADII;

  protected readonly installCommands = ICON_BUTTON_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = ICON_BUTTON_SHOWCASE_IMPORT_CODE;
  protected readonly badgeCode = ICON_BUTTON_SHOWCASE_BADGE_CODE;

  protected readonly customFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: ICON_BUTTON_SHOWCASE_CUSTOM_HTML_CODE,
    },
    {
      id: 'scss',
      label: 'SCSS',
      language: 'scss',
      code: ICON_BUTTON_SHOWCASE_CUSTOM_SCSS_CODE,
    },
  ];
  protected readonly motionFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: ICON_BUTTON_SHOWCASE_MOTION_HTML_CODE,
    },
    {
      id: 'ts',
      label: 'TypeScript',
      language: 'ts',
      code: ICON_BUTTON_SHOWCASE_MOTION_TS_CODE,
    },
  ];
  protected readonly asyncFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: ICON_BUTTON_SHOWCASE_ASYNC_HTML_CODE,
    },
    {
      id: 'ts',
      label: 'TypeScript',
      language: 'ts',
      code: ICON_BUTTON_SHOWCASE_ASYNC_TS_CODE,
    },
  ];

  protected readonly propsRows = ICON_BUTTON_PROP_ROWS;

  protected readonly propsColumns = computed<
    SolarisTableColumn<ActionPropRow>[]
  >(() =>
    buildActionPropsColumns({
      prop: this.translateService.translate('icon-button.props.colProp'),
      type: this.translateService.translate('icon-button.props.colType'),
      values: this.translateService.translate('icon-button.props.colValues'),
      default: this.translateService.translate('icon-button.props.colDefault'),
    }),
  );

  protected readonly motionLoading = signal(false);
  protected readonly motionBadge = signal(true);

  protected toggleMotionLoading(): void {
    this.motionLoading.update((value) => !value);
  }

  protected toggleMotionBadge(): void {
    this.motionBadge.update((value) => !value);
  }

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: ICON_BUTTON_TRANSLATION_PREFIX,
      slug: ICON_BUTTON_SHOWCASE_SLUG,
      importCode: ICON_BUTTON_SHOWCASE_IMPORT_CODE,
    },
  );

  protected selectedAppearance = signal<SolarisIconButtonAppearance>('solid');
  protected selectedColor = signal<SolarisIconButtonColor>('primary');
  protected selectedSize = signal<SolarisIconButtonSize>('md');
  protected selectedDensity = signal<SolarisIconButtonDensity>('normal');
  protected selectedChromelessSize = signal<SolarisIconButtonSize>('md');
  protected selectedRadius = signal<SolarisIconButtonRadius>('md');
  protected selectedShape = signal<SolarisIconButtonShape>('normal');
  protected selectedStateTab = signal<string>('loading');
  protected readonly stateOn = signal(true);

  protected toggleState(): void {
    this.stateOn.update((value) => !value);
  }

  protected readonly stateToggleKey = computed(() => {
    const on = this.stateOn();
    if (this.selectedStateTab() === 'disabled') {
      return on
        ? 'icon-button.states.toggle.disabled.off'
        : 'icon-button.states.toggle.disabled.on';
    }
    return on
      ? 'icon-button.states.toggle.loading.off'
      : 'icon-button.states.toggle.loading.on';
  });

  protected readonly appearanceColorCode = computed(() =>
    buildIconButtonAppearanceColorCode(
      this.selectedAppearance(),
      this.selectedColor(),
    ),
  );

  protected readonly sizeDensityCode = computed(() =>
    buildIconButtonSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );

  protected readonly chromelessCode = computed(() =>
    buildIconButtonChromelessCode(this.selectedChromelessSize()),
  );

  protected radiusCode(radius: SolarisIconButtonRadius): string {
    return buildIconButtonRadiusCode(radius);
  }

  protected shapeCode(shape: SolarisIconButtonShape): string {
    return buildIconButtonShapeCode(shape);
  }

  protected readonly stateCode = computed(() =>
    buildIconButtonStateCode(this.selectedStateTab(), this.stateOn()),
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
