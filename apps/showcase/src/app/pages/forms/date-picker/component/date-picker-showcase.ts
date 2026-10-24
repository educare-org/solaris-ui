import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisDatePickerComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisDatePickerAppearance,
  type SolarisDatePickerDensity,
  type SolarisDatePickerSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  DATE_PICKER_SHOWCASE_BASIC_CODE,
  DATE_PICKER_SHOWCASE_BOUNDS_CODE,
  DATE_PICKER_SHOWCASE_BREADCRUMBS,
  DATE_PICKER_SHOWCASE_CALENDAR_OPTIONS_CODE,
  DATE_PICKER_SHOWCASE_CLEARABLE_CODE,
  DATE_PICKER_SHOWCASE_IMPORT_CODE,
  DATE_PICKER_SHOWCASE_INSTALL_COMMANDS,
  DATE_PICKER_SHOWCASE_NEXT,
  DATE_PICKER_SHOWCASE_PREV,
  DATE_PICKER_SHOWCASE_RANGE_CODE,
  DATE_PICKER_SHOWCASE_SLUG,
  DATE_PICKER_SHOWCASE_STATES_CODE,
  DATE_PICKER_SHOWCASE_SUFFIX_ACTION_CODE,
  DATE_PICKER_SHOWCASE_TOC_ITEMS,
  DATE_PICKER_TRANSLATION_PREFIX,
} from '../model/date-picker-showcase.data';

import { BasicDatePickerExample } from '../examples/basic/component/basic.component';
import { SuffixActionDatePickerExample } from '../examples/suffix-action/component/suffix-action.component';
import { BoundsDatePickerExample } from '../examples/bounds/component/bounds.component';
import { DateRangeExample } from '../examples/date-range/component/date-range.component';

const toSolarisDate = (date: Date): string =>
  [
    String(date.getFullYear()).padStart(4, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisDatePickerComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicDatePickerExample,
    SuffixActionDatePickerExample,
    BoundsDatePickerExample,
    DateRangeExample,
  ],
  templateUrl: './date-picker-showcase.html',
  styleUrls: ['./date-picker-showcase.scss'],
})
export class DatePickerShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = DATE_PICKER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = DATE_PICKER_SHOWCASE_PREV;
  protected readonly next = DATE_PICKER_SHOWCASE_NEXT;
  protected readonly tocItems = DATE_PICKER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = DATE_PICKER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = DATE_PICKER_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = DATE_PICKER_SHOWCASE_BASIC_CODE;
  protected readonly statesCode = DATE_PICKER_SHOWCASE_STATES_CODE;
  protected readonly clearableCode = DATE_PICKER_SHOWCASE_CLEARABLE_CODE;
  protected readonly calendarOptionsCode =
    DATE_PICKER_SHOWCASE_CALENDAR_OPTIONS_CODE;
  protected readonly suffixActionCode = DATE_PICKER_SHOWCASE_SUFFIX_ACTION_CODE;
  protected readonly boundsCode = DATE_PICKER_SHOWCASE_BOUNDS_CODE;
  protected readonly rangeCode = DATE_PICKER_SHOWCASE_RANGE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: DATE_PICKER_TRANSLATION_PREFIX,
      slug: DATE_PICKER_SHOWCASE_SLUG,
      importCode: DATE_PICKER_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedSize = signal<SolarisDatePickerSize>('md');
  protected readonly selectedDensity =
    signal<SolarisDatePickerDensity>('normal');
  protected readonly selectedAppearance =
    signal<SolarisDatePickerAppearance>('outline');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-date-picker label="Invoice date" size="${this.selectedSize()}" density="${this.selectedDensity()}" [formControl]="dateControl" />`,
    ].join('\n'),
  );

  protected readonly appearanceCode = computed(() =>
    [
      `<solaris-date-picker label="Invoice date" appearance="${this.selectedAppearance()}" [formControl]="dateControl" />`,
    ].join('\n'),
  );

  protected readonly sizeDensityControl = new FormControl(
    toSolarisDate(new Date()),
  );
  protected readonly clearableControl = new FormControl(
    toSolarisDate(new Date()),
  );
  protected readonly calendarOptionsControl = new FormControl(
    toSolarisDate(new Date()),
  );
  protected readonly appearanceControl = new FormControl(
    toSolarisDate(new Date()),
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
