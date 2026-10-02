import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisRadioGroupComponent,
  SolarisSelectionCardComponent,
  SolarisSelectionCardFooterDirective,
  SolarisSelectionCardHeaderDirective,
  SolarisSelectionCardMediaDirective,
  SolarisSelectionCardTitleDirective,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSelectionCardDensity,
  type SolarisSelectionCardMediaPosition,
  type SolarisSelectionCardSelection,
  type SolarisSelectionCardSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SELECTION_CARD_SHOWCASE_APPEARANCE_GLASS_CODE,
  SELECTION_CARD_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  SELECTION_CARD_SHOWCASE_APPEARANCE_SURFACE_CODE,
  SELECTION_CARD_SHOWCASE_APPEARANCE_TONAL_CODE,
  SELECTION_CARD_SHOWCASE_BASIC_CODE,
  SELECTION_CARD_SHOWCASE_BREADCRUMBS,
  SELECTION_CARD_SHOWCASE_CARDS_GRID_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_CUSTOM_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_DANGER_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_INFO_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_NEUTRAL_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_PRIMARY_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_SUCCESS_CODE,
  SELECTION_CARD_SHOWCASE_COLOR_WARNING_CODE,
  SELECTION_CARD_SHOWCASE_FORM_FIELD_CODE,
  SELECTION_CARD_SHOWCASE_IMPORT_CODE,
  SELECTION_CARD_SHOWCASE_INSTALL_COMMANDS,
  SELECTION_CARD_SHOWCASE_MEDIA_START_CODE,
  SELECTION_CARD_SHOWCASE_MEDIA_TOP_CODE,
  SELECTION_CARD_SHOWCASE_NEXT,
  SELECTION_CARD_SHOWCASE_PREV,
  SELECTION_CARD_SHOWCASE_SELECTION_RADIO_CODE,
  SELECTION_CARD_SHOWCASE_SELECTION_SWITCH_CODE,
  SELECTION_CARD_SHOWCASE_SLUG,
  SELECTION_CARD_SHOWCASE_STATES_CODE,
  SELECTION_CARD_SHOWCASE_TOC_ITEMS,
  SELECTION_CARD_TRANSLATION_PREFIX,
} from '../model/selection-card-showcase.data';

import { BasicSelectionCardExample } from '../examples/basic/component/basic.component';
import { CardsGridSelectionCardExample } from '../examples/cards-grid/component/cards-grid.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisRadioGroupComponent,
    SolarisSelectionCardComponent,
    SolarisSelectionCardFooterDirective,
    SolarisSelectionCardHeaderDirective,
    SolarisSelectionCardMediaDirective,
    SolarisSelectionCardTitleDirective,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicSelectionCardExample,
    CardsGridSelectionCardExample,
  ],
  templateUrl: './selection-card-showcase.html',
  styleUrls: ['./selection-card-showcase.scss'],
})
export class SelectionCardShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SELECTION_CARD_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SELECTION_CARD_SHOWCASE_PREV;
  protected readonly next = SELECTION_CARD_SHOWCASE_NEXT;
  protected readonly tocItems = SELECTION_CARD_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SELECTION_CARD_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SELECTION_CARD_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SELECTION_CARD_SHOWCASE_BASIC_CODE;
  protected readonly cardsGridCode = SELECTION_CARD_SHOWCASE_CARDS_GRID_CODE;
  protected readonly appearanceSurfaceCode =
    SELECTION_CARD_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceOutlineCode =
    SELECTION_CARD_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceTonalCode =
    SELECTION_CARD_SHOWCASE_APPEARANCE_TONAL_CODE;
  protected readonly appearanceGlassCode =
    SELECTION_CARD_SHOWCASE_APPEARANCE_GLASS_CODE;
  protected readonly colorNeutralCode =
    SELECTION_CARD_SHOWCASE_COLOR_NEUTRAL_CODE;
  protected readonly colorPrimaryCode =
    SELECTION_CARD_SHOWCASE_COLOR_PRIMARY_CODE;
  protected readonly colorSuccessCode =
    SELECTION_CARD_SHOWCASE_COLOR_SUCCESS_CODE;
  protected readonly colorWarningCode =
    SELECTION_CARD_SHOWCASE_COLOR_WARNING_CODE;
  protected readonly colorDangerCode =
    SELECTION_CARD_SHOWCASE_COLOR_DANGER_CODE;
  protected readonly colorInfoCode = SELECTION_CARD_SHOWCASE_COLOR_INFO_CODE;
  protected readonly colorCustomCode =
    SELECTION_CARD_SHOWCASE_COLOR_CUSTOM_CODE;
  protected readonly selectionRadioCode =
    SELECTION_CARD_SHOWCASE_SELECTION_RADIO_CODE;
  protected readonly selectionSwitchCode =
    SELECTION_CARD_SHOWCASE_SELECTION_SWITCH_CODE;
  protected readonly mediaTopCode = SELECTION_CARD_SHOWCASE_MEDIA_TOP_CODE;
  protected readonly mediaStartCode = SELECTION_CARD_SHOWCASE_MEDIA_START_CODE;
  protected readonly statesCode = SELECTION_CARD_SHOWCASE_STATES_CODE;
  protected readonly formFieldCode = SELECTION_CARD_SHOWCASE_FORM_FIELD_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SELECTION_CARD_TRANSLATION_PREFIX,
      slug: SELECTION_CARD_SHOWCASE_SLUG,
      importCode: SELECTION_CARD_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<string>('surface');
  protected readonly selectedColor = signal<string>('neutral');
  protected readonly selectedSelection =
    signal<SolarisSelectionCardSelection>('radio');
  protected readonly selectedMediaPosition =
    signal<SolarisSelectionCardMediaPosition>('top');
  protected readonly selectedSize = signal<SolarisSelectionCardSize>('md');
  protected readonly selectedDensity =
    signal<SolarisSelectionCardDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-selection-card size="${this.selectedSize()}" density="${this.selectedDensity()}" value="pro" color="primary">`,
      '  <h3>Pro</h3>',
      '  <p>For growing teams.</p>',
      '</solaris-selection-card>',
    ].join('\n'),
  );

  protected readonly planControl = new FormControl('pro');
  protected readonly autoRenewControl = new FormControl(true);

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
