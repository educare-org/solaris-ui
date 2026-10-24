import { Component } from '@angular/core';

import {
  SolarisRecordGridComponent,
  type SolarisRecordGridColumn,
} from '@solaris-ui/angular';

import {
  RECORD_GRID_SHOWCASE_BASIC_COLUMNS,
  RECORD_GRID_SHOWCASE_ROWS,
  RECORD_GRID_SHOWCASE_SECTIONS,
  type ShowcaseAttendance,
} from '../../../model/record-grid-showcase.data';

function averageOf(
  rows: readonly ShowcaseAttendance[],
  id: 'present' | 'project',
): string {
  const values = rows
    .map((row) => row[id])
    .filter((value): value is number => value !== null);
  if (values.length === 0) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

@Component({
  standalone: true,
  selector: 'app-sections-record-grid-example',
  imports: [SolarisRecordGridComponent],
  templateUrl: './sections.component.html',
})
export class SectionsRecordGridExample {
  protected readonly sections = RECORD_GRID_SHOWCASE_SECTIONS;
  protected readonly rows = RECORD_GRID_SHOWCASE_ROWS;
  protected readonly columns: readonly SolarisRecordGridColumn<ShowcaseAttendance>[] =
    RECORD_GRID_SHOWCASE_BASIC_COLUMNS.map(
      (
        column: SolarisRecordGridColumn<ShowcaseAttendance>,
      ): SolarisRecordGridColumn<ShowcaseAttendance> =>
        column.id === 'present' || column.id === 'project'
          ? {
              ...column,
              sectionId: 'morning',
              footerValueOf: (rows: readonly ShowcaseAttendance[]) =>
                column.id === 'present'
                  ? averageOf(rows, 'present')
                  : averageOf(rows, 'project'),
            }
          : column,
    );

  protected sectionOf(row: ShowcaseAttendance): string | null {
    return row.shift;
  }
}
