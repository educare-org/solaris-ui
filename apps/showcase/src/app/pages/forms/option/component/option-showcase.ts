import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisOptionComponent,
  SolarisOptionGroupComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisOptionDensity,
  type SolarisOptionSelectionMode,
  type SolarisOptionSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  OPTION_SHOWCASE_BASIC_CODE,
  OPTION_SHOWCASE_BREADCRUMBS,
  OPTION_SHOWCASE_GROUP_CODE,
  OPTION_SHOWCASE_IMPORT_CODE,
  OPTION_SHOWCASE_INDICATOR_HIDDEN_CODE,
  OPTION_SHOWCASE_INDICATOR_SHOWN_CODE,
  OPTION_SHOWCASE_INSTALL_COMMANDS,
  OPTION_SHOWCASE_NEXT,
  OPTION_SHOWCASE_PREV,
  OPTION_SHOWCASE_SELECTION_MODE_CODES,
  OPTION_SHOWCASE_SLOTS_CODE,
  OPTION_SHOWCASE_SLUG,
  OPTION_SHOWCASE_STATES_CODE,
  OPTION_SHOWCASE_TOC_ITEMS,
  OPTION_TRANSLATION_PREFIX,
} from '../model/option-showcase.data';

import { BasicOptionExample } from '../examples/basic/component/basic.component';
import { SlotsOptionExample } from '../examples/slots/component/slots.component';
import { OptionGroupExample } from '../examples/option-group/component/option-group.component';

@Component({
  standalone: true,
  imports: [
    SolarisCodeBlockComponent,
    SolarisOptionComponent,
    SolarisOptionGroupComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicOptionExample,
    SlotsOptionExample,
    OptionGroupExample,
  ],
  templateUrl: './option-showcase.html',
  styleUrls: ['./option-showcase.scss'],
})
export class OptionShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = OPTION_SHOWCASE_BREADCRUMBS;
  protected readonly prev = OPTION_SHOWCASE_PREV;
  protected readonly next = OPTION_SHOWCASE_NEXT;
  protected readonly tocItems = OPTION_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = OPTION_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = OPTION_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = OPTION_SHOWCASE_BASIC_CODE;
  protected readonly selectionModeCodes = OPTION_SHOWCASE_SELECTION_MODE_CODES;
  protected readonly indicatorShownCode = OPTION_SHOWCASE_INDICATOR_SHOWN_CODE;
  protected readonly indicatorHiddenCode =
    OPTION_SHOWCASE_INDICATOR_HIDDEN_CODE;
  protected readonly slotsCode = OPTION_SHOWCASE_SLOTS_CODE;
  protected readonly statesCode = OPTION_SHOWCASE_STATES_CODE;
  protected readonly groupCode = OPTION_SHOWCASE_GROUP_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: OPTION_TRANSLATION_PREFIX,
      slug: OPTION_SHOWCASE_SLUG,
      importCode: OPTION_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedSelectionMode =
    signal<SolarisOptionSelectionMode>('single');
  protected readonly selectedIndicator = signal<'shown' | 'hidden'>('shown');
  protected readonly selectedSize = signal<SolarisOptionSize>('md');
  protected readonly selectedDensity = signal<SolarisOptionDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-option-group label="Team" size="${this.selectedSize()}" density="${this.selectedDensity()}">`,
      '  <solaris-option value="admin" label="Administrator" />',
      '  <solaris-option value="teacher" label="Teacher" />',
      '</solaris-option-group>',
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
