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
  GRADEBOOK_SHOWCASE_BASIC_CODE,
  GRADEBOOK_SHOWCASE_BREAKDOWN_CODE,
  GRADEBOOK_SHOWCASE_BREADCRUMBS,
  GRADEBOOK_SHOWCASE_COMPOSED_CODE,
  GRADEBOOK_SHOWCASE_EDITING_CODE,
  GRADEBOOK_SHOWCASE_IMPORT_CODE,
  GRADEBOOK_SHOWCASE_INSTALL_COMMANDS,
  GRADEBOOK_SHOWCASE_LAYOUT_CODE,
  GRADEBOOK_SHOWCASE_LEGEND_CODE,
  GRADEBOOK_SHOWCASE_NEXT,
  GRADEBOOK_SHOWCASE_PREV,
  GRADEBOOK_SHOWCASE_SCALES_CODE,
  GRADEBOOK_SHOWCASE_SEMESTERS_CODE,
  GRADEBOOK_SHOWCASE_SERVER_CODE,
  GRADEBOOK_SHOWCASE_STATUSES_CODE,
  GRADEBOOK_SHOWCASE_TOTALS_CODE,
  GRADEBOOK_SHOWCASE_SLUG,
  GRADEBOOK_SHOWCASE_TOC_ITEMS,
  GRADEBOOK_TRANSLATION_PREFIX,
} from '../model/gradebook-showcase.data';

import { BasicGradebookExample } from '../examples/basic/component/basic.component';
import { BreakdownGradebookExample } from '../examples/breakdown/component/breakdown.component';
import { ComposedGradebookExample } from '../examples/composed/component/composed.component';
import { EditingGradebookExample } from '../examples/editing/component/editing.component';
import { LayoutGradebookExample } from '../examples/layout/component/layout.component';
import { LegendGradebookExample } from '../examples/legend/component/legend.component';
import { ScalesGradebookExample } from '../examples/scales/component/scales.component';
import { SemestersGradebookExample } from '../examples/semesters/component/semesters.component';
import { ServerGradebookExample } from '../examples/server/component/server.component';
import { StatusesGradebookExample } from '../examples/statuses/component/statuses.component';
import { TotalsGradebookExample } from '../examples/totals/component/totals.component';

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
    BasicGradebookExample,
    BreakdownGradebookExample,
    SemestersGradebookExample,
    ScalesGradebookExample,
    StatusesGradebookExample,
    TotalsGradebookExample,
    EditingGradebookExample,
    LayoutGradebookExample,
    ServerGradebookExample,
    ComposedGradebookExample,
    LegendGradebookExample,
  ],
  templateUrl: './gradebook-showcase.html',
  styleUrls: ['./gradebook-showcase.scss'],
})
export class GradebookShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = GRADEBOOK_SHOWCASE_BREADCRUMBS;
  protected readonly prev = GRADEBOOK_SHOWCASE_PREV;
  protected readonly next = GRADEBOOK_SHOWCASE_NEXT;
  protected readonly tocItems = GRADEBOOK_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = GRADEBOOK_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = GRADEBOOK_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = GRADEBOOK_SHOWCASE_BASIC_CODE;
  protected readonly semestersCode = GRADEBOOK_SHOWCASE_SEMESTERS_CODE;
  protected readonly scalesCode = GRADEBOOK_SHOWCASE_SCALES_CODE;
  protected readonly statusesCode = GRADEBOOK_SHOWCASE_STATUSES_CODE;
  protected readonly totalsCode = GRADEBOOK_SHOWCASE_TOTALS_CODE;
  protected readonly editingCode = GRADEBOOK_SHOWCASE_EDITING_CODE;
  protected readonly breakdownCode = GRADEBOOK_SHOWCASE_BREAKDOWN_CODE;
  protected readonly layoutCode = GRADEBOOK_SHOWCASE_LAYOUT_CODE;
  protected readonly serverCode = GRADEBOOK_SHOWCASE_SERVER_CODE;
  protected readonly composedCode = GRADEBOOK_SHOWCASE_COMPOSED_CODE;
  protected readonly legendCode = GRADEBOOK_SHOWCASE_LEGEND_CODE;

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: GRADEBOOK_TRANSLATION_PREFIX,
      slug: GRADEBOOK_SHOWCASE_SLUG,
      importCode: GRADEBOOK_SHOWCASE_IMPORT_CODE,
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
