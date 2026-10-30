import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisButtonDirective,
  SolarisButtonIconDirective,
  SolarisCodeBlockComponent,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTableCellDirective,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisButtonAppearance,
  type SolarisButtonColor,
  type SolarisButtonDensity,
  type SolarisButtonRadius,
  type SolarisButtonShape,
  type SolarisButtonSize,
  type SolarisPreviewCodeFile,
  type SolarisTableColumn,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  BUTTON_SHOWCASE_APPEARANCES,
  BUTTON_SHOWCASE_BASIC_CODE,
  BUTTON_SHOWCASE_BREADCRUMBS,
  BUTTON_SHOWCASE_COLORS,
  BUTTON_SHOWCASE_CUSTOM_HTML_CODE,
  BUTTON_SHOWCASE_CUSTOM_SCSS_CODE,
  BUTTON_SHOWCASE_IMPORT_CODE,
  BUTTON_SHOWCASE_INSTALL_COMMANDS,
  BUTTON_SHOWCASE_MOTION_CODE,
  BUTTON_SHOWCASE_MOTION_TS_CODE,
  BUTTON_SHOWCASE_NEXT,
  BUTTON_SHOWCASE_PREV,
  BUTTON_SHOWCASE_RADII,
  BUTTON_SHOWCASE_SLUG,
  BUTTON_SHOWCASE_TOC_ITEMS,
  BUTTON_TRANSLATION_PREFIX,
} from '../model/button-showcase.data';
import {
  buildButtonAppearanceColorCode,
  buildButtonIconCode,
  buildButtonProvidersCode,
  buildButtonRadiusCode,
  buildButtonShapeCode,
  buildButtonSizeDensityCode,
  buildButtonStateCode,
} from '../functions/button-showcase-snippets';
import { BUTTON_PROP_ROWS } from '../model/button-showcase-props.data';
import {
  buildActionPropsColumns,
  type ActionPropRow,
} from '../../model/action-props-table.data';
import { BasicButtonExample } from '../examples/basic/component/basic.component';
import { CustomButtonExample } from '../examples/custom/component/custom.component';
import { MotionButtonExample } from '../examples/motion/component/motion.component';

@Component({
  standalone: true,
  imports: [
    SolarisButtonDirective,
    SolarisButtonIconDirective,
    SolarisCodeBlockComponent,
    SolarisIconComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTableCellDirective,
    SolarisTableComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicButtonExample,
    CustomButtonExample,
    MotionButtonExample,
  ],
  templateUrl: './button-showcase.html',
  styleUrls: ['./button-showcase.scss'],
})
export class ButtonShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = BUTTON_SHOWCASE_BREADCRUMBS;
  protected readonly prev = BUTTON_SHOWCASE_PREV;
  protected readonly next = BUTTON_SHOWCASE_NEXT;
  protected readonly tocItems = BUTTON_SHOWCASE_TOC_ITEMS;

  protected readonly appearances = BUTTON_SHOWCASE_APPEARANCES;
  protected readonly colors = BUTTON_SHOWCASE_COLORS;
  protected readonly radii = BUTTON_SHOWCASE_RADII;

  protected readonly installCommands = BUTTON_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = BUTTON_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = BUTTON_SHOWCASE_BASIC_CODE;
  protected readonly motionCode = BUTTON_SHOWCASE_MOTION_CODE;

  protected readonly customFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: BUTTON_SHOWCASE_CUSTOM_HTML_CODE,
    },
    {
      id: 'scss',
      label: 'SCSS',
      language: 'scss',
      code: BUTTON_SHOWCASE_CUSTOM_SCSS_CODE,
    },
  ];

  protected readonly motionFiles: readonly SolarisPreviewCodeFile[] = [
    {
      id: 'html',
      label: 'HTML',
      language: 'html',
      code: BUTTON_SHOWCASE_MOTION_CODE,
    },
    {
      id: 'ts',
      label: 'TypeScript',
      language: 'ts',
      code: BUTTON_SHOWCASE_MOTION_TS_CODE,
    },
  ];

  protected readonly propsRows = BUTTON_PROP_ROWS;

  protected readonly propsColumns = computed<
    SolarisTableColumn<ActionPropRow>[]
  >(() =>
    buildActionPropsColumns({
      prop: this.translateService.translate('button.props.colProp'),
      type: this.translateService.translate('button.props.colType'),
      values: this.translateService.translate('button.props.colValues'),
      default: this.translateService.translate('button.props.colDefault'),
    }),
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: BUTTON_TRANSLATION_PREFIX,
      slug: BUTTON_SHOWCASE_SLUG,
      importCode: BUTTON_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance =
    signal<SolarisButtonAppearance>('solid');
  protected readonly selectedColor = signal<SolarisButtonColor>('primary');
  protected readonly selectedIconTab = signal<string>('icon-before');
  protected readonly selectedProvider = signal<string>('google');
  protected readonly selectedStateTab = signal<string>('loading');
  protected readonly selectedCustom = signal<string>('violet');
  protected readonly stateOn = signal(true);
  protected readonly motionLoading = signal(false);
  protected readonly motionLongLabel = signal(false);

  protected toggleMotionLoading(): void {
    this.motionLoading.update((value) => !value);
  }

  protected toggleMotionLabel(): void {
    this.motionLongLabel.update((value) => !value);
  }

  protected toggleState(): void {
    this.stateOn.update((value) => !value);
  }
  protected readonly selectedRadius = signal<SolarisButtonRadius>('md');
  protected readonly selectedShape = signal<SolarisButtonShape>('normal');
  protected readonly selectedSize = signal<SolarisButtonSize>('md');
  protected readonly selectedDensity = signal<SolarisButtonDensity>('normal');

  protected readonly appearanceColorCode = computed(() =>
    buildButtonAppearanceColorCode(
      this.selectedAppearance(),
      this.selectedColor(),
    ),
  );

  protected readonly sizeDensityCode = computed(() =>
    buildButtonSizeDensityCode(this.selectedSize(), this.selectedDensity()),
  );

  protected readonly iconCode = computed(() =>
    buildButtonIconCode(this.selectedIconTab()),
  );

  protected readonly providersCode = computed(() =>
    buildButtonProvidersCode(String(this.selectedProvider())),
  );

  protected readonly stateLabelKey = computed(() => {
    switch (this.selectedStateTab()) {
      case 'disabled':
        return 'button.example.states.disabled';
      case 'pressed':
        return 'button.example.states.favorite';
      case 'loading':
      default:
        return 'button.example.loading.save';
    }
  });

  protected readonly stateCode = computed(() =>
    buildButtonStateCode(this.selectedStateTab(), this.stateOn()),
  );

  protected radiusCode(radius: SolarisButtonRadius): string {
    return buildButtonRadiusCode(radius);
  }

  protected shapeCode(shape: SolarisButtonShape): string {
    return buildButtonShapeCode(shape);
  }

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
