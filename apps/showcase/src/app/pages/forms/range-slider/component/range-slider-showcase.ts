import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisRangeSliderComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  RANGE_SLIDER_SHOWCASE_BREADCRUMBS,
  RANGE_SLIDER_SHOWCASE_CURRENCY_CODE,
  RANGE_SLIDER_SHOWCASE_FIVE_CODE,
  RANGE_SLIDER_SHOWCASE_FORM_FIELD_CODE,
  RANGE_SLIDER_SHOWCASE_GAP_CODE,
  RANGE_SLIDER_SHOWCASE_IMPORT_CODE,
  RANGE_SLIDER_SHOWCASE_INSTALL_COMMANDS,
  RANGE_SLIDER_SHOWCASE_MIN_MAX_CODE,
  RANGE_SLIDER_SHOWCASE_NEGATIVE_CODE,
  RANGE_SLIDER_SHOWCASE_NEXT,
  RANGE_SLIDER_SHOWCASE_PREV,
  RANGE_SLIDER_SHOWCASE_REACTIVE_CODE,
  RANGE_SLIDER_SHOWCASE_SLUG,
  RANGE_SLIDER_SHOWCASE_STATES_CODE,
  RANGE_SLIDER_SHOWCASE_THREE_CODE,
  RANGE_SLIDER_SHOWCASE_TICKS_CODE,
  RANGE_SLIDER_SHOWCASE_TOC_ITEMS,
  RANGE_SLIDER_SHOWCASE_VERTICAL_CODE,
  RANGE_SLIDER_TRANSLATION_PREFIX,
} from '../model/range-slider-showcase.data';

import { CurrencyRangeSliderExample } from '../examples/currency/component/currency.component';
import { ThreeRangeSliderExample } from '../examples/three/component/three.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisRangeSliderComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    CurrencyRangeSliderExample,
    ThreeRangeSliderExample,
  ],
  templateUrl: './range-slider-showcase.html',
  styleUrls: ['./range-slider-showcase.scss'],
})
export class RangeSliderShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = RANGE_SLIDER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = RANGE_SLIDER_SHOWCASE_PREV;
  protected readonly next = RANGE_SLIDER_SHOWCASE_NEXT;
  protected readonly tocItems = RANGE_SLIDER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = RANGE_SLIDER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = RANGE_SLIDER_SHOWCASE_IMPORT_CODE;
  protected readonly minMaxCode = RANGE_SLIDER_SHOWCASE_MIN_MAX_CODE;
  protected readonly currencyCode = RANGE_SLIDER_SHOWCASE_CURRENCY_CODE;
  protected readonly negativeCode = RANGE_SLIDER_SHOWCASE_NEGATIVE_CODE;
  protected readonly verticalCode = RANGE_SLIDER_SHOWCASE_VERTICAL_CODE;
  protected readonly ticksCode = RANGE_SLIDER_SHOWCASE_TICKS_CODE;
  protected readonly statesCode = RANGE_SLIDER_SHOWCASE_STATES_CODE;
  protected readonly formFieldCode = RANGE_SLIDER_SHOWCASE_FORM_FIELD_CODE;
  protected readonly reactiveCode = RANGE_SLIDER_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: RANGE_SLIDER_TRANSLATION_PREFIX,
      slug: RANGE_SLIDER_SHOWCASE_SLUG,
      importCode: RANGE_SLIDER_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly prices = signal([25, 75]);
  protected readonly balance = signal([20, 80]);
  protected readonly selectedThumbs = signal<'three' | 'five' | 'gap'>('three');

  protected readonly thumbsCode = computed(() => {
    switch (this.selectedThumbs()) {
      case 'five':
        return RANGE_SLIDER_SHOWCASE_FIVE_CODE;
      case 'gap':
        return RANGE_SLIDER_SHOWCASE_GAP_CODE;
      default:
        return RANGE_SLIDER_SHOWCASE_THREE_CODE;
    }
  });

  protected readonly pricesControl = new FormControl([25, 75]);

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
