import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisRangeSliderComponent,
  SolarisTabComponent,
  SolarisTableCellDirective,
  SolarisTableComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSliderZone,
  type SolarisTableColumn,
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
  RANGE_SLIDER_SHOWCASE_SCALE_LOG_CODE,
  RANGE_SLIDER_SHOWCASE_SCALE_ZONES_CODE,
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
import { RANGE_SLIDER_PROP_ROWS } from '../model/range-slider-showcase-props.data';
import {
  buildFormPropsColumns,
  type FormPropRow,
} from '../../model/form-props-table.data';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisRangeSliderComponent,
    SolarisTabComponent,
    SolarisTableCellDirective,
    SolarisTableComponent,
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
  protected readonly scaleLogCode = RANGE_SLIDER_SHOWCASE_SCALE_LOG_CODE;
  protected readonly scaleZonesCode = RANGE_SLIDER_SHOWCASE_SCALE_ZONES_CODE;
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
  protected readonly frequencyRange = signal([100, 5000]);
  protected readonly riskRange = signal([10, 70]);

  protected readonly riskZones: SolarisSliderZone[] = [
    { from: 0, to: 33, color: 'success' },
    { from: 33, to: 66, color: 'warning' },
    { from: 66, to: 100, color: 'danger' },
  ];
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

  protected readonly propsRows = RANGE_SLIDER_PROP_ROWS;

  protected readonly propsColumns = computed<SolarisTableColumn<FormPropRow>[]>(
    () =>
      buildFormPropsColumns({
        prop: this.translateService.translate('range-slider.props.colProp'),
        type: this.translateService.translate('range-slider.props.colType'),
        values: this.translateService.translate('range-slider.props.colValues'),
        default: this.translateService.translate(
          'range-slider.props.colDefault',
        ),
      }),
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
