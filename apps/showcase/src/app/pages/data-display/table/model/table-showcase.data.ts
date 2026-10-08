import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../shell/docs-on-this-page/model/toc-item';
import type { SolarisTableColumn } from '@solaris-ui/angular';

export interface ShowcasePerson {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly city: string;
  readonly joined: string;
  readonly score: number;
}

export const TABLE_SHOWCASE_SLUG = 'table';
export const TABLE_TRANSLATION_PREFIX = 'table';

export const TABLE_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] = [
  { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
  { labelKey: 'shell.sidebar.group.data-display', route: '/configuration' },
  { labelKey: 'shell.sidebar.item.table' },
];

export const TABLE_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.preview-code',
  route: '/data-display/preview-code',
};

export const TABLE_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.alert',
  route: '/feedback/alert',
};

export const TABLE_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'table.section.examples' },
  { anchor: 'basic', labelKey: 'table.section.basic' },
  { anchor: 'sorting', labelKey: 'table.section.sorting' },
  { anchor: 'selection', labelKey: 'table.section.selection' },
  { anchor: 'composition', labelKey: 'table.section.composition' },
  { anchor: 'row-dialog', labelKey: 'table.section.row-dialog' },
  { anchor: 'responsive', labelKey: 'table.section.responsive' },
  { anchor: 'cell-expand', labelKey: 'table.section.cell-expand' },
  { anchor: 'appearance', labelKey: 'table.section.appearance' },
  { anchor: 'wide', labelKey: 'table.section.wide' },
  { anchor: 'sticky-column', labelKey: 'table.section.sticky-column' },
  { anchor: 'footer', labelKey: 'table.section.footer' },
  { anchor: 'add-row', labelKey: 'table.section.add-row' },
  { anchor: 'with-tabs', labelKey: 'table.section.with-tabs' },
  { anchor: 'mobile', labelKey: 'table.section.mobile' },
  { anchor: 'layout', labelKey: 'table.section.layout' },
  { anchor: 'states', labelKey: 'table.section.states' },
  { anchor: 'server', labelKey: 'table.section.server' },
  { anchor: 'with-pagination', labelKey: 'table.section.with-pagination' },
  { anchor: 'with-toolbar', labelKey: 'table.section.with-toolbar' },
  { anchor: 'installation', labelKey: 'table.section.installation' },
  { anchor: 'props', labelKey: 'table.section.props' },
];

const FIRST_NAMES = [
  'Ada',
  'Grace',
  'Alan',
  'Katherine',
  'Edsger',
  'Barbara',
  'Donald',
  'Frances',
  'John',
  'Margaret',
  'Tim',
  'Linus',
  'Guido',
  'Yukihiro',
  'Brendan',
  'James',
  'Bjarne',
  'Dennis',
  'Ken',
  'Rob',
  'Leslie',
  'Niklaus',
  'Tony',
  'Barbara',
  'Radia',
  'Vint',
  'Timnit',
  'Fei-Fei',
  'Andrew',
  'Yann',
  'Geoffrey',
  'Demis',
];

const CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Porto Alegre',
  'Recife',
  'Salvador',
  'Fortaleza',
];

export const TABLE_SHOWCASE_ROWS: readonly ShowcasePerson[] = FIRST_NAMES.map(
  (name, index) => ({
    id: `person-${index + 1}`,
    name: `${name} ${index + 1}`,
    age: 22 + ((index * 7) % 40),
    city: CITIES[index % CITIES.length],
    joined: `202${index % 4}-${String((index % 12) + 1).padStart(2, '0')}-15`,
    score: 500 + ((index * 137) % 500),
  }),
);

export const TABLE_SHOWCASE_BASIC_COLUMNS: readonly SolarisTableColumn<ShowcasePerson>[] =
  [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'city',
      headerKey: 'table.col.city',
      accessor: 'city',
      sortable: true,
    },
  ];

