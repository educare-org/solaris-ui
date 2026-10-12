import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../../shared/showcase-page-utils';
import {
  RECORD_GRID_SHOWCASE_BASIC_CODE,
  RECORD_GRID_SHOWCASE_BREADCRUMBS,
  RECORD_GRID_SHOWCASE_EDITING_CODE,
  RECORD_GRID_SHOWCASE_FORMULAS_CODE,
  RECORD_GRID_SHOWCASE_IMPORT_CODE,
  RECORD_GRID_SHOWCASE_INSTALL_COMMANDS,
  RECORD_GRID_SHOWCASE_LAYOUT_CODE,
  RECORD_GRID_SHOWCASE_MERGING_CODE,
  RECORD_GRID_SHOWCASE_NEXT,
  RECORD_GRID_SHOWCASE_PREV,
  RECORD_GRID_SHOWCASE_SECTIONS_CODE,
  RECORD_GRID_SHOWCASE_SLUG,
  RECORD_GRID_SHOWCASE_TOC_ITEMS,
  RECORD_GRID_TRANSLATION_PREFIX,
} from '../model/record-grid-showcase.data';

import { BasicRecordGridExample } from '../examples/basic/component/basic.component';
import { EditingRecordGridExample } from '../examples/editing/component/editing.component';
import { FormulasRecordGridExample } from '../examples/formulas/component/formulas.component';
import { LayoutRecordGridExample } from '../examples/layout/component/layout.component';
import { MergingRecordGridExample } from '../examples/merging/component/merging.component';
import { SectionsRecordGridExample } from '../examples/sections/component/sections.component';

@Component({
  standalone: true,
  imports: [
    SolarisPreviewCodeComponent,
    SolarisCodeBlockComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicRecordGridExample,
    SectionsRecordGridExample,
    MergingRecordGridExample,
    FormulasRecordGridExample,
    EditingRecordGridExample,
    LayoutRecordGridExample,
  ],
  templateUrl: './record-grid-showcase.html',
  styleUrls: ['./record-grid-showcase.scss'],
})
export class RecordGridShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = RECORD_GRID_SHOWCASE_BREADCRUMBS;
  protected readonly prev = RECORD_GRID_SHOWCASE_PREV;
  protected readonly next = RECORD_GRID_SHOWCASE_NEXT;
  protected readonly tocItems = RECORD_GRID_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = RECORD_GRID_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = RECORD_GRID_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = RECORD_GRID_SHOWCASE_BASIC_CODE;
  protected readonly sectionsCode = RECORD_GRID_SHOWCASE_SECTIONS_CODE;
  protected readonly mergingCode = RECORD_GRID_SHOWCASE_MERGING_CODE;
  protected readonly formulasCode = RECORD_GRID_SHOWCASE_FORMULAS_CODE;
  protected readonly editingCode = RECORD_GRID_SHOWCASE_EDITING_CODE;
  protected readonly layoutCode = RECORD_GRID_SHOWCASE_LAYOUT_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: RECORD_GRID_TRANSLATION_PREFIX,
      slug: RECORD_GRID_SHOWCASE_SLUG,
      importCode: RECORD_GRID_SHOWCASE_IMPORT_CODE,
    },
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
