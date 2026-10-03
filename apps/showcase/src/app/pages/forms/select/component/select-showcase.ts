import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisOptionComponent,
  SolarisPreviewCodeComponent,
  SolarisSelectComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSelectDensity,
  type SolarisSelectSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SELECT_SHOWCASE_APPEARANCE_FILLED_CODE,
  SELECT_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  SELECT_SHOWCASE_APPEARANCE_SURFACE_CODE,
  SELECT_SHOWCASE_BASIC_CODE,
  SELECT_SHOWCASE_BREADCRUMBS,
  SELECT_SHOWCASE_CLEARABLE_CODE,
  SELECT_SHOWCASE_IMPORT_CODE,
  SELECT_SHOWCASE_INSTALL_COMMANDS,
  SELECT_SHOWCASE_NEXT,
  SELECT_SHOWCASE_OBJECT_CODE,
  SELECT_SHOWCASE_PREFIX_CODE,
  SELECT_SHOWCASE_PREV,
  SELECT_SHOWCASE_RADIUS_LG_CODE,
  SELECT_SHOWCASE_RADIUS_MD_CODE,
  SELECT_SHOWCASE_RADIUS_NONE_CODE,
  SELECT_SHOWCASE_RADIUS_SM_CODE,
  SELECT_SHOWCASE_SEARCHABLE_CODE,
  SELECT_SHOWCASE_SLUG,
  SELECT_SHOWCASE_STATES_CODE,
  SELECT_SHOWCASE_SUFFIX_ACTION_CODE,
  SELECT_SHOWCASE_SUFFIX_CODE,
  SELECT_SHOWCASE_TOC_ITEMS,
  SELECT_TRANSLATION_PREFIX,
} from '../model/select-showcase.data';

import { BasicSelectExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisOptionComponent,
    SolarisPreviewCodeComponent,
    SolarisSelectComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicSelectExample,
  ],
  templateUrl: './select-showcase.html',
  styleUrls: ['./select-showcase.scss'],
})
export class SelectShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SELECT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SELECT_SHOWCASE_PREV;
  protected readonly next = SELECT_SHOWCASE_NEXT;
  protected readonly tocItems = SELECT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SELECT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SELECT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SELECT_SHOWCASE_BASIC_CODE;
  protected readonly appearanceOutlineCode =
    SELECT_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    SELECT_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    SELECT_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = SELECT_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = SELECT_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = SELECT_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = SELECT_SHOWCASE_RADIUS_LG_CODE;
  protected readonly statesCode = SELECT_SHOWCASE_STATES_CODE;
  protected readonly clearableCode = SELECT_SHOWCASE_CLEARABLE_CODE;
  protected readonly prefixCode = SELECT_SHOWCASE_PREFIX_CODE;
  protected readonly suffixCode = SELECT_SHOWCASE_SUFFIX_CODE;
  protected readonly suffixActionCode = SELECT_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly searchableCode = SELECT_SHOWCASE_SEARCHABLE_CODE;
  protected readonly objectCode = SELECT_SHOWCASE_OBJECT_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SELECT_TRANSLATION_PREFIX,
      slug: SELECT_SHOWCASE_SLUG,
      importCode: SELECT_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('sm');
  protected readonly selectedSize = signal<SolarisSelectSize>('md');
  protected readonly selectedDensity = signal<SolarisSelectDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-select label="Role" size="${this.selectedSize()}" density="${this.selectedDensity()}" placeholder="Select a role">`,
      '  <solaris-option value="admin">Administrator</solaris-option>',
      '  <solaris-option value="teacher">Teacher</solaris-option>',
      '</solaris-select>',
    ].join('\n'),
  );

  protected readonly disabledControl = new FormControl({
    value: 'admin',
    disabled: true,
  });
  protected readonly readonlyControl = new FormControl('admin');
  protected readonly clearableControl = new FormControl<string | null>(
    'active',
  );
  protected readonly invalidControl = new FormControl<string | null>(null, [
    Validators.required,
  ]);
  protected readonly objectControl = new FormControl<{
    id: number;
    name: string;
  } | null>(null);

  protected readonly clearedCount = signal(0);
  protected readonly actionLoading = signal(false);

  protected readonly basicPlan = { id: 1, name: 'Basic' };
  protected readonly proPlan = { id: 2, name: 'Pro' };

  protected comparePlan(a: unknown, b: unknown): boolean {
    if (!a || !b) return a === b;
    return (a as { id: number }).id === (b as { id: number }).id;
  }

  protected displayPlan(value: unknown): string | undefined {
    if (!value) return undefined;
    return (value as { name: string }).name;
  }

  protected get invalidError(): string {
    if (this.invalidControl.hasError('required')) {
      return this.translateService.translate('select.error.required');
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
