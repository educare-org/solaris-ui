import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPaginationComponent,
  SolarisPreviewCodeComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  type SolarisPageChange,
  type SolarisPaginationDensity,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  PAGINATION_PAGE_SIZE_CODE,
  PAGINATION_SHOWCASE_BASIC_CODE,
  PAGINATION_SHOWCASE_BREADCRUMBS,
  PAGINATION_SHOWCASE_IMPORT_CODE,
  PAGINATION_SHOWCASE_INSTALL_COMMANDS,
  PAGINATION_SHOWCASE_NEXT,
  PAGINATION_SHOWCASE_PREV,
  PAGINATION_SHOWCASE_SLUG,
  PAGINATION_SHOWCASE_TOC_ITEMS,
  PAGINATION_TRANSLATION_PREFIX,
  PAGINATION_SHOWCASE_UNKNOWN_TOTAL_CODE,
} from '../model/pagination-showcase.data';

import { BasicPaginationExample } from '../examples/basic/component/basic.component';
import { UnknownTotalPaginationExample } from '../examples/unknown-total/component/unknown-total.component';

@Component({
  standalone: true,
  imports: [
    SolarisPaginationComponent,
    SolarisPreviewCodeComponent,
    SolarisCodeBlockComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicPaginationExample,
    UnknownTotalPaginationExample,
  ],
  templateUrl: './pagination-showcase.html',
  styleUrls: ['./pagination-showcase.scss'],
})
export class PaginationShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = PAGINATION_SHOWCASE_BREADCRUMBS;
  protected readonly prev = PAGINATION_SHOWCASE_PREV;
  protected readonly next = PAGINATION_SHOWCASE_NEXT;
  protected readonly tocItems = PAGINATION_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = PAGINATION_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = PAGINATION_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = PAGINATION_SHOWCASE_BASIC_CODE;
  protected readonly pageSizeCode = PAGINATION_PAGE_SIZE_CODE;
  protected readonly unknownTotalCode = PAGINATION_SHOWCASE_UNKNOWN_TOTAL_CODE;

  protected readonly pageSizeIndex = signal(0);
  protected readonly pageSizeValue = signal(10);
  protected readonly selectedDensity =
    signal<SolarisPaginationDensity>('normal');

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: PAGINATION_TRANSLATION_PREFIX,
      slug: PAGINATION_SHOWCASE_SLUG,
      importCode: PAGINATION_SHOWCASE_IMPORT_CODE,
    },
  );

  protected onPageSizeChange(event: SolarisPageChange): void {
    this.pageSizeIndex.set(event.pageIndex);
    this.pageSizeValue.set(event.pageSize);
  }

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
