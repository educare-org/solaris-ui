import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCheckboxComponent,
  SolarisCheckboxGroupComponent,
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCheckboxGroupDensity,
  type SolarisCheckboxGroupSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  CHECKBOX_GROUP_SHOWCASE_BASIC_CODE,
  CHECKBOX_GROUP_SHOWCASE_BREADCRUMBS,
  CHECKBOX_GROUP_SHOWCASE_FORM_FIELD_CODE,
  CHECKBOX_GROUP_SHOWCASE_IMPORT_CODE,
  CHECKBOX_GROUP_SHOWCASE_INSTALL_COMMANDS,
  CHECKBOX_GROUP_SHOWCASE_LAYOUT_GRID_CODE,
  CHECKBOX_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE,
  CHECKBOX_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE,
  CHECKBOX_GROUP_SHOWCASE_NEXT,
  CHECKBOX_GROUP_SHOWCASE_PREV,
  CHECKBOX_GROUP_SHOWCASE_SELECT_ALL_CODE,
  CHECKBOX_GROUP_SHOWCASE_STATES_CODE,
  CHECKBOX_GROUP_SHOWCASE_TOC_ITEMS,
  CHECKBOX_GROUP_SHOWCASE_VALIDATION_CODE,
  CHECKBOX_GROUP_TRANSLATION_PREFIX,
} from '../model/checkbox-group-showcase.data';

import { BasicCheckboxGroupExample } from '../examples/basic/component/basic.component';
import { SelectAllCheckboxGroupExample } from '../examples/select-all/component/select-all.component';
import { ValidationCheckboxGroupExample } from '../examples/validation/component/validation.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxComponent,
    SolarisCheckboxGroupComponent,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicCheckboxGroupExample,
    SelectAllCheckboxGroupExample,
    ValidationCheckboxGroupExample,
  ],
  templateUrl: './checkbox-group-showcase.html',
  styleUrls: ['./checkbox-group-showcase.scss'],
})
export class CheckboxGroupShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CHECKBOX_GROUP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CHECKBOX_GROUP_SHOWCASE_PREV;
  protected readonly next = CHECKBOX_GROUP_SHOWCASE_NEXT;
  protected readonly tocItems = CHECKBOX_GROUP_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = CHECKBOX_GROUP_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = CHECKBOX_GROUP_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CHECKBOX_GROUP_SHOWCASE_BASIC_CODE;
  protected readonly selectAllCode = CHECKBOX_GROUP_SHOWCASE_SELECT_ALL_CODE;
  protected readonly layoutVerticalCode =
    CHECKBOX_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE;
  protected readonly layoutHorizontalCode =
    CHECKBOX_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE;
  protected readonly layoutGridCode = CHECKBOX_GROUP_SHOWCASE_LAYOUT_GRID_CODE;
  protected readonly statesCode = CHECKBOX_GROUP_SHOWCASE_STATES_CODE;
  protected readonly validationCode = CHECKBOX_GROUP_SHOWCASE_VALIDATION_CODE;
  protected readonly formFieldCode = CHECKBOX_GROUP_SHOWCASE_FORM_FIELD_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CHECKBOX_GROUP_TRANSLATION_PREFIX,
      slug: 'checkbox-group',
      importCode: CHECKBOX_GROUP_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedLayout = signal<
    'vertical' | 'horizontal' | 'grid'
  >('vertical');
  protected readonly selectedSize = signal<SolarisCheckboxGroupSize>('md');
  protected readonly selectedDensity =
    signal<SolarisCheckboxGroupDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-checkbox-group size="${this.selectedSize()}" density="${this.selectedDensity()}" label="Interests">`,
      '  <!-- children inherit size/density from the group -->',
      '  <solaris-checkbox value="sports">Sports</solaris-checkbox>',
      '  <solaris-checkbox value="finance">Finance</solaris-checkbox>',
      '</solaris-checkbox-group>',
    ].join('\n'),
  );

  protected readonly formFieldControl = new FormControl(['sports']);

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
