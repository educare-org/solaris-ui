import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCheckboxComponent,
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisCheckboxDensity,
  type SolarisCheckboxSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  CHECKBOX_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  CHECKBOX_SHOWCASE_APPEARANCE_SURFACE_CODE,
  CHECKBOX_SHOWCASE_BASIC_CODE,
  CHECKBOX_SHOWCASE_BREADCRUMBS,
  CHECKBOX_SHOWCASE_DESCRIPTION_CODE,
  CHECKBOX_SHOWCASE_COLOR_CUSTOM_CODE,
  CHECKBOX_SHOWCASE_COLOR_DANGER_CODE,
  CHECKBOX_SHOWCASE_COLOR_INFO_CODE,
  CHECKBOX_SHOWCASE_COLOR_NEUTRAL_CODE,
  CHECKBOX_SHOWCASE_COLOR_PRIMARY_CODE,
  CHECKBOX_SHOWCASE_COLOR_SUCCESS_CODE,
  CHECKBOX_SHOWCASE_COLOR_WARNING_CODE,
  CHECKBOX_SHOWCASE_FORM_FIELD_CODE,
  CHECKBOX_SHOWCASE_IMPORT_CODE,
  CHECKBOX_SHOWCASE_INDETERMINATE_CODE,
  CHECKBOX_SHOWCASE_INSTALL_COMMANDS,
  CHECKBOX_SHOWCASE_NEXT,
  CHECKBOX_SHOWCASE_PREV,
  CHECKBOX_SHOWCASE_RADIUS_FULL_CODE,
  CHECKBOX_SHOWCASE_RADIUS_LG_CODE,
  CHECKBOX_SHOWCASE_RADIUS_MD_CODE,
  CHECKBOX_SHOWCASE_RADIUS_SM_CODE,
  CHECKBOX_SHOWCASE_RADIUS_XL_CODE,
  CHECKBOX_SHOWCASE_REACTIVE_CODE,
  CHECKBOX_SHOWCASE_SLUG,
  CHECKBOX_SHOWCASE_STATES_CODE,
  CHECKBOX_SHOWCASE_TOC_ITEMS,
  CHECKBOX_TRANSLATION_PREFIX,
} from '../model/checkbox-showcase.data';

import { BasicCheckboxExample } from '../examples/basic/component/basic.component';
import { IndeterminateCheckboxExample } from '../examples/indeterminate/component/indeterminate.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxComponent,
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
    BasicCheckboxExample,
    IndeterminateCheckboxExample,
  ],
  templateUrl: './checkbox-showcase.html',
  styleUrls: ['./checkbox-showcase.scss'],
})
export class CheckboxShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = CHECKBOX_SHOWCASE_BREADCRUMBS;
  protected readonly prev = CHECKBOX_SHOWCASE_PREV;
  protected readonly next = CHECKBOX_SHOWCASE_NEXT;
  protected readonly tocItems = CHECKBOX_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = CHECKBOX_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = CHECKBOX_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = CHECKBOX_SHOWCASE_BASIC_CODE;
  protected readonly indeterminateCode = CHECKBOX_SHOWCASE_INDETERMINATE_CODE;
  protected readonly appearanceSurfaceCode =
    CHECKBOX_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    CHECKBOX_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly colorNeutralCode = CHECKBOX_SHOWCASE_COLOR_NEUTRAL_CODE;
  protected readonly colorPrimaryCode = CHECKBOX_SHOWCASE_COLOR_PRIMARY_CODE;
  protected readonly colorSuccessCode = CHECKBOX_SHOWCASE_COLOR_SUCCESS_CODE;
  protected readonly colorWarningCode = CHECKBOX_SHOWCASE_COLOR_WARNING_CODE;
  protected readonly colorDangerCode = CHECKBOX_SHOWCASE_COLOR_DANGER_CODE;
  protected readonly colorInfoCode = CHECKBOX_SHOWCASE_COLOR_INFO_CODE;
  protected readonly colorCustomCode = CHECKBOX_SHOWCASE_COLOR_CUSTOM_CODE;
  protected readonly radiusSmCode = CHECKBOX_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = CHECKBOX_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = CHECKBOX_SHOWCASE_RADIUS_LG_CODE;
  protected readonly radiusXlCode = CHECKBOX_SHOWCASE_RADIUS_XL_CODE;
  protected readonly radiusFullCode = CHECKBOX_SHOWCASE_RADIUS_FULL_CODE;
  protected readonly statesCode = CHECKBOX_SHOWCASE_STATES_CODE;
  protected readonly descriptionCode = CHECKBOX_SHOWCASE_DESCRIPTION_CODE;
  protected readonly formFieldCode = CHECKBOX_SHOWCASE_FORM_FIELD_CODE;
  protected readonly reactiveCode = CHECKBOX_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: CHECKBOX_TRANSLATION_PREFIX,
      slug: CHECKBOX_SHOWCASE_SLUG,
      importCode: CHECKBOX_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<'surface' | 'outline'>(
    'outline',
  );
  protected readonly selectedColor = signal<string>('neutral');
  protected readonly selectedRadius = signal<string>('sm');
  protected readonly selectedSize = signal<SolarisCheckboxSize>('md');
  protected readonly selectedDensity = signal<SolarisCheckboxDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-checkbox size="${this.selectedSize()}" density="${this.selectedDensity()}">`,
      '  Option',
      '</solaris-checkbox>',
    ].join('\n'),
  );

  protected readonly termsControl = new FormControl(
    false,
    Validators.requiredTrue,
  );
  protected readonly acceptControl = new FormControl(false);

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
