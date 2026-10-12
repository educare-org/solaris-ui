import { Component, inject } from '@angular/core';

import {
  SolarisRecordGridComponent,
  SolarisTranslateService,
  type SolarisRecordGridColumn,
} from '@solaris-ui/angular';

import {
  RECORD_GRID_SHOWCASE_ROWS,
  type ShowcaseAttendance,
} from '../../../model/record-grid-showcase.data';

const ROWS = RECORD_GRID_SHOWCASE_ROWS;

function sectionSize(index: number): number {
  const row = ROWS[index];
  if (row === undefined) {
    return 1;
  }
  let size = 0;
  for (let cursor = index; cursor < ROWS.length; cursor += 1) {
    if (ROWS[cursor]?.shift !== row.shift) {
      break;
    }
    size += 1;
  }
  const previous = ROWS[index - 1];
  return previous !== undefined && previous.shift === row.shift ? 1 : size;
}

@Component({
  standalone: true,
  selector: 'app-merging-record-grid-example',
  imports: [SolarisRecordGridComponent],
  templateUrl: './merging.component.html',
})
export class MergingRecordGridExample {
  private readonly translateService = inject(SolarisTranslateService);

  protected readonly rows = ROWS;
  protected readonly columns: readonly SolarisRecordGridColumn<ShowcaseAttendance>[] =
    [
      {
        id: 'shift',
        headerKey: 'record-grid.col.shift',
        accessor: 'shift',
        displayValueOf: (row) =>
          this.translateService.translate(
            row.shift === 'morning'
              ? 'record-grid.shift.morning'
              : 'record-grid.shift.evening',
          ),
        rowspanOf: (_row, index) => sectionSize(index),
      },
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
        id: 'note',
        headerKey: 'record-grid.col.note',
        accessor: 'note',
        colspanOf: (row) => (row.note.trim() !== '' ? 2 : 1),
      },
      {
        id: 'project',
        headerKey: 'record-grid.col.project',
        accessor: 'project',
        type: 'number',
        align: 'end',
        sortable: true,
      },
    ];
}
