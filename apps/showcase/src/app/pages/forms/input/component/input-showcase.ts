import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
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
  type SolarisInputDensity,
  type SolarisInputSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  INPUT_SHOWCASE_AFFIX_CODE,
  INPUT_SHOWCASE_APPEARANCE_FILLED_CODE,
  INPUT_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  INPUT_SHOWCASE_APPEARANCE_SURFACE_CODE,
  INPUT_SHOWCASE_BASIC_CODE,
  INPUT_SHOWCASE_BREADCRUMBS,
  INPUT_SHOWCASE_FORM_FIELD_CODE,
  INPUT_SHOWCASE_IMPORT_CODE,
  INPUT_SHOWCASE_INSTALL_COMMANDS,
  INPUT_SHOWCASE_NEXT,
  INPUT_SHOWCASE_PASSWORD_CODE,
  INPUT_SHOWCASE_PREFIX_CODE,
  INPUT_SHOWCASE_PREV,
  INPUT_SHOWCASE_RADIUS_LG_CODE,
  INPUT_SHOWCASE_RADIUS_MD_CODE,
  INPUT_SHOWCASE_RADIUS_NONE_CODE,
  INPUT_SHOWCASE_RADIUS_SM_CODE,
  INPUT_SHOWCASE_RADIUS_XL_CODE,
  INPUT_SHOWCASE_REACTIVE_CODE,
  INPUT_SHOWCASE_SLUG,
  INPUT_SHOWCASE_STATES_CODE,
  INPUT_SHOWCASE_TOC_ITEMS,
  INPUT_SHOWCASE_TYPE_CODES,
  INPUT_TRANSLATION_PREFIX,
} from '../model/input-showcase.data';

import { BasicInputExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
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
    BasicInputExample,
  ],
  templateUrl: './input-showcase.html',
  styleUrls: ['./input-showcase.scss'],
})
export class InputShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = INPUT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = INPUT_SHOWCASE_PREV;
  protected readonly next = INPUT_SHOWCASE_NEXT;
  protected readonly tocItems = INPUT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = INPUT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = INPUT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = INPUT_SHOWCASE_BASIC_CODE;
  protected readonly formFieldCode = INPUT_SHOWCASE_FORM_FIELD_CODE;
  protected readonly appearanceOutlineCode =
    INPUT_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    INPUT_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    INPUT_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = INPUT_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = INPUT_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = INPUT_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = INPUT_SHOWCASE_RADIUS_LG_CODE;
  protected readonly radiusXlCode = INPUT_SHOWCASE_RADIUS_XL_CODE;
  protected readonly statesCode = INPUT_SHOWCASE_STATES_CODE;
  protected readonly typeCodes = INPUT_SHOWCASE_TYPE_CODES;
  protected readonly prefixCode = INPUT_SHOWCASE_PREFIX_CODE;
  protected readonly affixCode = INPUT_SHOWCASE_AFFIX_CODE;
  protected readonly passwordCode = INPUT_SHOWCASE_PASSWORD_CODE;
  protected readonly reactiveCode = INPUT_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: INPUT_TRANSLATION_PREFIX,
      slug: INPUT_SHOWCASE_SLUG,
      importCode: INPUT_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedType = signal<string>('text');
  protected readonly selectedSize = signal<SolarisInputSize>('md');
  protected readonly selectedDensity = signal<SolarisInputDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-form-field label="Name" size="${this.selectedSize()}" density="${this.selectedDensity()}">`,
      `  <input solaris-input size="${this.selectedSize()}" density="${this.selectedDensity()}" placeholder="Your name" />`,
      '</solaris-form-field>',
    ].join('\n'),
  );

  protected readonly emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  protected readonly passwordVisible = signal(false);

  protected get emailError(): string {
    if (this.emailControl.hasError('required')) {
      return this.translateService.translate('input.error.required');
    }
    if (this.emailControl.hasError('email')) {
      return this.translateService.translate('input.error.valid-email');
    }
    return '';
  }

  protected togglePassword(): void {
    this.passwordVisible.update((visible) => !visible);
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
