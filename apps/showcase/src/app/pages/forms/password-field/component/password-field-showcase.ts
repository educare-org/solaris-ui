import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisPasswordFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  solarisPasswordValidator,
  type SolarisPasswordFieldDensity,
  type SolarisPasswordFieldSize,
  type SolarisPasswordPolicy,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  PASSWORD_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE,
  PASSWORD_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  PASSWORD_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE,
  PASSWORD_FIELD_SHOWCASE_BASIC_CODE,
  PASSWORD_FIELD_SHOWCASE_BREADCRUMBS,
  PASSWORD_FIELD_SHOWCASE_IMPORT_CODE,
  PASSWORD_FIELD_SHOWCASE_INSTALL_COMMANDS,
  PASSWORD_FIELD_SHOWCASE_NEXT,
  PASSWORD_FIELD_SHOWCASE_NO_TOGGLE_CODE,
  PASSWORD_FIELD_SHOWCASE_PREFIX_CODE,
  PASSWORD_FIELD_SHOWCASE_PREV,
  PASSWORD_FIELD_SHOWCASE_RADIUS_LG_CODE,
  PASSWORD_FIELD_SHOWCASE_RADIUS_MD_CODE,
  PASSWORD_FIELD_SHOWCASE_RADIUS_NONE_CODE,
  PASSWORD_FIELD_SHOWCASE_RADIUS_SM_CODE,
  PASSWORD_FIELD_SHOWCASE_REACTIVE_CODE,
  PASSWORD_FIELD_SHOWCASE_REQUIREMENTS_CODE,
  PASSWORD_FIELD_SHOWCASE_SLUG,
  PASSWORD_FIELD_SHOWCASE_STATES_CODE,
  PASSWORD_FIELD_SHOWCASE_STRENGTH_CODE,
  PASSWORD_FIELD_SHOWCASE_SUFFIX_ACTION_CODE,
  PASSWORD_FIELD_SHOWCASE_TOC_ITEMS,
  PASSWORD_FIELD_SHOWCASE_TOGGLE_CODE,
  PASSWORD_FIELD_TRANSLATION_PREFIX,
} from '../model/password-field-showcase.data';

import { BasicPasswordFieldExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisPasswordFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicPasswordFieldExample,
  ],
  templateUrl: './password-field-showcase.html',
  styleUrls: ['./password-field-showcase.scss'],
})
export class PasswordFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = PASSWORD_FIELD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PASSWORD_FIELD_SHOWCASE_PREV;
  protected readonly next = PASSWORD_FIELD_SHOWCASE_NEXT;
  protected readonly tocItems = PASSWORD_FIELD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = PASSWORD_FIELD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = PASSWORD_FIELD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = PASSWORD_FIELD_SHOWCASE_BASIC_CODE;
  protected readonly appearanceOutlineCode =
    PASSWORD_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    PASSWORD_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    PASSWORD_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = PASSWORD_FIELD_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = PASSWORD_FIELD_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = PASSWORD_FIELD_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = PASSWORD_FIELD_SHOWCASE_RADIUS_LG_CODE;
  protected readonly statesCode = PASSWORD_FIELD_SHOWCASE_STATES_CODE;
  protected readonly prefixCode = PASSWORD_FIELD_SHOWCASE_PREFIX_CODE;
  protected readonly suffixActionCode =
    PASSWORD_FIELD_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly toggleCode = PASSWORD_FIELD_SHOWCASE_TOGGLE_CODE;
  protected readonly noToggleCode = PASSWORD_FIELD_SHOWCASE_NO_TOGGLE_CODE;
  protected readonly requirementsCode =
    PASSWORD_FIELD_SHOWCASE_REQUIREMENTS_CODE;
  protected readonly strengthCode = PASSWORD_FIELD_SHOWCASE_STRENGTH_CODE;
  protected readonly reactiveCode = PASSWORD_FIELD_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: PASSWORD_FIELD_TRANSLATION_PREFIX,
      slug: PASSWORD_FIELD_SHOWCASE_SLUG,
      importCode: PASSWORD_FIELD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedSize = signal<SolarisPasswordFieldSize>('md');
  protected readonly selectedDensity =
    signal<SolarisPasswordFieldDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-password-field label="Password" size="${this.selectedSize()}" density="${this.selectedDensity()}" />`,
    ].join('\n'),
  );

  protected readonly passwordPolicy: SolarisPasswordPolicy = {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumber: true,
    requireSymbol: true,
    disallowWhitespace: true,
  };

  protected readonly passwordControl = new FormControl('', [
    Validators.required,
    solarisPasswordValidator({
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireNumber: true,
      requireSymbol: true,
      disallowWhitespace: true,
    }),
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
