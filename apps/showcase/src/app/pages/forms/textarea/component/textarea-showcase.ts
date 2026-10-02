import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  SolarisCodeBlockComponent,
  SolarisFormFieldComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabPanelComponent,
  SolarisTabsComponent,
  SolarisTextareaDirective,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisTextareaDensity,
  type SolarisTextareaSize,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  TEXTAREA_SHOWCASE_APPEARANCE_FILLED_CODE,
  TEXTAREA_SHOWCASE_APPEARANCE_OUTLINE_CODE,
  TEXTAREA_SHOWCASE_APPEARANCE_SURFACE_CODE,
  TEXTAREA_SHOWCASE_BASIC_CODE,
  TEXTAREA_SHOWCASE_BREADCRUMBS,
  TEXTAREA_SHOWCASE_COUNTER_CODE,
  TEXTAREA_SHOWCASE_FORM_FIELD_CODE,
  TEXTAREA_SHOWCASE_IMPORT_CODE,
  TEXTAREA_SHOWCASE_INSTALL_COMMANDS,
  TEXTAREA_SHOWCASE_NEXT,
  TEXTAREA_SHOWCASE_PREV,
  TEXTAREA_SHOWCASE_RADIUS_LG_CODE,
  TEXTAREA_SHOWCASE_RADIUS_MD_CODE,
  TEXTAREA_SHOWCASE_RADIUS_NONE_CODE,
  TEXTAREA_SHOWCASE_RADIUS_SM_CODE,
  TEXTAREA_SHOWCASE_REACTIVE_CODE,
  TEXTAREA_SHOWCASE_RESIZE_CODES,
  TEXTAREA_SHOWCASE_ROWS_CODE,
  TEXTAREA_SHOWCASE_SLUG,
  TEXTAREA_SHOWCASE_STATES_CODE,
  TEXTAREA_SHOWCASE_TOC_ITEMS,
  TEXTAREA_TRANSLATION_PREFIX,
} from '../model/textarea-showcase.data';

import { BasicTextareaExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCodeBlockComponent,
    SolarisFormFieldComponent,
    SolarisPreviewCodeComponent,
    SolarisTabComponent,
    SolarisTabPanelComponent,
    SolarisTabsComponent,
    SolarisTextareaDirective,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicTextareaExample,
  ],
  templateUrl: './textarea-showcase.html',
  styleUrls: ['./textarea-showcase.scss'],
})
export class TextareaShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = TEXTAREA_SHOWCASE_BREADCRUMBS;
  protected readonly prev = TEXTAREA_SHOWCASE_PREV;
  protected readonly next = TEXTAREA_SHOWCASE_NEXT;
  protected readonly tocItems = TEXTAREA_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = TEXTAREA_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = TEXTAREA_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = TEXTAREA_SHOWCASE_BASIC_CODE;
  protected readonly formFieldCode = TEXTAREA_SHOWCASE_FORM_FIELD_CODE;
  protected readonly appearanceOutlineCode =
    TEXTAREA_SHOWCASE_APPEARANCE_OUTLINE_CODE;
  protected readonly appearanceSurfaceCode =
    TEXTAREA_SHOWCASE_APPEARANCE_SURFACE_CODE;
  protected readonly appearanceFilledCode =
    TEXTAREA_SHOWCASE_APPEARANCE_FILLED_CODE;
  protected readonly radiusNoneCode = TEXTAREA_SHOWCASE_RADIUS_NONE_CODE;
  protected readonly radiusSmCode = TEXTAREA_SHOWCASE_RADIUS_SM_CODE;
  protected readonly radiusMdCode = TEXTAREA_SHOWCASE_RADIUS_MD_CODE;
  protected readonly radiusLgCode = TEXTAREA_SHOWCASE_RADIUS_LG_CODE;
  protected readonly statesCode = TEXTAREA_SHOWCASE_STATES_CODE;
  protected readonly resizeCodes = TEXTAREA_SHOWCASE_RESIZE_CODES;
  protected readonly rowsCode = TEXTAREA_SHOWCASE_ROWS_CODE;
  protected readonly counterCode = TEXTAREA_SHOWCASE_COUNTER_CODE;
  protected readonly reactiveCode = TEXTAREA_SHOWCASE_REACTIVE_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: TEXTAREA_TRANSLATION_PREFIX,
      slug: TEXTAREA_SHOWCASE_SLUG,
      importCode: TEXTAREA_SHOWCASE_IMPORT_CODE,
    },
  );

  protected readonly selectedAppearance = signal<
    'outline' | 'surface' | 'filled'
  >('outline');
  protected readonly selectedRadius = signal<string>('md');
  protected readonly selectedResize = signal<string>('vertical');
  protected readonly selectedSize = signal<SolarisTextareaSize>('md');
  protected readonly selectedDensity = signal<SolarisTextareaDensity>('normal');

  protected readonly sizeDensityCode = computed(() =>
    [
      `<solaris-form-field label="Description" size="${this.selectedSize()}" density="${this.selectedDensity()}">`,
      `  <textarea solaris-textarea size="${this.selectedSize()}" density="${this.selectedDensity()}" placeholder="Observations"></textarea>`,
      '</solaris-form-field>',
    ].join('\n'),
  );

  protected readonly notesControl = new FormControl('');

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
