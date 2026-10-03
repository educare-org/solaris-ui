import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisEmailFieldComponent,
  SolarisFormPrefixDirective,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisIconComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  solarisEmailValidator,
  type SolarisEmailFieldDensity,
  type SolarisEmailFieldSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  EMAIL_FIELD_SHOWCASE_ALLOWED_DOMAINS_CODE,
  EMAIL_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE,
  EMAIL_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  EMAIL_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE,
  EMAIL_FIELD_SHOWCASE_BASIC_CODE,
  EMAIL_FIELD_SHOWCASE_BLOCKED_DOMAINS_CODE,
  EMAIL_FIELD_SHOWCASE_BREADCRUMBS,
  EMAIL_FIELD_SHOWCASE_IMPORT_CODE,
  EMAIL_FIELD_SHOWCASE_INSTALL_COMMANDS,
  EMAIL_FIELD_SHOWCASE_NEXT,
  EMAIL_FIELD_SHOWCASE_NORMALIZE_CODE,
  EMAIL_FIELD_SHOWCASE_PREFIX_CODE,
  EMAIL_FIELD_SHOWCASE_PREV,
  EMAIL_FIELD_SHOWCASE_PROJECTED_PREFIX_CODE,
  EMAIL_FIELD_SHOWCASE_RADIUS_LG_CODE,
  EMAIL_FIELD_SHOWCASE_RADIUS_MD_CODE,
  EMAIL_FIELD_SHOWCASE_RADIUS_NONE_CODE,
  EMAIL_FIELD_SHOWCASE_RADIUS_SM_CODE,
  EMAIL_FIELD_SHOWCASE_REACTIVE_CODE,
  EMAIL_FIELD_SHOWCASE_SLUG,
  EMAIL_FIELD_SHOWCASE_STATES_CODE,
  EMAIL_FIELD_SHOWCASE_SUFFIX_ACTION_CODE,
  EMAIL_FIELD_SHOWCASE_TOC_ITEMS,
  EMAIL_FIELD_TRANSLATION_PREFIX,
} from '../model/email-field-showcase.data';

import { BasicEmailFieldExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisEmailFieldComponent,
    SolarisFormPrefixDirective,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisIconComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicEmailFieldExample,
  ],
  templateUrl: './email-field-showcase.html',
  styleUrls: ['./email-field-showcase.scss'],
})
export class EmailFieldShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = EMAIL_FIELD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = EMAIL_FIELD_SHOWCASE_PREV;
  protected readonly next = EMAIL_FIELD_SHOWCASE_NEXT;
  protected readonly tocItems = EMAIL_FIELD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = EMAIL_FIELD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = EMAIL_FIELD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = EMAIL_FIELD_SHOWCASE_BASIC_CODE;
  protected readonly appearanceOutlineCode =
    EMAIL_FIELD_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    EMAIL_FIELD_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    EMAIL_FIELD_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = EMAIL_FIELD_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = EMAIL_FIELD_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = EMAIL_FIELD_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = EMAIL_FIELD_SHOWCASE_RADIUS_LG_CODE;
  protected readonly statesCode = EMAIL_FIELD_SHOWCASE_STATES_CODE;
  protected readonly prefixCode = EMAIL_FIELD_SHOWCASE_PREFIX_CODE;
  protected readonly projectedPrefixCode =
    EMAIL_FIELD_SHOWCASE_PROJECTED_PREFIX_CODE;
  protected readonly suffixActionCode = EMAIL_FIELD_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly allowedDomainsCode =
    EMAIL_FIELD_SHOWCASE_ALLOWED_DOMAINS_CODE;
  protected readonly blockedDomainsCode =
    EMAIL_FIELD_SHOWCASE_BLOCKED_DOMAINS_CODE;
  protected readonly normalizeCode = EMAIL_FIELD_SHOWCASE_NORMALIZE_CODE;
  protected readonly reactiveCode = EMAIL_FIELD_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: EMAIL_FIELD_TRANSLATION_PREFIX,
      slug: EMAIL_FIELD_SHOWCASE_SLUG,
      importCode: EMAIL_FIELD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedSize = signal<SolarisEmailFieldSize>('md');
  protected readonly selectedDensity =
    signal<SolarisEmailFieldDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-email-field label="E-mail" size="${this.selectedSize()}" density="${this.selectedDensity()}" placeholder="name@company.com" />`,
    ].join('\n'),
  );

  protected readonly emailControl = new FormControl('', [
    Validators.required,
    solarisEmailValidator(),
  ]);

  protected get emailError(): string {
    if (this.emailControl.hasError('required')) {
      return this.translateService.translate('email-field.error.required');
    }
    if (this.emailControl.invalid) {
      return this.translateService.translate('email-field.error.invalid-email');
    }
    return '';
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
