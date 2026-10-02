import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormErrorComponent,
  SolarisFormFieldComponent,
  SolarisFormHintComponent,
  SolarisFormLabelComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisInputDirective,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisFormFieldDensity,
  type SolarisFormFieldSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  FORM_FIELD_SHOWCASE_AFFIX_CODE,
  FORM_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE,
  FORM_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  FORM_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE,
  FORM_FIELD_SHOWCASE_AUTO_INVALID_CODE,
  FORM_FIELD_SHOWCASE_BASIC_CODE,
  FORM_FIELD_SHOWCASE_BREADCRUMBS,
  FORM_FIELD_SHOWCASE_COUNTER_CODE,
  FORM_FIELD_SHOWCASE_ERROR_INPUT_CODE,
  FORM_FIELD_SHOWCASE_ERROR_PROJECTED_CODE,
  FORM_FIELD_SHOWCASE_HINT_INPUT_CODE,
  FORM_FIELD_SHOWCASE_HINT_PROJECTED_CODE,
  FORM_FIELD_SHOWCASE_IMPORT_CODE,
  FORM_FIELD_SHOWCASE_INSTALL_COMMANDS,
  FORM_FIELD_SHOWCASE_LABEL_INPUT_CODE,
  FORM_FIELD_SHOWCASE_LABEL_PROJECTED_CODE,
  FORM_FIELD_SHOWCASE_MANUAL_INVALID_CODE,
  FORM_FIELD_SHOWCASE_NEXT,
  FORM_FIELD_SHOWCASE_OPTIONAL_CODE,
  FORM_FIELD_SHOWCASE_PREFIX_ICON_CODE,
  FORM_FIELD_SHOWCASE_PREFIX_INPUT_CODE,
  FORM_FIELD_SHOWCASE_PREV,
  FORM_FIELD_SHOWCASE_RADIUS_LG_CODE,
  FORM_FIELD_SHOWCASE_RADIUS_MD_CODE,
  FORM_FIELD_SHOWCASE_RADIUS_NONE_CODE,
  FORM_FIELD_SHOWCASE_RADIUS_SM_CODE,
  FORM_FIELD_SHOWCASE_SLUG,
  FORM_FIELD_SHOWCASE_STATES_CODE,
  FORM_FIELD_SHOWCASE_TOC_ITEMS,
  FORM_FIELD_TRANSLATION_PREFIX,
} from '../model/form-field-showcase.data';

import { BasicFormFieldExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormErrorComponent,
    SolarisFormFieldComponent,
    SolarisFormHintComponent,
    SolarisFormLabelComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisInputDirective,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicFormFieldExample,
  ],
  templateUrl: './form-field-showcase.html',
  styleUrls: ['./form-field-showcase.scss'],
})
export class FormFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = FORM_FIELD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = FORM_FIELD_SHOWCASE_PREV;
  protected readonly next = FORM_FIELD_SHOWCASE_NEXT;
  protected readonly tocItems = FORM_FIELD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = FORM_FIELD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = FORM_FIELD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = FORM_FIELD_SHOWCASE_BASIC_CODE;
  protected readonly labelInputCode = FORM_FIELD_SHOWCASE_LABEL_INPUT_CODE;
  protected readonly labelProjectedCode =
    FORM_FIELD_SHOWCASE_LABEL_PROJECTED_CODE;
  protected readonly hintInputCode = FORM_FIELD_SHOWCASE_HINT_INPUT_CODE;
  protected readonly hintProjectedCode =
    FORM_FIELD_SHOWCASE_HINT_PROJECTED_CODE;
  protected readonly errorInputCode = FORM_FIELD_SHOWCASE_ERROR_INPUT_CODE;
  protected readonly errorProjectedCode =
    FORM_FIELD_SHOWCASE_ERROR_PROJECTED_CODE;
  protected readonly autoInvalidCode = FORM_FIELD_SHOWCASE_AUTO_INVALID_CODE;
  protected readonly manualInvalidCode =
    FORM_FIELD_SHOWCASE_MANUAL_INVALID_CODE;
  protected readonly optionalCode = FORM_FIELD_SHOWCASE_OPTIONAL_CODE;
  protected readonly affixCode = FORM_FIELD_SHOWCASE_AFFIX_CODE;
  protected readonly prefixIconCode = FORM_FIELD_SHOWCASE_PREFIX_ICON_CODE;
  protected readonly prefixInputCode = FORM_FIELD_SHOWCASE_PREFIX_INPUT_CODE;
  protected readonly appearanceOutlineCode =
    FORM_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    FORM_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    FORM_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = FORM_FIELD_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = FORM_FIELD_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = FORM_FIELD_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = FORM_FIELD_SHOWCASE_RADIUS_LG_CODE;
  protected readonly statesCode = FORM_FIELD_SHOWCASE_STATES_CODE;
  protected readonly counterCode = FORM_FIELD_SHOWCASE_COUNTER_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: FORM_FIELD_TRANSLATION_PREFIX,
      slug: FORM_FIELD_SHOWCASE_SLUG,
      importCode: FORM_FIELD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedSize = signal<SolarisFormFieldSize>('md');
  protected readonly selectedDensity =
    signal<SolarisFormFieldDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-form-field label="Name" size="${this.selectedSize()}" density="${this.selectedDensity()}">`,
      '  <input solaris-input />',
      '</solaris-form-field>',
    ].join('\n'),
  );

  protected readonly emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

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
