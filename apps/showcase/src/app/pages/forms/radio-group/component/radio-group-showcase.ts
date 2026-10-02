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
  type SolarisRadioGroupDensity,
  type SolarisRadioGroupSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  RADIO_GROUP_SHOWCASE_BASIC_CODE,
  RADIO_GROUP_SHOWCASE_BREADCRUMBS,
  RADIO_GROUP_SHOWCASE_FORM_FIELD_CODE,
  RADIO_GROUP_SHOWCASE_IMPORT_CODE,
  RADIO_GROUP_SHOWCASE_INSTALL_COMMANDS,
  RADIO_GROUP_SHOWCASE_LAYOUT_GRID_CODE,
  RADIO_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE,
  RADIO_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE,
  RADIO_GROUP_SHOWCASE_NEXT,
  RADIO_GROUP_SHOWCASE_PREV,
  RADIO_GROUP_SHOWCASE_STATES_CODE,
  RADIO_GROUP_SHOWCASE_TOC_ITEMS,
  RADIO_GROUP_SHOWCASE_VALIDATION_CODE,
  RADIO_GROUP_TRANSLATION_PREFIX,
} from '../model/radio-group-showcase.data';

import { BasicRadioGroupExample } from '../examples/basic/component/basic.component';
import { ValidationRadioGroupExample } from '../examples/validation/component/validation.component';

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
    BasicRadioGroupExample,
    ValidationRadioGroupExample,
  ],
  templateUrl: './radio-group-showcase.html',
  styleUrls: ['./radio-group-showcase.scss'],
})
export class RadioGroupShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = RADIO_GROUP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = RADIO_GROUP_SHOWCASE_PREV;
  protected readonly next = RADIO_GROUP_SHOWCASE_NEXT;
  protected readonly tocItems = RADIO_GROUP_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = RADIO_GROUP_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = RADIO_GROUP_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = RADIO_GROUP_SHOWCASE_BASIC_CODE;
  protected readonly layoutVerticalCode =
    RADIO_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE;
  protected readonly layoutHorizontalCode =
    RADIO_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE;
  protected readonly layoutGridCode = RADIO_GROUP_SHOWCASE_LAYOUT_GRID_CODE;
  protected readonly statesCode = RADIO_GROUP_SHOWCASE_STATES_CODE;
  protected readonly validationCode = RADIO_GROUP_SHOWCASE_VALIDATION_CODE;
  protected readonly formFieldCode = RADIO_GROUP_SHOWCASE_FORM_FIELD_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: RADIO_GROUP_TRANSLATION_PREFIX,
      slug: 'radio-group',
      importCode: RADIO_GROUP_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedLayout = signal<
    'vertical' | 'horizontal' | 'grid'
  >('vertical');
  protected readonly selectedSize = signal<SolarisRadioGroupSize>('md');
  protected readonly selectedDensity =
    signal<SolarisRadioGroupDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-radio-group size="${this.selectedSize()}" density="${this.selectedDensity()}" label="Plan">`,
      '  <!-- children inherit size/density from the group -->',
      '  <solaris-radio value="basic">Basic</solaris-radio>',
      '  <solaris-radio value="pro">Pro</solaris-radio>',
      '</solaris-radio-group>',
    ].join('\n'),
  );

  protected readonly formFieldControl = new FormControl('pro');

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
