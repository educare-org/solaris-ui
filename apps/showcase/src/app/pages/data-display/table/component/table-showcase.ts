import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';

import {
  SolarisCodeBlockComponent,
  SolarisPreviewCodeComponent,
  SolarisTableComponent,
  SolarisTableDetailDirective,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  SolarisTranslateService,
  createServerTableDataSource,
  type SolarisTableAppearance,
  type SolarisTableSelectionMode,
  type SolarisTableSort,
  type SolarisTableStripedMode,
} from '@solaris-ui/angular';

import { ShowcaseDocsPageFooter } from '../../../../shell/docs-page-footer/docs-page-footer';
import { ShowcaseDocsPageHeader } from '../../../../shell/docs-page-header/docs-page-header';
import { ShowcaseDocsPageLayout } from '../../../../shell/docs-page-layout/docs-page-layout';
import { ShowcaseDocsSection } from '../../../../shell/docs-section/docs-section';

import { createShowcasePageActions } from '../../../shared/showcase-page-utils';
import {
  TABLE_ADD_ROW_CODE,
  TABLE_APPEARANCE_CODE,
  TABLE_CELL_EXPAND_CODE,
  TABLE_FOOTER_CODE,
  TABLE_LAYOUT_CODE,
  TABLE_MOBILE_COMPOSED_CODE,
  TABLE_PEOPLE_CODE,
  TABLE_RESPONSIVE_CODE,
  TABLE_ROW_DIALOG_CODE,
  TABLE_SELECTION_CODE,
  TABLE_WITH_TABS_CODE,
  TABLE_SHOWCASE_APPEARANCES,
  TABLE_SHOWCASE_BASIC_CODE,
  TABLE_SHOWCASE_BASIC_COLUMNS,
  TABLE_SHOWCASE_BREADCRUMBS,
  TABLE_SHOWCASE_CELL_COLUMNS,
  TABLE_SHOWCASE_FOOTER_COLUMNS,
  TABLE_SHOWCASE_FULL_COLUMNS,
  TABLE_SHOWCASE_IMPORT_CODE,
  TABLE_SHOWCASE_INSTALL_COMMANDS,
  TABLE_SHOWCASE_NEXT,
  TABLE_SHOWCASE_PREV,
  TABLE_SHOWCASE_ROWS,
  TABLE_SHOWCASE_SLUG,
  TABLE_SHOWCASE_TOC_ITEMS,
  TABLE_SHOWCASE_WIDE_COLUMNS,
  TABLE_SORTING_CODE,
  TABLE_STATES_CODE,
  TABLE_SERVER_CODE,
  TABLE_STICKY_CODE,
  TABLE_TRANSLATION_PREFIX,
  TABLE_WITH_PAGINATION_CODE,
  TABLE_WITH_TOOLBAR_CODE,
} from '../model/table-showcase.data';

import { BasicTableExample } from '../examples/basic/component/basic.component';
import { MobileComposedTableExample } from '../examples/mobile-composed/component/mobile-composed.component';
import { PeopleTableExample } from '../examples/people/component/people.component';
import { RowDialogTableExample } from '../examples/row-dialog/component/row-dialog.component';
import { WithPaginationTableExample } from '../examples/with-pagination/component/with-pagination.component';
import { WithToolbarTableExample } from '../examples/with-toolbar/component/with-toolbar.component';

@Component({
  standalone: true,
  imports: [
    SolarisTableComponent,
    SolarisTableDetailDirective,
    SolarisPreviewCodeComponent,
    SolarisCodeBlockComponent,
    SolarisTabComponent,
    SolarisTabsComponent,
    SolarisTranslatePipe,
    ShowcaseDocsPageFooter,
    ShowcaseDocsPageHeader,
    ShowcaseDocsPageLayout,
    ShowcaseDocsSection,
    BasicTableExample,
    MobileComposedTableExample,
    PeopleTableExample,
    RowDialogTableExample,
    WithPaginationTableExample,
    WithToolbarTableExample,
  ],
  templateUrl: './table-showcase.html',
  styleUrls: ['./table-showcase.scss'],
})
export class TableShowcasePage {
  private readonly translateService = inject(SolarisTranslateService);
  private readonly document = inject(DOCUMENT);

  protected readonly breadcrumbs = TABLE_SHOWCASE_BREADCRUMBS;
  protected readonly prev = TABLE_SHOWCASE_PREV;
  protected readonly next = TABLE_SHOWCASE_NEXT;
  protected readonly tocItems = TABLE_SHOWCASE_TOC_ITEMS;

