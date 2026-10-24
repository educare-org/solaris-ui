import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisMultiSelectComponent,
  SolarisOptionComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisMultiSelectDensity,
  type SolarisMultiSelectSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  MULTI_SELECT_SHOWCASE_APPEARANCE_FILLED_CODE,
  MULTI_SELECT_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  MULTI_SELECT_SHOWCASE_APPEARANCE_SURFACE_CODE,
  MULTI_SELECT_SHOWCASE_BASIC_CODE,
  MULTI_SELECT_SHOWCASE_BREADCRUMBS,
  MULTI_SELECT_SHOWCASE_CHIPS_CODE,
  MULTI_SELECT_SHOWCASE_CLEARABLE_CODE,
  MULTI_SELECT_SHOWCASE_IMPORT_CODE,
  MULTI_SELECT_SHOWCASE_INSTALL_COMMANDS,
  MULTI_SELECT_SHOWCASE_NEXT,
  MULTI_SELECT_SHOWCASE_PREFIX_CODE,
  MULTI_SELECT_SHOWCASE_PREV,
  MULTI_SELECT_SHOWCASE_RADIUS_LG_CODE,
  MULTI_SELECT_SHOWCASE_RADIUS_MD_CODE,
  MULTI_SELECT_SHOWCASE_RADIUS_NONE_CODE,
  MULTI_SELECT_SHOWCASE_RADIUS_SM_CODE,
  MULTI_SELECT_SHOWCASE_RADIUS_XL_CODE,
  MULTI_SELECT_SHOWCASE_SEARCHABLE_CODE,
  MULTI_SELECT_SHOWCASE_SELECT_ALL_CODE,
  MULTI_SELECT_SHOWCASE_SLUG,
  MULTI_SELECT_SHOWCASE_STATES_CODE,
  MULTI_SELECT_SHOWCASE_SUFFIX_ACTION_CODE,
  MULTI_SELECT_SHOWCASE_SUFFIX_CODE,
  MULTI_SELECT_SHOWCASE_SUFFIX_INPUT_CODE,
  MULTI_SELECT_SHOWCASE_TOC_ITEMS,
  MULTI_SELECT_TRANSLATION_PREFIX,
} from '../model/multi-select-showcase.data';

import { BasicMultiSelectExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisMultiSelectComponent,
    SolarisOptionComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicMultiSelectExample,
  ],
  templateUrl: './multi-select-showcase.html',
  styleUrls: ['./multi-select-showcase.scss'],
})
export class MultiSelectShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = MULTI_SELECT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = MULTI_SELECT_SHOWCASE_PREV;
  protected readonly next = MULTI_SELECT_SHOWCASE_NEXT;
  protected readonly tocItems = MULTI_SELECT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = MULTI_SELECT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = MULTI_SELECT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = MULTI_SELECT_SHOWCASE_BASIC_CODE;
  protected readonly appearanceOutlineCode =
    MULTI_SELECT_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    MULTI_SELECT_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    MULTI_SELECT_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = MULTI_SELECT_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = MULTI_SELECT_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = MULTI_SELECT_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = MULTI_SELECT_SHOWCASE_RADIUS_LG_CODE;
  protected readonly radiusXlCode = MULTI_SELECT_SHOWCASE_RADIUS_XL_CODE;
  protected readonly statesCode = MULTI_SELECT_SHOWCASE_STATES_CODE;
  protected readonly clearableCode = MULTI_SELECT_SHOWCASE_CLEARABLE_CODE;
  protected readonly prefixCode = MULTI_SELECT_SHOWCASE_PREFIX_CODE;
  protected readonly suffixCode = MULTI_SELECT_SHOWCASE_SUFFIX_CODE;
  protected readonly suffixInputCode = MULTI_SELECT_SHOWCASE_SUFFIX_INPUT_CODE;
  protected readonly suffixActionCode =
    MULTI_SELECT_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly searchableCode = MULTI_SELECT_SHOWCASE_SEARCHABLE_CODE;
  protected readonly selectAllCode = MULTI_SELECT_SHOWCASE_SELECT_ALL_CODE;
  protected readonly chipsCode = MULTI_SELECT_SHOWCASE_CHIPS_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: MULTI_SELECT_TRANSLATION_PREFIX,
      slug: MULTI_SELECT_SHOWCASE_SLUG,
      importCode: MULTI_SELECT_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('sm');
  protected readonly selectedSize = signal<SolarisMultiSelectSize>('md');
  protected readonly selectedDensity =
    signal<SolarisMultiSelectDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-multi-select label="Countries" size="${this.selectedSize()}" density="${this.selectedDensity()}" placeholder="Select countries">`,
      '  <solaris-option value="br">Brazil</solaris-option>',
      '  <solaris-option value="us">United States</solaris-option>',
      '</solaris-multi-select>',
    ].join('\n'),
  );

  protected readonly disabledControl = new FormControl({
    value: ['br'],
    disabled: true,
  });
  protected readonly readonlyControl = new FormControl<string[]>(['br', 'us']);
  protected readonly clearableControl = new FormControl<string[]>(['br']);
  protected readonly invalidControl = new FormControl<string[] | null>(null, [
    Validators.required,
  ]);
  protected readonly selectAllControl = new FormControl<string[]>([]);
  protected readonly chipsControl = new FormControl<string[]>([
    'br',
    'us',
    'pt',
  ]);

  protected readonly clearedCount = signal(0);
  protected readonly actionLoading = signal(false);

  protected get invalidError(): string {
    if (this.invalidControl.hasError('required')) {
      return this.translateService.translate('multiSelect.error.required');
    }
    return '';
  }

  protected onCleared(): void {
    this.clearedCount.update((count) => count + 1);
  }

  protected toggleActionLoading(): void {
    this.actionLoading.update((loading) => !loading);
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