export const TABLE_PEOPLE_CODE = [
  'const columns = [',
  "  { id: 'person', headerKey: 'table.col.person', icon: 'user', cellTemplateId: 'person' },",
  "  { id: 'status', headerKey: 'table.col.status', icon: 'badge', cellTemplateId: 'status' },",
  '];',
  '',
  '<solaris-table [data]="rows" [columns]="columns" rowId="id">',
  '  <ng-template solaris-table-cell="person" let-row>',
  '    <solaris-avatar-profile [title]="row.name" [subtitle]="row.email" />',
  '  </ng-template>',
  '  <ng-template solaris-table-cell="status" let-row>',
  '    <solaris-badge size="sm" appearance="solid" [color]="statusColor[row.status]">',
  '      {{ row.status }}',
  '    </solaris-badge>',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

export const TABLE_ROW_DIALOG_CODE = [
  '<solaris-table [data]="rows" [columns]="columns" rowId="id">',
  '  <ng-template solaris-table-cell="details" let-row>',
  '    <button type="button" solaris-button appearance="ghost" (click)="openDetails(row)">',
  '      Details',
  '    </button>',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

export const TABLE_SHOWCASE_FULL_COLUMNS: readonly SolarisTableColumn<ShowcasePerson>[] =
  [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'joined',
      headerKey: 'table.col.joined',
      accessor: 'joined',
      type: 'date',
      sortable: true,
    },
    {
      id: 'score',
      headerKey: 'table.col.score',
      accessor: 'score',
      type: 'number',
      sortable: true,
      priority: 2,
      expandable: true,
      detailTemplateId: 'score-detail',
    },
    {
      id: 'city',
      headerKey: 'table.col.city',
      accessor: 'city',
      sortable: true,
      priority: 3,
      expandable: true,
      detailTemplateId: 'city-detail',
    },
  ];

export const TABLE_SHOWCASE_IMPORT_CODE =
  "import { SolarisTableComponent } from '@solaris-ui/angular';";

export const TABLE_SHOWCASE_BASIC_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '/>',
].join('\n');

export const TABLE_SORTING_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [(sort)]="sort"',
  '/>',
].join('\n');

export const TABLE_SELECTION_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  selectionMode="multiple"',
  '  [(selectedRowIds)]="selected"',
  '/>',
].join('\n');

export const TABLE_ADD_ROW_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [showAddRow]="true"',
  '  (addRowRequest)="onAddRow()"',
  '/>',
].join('\n');

export const TABLE_WITH_TABS_CODE = [
  '<solaris-tabs [(value)]="tab">',
  '  <solaris-tab value="all">All</solaris-tab>',
  '  <solaris-tab value="recent">Recent</solaris-tab>',
  '</solaris-tabs>',
  '<solaris-table [data]="rows()" [columns]="columns" rowId="id" />',
].join('\n');

export const TABLE_STICKY_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [stickyFirstColumn]="true"',
  '/>',
].join('\n');

export const TABLE_FOOTER_CODE = [
  'const columns = [',
  "  { id: 'name', header: 'Name', footerKey: 'table.footer.average' },",
  '  {',
  "    id: 'score',",
  "    header: 'Score',",
  "    type: 'number',",
  '    footerValueOf: (rows) => formatAverage(rows),',
  '  },',
  '];',
  '',
  '<solaris-table [data]="rows" [columns]="columns" rowId="id" />',
].join('\n');

export const TABLE_SHOWCASE_FOOTER_COLUMNS: readonly SolarisTableColumn<ShowcasePerson>[] =
  [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      footerKey: 'table.footer.average',
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      align: 'end',
      headerAlign: 'end',
      footerAlign: 'end',
      footerValueOf: (rows) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
          rows.reduce((sum, row) => sum + row.age, 0) / rows.length,
        ),
    },
    {
      id: 'score',
      headerKey: 'table.col.score',
      accessor: 'score',
      type: 'number',
      align: 'end',
      headerAlign: 'end',
      footerAlign: 'end',
      footerValueOf: (rows) =>
        new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
          rows.reduce((sum, row) => sum + row.score, 0) / rows.length,
        ),
    },
  ];

export const TABLE_RESPONSIVE_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [expandable]="true"',
  '/>',
].join('\n');

export const TABLE_STATES_CODE = [
  '<solaris-table',
  '  [data]="[]"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [loading]="true"',
  '/>',
  '',
  '<ng-template solaris-table-empty>No rows yet</ng-template>',
].join('\n');

export const TABLE_SERVER_CODE = [
  'const source = createServerTableDataSource(rows, total, loading);',
  '',
  '<solaris-table',
  '  [data]="source"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [(sort)]="sort"',
  '  (sortChange)="load($event)"',
  '/>',
].join('\n');

export const TABLE_MOBILE_COMPOSED_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [expandable]="true"',
  '  layout="card"',
  '>',
  '  <ng-template solaris-table-cell="person" let-row>',
  '    <solaris-avatar-profile [title]="row.name" [subtitle]="row.city" />',
  '  </ng-template>',
  '  <ng-template solaris-table-cell="status" let-row>',
  '    <solaris-badge size="sm" appearance="solid" [color]="statusColor">',
  '      {{ status }}',
  '    </solaris-badge>',
  '  </ng-template>',
  '  <ng-template solaris-table-cell="actions">',
  '    <button type="button" solaris-button appearance="ghost" size="sm">',
  '      Details',
  '    </button>',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

