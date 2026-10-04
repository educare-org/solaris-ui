import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisFormSuffixActionDirective,
  SolarisFormSuffixDirective,
  SolarisOtpInputComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisOtpInputAppearance,
  type SolarisOtpInputCharType,
  type SolarisOtpInputDensity,
  type SolarisOtpInputSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  OTP_INPUT_SHOWCASE_BASIC_CODE,
  OTP_INPUT_SHOWCASE_BREADCRUMBS,
  OTP_INPUT_SHOWCASE_IMPORT_CODE,
  OTP_INPUT_SHOWCASE_INSTALL_COMMANDS,
  OTP_INPUT_SHOWCASE_MASKED_CODE,
  OTP_INPUT_SHOWCASE_NEXT,
  OTP_INPUT_SHOWCASE_PREV,
  OTP_INPUT_SHOWCASE_REACTIVE_CODE,
  OTP_INPUT_SHOWCASE_SEPARATOR_CODE,
  OTP_INPUT_SHOWCASE_SLUG,
  OTP_INPUT_SHOWCASE_STATES_CODE,
  OTP_INPUT_SHOWCASE_SUFFIX_ACTION_CODE,
  OTP_INPUT_SHOWCASE_TOC_ITEMS,
  OTP_INPUT_TRANSLATION_PREFIX,
} from '../model/otp-input-showcase.data';

import { BasicOtpInputExample } from '../examples/basic/component/basic.component';
import { MaskedOtpInputExample } from '../examples/masked/component/masked.component';
import { SeparatorOtpInputExample } from '../examples/separator/component/separator.component';
import { ReactiveOtpInputExample } from '../examples/reactive/component/reactive.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisFormSuffixActionDirective,
    SolarisFormSuffixDirective,
    SolarisOtpInputComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicOtpInputExample,
    MaskedOtpInputExample,
    SeparatorOtpInputExample,
    ReactiveOtpInputExample,
  ],
  templateUrl: './otp-input-showcase.html',
  styleUrls: ['./otp-input-showcase.scss'],
})
export class OtpInputShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = OTP_INPUT_SHOWCASE_BREADCRUMBS;
  protected readonly prev = OTP_INPUT_SHOWCASE_PREV;
  protected readonly next = OTP_INPUT_SHOWCASE_NEXT;
  protected readonly tocItems = OTP_INPUT_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = OTP_INPUT_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = OTP_INPUT_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = OTP_INPUT_SHOWCASE_BASIC_CODE;
  protected readonly statesCode = OTP_INPUT_SHOWCASE_STATES_CODE;
  protected readonly maskedCode = OTP_INPUT_SHOWCASE_MASKED_CODE;
  protected readonly separatorCode = OTP_INPUT_SHOWCASE_SEPARATOR_CODE;
  protected readonly suffixActionCode = OTP_INPUT_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly reactiveCode = OTP_INPUT_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: OTP_INPUT_TRANSLATION_PREFIX,
      slug: OTP_INPUT_SHOWCASE_SLUG,
      importCode: OTP_INPUT_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedSize = signal<SolarisOtpInputSize>('md');
  protected readonly selectedDensity = signal<SolarisOtpInputDensity>('normal');
  protected readonly selectedAppearance =
    signal<SolarisOtpInputAppearance>('outline');
  protected readonly selectedLength = signal<string>('6');
  protected readonly selectedCharType =
    signal<SolarisOtpInputCharType>('numeric');

  protected readonly lengthValue = computed(() =>
    Number.parseInt(this.selectedLength(), 10),
  );

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-otp-input label="Verification code" [maxLength]="6" size="${this.selectedSize()}" density="${this.selectedDensity()}" />`,
    ].join('\n'),
  );

  protected readonly appearanceCode = computed(() =>
    [
      `<solaris-otp-input label="Verification code" [maxLength]="6" appearance="${this.selectedAppearance()}" />`,
    ].join('\n'),
  );

  protected readonly lengthCode = computed(() =>
    [
      `<solaris-otp-input label="Verification code" [maxLength]="${this.lengthValue()}" />`,
    ].join('\n'),
  );

  protected readonly charTypeCode = computed(() =>
    [
      `<solaris-otp-input label="Verification code" [maxLength]="6" charType="${this.selectedCharType()}" />`,
    ].join('\n'),
  );

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
