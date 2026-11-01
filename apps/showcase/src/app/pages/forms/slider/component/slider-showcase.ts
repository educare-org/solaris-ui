import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisSliderComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisSliderColor,
  type SolarisSliderSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  SLIDER_SHOWCASE_BASIC_CODE,
  SLIDER_SHOWCASE_BREADCRUMBS,
  SLIDER_SHOWCASE_FORM_FIELD_CODE,
  SLIDER_SHOWCASE_ICONS_CODE,
  SLIDER_SHOWCASE_IMPORT_CODE,
  SLIDER_SHOWCASE_INSTALL_COMMANDS,
  SLIDER_SHOWCASE_MIN_MAX_CODE,
  SLIDER_SHOWCASE_NEXT,
  SLIDER_SHOWCASE_PREV,
  SLIDER_SHOWCASE_REACTIVE_CODE,
  SLIDER_SHOWCASE_SLUG,
  SLIDER_SHOWCASE_STATES_CODE,
  SLIDER_SHOWCASE_THUMB_VALUE_CODE,
  SLIDER_SHOWCASE_TICKS_CODE,
  SLIDER_SHOWCASE_TOC_ITEMS,
  SLIDER_SHOWCASE_TOOLTIP_CODE,
  SLIDER_SHOWCASE_VERTICAL_CODE,
  SLIDER_TRANSLATION_PREFIX,
} from '../model/slider-showcase.data';

import { BasicSliderExample } from '../examples/basic/component/basic.component';
import { VerticalSliderExample } from '../examples/vertical/component/vertical.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisSliderComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicSliderExample,
    VerticalSliderExample,
  ],
  templateUrl: './slider-showcase.html',
  styleUrls: ['./slider-showcase.scss'],
})
export class SliderShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = SLIDER_SHOWCASE_BREADCRUMBS;
  protected readonly prev = SLIDER_SHOWCASE_PREV;
  protected readonly next = SLIDER_SHOWCASE_NEXT;
  protected readonly tocItems = SLIDER_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = SLIDER_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = SLIDER_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = SLIDER_SHOWCASE_BASIC_CODE;
  protected readonly ticksCode = SLIDER_SHOWCASE_TICKS_CODE;
  protected readonly minMaxCode = SLIDER_SHOWCASE_MIN_MAX_CODE;
  protected readonly verticalCode = SLIDER_SHOWCASE_VERTICAL_CODE;
  protected readonly iconsCode = SLIDER_SHOWCASE_ICONS_CODE;
  protected readonly tooltipCode = SLIDER_SHOWCASE_TOOLTIP_CODE;
  protected readonly thumbValueCode = SLIDER_SHOWCASE_THUMB_VALUE_CODE;
  protected readonly statesCode = SLIDER_SHOWCASE_STATES_CODE;
  protected readonly formFieldCode = SLIDER_SHOWCASE_FORM_FIELD_CODE;
  protected readonly reactiveCode = SLIDER_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: SLIDER_TRANSLATION_PREFIX,
      slug: SLIDER_SHOWCASE_SLUG,
      importCode: SLIDER_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedColor = signal<SolarisSliderColor>('neutral');
  protected readonly selectedSize = signal<SolarisSliderSize>('md');
  protected readonly selectedDisplay = signal<'tooltip' | 'thumb' | 'none'>(
    'tooltip',
  );

  protected readonly volume = signal(50);
  protected readonly balance = signal(30);

  protected readonly displayCode = computed(() =>
    [
      '<solaris-slider',
      '  label="Opacity"',
      `  valueDisplay="${this.selectedDisplay()}"`,
      '/>',
    ].join('\n'),
  );

  protected readonly colorSizeCode = computed(() =>
    [
      '<solaris-slider',
      '  label="Volume"',
      `  color="${this.selectedColor()}"`,
      `  size="${this.selectedSize()}"`,
      '/>',
    ].join('\n'),
  );

  protected readonly volumeControl = new FormControl(50);

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