export const TABLE_SHOWCASE_CELL_COLUMNS: readonly SolarisTableColumn<ShowcasePerson>[] =
  [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'joined',
      headerKey: 'table.col.joined',
      accessor: 'joined',
      type: 'date',
      sortable: true,
    },
    {
      id: 'score',
      headerKey: 'table.col.score',
      accessor: 'score',
      type: 'number',
      sortable: true,
      expandable: true,
      detailVariant: 'free',
      detailTemplateId: 'score-breakdown',
    },
    {
      id: 'city',
      headerKey: 'table.col.city',
      accessor: 'city',
      sortable: true,
      expandable: true,
      detailTemplateId: 'city-detail',
    },
  ];

export const TABLE_CELL_EXPAND_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [expandable]="true"',
  '  expandMode="cell"',
  '>',
  '  <ng-template solaris-table-detail="score-breakdown" let-row>',
  '    <div class="points-detail">',
  '      <div class="points-detail__row">',
  '        <span>Pontos ganhos</span>',
  '        <strong class="points-detail__gain">+{{ row.score }}</strong>',
  '      </div>',
  '      <div class="points-detail__row">',
  '        <span>Pontos perdidos</span>',
  '        <strong class="points-detail__loss">-{{ 1000 - row.score }}</strong>',
  '      </div>',
  '      <div class="points-detail__row points-detail__row--total">',
  '        <span>Saldo total</span>',
  '        <strong>{{ row.score }}</strong>',
  '      </div>',
  '    </div>',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

export const TABLE_APPEARANCE_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  appearance="surface"',
  '  [striped]="true"',
  '  stripedMode="even"',
  '/>',
].join('\n');

export const TABLE_SHOWCASE_WIDE_COLUMNS: readonly SolarisTableColumn<ShowcasePerson>[] =
  [
    {
      id: 'name',
      headerKey: 'table.col.name',
      accessor: 'name',
      sortable: true,
    },
    {
      id: 'age',
      headerKey: 'table.col.age',
      accessor: 'age',
      type: 'number',
      sortable: true,
      align: 'end',
      headerAlign: 'end',
    },
    {
      id: 'joined',
      headerKey: 'table.col.joined',
      accessor: 'joined',
      type: 'date',
      sortable: true,
    },
    {
      id: 'score',
      headerKey: 'table.col.score',
      accessor: 'score',
      type: 'number',
      sortable: true,
      align: 'end',
      headerAlign: 'end',
    },
    {
      id: 'city',
      headerKey: 'table.col.city',
      accessor: 'city',
      sortable: true,
    },
    {
      id: 'level',
      headerKey: 'table.col.level',
      accessor: 'score',
      type: 'number',
    },
    {
      id: 'team',
      headerKey: 'table.col.team',
      accessor: 'city',
    },
    {
      id: 'track',
      headerKey: 'table.col.track',
      accessor: 'joined',
      type: 'date',
    },
    {
      id: 'grade',
      headerKey: 'table.col.grade',
      accessor: 'age',
      type: 'number',
    },
    {
      id: 'office',
      headerKey: 'table.col.office',
      accessor: 'city',
    },
  ];

export const TABLE_SHOWCASE_APPEARANCES = [
  'outline',
  'surface',
  'soft',
  'plain',
  'grid',
] as const;

export const TABLE_LAYOUT_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [fullWidth]="true"',
  '/>',
].join('\n');

export const TABLE_SHOWCASE_CITY_OPTIONS = CITIES.map((city) => ({
  value: city,
  label: city,
}));

export const TABLE_WITH_TOOLBAR_CODE = [
  '<solaris-table [data]="pageRows()" [columns]="orderedVisible()" rowId="id">',
  '  <ng-template solaris-table-toolbar>',
  '    <solaris-table-toolbar',
  '      [columns]="allColumns"',
  '      [(filter)]="filter"',
  '      [views]="views"',
  '      [(selectedViewId)]="selectedViewId"',
  '      [exporters]="exporters"',
  '      [exportRows]="filteredRows()"',
  '      exportFilename="contacts"',
  '      (viewCreate)="onCreateView($event)"',
  '    />',
  '  </ng-template>',
  '  <ng-template solaris-table-footer>',
  '    <solaris-pagination',
  '      [pageIndex]="pageIndex()"',
  '      [pageSize]="pageSize()"',
  '      [total]="filteredRows().length"',
  '      (pageChange)="onPageChange($event)"',
  '    />',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

export const TABLE_WITH_PAGINATION_CODE = [
  '<solaris-table [data]="pageRows()" [columns]="columns" rowId="id">',
  '  <ng-template solaris-table-footer>',
  '    <solaris-pagination',
  '      [pageIndex]="pageIndex()"',
  '      [pageSize]="pageSize()"',
  '      [total]="total"',
  '      (pageChange)="onPageChange($event)"',
  '    />',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as TABLE_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
