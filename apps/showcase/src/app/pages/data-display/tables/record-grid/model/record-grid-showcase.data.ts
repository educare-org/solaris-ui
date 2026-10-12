import type {
  ShowcaseDocsBreadcrumb,
  ShowcaseDocsPageNav,
} from '../../../../../shell/docs-page-header/docs-page-header';
import type { ShowcaseTocItem } from '../../../../../shell/docs-on-this-page/model/toc-item';
import type {
  SolarisRecordGridColumn,
  SolarisRecordGridSection,
} from '@solaris-ui/angular';

export interface ShowcaseAttendance {
  readonly id: string;
  readonly student: string;
  readonly shift: string;
  readonly present: number | null;
  readonly project: number | null;
  readonly note: string;
}

export const RECORD_GRID_SHOWCASE_SLUG = 'record-grid';
export const RECORD_GRID_TRANSLATION_PREFIX = 'record-grid';

export const RECORD_GRID_SHOWCASE_BREADCRUMBS: readonly ShowcaseDocsBreadcrumb[] =
  [
    { labelKey: 'shell.sidebar.section.components', route: '/configuration' },
    { labelKey: 'shell.sidebar.item.tables' },
    { labelKey: 'shell.sidebar.item.record-grid' },
  ];

export const RECORD_GRID_SHOWCASE_PREV: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.gradebook',
  route: '/data-display/tables/gradebook',
};

export const RECORD_GRID_SHOWCASE_NEXT: ShowcaseDocsPageNav = {
  labelKey: 'shell.sidebar.item.alert',
  route: '/feedback/alert',
};

export const RECORD_GRID_SHOWCASE_TOC_ITEMS: readonly ShowcaseTocItem[] = [
  { anchor: 'examples', labelKey: 'record-grid.section.examples' },
  { anchor: 'basic', labelKey: 'record-grid.section.basic' },
  { anchor: 'sections', labelKey: 'record-grid.section.sections' },
  { anchor: 'merging', labelKey: 'record-grid.section.merging' },
  { anchor: 'formulas', labelKey: 'record-grid.section.formulas' },
  { anchor: 'editing', labelKey: 'record-grid.section.editing' },
  { anchor: 'layout', labelKey: 'record-grid.section.layout' },
  { anchor: 'installation', labelKey: 'record-grid.section.installation' },
  { anchor: 'props', labelKey: 'record-grid.section.props' },
];

export const RECORD_GRID_SHOWCASE_SECTIONS: readonly SolarisRecordGridSection[] =
  [
    { id: 'morning', headerKey: 'record-grid.shift.morning' },
    { id: 'evening', headerKey: 'record-grid.shift.evening' },
  ];

export const RECORD_GRID_SHOWCASE_ROWS: readonly ShowcaseAttendance[] = [
  {
    id: 'a1',
    student: 'Ada 1',
    shift: 'morning',
    present: 8,
    project: 7,
    note: '',
  },
  {
    id: 'a2',
    student: 'Grace 2',
    shift: 'morning',
    present: 9,
    project: 6,
    note: '',
  },
  {
    id: 'a3',
    student: 'Alan 3',
    shift: 'morning',
    present: null,
    project: 8,
    note: 'Late enrollment',
  },
  {
    id: 'b1',
    student: 'Linus 4',
    shift: 'evening',
    present: 7,
    project: 9,
    note: '',
  },
  {
    id: 'b2',
    student: 'Guido 5',
    shift: 'evening',
    present: 6,
    project: 6,
    note: '',
  },
];

export const RECORD_GRID_SHOWCASE_BASIC_COLUMNS: readonly SolarisRecordGridColumn<ShowcaseAttendance>[] =
  [
    {
      id: 'student',
      headerKey: 'record-grid.col.student',
      accessor: 'student',
      sortable: true,
    },
    {
      id: 'present',
      headerKey: 'record-grid.col.present',
      accessor: 'present',
      type: 'number',
      align: 'end',
      sortable: true,
    },
    {
      id: 'project',
      headerKey: 'record-grid.col.project',
      accessor: 'project',
      type: 'number',
      align: 'end',
      sortable: true,
    },
    {
      id: 'total',
      headerKey: 'record-grid.col.total',
      type: 'number',
      align: 'end',
      sortable: true,
      computed: { from: ['present', 'project'], by: 'sum' },
    },
  ];

export const RECORD_GRID_SHOWCASE_BASIC_CODE = `<solaris-record-grid
  [data]="rows"
  [columns]="columns"
  rowId="id"
  (recordCommit)="onRecordCommit($event)"
/>`;

export const RECORD_GRID_SHOWCASE_SECTIONS_CODE = `<solaris-record-grid
  [data]="rows"
  [columns]="columns"
  [sections]="sections"
  [sectionOf]="sectionOf"
  rowId="id"
/>`;

export const RECORD_GRID_SHOWCASE_MERGING_CODE = `<solaris-record-grid
  [data]="rows"
  [columns]="mergingColumns"
  rowId="id"
/>`;

export const RECORD_GRID_SHOWCASE_FORMULAS_CODE = `<solaris-record-grid
  [data]="rows"
  [columns]="formulaColumns"
  rowId="id"
/>`;

export const RECORD_GRID_SHOWCASE_EDITING_CODE = `<solaris-record-grid
  [data]="rows"
  [columns]="editingColumns"
  rowId="id"
  (recordCommit)="onRecordCommit($event)"
  (recordsChange)="onRecordsChange($event)"
/>`;

export const RECORD_GRID_SHOWCASE_LAYOUT_CODE = `<solaris-record-grid
  [data]="rows"
  [columns]="columns"
  rowId="id"
  [layout]="layout()"
/>`;

export const RECORD_GRID_SHOWCASE_IMPORT_CODE = `import { SolarisRecordGridComponent } from '@solaris-ui/angular';`;

export { SHOWCASE_INSTALL_COMMANDS as RECORD_GRID_SHOWCASE_INSTALL_COMMANDS } from '../../../../shared/showcase-page-utils';
