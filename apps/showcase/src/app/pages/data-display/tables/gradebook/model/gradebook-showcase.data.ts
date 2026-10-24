import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';
import type {
  SolarisGradebookColumn,
  SolarisTableHeaderGroup,
} from '@solaris-ui/angular';

export interface ShowcaseSubject {
  readonly id: string;
  readonly name: string;
  readonly scores: Readonly<Record<string, number | null>>;
  readonly result: string;
}

export const GRADEBOOK_SHOWCASE_SLUG = 'gradebook';
export const GRADEBOOK_TRANSLATION_PREFIX = 'gradebook';

export const GRADEBOOK_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.tables' },
    { labelKey: 'shell.sidebar.item.gradebook' },
  ];

export const GRADEBOOK_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.table',
  route: '/data-display/tables/table',
};

export const GRADEBOOK_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.record-grid',
  route: '/data-display/tables/record-grid',
};

export const GRADEBOOK_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'gradebook.section.examples' },
  { anchor: 'basic', labelKey: 'gradebook.section.basic' },
  { anchor: 'semesters', labelKey: 'gradebook.section.semesters' },
  { anchor: 'scales', labelKey: 'gradebook.section.scales' },
  { anchor: 'statuses', labelKey: 'gradebook.section.statuses' },
  { anchor: 'totals', labelKey: 'gradebook.section.totals' },
  { anchor: 'editing', labelKey: 'gradebook.section.editing' },
  { anchor: 'breakdown', labelKey: 'gradebook.section.breakdown' },
  { anchor: 'layout', labelKey: 'gradebook.section.layout' },
  { anchor: 'server', labelKey: 'gradebook.section.server' },
  { anchor: 'composed', labelKey: 'gradebook.section.composed' },
  { anchor: 'legend', labelKey: 'gradebook.section.legend' },
  { anchor: 'installation', labelKey: 'gradebook.section.installation' },
  { anchor: 'props', labelKey: 'gradebook.section.props' },
];

export const GRADEBOOK_SHOWCASE_ROWS: readonly ShowcaseSubject[] = [
  {
    id: 'dotnet',
    name: 'Advanced Business Development with .NET',
    scores: { ftat: 10.8, gs1: 18, gs2: 17.2, mp: 85.9 },
    result: 'Aprovado',
  },
  {
    id: 'compliance',
    name: 'Compliance, Quality Assurance & Tests',
    scores: { ftat: 0, gs1: 18, gs2: 19, mp: 87.2 },
    result: 'Aprovado',
  },
  {
    id: 'devops',
    name: 'DevOps Tools & Cloud Computing',
    scores: { ftat: 19.45, gs1: null, gs2: null, mp: 88.5 },
    result: 'Aprovado',
  },
  {
    id: 'java',
    name: 'Java Advanced',
    scores: { ftat: 13.1, gs1: 18, gs2: 16.8, mp: 87.8 },
    result: 'Aprovado',
  },
  {
    id: 'mobile',
    name: 'Mobile Application Development',
    scores: { ftat: 4.4, gs1: 18, gs2: 14.5, mp: 84.4 },
    result: 'Exame',
  },
];

export const GRADEBOOK_SHOWCASE_GROUPS: readonly SolarisTableHeaderGroup[] = [
  { id: 's1', headerKey: 'gradebook.group.semester1' },
  { id: 's2', headerKey: 'gradebook.group.semester2' },
  { id: 'result', headerKey: 'gradebook.group.result' },
];

