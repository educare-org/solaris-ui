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
  { anchor: 'custom-cells', labelKey: 'table.section.custom-cells' },
  { anchor: 'people', labelKey: 'table.section.people' },
  { anchor: 'row-dialog', labelKey: 'table.section.row-dialog' },
  { anchor: 'responsive', labelKey: 'table.section.responsive' },
  { anchor: 'cell-expand', labelKey: 'table.section.cell-expand' },
  { anchor: 'appearance', labelKey: 'table.section.appearance' },
  { anchor: 'wide', labelKey: 'table.section.wide' },
  { anchor: 'mobile', labelKey: 'table.section.mobile' },
  { anchor: 'layout', labelKey: 'table.section.layout' },
  { anchor: 'states', labelKey: 'table.section.states' },
  { anchor: 'server', labelKey: 'table.section.server' },
  { anchor: 'with-pagination', labelKey: 'table.section.with-pagination' },
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
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    { id: 'city', header: 'City', accessor: 'city', sortable: true },
  ];

export const TABLE_PEOPLE_CODE = [
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
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'joined',
      header: 'Joined',
      accessor: 'joined',
      type: 'date',
      sortable: true,
    },
    {
      id: 'score',
      header: 'Score',
      accessor: 'score',
      type: 'number',
      sortable: true,
      priority: 2,
      expandable: true,
      detailTemplateId: 'score-detail',
    },
    {
      id: 'city',
      header: 'City',
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

export const TABLE_CUSTOM_CELLS_CODE = [
  '<solaris-table [data]="rows" [columns]="columns" rowId="id">',
  '  <ng-template solaris-table-cell="score" let-value="value">',
  '    <strong>{{ value }}</strong>',
  '  </ng-template>',
  '</solaris-table>',
].join('\n');

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

export const TABLE_MOBILE_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [expandable]="true"',
  '  layout="card"',
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
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      sortable: true,
    },
    {
      id: 'joined',
      header: 'Joined',
      accessor: 'joined',
      type: 'date',
      sortable: true,
    },
    {
      id: 'score',
      header: 'Score',
      accessor: 'score',
      type: 'number',
      sortable: true,
      expandable: true,
      detailVariant: 'free',
      detailTemplateId: 'score-breakdown',
    },
    {
      id: 'city',
      header: 'City',
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

export const TABLE_SUBTABLE_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [expandable]="true"',
  '>',
  '  <ng-template solaris-table-detail="units-detail" let-row>',
  '    <solaris-table',
  '      [data]="row.units"',
  '      [columns]="unitColumns"',
  '      rowId="id"',
  '      appearance="plain"',
  '    />',
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
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    {
      id: 'age',
      header: 'Age',
      accessor: 'age',
      type: 'number',
      sortable: true,
      align: 'end',
      headerAlign: 'end',
    },
    {
      id: 'joined',
      header: 'Joined',
      accessor: 'joined',
      type: 'date',
      sortable: true,
    },
    {
      id: 'score',
      header: 'Score',
      accessor: 'score',
      type: 'number',
      sortable: true,
      align: 'end',
      headerAlign: 'end',
    },
    { id: 'city', header: 'City', accessor: 'city', sortable: true },
    { id: 'level', header: 'Level', accessor: 'score', type: 'number' },
    { id: 'team', header: 'Team', accessor: 'city' },
    { id: 'track', header: 'Track', accessor: 'joined', type: 'date' },
    { id: 'grade', header: 'Grade', accessor: 'age', type: 'number' },
    { id: 'office', header: 'Office', accessor: 'city' },
  ];

export const TABLE_SHOWCASE_APPEARANCES = [
  'outline',
  'surface',
  'soft',
  'plain',
] as const;

export const TABLE_LAYOUT_CODE = [
  '<solaris-table',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  rowId="id"',
  '  [fullWidth]="true"',
  '/>',
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

export const TABLE_SHOWCASE_CUSTOM_COLUMNS: readonly SolarisTableColumn<ShowcasePerson>[] =
  [
    { id: 'name', header: 'Name', accessor: 'name' },
    {
      id: 'score',
      header: 'Score',
      accessor: 'score',
      type: 'number',
      cellTemplateId: 'score',
    },
    {
      id: 'city',
      header: 'City',
      accessor: 'city',
      headerTemplateId: 'city',
    },
  ];

export { SHOWCASE_INSTALL_COMMANDS as TABLE_SHOWCASE_INSTALL_COMMANDS } from '../../../shared/showcase-page-utils';
