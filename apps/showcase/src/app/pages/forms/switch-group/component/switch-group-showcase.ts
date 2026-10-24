import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisSwitchComponent,
  SolarisSwitchGroupComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSwitchDensity,
  type SolarisSwitchSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SWITCH_GROUP_SHOWCASE_BASIC_CODE,
  SWITCH_GROUP_SHOWCASE_BREADCRUMBS,
  SWITCH_GROUP_SHOWCASE_FORM_FIELD_CODE,
  SWITCH_GROUP_SHOWCASE_IMPORT_CODE,
  SWITCH_GROUP_SHOWCASE_INSTALL_COMMANDS,
  SWITCH_GROUP_SHOWCASE_LAYOUT_GRID_CODE,
  SWITCH_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE,
  SWITCH_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE,
  SWITCH_GROUP_SHOWCASE_NEXT,
  SWITCH_GROUP_SHOWCASE_PREV,
  SWITCH_GROUP_SHOWCASE_STATES_CODE,
  SWITCH_GROUP_SHOWCASE_TOC_ITEMS,
  SWITCH_GROUP_SHOWCASE_VALIDATION_CODE,
  SWITCH_GROUP_TRANSLATION_PREFIX,
} from '../model/switch-group-showcase.data';

import { BasicSwitchGroupExample } from '../examples/basic/component/basic.component';
import { ValidationSwitchGroupExample } from '../examples/validation/component/validation.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisSwitchComponent,
    SolarisSwitchGroupComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicSwitchGroupExample,
    ValidationSwitchGroupExample,
  ],
  templateUrl: './switch-group-showcase.html',
  styleUrls: ['./switch-group-showcase.scss'],
})
export class SwitchGroupShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SWITCH_GROUP_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SWITCH_GROUP_SHOWCASE_PREV;
  protected readonly next = SWITCH_GROUP_SHOWCASE_NEXT;
  protected readonly tocItems = SWITCH_GROUP_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SWITCH_GROUP_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SWITCH_GROUP_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SWITCH_GROUP_SHOWCASE_BASIC_CODE;
  protected readonly layoutVerticalCode =
    SWITCH_GROUP_SHOWCASE_LAYOUT_VERTICAL_CODE;
  protected readonly layoutHorizontalCode =
    SWITCH_GROUP_SHOWCASE_LAYOUT_HORIZONTAL_CODE;
  protected readonly layoutGridCode = SWITCH_GROUP_SHOWCASE_LAYOUT_GRID_CODE;
  protected readonly statesCode = SWITCH_GROUP_SHOWCASE_STATES_CODE;
  protected readonly validationCode = SWITCH_GROUP_SHOWCASE_VALIDATION_CODE;
  protected readonly formFieldCode = SWITCH_GROUP_SHOWCASE_FORM_FIELD_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SWITCH_GROUP_TRANSLATION_PREFIX,
      slug: 'switch-group',
      importCode: SWITCH_GROUP_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedLayout = signal<
    'vertical' | 'horizontal' | 'grid'
  >('vertical');
  protected readonly selectedSize = signal<SolarisSwitchSize>('md');
  protected readonly selectedDensity = signal<SolarisSwitchDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-switch-group size="${this.selectedSize()}" density="${this.selectedDensity()}" label="Channels">`,
      '  <!-- children inherit size/density from the group -->',
      '  <solaris-switch value="email">Email</solaris-switch>',
      '  <solaris-switch value="sms">SMS</solaris-switch>',
      '</solaris-switch-group>',
    ].join('\n'),
  );

  protected readonly formFieldControl = new FormControl<
    Record<string, boolean>
  >({ email: false, marketing: true });

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