function averageOf(rows: readonly ShowcaseSubject[], id: string): string {
  const values = rows
    .map((row) => row.scores[id])
    .filter((value): value is number => value !== null);
  if (values.length === 0) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

export const GRADEBOOK_SHOWCASE_BASIC_COLUMNS: readonly SolarisGradebookColumn<ShowcaseSubject>[] =
  [
    {
      id: 'gs1',
      headerKey: 'gradebook.col.gs1',
      assignmentId: 'gs1',
      maxScore: 20,
      hintKey: 'gradebook.hint.gs1',
      accessor: (row: ShowcaseSubject) => row.scores['gs1'] ?? null,
      footerValueOf: (rows) => averageOf(rows, 'gs1'),
    },
    {
      id: 'mp',
      headerKey: 'gradebook.col.mp',
      assignmentId: 'mp',
      maxScore: 100,
      accessor: (row: ShowcaseSubject) => row.scores['mp'] ?? null,
      footerValueOf: (rows) => averageOf(rows, 'mp'),
    },
  ];

export const GRADEBOOK_SHOWCASE_FULL_COLUMNS: readonly SolarisGradebookColumn<ShowcaseSubject>[] =
  [
    {
      id: 'ftat',
      headerKey: 'gradebook.col.ftat',
      assignmentId: 'ftat',
      maxScore: 13.5,
      headerGroup: 's1',
      aggregate: 'average',
      accessor: (row: ShowcaseSubject) => row.scores['ftat'] ?? null,
      footerValueOf: (rows) => averageOf(rows, 'ftat'),
    },
    {
      id: 'gs1',
      headerKey: 'gradebook.col.gs1',
      assignmentId: 'gs1',
      maxScore: 20,
      headerGroup: 's1',
      aggregate: 'average',
      accessor: (row: ShowcaseSubject) => row.scores['gs1'] ?? null,
      footerValueOf: (rows) => averageOf(rows, 'gs1'),
    },
    {
      id: 'gs2',
      headerKey: 'gradebook.col.gs2',
      assignmentId: 'gs2',
      maxScore: 20,
      hintKey: 'gradebook.hint.gs2',
      headerGroup: 's2',
      aggregate: 'average',
      accessor: (row: ShowcaseSubject) => row.scores['gs2'] ?? null,
      footerValueOf: (rows) => averageOf(rows, 'gs2'),
    },
    {
      id: 'mp',
      headerKey: 'gradebook.col.mp',
      assignmentId: 'mp',
      maxScore: 100,
      headerGroup: 'result',
      aggregate: 'average',
      accessor: (row: ShowcaseSubject) => row.scores['mp'] ?? null,
      footerValueOf: (rows) => averageOf(rows, 'mp'),
    },
    {
      id: 'result',
      headerKey: 'gradebook.col.result',
      status: true,
      headerGroup: 'result',
      accessor: 'result',
    },
  ];

export const GRADEBOOK_SHOWCASE_IDENTITY = {
  headerKey: 'gradebook.col.subject',
  displayValueOf: (row: ShowcaseSubject) => row.name,
};

export const GRADEBOOK_SHOWCASE_IMPORT_CODE =
  "import { SolarisGradebookComponent } from '@solaris-ui/angular';";

export const GRADEBOOK_SHOWCASE_BASIC_CODE = [
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  rowId="id"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_SEMESTERS_CODE = [
  '<solaris-tabs [(value)]="stickyMode">',
  '  <solaris-tab value="both">Both</solaris-tab>',
  '  <solaris-tab value="first">First</solaris-tab>',
  '  <solaris-tab value="none">None</solaris-tab>',
  '</solaris-tabs>',
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  [headerGroups]="groups"',
  '  [identity]="identity"',
  '  [stickyFirstColumn]="stickyFirst()"',
  '  [stickyLastColumn]="stickyLast()"',
  '  rowId="id"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_STATUSES_CODE = [
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  [gradeStatusOf]="statusOf"',
  '  rowId="id"',
  '/>',
  '<solaris-gradebook-legend [items]="legend" />',
].join('\n');

export const GRADEBOOK_SHOWCASE_TOTALS_CODE = [
  '<solaris-tabs [(value)]="aggregate">',
  '  <solaris-tab value="average">Average</solaris-tab>',
  '  <solaris-tab value="sum">Sum</solaris-tab>',
  '  <solaris-tab value="max">Max</solaris-tab>',
  '</solaris-tabs>',
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns()"',
  '  [identity]="identity"',
  '  [rounding]="rounding()"',
  '  rowId="id"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_EDITING_CODE = [
  '<solaris-gradebook',
  '  [data]="rows()"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  rowId="id"',
  '  selectionMode="multiple"',
  '  [(selectedRowIds)]="selectedIds"',
  '  [bulkEnabled]="true"',
  '  [enablePaste]="true"',
  '  (gradeCommit)="onCommit($event)"',
  '  (gradeBulkCommit)="onBulkCommit($event)"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_BREAKDOWN_CODE = [
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  rowId="id"',
  '>',
  '  <ng-template solaris-table-cell="mp-breakdown" let-row let-value="value">',
  '    <button type="button" (click)="openBreakdown(row)">+</button>',
  '  </ng-template>',
  '</solaris-gradebook>',
].join('\n');

export const GRADEBOOK_SHOWCASE_SERVER_CODE = [
  '// O servidor ordena: sortChange recarrega linhas, total e loading.',
  'const source = createServerTableDataSource(rows, total, loading);',
  '',
  '<solaris-gradebook',
  '  [data]="source"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  rowId="id"',
  '  [(sort)]="sort"',
  '  (sortChange)="load($event)"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_COMPOSED_CODE = [
  '<solaris-gradebook',
  '  [data]="pageRows"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  rowId="id"',
  '>',
  '  <ng-template solaris-table-footer>',
  '    <solaris-pagination',
  '      [pageIndex]="pageIndex"',
  '      [pageSize]="pageSize"',
  '      [total]="total"',
  '      (pageChange)="onPageChange($event)"',
  '    />',
  '  </ng-template>',
  '</solaris-gradebook>',
].join('\n');

export const GRADEBOOK_SHOWCASE_SCALES_CODE = [
  '<solaris-gradebook',
  '  [data]="dataset().rows"',
  '  [columns]="dataset().columns"',
  '  [identity]="identity"',
  '  [scale]="dataset().scale"',
  '  rowId="id"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_LAYOUT_CODE = [
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  [fullWidth]="fullWidth()"',
  '  rowId="id"',
  '/>',
].join('\n');

export const GRADEBOOK_SHOWCASE_LEGEND_CODE = [
  '<solaris-gradebook-legend [items]="legend" />',
  '<solaris-gradebook',
  '  [data]="rows"',
  '  [columns]="columns"',
  '  [identity]="identity"',
  '  rowId="id"',
  '/>',
].join('\n');

export { SHOWCASE_INSTALL_COMMANDS as GRADEBOOK_SHOWCASE_INSTALL_COMMANDS } from '../../../../shared/showcase-page-utils';