  protected readonly installCommands = TABLE_SHOWCASE_INSTALL_COMMANDS;
  protected readonly importCode = TABLE_SHOWCASE_IMPORT_CODE;
  protected readonly basicCode = TABLE_SHOWCASE_BASIC_CODE;
  protected readonly sortingCode = TABLE_SORTING_CODE;
  protected readonly selectionCode = TABLE_SELECTION_CODE;
  protected readonly peopleCode = TABLE_PEOPLE_CODE;
  protected readonly addRowCode = TABLE_ADD_ROW_CODE;
  protected readonly withTabsCode = TABLE_WITH_TABS_CODE;
  protected readonly rowDialogCode = TABLE_ROW_DIALOG_CODE;
  protected readonly responsiveCode = TABLE_RESPONSIVE_CODE;
  protected readonly cellExpandCode = TABLE_CELL_EXPAND_CODE;
  protected readonly appearanceCode = TABLE_APPEARANCE_CODE;
  protected readonly appearances = TABLE_SHOWCASE_APPEARANCES;
  protected readonly appearance = signal<SolarisTableAppearance>('surface');
  protected readonly stripedMode = signal<SolarisTableStripedMode>('even');
  protected readonly wideColumns = TABLE_SHOWCASE_WIDE_COLUMNS;
  protected readonly stickyCode = TABLE_STICKY_CODE;
  protected readonly stickyTab = signal<'on' | 'off'>('on');
  protected readonly footerCode = TABLE_FOOTER_CODE;
  protected readonly footerColumns = TABLE_SHOWCASE_FOOTER_COLUMNS;
  protected readonly mobileComposedCode = TABLE_MOBILE_COMPOSED_CODE;
  protected readonly datasetTab = signal<'all' | 'recent'>('all');
  protected readonly datasetRows = computed(() =>
    this.datasetTab() === 'recent'
      ? TABLE_SHOWCASE_ROWS.slice(5, 10)
      : TABLE_SHOWCASE_ROWS.slice(0, 5),
  );
  protected readonly layoutCode = TABLE_LAYOUT_CODE;
  protected readonly layoutMode = signal<'auto' | 'full'>('auto');
  protected readonly statesCode = TABLE_STATES_CODE;
  protected readonly serverCode = TABLE_SERVER_CODE;
  protected readonly withPaginationCode = TABLE_WITH_PAGINATION_CODE;
  protected readonly withToolbarCode = TABLE_WITH_TOOLBAR_CODE;
  protected readonly paginationTab = signal<
    'default' | 'description' | 'mobile'
  >('default');

  protected readonly basicRows = TABLE_SHOWCASE_ROWS.slice(0, 5);
  protected readonly basicColumns = TABLE_SHOWCASE_BASIC_COLUMNS;
  protected readonly fullColumns = TABLE_SHOWCASE_FULL_COLUMNS;
  protected readonly cellColumns = TABLE_SHOWCASE_CELL_COLUMNS;

  protected readonly addRowRows = signal(TABLE_SHOWCASE_ROWS.slice(0, 5));

  protected onAddRow(): void {
    const current = this.addRowRows();
    const next =
      TABLE_SHOWCASE_ROWS[current.length % TABLE_SHOWCASE_ROWS.length];
    if (next && !current.some((row) => row.id === next.id)) {
      this.addRowRows.set([...current, next]);
    }
  }

  protected readonly sort = signal<SolarisTableSort | null>(null);
  protected readonly selectionMode =
    signal<SolarisTableSelectionMode>('multiple');
  protected readonly selectedRowIds = signal<readonly string[]>([]);
  protected readonly stateTab = signal<'loading' | 'empty' | 'error'>(
    'loading',
  );

  private readonly pageActions = createShowcasePageActions(
    this.translateService,
    this.document,
    {
      translationPrefix: TABLE_TRANSLATION_PREFIX,
      slug: TABLE_SHOWCASE_SLUG,
      importCode: TABLE_SHOWCASE_IMPORT_CODE,
    },
  );

  private readonly serverRows = signal(TABLE_SHOWCASE_ROWS.slice(0, 8));
  private readonly serverTotal = signal<number | undefined>(32);
  private readonly serverLoading = signal(false);
  protected readonly serverSource = createServerTableDataSource(
    this.serverRows,
    this.serverTotal,
    this.serverLoading,
  );

  protected reloadServer(): void {
    this.serverLoading.set(true);
    setTimeout(() => {
      this.serverRows.set(TABLE_SHOWCASE_ROWS.slice(0, 8));
      this.serverLoading.set(false);
    }, 800);
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
