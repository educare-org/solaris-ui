import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisRadioComponent,
  SolarisRadioGroupComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisRadioDensity,
  type SolarisRadioLabelPosition,
  type SolarisRadioSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  RADIO_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  RADIO_SHOWCASE_APPEARANCE_SURFACE_CODE,
  RADIO_SHOWCASE_BASIC_CODE,
  RADIO_SHOWCASE_BREADCRUMBS,
  RADIO_SHOWCASE_COLOR_CUSTOM_CODE,
  RADIO_SHOWCASE_COLOR_DANGER_CODE,
  RADIO_SHOWCASE_COLOR_INFO_CODE,
  RADIO_SHOWCASE_COLOR_NEUTRAL_CODE,
  RADIO_SHOWCASE_COLOR_PRIMARY_CODE,
  RADIO_SHOWCASE_COLOR_SUCCESS_CODE,
  RADIO_SHOWCASE_COLOR_WARNING_CODE,
  RADIO_SHOWCASE_DESCRIPTION_CODE,
  RADIO_SHOWCASE_FORM_FIELD_CODE,
  RADIO_SHOWCASE_IMPORT_CODE,
  RADIO_SHOWCASE_INSTALL_COMMANDS,
  RADIO_SHOWCASE_LABEL_END_CODE,
  RADIO_SHOWCASE_LABEL_START_CODE,
  RADIO_SHOWCASE_NEXT,
  RADIO_SHOWCASE_PREV,
  RADIO_SHOWCASE_REACTIVE_CODE,
  RADIO_SHOWCASE_SLUG,
  RADIO_SHOWCASE_STATES_CODE,
  RADIO_SHOWCASE_TOC_ITEMS,
  RADIO_TRANSLATION_PREFIX,
} from '../model/radio-showcase.data';

import { BasicRadioExample } from '../examples/basic/component/basic.component';
import { WithDescriptionRadioExample } from '../examples/with-description/component/with-description.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisRadioComponent,
    SolarisRadioGroupComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicRadioExample,
    WithDescriptionRadioExample,
  ],
  templateUrl: './radio-showcase.html',
  styleUrls: ['./radio-showcase.scss'],
})
export class RadioShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = RADIO_SHOWCASE_BREADCRUMBS;
  protected readonly prev = RADIO_SHOWCASE_PREV;
  protected readonly next = RADIO_SHOWCASE_NEXT;
  protected readonly tocItems = RADIO_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = RADIO_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = RADIO_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = RADIO_SHOWCASE_BASIC_CODE;
  protected readonly appearanceSurfaceCode =
    RADIO_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    RADIO_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly colorNeutralCode = RADIO_SHOWCASE_COLOR_NEUTRAL_CODE;
  protected readonly colorPrimaryCode = RADIO_SHOWCASE_COLOR_PRIMARY_CODE;
  protected readonly colorSuccessCode = RADIO_SHOWCASE_COLOR_SUCCESS_CODE;
  protected readonly colorWarningCode = RADIO_SHOWCASE_COLOR_WARNING_CODE;
  protected readonly colorDangerCode = RADIO_SHOWCASE_COLOR_DANGER_CODE;
  protected readonly colorInfoCode = RADIO_SHOWCASE_COLOR_INFO_CODE;
  protected readonly colorCustomCode = RADIO_SHOWCASE_COLOR_CUSTOM_CODE;
  protected readonly labelEndCode = RADIO_SHOWCASE_LABEL_END_CODE;
  protected readonly labelStartCode = RADIO_SHOWCASE_LABEL_START_CODE;
  protected readonly descriptionCode = RADIO_SHOWCASE_DESCRIPTION_CODE;
  protected readonly statesCode = RADIO_SHOWCASE_STATES_CODE;
  protected readonly formFieldCode = RADIO_SHOWCASE_FORM_FIELD_CODE;
  protected readonly reactiveCode = RADIO_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: RADIO_TRANSLATION_PREFIX,
      slug: RADIO_SHOWCASE_SLUG,
      importCode: RADIO_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<'surface' | 'outline'>(
    'outline',
  );
  protected readonly selectedColor = signal<string>('neutral');
  protected readonly selectedLabelPosition =
    signal<SolarisRadioLabelPosition>('end');
  protected readonly selectedSize = signal<SolarisRadioSize>('md');
  protected readonly selectedDensity = signal<SolarisRadioDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-radio size="${this.selectedSize()}" density="${this.selectedDensity()}" value="pro">`,
      '  Pro',
      '</solaris-radio>',
    ].join('\n'),
  );

  protected readonly planControl = new FormControl('pro');

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
