import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisPhoneFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  solarisPhoneValidator,
  type SolarisPhoneFieldDensity,
  type SolarisPhoneFieldSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  PHONE_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE,
  PHONE_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  PHONE_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE,
  PHONE_FIELD_SHOWCASE_BASIC_CODE,
  PHONE_FIELD_SHOWCASE_BREADCRUMBS,
  PHONE_FIELD_SHOWCASE_COUNTRIES_CODE,
  PHONE_FIELD_SHOWCASE_IMPORT_CODE,
  PHONE_FIELD_SHOWCASE_INSTALL_COMMANDS,
  PHONE_FIELD_SHOWCASE_NEXT,
  PHONE_FIELD_SHOWCASE_PREV,
  PHONE_FIELD_SHOWCASE_RADIUS_LG_CODE,
  PHONE_FIELD_SHOWCASE_RADIUS_MD_CODE,
  PHONE_FIELD_SHOWCASE_RADIUS_NONE_CODE,
  PHONE_FIELD_SHOWCASE_RADIUS_SM_CODE,
  PHONE_FIELD_SHOWCASE_REACTIVE_CODE,
  PHONE_FIELD_SHOWCASE_SEARCHABLE_CODE,
  PHONE_FIELD_SHOWCASE_SLUG,
  PHONE_FIELD_SHOWCASE_STATES_CODE,
  PHONE_FIELD_SHOWCASE_SUFFIX_ACTION_CODE,
  PHONE_FIELD_SHOWCASE_SUFFIX_CODE,
  PHONE_FIELD_SHOWCASE_TOC_ITEMS,
  PHONE_FIELD_TRANSLATION_PREFIX,
} from '../model/phone-field-showcase.data';

import { BasicPhoneFieldExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisPhoneFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicPhoneFieldExample,
  ],
  templateUrl: './phone-field-showcase.html',
  styleUrls: ['./phone-field-showcase.scss'],
})
export class PhoneFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = PHONE_FIELD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PHONE_FIELD_SHOWCASE_PREV;
  protected readonly next = PHONE_FIELD_SHOWCASE_NEXT;
  protected readonly tocItems = PHONE_FIELD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = PHONE_FIELD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = PHONE_FIELD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = PHONE_FIELD_SHOWCASE_BASIC_CODE;
  protected readonly appearanceOutlineCode =
    PHONE_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    PHONE_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    PHONE_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = PHONE_FIELD_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = PHONE_FIELD_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = PHONE_FIELD_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = PHONE_FIELD_SHOWCASE_RADIUS_LG_CODE;
  protected readonly statesCode = PHONE_FIELD_SHOWCASE_STATES_CODE;
  protected readonly suffixCode = PHONE_FIELD_SHOWCASE_SUFFIX_CODE;
  protected readonly suffixActionCode = PHONE_FIELD_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly countriesCode = PHONE_FIELD_SHOWCASE_COUNTRIES_CODE;
  protected readonly searchableCode = PHONE_FIELD_SHOWCASE_SEARCHABLE_CODE;
  protected readonly reactiveCode = PHONE_FIELD_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: PHONE_FIELD_TRANSLATION_PREFIX,
      slug: PHONE_FIELD_SHOWCASE_SLUG,
      importCode: PHONE_FIELD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedSize = signal<SolarisPhoneFieldSize>('md');
  protected readonly selectedDensity =
    signal<SolarisPhoneFieldDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-phone-field label="Phone" size="${this.selectedSize()}" density="${this.selectedDensity()}" defaultCountry="BR" />`,
    ].join('\n'),
  );

  protected readonly phoneControl = new FormControl('', [
    Validators.required,
    solarisPhoneValidator('BR'),
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
